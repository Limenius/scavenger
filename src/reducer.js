import * as PIXI from "pixi.js";
import initLevel from "./initLevel";
import { renderFovImmediate, renderTrajectory, renderSmell } from "./effects"

const SET_APP = "SET_APP";
const SET_MAP_CONTAINER = "SET_MAP_CONTAINER";
const SET_SIDEBAR_CONTAINER = "SET_SIDEBAR_CONTAINER";
const SET_SMELL_RADIUS = "SET_SMELL_RADIUS";
const SET_TEXT_BLOCK = "SET_TEXT_BLOCK";
const REMOVE_TEXT_BLOCK = "REMOVE_TEXT_BLOCK";
const SET_SOUND = "SET_SOUND";
const SET_TEXTURES = "SET_TEXTURES";
const SET_TILES = "SET_TILES";
const MOUSE_OVER = "MOUSE_OVER";
const COMPUTE_FOV = "COMPUTE_FOV";
const SET_STATE = "SET_STATE";
const SET_PLAYER = "SET_PLAYER";
const SET_GOLD = "SET_GOLD";
const SET_SPELLS = "SET_SPELLS";
const SET_TOTAL_GOLD = "SET_TOTAL_GOLD";
const SET_TOTAL_CHESTS = "SET_TOTAL_CHESTS";
const SET_MONSTERS = "SET_MONSTERS";
const SET_EXITS = "SET_EXITS";
const SET_MAP = "SET_MAP";
const SET_LEVEL = "SET_LEVEL";
const SET_KILLED = "SET_KILLED";
const SET_SIDEBAR = "SET_SIDEBAR";
const SET_COLLECTED = "SET_COLLECTED";
const SET_SCROLL = "SET_SCROLL";
const DISABLE_UI = "DISABLE_UI";
const ENABLE_UI = "ENABLE_UI";

const initialState = {
  uiEnabled: true,
  scroll: {x: 0, y: 0},
  sidebar: { gold: null, chests: null},
  map: null,
  smellRadius: 0,
  level: null,
  tiles: null,
  totalGold: null,
  totalChests: null,
  player: null,
  monsters: null,
  exits: null,
  gold: null,
  spells: null,
  sprites: {},
  textures: {},
  gameState: {},
  renderer: null,
  trajectory: [],
  entities: {},
  textBlock: null,
  smell: [],
  sound: null,
  killed: false,
  collectedChests: 0,
  collectedGold: 0,
  collectedSpells1: 0,
  collectedSpells2: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state;
    case DISABLE_UI:
      return { ...state, uiEnabled: false };
    case ENABLE_UI:
      return { ...state, uiEnabled: true };
    case SET_MAP:
      return { ...state, map: action.map };
    case SET_SIDEBAR_CONTAINER:
      return { ...state, sidebarContainer: action.sidebarContainer };
    case SET_MAP_CONTAINER:
    return { ...state, mapContainer: action.mapContainer };
    case SET_SIDEBAR:
      return { ...state, sidebar: action.sidebar };
    case SET_LEVEL:
      return { ...state, level: action.level };
    case SET_COLLECTED:
      return { ...state, collectedGold: action.gold, collectedChests: action.chests, collectedSpells1: action.spells1, collectedSpells2: action.spells2 };
    case SET_APP:
      return { ...state, app: action.app };
    case SET_KILLED:
      return { ...state, killed: action.value };
    case SET_SOUND:
      return { ...state, sound: action.sound };
    case SET_TEXTURES:
      return { ...state, textures: action.textures };
    case SET_TILES:
      return { ...state, tiles: action.tiles };
    case SET_PLAYER:
      return { ...state, player: action.player };
    case SET_MONSTERS:
      return { ...state, monsters: action.monsters };
    case SET_GOLD:
      return { ...state, gold: action.gold };
    case SET_SPELLS:
      return { ...state, spells: action.spells };
    case SET_SCROLL:
      return { ...state, scroll: { x: action.x, y: action.y } };
    case SET_TOTAL_CHESTS:
      return { ...state, totalChests: action.totalChests };
    case SET_TOTAL_GOLD:
      return { ...state, totalGold: action.totalGold };
    case SET_SMELL_RADIUS:
      return { ...state, smellRadius: action.value };
    case SET_EXITS:
      return { ...state, exits: action.exits };
    case SET_TEXT_BLOCK:
      state.app.stage.addChild(action.rectangle);
      return {
        ...state,
        textBlock: { text: action.sprite, rectangle: action.rectangle }
      };
    case REMOVE_TEXT_BLOCK:
      state.app.stage.removeChild(state.textBlock.rectangle);
      return state;
    case MOUSE_OVER:
      if (state.textBlock || !state.map || !state.uiEnabled) {
        return state;
      }
      if (!state.entities.selectedTile) {
        const selectedTile = new PIXI.Sprite(state.textures.selectedTile);
        selectedTile.position.x = action.coords.x * 50;
        selectedTile.position.y = action.coords.y * 50;
        state.mapContainer.addChild(selectedTile);
        const trajectory = renderTrajectory(state, action.coords);
        return {
          ...state,
          trajectory,
          entities: { ...state.entities, selectedTile }
        };
      } else {
        state.entities.selectedTile.position.x = action.coords.x * 50;
        state.entities.selectedTile.position.y = action.coords.y * 50;
        const trajectory = renderTrajectory(state, action.coords);
        return { ...state, trajectory };
      }
    case COMPUTE_FOV:
      renderFovImmediate(state, state.player);
      const smell = renderSmell(state, state.player);
      return { ...state, smell };
    default:
      return state;
  }
};

