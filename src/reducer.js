import * as PIXI from "pixi.js";
import { astar, Graph } from "./astar";
import { Map, compute } from "./fov";
import initLevel from "./initLevel";
import { createTranslator } from "./translator";

const MAX_MOVE = 6;
const MONSTER_MAX_MOVE = 2;
const FOV_RADIUS = 5;

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

const initialState = {
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
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_STATE:
      return action.state;
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
      return { ...state, collectedGold: action.gold, collectedChests: action.chests };
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
      if (state.textBlock || !state.map) {
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
      renderFov(state, state.player);
      const smell = renderSmell(state, state.player);
      return { ...state, smell };
    default:
      return state;
  }
};

const exitLevel = state => {
  const { player, exits, totalGold } = state;
  let hasFinished = false;
  exits.forEach(exit => {
    if (player.x === exit.x && player.y === exit.y) {
      if (state.smellRadius === totalGold) {
        state.sound.play("lvlup");
        hasFinished = true;
      }
    }
  });
  return hasFinished;
};

const pickGold = state => {
  const index = state.gold.findIndex(({ x, y }) => {
    return x === state.player.x && y === state.player.y;
  });

  if (index !== -1) {
    let gold = state.gold.slice(index + 1).concat(state.gold.slice(0, index));
    state.mapContainer.removeChild(state.gold[index].sprite);
    return {
      ...state,
      gold,
      collectedGold: state.collectedGold + state.gold[index].value,
      collectedChests: state.collectedChests + 1,
      smellRadius: state.smellRadius + state.gold[index].value
    };
  } else {
    return state;
  }
};

const moveRandomly = (monster, state) => {
  const findNewTile = (monster, map) => {
    const newX = Math.floor(Math.random() * 3 - 1 + monster.x);
    const newY = Math.floor(Math.random() * 3 - 1 + monster.y);
    if (map[newX][newY] === ".") {
      return { x: newX, y: newY };
    } else {
      return findNewTile(monster, map);
    }
  };
  const newCoords = findNewTile(monster, state.map);
  monster.sprite.position.x = newCoords.x * 50;
  monster.sprite.position.y = newCoords.y * 50;
  return { ...monster, x: newCoords.x, y: newCoords.y };
};

const inSmell = (monster, { smell }) =>
  smell.find(({ x, y }) => monster.x === x && monster.y === y);

function moveMonsters(state) {
  const monsters = state.monsters.map(monster => {
    if (inSmell(monster, state)) {
      return moveToPlayer(monster, state);
    } else {
      return moveRandomly(monster, state);
    }
  });
  return { ...state, monsters };
}

const moveToPlayer = (monster, state) => {
  const path = findPath(monster, state.player, state.map);
  if (MONSTER_MAX_MOVE < path.length) {
      state.sound.play('bad');
  } else {
      state.sound.play('gameover');
  }
  const realPath = path.slice(0, MONSTER_MAX_MOVE);
  const lastNode = realPath[realPath.length - 1];
  monster.sprite.position.x = lastNode.x * 50;
  monster.sprite.position.y = lastNode.y * 50;
  return { ...monster, x: lastNode.x, y: lastNode.y };
};

export function renderFov(state, center) {
  const grid = new Map(transformMapToGraph(state.map));
  compute(grid, [center.x, center.y], FOV_RADIUS);
  grid.tiles.forEach((column, idxY) => {
    column.forEach((tile, idxX) => {
      state.tiles[idxX][idxY].visible = tile.visible;
      state.monsters.forEach(monster => {
        if (monster.y === idxX && monster.x === idxY) {
          monster.sprite.visible = tile.visible;
        }
      });
      state.gold.forEach(gold => {
        if (gold.y === idxX && gold.x === idxY) {
          gold.sprite.visible = tile.visible;
        }
      });
    });
  });
}

