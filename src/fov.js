// From https://github.com/domasx2/mrpas-js
var Tile = function() {
  this.wall = false;
  this.visible = false;
};

var Map = function(map) {
  //size: [x, y]
  let sizeY = map.length;
  let sizeX = 0;
  this.tiles = [];
  map.forEach((row, idx) => {
    var tileRow = [];
    if (row.length > sizeX) {
      sizeX = row.length;
    }
    row.forEach((tileChar, column) => {
      let tile = new Tile();
      switch (tileChar) {
        case 1:
          tile.wall = false;
          break;
        case 0:
          tile.wall = true;
          break;
        default:
          throw new Error(`Unrecognized tile char ${tileChar}`);
      }
      tileRow.push(tile);
    });
    this.tiles.push(tileRow);
  });
  this.size = [sizeY, sizeX];
};

Map.prototype.get_tile = function(pos) {
  if (this.tiles[pos[0]] && this.tiles[pos[0]][pos[1]]) {
    return this.tiles[pos[0]][pos[1]];
  }
  return null;
};

Map.prototype.iter = function(callback, context) {
  //iterate over all tiles, callbing callback with position & tile
  for (var x = 0; x < this.size[0]; x++) {
    for (var y = 0; y < this.size[1]; y++) {
      callback.apply(context, [[x, y], this.tiles[x][y]]);
    }
  }
};

Map.prototype.reset_visibility = function() {
  //sets all tiles as not visible
  this.iter(function(pos, tile) {
    tile.visible = false;
  });
};

Map.prototype.set_visible = function(pos) {
  this.tiles[pos[0]][pos[1]].visible = true;
};

Map.prototype.is_visible = function(pos) {
  return this.tiles[pos[0]][pos[1]].visible;
};

Map.prototype.is_transparent = function(pos) {
  return !this.tiles[pos[0]][pos[1]].wall;
};

