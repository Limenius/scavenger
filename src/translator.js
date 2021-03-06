import { transformMapToGraph } from "./map";
import { Map, compute } from "./fov";
import Constants from "./constants";
import { flatten } from "./util";
import { transpose } from "./map";

const SPEED = 4;

export function createTranslatorPlayer(
  path,
  sprite,
  ticker,
  map,
  tiles,
  visited,
  gold,
  monsters,
  spells,
  exits,
  done
) {
  const trajectory = [
    { x: sprite.position.x / 50, y: (sprite.position.y + 20) / 50 },
    ...path
  ];
  let it = runnerPlayer(
    sprite,
    trajectory,
    ticker,
    map,
    tiles,
    visited,
    gold,
    monsters,
    spells,
    exits
  );
  const step = function(delta) {
    if (it.next(delta).done) {
      ticker.remove(step);
      done();
    }
  };
  return step;
}

export function createTranslator(path, sprite, ticker, visibility, done) {
  const trajectory = [
    { x: sprite.position.x / 50, y: sprite.position.y / 50 },
    ...path
  ];
  let it = runner(sprite, trajectory, visibility, ticker);
  const step = function(delta) {
    if (it.next(delta).done) {
      ticker.remove(step);
      done();
    }
  };
  return step;
}

const gatherVisibility = tiles => tiles.map(row => row.map(tile => tile.alpha));

function fovChanges(map, visibility, center, visited) {
  const grid = new Map(transformMapToGraph(map));
  compute(grid, [center.x, center.y], Constants.FOV_RADIUS);
  return grid.tiles.map((column, idxY) => {
    return column.map((tile, idxX) => {
      return {
        x: idxX,
        y: idxY,
        from: visibility[idxX][idxY],
        to: tile.visible
          ? 1
          : visited.find(({ x, y }) => x === idxX && y === idxY) ? 0.5 : 0
      };
    });
  });
}

const getVisibilityFromChanges = changes =>
  changes.map(row => row.map(change => change.to));

function* runnerPlayer(
  sprite,
  trajectory,
  ticker,
  map,
  tiles,
  visited,
  gold,
  monsters,
  spells,
  exits
) {

  const items = [...gold, ...monsters, ...spells, ...exits];
  let visibility = gatherVisibility(tiles);
  const steps = trajectory.reduce((acc, curr, idx) => {
    if (idx === 0) {
      return [];
    }
    const changes = fovChanges(map, visibility, trajectory[idx], visited);
    visibility = transpose(getVisibilityFromChanges(changes));
    acc.push(() =>
      runnerOneStepPlayer(
        sprite,
        {
          x: trajectory[idx - 1].x * 50,
          y: trajectory[idx - 1].y * 50 - 20
        },
        { x: curr.x * 50, y: curr.y * 50 - 20 },
        flatten(changes).filter(({ from, to }) => from !== to),
        tiles,
        makeVisibilizer( transpose(getVisibilityFromChanges(changes)) , items)
      )
    );
    return acc;
  }, []);
  for (let i = 0; i <= steps.length - 1; i++) {
    yield* steps[i]();
  }
}

function makeVisibilizer(visibility, items) {
  const vis = visibility;
  const it = items;
  return function() {
    items.forEach(item => {
      item.sprite.visible = visibility[item.y][item.x] === 1;
    });
  };
}

function* runner(sprite, trajectory, visibility, ticker) {
  const steps = trajectory.reduce((acc, curr, idx) => {
    if (idx === 0) {
      return [];
    }
    acc.push(() =>
      runnerOneStep(
        sprite,
        { x: trajectory[idx - 1].x * 50, y: trajectory[idx - 1].y * 50 - 20 },
        { x: curr.x * 50, y: curr.y * 50 - 20 },
        visibility[curr.x][curr.y]
      )
    );
    return acc;
  }, []);
  for (let i = 0; i <= steps.length - 1; i++) {
    yield* steps[i]();
  }
}

function* runnerOneStep(sprite, start, end, visible) {
  let done = false;
  let delta;
  while (!done) {
    delta = yield;
    sprite.visible = visible;
    if (sprite.position.x > end.x) {
      sprite.position.x -= delta * SPEED;
    } else if (sprite.position.x < end.x) {
      sprite.position.x += delta * SPEED;
    }
    if (sprite.position.y > end.y) {
      sprite.position.y -= delta * SPEED;
    } else if (sprite.position.y < end.y) {
      sprite.position.y += delta * SPEED;
    }
    if (Math.abs((sprite.position.x - start.x) / (end.x - start.x)) > 1) {
      sprite.position.x = end.x;
    }
    if (Math.abs((sprite.position.y - start.y) / (end.y - start.y)) > 1) {
      sprite.position.y = end.y;
    }
    if (sprite.position.y === end.y && sprite.position.x === end.x) {
      done = true;
    }
  }
}

function* runnerOneStepPlayer(sprite, start, end, changesFov, tiles, callback) {
  let done = false;
  let delta;
  let total = 0;
  let endTime = 12;
  /* eslint-disable no-loop-func */
  while (!done) {
    delta = yield;
    total += delta;

    sprite.play();

    sprite.position.x = total / endTime * (end.x - start.x) + start.x;
    sprite.position.y = total / endTime * (end.y - start.y) + start.y;
    changesFov.forEach(change => {
      tiles[change.x][change.y].alpha =
        total / endTime * (change.to - change.from) + change.from;
    });
    if (total >= endTime) {
      sprite.gotoAndStop(4);
      callback();
      done = true;
    }
  }
  /* eslint-enable no-loop-func */
}
