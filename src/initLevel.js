import * as PIXI from "pixi.js";
import levels from "./levels";
import {
  setTiles,
  setPlayer,
  setGold,
  setSpells,
  setTotalChests,
  setTotalGold,
  setExits,
  setMonsters,
  setMap,
  setTextBlock,
  setSmellRadius,
  setLevel,
  computeFov,
  endGame,
  setKilled,
  setSidebarValues,
  setCollected,
} from "./reducer";

const prepareMap = mapChar => {
  const rows = mapChar.split("\n").filter(row => row !== "");
  return rows.map((row, idx) => {
    return row.split("").map((tileChar, column) => {
      return tileChar;
    });
  });
};

export default function initLevel(levelNumber) {
  return (dispatch, state) => {
    if (levelNumber >= levels.length) {
      return dispatch(endGame());
    }
    const level = levels[levelNumber];
    const rows = prepareMap(level.map);
    dispatch(setMap(rows));
    const tiles = rows.map((row, idx) => {
      return row.map((tileChar, column) => {
        let tile;
        switch (tileChar) {
          case ".":
            tile = new PIXI.Sprite(state.textures.tile);
            break;
          case "*":
            tile = new PIXI.Sprite(state.textures.wall);
            break;
          default:
            throw new Error(`Unrecognized tile char ${tileChar}`);
        }
        tile.position.x = column * 50;
        tile.position.y = idx * 50;
        state.mapContainer.addChild(tile);
        return tile;
      });
    });

    dispatch(setTiles(tiles));

    const item = level.player;
    item.sprite = new PIXI.Sprite(state.textures.player);
    item.sprite.position.x = item.x * 50;
    item.sprite.position.y = item.y * 50;
    state.mapContainer.addChild(item.sprite);
    dispatch(setPlayer({ ...level.player, sprite: item.sprite }));

    const exit = level.exit;
    exit.sprite = new PIXI.Sprite(state.textures.exit);
    exit.sprite.position.x = exit.x * 50;
    exit.sprite.position.y = exit.y * 50;
    state.mapContainer.addChild(exit.sprite);
    dispatch(setExits([{...exit }]));

    let gold = [];
    level.gold.forEach(item => {
      item.sprite = new PIXI.Sprite(state.textures.gold);
      item.sprite.position.x = item.x * 50;
      item.sprite.position.y = item.y * 50;
      state.mapContainer.addChild(item.sprite);
      gold.push({...item})
    });
    dispatch(setGold(gold));
    dispatch(setTotalChests(level.gold.length));

    let monsters = [];
    level.monsters.forEach(item => {
      item.sprite = new PIXI.Sprite(state.textures.monster);
      item.sprite.position.x = item.x * 50;
      item.sprite.position.y = item.y * 50;
      state.mapContainer.addChild(item.sprite);
      monsters.push({...item})
    });
    dispatch(setMonsters(monsters));

    let spells = [];
    level.spells.forEach(item => {
      item.sprite = new PIXI.Sprite(state.textures['spell'+item.type]);
      item.sprite.position.x = item.x * 50;
      item.sprite.position.y = item.y * 50;
      state.mapContainer.addChild(item.sprite);
      spells.push({...item})
    });
    dispatch(setSpells(spells));

    dispatch(setTextBlock(level.text));
    dispatch(setSmellRadius(0));
    dispatch(setLevel(levelNumber));
    dispatch(computeFov());
    dispatch(setKilled(false));
    dispatch(setCollected({gold: 0, chests: 0, spells: 0}));
    dispatch(setTotalChests(level.gold.length));
    dispatch(setTotalGold(level.gold.reduce((acc, curr) => acc + curr.value, 0)));
    dispatch(setSidebarValues({gold: 0, chests: 0}));
  };
}
