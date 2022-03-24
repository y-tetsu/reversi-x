import {
  actMove,
  setCountMove,
  getCountMove,
  getOpponentColor,
  getPerfectScore,
  finalizeGame,
  setCountPass,
  getCountPass,
  setGameBoard,
  getGameBoard,
  setGameTurn,
  getGameTurn,
  setGameState,
  getGameState,
  setCountGame,
  getCountGame,
  setScoreBlack,
  getScoreBlack,
  setScoreWhite,
  getScoreWhite,
  playGame,
  GAME_PLAY,
  GAME_END,
} from '../game.js';
import { putDisc, flipDiscs, BLACK, WHITE, HOLE, EMPTY } from '../board.js';
import { setJestEnabledTrue } from '../jest.js';


// document object access disabled
setJestEnabledTrue();


const iniBoard = [
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, WHITE, BLACK, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, BLACK, WHITE, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
];


const perfectBoard = [
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  BLACK, BLACK, HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  BLACK, BLACK, HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
];


describe('actMove', () => {
  it('should put and flip discs if initial board by black at 43.', () => {
    // setup
    let turn = BLACK;
    let board = iniBoard.slice(0, iniBoard.length);
    let move = 43
    setCountMove(0);
    setScoreBlack(2);
    setScoreWhite(2);
    expect(board[move]).toBe(EMPTY);
    expect(board[move+1]).toBe(WHITE);

    // do
    actMove(BLACK, board, move);

    // check
    expect(getScoreBlack()).toBe(4);
    expect(getScoreWhite()).toBe(1);
    expect(board[move]).toBe(BLACK);
    expect(board[move+1]).toBe(BLACK);
    expect(getCountMove()).toBe(1);
  });

  it('can not put and flip discs if initial board by black at 44.', () => {
    // setup
    let turn = BLACK;
    let board = iniBoard.slice(0, iniBoard.length);
    let move = 44
    setCountMove(0);
    setScoreBlack(2);
    setScoreWhite(2);
    expect(board[move]).toBe(WHITE);

    // do
    actMove(BLACK, board, move);

    // check
    expect(getScoreBlack()).toBe(2);
    expect(getScoreWhite()).toBe(2);
    expect(board[move]).toBe(WHITE);
    expect(getCountMove()).toBe(1);
  });
});


describe('getOpponentColor', () => {
  it('should return WHITE if turn is BLACK.', () => {
    expect(getOpponentColor(BLACK)).toBe(WHITE);
  });

  it('should return BLACK if turn is WHITE.', () => {
    expect(getOpponentColor(WHITE)).toBe(BLACK);
  });
});


describe('finalizeGame', () => {
  it('should Draw if finalizeGame at iniBoard.', () => {
    setCountGame(0);
    setGameTurn(BLACK);
    setScoreBlack(2);
    setScoreWhite(2);

    let board = iniBoard.slice(0, iniBoard.length);
    finalizeGame(board)

    expect(getGameTurn()).toBe("Draw");
    expect(getCountGame()).toBe(1);
  });

  it('should Black Win if finalizeGame at BlackScore > WhiteScore.', () => {
    setCountGame(0);
    setGameTurn(BLACK);
    setScoreBlack(2);
    setScoreWhite(2);

    let board = iniBoard.slice(0, iniBoard.length);
    let move = 43;
    actMove(BLACK, board, move);
    finalizeGame(board)

    expect(getGameTurn()).toBe("Black Win!");
    expect(getCountGame()).toBe(1);
  });

  it('should White Win if finalizeGame at BlackScore < WhiteScore.', () => {
    setCountGame(0);
    setGameTurn(BLACK);
    setScoreBlack(2);
    setScoreWhite(2);

    let board = iniBoard.slice(0, iniBoard.length);
    let move = 35;
    actMove(WHITE, board, move);
    finalizeGame(board)

    expect(getGameTurn()).toBe("White Win!");
    expect(getCountGame()).toBe(1);
  });

  it('should Black Perfect Win if finalizeGame at BlackScore is Perfect.', () => {
    setCountGame(0);
    setGameTurn(BLACK);
    setScoreBlack(4);
    setScoreWhite(0);

    let board = perfectBoard.slice(0, perfectBoard.length);
    finalizeGame(board)

    expect(getGameTurn()).toBe("Black Perfect Win!!!");
    expect(getCountGame()).toBe(1);
  });

  it('should Foul if finalizeGame at iniBoard for illegal by black.', () => {
    setCountGame(0);
    setGameTurn("* Black Foul *");
    setScoreBlack(2);
    setScoreWhite(2);

    let board = iniBoard.slice(0, iniBoard.length);
    finalizeGame(board)

    expect(getGameTurn()).toBe("* Black Foul *");
    expect(getCountGame()).toBe(1);
  });

  it('should Foul if finalizeGame at iniBoard for illegal by white.', () => {
    setCountGame(0);
    setGameTurn("* White Foul *");
    setScoreBlack(2);
    setScoreWhite(2);

    let board = iniBoard.slice(0, iniBoard.length);
    finalizeGame(board)

    expect(getGameTurn()).toBe("* White Foul *");
    expect(getCountGame()).toBe(1);
  });
});


describe('getPerfectScore', () => {
  it('should 4 if perfectBord.', () => {
    let board = perfectBoard.slice(0, perfectBoard.length);
    expect(getPerfectScore(board)).toBe(4);
  });
});


describe('playGame', () => {
  it('should finalizeGame if gameState is GAME_END.', () => {
    setGameState(GAME_END);
    setGameTurn(BLACK);
    setCountGame(0);
    setScoreBlack(2);
    setScoreWhite(2);
    setGameBoard(iniBoard.slice(0, iniBoard.length));

    expect(playGame()).toBe(false);
    expect(getGameTurn()).toBe("Draw");
    expect(getCountGame()).toBe(1);
  });

  it('should do nothing if gameState is not GAME_PLAY.', () => {
    setGameState("Unknown state");
    setGameBoard(iniBoard.slice(0, iniBoard.length));
    expect(playGame()).toBe(false);
  });

  it('should pass if not exists legal moves.', () => {
    setGameState(GAME_PLAY);
    setGameTurn(BLACK);
    setCountPass(0);
    setCountGame(0);
    setScoreBlack(4);
    setScoreWhite(0);
    setGameBoard(perfectBoard.slice(0, perfectBoard.length));

    // 1st pass
    expect(playGame()).toBe(true);
    expect(getGameState()).toBe(GAME_PLAY);
    expect(getGameTurn()).toBe(WHITE);
    expect(getCountPass()).toBe(1);
    expect(getCountGame()).toBe(0);

    // 2nd pass
    expect(playGame()).toBe(true);
    expect(getGameState()).toBe(GAME_END);
    expect(getGameTurn()).toBe(BLACK);
    expect(getCountPass()).toBe(2);
    expect(getCountGame()).toBe(0);

    // finalize
    expect(playGame()).toBe(false);
    expect(getGameState()).toBe(GAME_END);
    expect(getGameTurn()).toBe("Black Perfect Win!!!");
    expect(getCountPass()).toBe(2);
    expect(getCountGame()).toBe(1);
  });
});
