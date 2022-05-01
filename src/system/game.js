import { BLACK, WHITE, GREEN, ASH, EMPTY, HOLE, boardSize, HEADER_OFFSET, getLegalMoves, putDisc, flipDiscs } from './board.js';
import { HUMAN, X, RANDOM, RECORD, WAIT_HUMAN_MOVE, STOP_PLAY_RECORD, getMove } from './move.js';
import { UI_WAIT_TIME_LONG, UI_WAIT_FLIP_DISC, putDiscOnUiBoard, updateUi, getPlayRecordMode } from './ui.js';

export const GAME_INIT = 0;
export const GAME_PLAY = 1;
export const GAME_STOP = 2;
export const GAME_END  = 3;

let gameState  = GAME_INIT;
let gameTurn   = BLACK;
let gameBoard  = [];
let gameRecord = "";
let gameFinalized = false;

let countGame = 0;
let countMove = 1;
let countPass = 0;

let scoreBlack = 0;
let scoreWhite = 0;

let playerBlack = HUMAN;
let playerWhite = X;
let playerAsh   = RANDOM;

let hasAsh = false;

let lastMove    = -1;
let lastTurn    = -9;
let preLastMove = -1;

let scoreType = 0;

let gameEndPassCount = 2;

let whiteFirst = false;


export function initGame(score, turn) {
  countGame = 0;
  reInitGame(score, turn);
}


export function reInitGame(score, turn) {
  gameState     = GAME_INIT;
  gameTurn      = turn;
  gameBoard     = [];
  countMove     = 1;
  countPass     = 0;
  scoreType     = score;
  scoreBlack    = 0;
  scoreWhite    = 0;
  gameFinalized = false;
  hasAsh        = false;
  lastMove      = -1;
  lastTurn      = -9;
  preLastMove   = -1;
  if (gameTurn === WHITE) {
    whiteFirst = true;
  }
  else {
    whiteFirst = false;
  }
}


