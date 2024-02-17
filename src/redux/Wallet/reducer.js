import { walletActions } from './actions';

const initState = {
  user: null,
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case walletActions.SET_WALLET_ADDRESS:
      return { ...state, walletAddress: action.walletAddress };
    default:
      return state;
  }
}
