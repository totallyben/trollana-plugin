import React, { useEffect, useState } from 'react';

import { setWallet } from '../../redux/Wallet/actions';

import { getKeyFromLocalStorage } from '../../utils';
import Api from '../../api';

const { useDispatch } = require('react-redux');

const Popup = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [apiError, setApiError] = useState(null); // State for tracking API errors
  const [isEditing, setIsEditing] = useState(false); // State to track editing mode

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletAddr = await getKeyFromLocalStorage('walletAddress');
      console.log(walletAddr);
      setWalletAddress(walletAddr);
      dispatch(setWallet(walletAddr));
      // If wallet address is fetched successfully, set isEditing to false
      setIsEditing(!walletAddr);
    };

    fetchWallet();
  }, []);

  const saveWalletAddress = async () => {
    console.log('saveWalletAddress local');

    if (walletAddress === '') {
      chrome.storage.local.set({
        walletAddress: walletAddress,
      }, () => {
        dispatch(setWallet(walletAddress));
        // Only set isEditing to false after successful save
        setIsEditing(false);
      });
      return;
    }

    Api.api()
    .post('/wallet/validate', { walletAddress: walletAddress })
    .then((response) => {
      if (response && response.error) {
        console.error('error', response.error);
        setApiError(response.error); // Update state with API error
        return;
      }
      // Reset API error if the request is successful
      setApiError(null);

      chrome.storage.local.set({
        walletAddress: walletAddress,
      }, () => {
        dispatch(setWallet(walletAddress));
        // Only set isEditing to false after successful save
        setIsEditing(false);
      });
    })
    .catch((error) => {
      console.error('error', error);
      setApiError(error); // Update state with API error
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const formatWalletAddress = (address) => {
    if (address.length > 8) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address; // Return the full address if it's too short to format
  };

  return (
    <main className="xx-flex-1 xx-overflow-auto xx-p-4 xx-flex xx-items-center xx-justify-center xx-text-slate-200">
      <div className="xx-text-center">
        <div className="xx-mb-8 xx-text-xl">
          {!walletAddress && (
            <>
              <div className="xx-text-sm xx-mt-3">
                Inject wit into your tweets with troll-like comebacks.
                I'm your digital jest-maker, turning ordinary exchanges into 
                moments of laughter and lightening up the Twitter atmosphere.
              </div>
              <div className="xx-text-sm xx-mt-3">
                And get paid while having fun!!
              </div>
              <div className="xx-text-sm xx-mt-5">
                Head to <a href="https://app.trollana.vip" target="_blank" rel="noreferrer">https://app.trollana.vip</a> to register
                and then enter your Wallet Address below.
              </div>
            </>
          )}
          {walletAddress && (
            <div className="xx-mt-5 xx-text-xl">
              You're all set, now head over to <a href="https://twitter.com" target="_blank" rel="noreferrer">X</a> and let's go trolling!!
            </div>
          )}
          {apiError && (
            <div className="xx-text-red-500 xx-mt-2">
              Error: {apiError}
            </div>
          )}
        </div>
        {walletAddress && !isEditing && (
          <div className="xx-rounded-lg xx-text-indigo-600 xx-bg-slate-100 xx-p-4">
          <div className="xx-mb-2 xx-text-lg xx-font-bold">Wallet address</div>
            <div className="xx-text-lg xx-mb-4">{formatWalletAddress(walletAddress)}</div>
            <button
              type="button"
              className="xx-rounded-md xx-bg-indigo-600 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
              onClick={handleEditClick}
            >
              Edit
            </button>
          </div>
        )}
        {(isEditing || !walletAddress) && (
          <div className="xx-rounded-lg xx-p-4 xx-text-indigo-600 xx-bg-slate-100">
            <div className="xx-mb-2 xx-text-lg xx-font-bold">Wallet address</div>
            <div className="xx-flex xx-rounded-md xx-shadow-sm xx-ring-1 xx-ring-inset xx-ring-gray-300 xx-focus-within:ring-2 xx-focus-within:ring-inset xx-focus-within:ring-indigo-600 xx-sm:max-w-md">
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="xx-block xx-w-3/4 xx-flex-1 xx-border-2 xx-rounded-md xx-border-indigo-500 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
                placeholder="Wallet address"
              />
            </div>
            <button
              type="button"
              className="xx-rounded-md xx-bg-indigo-600 xx-mt-3 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
              onClick={saveWalletAddress}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default Popup;
