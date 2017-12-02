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

const SET_RENDERER = "SET_RENDERER";
const SET_TEXTURES = "SET_TEXTURES";

const initialState = {
  map,
  player: { x: 3, y: 3 },
  monsters: [{ x: 4, y: 5 }, { x: 6, y: 1 }],
  gold: [{ x: 1, y: 4 }, { x: 8, y: 5 }],
  sprites: {},
  textures: {},
  gameState: {},
  renderer: null,
  stage: new PIXI.Container()
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_RENDERER:
      return { ...state, renderer: action.renderer };
    case SET_TEXTURES:
      return { ...state, textures: action.textures };
    default:
      return state;
  }
};

export function setRenderer(renderer) {
  return { type: SET_RENDERER, renderer };
}

export function setTextures(textures) {
  return { type: SET_TEXTURES, textures };
}

export default reducer;
