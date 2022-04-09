import { colorCodeConf } from '../conf/colorcode_conf.js'
import { continentConf } from '../conf/continent_conf.js'
import { boardConf } from '../conf/board_conf.js'
import { intelligenceConf } from '../conf/intelligence_conf.js'
import {
  GAME_INIT,
  GAME_PLAY,
  GAME_STOP,
  GAME_END,
  getGameBoard,
  setGameState,
  getGameState,
  setGameTurn,
  getGameTurn,
  setCountMove,
  getCountMove,
  setCountGame,
  getCountGame,
  setCountPass,
  getCountPass,
  setScoreBlack,
  getScoreBlack,
  setScoreWhite,
  getScoreWhite,
  setPlayerBlack,
  getPlayerBlack,
  setPlayerWhite,
  getPlayerWhite,
  getGameFinalized,
  setGameFinalized,
  getLastMove,
  getLastTurn,
  getPreLastMove,
  initGame,
  reInitGame,
  playGame,
} from './game.js'
import {
  BLACK,
  WHITE,
  EMPTY,
  HOLE,
  BOARD_TABLE_SIZE,
  BOARD_SIZE,
  HEADER_OFFSET,
  CHAOS_BOARD_NAME,
  initBoard,
  getBoardIndex,
  getFlippablesAtIndex,
} from './board.js'
import { STOP_PLAY_RECORD, UNKNOWN_MOVE, HUMAN } from './move.js'
import { getJestEnabled } from './jest.js'


const UI_WAIT_TIME             = 250;   // ms
export const UI_WAIT_TIME_LONG = 1000;  // ms
export const UI_WAIT_FLIP_DISC = 500;   // ms

const MODE_QUESTER = 'Quester';
const MODE_PIONEER = 'Pioneer';

const START_BUTTON_TEXT_CONTENT = 'start';
const STOP_BUTTON_TEXT_CONTENT  = 'stop';

const STONE_BOARD_COLOR_CODE                     = 'f';
const STONE_BOARD_FRAME_COLOR_CODE               = 'n';
const STONE_BOARD_BACKGROUND_COLOR_CODE          = 'm';
const INTELLIGENCE_PROFILE_BLACK_COLOR_CODE      = 'e';
const INTELLIGENCE_PROFILE_WHITE_COLOR_CODE      = 'f';
const INTELLIGENCE_PROFILE_BACKGROUND_COLOR_CODE = 'a';
const LAST_MOVE_COLOR_CODE                       = 'p';

const TABLE_ADJUST_SIZE = 0.88;
const COLS = ["a", "b", "c", "d", "e", "f", "g", "h"];


let modeName      = MODE_QUESTER;
let continentName = 'X';
let boardName     = 'X';
let boardNamePre  = 'X';

let humanClick = false;
let humanMove  = UNKNOWN_MOVE;

let selectedPaint = "";

let playRecordMode = false;


// create ui
export function createUi() {
  createStartStopEvent();
  createCancelEvent();
  createPlayRecordEvent();
  createClickableTables();
  createDisplayTables();
  createSelectMode();
  createSelectContinent();
  createSelectBoard();
  createSelectBlack();
  createSelectWhite();
  createSelectFirst();
  createResetPioneersBoard();
  //createCodeCopyEvent();
}


// start / stop
function createStartStopEvent() {
  const startStop = document.getElementById('start_stop');
  startStop.addEventListener('click', onStartStopClicked);
}


function onStartStopClicked(event) {
  if (event !== 'start_play_record') {
    playRecordMode = false;
  }
  switch (getGameState()) {
    case GAME_INIT:
      setGameState(GAME_PLAY);
      updateUi();
      if (playRecordMode === false && ((getGameTurn() === BLACK && getPlayerBlack() !== HUMAN && getPlayerWhite() === HUMAN) || (getGameTurn() === WHITE && getPlayerBlack() === HUMAN && getPlayerWhite() !== HUMAN))) {
        setTimeout(() => playUiGame(), UI_WAIT_TIME_LONG);
      }
      else {
        playUiGame();
      }
      break;
    case GAME_PLAY:
      setGameState(GAME_STOP);
      updateUi();
      break;
    case GAME_STOP:
      setGameState(GAME_PLAY);
      updateUi();
      const countMove = getCountMove();
      const record = document.getElementsByName('record')[0];
      record.value = record.value.slice(0, (countMove - 1) * 2);
      playUiGame();
      break;
    case GAME_END:
      setGameState(GAME_INIT);
      updateUi();
      onStartStopClicked('*** force invocation ***');
      break;
    default:
      // do nothing
      break;
  }
}


// cancel button
function createCancelEvent() {
  const cancel = document.getElementById('cancel');
  cancel.addEventListener('click', cancelButtonClicked);
}


function cancelButtonClicked(event) {
  alert('cancel')
  playRecordMode = false;
  setGameState(GAME_INIT);
  updateUi();
}


// play record button
function createPlayRecordEvent() {
  const playRecord = document.getElementById('play_record');
  playRecord.addEventListener('click', playRecordButtonClicked);

  const record = document.getElementsByName('record')[0];
  record.addEventListener('change', recordChanged);
}


function playRecordButtonClicked(event) {
  playRecordMode = true;
  setGameState(GAME_INIT);
  updateUi();
  setTimeout(() => onStartStopClicked('start_play_record'), UI_WAIT_TIME_LONG);
}


function recordChanged(event) {
  if(getGameState() !== GAME_PLAY) {
    document.getElementById('play_record').disabled = false;
  }
}


