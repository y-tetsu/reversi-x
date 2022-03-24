import { BLACK, WHITE, HOLE, EMPTY, getLegalMoves } from '../board.js';
import { WAIT_HUMAN_MOVE, UNKNOWN_MOVE, HUMAN, X, RANDOM, getMove, moveByHuman, moveByX, moveByRandom } from '../move.js';
import { setHumanClickTrue, setHumanClickFalse, getHumanClick, setHumanMove, getHumanMove } from '../ui.js';


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


describe('getMove', () => {
  it('should return UNKNOWN_MOVE if unknown player.', () => {
    setHumanMove(45);
    setHumanClickTrue();
    expect(getMove(BLACK, iniBoard, 'unknown')).toBe(UNKNOWN_MOVE);
  });

  it('should return move of x if player-x.', () => {
    setHumanMove(45);
    setHumanClickTrue();
    expect(getMove(BLACK, iniBoard, X)).toBe(34);
  });

  it('should return move of human if player-human.', () => {
    setHumanMove(45);
    setHumanClickTrue();
    expect(getMove(BLACK, iniBoard, HUMAN)).toBe(45);
  });

  it('should return move of random if player-random', () => {
    setHumanMove(45);
    setHumanClickTrue();
    const move = getMove(BLACK, iniBoard, RANDOM);
    expect(getLegalMoves(BLACK, iniBoard)).toContain(move);
  });
});


describe('moveByHuman', () => {
  it('should return WAIT_HUMAN_MOVE if not clicked.', () => {
    let move = 45
    setHumanMove(move);
    setHumanClickFalse();
    expect(moveByHuman()).toBe(WAIT_HUMAN_MOVE);
  });

  it('should return humanMove if clicked.', () => {
    let move = 45
    setHumanMove(move);
    setHumanClickTrue();
    expect(moveByHuman()).toBe(move);
  });
});


describe('moveByX', () => {
  it('should return 34 at initial board by black', () => {
    expect(moveByX(BLACK, iniBoard)).toBe(34);
  });

  it('should return 35 at initial white by black', () => {
    expect(moveByX(WHITE, iniBoard)).toBe(35);
  });
});


describe('moveByRandom', () => {
  it('should return any move at initial board by black', () => {
    const move = moveByRandom(BLACK, iniBoard);
    expect(getLegalMoves(BLACK, iniBoard)).toContain(move);
  });

  it('should return any move at initial board by white', () => {
    const move = moveByRandom(WHITE, iniBoard);
    expect(getLegalMoves(WHITE, iniBoard)).toContain(move);
  });
});
