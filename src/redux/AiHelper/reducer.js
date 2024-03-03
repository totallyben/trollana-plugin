import { aiHelperActions } from './actions';

const initState = {
  personaId: 'thoughtLeader',
  persona: {},
  customPersona: {
    description: '',
    goals: '',
  },
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case aiHelperActions.SET_PERSONA_ID:
      return { ...state, personaId: action.personaId };
    case aiHelperActions.SET_PERSONA:
      return { ...state, persona: action.persona };
    case aiHelperActions.SET_CUSTOM_PERSONA:
      return { ...state, customPersona: action.customPersona };
    default:
      return state;
  }
}
