import {
  renderFov,
  exitLevel,
  pickGold,
  moveMonsters,
  renderSmell
} from "./effects";
import { createTranslator } from "./translator";
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
  goNextLevel
} from "./reducer";

// shameful
export function click(coords) {
  return (dispatch, state) => {
    if (!state.uiEnabled) {
      return;
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
        player: { ...state.player, x: coords.x, y: coords.y }
      };
      const { paths, monsters } = moveMonsters(newState);
      const stateAfterMonsters = { ...newState, monsters };
      new Promise(resolve => {
        dispatch(disableUI());
        const animator = createTranslator(
          path,
          state.player.sprite,
          state.app.ticker,
          resolve
        );
        state.app.ticker.add(animator);
      }).then(() => {
          return new Promise(resolve => {
            const animators = paths.map((path, idx) => {
              return new Promise(resolve => {
                const animator = createTranslator(
                  path,
                  newState.monsters[idx].sprite,
                  newState.app.ticker,
                  resolve
                );
                newState.app.ticker.add(animator);
              });
            });
            Promise.all(animators).then(() => {
              renderFov(newState, coords);
              resolve()
            });
          });
        })
        .then(() => {
          if (monstersKillPlayer(stateAfterMonsters)) {
            stateAfterMonsters.sound.play("gameover");
            return dispatch(killed());
          }
          const stateAfterGold = pickGold(stateAfterMonsters);
          // can do this one because it is only side effects.
          dispatch(
            setCollected({
              chests: stateAfterGold.collectedChests,
              gold: stateAfterGold.collectedGold
            })
          );
          renderFov(stateAfterGold, coords);
          const smell = renderSmell(stateAfterGold, coords);
          const hasFinished = exitLevel(stateAfterGold);
          dispatch(enableUI());
          if (hasFinished) {
            return dispatch(goNextLevel());
          } else {
            return dispatch(setState({ ...stateAfterGold, smell }));
          }
        });
    } else {
      return dispatch(setState(state));
    }
  };
}
const monstersKillPlayer = ({ monsters, player }) =>
  !!monsters.find(({ x, y }) => x === player.x && y === player.y);
