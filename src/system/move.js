import { getLegalMoves } from './board.js';
import { getHumanClick, setHumanClickFalse, getHumanMove } from './ui.js';


export const WAIT_HUMAN_MOVE = -1;
export const UNKNOWN_MOVE = -2;

export const HUMAN = 'human';
export const X = 'x';
export const RANDOM = 'random';


export function getMove(color, board, player) {
  let move = UNKNOWN_MOVE;
  switch (player) {
    case HUMAN:
      move = moveByHuman();
      break;
    case X:
      move = moveByX(color, board);
      break;
    case RANDOM:
      move = moveByRandom(color, board);
      break;
    default:
      break;
  }
  return move;
}


export function moveByHuman() {
  if (getHumanClick() !== true) return WAIT_HUMAN_MOVE;
  setHumanClickFalse();
  return getHumanMove();
}


export function moveByX(color, board) {
  return getLegalMoves(color, board)[0];
}


export function moveByRandom(color, board) {
  const legalMoves = getLegalMoves(color, board);
  const randomMove = Math.floor(Math.random() * (legalMoves.length));
  return legalMoves[randomMove];
}
