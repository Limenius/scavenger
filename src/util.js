export function getMapCoord({x, y}) {
  return { x: Math.floor(x / 50), y: Math.floor(y / 50) };
}

export function getMousePos(evt) {
  var canvas = document.querySelector("canvas");
  var rect = canvas.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}