// clickable tables
function createClickableTables() {
  createClickableTable("board",          BOARD_TABLE_SIZE, BOARD_TABLE_SIZE);  // clickable board
  createClickableTable("pioneers_board",       BOARD_SIZE,       BOARD_SIZE);  // clickable board palette
  createClickableTable("board_palette",                 2,                8);  // clickable board palette
  createClickableTable("hole_palette",                  1,                3);  // clickable hole palette
  createClickableTable("disc_palette",                  1,                2);  // clickable disc palette
}


function createClickableTable(name, y, x) {
  const table = document.createElement("table");
  document.getElementById(name).appendChild(table);
  for (let i = 0; i < y; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j < x; j++) {
      const td = document.createElement("td");
      tr.appendChild(td);
      td.addEventListener("click", onClickableSubFunctions[name]);
      td.setAttribute("id", name + (i * x + j));
    }
  }
}


const onClickableSubFunctions = {
  'board'          : onUiBoardClicked,
  'pioneers_board' : onUiPioneersBoardClicked,
  'board_palette'  : onUiBoardPaletteClicked,
  'hole_palette'   : onUiHolePaletteClicked,
  'disc_palette'   : onUiDiscPaletteClicked,
}


function onUiBoardClicked(event) {
  if (getGameState() !== GAME_PLAY) return;
  let player = getPlayerBlack();
  if (getGameTurn() !== BLACK) {
    player = getPlayerWhite();
  }
  if (player === HUMAN) {
    const index = getUiBoardIndex(this);
    let flippables = getFlippablesAtIndex(getGameTurn(), getGameBoard(), index);
    if (flippables.length > 0) {
      setHumanClickTrue();
      setHumanMove(index);
      playUiGame();
    }
  }
}


function onUiPioneersBoardClicked(event) {
  const index            = Number(this.getAttribute("id").replace("pioneers_board", ""));
  const paint_disc       = document.getElementById("selected_paint0").textContent;
  const paint_disc_color = document.getElementById("selected_paint0").style.color;
  // put paint to board
  //  - if hole palette selected
  if (selectedPaint === 'W' || selectedPaint === 'X' || selectedPaint === 'Y') {
    this.textContent = "h";
    this.style.color = colorCodeConf['o'];
    // add hole
    paintHole(index);
    // mod color
    paintColorCode(index, selectedPaint);
  }
  //  - if disc palette selected
  else if (selectedPaint === 'black' || selectedPaint === 'white') {
    let color = getColorCode(index);
    if (color !== 'W' && color !== 'X' && color !== 'Y') {
      if (this.textContent === "") {
        this.textContent = paint_disc;
        this.style.color = paint_disc_color;
        // add disc
        paintDisc(index, selectedPaint);
      }
      else {
        if (this.style.color !== paint_disc_color) {
          this.textContent = paint_disc;
          this.style.color = paint_disc_color;
          // add disc
          paintDisc(index, selectedPaint);
        }
        else {
          this.textContent = "";
          // remove disc
          removeDisc(index);
        }
      }
    }
  }
  //  - if board palette selected
  else {
    // reomove hole
    if (this.textContent === "h") {
      this.textContent = "";
    }
    removeHole(index);
    // mod color
    paintColorCode(index, selectedPaint);
  }
  // init ui
  setGameState(GAME_INIT);
  updateUi();
}


// pioneer's board reset button
function createResetPioneersBoard() {
  const reset = document.getElementById('pioneers_board_reset');
  reset.addEventListener('click', resetPioneersBoard);
}


function resetPioneersBoard(event) {
  // init board_conf
  boardConf[boardName].negative   = 0x00000000;
  boardConf[boardName].first      = 0x00000000;
  boardConf[boardName].size       = 0x00000000;
  boardConf[boardName].hole       = [0x00000000, 0x00000000];
  boardConf[boardName].color_code = "0000000000000000000000000000000000000000000000000000000000000000";
  boardConf[boardName].init_black = [0x00000008, 0x10000000];
  boardConf[boardName].init_white = [0x00000010, 0x08000000];
  boardConf[boardName].init_green = [0x00000000, 0x00000000];
  boardConf[boardName].init_ash   = [0x00000000, 0x00000000];

  // init board_conf
  initUiBoard();

  // pioneers board selection initialize
  //  - selected paint
  document.getElementById("selected_paint0").style.backgroundColor = colorCodeConf['0'];
  document.getElementById("selected_paint0").textContent = "";
  selectedPaint = '0';
  //  - first selection
  const selectFirst = document.getElementsByName('first_player');
  selectFirst[0].checked = true;
  selectFirst[1].checked = false;

  // init record
  initRecord();

  // update ui
  updateUi();
}


function removeDisc(index, color) {
  let initBlack = boardConf[boardName].init_black;
  let initWhite = boardConf[boardName].init_white;
  let partIndex = 0;
  if (index > 31) {
    partIndex = 1;
  }
  let partInitBlack = initBlack[partIndex];
  let partInitWhite = initWhite[partIndex];
  let shift        = 31 - (index % 32);
  let mask         = 1 << shift;
  boardConf[boardName].init_black[partIndex] = partInitBlack & ~mask;
  boardConf[boardName].init_white[partIndex] = partInitWhite & ~mask;
}


function paintDisc(index, color) {
  let initBlack = boardConf[boardName].init_black;
  let initWhite = boardConf[boardName].init_white;
  let partIndex = 0;
  if (index > 31) {
    partIndex = 1;
  }
  let partInitBlack = initBlack[partIndex];
  let partInitWhite = initWhite[partIndex];
  let shift        = 31 - (index % 32);
  let mask         = 1 << shift;
  if (color === 'black') {
    boardConf[boardName].init_black[partIndex] = partInitBlack | mask;
    boardConf[boardName].init_white[partIndex] = partInitWhite & ~mask;
  }
  else if (color === 'white') {
    boardConf[boardName].init_black[partIndex] = partInitBlack & ~mask;
    boardConf[boardName].init_white[partIndex] = partInitWhite | mask;
  }
}


