import { optionsActions } from './actions';

const initState = {
  shillModeEnabled: false,
  increasedXCharacterLimitEnabled: false,
};

export default function reducer(state = initState, action) {
  console.log(action);
  switch (action.type) {
    case optionsActions.SET_SHILL_MODE:
      return { ...state, shillModeEnabled: action.enabled };
    case optionsActions.SET_INCREASED_X_CHARACTER_LIMIT:
      return {
        ...state,
        increasedXCharacterLimitEnabled: action.enabled,
      };
    default:
      return state;
  }
}
