import { boardConf } from '../conf/board_conf.js'
import { getBoardName, getPlayRecordMode } from './ui.js';
import { getOpponentColors } from './game.js';


export const EMPTY = 0;
export const BLACK = 1;
export const WHITE = -1;
export const HOLE  = 2;
export const GREEN = 3;
export const ASH   = 4;

export const GREEN_ONLY = "green only";

export const HEADER_OFFSET = 1;

const ALL_DIRECTIONS_NUM   =  8;
const DIRECTION_XY = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];

const MAX_RANDOM_TOTAL_CNT = 10;  // max random hole is upto this value
const MAX_RANDOM_COL_CNT   =  2;  // max random hole per columun upto this value
const RANDOM_HOLE_RATE     = 20;  // (%)

const RANDOM_BOARD_NAME = "Random";
export const CHAOS_BOARD_NAME = "Chaos";

export let boardSize = 8;
export let boardTableSize = getBoardTableSize(boardSize);
export let partSize = getPartSize(boardSize);

let directions = getDirections(boardSize);

let preRandomChaosBoard = [];


function getBoardTableSize(size) {
  return size + (HEADER_OFFSET * 2);
}


function getPartSize(size) {
  if (size === 8) {
    return 2;
  }
  return 4;
}


function getDirections(size) {
  let ret = [];
  const tableSize = getBoardTableSize(size);
  for (let i=0; i<ALL_DIRECTIONS_NUM; i++) {
    ret.push((tableSize * DIRECTION_XY[i][1]) + DIRECTION_XY[i][0]);
  }
  return ret;
}


export function getBoardIndex(x, y) {
  let xIndex = x + HEADER_OFFSET
  let yIndex = (y + HEADER_OFFSET) * boardTableSize
  return xIndex + yIndex;
}


export function initBoard(board, size, hole, initBlack, initWhite, initGreen, initAsh) {
  boardSize = size;
  boardTableSize = getBoardTableSize(boardSize);
  partSize = getPartSize(boardSize);
  directions = getDirections(boardSize);

  // initialyze
  for (let y = 0; y < boardTableSize; y++) {
    for (let x = 0; x < boardTableSize; x++) {
      let index = (y * boardTableSize) + x;
      board[index] = EMPTY;
    }
  }

  // setup initial disc
  if (getPlayRecordMode() === false && getBoardName() === CHAOS_BOARD_NAME) {
    let random_init_blacks = [[0x00000008, 0x10000000], [0x00000022, 0x44000000], [0x00224400, 0x00081000], [0x00081022, 0x44081000]];
    let random_init_whites = [[0x00000010, 0x08000000], [0x00000044, 0x22000000], [0x00442200, 0x00100800], [0x00100844, 0x22100800]];
    const index = Math.floor(Math.random() * (random_init_blacks.length));
    initBlack = random_init_blacks[index];
    initWhite = random_init_whites[index];
    boardConf[CHAOS_BOARD_NAME].init_black = initBlack;
    boardConf[CHAOS_BOARD_NAME].init_white = initWhite;
  }
  setupInitDisc(board, initBlack, initWhite, initGreen, initAsh);

  // set hedder part
  for (let i = 0; i < boardTableSize; i++) {
    board[i]                                           = HOLE;
    board[i * boardTableSize + boardTableSize]         = HOLE;
    board[i * boardTableSize + boardTableSize * 2 - 1] = HOLE;
    board[boardTableSize * (boardTableSize) - i - 1]   = HOLE;
  }

  // setup protection initial disc and around space
  let protectInitDisc = [
    initBlack[0] | initWhite[0],
    initBlack[1] | initWhite[1],
  ];
  for (let p = 0; p < 2; p++) {
    protectInitDisc[p] |= (protectInitDisc[p] >>> 1) | (protectInitDisc[p] << 1);
    protectInitDisc[p] |= (protectInitDisc[p] >>> 8) | (protectInitDisc[p] << 8);
  }

  let totalRandom = 0;
  let mask = 1 << 31
  let prePart = 0;
  for (let y = 0; y < boardSize; y++) {
    let countRandomCol = 0;
    for (let x = 0; x < boardSize; x++) {
      const part = Math.floor((y * boardSize + x) / 32);
      if (prePart !== part) {
        mask = 1 << 31;
        prePart = part;
      }

      let isHole = 0;
      if (getPlayRecordMode() === false && (getBoardName() === RANDOM_BOARD_NAME || getBoardName() === CHAOS_BOARD_NAME)) {
        if (totalRandom < MAX_RANDOM_TOTAL_CNT && countRandomCol < MAX_RANDOM_COL_CNT && (mask & protectInitDisc[part]) === 0) {
          let rand = Math.floor(Math.random() * 101);
          if (rand > (100 - RANDOM_HOLE_RATE)) {
            countRandomCol++;
            totalRandom++;
            isHole = 1;
          }
        }
      }
      else {
        isHole = (mask & hole[part]);
      }

      if (isHole !== 0) {
        const index = getBoardIndex(x, y);
        board[index] = HOLE;
      }
      mask >>>= 1;
    }
  }
  if (getBoardName() === RANDOM_BOARD_NAME || getBoardName() === CHAOS_BOARD_NAME) {
    if (getPlayRecordMode() === true) {
      for (let i=0; i<preRandomChaosBoard.length; i++) {
        board[i] = preRandomChaosBoard[i];
      }
    }
    else {
      for (let i=0; i<board.length; i++) {
        preRandomChaosBoard[i] = board[i];
      }
    }
  }
  // DEBUG -----------------
  //let text = "";
  //for (let y=0; y<boardTableSize; y++) {
  //  for (let x=0; x<boardTableSize; x++) {
  //    const index = y*boardTableSize + x;
  //    text += board[index];
  //  }
  //  text += "\n";
  //}
  //alert(text);
  // DEBUG -----------------
}