export function playGame() {
  switch (gameState) {
    case GAME_INIT:
      return false;
    case GAME_PLAY:
      break;
    case GAME_END:
      finalizeGame(gameBoard);
      updateUi();
      return false;
    default:
      return false;
  }

  let legalMoves = getLegalMoves(gameTurn, gameBoard);
  // for initila board check
  if (legalMoves.length <= 0) {
    countPass++;
    lastTurn = EMPTY;
    const gameTurnPass = gameTurn;
    gameTurn = getOpponentColor(gameTurn);
    let nextLegalMoves = getLegalMoves(gameTurn, gameBoard);
    if (nextLegalMoves.length > 0) {
      if (getPlayRecordMode() === false) {
        if (gameTurnPass === BLACK && playerBlack === HUMAN) {
          alert("Black Pass");
        }
        else if (gameTurnPass === WHITE && playerWhite === HUMAN) {
          alert("White Pass");
        }
      }
    }
    else {
      countPass++;
      if (hasAsh !== false) {
        const gameTurnPass = gameTurn;
        gameTurn = getOpponentColor(gameTurn);
        let nextLegalMoves = getLegalMoves(gameTurn, gameBoard);
        if (nextLegalMoves.length > 0) {
          if (getPlayRecordMode() === false) {
            if (gameTurnPass === BLACK && (playerBlack === HUMAN || playerWhite === HUMAN)) {
              alert("White and Black Pass");
            }
            else if (gameTurnPass === WHITE && (playerBlack === HUMAN || playerWhite === HUMAN)) {
              alert("Black and White Pass");
            }
          }
        }
        else {
          countPass++;
        }
      }
    }
    if (countPass === gameEndPassCount) {
      gameEnd();
      return false;
    }
  }
  else {
    countPass = 0;
    let player = playerBlack;
    if (gameTurn === WHITE) {
      player = playerWhite;
    }
    else if (gameTurn === ASH) {
      player = playerAsh;
    }

    if (getPlayRecordMode() === true) {
      player = RECORD;
    }

    const move = getMove(gameTurn, gameBoard, player);

    if (move === WAIT_HUMAN_MOVE) {
      return false;
    }

    if (move === STOP_PLAY_RECORD) {
      alert('Stop Play Record');
      gameState = GAME_STOP;
      return true;
    }

    actMove(gameTurn, gameBoard, move);
    gameTurn = getOpponentColor(gameTurn);

    // move is foul
    if (legalMoves.includes(move) !== true) {
      gameTurn = "* Black Foul *";
      if (gameTurn === WHITE) {
        gameTurn = "* White Foul *";
      }
      alert(gameTurn);

      setTimeout(() => gameEnd(), UI_WAIT_TIME_LONG);
      return false;
    }

    // check game pass and end
    legalMoves = getLegalMoves(gameTurn, gameBoard);
    if (legalMoves.length <= 0) {
      countPass++;
      let gameTurnPass = gameTurn;
      gameTurn = getOpponentColor(gameTurn);
      let nextLegalMoves = getLegalMoves(gameTurn, gameBoard);
      if (nextLegalMoves.length <= 0) {
        countPass++;
        if (hasAsh !== false) {
          gameTurnPass = gameTurn;
          gameTurn = getOpponentColor(gameTurn);
          let nextLegalMoves = getLegalMoves(gameTurn, gameBoard);
          if (nextLegalMoves.length <= 0) {
            countPass++;
          }
        }
      }

      // check pass
      if (hasAsh === false) {
        if (countPass === 1) {
          if (getPlayRecordMode() === false) {
            if (gameTurnPass === BLACK && playerBlack === HUMAN) {
              setTimeout(() => alert("Black Pass"), UI_WAIT_TIME_LONG);
              return true;
            }
            else if (gameTurnPass === WHITE && playerWhite === HUMAN) {
              setTimeout(() => alert("White Pass"), UI_WAIT_TIME_LONG);
              return true;
            }
            else if (gameTurnPass === BLACK && playerWhite === HUMAN) {
              setTimeout(() => alert("Black Pass"), UI_WAIT_TIME_LONG);
              updateUi();
              return false;
            }
            else if (gameTurnPass === WHITE && playerBlack === HUMAN) {
              setTimeout(() => alert("White Pass"), UI_WAIT_TIME_LONG);
              updateUi();
              return false;
            }
          }
        }
        // check end
        else {
          countMove--;
          updateUi();
          if (playerBlack === HUMAN || playerWhite === HUMAN || getPlayRecordMode() === true) {
            setTimeout(() => gameEnd(), UI_WAIT_TIME_LONG);
          }
          else {
            gameEnd();
          }
          return false;
        }
      }
      else {
        if (countPass === 1) {
          if (getPlayRecordMode() === false) {
            if (gameTurnPass === BLACK && playerBlack === HUMAN) {
              setTimeout(() => alert("Black Pass"), UI_WAIT_TIME_LONG);
              return true;
            }
            else if (gameTurnPass === WHITE && playerWhite === HUMAN) {
              setTimeout(() => alert("White Pass"), UI_WAIT_TIME_LONG);
              return true;
            }
            else if (gameTurnPass === BLACK && playerWhite === HUMAN && whiteFirst === false) {
              setTimeout(() => alert("Black Pass"), UI_WAIT_TIME_LONG);
              updateUi();
              return false;
            }
            else if (gameTurnPass === WHITE && playerBlack === HUMAN && whiteFirst === true) {
              setTimeout(() => alert("White Pass"), UI_WAIT_TIME_LONG);
              updateUi();
              return false;
            }
            else if (gameTurnPass === ASH && playerBlack === HUMAN && whiteFirst === false) {
              updateUi();
              return false;
            }
            else if (gameTurnPass === ASH && playerWhite === HUMAN && whiteFirst === true) {
              updateUi();
              return false;
            }
          }
        }
        else if (countPass === 2) {
          if (getPlayRecordMode() === false) {
            if (whiteFirst === false) {
              if (gameTurnPass === BLACK && playerBlack === HUMAN) {
                setTimeout(() => alert("Ash and Black Pass"), UI_WAIT_TIME_LONG);
                return true;
              }
              else if (gameTurnPass === BLACK && playerWhite === HUMAN) {
                setTimeout(() => alert("Ash and Black Pass"), UI_WAIT_TIME_LONG);
                return false;
              }
              else if (gameTurnPass === WHITE && (playerBlack === HUMAN || playerWhite === HUMAN)) {
                setTimeout(() => alert("Black and White Pass"), UI_WAIT_TIME_LONG);
                return true;
              }
              else if (gameTurnPass === ASH && playerBlack === HUMAN) {
                setTimeout(() => alert("White and Ash Pass"), UI_WAIT_TIME_LONG);
                return false;
              }
              else if (gameTurnPass === ASH && playerWhite === HUMAN) {
                setTimeout(() => alert("White and Ash Pass"), UI_WAIT_TIME_LONG);
                updateUi();
                return true;
              }
            }
            else {
              if (gameTurnPass === WHITE && playerBlack === HUMAN) {
                setTimeout(() => alert("Ash and White Pass"), UI_WAIT_TIME_LONG);
                return true;
              }
              else if (gameTurnPass === WHITE && playerWhite === HUMAN) {
                setTimeout(() => alert("Ash and White Pass"), UI_WAIT_TIME_LONG);
                return false;
              }
              else if (gameTurnPass === BLACK && (playerBlack === HUMAN || playerWhite === HUMAN)) {
                setTimeout(() => alert("White and Black Pass"), UI_WAIT_TIME_LONG);
                return true;
              }
              else if (gameTurnPass === ASH && playerBlack === HUMAN) {
                setTimeout(() => alert("Black and Ash Pass"), UI_WAIT_TIME_LONG);
                return true;
              }
              else if (gameTurnPass === ASH && playerWhite === HUMAN) {
                setTimeout(() => alert("Black and Ash Pass"), UI_WAIT_TIME_LONG);
                updateUi();
                return false;
              }
            }
          }
        }
        // check end
        else {
          countMove--;
          updateUi();
          if (playerBlack === HUMAN || playerWhite === HUMAN || getPlayRecordMode() === true) {
            setTimeout(() => gameEnd(), UI_WAIT_TIME_LONG);
          }
          else {
            gameEnd();
          }
          return false;
        }
      }
    }
  }
  return true;
}


