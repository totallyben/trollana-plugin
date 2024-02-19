import React, { useEffect, useState } from 'react';

import { setWallet } from '../../redux/Wallet/actions';

import { getKeyFromLocalStorage } from '../../utils';

const { useDispatch } = require('react-redux');

const Popup = () => {
  const [walletAddress, setWalletAddress] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletAddr = await getKeyFromLocalStorage('walletAddress');
      console.log(walletAddr);
      setWalletAddress(walletAddr)
      dispatch(setWallet(walletAddr));
    };

    fetchWallet();
  }, []);

  const saveWalletAddress = async () => {
    console.log('saveWalletAddress local');

    chrome.storage.local.set({
      walletAddress: walletAddress,
    }, () => {
      dispatch(setWallet(walletAddress));
    });
  };

  return (
    <main className="xx-flex-1 xx-overflow-auto xx-p-4 xx-flex xx-items-center xx-justify-center xx-text-slate-200">
      <div className="xx-text-center">
        <div className="xx-mb-10 xx-text-2xl">
          Let's go trolling
        </div>
        <div className="xx-mb-2">
          Wallet address
        </div>
        <div className="xx-flex xx-rounded-md xx-shadow-sm xx-ring-1 xx-ring-inset xx-ring-gray-300 xx-focus-within:ring-2 xx-focus-within:ring-inset xx-focus-within:ring-indigo-600 xx-sm:max-w-md">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="xx-block xx-flex-1 border-0 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
              placeholder="Wallet address"
            />
        </div>
        <button
          type="button"
          className="xx-rounded-md xx-bg-indigo-600 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
          onClick={saveWalletAddress}
        >
          Save
        </button>
      </div>
    </main>
  );
};

export default Popup;