import React, { useEffect, useState } from 'react';

import { Header, Footer } from '../../components/Options';

import { getKeyFromLocalStorage } from '../../utils';

const { useDispatch } = require('react-redux');

const Options = () => {
  // const [haveWallet, setHaveWallet] = useState(false);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const fetchMode = async () => {
  //     const mode = await getKeyFromLocalStorage('mode');
  //     setStateMode(mode);
  //     dispatch(setMode(mode));
  //     setIsSelectingMode(!mode);
  //   };

  //   fetchMode();
  // }, [dispatch]);

  // const changeMode = () => {
  //   setIsSelectingMode(true);
  // };

  // const saveMode = async (newMode) => {
  //   chrome.storage.local.set(
  //     {
  //       mode: newMode,
  //     },
  //     () => {
  //       setStateMode(newMode);
  //       dispatch(setMode(newMode));
  //       setIsSelectingMode(false);
  //     }
  //   );
  // };

  return (
    <>
      <Header />
      <main className="xx-flex-1 xx-overflow-auto xxx-text-slate-200">
        Options here
      </main>
      <Footer />
    </>
  );
};

export default Options;
