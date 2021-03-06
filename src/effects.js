import { transformMapToGraph, getBlankMap, findPath } from "./map";
import { Map, compute } from "./fov";
import { flatten } from "./util";
import * as PIXI from "pixi.js";
import Constants from "./constants";

export function removeSmell() {
  return (dispatch, state) => state.smell.forEach(smell => state.mapContainer.removeChild(smell.sprite))
}

const exitLevel = state => {
  const { player, exits } = state;
  let hasFinished = false;
  exits.forEach(exit => {
    if (player.x === exit.x && player.y === exit.y) {
      if (state.gold.length === 0) {
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
    state.sound.play("coins");
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

const pickSpells = state => {
  const index = state.spells.findIndex(({ x, y }) => {
    return x === state.player.x && y === state.player.y;
  });

  if (index !== -1) {
    let spells = state.spells.slice(index + 1).concat(state.spells.slice(0, index));
    state.mapContainer.removeChild(state.spells[index].sprite);
    state.sound.play("blub");
    switch (state.spells[index].type) {
        case 1:
            return {
              ...state,
              spells,
              collectedSpells1: state.collectedSpells1 + 1,
              smellRadius: state.smellRadius * 0
            };
        case 2:
            return {
              ...state,
              spells,
              collectedSpells2: state.collectedSpells2 + 1,
              smellRadius: 10
            };
        default:
            return state;
    }
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

export function inSmell(monster, { smell }) {
  return smell.find(({ x, y }) => monster.x === x && monster.y === y);
}

const moveToPlayer = (monster, state) => {
  const path = findPath(monster, state.player, state.map);
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
      if (tile.visible) {
        state.tiles[idxX][idxY].alpha = 1;
      } else {
        if (state.visible.find(({x, y}) => x === idxX && y === idxY)) {
          state.tiles[idxX][idxY].alpha = 0.5;
        } else {
          state.tiles[idxX][idxY].alpha = 0;
        }
      }
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
      state.spells.forEach(spell => {
        if (spell.y === idxX && spell.x === idxY) {
          spell.sprite.visible = tile.visible;
        }
      });
      state.exits.forEach(exit => {
        if (exit.y === idxX && exit.x === idxY) {
          exit.sprite.visible = tile.visible;
        }
      });
    });
  });
  return grid.tiles;
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
  pickSpells,
  moveMonsters,
  renderFovImmediate,
  renderSmell,
  renderTrajectory
};
