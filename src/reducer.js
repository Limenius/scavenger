import * as PIXI from "pixi.js";

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

const initialState = {
  map,
  player: { x: 3, y: 3 },
  monsters: [{ x: 4, y: 5 }, { x: 6, y: 1 }],
  gold: [{ x: 1, y: 4 }, { x: 8, y: 5 }],
  sprites: {},
  textures: {},
  gameState: {},
  renderer: null,
  entities: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_APP:
      return { ...state, app: action.app };
    case SET_TEXTURES:
      return { ...state, textures: action.textures };
    case MOUSE_OVER:
      if (!state.entities.selectedTile) {
        const selectedTile = new PIXI.Sprite(state.textures.selectedTile);
        selectedTile.position.x = action.coords.x * 50;
        selectedTile.position.y = action.coords.y * 50;
        state.app.stage.addChild(selectedTile);
        return { ...state, entities: {...state.entities, selectedTile} };
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

export default reducer;
