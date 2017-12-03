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
      const movement = new Promise(resolve => {
        dispatch(disableUI());
        const animator = createTranslator(
          path,
          state.player.sprite,
          state.app.ticker,
          resolve
        );
        state.app.ticker.add(animator);
      }).then(() => {
        const newState = {
          ...state,
          player: { ...state.player, x: coords.x, y: coords.y }
        };
        renderFov(newState, coords);
        const st = moveMonsters(newState);
        if (monstersKillPlayer(st)) {
          st.sound.play("lvlup");
          return dispatch(killed());
        }
        const st2 = pickGold(st);
        // can do this one because it is only side effects.
        dispatch(
          setCollected({ chests: st2.collectedChests, gold: st2.collectedGold })
        );
        renderFov(st2, coords);
        const smell = renderSmell(st2, coords);
        const hasFinished = exitLevel(st2);
        dispatch(enableUI());
        if (hasFinished) {
          return dispatch(goNextLevel());
        } else {
          return dispatch(setState({ ...st2, smell }));
        }
      });
    } else {
      return dispatch(setState(state));
    }
  };
}
const monstersKillPlayer = ({ monsters, player }) =>
  !!monsters.find(({ x, y }) => x === player.x && y === player.y);
