import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export function Header(props) {
  const modeText = () => {
    return props.mode === 'trollToEarn' ? 'Troll To Earn' : 'Socials Assistant';
  };
  return (
    <>
      <header className="xx-relative xx-h-12 xx-border-b-2 xx-border-indigo-500 xx-flex xx-items-center xx-justify-center xx-w-full">
        {!props.isSelectingMode && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="xx-absolute xx-left-0 xx-ml-4 xx-text-xl xx-text-slate-200 xx-cursor-pointer"
            onClick={() => props.changeMode()}
          />
        )}
        <div className="xx-flex xx-justify-center xx-w-full">
          <img src="logo.png" width={120} alt="Trollan logo" />
        </div>
      </header>

      <h1 className="xx-mt-4 xx-text-xl xx-text-slate-200 xx-font-bold xx-text-center">
        Trollana's AI Response Plugin
      </h1>

      {!props.isSelectingMode && props.mode && (
        <h2 className="xx-text-xl xx-mt-4 xx-text-slate-200 xx-text-center">
          {modeText()}
        </h2>
      )}
    </>

    // <header className="flex items-center justify-between h-16 w-full fixed top-0 left-0 border-b-2 border-indigo-500 z-10">
    //   <Image
    //     src={Logo}
    //     width={150}
    //     alt="Trollan logo"
    //     className="ml-3"
    //   />

    //   <div>
    //     <WalletMultiButton />
    //   </div>
    // </header>
  );
}
