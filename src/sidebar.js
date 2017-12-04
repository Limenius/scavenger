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
    gold.position.x = 1550;
    gold.position.y = 10;
    rectangle.addChild(gold);

    const textGold = new PIXI.Text("", {
      fontFamily: "Pixilator",
      fontSize: "30px",
      fill: 0xeeeeee,
      "text-align": "center"
    });
    textGold.anchor.set(0.5, 0.5);
    textGold.x = 1700;
    textGold.y = 35;
    rectangle.addChild(textGold);

    const chest = new PIXI.Sprite(state.textures.chest);
    chest.position.x = 1550;
    chest.position.y = 60;
    rectangle.addChild(chest);

    const textChest = new PIXI.Text("", {
      fontFamily: "Pixilator",
      fontSize: "30px",
      fill: 0xeeeeee,
      "text-align": "center"
    });
    textChest.anchor.set(0.5, 0.5);
    textChest.x = 1700;
    textChest.y = 85;
    rectangle.addChild(textChest);

    const spells1 = new PIXI.Sprite(state.textures.spell1);
    spells1.position.x = 1550;
    spells1.position.y = 110;
    rectangle.addChild(spells1);

    const textSpells1 = new PIXI.Text("", {
      fontFamily: "Pixilator",
      fontSize: "30px",
      fill: 0xeeeeee,
      "text-align": "center"
    });
    textSpells1.anchor.set(0.5, 0.5);
    textSpells1.x = 1700;
    textSpells1.y = 135;
    rectangle.addChild(textSpells1);

    const spells2 = new PIXI.Sprite(state.textures.spell2);
    spells2.position.x = 1550;
    spells2.position.y = 160;
    rectangle.addChild(spells2);

    const textSpells2 = new PIXI.Text("", {
      fontFamily: "Pixilator",
      fontSize: "30px",
      fill: 0xeeeeee,
      "text-align": "center"
    });
    textSpells2.anchor.set(0.5, 0.5);
    textSpells2.x = 1700;
    textSpells2.y = 185;
    rectangle.addChild(textSpells2);

    state.sidebarContainer.addChild(rectangle);
    dispatch(setSidebar({chests: textChest, gold: textGold, spells1: textSpells1, spells2: textSpells2}))
  };
}