function compute_quadrant(map, position, maxRadius, dx, dy) {
  var startAngle = [];
  startAngle[99] = undefined;
  var endAngle = startAngle.slice(0);
  //octant: vertical edge:
  var iteration = 1;
  var done = false;
  var totalObstacles = 0;
  var obstaclesInLastLine = 0;
  var minAngle = 0.0;
  var x = 0.0;
  var y = position[1] + dy;
  var c;
  var wsize = map.size;

  var slopesPerCell,
    halfSlopes,
    processedCell,
    minx,
    maxx,
    pos,
    visible,
    startSlope,
    centerSlope,
    endSlope,
    idx;
  //do while there are unblocked slopes left and the algo is within
  // the map's boundaries
  //scan progressive lines/columns from the PC outwards
  if (y < 0 || y >= wsize[1]) done = true;
  while (!done) {
    //process cells in the line
    slopesPerCell = 1.0 / (iteration + 1);
    halfSlopes = slopesPerCell * 0.5;
    processedCell = parseInt(minAngle / slopesPerCell, 10);
    minx = Math.max(0, position[0] - iteration);
    maxx = Math.min(wsize[0] - 1, position[0] + iteration);
    done = true;
    x = position[0] + processedCell * dx;
    while (x >= minx && x <= maxx) {
      pos = [x, y];
      visible = true;
      startSlope = processedCell * slopesPerCell;
      let centreSlope = startSlope + halfSlopes;
      endSlope = startSlope + slopesPerCell;
      if (obstaclesInLastLine > 0 && !map.is_visible(pos)) {
        idx = 0;
        while (visible && idx < obstaclesInLastLine) {
          if (map.is_transparent(pos)) {
            if (centreSlope > startAngle[idx] && centreSlope < endAngle[idx])
              visible = false;
          } else if (startSlope >= startAngle[idx] && endSlope <= endAngle[idx])
            visible = false;
          if (
            visible &&
            (!map.is_visible([x, y - dy]) ||
              !map.is_transparent([x, y - dy])) &&
            (x - dx >= 0 &&
              x - dx < wsize[0] &&
              (!map.is_visible([x - dx, y - dy]) ||
                !map.is_transparent([x - dx, y - dy])))
          )
            visible = false;
          idx += 1;
        }
      }
      if (visible) {
        map.set_visible(pos);
        done = false;
        //if the cell is opaque, block the adjacent slopes
        if (!map.is_transparent(pos)) {
          if (minAngle >= startSlope) minAngle = endSlope;
          else {
            startAngle[totalObstacles] = startSlope;
            endAngle[totalObstacles] = endSlope;
            totalObstacles += 1;
          }
        }
      }
      processedCell += 1;
      x += dx;
    }
    if (iteration === maxRadius) done = true;
    iteration += 1;
    obstaclesInLastLine = totalObstacles;
    y += dy;
    if (y < 0 || y >= wsize[1]) done = true;
    if (minAngle === 1.0) done = true;
  }

  //octant: horizontal edge
  iteration = 1; //iteration of the algo for this octant
  done = false;
  totalObstacles = 0;
  obstaclesInLastLine = 0;
  minAngle = 0.0;
  x = position[0] + dx; //the outer slope's coordinates (first processed line)
  y = 0;
  //do while there are unblocked slopes left and the algo is within the map's boundaries
  //scan progressive lines/columns from the PC outwards
  if (x < 0 || x >= wsize[0]) done = true;
  while (!done) {
    //process cells in the line
    slopesPerCell = 1.0 / (iteration + 1);
    halfSlopes = slopesPerCell * 0.5;
    processedCell = parseInt(minAngle / slopesPerCell, 10);
    let miny = Math.max(0, position[1] - iteration);
    let maxy = Math.min(wsize[1] - 1, position[1] + iteration);
    done = true;
    y = position[1] + processedCell * dy;
    while (y >= miny && y <= maxy) {
      //calculate slopes per cell
      pos = [x, y];
      visible = true;
      startSlope = processedCell * slopesPerCell;
      let centreSlope = startSlope + halfSlopes;
      endSlope = startSlope + slopesPerCell;
      if (obstaclesInLastLine > 0 && !map.is_visible(pos)) {
        idx = 0;
        while (visible && idx < obstaclesInLastLine) {
          if (map.is_transparent(pos)) {
            if (centreSlope > startAngle[idx] && centreSlope < endAngle[idx])
              visible = false;
          } else if (startSlope >= startAngle[idx] && endSlope <= endAngle[idx])
            visible = false;

          if (
            visible &&
            (!map.is_visible([x - dx, y]) ||
              !map.is_transparent([x - dx, y])) &&
            (y - dy >= 0 &&
              y - dy < wsize[1] &&
              (!map.is_visible([x - dx, y - dy]) ||
                !map.is_transparent([x - dx, y - dy])))
          )
            visible = false;
          idx += 1;
        }
      }
      if (visible) {
        map.set_visible(pos);
        done = false;
        //if the cell is opaque, block the adjacent slopes
        if (!map.is_transparent(pos)) {
          if (minAngle >= startSlope) minAngle = endSlope;
          else {
            startAngle[totalObstacles] = startSlope;
            endAngle[totalObstacles] = endSlope;
            totalObstacles += 1;
          }
        }
      }
      processedCell += 1;
      y += dy;
    }
    if (iteration === maxRadius) done = true;
    iteration += 1;
    obstaclesInLastLine = totalObstacles;
    x += dx;
    if (x < 0 || x >= wsize[0]) done = true;
    if (minAngle === 1.0) done = true;
  }
}

function compute(map, position, vision_range) {
  map.reset_visibility();
  map.set_visible(position); //player can see himself
  //compute the 4 quadrants of the map
  compute_quadrant(map, position, vision_range, 1, 1);
  compute_quadrant(map, position, vision_range, 1, -1);
  compute_quadrant(map, position, vision_range, -1, 1);
  compute_quadrant(map, position, vision_range, -1, -1);
  for (let i = 0; i < map.tiles.length; i++) {
    for (let j = 0; j < map.tiles[i].length; j++) {
        if (Math.sqrt(Math.pow(i - position[0], 2) + Math.pow(j - position[1], 2)) > vision_range) {
          map.tiles[i][j].visible = false;
        }
    }
  }
}

if (exports !== undefined) {
  exports.compute = compute;
  exports.Map = Map;
  exports.Tile = Tile;
  exports.compute_quadrant = compute_quadrant;
}
