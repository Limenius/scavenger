import { transformMapToGraph, getBlankMap, findPath } from "./map"
import { Map, compute } from "./fov";
import * as PIXI from "pixi.js";
import Constants from "./constants"

const exitLevel = state => {
  const { player, exits, totalGold } = state;
  let hasFinished = false;
  exits.forEach(exit => {
    if (player.x === exit.x && player.y === exit.y) {
      if (state.smellRadius === totalGold) {
        state.sound.play("lvlup");
        hasFinished = true;
      }
    }
  });
  return hasFinished;
};

const pickGold = state => {
  const index = state.gold.findIndex(({ x, y }) => {
    return x === state.player.x && y === state.player.y;
  });

  if (index !== -1) {
    let gold = state.gold.slice(index + 1).concat(state.gold.slice(0, index));
    state.mapContainer.removeChild(state.gold[index].sprite);
    return {
      ...state,
      gold,
      collectedGold: state.collectedGold + state.gold[index].value,
      collectedChests: state.collectedChests + 1,
      smellRadius: state.smellRadius + state.gold[index].value
    };
  } else {
    return state;
  }
};

const moveRandomly = (monster, state) => {
  const findNewTile = (monster, map) => {
    const newX = Math.floor(Math.random() * 3 - 1 + monster.x);
    const newY = Math.floor(Math.random() * 3 - 1 + monster.y);
    if (map[newX][newY] === ".") {
      return { x: newX, y: newY };
    } else {
      return findNewTile(monster, map);
    }
  };
  const newCoords = findNewTile(monster, state.map);
  monster.sprite.position.x = newCoords.x * 50;
  monster.sprite.position.y = newCoords.y * 50;
  return { ...monster, x: newCoords.x, y: newCoords.y };
};

const inSmell = (monster, { smell }) =>
  smell.find(({ x, y }) => monster.x === x && monster.y === y);


const moveToPlayer = (monster, state) => {
  const path = findPath(monster, state.player, state.map);
  if (Constants.MONSTER_MAX_MOVE < path.length) {
      state.sound.play('bad');
  } else {
      state.sound.play('gameover');
  }
  const realPath = path.slice(0, Constants.MONSTER_MAX_MOVE);
  const lastNode = realPath[realPath.length - 1];
  monster.sprite.position.x = lastNode.x * 50;
  monster.sprite.position.y = lastNode.y * 50;
  return { ...monster, x: lastNode.x, y: lastNode.y };
};

function moveMonsters(state) {
  const monsters = state.monsters.map(monster => {
    if (inSmell(monster, state)) {
      return moveToPlayer(monster, state);
    } else {
      return moveRandomly(monster, state);
    }
  });
  return { ...state, monsters };
}

function renderFov(state, center) {
  const grid = new Map(transformMapToGraph(state.map));
  compute(grid, [center.x, center.y], Constants.FOV_RADIUS);
  grid.tiles.forEach((column, idxY) => {
    column.forEach((tile, idxX) => {
      state.tiles[idxX][idxY].visible = tile.visible;
      state.monsters.forEach(monster => {
        if (monster.y === idxX && monster.x === idxY) {
          monster.sprite.visible = tile.visible;
        }
      });
      state.gold.forEach(gold => {
        if (gold.y === idxX && gold.x === idxY) {
          gold.sprite.visible = tile.visible;
        }
      });
    });
  });
}

function renderSmell(state, center) {
  const grid = new Map(getBlankMap(state.map));

  if (state.smell) {
    state.smell.forEach(({ sprite }) => state.mapContainer.removeChild(sprite));
  }

  if (state.smellRadius === 0) {
    return [];
  }
  compute(grid, [center.x, center.y], state.smellRadius);
  const sprites = grid.tiles.map((column, idxY) => {
    return column.map((tile, idxX) => {
      if (tile.visible) {
        const sprite = new PIXI.Sprite(state.textures.smell);
        sprite.position.x = idxY * 50;
        sprite.position.y = idxX * 50;
        state.mapContainer.addChild(sprite);
        return { sprite, x: idxY, y: idxX };
      }
      return null;
    });
  });
  return flatten(sprites).filter(sp => sp !== null);
}

const flatten = list =>
  list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []);


function renderTrajectory(state, end) {
  if (state.trajectory) {
    state.trajectory.forEach(node => state.mapContainer.removeChild(node));
  }
  const path = findPath(state.player, end, state.map);
  return path.map(({ x, y, g }) => {
    if (g <= Constants.MAX_MOVE) {
      const sprite = new PIXI.Sprite(state.textures.selectedTile);
      sprite.position.x = x * 50;
      sprite.position.y = y * 50;
      state.mapContainer.addChild(sprite);
      return sprite;
    }
    return null;
  });
}

export { exitLevel, pickGold, moveMonsters, renderFov, renderSmell, renderTrajectory };