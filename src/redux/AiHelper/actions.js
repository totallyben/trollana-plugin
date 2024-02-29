export const aiHelperActions = {
  SET_PERSONA_ID: 'SET_PERSONA_ID',
  SET_PERSONA: 'SET_PERSONA',
};

export function setPersonaId(personaId) {
  console.log('setPersonaId', personaId);
  return { type: aiHelperActions.SET_PERSONA_ID, personaId };
}

export function setPersona(persona) {
  console.log('setPersona', persona);
  return { type: aiHelperActions.SET_PERSONA, persona };
}
