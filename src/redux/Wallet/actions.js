export const walletActions = {
  SET_WALLET_ADDRESS: 'SET_WALLET_ADDRESS',
};

export function setWallet(walletAddress) {
  return { type: walletActions.SET_WALLET_ADDRESS, walletAddress };
}
