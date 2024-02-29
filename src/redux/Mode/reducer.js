import { modeActions } from './actions';

const initState = {
  mode: null,
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case modeActions.SET_MODE:
      return { ...state, mode: action.mode };
    default:
      return state;
  }
}
