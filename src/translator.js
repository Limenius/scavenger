const SPEED = 4;

export function createTranslator(path, sprite, ticker, done) {
  const trajectory = [
    { x: sprite.position.x / 50, y: sprite.position.y / 50 },
    ...path
  ];
  let it = runner(sprite, trajectory, ticker);
  const step = function(delta) {
    if (it.next(delta).done) {
      ticker.remove(step);
      done();
    }
  };
  return step;
}

function* runner(sprite, trajectory, ticker) {
  const steps = trajectory.reduce((acc, curr, idx) => {
    if (idx === 0) {
      return [];
    }
    acc.push(() =>
      runnerOneStep(
        sprite,
        { x: trajectory[idx - 1].x * 50, y: trajectory[idx - 1].y * 50 },
        { x: curr.x * 50, y: curr.y * 50 }
      )
    );
    return acc;
  }, []);
  for (let i = 0; i <= steps.length - 1; i++) {
    yield* steps[i]();
  }
}

function* runnerOneStep(sprite, start, end) {
  let done = false;
  let delta;
  while (!done) {
    delta = yield;
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