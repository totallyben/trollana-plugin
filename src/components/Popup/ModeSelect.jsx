import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';

import { classNames } from '../../pages/utils';

const modes = [
  {
    mode: 'aiHelper',
    title: 'Help me with my socials',
    description: `I want to use Trollana's AI to make it a breeze to respond on social platforms.`,
  },
  {
    mode: 'trollToEarn',
    title: 'Troll To Earn',
    description: `I want to take part in Trollana's Troll To Earn programme and make some $$$ and compete for prizes.`,
  },
];

export function ModeSelect(props) {
  return (
    <div className="xx-text-center">
      <div className="xx-mb-4 xx-text-xl">
        <div className="xx-text-base xx-font-bold">How can I help?</div>
        {modes.map((mode) => (
          <div
            key={mode.mode}
            className={classNames(
              props.mode === mode.mode
                ? 'xx-outline-indigo-500 xx-outline-2 xx-outline xx-bg-white'
                : 'xx-bg-slate-200 hover:xx-outline-indigo-500 hover:xx-outline-2 hover:xx-outline hover:xx-bg-white',
              'xx-text-left xx-mx-4 xx-mt-5 xx-p-4 xx-rounded xx-cursor-pointer'
            )}
            onClick={() => props.saveMode(mode.mode)}
          >
            <div className="xx-flex xx-justify-between xx-items-center">
              <h3 className="xx-text-base xx-font-semibold xx-leading-6 xx-text-indigo-800">
                {mode.title}
              </h3>
              {props.mode === mode.mode && (
                <FontAwesomeIcon
                  icon={faCircleCheck}
                  className="xx-text-xl xx-text-indigo-800"
                />
              )}
            </div>

            <p className="xx-mt-2 xx-text-sm xx-text-gray-700">
              {mode.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