function paintHole(index) {
  let hole      = boardConf[boardName].hole;
  let initBlack = boardConf[boardName].init_black;
  let initWhite = boardConf[boardName].init_white;
  let partIndex = 0;
  if (index > 31) {
    partIndex = 1;
  }
  let partHole      = hole[partIndex];
  let partInitBlack = initBlack[partIndex];
  let partInitWhite = initWhite[partIndex];
  let shift         = 31 - (index % 32);
  let mask          = 1 << shift;
  boardConf[boardName].hole[partIndex]       = partHole | mask;
  boardConf[boardName].init_black[partIndex] = partInitBlack & ~mask;
  boardConf[boardName].init_white[partIndex] = partInitWhite & ~mask;
}


function removeHole(index) {
  let hole = boardConf[boardName].hole;
  let partIndex = 0;
  if (index > 31) {
    partIndex = 1;
  }
  let partHole     = hole[partIndex];
  let shift        = 31 - (index % 32);
  let mask         = 1 << shift;
  boardConf[boardName].hole[partIndex] = partHole & ~mask;
}


function paintColorCode(index, paint) {
  let colorCode = boardConf[boardName].color_code;
  let before = colorCode.slice(0, index);
  let after = colorCode.slice(index + 1);
  colorCode = before + paint + after;
  boardConf[boardName].color_code = colorCode;
}


function getColorCode(index) {
  return boardConf[boardName].color_code[index];
}


function onUiBoardPaletteClicked(event) {
  const index = Number(this.getAttribute("id").replace("board_palette", ""));
  document.getElementById("selected_paint0").style.backgroundColor = colorCodeConf[index.toString(16)];
  document.getElementById("selected_paint0").textContent = "";
  selectedPaint = index.toString(16);
}


function onUiHolePaletteClicked(event) {
  const index = Number(this.getAttribute("id").replace("hole_palette", ""));
  const holes = ['W', 'X', 'Y'];
  document.getElementById("selected_paint0").style.backgroundColor = colorCodeConf[holes[index]];
  document.getElementById("selected_paint0").textContent = "h";
  document.getElementById("selected_paint0").style.color = colorCodeConf['o'];
  selectedPaint = holes[index];
}


function onUiDiscPaletteClicked(event) {
  const index = Number(this.getAttribute("id").replace("disc_palette", ""));
  const discs = ['black', 'white'];
  document.getElementById("selected_paint0").style.backgroundColor = colorCodeConf['0'];
  setDiscPalette("selected_paint0", discs[index]);
  selectedPaint = discs[index];
}


function createDisplayTables() {
  createDisplayTable("continent_map",       8,  15);  // continent map ui
  createDisplayTable("stone_board",        10,  10);  // stone board ui
  createDisplayTable("selected_paint",      1,   1);  // selected paint ui
  createDisplayTable("black_intelligence",  8,   8);  // black intelligence ui
  createDisplayTable("white_intelligence",  8,   8);  // white intelligence ui
  createDisplayTable("questers_memo_tbl",  18,   2);  // questers memo ui
}


function createDisplayTable(name, y, x) {
  const table = document.createElement("table");
  document.getElementById(name).appendChild(table);
  for (let i = 0; i < y; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j < x; j++) {
      const td = document.createElement("td");
      tr.appendChild(td);
      td.setAttribute("id", name + (i * x + j));
    }
  }
}


// select mode
function createSelectMode() {
  const selectMode = document.getElementsByName('select_mode');
  for (let i=0; i<selectMode.length; i++) {
    selectMode[i].addEventListener('change', onModeSelectionChanged);
  }
}


function onModeSelectionChanged(event) {
  const selectMode = document.getElementsByName('select_mode');
  const selectBoard = document.getElementsByName('select_board')[0];
  for (let i=0; i<selectMode.length; i++) {
    if (selectMode[i].checked) {
      modeName = selectMode[i].value;
    }
  }
  setGameState(GAME_INIT);
  if (modeName === MODE_QUESTER) {
    boardName = boardNamePre;
    updateSelectedBoard();
    selectBoard.value = boardName;
    updateUi();
    // set display block for quest menu
    const quest_menu = document.getElementsByName('quest_menu')[0];
    quest_menu.style.display = "block";
    // set display block for quest memo
    const quest_memo = document.getElementsByName('questers_memo')[0];
    quest_memo.style.display = "block";
    // set display none for pioneer menu
    const pioneer_menu = document.getElementsByName('pioneer_menu')[0];
    pioneer_menu.style.display = "none";
    initStoneBoard();
    initQuestersMemo();
    initRecord();
  }
  else if (modeName === MODE_PIONEER) {
    boardNamePre = boardName;
    boardName = continentConf[modeName].boards[0]
    selectBoard.value = boardName;
    updateUi();
    initRecord();
    // set display none for quest menu
    const questMenu = document.getElementsByName('quest_menu')[0];
    questMenu.style.display = "none";
    // set display block for quest memo
    const quest_memo = document.getElementsByName('questers_memo')[0];
    quest_memo.style.display = "none";
    // set display block for pioneer menu
    const pioneerMenu = document.getElementsByName('pioneer_menu')[0];
    pioneerMenu.style.display = "block";
  }
}


// select continent
function createSelectContinent() {
  const selectContinent = document.getElementsByName('select_continent')[0];
  selectContinent.addEventListener('change', onContinentSelectionChanged);
}