export function setApp(app) {
  return { type: SET_APP, app };
}

export function setSidebarContainer(sidebarContainer) {
  return { type: SET_SIDEBAR_CONTAINER, sidebarContainer };
}

export function setMapContainer(mapContainer) {
  return { type: SET_MAP_CONTAINER, mapContainer };
}

export function setSound(sound) {
  return { type: SET_SOUND, sound };
}

export function setTextures(textures) {
  return { type: SET_TEXTURES, textures };
}

export function setSmellRadius(value) {
  return { type: SET_SMELL_RADIUS, value };
}

export function mouseOver(coords) {
  return { type: MOUSE_OVER, coords };
}

export function endGame() {
  return dispatch => dispatch(setTextBlock("END GAME"));
}

export function killed() {
  return dispatch => {
    dispatch(setTextBlock("DEAD. Click to retry level"));
    dispatch(setKilled(true));
  };
}

export function setKilled(value) {
  return { type: SET_KILLED, value };
}

export function restartLevel() {
  return (dispatch, state) => {
    dispatch(cleanMap());
    return dispatch(initLevel(state.level));
  };
}

export function goNextLevel() {
  return (dispatch, state) => {
    let level;
    if (state.level === null) {
      level = 0;
    } else {
      dispatch(cleanMap());
      level = state.level + 1;
    }
    return dispatch(initLevel(level));
  };
}

const cleanMap = () => (dispatch, state) => {
  state.mapContainer.removeChild(state.player.sprite);
  state.monsters.forEach(({ sprite }) => state.mapContainer.removeChild(sprite));
  state.gold.forEach(({ sprite }) => state.mapContainer.removeChild(sprite));
  state.exits.forEach(({ sprite }) => state.mapContainer.removeChild(sprite));
  state.tiles.forEach((row) => row.forEach((sprite) => sprite.visible = false));
};


export function setState(state) {
  return { type: SET_STATE, state };
}

export function computeFov(coords) {
  return { type: COMPUTE_FOV, coords };
}

export function setTiles(tiles) {
  return { type: SET_TILES, tiles };
}

export function setPlayer(player) {
  return { type: SET_PLAYER, player };
}

export function setGold(gold) {
  return { type: SET_GOLD, gold };
}

export function setSpells(spells) {
  return { type: SET_SPELLS, spells };
}

export function setMonsters(monsters) {
  return { type: SET_MONSTERS, monsters };
}

export function setExits(exits) {
  return { type: SET_EXITS, exits };
}

export function setMap(map) {
  return { type: SET_MAP, map };
}

export function setTotalGold(totalGold) {
  return { type: SET_TOTAL_GOLD, totalGold };
}

export function setTotalChests(totalChests) {
  return { type: SET_TOTAL_CHESTS, totalChests };
}

export function setLevel(level) {
  return { type: SET_LEVEL, level };
}

export function removeTextBlock() {
  return { type: REMOVE_TEXT_BLOCK };
}

export function setScroll({ x, y }) {
  return { type: SET_SCROLL, x, y };
}

export function setSidebar(sidebar) {
  return { type: SET_SIDEBAR, sidebar };
}

export function disableUI() {
  return { type: DISABLE_UI };
}

export function enableUI() {
  return { type: ENABLE_UI };
}

export function setCollected({ gold, chests, spells1, spells2 }) {
  return (dispatch, state) => {
    dispatch({ type: SET_COLLECTED, gold, chests, spells1, spells2 });
    dispatch(setSidebarValues({ gold, chests, spells1, spells2 }));
  };
}

export function setSidebarValues({ chests, gold, spells1, spells2 }) {
  return (dispatch, state) => {
    const totalGold = state.totalGold;
    const totalChests = state.totalChests;
    state.sidebar.chests.text = `${chests}/${totalChests}`;
    state.sidebar.gold.text = `${gold}/${totalGold}`;
    state.sidebar.spells1.text = `${spells1}`;
    state.sidebar.spells2.text = `${spells2}`;
  };
}

export function setTextBlock(text) {
  const sprite = new PIXI.Text(text, {
    fontFamily: "Pixilator",
    fontSize: "18px",
    fill: 0xeeeeee,
    "text-align": "center"
  });
  sprite.anchor.set(0.5, 0.5);
  sprite.x = 850;
  sprite.y = 350;
  var rectangle = new PIXI.Graphics();

  rectangle.beginFill(0x0000000);

  // set the line style to have a width of 5 and set the color to red
  rectangle.lineStyle(2, 0xffffff);

  // draw a rectangle
  rectangle.drawRect(550, 100, 600, 600);
  rectangle.addChild(sprite);
  return { type: SET_TEXT_BLOCK, rectangle: rectangle };
}

export default reducer;
