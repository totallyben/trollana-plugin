import React from 'react';

import { personas } from '../../pages/personas';

export function PersonaSelect(props) {
  return (
    <div className="xx-mb-14">
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

      <div className='xx-outline-indigo-500 xx-outline-2 xx-outline xx-bg-white xx-text-left xx-mt-5 xx-p-4 xx-rounded xx-text-gray-800'>
        {(props.persona.id !== 'custom') ? (
          <>
            <h4 className="xx-font-bold">Description</h4>
            <p>
                {props.persona.description}
            </p>

            <h4 className="xx-font-bold xx-mt-2">Goals</h4>
            <p>
              {props.persona.goals}
            </p>
          </>
        ) : (
          <>
            <label className="xx-font-bold">Description</label>
            <textarea
              className="xx-block xx-text-sm xx-flex-1 xx-border-2 xx-rounded-md xx-border-gray-300 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
              placeholder="Describe your persona"
            />

            <label className="xx-font-bold xx-mt-2">Goals</label>
            <textarea
              className="xx-block xx-text-sm xx-flex-1 xx-border-2 xx-rounded-md xx-border-gray-300 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
              placeholder="Define your goals"
            />
          </>
        )}
      </div>
    </div>
  );
}
