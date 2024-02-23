import React from 'react';

export function Unclaimed(props) {
  const handleClick = () => {
    window.open('https://app.trollana.vip', '_blank');
  };

  return (
    <button
      type="button"
      className="xx-rounded-md xx-bg-indigo-600 xx-mt-8 xx-px-6 xx-py-2 xx-text-xlg xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
      onClick={handleClick}
    >
      {props.unclaimed} Unclaimed
    </button>
  );
}
