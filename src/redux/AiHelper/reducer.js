import { aiHelperActions } from './actions';

const initState = {
  personaId: 'thoughtLeader',
  persona: {},
};

export default function reducer(state = initState, action) {
  switch (action.type) {
    case aiHelperActions.SET_PERSONA_ID:
      return { ...state, personaId: action.personaId };
    case aiHelperActions.SET_PERSONA:
      return { ...state, persona: action.persona };
    default:
      return state;
  }
}