function gameEnd() {
  gameState = GAME_END;
  finalizeGame(gameBoard);
  updateUi();
}


export function finalizeGame(board) {
  if (gameTurn !== "* Black Foul *" && gameTurn !== "* White Foul *") {
    gameTurn = getWinner(board);
  }
  countGame++;
  countMove = 'End';
  gameFinalized = true;
}


function getWinner(board) {
  let winner = 'Draw';
  let countPerfect = getPerfectScore(board);
  if (scoreBlack > scoreWhite) {
    if ((scoreType === 0 && scoreBlack === countPerfect) || (scoreType === 1 && scoreWhite === countPerfect)) {
      winner = 'Black Perfect Win!!!';
    }
    else {
      winner = 'Black Win!';
    }
  }
  else if (scoreWhite > scoreBlack) {
    if ((scoreType === 0 && scoreWhite === countPerfect) || (scoreType === 1 && scoreBlack === countPerfect)) {
      winner = 'White Perfect Win!!!';
    }
    else {
      winner = 'White Win!';
    }
  }
  return winner;
}


export function getPerfectScore(board) {
  let count = boardSize * boardSize;
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let index = ((y + HEADER_OFFSET) * (boardSize + (HEADER_OFFSET * 2))) + x + HEADER_OFFSET;
      if (board[index] === HOLE || board[index] === GREEN) {
        count--;
      }
    }
  }
  if (scoreType === 1) {
    return -count;
  }
  return count;
}


