import * as PIXI from "pixi.js";
import {
  setSidebar,
} from "./reducer";

export function setupSidebar() {
  return (dispatch, state) => {
    var rectangle = new PIXI.Graphics();

    rectangle.beginFill(0x0000000);
    rectangle.lineStyle(2, 0xffffff);
    rectangle.drawRect(1500, 0, 300, 1800);

    const gold = new PIXI.Sprite(state.textures.gold);
    gold.position.x = 1510;
    gold.position.y = 10;
    rectangle.addChild(gold);

    const sprite = new PIXI.Text("", {
      fontFamily: "Pixilator",
      fontSize: "18px",
      fill: 0xeeeeee,
      "text-align": "center"
    });
    sprite.anchor.set(0.5, 0.5);
    sprite.x = 1560;
    sprite.y = 10;
    rectangle.addChild(sprite);

    const chest = new PIXI.Sprite(state.textures.chest);
    chest.position.x = 1510;
    chest.position.y = 60;
    rectangle.addChild(chest);

    const textChest = new PIXI.Text("", {
      fontFamily: "Pixilator",
      fontSize: "18px",
      fill: 0xeeeeee,
      "text-align": "center"
    });
    textChest.anchor.set(0.5, 0.5);
    textChest.x = 1560;
    textChest.y = 60;
    rectangle.addChild(textChest);

    state.sidebarContainer.addChild(rectangle);
    dispatch(setSidebar({chests: textChest, gold: sprite}))
  };
}
