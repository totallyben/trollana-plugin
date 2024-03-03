export const aiHelperActions = {
  SET_PERSONA_ID: 'SET_PERSONA_ID',
  SET_PERSONA: 'SET_PERSONA',
  SET_CUSTOM_PERSONA: 'SET_CUSTOM_PERSONA',
};

export function setPersonaId(personaId) {
  return { type: aiHelperActions.SET_PERSONA_ID, personaId };
}

export function setPersona(persona) {
  return { type: aiHelperActions.SET_PERSONA, persona };
}

export function setCustomPersona(customPersona) {
  return { type: aiHelperActions.SET_CUSTOM_PERSONA, customPersona };
}
