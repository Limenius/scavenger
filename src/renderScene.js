import * as PIXI from "pixi.js";
import { setTiles } from "./reducer";

export default function render(store) {
  const scene = store.getState();
  const rows = scene.map;
  const tiles = rows.map((row, idx) => {
    return row.map((tileChar, column) => {
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
      return tile;
    });
  });

  store.dispatch(setTiles(tiles));

  const item = scene.player;
  item.sprite = new PIXI.Sprite(scene.textures.player);
  item.sprite.position.x = item.x * 50;
  item.sprite.position.y = item.y * 50;
  scene.app.stage.addChild(item.sprite);

  const exit = scene.exit;
  exit.sprite = new PIXI.Sprite(scene.textures.exit);
  exit.sprite.position.x = exit.x * 50;
  exit.sprite.position.y = exit.y * 50;
  scene.app.stage.addChild(exit.sprite);

  scene.gold.forEach(item => {
    item.sprite = new PIXI.Sprite(scene.textures.gold);
    item.sprite.position.x = item.x * 50;
    item.sprite.position.y = item.y * 50;
    scene.app.stage.addChild(item.sprite);
  });

  scene.monsters.forEach(item => {
    item.sprite = new PIXI.Sprite(scene.textures.monster);
    item.sprite.position.x = item.x * 50;
    item.sprite.position.y = item.y * 50;
    scene.app.stage.addChild(item.sprite);
  });
}
