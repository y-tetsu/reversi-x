import { boardConf } from '../conf/board_conf.js'
import { getBoardName } from './ui.js';
import { getOpponentColor } from './game.js';


export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = -1;
export const HOLE  = 2;

export const BOARD_TABLE_SIZE = 10;
export const BOARD_SIZE       =  8;
export const HEADER_OFFSET    =  1;

const DIRECTION            = [-11, -10, -9, -1, 1, 9, 10, 11];
const ALL_DIRECTIONS_NUM   =  8;

const MAX_RANDOM_TOTAL_CNT = 10;  // max random hole is upto this value
const MAX_RANDOM_COL_CNT   =  2;  // max random hole per columun upto this value
const RANDOM_HOLE_RATE     = 20;  // (%)

const RANDOM_BOARD_NAME = "Random";
export const CHAOS_BOARD_NAME = "Chaos";


export function getBoardIndex(x, y, part) {
  let xIndex = x + HEADER_OFFSET
  let yIndex = (y + HEADER_OFFSET) * BOARD_TABLE_SIZE
  let pIndex = part * (BOARD_TABLE_SIZE * (BOARD_SIZE / 2));
  return xIndex + yIndex + pIndex
}


export function initBoard(board, hole, initBlack, initWhite) {
  // initialyze
  for (let y = 0; y < BOARD_TABLE_SIZE; y++) {
    for (let x = 0; x < BOARD_TABLE_SIZE; x++) {
      let index = (y * BOARD_TABLE_SIZE) + x;
      board[index] = EMPTY;
    }
  }

  // setup initial disc
  if (getBoardName() === CHAOS_BOARD_NAME) {
    let random_init_blacks = [[0x00000008, 0x10000000], [0x00000022, 0x44000000], [0x00224400, 0x00081000], [0x00081022, 0x44081000]];
    let random_init_whites = [[0x00000010, 0x08000000], [0x00000044, 0x22000000], [0x00442200, 0x00100800], [0x00100844, 0x22100800]];
    const index = Math.floor(Math.random() * (random_init_blacks.length));
    initBlack = random_init_blacks[index];
    initWhite = random_init_whites[index];
    boardConf[CHAOS_BOARD_NAME].init_black = initBlack;
    boardConf[CHAOS_BOARD_NAME].init_white = initWhite;
  }
  setupInitDisc(board, initBlack, initWhite);

  // set hedder part
  for (let i = 0; i < BOARD_TABLE_SIZE; i++) {
    board[i]                                               = HOLE;
    board[i * BOARD_TABLE_SIZE + BOARD_TABLE_SIZE]         = HOLE;
    board[i * BOARD_TABLE_SIZE + BOARD_TABLE_SIZE * 2 - 1] = HOLE;
    board[BOARD_TABLE_SIZE * (BOARD_TABLE_SIZE) - i - 1]   = HOLE;
  }

  // setup protection initial disc and around space
  let initDisc = [
    initBlack[0] | initWhite[0],
    initBlack[1] | initWhite[1],
  ];
  for (let p = 0; p < 2; p++) {
    initDisc[p] |= (initDisc[p] >>> 1) | (initDisc[p] << 1);
    initDisc[p] |= (initDisc[p] >>> 8) | (initDisc[p] << 8);
  }

  let totalRandom = 0;
  let mask = 1 << 31
  for (let y = 0; y < BOARD_SIZE / 2; y++) {
    let countRandomCol = 0;
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let p = 0; p < 2; p++) {
        let is_hole = 0;
        if (getBoardName() === RANDOM_BOARD_NAME || getBoardName() === CHAOS_BOARD_NAME) {
          if (totalRandom < MAX_RANDOM_TOTAL_CNT && countRandomCol < MAX_RANDOM_COL_CNT && (mask & initDisc[p]) === 0) {
            let rand = Math.floor(Math.random() * 101);
            if (rand > (100 - RANDOM_HOLE_RATE)) {
              countRandomCol++;
              totalRandom++;
              is_hole = 1;
            }
          }
        }
        else {
          is_hole = (mask & hole[p]);
        }

        if (is_hole !== 0) {
          const index = getBoardIndex(x, y, p);
          board[index] = HOLE;
        }
      }
      mask >>>= 1;
    }
  }
}


function setupInitDisc(board, initBlack, initWhite) {
  let mask = 1 << 31
  for (let y = 0; y < BOARD_SIZE / 2; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let p = 0; p < 2; p++) {
        const index = getBoardIndex(x, y, p);
        putInitDisc(board, index, mask, initBlack[p], initWhite[p]);
      }
      mask >>>= 1;
    }
  }
}


function putInitDisc(board, index, mask, black, white) {
  let andBlack = mask & black;
  let andWhite = mask & white;
  if ((andBlack !== 0) && (andWhite === 0)) {
    board[index] = BLACK;
  }
  else if ((andBlack === 0) && (andWhite !== 0)) {
    board[index] = WHITE;
  }
}


export function getLegalMoves(color, board) {
  let legalMoves = [];
  for (let index = 11; index <= 88; index++) {
    if (getFlippablesAtIndex(color, board, index).length > 0) {
      legalMoves.push(index);
    }
  }
  return legalMoves;
}


export function getFlippablesAtIndex(color, board, index) {
  let flippables = [];
  if (board[index] !== EMPTY) return flippables;
  const opponentColor = getOpponentColor(color);
  for (let dir = 0; dir < ALL_DIRECTIONS_NUM; dir++) {
    const d = DIRECTION[dir];
    let tmp = [];
    let next = index + d;
    while (board[next] === opponentColor) {
      tmp.push(next);
      next += d;
    }
    if (board[next] === color) {
      flippables = flippables.concat(tmp);
    }
  }
  return flippables;
}


export function putDisc(color, board, index) {
  if (board[index] !== EMPTY) return [];
  board[index] = color;
  return [index];
}


export function flipDiscs(color, board, index) {
  let flippables = getFlippablesAtIndex(color, board, index);
  flippables.forEach( function(move) {
    board[move] = color;
  });
  return flippables;
}