function onContinentSelectionChanged(event) {
  const selectContinent = document.getElementsByName('select_continent')[0];
  const selectBoard = document.getElementsByName('select_board')[0];
  continentName = selectContinent.value;
  boardName = continentConf[continentName].boards[0]
  initContinentMap();
  updateSelectedBoard();
  initStoneBoard();
  initQuestersMemo();
  initRecord();
  selectBoard.value = boardName;
  setGameState(GAME_INIT);
  updateUi();
}


// select board
function createSelectBoard() {
  const selectBoard = document.getElementsByName('select_board')[0];
  selectBoard.addEventListener('change', onBoardSelectionChanged);
}


function onBoardSelectionChanged(event) {
  const selectBoard = document.getElementsByName('select_board')[0];
  boardName = selectBoard.value;
  initStoneBoard();
  initQuestersMemo();
  initRecord();
  setGameState(GAME_INIT);
  updateUi();
}


// select black
function createSelectBlack() {
  const selectBlack = document.getElementsByName('select_black')[0];
  selectBlack.addEventListener('change', onBlackSelectionChanged);
}


function onBlackSelectionChanged(event) {
  const selectBlack = document.getElementsByName('select_black')[0];
  setPlayerBlack(selectBlack.value);
  initIntelligenceProfiles();
}


// select white
function createSelectWhite() {
  const selectWhite = document.getElementsByName('select_white')[0];
  selectWhite.addEventListener('change', onWhiteSelectionChanged);
}


function onWhiteSelectionChanged(event) {
  const selectWhite = document.getElementsByName('select_white')[0];
  setPlayerWhite(selectWhite.value);
  initIntelligenceProfiles();
}


// select first
function createSelectFirst() {
  const selectMode = document.getElementsByName('first_player');
  for (let i=0; i<selectMode.length; i++) {
    selectMode[i].addEventListener('change', onFirstSelectionChanged);
  }
}


function onFirstSelectionChanged(event) {
  const selectFirst = document.getElementsByName('first_player');
  let firstPlayer = "black";
  boardConf[boardName].first = 0x00000000;
  for (let i=0; i<selectFirst.length; i++) {
    if (selectFirst[i].checked) {
      firstPlayer = selectFirst[i].value;
    }
  }
  if (firstPlayer === "white") {
    boardConf[boardName].first = 0x00000001;
  }
  setGameState(GAME_INIT);
  updateUi();
}


// code copy
//function createCodeCopyEvent() {
//  const codeCopy = document.getElementById('code_copy');
//  codeCopy.addEventListener('click', onCodeCopyClicked);
//}


//function onCodeCopyClicked(event) {
//  let textarea = document.getElementById("code");
//  textarea.select();
//  document.execCommand("copy");
//  alert('Code has been copied to the clipboard.');
//}


// initialize ui
export function initUi() {
  // initialize variables
  continentName = document.getElementsByName('select_continent')[0].value;
  boardNamePre  = continentConf[continentName].boards[0]
  humanClick    = false;
  humanMove     = UNKNOWN_MOVE;

  let turn = BLACK;
  if (boardConf[boardName].first === 1) {
    turn = WHITE;
  }

  onModeSelectionChanged("force invoke");
  setPlayerBlack(document.getElementsByName('select_black')[0].value);
  setPlayerWhite(document.getElementsByName('select_white')[0].value);

  initContinentMap();
  initStoneBoard();
  initQuestersMemo();
  initRecord();
  initIntelligenceProfiles();
  initGame(turn);
  initUiBoard();
}


// initialize continent map and note
function initContinentMap() {
  // (Map)
  const colors = continentConf[continentName].colors;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 15; x++) {
      let index = y * 15 + x
      let color = colors.charAt(index);
      document.getElementById("continent_map" + index).style.backgroundColor = colorCodeConf[color];
    }
  }
  // (Note)
  document.getElementById("continent_note").innerHTML = continentConf[continentName].note;
  document.getElementById("continent_note").style.fontSize = "1rem";
}


// initialize board map and note
function initStoneBoard() {
  // (shape)
  const hole = boardConf[boardName].hole
  let mask = 1 << 31
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      drawStoneBoard(hole[0], j, i);
      drawStoneBoard(hole[1], j, i+4);
    }
  }
  // (frame)
  for (let i = 0; i < 10; i++) {
    let id_top    = "stone_board" + (i)
    let id_bottom = "stone_board" + (i + 90)
    let id_right  = "stone_board" + (i * 10)
    let id_left   = "stone_board" + (i * 10 + 9)
    document.getElementById(id_top).style.backgroundColor    = colorCodeConf[STONE_BOARD_FRAME_COLOR_CODE];
    document.getElementById(id_bottom).style.backgroundColor = colorCodeConf[STONE_BOARD_FRAME_COLOR_CODE];
    document.getElementById(id_right).style.backgroundColor  = colorCodeConf[STONE_BOARD_FRAME_COLOR_CODE];
    document.getElementById(id_left).style.backgroundColor   = colorCodeConf[STONE_BOARD_FRAME_COLOR_CODE];
  }
  // (decolate pattern)
  document.getElementById("stone_board1").style.backgroundColor  = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board4").style.backgroundColor  = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board9").style.backgroundColor  = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board20").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board29").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board50").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board59").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board89").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board94").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];
  document.getElementById("stone_board98").style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];

  // (lacking)
  document.getElementById("stone_board80").style.backgroundColor = colorCodeConf['W'];
  document.getElementById("stone_board90").style.backgroundColor = colorCodeConf['W'];
  document.getElementById("stone_board91").style.backgroundColor = colorCodeConf['W'];

  // (note)
  document.getElementById("board_note").innerHTML = boardConf[boardName].note;
  document.getElementById("board_note").style.fontSize = "1rem";
}