function setupInitDisc(board, initBlack, initWhite, initGreen, initAsh) {
  let mask = 1 << 31
  let prePart = 0;
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const part = Math.floor((y * boardSize + x) / 32);
      if (prePart !== part) {
        mask = 1 << 31
        prePart = part;
      }
      const index = getBoardIndex(x, y);
      putInitDisc(board, index, mask, initBlack[part], initWhite[part], initGreen[part], initAsh[part]);
      mask >>>= 1;
    }
  }
}


function putInitDisc(board, index, mask, black, white, green, ash) {
  let andBlack = mask & black;
  let andWhite = mask & white;
  let andGreen = mask & green;
  let andAsh   = mask & ash;
  if ((andBlack !== 0) && (andWhite === 0) && (andGreen === 0) && (andAsh === 0)) {
    board[index] = BLACK;
  }
  else if ((andBlack === 0) && (andWhite !== 0) && (andGreen === 0) && (andAsh === 0)) {
    board[index] = WHITE;
  }
  else if ((andBlack === 0) && (andWhite === 0) && (andGreen !== 0) && (andAsh === 0)) {
    board[index] = GREEN;
  }
  else if ((andBlack === 0) && (andWhite === 0) && (andGreen === 0) && (andAsh !== 0)) {
    board[index] = ASH;
  }
}


export function getLegalMoves(color, board) {
  let legalMoves = [];
  for (let index = (boardTableSize + HEADER_OFFSET); index <= (boardTableSize + HEADER_OFFSET) * boardSize; index++) {
    if (getFlippablesAtIndex(color, board, index).length > 0) {
      legalMoves.push(index);
    }
  }
  return legalMoves;
}


export function getFlippablesAtIndex(color, board, index) {
  let flippables = [];
  let greenOnly = false;
  if (board[index] !== EMPTY) return flippables;
  const opponentColors = getOpponentColors(color);
  for (let dir = 0; dir < ALL_DIRECTIONS_NUM; dir++) {
    const d = directions[dir];
    let tmp = [];
    let g = [];
    let next = index + d;
    while (opponentColors.includes(board[next]) === true) {
      tmp.push(next);
      if (board[next] === GREEN) {
        g.push(next);
      }
      next += d;
    }

    if (board[next] === color) {
      let f = [];
      for (let i=0; i<tmp.length; i++) {
        if (g.includes(tmp[i]) === false) {
          f.push(tmp[i]);
        }
      }
      flippables = flippables.concat(f);
      if (flippables.length === 0 && g.length > 0) {
        greenOnly = true;
      }
    }
    else if (tmp.length > 1 && g.length > 0) {
      let f = [];
      const gLast = tmp.indexOf(g.pop());
      if (gLast > 0) {
        tmp = tmp.slice(0, gLast);
        for (let i=0; i<tmp.length; i++) {
          if (g.includes(tmp[i]) === false) {
            f.push(tmp[i]);
          }
        }
        flippables = flippables.concat(f);
        if (flippables.length === 0) {
          greenOnly = true;
        }
      }
    }
  }
  if (greenOnly === true && flippables.length === 0) {
    flippables.push(GREEN_ONLY);
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
  if (flippables[0] === GREEN_ONLY) return [];
  flippables.forEach( function(move) {
    board[move] = color;
  });
  return flippables;
}
