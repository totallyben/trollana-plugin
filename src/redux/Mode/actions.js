export const modeActions = {
  SET_MODE: 'SET_MODE',
};

export function setMode(mode) {
  console.log('setMode', mode);
  return { type: modeActions.SET_MODE, mode };
}
