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
      const graph = new Graph(transformMapToGraph(state.map), {
        diagonal: true
      });
      const start = graph.grid[state.player.x][state.player.y];
      const end = graph.grid[action.coords.x][action.coords.y];
      const result = astar.search(graph, start, end, {
        heuristic: astar.heuristics.diagonal
      });
      if (result.length > 0 && result[result.length - 1].g <= MAX_MOVE) {
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
        return { ...state, entities: { ...state.entities, selectedTile } };
      } else {
        state.entities.selectedTile.position.x = action.coords.x * 50;
        state.entities.selectedTile.position.y = action.coords.y * 50;
        return state;
      }
    default:
      return state;
  }
};

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
