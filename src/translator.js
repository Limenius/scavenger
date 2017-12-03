const SPEED = 4;

export function createTranslator(path, sprite, ticker) {
  const end  = { x: path[path.length - 1].x * 50, y: path[path.length - 1].y * 50 };
  const start = { x: path[0].x * 50, y: path[0].y * 50 };
  return function translator() {
    const step = function(delta) {
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
      if (
        Math.abs(
          (sprite.position.x - start.x) / (end.x - start.x)
        ) > 1
      ) {
        sprite.position.x = end.x;
      }
      if (
        Math.abs(
          (sprite.position.y - start.y) / (end.y - start.y)
        ) > 1
      ) {
        sprite.position.y = end.y;
      }
      if (
        sprite.position.y === end.y &&
        sprite.position.x === end.x
      ) {
        ticker.remove(step);
      }
    };
    return step;
  };
}