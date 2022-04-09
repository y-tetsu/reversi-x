import { BLACK, WHITE, EMPTY, HOLE, BOARD_SIZE, HEADER_OFFSET, getLegalMoves, putDisc, flipDiscs } from './board.js';
import { HUMAN, X, RECORD, WAIT_HUMAN_MOVE, STOP_PLAY_RECORD, getMove } from './move.js';
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

let lastMove    = -1;
let lastTurn    = -9;
let preLastMove = -1;


export function initGame(turn) {
  countGame = 0;
  reInitGame(turn);
}


export function reInitGame(turn) {
  gameState     = GAME_INIT;
  gameTurn      = turn;
  gameBoard     = [];
  countMove     = 1;
  countPass     = 0;
  scoreBlack    = 0;
  scoreWhite    = 0;
  gameFinalized = false;
  lastMove      = -1;
  lastTurn      = -9;
  preLastMove   = -1;
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
    let preGameTurn = gameTurn;
    gameTurn = getOpponentColor(gameTurn);
    let nextLegalMoves = getLegalMoves(gameTurn, gameBoard);
    if (nextLegalMoves.length > 0) {
      if (getPlayRecordMode() === false) {
        if (preGameTurn === BLACK && playerBlack === HUMAN) {
          alert("Black Pass");
        }
        else if (preGameTurn === WHITE && playerWhite === HUMAN) {
          alert("White Pass");
        }
      }
    }
    else {
      countPass++;
    }
    if (countPass === 2) {
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
      const gameTurnPass = gameTurn;
      gameTurn = getOpponentColor(gameTurn);
      let nextLegalMoves = getLegalMoves(gameTurn, gameBoard);
      if (nextLegalMoves.length <= 0) {
        countPass++;
      }

      // check pass
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
    if (scoreBlack === countPerfect) {
      winner = 'Black Perfect Win!!!';
    }
    else {
      winner = 'Black Win!';
    }
  }
  else if (scoreWhite > scoreBlack) {
    if (scoreWhite === countPerfect) {
      winner = 'White Perfect Win!!!';
    }
    else {
      winner = 'White Win!';
    }
  }
  return winner;
}


export function getPerfectScore(board) {
  let count = BOARD_SIZE * BOARD_SIZE;
  for (let y = 0; y < BOARD_SIZE; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      let index = ((y + HEADER_OFFSET) * (BOARD_SIZE + (HEADER_OFFSET * 2))) + x + HEADER_OFFSET;
      if (board[index] === HOLE) {
        count--;
      }
    }
  }
  return count;
}


export function actMove(turn, board, index) {
  let discsFlipped = flipDiscs(turn, board, index);
  let canPut = putDisc(turn, board, index);

  // put disc animation
  canPut.forEach(function(index) {
    putDiscOnUiBoard(turn, index);
    putScore(turn);
  });

  // flip disc animation
  if (playerBlack === HUMAN || playerWhite === HUMAN || getPlayRecordMode() === true) {
    setTimeout(() => flipDiscAnimation(discsFlipped, turn, index), UI_WAIT_FLIP_DISC);
  }
  else {
    flipDiscAnimation(discsFlipped, turn, index);
  }

  preLastMove = lastMove;
  lastMove    = index;
  lastTurn    = turn;

  countMove++;
}


function flipDiscAnimation(discsFlipped, turn, index) {
  discsFlipped.forEach(function(index) {
    putDiscOnUiBoard(turn, index);
    flipScore(turn);
  });
}


function putScore(color) {
  if (color === BLACK) {
    scoreBlack++;
  }
  else if (color === WHITE) {
    scoreWhite++;
  }
}


function flipScore(color) {
  if (color === BLACK) {
    scoreBlack++;
    scoreWhite--;
  }
  else if (color === WHITE) {
    scoreWhite++;
    scoreBlack--;
  }
}


export function getOpponentColor(color) {
  if (color === BLACK) return WHITE;
  return BLACK;
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
