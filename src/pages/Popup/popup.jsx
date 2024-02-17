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
    <main className="flex-1 overflow-auto p-4 flex items-center justify-center text-slate-200">
      <div className="text-center">
        <div className="mb-10 text-2xl">
          Let's go trolling
        </div>
        <div className="mb-2">
          Wallet address
        </div>
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="block flex-1 border-0 p-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Wallet address"
            />
        </div>
        <button
          type="button"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={saveWalletAddress}
        >
          Save
        </button>
      </div>
    </main>
  );
};

export default Popup;