import * as PIXI from "pixi.js";
import { createStore } from "./store";
import reducer, {
  setMapContainer,
  setSidebarContainer,
  setApp,
  setTextures,
  mouseOver,
  setSound,
  goNextLevel,
} from "./reducer";
import { click } from "./clickHandler";
import { getMousePos, getMapCoord } from "./util";
import { setupSidebar } from "./sidebar";
import Sound from "./sound";
import WebFont from "webfontloader";

require("./main.css");

function start() {
  const store = initScene();
  const sound = new Sound();
  Promise.all([loadGraphics(), sound.load()]).then(([{ loader, resources }, soundResolution]) => {
    onLoadResources(loader, resources, store);
    store.dispatch(setSound(sound))
  });
}

function loadGraphics() {
  return new Promise((resolve, reject) => {
    PIXI.loader
      .add("floor", "./img/floor.png")
      .add("wall", "./img/wall.png")
      .add("player", "./img/player.png")
      .add("hero_0", "./img/hero_0.png")
      .add("hero_1", "./img/hero_1.png")
      .add("hero_2", "./img/hero_2.png")
      .add("hero_3", "./img/hero_3.png")
      .add("hero_4", "./img/hero_4.png")
      .add("monster", "./img/monster.png")
      .add("gold", "./img/gold.png")
      .add("selectedTile", "./img/selectedTile.png")
      .add("smell", "./img/smell.png")
      .add("exit", "./img/exit.png")
      .add("chest", "./img/chest.png")
      .add("spell1", "./img/spell1.png")
      .add("spell2", "./img/spell2.png")
      .add("spell3", "./img/spell3.png")
      .add("spell4", "./img/spell4.png")
      .load((loader, resources) => {
        resolve({ loader, resources });
      });
  });
}

function initScene() {
  const store = createStore(reducer);
  const app = new PIXI.Application(1500, 1500, {backgroundColor : 0x000000});
  document.getElementById("game").appendChild(app.view);
  setupUIEvents(store, app.view);
  const mapContainer = new PIXI.Container();
  const sidebarContainer = new PIXI.Container();
  app.stage.addChild(mapContainer);
  app.stage.addChild(sidebarContainer);
  store.dispatch(setApp(app));
  store.dispatch(setMapContainer(mapContainer));
  store.dispatch(setSidebarContainer(sidebarContainer));
  return store
}

function setupUIEvents(store, element) {
  element.addEventListener("mousemove", (event) => mouseMove(event, store));
  element.addEventListener("click", (event) => mouseClick(event, store));
}

function mouseMove(event, store) {
  const mousePos = getMousePos(event);
  const tile = getMapCoord(mousePos);
  store.dispatch(mouseOver(tile));
}

function mouseClick(event, store) {
  const mousePos = getMousePos(event);
  const tile = getMapCoord(mousePos);
  store.dispatch(click(tile));
}

function onLoadResources(loader, resources, store) {
  const chars = ["hero_0", "hero_1", "hero_2", "hero_3", "hero_4", "monster", "wall"];
  const items = ["floor", "gold", "selectedTile", "smell", "exit", "chest", "spell1", "spell2", "spell3", "spell4"];
  const textures = items.reduce((acc, name) => {
    acc[name] = new PIXI.Texture(
      resources[name].texture,
      new PIXI.Rectangle(0, 0, 50, 50)
    );
    return acc;
  }, {});
  const charTextures = chars.reduce((acc, name) => {
    acc[name] = new PIXI.Texture(
      resources[name].texture,
      new PIXI.Rectangle(0, 0, 50, 70)
    );
    return acc;
  }, {});
  store.dispatch(setTextures({...textures, ...charTextures}))
  store.dispatch(setupSidebar());
  store.dispatch(goNextLevel());
}

WebFont.load({
  custom: {
      families: ['Pixilator']
  },
  active: function() {
      start();
  }
});