export function actMove(turn, board, index) {
  let discsFlipped = flipDiscs(turn, board, index);
  let canPut = putDisc(turn, board, index);

  // put disc animation
  canPut.forEach(function(index) {
    putDiscOnUiBoard(turn, index);
  });

  // flip disc animation
  if (playerBlack === HUMAN || playerWhite === HUMAN || getPlayRecordMode() === true) {
    setTimeout(() => flipDiscAnimation(discsFlipped, turn, index), UI_WAIT_FLIP_DISC);
  }
  else {
    flipDiscAnimation(discsFlipped, turn, index);
  }

  updateScore(board);

  preLastMove = lastMove;
  lastMove    = index;
  lastTurn    = turn;

  countMove++;
}


function flipDiscAnimation(discsFlipped, turn, index) {
  discsFlipped.forEach(function(index) {
    putDiscOnUiBoard(turn, index);
  });
}


export function putScore(color) {
  if(scoreType === 0) {
    if (color === BLACK) {
      scoreBlack++;
    }
    else if (color === WHITE) {
      scoreWhite++;
    }
  }
  else {
    if (color === BLACK) {
      scoreBlack--;
    }
    else if (color === WHITE) {
      scoreWhite--;
    }
  }
}


function updateScore(board) {
  let scoreB = 0;
  let scoreW = 0;
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      let index = ((y + HEADER_OFFSET) * (boardSize + (HEADER_OFFSET * 2))) + x + HEADER_OFFSET;
      if (board[index] === BLACK) {
        scoreB++;
      }
      else if (board[index] === WHITE) {
        scoreW++;
      }
    }
  }
  if(scoreType !== 0) {
    scoreB *= -1;
    scoreW *= -1;
  }
  scoreBlack = scoreB;
  scoreWhite = scoreW;
}


export function getOpponentColor(color) {
  if (whiteFirst === false) {
    if (color === BLACK) return WHITE;
    if (hasAsh === true) {
      if (color === WHITE) return ASH;
    }
    return BLACK;
  }
  else {
    if (color === WHITE) return BLACK;
    if (hasAsh === true) {
      if (color === BLACK) return ASH;
    }
    return WHITE;
  }
}


export function getOpponentColors(color) {
  if (color === BLACK) return [WHITE, ASH, GREEN];
  if (color === WHITE) return [BLACK, ASH, GREEN];
  return [BLACK, WHITE, GREEN];
}


export function setGameBoard(board) {
  gameBoard = board;
}


export function getGameBoard() {
  return gameBoard;
}


export function setGameTurn(turn) {
  gameTurn = turn;
}


export function getGameTurn() {
  return gameTurn;
}


export function setGameState(state) {
  gameState = state;
}


export function getGameState() {
  return gameState;
}


export function setCountGame(count) {
  countGame = count;
}


export function getCountGame() {
  return countGame;
}


export function setCountMove(count) {
  countMove = count;
}


export function getCountMove() {
  return countMove;
}


export function setCountPass(count) {
  countPass = count;
}


export function getCountPass() {
  return countPass;
}


export function setScoreBlack(score) {
  scoreBlack = score;
}


export function getScoreBlack() {
  return scoreBlack;
}


export function setScoreWhite(score) {
  scoreWhite = score;
}


export function getScoreWhite() {
  return scoreWhite;
}


export function setPlayerBlack(player) {
  playerBlack = player;
}


export function getPlayerBlack() {
  return playerBlack;
}


export function setPlayerWhite(player) {
  playerWhite = player;
}


export function getPlayerWhite() {
  return playerWhite;
}


export function getGameFinalized() {
  return gameFinalized;
}


export function getLastMove() {
  return lastMove;
}


export function getLastTurn() {
  return lastTurn;
}


export function getPreLastMove() {
  return preLastMove;
}


export function setGameFinalized(value) {
  gameFinalized = value;
}

export function setHasAsh(value) {
  hasAsh = value;
  gameEndPassCount = 3;
}
