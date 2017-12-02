import * as PIXI from "pixi.js";
import { astar, Graph } from "./astar";

const map = `
********************
*..................*
*..................*
*..................*
*..................*
*.................**
*******************
`;

const SET_APP = "SET_APP";
const SET_TEXTURES = "SET_TEXTURES";
const MOUSE_OVER = "MOUSE_OVER";
const CLICK = "CLICK";

const MAX_MOVE = 5;

const initialState = {
  map,
  player: { x: 3, y: 3, sprite: null },
  monsters: [{ x: 4, y: 5, sprite: null }, { x: 6, y: 1, sprite: null }],
  gold: [{ x: 1, y: 4, sprite: null }, { x: 8, y: 5, sprite: null }],
  sprites: {},
  textures: {},
  gameState: {},
  renderer: null,
  trajectory: [],
  entities: {}
};

function transpose(a) {
  return Object.keys(a[0]).map(function(c) {
    return a.map(function(r) {
      return r[c];
    });
  });
}

const transformMapToGraph = map => {
  const rows = map.split("\n").filter(row => row !== "");
  const grid = rows.map((row, idx) => {
    return row.split("").map((tileChar, column) => {
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

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP:
      return { ...state, app: action.app };
    case SET_TEXTURES:
      return { ...state, textures: action.textures };
    case CLICK:
      const path = findPath(state.player, action.coords, state.map);
      if (path.length > 0 && path[path.length - 1].g <= MAX_MOVE) {
        state.player.sprite.position.x = action.coords.x * 50;
        state.player.sprite.position.y = action.coords.y * 50;
        return {
          ...state,
          player: { ...state.player, x: action.coords.x, y: action.coords.y }
        };
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
    default:
      return state;
  }
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

export function setTextures(textures) {
  return { type: SET_TEXTURES, textures };
}

export function mouseOver(coords) {
  return { type: MOUSE_OVER, coords };
}

export function click(coords) {
  return { type: CLICK, coords };
}

export default reducer;