function drawStoneBoard(code, x, y) {
  const x_size = 10;
  let mask = 1 << 31;
  let shiftCount = y * 8 + x;
  if (shiftCount >= 32) {
    shiftCount -= 32;
  }
  for (let i=0; i<shiftCount; i++) {
    mask >>>= 1;
  }
  let id = "stone_board" + (y * x_size + x + 11)
  if ((code & mask) !== 0) {
    document.getElementById(id).style.backgroundColor = colorCodeConf[STONE_BOARD_BACKGROUND_COLOR_CODE];  // stone board background
  }
  else {
    document.getElementById(id).style.backgroundColor = colorCodeConf[STONE_BOARD_COLOR_CODE];  // stone board
  }
}


// initialize intelligence-prof
function initIntelligenceProfiles() {
  // <<< Black >>>
  const blackIntelProf = intelligenceConf[getPlayerBlack()].prof_code;
  // (Higher)
  let mask = 1 << 31;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      let and = mask & blackIntelProf[0];
      let id = "black_intelligence" + (i * 8 + j);
      if (and !== 0) {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_BLACK_COLOR_CODE];  // prof
      }
      else {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_BACKGROUND_COLOR_CODE];  // prof-background
      }
      mask >>>= 1;
    }
  }
  // (Lower)
  mask = 1 << 31;
  for (let i = 4; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let and = mask & blackIntelProf[1];
      let id = "black_intelligence" + (i * 8 + j)
      if (and !== 0) {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_BLACK_COLOR_CODE];  // prof
      }
      else {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_BACKGROUND_COLOR_CODE];  // prof-background
      }
      mask >>>= 1;
    }
  }

  // <<< White >>>
  const whiteIntelProf = intelligenceConf[getPlayerWhite()].prof_code;
  // (Higher)
  mask = 1 << 31;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 8; j++) {
      let and = mask & whiteIntelProf[0];
      let id = "white_intelligence" + (i * 8 + j)
      if (and !== 0) {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_WHITE_COLOR_CODE];  // prof
      }
      else {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_BACKGROUND_COLOR_CODE];  // prof-background
      }
      mask >>>= 1;
    }
  }
  // (Lower)
  mask = 1 << 31;
  for (let i = 4; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let and = mask & whiteIntelProf[1];
      let id = "white_intelligence" + (i * 8 + j)
      if (and !== 0) {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_WHITE_COLOR_CODE];  // prof
      }
      else {
        document.getElementById(id).style.backgroundColor = colorCodeConf[INTELLIGENCE_PROFILE_BACKGROUND_COLOR_CODE];  // prof-background
      }
      mask >>>= 1;
    }
  }
}


