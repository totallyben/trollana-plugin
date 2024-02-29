import React from 'react';

import { personas } from '../../pages/personas';

export function PersonaSelect() {
  return (
    <div className="xx-mb-14">
      <p></p>
      <label htmlFor="persona" className="xx-block xx-text-base xx-font-medium">
        Select a persona
      </label>
      <select
        name="persona"
        className="xx-mt-2 xx-block xx-w-full xx-rounded-md xx-border-0 xx-py-1.5 xx-pl-3 xx-pr-10 xx-text-gray-900 xx-text-base xx-ring-1 xx-ring-inset xx-ring-gray-300 xx-focus:ring-2 xx-focus:ring-indigo-600"
        defaultValue="Canada"
      >
        {personas.map((persona) => (
          <option key={persona.name}>{persona.name}</option>
        ))}
        <option>Let me define my own</option>
      </select>
    </div>
  );
}
