import * as PIXI from "pixi.js";
import { createStore } from "./store";
import reducer, { setApp, setTextures, mouseOver, click, computeFOV, setSound } from "./reducer";
import { getMousePos, getMapCoord } from "./util";
import setupScene from "./renderScene"
import Sound from "./sound";

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
      .add("tile", "./img/tile.png")
      .add("wall", "./img/wall.png")
      .add("player", "./img/player.png")
      .add("monster", "./img/monster.png")
      .add("gold", "./img/gold.png")
      .add("selectedTile", "./img/selectedTile.png")
      .add("smell", "./img/smell.png")
      .add("exit", "./img/exit.png")
      .load((loader, resources) => {
        resolve({ loader, resources });
      });
  });
}

function initScene() {
  const store = createStore(reducer);
  const app = new PIXI.Application(1000, 1000, {backgroundColor : 0x000000});
  document.getElementById("game").appendChild(app.view);
  setupUIEvents(store, app.view);
  return store.dispatch(setApp(app));
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
  const items = ["tile", "wall", "player", "monster", "gold", "selectedTile", "smell", "exit"];
  const textures = items.reduce((acc, name) => {
    acc[name] = new PIXI.Texture(
      resources[name].texture,
      new PIXI.Rectangle(0, 0, 50, 50)
    );
    return acc;
  }, {});
  setupScene(store.dispatch(setTextures(textures)));
  store.dispatch(computeFOV());
}

start();
