import * as PIXI from "pixi.js";
import { createStore } from "./store";
import reducer, { setRenderer, setTextures } from "./reducer";

function initScene() {
  const store = createStore(reducer);
  const renderer = PIXI.autoDetectRenderer(1000, 1000, null, {
    noWebGl: true,
    antialias: false
  });
  document.getElementById("game").appendChild(renderer.view);
  setupUIEvents(renderer.view);
  return store.dispatch(setRenderer(renderer));
}

function setupUIEvents(element) {
  element.addEventListener("mousemove", mouseMove);
  //renderer.view.addEventListener('click', click);
}

function mouseMove(event) {
  const mousePos = getMousePos(event);
  const tile = getMapCoord(mousePos);
  console.log(tile);
}

function getMapCoord({x, y}) {
  return { x: Math.floor(x / 50), y: Math.floor(y / 50) };
}

function getMousePos(evt) {
  var canvas = document.querySelector("canvas");
  var rect = canvas.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function loadGraphics() {
  return new Promise((resolve, reject) => {
    PIXI.loader
      .add("tile", "./img/tile.png")
      .add("wall", "./img/wall.png")
      .add("player", "./img/player.png")
      .add("monster", "./img/monster.png")
      .add("gold", "./img/gold.png")
      .load((loader, resources) => {
        resolve({ loader, resources });
      });
  });
}

function start() {
  const store = initScene();
  Promise.all([loadGraphics()]).then(([{ loader, resources }]) => {
    onLoadResources(loader, resources, store);
  });
}

function onLoadResources(loader, resources, store) {
  const items = ["tile", "wall", "player", "monster", "gold"];
  const textures = items.reduce((acc, name) => {
    acc[name] = new PIXI.Texture(
      resources[name].texture,
      new PIXI.Rectangle(0, 0, 50, 50)
    );
    return acc;
  }, {});
  render(store.dispatch(setTextures(textures)));
}

function render(store) {
  const scene = store.getState();
  const rows = scene.map.split("\n").filter(row => row !== "");
  rows.map((row, idx) => {
    row.split("").map((tileChar, column) => {
      let tile;
      switch (tileChar) {
        case ".":
          tile = new PIXI.Sprite(scene.textures.tile);
          break;
        case "*":
          tile = new PIXI.Sprite(scene.textures.wall);
          break;
        default:
          throw `Unrecognized tile char ${tileChar}`;
      }
      tile.position.x = column * 50;
      tile.position.y = idx * 50;
      scene.stage.addChild(tile);
    });
  });
  const player = new PIXI.Sprite(scene.textures.player);
  player.position.x = scene.player.x * 50;
  player.position.y = scene.player.y * 50;
  scene.stage.addChild(player);

  scene.gold.forEach(({ x, y }) => {
    const gold = new PIXI.Sprite(scene.textures.gold);
    gold.position.x = x * 50;
    gold.position.y = y * 50;
    scene.stage.addChild(gold);
  });

  scene.monsters.forEach(({ x, y }) => {
    const monster = new PIXI.Sprite(scene.textures.monster);
    monster.position.x = x * 50;
    monster.position.y = y * 50;
    scene.stage.addChild(monster);
  });

  scene.renderer.render(scene.stage);
  var result = "abc".repeat(2);
}

start();