function initUiBoard() {
  // setup game
  let turn = BLACK;
  if (boardConf[boardName].first === 1) {
    turn = WHITE;
  }
  reInitGame(turn);

  // setup game board
  initBoard(getGameBoard(), boardConf[boardName].hole, boardConf[boardName].init_black, boardConf[boardName].init_white);
  const board = getGameBoard();

  // setup all empty board
  for (let y = 0; y < BOARD_TABLE_SIZE; y++) {
    for (let x = 0; x < BOARD_TABLE_SIZE; x++) {
      let index = (y * BOARD_TABLE_SIZE) + x;
      document.getElementById("board" + index).setAttribute("class", "empty");
    }
  }

  // setup for pioneer mode
  if (modeName === MODE_PIONEER) {
    // coloring and put initial disc for pioneer's board
    const colorCode = boardConf[boardName].color_code;
    for (let y = 0; y < BOARD_SIZE / 2; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        for (let h = 0; h < 2; h++) {
          let colorIndex = y * 8 + x + (h * 32);
          let color = colorCode.charAt(colorIndex);
          const index = getBoardIndex(x, y, h);
          if (board[index] === HOLE) {
            switch (color) {
              case 'X':       // hole-black
              case 'Y':       // hole-white
              case 'Z':       // hole-green
                break;
              default:
                color = 'W';  // hole-default
                break;
            }
          }
          document.getElementById("pioneers_board" + colorIndex).style.backgroundColor = colorCodeConf[color];
          // initial disc
          if (board[index] === BLACK) {
            setDiscPalette("pioneers_board" + colorIndex, 'black');
          }
          else if (board[index] === WHITE) {
            setDiscPalette("pioneers_board" + colorIndex, 'white');
          }
          else if (board[index] === EMPTY) {
            unSetDiscPalette("pioneers_board" + colorIndex);
          }
        }
      }
    }
    // selected paint
    if (selectedPaint === "") {
      document.getElementById("selected_paint0").style.backgroundColor = colorCodeConf[0];
      selectedPaint = "0";
    }
    // board palette
    for (let i=0; i<16; i++) {
      document.getElementById("board_palette" + i).style.backgroundColor = colorCodeConf[i.toString(16)];
    }
    // hole palette
    document.getElementById("hole_palette0").style.backgroundColor = colorCodeConf['W'];
    document.getElementById("hole_palette1").style.backgroundColor = colorCodeConf['e'];
    document.getElementById("hole_palette2").style.backgroundColor = colorCodeConf['f'];
    document.getElementById("hole_palette0").textContent = "h";
    document.getElementById("hole_palette1").textContent = "h";
    document.getElementById("hole_palette2").textContent = "h";
    document.getElementById("hole_palette0").style.color = colorCodeConf['o'];
    document.getElementById("hole_palette1").style.color = colorCodeConf['o'];
    document.getElementById("hole_palette2").style.color = colorCodeConf['o'];
    // disc palette
    document.getElementById("disc_palette0").style.backgroundColor = colorCodeConf['0'];
    document.getElementById("disc_palette1").style.backgroundColor = colorCodeConf['0'];
    setDiscPalette("disc_palette0", "black");
    setDiscPalette("disc_palette1", "white");
    // generate code
    generateCode();
  }

  // setup ui board

  // --- initial discs ---
  putInitialDiscOnUiBoard();

  // --- adjust table size ---
  const w = document.getElementById("board" + 11).getBoundingClientRect().width * TABLE_ADJUST_SIZE;
  const h = document.getElementById("board" + 11).getBoundingClientRect().height * TABLE_ADJUST_SIZE;
  let size = w;
  if (h > w) {
    size = h;
  }

  for (let i=0; i<BOARD_TABLE_SIZE*BOARD_TABLE_SIZE; i++) {
    document.getElementById("board" + i).style.width = size + 'px';
    document.getElementById("board" + i).style.height = size + 'px';
  }

  // --- header ---
  document.getElementById("board" + 0).setAttribute("class", "none");
  document.getElementById("board" + 1).setAttribute("class", "A");
  document.getElementById("board" + 2).setAttribute("class", "B");
  document.getElementById("board" + 3).setAttribute("class", "C");
  document.getElementById("board" + 4).setAttribute("class", "D");
  document.getElementById("board" + 5).setAttribute("class", "E");
  document.getElementById("board" + 6).setAttribute("class", "F");
  document.getElementById("board" + 7).setAttribute("class", "G");
  document.getElementById("board" + 8).setAttribute("class", "H");
  document.getElementById("board" + 9).setAttribute("class", "none");
  document.getElementById("board" + 10).setAttribute("class", "one");
  document.getElementById("board" + 19).setAttribute("class", "none");
  document.getElementById("board" + 20).setAttribute("class", "two");
  document.getElementById("board" + 29).setAttribute("class", "none");
  document.getElementById("board" + 30).setAttribute("class", "three");
  document.getElementById("board" + 39).setAttribute("class", "none");
  document.getElementById("board" + 40).setAttribute("class", "four");
  document.getElementById("board" + 49).setAttribute("class", "none");
  document.getElementById("board" + 50).setAttribute("class", "five");
  document.getElementById("board" + 59).setAttribute("class", "none");
  document.getElementById("board" + 60).setAttribute("class", "six");
  document.getElementById("board" + 69).setAttribute("class", "none");
  document.getElementById("board" + 70).setAttribute("class", "seven");
  document.getElementById("board" + 79).setAttribute("class", "none");
  document.getElementById("board" + 80).setAttribute("class", "eight");
  document.getElementById("board" + 89).setAttribute("class", "none");
  document.getElementById("board" + 90).setAttribute("class", "none");
  document.getElementById("board" + 91).setAttribute("class", "none");
  document.getElementById("board" + 92).setAttribute("class", "none");
  document.getElementById("board" + 93).setAttribute("class", "none");
  document.getElementById("board" + 94).setAttribute("class", "none");
  document.getElementById("board" + 95).setAttribute("class", "none");
  document.getElementById("board" + 96).setAttribute("class", "none");
  document.getElementById("board" + 97).setAttribute("class", "none");
  document.getElementById("board" + 98).setAttribute("class", "none");
  document.getElementById("board" + 99).setAttribute("class", "none");

  // --- hole ---
  for (let y = 0; y < BOARD_SIZE / 2; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let h = 0; h < 2; h++) {
        const index = getBoardIndex(x, y, h);
        if (board[index] === HOLE) {
          document.getElementById("board" + index).setAttribute("class", "hole");
          document.getElementById("board" + index).style.backgroundColor = colorCodeConf['W'];
        }
      }
    }
  }

  // --- coloring ---
  if (boardName === CHAOS_BOARD_NAME) {
    let random_color = "";
    for (let i=0; i<BOARD_SIZE*BOARD_SIZE; i++) {
      random_color += (Math.floor(Math.random() * (14)).toString(16))
    }
    boardConf[boardName].color_code = random_color;
  }
  const colorCode = boardConf[boardName].color_code
  for (let y = 0; y < BOARD_SIZE / 2; y++) {
    for (let x = 0; x < BOARD_SIZE; x++) {
      for (let h = 0; h < 2; h++) {
        let colorIndex = y * 8 + x + (h * 32);
        let color = colorCode.charAt(colorIndex);
        const index = getBoardIndex(x, y, h);
        if (board[index] === HOLE) {
          switch (color) {
            case 'X':       // hole-black
            case 'Y':       // hole-white
            case 'Z':       // hole-green
              break;
            default:
              color = 'W';  // hole-default
              break;
          }
        }
        document.getElementById("board" + index).style.backgroundColor = colorCodeConf[color];
      }
    }
  }
}


