import React, { useEffect, useState } from 'react';

import { personas } from '../../pages/personas';

import { getKeyFromLocalStorage } from '../../utils';
import { setCustomPersona } from '../../redux/AiHelper/actions';

const { useDispatch } = require('react-redux');

const defaultCustomPersona = {
  description: '',
  goals: '',
};

export function PersonaSelect(props) {
  const [customPersona, setSateCustomPersona] = useState(defaultCustomPersona);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCustomPersona = async () => {
      // Renamed variable to avoid shadowing the state variable
      const fetchedCustomPersona = await getKeyFromLocalStorage(
        'customPersona'
      );

      if (!fetchedCustomPersona) {
        setSateCustomPersona(defaultCustomPersona);
        dispatch(setCustomPersona(defaultCustomPersona));
        return;
      }

      setSateCustomPersona(fetchedCustomPersona);
      dispatch(setCustomPersona(fetchedCustomPersona));
    };

    fetchCustomPersona();
  }, [dispatch]);

  const saveCustomPersona = async (newCustomPersona) => {
    chrome.storage.local.set(
      {
        customPersona: newCustomPersona,
      },
      () => {
        setSateCustomPersona(newCustomPersona);
        dispatch(setCustomPersona(newCustomPersona));
      }
    );
  };

  const setCustomPersonaDescription = (description) => {
    const newCustomPersona = { ...customPersona, description: description };
    saveCustomPersona(newCustomPersona);
  };

  const setCustomPersonaGoals = (goals) => {
    const newCustomPersona = { ...customPersona, goals: goals };
    saveCustomPersona(newCustomPersona);
  };

  const handleDoneClick = () => {
    window.close();
  };

  return (
    <div className="xx-mb-6 xx-w-full xx-px-3">
      <p></p>
      <label htmlFor="persona" className="xx-block xx-text-base xx-font-medium">
        Select a persona
      </label>
      <select
        name="persona"
        className="xx-mt-2 xx-block xx-w-full xx-rounded-md xx-border-0 xx-py-1.5 xx-pl-3 xx-pr-10 xx-text-gray-900 xx-text-base xx-ring-1 xx-ring-inset xx-ring-gray-300 xx-focus:ring-2 xx-focus:ring-indigo-600"
        value={props.persona.id}
        onChange={(event) => props.savePersona(event.target.value)}
      >
        {personas.map((persona) => (
          <option key={persona.id} value={persona.id}>
            {persona.name}
          </option>
        ))}
        <option value="custom">Let me define my own</option>
      </select>

      <div className="xx-outline-indigo-500 xx-outline-2 xx-outline xx-bg-white xx-text-left xx-mt-5 xx-p-4 xx-rounded xx-text-gray-800">
        {props.persona.id !== 'custom' ? (
          <>
            <h4 className="xx-font-bold">You are</h4>
            <p>{props.persona.description}</p>

            <h4 className="xx-font-bold xx-mt-2">Your goals</h4>
            <p>{props.persona.goals}</p>
          </>
        ) : (
          <>
            <label className="xx-font-bold">Your are...</label>
            <textarea
              className="xx-block xx-text-sm xx-flex-1 xx-mb-3 xx-w-full xx-border-2 xx-rounded-md xx-border-gray-300 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
              placeholder="Describe your persona"
              onChange={(e) => setCustomPersonaDescription(e.target.value)}
              value={customPersona.description}
            />

            <label className="xx-font-bold">My goals are...</label>
            <textarea
              className="xx-block xx-text-sm xx-flex-1 xx-w-full xx-border-2 xx-rounded-md xx-border-gray-300 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
              placeholder="Describe your goals"
              onChange={(e) => setCustomPersonaGoals(e.target.value)}
              value={customPersona.goals}
            />
          </>
        )}
      </div>
      <div className="xx-text-center xx-mt-5">
        <button
          type="button"
          className="xx-rounded-md xx-bg-indigo-600 xx-mt-3 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
          onClick={handleDoneClick}
        >
          Done
        </button>
      </div>
    </div>
  );
}
