import React, { useEffect, useState } from 'react';

import { getKeyFromLocalStorage } from '../../utils';
import { setPersonaId, setPersona } from '../../redux/AiHelper/actions';

import { PersonaSelect } from './PersonaSelect';
import { personas } from '../../pages/personas';

const { useDispatch } = require('react-redux');

const defaultPersonaId = 'thoughtLeader';

export const AiHelper = () => {
  const [personaId, setStatePersonaId] = useState(null);
  const [persona, setStatePersona] = useState({});
  const dispatch = useDispatch();

  const getPersonaById = (personas, id) => {
    let persona = personas.find((persona) => persona.id === id);
    if (!persona) {
      persona = {
        id: 'custom',
      };
    }
    return persona;
  };

  useEffect(() => {
    const fetchPersona = async () => {
      let personaId = await getKeyFromLocalStorage('personaId');
      if (!personaId) {
        personaId = 'thoughtLeader';
      }

      setStatePersonaId(personaId);
      dispatch(setPersonaId(personaId));

      const persona = getPersonaById(personas, personaId);
      setStatePersona(persona);
      dispatch(setPersona(persona));
    };

    fetchPersona();
  }, [dispatch]);

  const savePersona = async (newPersonaId) => {
    chrome.storage.local.set(
      {
        personaId: newPersonaId,
      },
      () => {
        setStatePersonaId(newPersonaId);
        dispatch(setPersonaId(newPersonaId));

        const persona = getPersonaById(personas, newPersonaId);
        setStatePersona(persona);
        dispatch(setPersona(persona));
      }
    );
  };

  // const handleEditClick = () => {
  //   setIsEditing(true);
  // };

  return (
    <main className="xx-flex-1 xx-overflow-auto xx-p-4 xx-flex xx-items-center xx-justify-center">
      <PersonaSelect persona={persona} savePersona={savePersona} />
    </main>
  );
};
