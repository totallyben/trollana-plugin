import React, { useEffect, useState } from 'react';

import { Header, Footer } from '../../components/Options';

import { getKeyFromLocalStorage } from '../../utils';
import { setShillMode, setIncreasedXCharacterLimit } from '../../redux/Options/actions';

const { useDispatch } = require('react-redux');

const Options = () => {
  const [shillModeEnabled, setSateShillModeEnabled] = useState(false);
  const [increasedXCharacterLimitEnabled, setSateIncreasedXCharacterLimiteEnabled] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShillModeEnabled = async () => {
      const shillModeEnabled = await getKeyFromLocalStorage('shillModeEnabled');
      setSateShillModeEnabled(shillModeEnabled);
      dispatch(setShillMode(shillModeEnabled));
    };

    const fetchIncreasedXCharacterLimiteEnabled = async () => {
      const increasedXCharacterLimitEnabled = await getKeyFromLocalStorage('increasedXCharacterLimitEnabled');
      setSateIncreasedXCharacterLimiteEnabled(increasedXCharacterLimitEnabled);
      dispatch(setIncreasedXCharacterLimit(increasedXCharacterLimitEnabled));
    };

    fetchShillModeEnabled();
    fetchIncreasedXCharacterLimiteEnabled();
  }, [dispatch]);

  const updateShillModeEnabled = async (enabled) => {
    chrome.storage.local.set(
      {
        shillModeEnabled: enabled,
      },
      () => {
        setSateShillModeEnabled(enabled);
        dispatch(setShillMode(enabled));
      }
    );
  };

  const updateIncreasedXCharacterLimiteEnabled = async (enabled) => {
    chrome.storage.local.set(
      {
        increasedXCharacterLimitEnabled: enabled,
      },
      () => {
        setSateIncreasedXCharacterLimiteEnabled(enabled);
        dispatch(setIncreasedXCharacterLimit(enabled));
      }
    );
  };

  return (
    <>
      <Header />
      <main class="xx-mt-14 xx-mb-12 xx-px-4 xx-max-w-screen-xl xx-mx-auto xx-text-base">
        <h1 className="xx-text-xl xx-pt-4 xx-mb-4 xx-font-bold">
          Troll To Earn Options
        </h1>
        <div class="xx-pt-4">
          <input 
            type="checkbox"
            checked={shillModeEnabled}
            onChange={(event) => updateShillModeEnabled(event.target.checked)}
          />
          <span className="xx-ml-2 xx-font-bold">Enable shill mode</span>

          <div className="xx-ml-5 xx-text-slate-400">
            With shill mode enabled the AI generated responses will SHILL Trollana instead of create a Troll response
          </div>
        </div>
        <div class="xx-pt-4">
          <input 
            type="checkbox"
            checked={increasedXCharacterLimitEnabled}
            onChange={(event) => updateIncreasedXCharacterLimiteEnabled(event.target.checked)}
          />
          <span className="xx-ml-2 xx-font-bold">Enable increased character limit for X</span>

          <div className="xx-ml-5 xx-text-slate-400">
            With this option enabled the AI responses for X will be greater than 280 characters.  
            Only use if you have a paid for "blue tick" account.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Options;
