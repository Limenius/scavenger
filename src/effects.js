import { transformMapToGraph, getBlankMap, findPath } from "./map";
import { Map, compute } from "./fov";
import { flatten } from "./util";
import * as PIXI from "pixi.js";
import Constants from "./constants";

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
    if (map[newY][newX] === ".") {
      return { x: newX, y: newY };
    } else {
      return findNewTile(monster, map);
    }
  };
  const newCoords = findNewTile(monster, state.map);
  return {
    path: [{ x: monster.x, y: monster.y }, newCoords],
    monster: { ...monster, x: newCoords.x, y: newCoords.y }
  };
};

const inSmell = (monster, { smell }) =>
  smell.find(({ x, y }) => monster.x === x && monster.y === y);

const moveToPlayer = (monster, state) => {
  const path = findPath(monster, state.player, state.map);
  if (Constants.MONSTER_MAX_MOVE < path.length) {
    state.sound.play("bad");
  }
  const realPath = path.slice(0, Constants.MONSTER_MAX_MOVE);
  const lastNode = realPath[realPath.length - 1];
  return {
    path: [{ x: monster.x, y: monster.y }, ...realPath],
    monster: { ...monster, x: lastNode.x, y: lastNode.y }
  };
};

function moveMonsters(state) {
  const movements = state.monsters
    .map(monster => {
      if (inSmell(monster, state)) {
        return moveToPlayer(monster, state);
      } else {
        return moveRandomly(monster, state);
      }
    })
    .reduce(
      ({ paths: prevPaths, monsters: prevMonsters }, { path, monster }) => {
        return {
          paths: [...prevPaths, path],
          monsters: [...prevMonsters, monster]
        };
      },
      { paths: [], monsters: [] }
    );
  return { paths: movements.paths, monsters: movements.monsters };
}


function renderFovImmediate(state, center) {
  const grid = new Map(transformMapToGraph(state.map));
  compute(grid, [center.x, center.y], Constants.FOV_RADIUS);
  grid.tiles.forEach((column, idxY) => {
    column.forEach((tile, idxX) => {
      state.tiles[idxX][idxY].alpha = tile.visible ? 1: 0;
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

export {
  exitLevel,
  pickGold,
  moveMonsters,
  renderFovImmediate,
  renderSmell,
  renderTrajectory
};
