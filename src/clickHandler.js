import {
  exitLevel,
  pickGold,
  pickSpells,
  moveMonsters,
  renderSmell,
  inSmell,
  renderFovImmediate
} from "./effects";
import { createTranslator, createTranslatorPlayer } from "./translator";
import { findPath } from "./map";
import Constants from "./constants";
import {
  removeTextBlock,
  setState,
  restartLevel,
  killed,
  enableUI,
  disableUI,
  setCollected,
  goNextLevel,
  addVisible
} from "./reducer";
import { compute, Map } from "./fov";
import { transformMapToGraph } from "./map";

function computeFov(map, center) {
  const grid = new Map(transformMapToGraph(map));
  compute(grid, [center.x, center.y], Constants.FOV_RADIUS);
  return grid.tiles.map((column, idxY) => {
    return column.map((tile, idxX) => {
      return tile.visible;
    });
  });
}

// shameful
export function click(coords) {
  return (dispatch, state) => {
    if (!state.uiEnabled) {
      return;
    }
    if (state.trajectory) {
      state.trajectory.forEach(node => state.mapContainer.removeChild(node));
    }
    if (state.killed) {
      state.mapContainer.removeChild(state.textBlock.rectangle);
      dispatch(removeTextBlock());
      return dispatch(restartLevel());
    }
    if (state.textBlock) {
      state.app.stage.removeChild(state.textBlock.rectangle);
      return dispatch(setState({ ...state, textBlock: null }));
    }
    const path = findPath(state.player, coords, state.map);
    if (path.length > 0 && path[path.length - 1].g <= Constants.MAX_MOVE) {
      const newState = {
        ...state,
        player: { ...state.player, x: coords.x, y: coords.y}
      };
      const { paths, monsters } = moveMonsters(newState);
      const stateAfterMonsters = { ...newState, monsters };

      const finalVisibility = computeFov(state.map, coords);

      new Promise(resolve => {
        dispatch(disableUI());
        const animator = createTranslatorPlayer(
          path,
          state.player.sprite,
          state.app.ticker,
          state.map,
          state.tiles,
          state.visible,
          state.gold,
          state.monsters,
          state.spells,
          state.exits,
          resolve
        );
        state.app.ticker.add(animator);
      }).then((visibility) => {
          return new Promise(resolve => {
            const animators = paths.map((path, idx) => {
              return new Promise(resolve => {
                const animator = createTranslator(
                  path,
                  newState.monsters[idx].sprite,
                  newState.app.ticker,
                  finalVisibility,
                  resolve
                );
                newState.app.ticker.add(animator);
              });
            });
            Promise.all(animators).then(() => {
              renderFovImmediate(newState, coords);
              resolve();
            });
          });
        })
        .then(() => {
          if (monstersKillPlayer(stateAfterMonsters)) {
            stateAfterMonsters.sound.play("gameover");
            dispatch(enableUI());
            return dispatch(killed());
          }

          const stateAfterGold = pickGold(stateAfterMonsters);
          // can do this one because it is only side effects.
          dispatch(
            setCollected({
              chests: stateAfterGold.collectedChests,
              gold: stateAfterGold.collectedGold,
              spells1: stateAfterGold.collectedSpells1,
              spells2: stateAfterGold.collectedSpells2
            })
          );

          const stateAfterSpells = pickSpells(stateAfterGold);
          // can do this one because it is only side effects.
          dispatch(
            setCollected({
              chests: stateAfterSpells.collectedChests,
              gold: stateAfterSpells.collectedGold,
              spells1: stateAfterSpells.collectedSpells1,
              spells2: stateAfterSpells.collectedSpells2
            })
          );

          const visibility = renderFovImmediate(stateAfterGold, coords);
          const visible = [];
          visibility.forEach((row, y) => row.forEach((tile, x) => {
              if (tile.visible) {
                visible.push({ x, y });
              }
            }));

          let diff = [];
          visible.forEach(({ x, y }) => {
            if (!stateAfterSpells.visible.find(({ xv, yv }) => x === xv && y === yv)) {
              diff.push({ x, y });
            }
          });

          const stateAfterVisited = {...stateAfterSpells, visible: [...stateAfterSpells.visible, ...visible]};
          const smell = renderSmell(stateAfterVisited, coords);
          const stateAfterSmell = {...stateAfterVisited, smell};
          stateAfterSmell.monsters.forEach(monster => {
            if (inSmell(monster, stateAfterSmell)) {
              state.sound.play("bad");
            }
          });

          const hasFinished = exitLevel(stateAfterSmell);

          dispatch(enableUI());
          dispatch(setState(stateAfterSmell));
          if (hasFinished) {
            return dispatch(goNextLevel());
          }
        });
    } else {
      return dispatch(setState(state));
    }
  };
}
const monstersKillPlayer = ({ monsters, player }) =>
  !!monsters.find(({ x, y }) => x === player.x && y === player.y);