function initQuestersMemo() {
  const header = [
    'No.', 'Name', 'Continent', 'First', 'Squares', 'Blanks',
    'Random 10000 Matches', 'Best Match Winner', 'Best Match Score', "Best Match Record",
    'Black Max Score', 'Black Max Record', 'White Max Score', 'White Max Record',
    'Black Shortest Move Count', 'Black Shortest Record', 'White Shortest Move Count', 'White Shortest Record',
  ];
  for (let i=0; i<header.length; i++) {
    const index = i * 2;
    document.getElementById("questers_memo_tbl" + index).setAttribute("class", "header");
    document.getElementById("questers_memo_tbl" + index).textContent = header[i];
    document.getElementById("questers_memo_tbl" + (index + 1)).setAttribute("class", "content");
  }
  document.getElementById("questers_memo_tbl" +  1).textContent = boardConf[boardName].no;
  document.getElementById("questers_memo_tbl" +  3).textContent = boardName;
  document.getElementById("questers_memo_tbl" +  5).textContent = boardConf[boardName].continent;
  let first = 'black';
  if (boardConf[boardName].first !== 0) {
    first = 'white';
  }
  document.getElementById("questers_memo_tbl" +  7).textContent = first;
  document.getElementById("questers_memo_tbl" +  9).textContent = boardConf[boardName].squares;
  document.getElementById("questers_memo_tbl" + 11).textContent = boardConf[boardName].blanks;
  document.getElementById("questers_memo_tbl" + 13).textContent = boardConf[boardName].random_10000_matches;
  document.getElementById("questers_memo_tbl" + 15).textContent = boardConf[boardName].best_match_winner;
  document.getElementById("questers_memo_tbl" + 17).textContent = boardConf[boardName].best_match_score;
  document.getElementById("questers_memo_tbl" + 19).textContent = boardConf[boardName].best_match_record;
  document.getElementById("questers_memo_tbl" + 21).textContent = boardConf[boardName].black_max_score;
  document.getElementById("questers_memo_tbl" + 23).textContent = boardConf[boardName].black_max_record;
  document.getElementById("questers_memo_tbl" + 25).textContent = boardConf[boardName].white_max_score;
  document.getElementById("questers_memo_tbl" + 27).textContent = boardConf[boardName].white_max_record;
  document.getElementById("questers_memo_tbl" + 29).textContent = boardConf[boardName].black_shortest_move_count;
  document.getElementById("questers_memo_tbl" + 31).textContent = boardConf[boardName].black_shortest_record;
  document.getElementById("questers_memo_tbl" + 33).textContent = boardConf[boardName].white_shortest_move_count;
  document.getElementById("questers_memo_tbl" + 35).textContent = boardConf[boardName].white_shortest_record;
}


function initRecord() {
  document.getElementsByName("record")[0].value = "";
}


function setDiscPalette(id, color) {
  document.getElementById(id).style.color = color;
  document.getElementById(id).textContent = "d";
}


function unSetDiscPalette(id) {
  document.getElementById(id).textContent = "";
}


function putInitialDiscOnUiBoard() {
  const initBlacks = boardConf[boardName].init_black;
  const initWhites = boardConf[boardName].init_white;
  let mask = 1 << 31
  let scoreB = 0;
  let scoreW = 0;
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 8; x++) {
      let indexH = 11 + (y * 10) + x;
      let indexL = 51 + (y * 10) + x;
      putInitialDiscOnUiBoardHalf(indexH, mask, initBlacks[0], initWhites[0]);
      putInitialDiscOnUiBoardHalf(indexL, mask, initBlacks[1], initWhites[1]);
      if ((mask & initBlacks[0]) !== 0) {
        scoreB++;
      }
      if ((mask & initBlacks[1]) !== 0) {
        scoreB++;
      }
      if ((mask & initWhites[0]) !== 0) {
        scoreW++;
      }
      if ((mask & initWhites[1]) !== 0) {
        scoreW++;
      }
      mask >>>= 1;
    }
  }
  setScoreBlack(scoreB);
  setScoreWhite(scoreW);
}


function putInitialDiscOnUiBoardHalf(index, mask, initBlack, initWhite) {
  let andBlack = mask & initBlack;
  let andWhite = mask & initWhite;
  if (andBlack !== 0) {
    putDiscOnUiBoard(BLACK, index);
  }
  else if (andWhite !== 0) {
    putDiscOnUiBoard(WHITE, index);
  }
}


export function putDiscOnUiBoard(color, index) {
  if (getJestEnabled() === false) {
    document
      .getElementById("board" + index)
      .setAttribute("class", getColorString(color).toLowerCase());
  }
}


// update select board
function updateSelectedBoard() {
  const continentBoards = continentConf[continentName].boards;
  const selectBoard = document.getElementsByName('select_board')[0];
  // remove all
  let options = selectBoard.options;
  for (let i = options.length - 1; i >= 0; i--) {
    selectBoard.removeChild(options[i]);
  }
  // add again
  for (let i=0; i<continentBoards.length; i++) {
    const option = document.createElement('option');
    option.value = continentBoards[i];
    option.textContent = continentBoards[i];
    selectBoard.appendChild(option);
  }
}


