import * as PIXI from "pixi.js";

export default function render(store) {
  const scene = store.getState();
  const rows = scene.map.split("\n").filter(row => row !== "");
  rows.forEach((row, idx) => {
    row.split("").forEach((tileChar, column) => {
      let tile;
      switch (tileChar) {
        case ".":
          tile = new PIXI.Sprite(scene.textures.tile);
          break;
        case "*":
          tile = new PIXI.Sprite(scene.textures.wall);
          break;
        default:
          throw new Error(`Unrecognized tile char ${tileChar}`);
      }
      tile.position.x = column * 50;
      tile.position.y = idx * 50;
      scene.app.stage.addChild(tile);
    });
  });

  const player = new PIXI.Sprite(scene.textures.player);
  player.position.x = scene.player.x * 50;
  player.position.y = scene.player.y * 50;
  scene.app.stage.addChild(player);

  scene.gold.forEach(({ x, y }) => {
    const gold = new PIXI.Sprite(scene.textures.gold);
    gold.position.x = x * 50;
    gold.position.y = y * 50;
    scene.app.stage.addChild(gold);
  });

  scene.monsters.forEach(({ x, y }) => {
    const monster = new PIXI.Sprite(scene.textures.monster);
    monster.position.x = x * 50;
    monster.position.y = y * 50;
    scene.app.stage.addChild(monster);
  });

}
