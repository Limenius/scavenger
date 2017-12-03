import { astar, Graph } from "./astar";

function transpose(a) {
  return Object.keys(a[0]).map(function(c) {
    return a.map(function(r) {
      return r[c];
    });
  });
}

const getBlankMap = map => {
  const grid = map.map((row, idx) => {
    return row.map((tileChar, column) => {
      return 1;
    });
  });
  return transpose(grid);
};

const transformMapToGraph = map => {
  const rows = map.filter(row => row !== "");
  const grid = rows.map((row, idx) => {
    return row.map((tileChar, column) => {
      switch (tileChar) {
        case ".":
          return 1;
        case "*":
          return 0;
        default:
          throw new Error(`Unrecognized tile char ${tileChar}`);
      }
    });
  });
  return transpose(grid);
};

function findPath(start, end, map) {
  const graph = new Graph(transformMapToGraph(map), {
    diagonal: true
  });
  const startNode = graph.grid[start.x][start.y];
  const endNode = graph.grid[end.x][end.y];
  return astar.search(graph, startNode, endNode, {
    heuristic: astar.heuristics.diagonal
  });
}


export { transpose, getBlankMap, transformMapToGraph, findPath };