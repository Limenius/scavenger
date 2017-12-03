import * as PIXI from "pixi.js";
import { astar, Graph } from "./astar";
import { Map, compute } from "./fov";

const MAX_MOVE = 6;
const MONSTER_SPEED = 2;

const mapChar = `
********************
*..................*
*..................*
*........*.........*
*........*.........*
*..................*
*........*.........*
*........*.........*
*..................*
*........*.........*
*........*.........*
*..................*
*........*.........*
*........*.........*
*..................*
*........*.........*
*........*.........*
*..................*
*........*.........*
*........*.........*
*........*........**
********************
`;

const prepareMap = mapChar => {
  const rows = mapChar.split("\n").filter(row => row !== "");
  return rows.map((row, idx) => {
    return row.split("").map((tileChar, column) => {
      return tileChar;
    });
  });
};

const map = prepareMap(mapChar);

const SET_APP = "SET_APP";
const SET_SOUND = "SET_SOUND";
const SET_TEXTURES = "SET_TEXTURES";
const SET_TILES = "SET_TILES";
const MOUSE_OVER = "MOUSE_OVER";
const COMPUTE_FOV = "COMPUTE_FOV";
const CLICK = "CLICK";

const initialState = {
  map,
  smellRadius: 3,
  tiles: null,
  player: { x: 3, y: 3, sprite: null },
  monsters: [{ x: 4, y: 5, sprite: null }, { x: 6, y: 1, sprite: null }],
  gold: [{ x: 1, y: 4, sprite: null }, { x: 8, y: 5, sprite: null }],
  sprites: {},
  textures: {},
  gameState: {},
  renderer: null,
  trajectory: [],
  entities: {},
  smell: [],
  sound: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP:
      return { ...state, app: action.app };
    case SET_SOUND:
      return { ...state, sound: action.sound };
    case SET_TEXTURES:
      return { ...state, textures: action.textures };
    case SET_TILES:
      return { ...state, tiles: action.tiles };
    case CLICK:
      const path = findPath(state.player, action.coords, state.map);
      if (path.length > 0 && path[path.length - 1].g <= MAX_MOVE) {
        state.player.sprite.position.x = action.coords.x * 50;
        state.player.sprite.position.y = action.coords.y * 50;
        const smell = renderSmell(state, action.coords);
        const newState = {
          ...state,
          player: { ...state.player, x: action.coords.x, y: action.coords.y },
          smell
        };
        renderFov(newState, action.coords);
        //return newState;
        const st = moveMonsters(newState);
        state.sound.play('blub');
        renderFov(st, action.coords);
        return st;
      } else {
        return state;
      }
    case MOUSE_OVER:
      if (!state.entities.selectedTile) {
        const selectedTile = new PIXI.Sprite(state.textures.selectedTile);
        selectedTile.position.x = action.coords.x * 50;
        selectedTile.position.y = action.coords.y * 50;
        state.app.stage.addChild(selectedTile);
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
  const realPath = path.slice(0, MONSTER_SPEED);
  const lastNode = realPath[realPath.length - 1];
  monster.sprite.position.x = lastNode.x * 50;
  monster.sprite.position.y = lastNode.y * 50;
  return { ...monster, x: lastNode.x, y: lastNode.y };
};

function renderFov(state, center) {
  const grid = new Map(transformMapToGraph(state.map));
  compute(grid, [center.x, center.y], 10);
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
    state.smell.forEach(({ sprite }) => state.app.stage.removeChild(sprite));
  }

  compute(grid, [center.x, center.y], state.smellRadius);
  const sprites = grid.tiles.map((column, idxY) => {
    return column.map((tile, idxX) => {
      if (tile.visible) {
        const sprite = new PIXI.Sprite(state.textures.smell);
        sprite.position.x = idxY * 50;
        sprite.position.y = idxX * 50;
        state.app.stage.addChild(sprite);
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
    state.trajectory.forEach(node => state.app.stage.removeChild(node));
  }
  const path = findPath(state.player, end, state.map);
  return path.map(({ x, y, g }) => {
    if (g <= MAX_MOVE) {
      const sprite = new PIXI.Sprite(state.textures.selectedTile);
      sprite.position.x = x * 50;
      sprite.position.y = y * 50;
      state.app.stage.addChild(sprite);
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

export function setSound(sound) {
  return { type: SET_SOUND, sound };
}

export function setTextures(textures) {
  return { type: SET_TEXTURES, textures };
}

export function mouseOver(coords) {
  return { type: MOUSE_OVER, coords };
}

export function click(coords) {
  return { type: CLICK, coords };
}

export function computeFOV(coords) {
  return { type: COMPUTE_FOV, coords };
}

export function setTiles(tiles) {
  return { type: SET_TILES, tiles };
}

export default reducer;
