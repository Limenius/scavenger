import * as PIXI from "pixi.js";
const map = `
********************
*..................*
*..................*
*..................*
*..................*
*..................*
********************
`;

function initScene() {
  const renderer = PIXI.autoDetectRenderer(1000, 1000, null, {
    noWebGl: true,
    antialias: false
  });
  document.getElementById("game").appendChild(renderer.view);
  return {
    map: map,
    sprites: {},
    textures: {},
    renderer,
    stage: new PIXI.Container()
  };
}

function loadGraphics() {
  return new Promise((resolve, reject) => {
    PIXI.loader
      .add("tile", "./img/tile.png")
      .add("wall", "./img/wall.png")
      .load((loader, resources) => {
        resolve({ loader, resources });
      });
  });
}

function start() {
  const scene = initScene();
  Promise.all([loadGraphics()]).then(([{ loader, resources }]) => {
    onLoadResources(loader, resources, scene);
  });
}

function onLoadResources(loader, resources, scene) {
  const terrain = ['tile', 'wall'];
  const textures = terrain.reduce((acc, name) => {
    acc[name] = new PIXI.Texture(resources[name].texture, new PIXI.Rectangle(0, 0, 50, 50))
    return acc
  }, {});
  render({
    ...scene,
    textures
  });
}

function render(scene) {
  const rows = scene.map.split("\n").filter(row => row !== '');
  rows.map((row, idx) => {
    console.log(row.split(""));
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
  scene.renderer.render(scene.stage);
  var result = "abc".repeat(2);
}

console.log(map);

start();