export function updateUi() {
  if (getJestEnabled() === false) {
    // controlle menu
    const cancel     = document.getElementById('cancel');
    const playRecord = document.getElementById('play_record');
    const startStop  = document.getElementById('start_stop');
    const quester    = document.getElementsByName("select_mode")[0];
    const pioneer    = document.getElementsByName("select_mode")[1];
    const continent  = document.getElementsByName("select_continent")[0];
    const board      = document.getElementsByName("select_board")[0];
    const black      = document.getElementsByName("select_black")[0];
    const white      = document.getElementsByName("select_white")[0];
    const reset      = document.getElementById('pioneers_board_reset');

    switch (getGameState()) {
      case GAME_INIT:
        startStop.textContent = START_BUTTON_TEXT_CONTENT;
        cancel.disabled       = true;
        playRecord.disabled   = true;
        quester.disabled      = false;
        pioneer.disabled      = false;
        continent.disabled    = false;
        board.disabled        = false;
        black.disabled        = false;
        white.disabled        = false;
        reset.disabled        = false;
        initUiBoard();
        if (playRecordMode !== true) {
          initRecord();
        }
        break;
      case GAME_PLAY:
        startStop.textContent = STOP_BUTTON_TEXT_CONTENT;
        cancel.disabled       = false;
        playRecord.disabled   = true;
        quester.disabled      = true;
        pioneer.disabled      = true;
        continent.disabled    = true;
        board.disabled        = true;
        black.disabled        = true;
        white.disabled        = true;
        reset.disabled        = true;
        break;
      case GAME_STOP:
        startStop.textContent = START_BUTTON_TEXT_CONTENT;
        cancel.disabled       = false;
        quester.disabled      = true;
        pioneer.disabled      = true;
        continent.disabled    = true;
        board.disabled        = true;
        black.disabled        = false;
        white.disabled        = false;
        reset.disabled        = true;
        if (document.getElementsByName("record")[0].value.length > 0) {
          playRecord.disabled = false;
        }
        break;
      case GAME_END:
        startStop.textContent = START_BUTTON_TEXT_CONTENT;
        cancel.disabled       = true;
        quester.disabled      = false;
        pioneer.disabled      = false;
        continent.disabled    = false;
        board.disabled        = false;
        black.disabled        = false;
        white.disabled        = false;
        reset.disabled        = false;
        if (document.getElementsByName("record")[0].value.length > 0) {
          playRecord.disabled = false;
        }
        break;
      default:
        // do nothing
        break;
    }

    if (getGameState() === GAME_PLAY && (getPlayerBlack() === HUMAN || getPlayerWhite() === HUMAN || getPlayRecordMode() === true)) {
      setTimeout(() => updateBoardInfo(), UI_WAIT_FLIP_DISC);
    }
    else {
      updateBoardInfo();
    }

    const lastMove = getLastMove();
    const preLastMove = getPreLastMove();
    const lastTurn = getLastTurn();
    if (lastMove !== -1) {
      document.getElementById("board" + lastMove).style.backgroundColor = colorCodeConf[LAST_MOVE_COLOR_CODE];
      if (getGameState() === GAME_PLAY && playRecordMode === false) {
        if (lastTurn === BLACK || lastTurn === WHITE) {
          document.getElementsByName("record")[0].value = document.getElementsByName("record")[0].value + getRecord(lastMove, lastTurn);
        }
      }
    }
    if (preLastMove !== -1) {
      const index = ((Math.floor(preLastMove / BOARD_TABLE_SIZE) - 1) * BOARD_SIZE) + ((preLastMove % 10) - 1);
      const colorCode = boardConf[boardName].color_code[index];
      document.getElementById("board" + preLastMove).style.backgroundColor = colorCodeConf[colorCode];
    }
    if (getGameState() === GAME_END && getGameFinalized()) {
      setGameFinalized(false);
      if (getPlayRecordMode() === false) {
        if (getPlayerBlack() === HUMAN || getPlayerWhite() === HUMAN) {
          setTimeout(() => alert(getGameTurn()), UI_WAIT_TIME);
        }
      }
    }
  }
}


function updateBoardInfo() {
  document.getElementById("turn").textContent        = getTurnString(getGameTurn());
  document.getElementById("count_move").textContent  = getCountMove();
  document.getElementById("score_black").textContent = getScoreBlack();
  document.getElementById("score_white").textContent = getScoreWhite();
  document.getElementById("count_game").textContent  = getCountGame();
}


function getRecord(move, turn) {
  let record = "";
  const x = (move % BOARD_TABLE_SIZE) - 1;
  const y = Math.floor(move / BOARD_TABLE_SIZE);
  record = COLS[x] + y;
  if (turn === BLACK) {
      return record.toUpperCase();
  }
  return record;
}


export function getRecordMove() {
  const record = document.getElementsByName("record")[0].value;
  const countMove = getCountMove() - 1;

  const colIndex = countMove * 2;
  if (colIndex >= record.length) {
    return STOP_PLAY_RECORD;
  }
  const strCol = record.slice(colIndex, colIndex + 1).toLowerCase();
  const col = COLS.indexOf(strCol) + 1;
  if (col === -1) {
    return STOP_PLAY_RECORD;
  }

  const rowIndex = colIndex + 1;
  if (rowIndex >= record.length) {
    return STOP_PLAY_RECORD;
  }
  const row = record.slice(rowIndex, rowIndex + 1);
  if (isNaN(row) === true) {
    return STOP_PLAY_RECORD;
  }
  return Number(row) * BOARD_TABLE_SIZE + Number(col);
}


export function playUiGame() {
  if (playGame() === true) {
    updateUi();
    if ((getPlayerBlack() === HUMAN || getPlayerWhite() === HUMAN) || getPlayRecordMode() === true) {
      setTimeout(() => playUiGame(), UI_WAIT_TIME_LONG);
    }
    else {
      setTimeout(() => playUiGame());
    }
  }
}


export function setHumanClickTrue() {
  humanClick = true;
}


export function setHumanClickFalse() {
  humanClick = false;
}


export function getHumanClick() {
  return humanClick;
}


export function setHumanMove(move) {
  humanMove = move;
}


export function getHumanMove() {
  return humanMove;
}


export function getBoardName() {
  return boardName;
}


export function getPlayRecordMode() {
  return playRecordMode;
}


function getUiBoardIndex(object) {
  return Number(object.getAttribute("id").replace("board", ""));
}


function getColorString(color) {
  if (color === BLACK) {
    return "Black";
  }
  return "White";
}


function getTurnString(turn) {
  if (turn === BLACK) {
    return "Black";
  }
  else if (turn === WHITE) {
    return "White";
  }
  else {
    return turn;
  }
}


function generateCode() {
}