function renderSmell(state, center) {
  const grid = new Map(getBlankMap(state.map));

  if (state.smell) {
    state.smell.forEach(({ sprite }) => state.mapContainer.removeChild(sprite));
  }

  if (state.smellRadius === 0) {
    return [];
  }
  compute(grid, [center.x, center.y], state.smellRadius);
  const sprites = grid.tiles.map((column, idxY) => {
    return column.map((tile, idxX) => {
      if (tile.visible) {
        const sprite = new PIXI.Sprite(state.textures.smell);
        sprite.position.x = idxY * 50;
        sprite.position.y = idxX * 50;
        state.mapContainer.addChild(sprite);
        return { sprite, x: idxY, y: idxX };
      }
      return null;
    });
  });
  return flatten(sprites).filter(sp => sp !== null);
}

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);

function transpose(a) {
  return Object.keys(a[0]).map(function(c) {
    return a.map(function(r) {
      return r[c];
    });
  });
}

const getBlankMap = map => {
  const grid = map.map((row, idx) => {
    return row.map((tileChar, column) => {
      return 1;
    });
  });
  return transpose(grid);
};

const transformMapToGraph = map => {
  const rows = map.filter(row => row !== "");
  const grid = rows.map((row, idx) => {
    return row.map((tileChar, column) => {
      switch (tileChar) {
        case ".":
          return 1;
        case "*":
          return 0;
        default:
          throw new Error(`Unrecognized tile char ${tileChar}`);
      }
    });
  });
  return transpose(grid);
};

function renderTrajectory(state, end) {
  if (state.trajectory) {
    state.trajectory.forEach(node => state.mapContainer.removeChild(node));
  }
  const path = findPath(state.player, end, state.map);
  return path.map(({ x, y, g }) => {
    if (g <= MAX_MOVE) {
      const sprite = new PIXI.Sprite(state.textures.selectedTile);
      sprite.position.x = x * 50;
      sprite.position.y = y * 50;
      state.mapContainer.addChild(sprite);
      return sprite;
    }
    return null;
  });
}

function findPath(start, end, map) {
  const graph = new Graph(transformMapToGraph(map), {
    diagonal: true
  });
  const startNode = graph.grid[start.x][start.y];
  const endNode = graph.grid[end.x][end.y];
  return astar.search(graph, startNode, endNode, {
    heuristic: astar.heuristics.diagonal
  });
}

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

// shameful
export function click(coords) {
  return (dispatch, state) => {
    if (state.killed) {
      state.mapContainer.removeChild(state.textBlock.rectangle);
      dispatch(removeTextBlock());
      return dispatch(restartLevel());
    }
    if (state.textBlock) {
      state.app.stage.removeChild(state.textBlock.rectangle);
      return dispatch(setState({ ...state, textBlock: null }));
    }
    const path = findPath(state.player, coords, state.map);
    if (path.length > 0 && path[path.length - 1].g <= MAX_MOVE) {
      const newState = {
        ...state,
        player: { ...state.player, x: coords.x, y: coords.y }
      };
      renderFov(newState, coords);
      const st = moveMonsters(newState);
      if (monstersKillPlayer(st)) {
        st.sound.play("lvlup");
        return dispatch(killed());
      }
      const st2 = pickGold(st);

      const animator = createTranslator(path, state.player.sprite, state.app.ticker)
      state.app.ticker.add(animator());

      // can do this one because it is only side effects.
      dispatch(
        setCollected({ chests: st2.collectedChests, gold: st2.collectedGold })
      );
      renderFov(st2, coords);
      const smell = renderSmell(st2, coords);
      const hasFinished = exitLevel(st2);
      if (hasFinished) {
        return dispatch(goNextLevel());
      } else {
        return dispatch(setState({ ...st2, smell }));
      }
    } else {
      return dispatch(setState(state));
    }
  };
}

const monstersKillPlayer = ({ monsters, player }) =>
  !!monsters.find(({ x, y }) => x === player.x && y === player.y);

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

export function setCollected({ gold, chests }) {
  return (dispatch, state) => {
    dispatch({ type: SET_COLLECTED, gold, chests });
    dispatch(setSidebarValues({ gold, chests }));
  };
}

export function setSidebarValues({ chests, gold }) {
  return (dispatch, state) => {
    const totalGold = state.totalGold;
    const totalChests = state.totalChests;
    state.sidebar.chests.text = `${chests}/${totalChests}`;
    state.sidebar.gold.text = `${gold}/${totalGold}`;
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
  sprite.x = 800;
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
