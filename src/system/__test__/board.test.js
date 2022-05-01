import { BLACK, WHITE, GREEN, ASH, HOLE, EMPTY, GREEN_ONLY, getFlippablesAtIndex, flipDiscs, putDisc, getLegalMoves } from '../board.js';


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

const direc8Board = [
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, BLACK, WHITE, WHITE, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
];

const testBoard = [
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, EMPTY, EMPTY, WHITE, EMPTY, WHITE, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, EMPTY, EMPTY, WHITE, WHITE, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, EMPTY, EMPTY, BLACK, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, EMPTY, HOLE,
  HOLE, EMPTY, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, HOLE,
  HOLE, BLACK, EMPTY, BLACK, BLACK, BLACK, BLACK, BLACK, BLACK, HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
];

const testBoardGreen1 = [
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, GREEN, BLACK, BLACK, BLACK, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, BLACK, GREEN, WHITE, GREEN, EMPTY, GREEN, GREEN, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, WHITE, GREEN, EMPTY, GREEN, GREEN, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, GREEN, WHITE, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, GREEN, WHITE, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, WHITE, GREEN, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, GREEN, WHITE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
];

const testBoardAsh1 = [
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
  HOLE, ASH,   BLACK, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, BLACK, ASH,   EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, ASH,   GREEN, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, WHITE, ASH,   EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, ASH,   WHITE, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, EMPTY, HOLE,
  HOLE, HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,  HOLE,
];


