import { getLegalMoves } from './board.js';
import { getHumanClick, setHumanClickFalse, getHumanMove, getRecordMove } from './ui.js';


export const WAIT_HUMAN_MOVE = -1;
export const STOP_PLAY_RECORD = -2;
export const UNKNOWN_MOVE = -9;

export const HUMAN = 'human';
export const X = 'x';
export const RANDOM = 'random';
export const RECORD = 'record';


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
    case RECORD:
      move = moveByRecord(color, board);
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


function moveByRecord(color, board) {
  return getRecordMove();
}
