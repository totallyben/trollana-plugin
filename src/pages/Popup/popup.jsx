import React, { useEffect, useState } from 'react';

import { setMode } from '../../redux/Mode/actions';
import {
  Header,
  Footer,
  ModeSelect,
  TrollToEarn,
  AiHelper,
} from '../../components/Popup';

import { getKeyFromLocalStorage } from '../../utils';

const { useDispatch } = require('react-redux');

const Popup = () => {
  const [mode, setStateMode] = useState(null);
  const [isSelectingMode, setIsSelectingMode] = useState(true);
  // const [haveWallet, setHaveWallet] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchMode = async () => {
      const mode = await getKeyFromLocalStorage('mode');
      setStateMode(mode);
      dispatch(setMode(mode));
      setIsSelectingMode(!mode);
    };

    fetchMode();
  }, [dispatch]);

  const changeMode = () => {
    setIsSelectingMode(true);
  };

  const saveMode = async (newMode) => {
    chrome.storage.local.set(
      {
        mode: newMode,
      },
      () => {
        setStateMode(newMode);
        dispatch(setMode(newMode));
        setIsSelectingMode(false);
      }
    );
  };

  return (
    <>
      <Header
        mode={mode}
        isSelectingMode={isSelectingMode}
        changeMode={changeMode}
      />
      <main className="xx-flex-1 xx-overflow-auto xx-px-4 xx-flex xx-items-center xx-justify-center xx-text-slate-200">
        {isSelectingMode && <ModeSelect mode={mode} saveMode={saveMode} />}

        {!isSelectingMode && mode === 'trollToEarn' && <TrollToEarn />}

        {!isSelectingMode && mode === 'aiHelper' && <AiHelper />}
      </main>
      <Footer mode={mode} isSelectingMode={isSelectingMode} />
    </>
  );
};

export default Popup;