describe('getFlippablesAtIndex', () => {
  it('should flippable for black at initial board on 43', () => {
    expect(getFlippablesAtIndex(BLACK, iniBoard, 43)).toEqual([44]);
  });

  it('should flippable for black at initial board on 34', () => {
    expect(getFlippablesAtIndex(BLACK, iniBoard, 34)).toEqual([44]);
  });

  it('should flippable for black at initial board on 65', () => {
    expect(getFlippablesAtIndex(BLACK, iniBoard, 65)).toEqual([55]);
  });

  it('should flippable for black at initial board on 56', () => {
    expect(getFlippablesAtIndex(BLACK, iniBoard, 56)).toEqual([55]);
  });

  it('should flippable for white at initial board on 64', () => {
    expect(getFlippablesAtIndex(WHITE, iniBoard, 64)).toEqual([54]);
  });

  it('should no flippable for white at initial board on 65', () => {
    expect(getFlippablesAtIndex(WHITE, iniBoard, 65)).toEqual([]);
  });

  it('should flippable for black at 8-direction on 21', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 21)).toEqual([32, 43]);
  });

  it('should flippable for black at 8-direction on 24', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 24)).toEqual([34, 44]);
  });

  it('should flippable for black at 8-direction on 27', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 27)).toEqual([36, 45]);
  });

  it('should flippable for black at 8-direction on 51', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 51)).toEqual([52, 53]);
  });

  it('should flippable for black at 8-direction on 57', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 57)).toEqual([56, 55]);
  });

  it('should flippable for black at 8-direction on 81', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 81)).toEqual([72, 63]);
  });

  it('should flippable for black at 8-direction on 84', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 84)).toEqual([74, 64]);
  });

  it('should flippable for black at 8-direction on 87', () => {
    expect(getFlippablesAtIndex(BLACK, direc8Board, 87)).toEqual([76, 65]);
  });

  it('should flippable for black at test on 11', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 11)).toEqual([22, 33, 44, 55, 66, 77]);
  });

  it('should flippable for black at test on 13', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 13)).toEqual([23, 33, 43, 53, 63, 73]);
  });

  it('should flippable for black at test on 15', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 15)).toEqual([26, 37]);
  });

  it('should flippable for black at test on 18', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 18)).toEqual([28, 38]);
  });

  it('should flippable for black at test on 21', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 21)).toEqual([32, 43, 54, 65, 76]);
  });

  it('should flippable for black at test on 24', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 24)).toEqual([34, 44, 54, 64, 74]);
  });

  it('should flippable for black at test on 31', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 31)).toEqual([42, 53, 64, 75]);
  });

  it('should flippable for black at test on 35', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 35)).toEqual([45, 55, 65, 75]);
  });

  it('should flippable for black at test on 36', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 36)).toEqual([45, 54, 63, 72]);
  });

  it('should flippable for black at test on 41', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 41)).toEqual([52, 63, 74]);
  });

  it('should flippable for black at test on 46', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 46)).toEqual([56, 66, 76]);
  });

  it('should flippable for black at test on 47', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 47)).toEqual([56, 65, 74]);
  });

  it('should flippable for black at test on 51', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 51)).toEqual([62, 73]);
  });

  it('should flippable for black at test on 57', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 57)).toEqual([66, 75, 67, 77]);
  });

  it('should flippable for black at test on 58', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 58)).toEqual([67, 76]);
  })

  it('should flippable for black at test on 61', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 61)).toEqual([72]);
  });

  it('should flippable for black at test on 68', () => {
    expect(getFlippablesAtIndex(BLACK, testBoard, 68)).toEqual([77, 78]);
  });

  it('should flippable for black at test on 31', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 31)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 32', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 32)).toEqual([23, 33]);
  });

  it('should flippable for black at test on 61', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 61)).toEqual([71]);
  });

  it('should flippable for black at test on 62', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 62)).toEqual([]);
  });

  it('should flippable for black at test on 64', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 63)).toEqual([33, 23]);
  });

  it('should flippable for black at test on 65', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 64)).toEqual([54, 44]);
  });

  it('should flippable for black at test on 15', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 15)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 16', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 16)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 17', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 17)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 18', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 18)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 25', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 25)).toEqual([23]);
  });

  it('should flippable for black at test on 28', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 28)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 35', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 35)).toEqual([44]);
  });

  it('should flippable for black at test on 38', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 38)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 45', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 45)).toEqual([23, 44]);
  });

  it('should flippable for black at test on 46', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 46)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 47', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 47)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for black at test on 48', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardGreen1, 48)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for ash at test on 31', () => {
    expect(getFlippablesAtIndex(ASH, testBoardAsh1, 31)).toEqual([21]);
  });

  it('should flippable for ash at test on 53', () => {
    expect(getFlippablesAtIndex(ASH, testBoardAsh1, 53)).toEqual([GREEN_ONLY]);
  });

  it('should flippable for ash at test on 61', () => {
    expect(getFlippablesAtIndex(ASH, testBoardAsh1, 61)).toEqual([71]);
  });

  it('should flippable for black at test on 32', () => {
    expect(getFlippablesAtIndex(BLACK, testBoardAsh1, 32)).toEqual([22]);
  });

  it('should flippable for ash at test on 62', () => {
    expect(getFlippablesAtIndex(WHITE, testBoardAsh1, 62)).toEqual([72]);
  });
});


describe('flipDiscs', () => {
  it('should flip discs for black at initial board on 43', () => {
    let board = iniBoard.slice(0, iniBoard.length);
    expect(board[44]).toBe(WHITE);
    let discs = flipDiscs(BLACK, board, 43);
    expect(discs).toEqual([44]);
    expect(board[44]).toBe(BLACK);
  });
});


describe('putDisc', () => {
  it('should put disc for black at initial board on 43', () => {
    let board = iniBoard.slice(0, iniBoard.length);
    let idx = 43
    expect(board[idx]).toBe(EMPTY);
    let disc = putDisc(BLACK, board, idx);
    expect(disc).toEqual([idx]);
    expect(board[idx]).toBe(BLACK);
  });

  it('can not put disc for black at initial board on 44', () => {
    let board = iniBoard.slice(0, iniBoard.length);
    let idx = 44
    expect(board[idx]).toBe(WHITE);
    let disc = putDisc(BLACK, board, idx);
    expect(disc).toEqual([]);
    expect(board[idx]).toBe(WHITE);
  });
});


describe('getLegalMoves', () => {
  it('should legal_moves for black at initial board', () => {
    expect(getLegalMoves(BLACK, iniBoard)).toEqual([34, 43, 56, 65]);
  });

  it('should legal_moves for white at initial board', () => {
    expect(getLegalMoves(WHITE, iniBoard)).toEqual([35, 46, 53, 64]);
  });
});
