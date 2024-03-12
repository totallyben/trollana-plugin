export const optionsActions = {
  SET_SHILL_MODE: 'SET_SHILL_MODE',
  SET_INCREASED_X_CHARACTER_LIMIT: 'SET_INCREASED_X_CHARACTER_LIMIT',
};

export function setShillMode(enabled) {
  console.log('enabled', enabled);
  return { type: optionsActions.SET_SHILL_MODE, enabled };
}

export function setIncreasedXCharacterLimit(enabled) {
  return { type: optionsActions.SET_INCREASED_X_CHARACTER_LIMIT, enabled };
}
