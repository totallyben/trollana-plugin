import React, { useEffect, useState } from 'react';

import { setWallet } from '../../redux/Wallet/actions';
import { Dashboard, SetWallet } from '../../components/Popup';

import { getKeyFromLocalStorage } from '../../utils';
import Api from '../../api';

const { useDispatch } = require('react-redux');

export const TrollToEarn = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [apiError, setApiError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [haveWallet, setHaveWallet] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletAddr = await getKeyFromLocalStorage('walletAddress');
      setWalletAddress(walletAddr);
      dispatch(setWallet(walletAddr));
      setIsEditing(!walletAddr);
      setHaveWallet(walletAddr);
    };

    fetchWallet();
  }, [dispatch]);

  const saveWalletAddress = async () => {
    if (walletAddress === '') {
      chrome.storage.local.set(
        {
          walletAddress: walletAddress,
        },
        () => {
          setWalletAddress(walletAddress);
          dispatch(setWallet(walletAddress));
          // Only set isEditing to false after successful save
          setIsEditing(false);
          setHaveWallet(false);
        }
      );
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
        setApiError(null);

        chrome.storage.local.set(
          {
            walletAddress: walletAddress,
          },
          () => {
            dispatch(setWallet(walletAddress));
            // Only set isEditing to false after successful save
            setIsEditing(false);
            setHaveWallet(true);
          }
        );
      })
      .catch((error) => {
        console.error('error', error);
        setApiError(error); // Update state with API error
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <main className="xx-flex-1 xx-overflow-auto xx-p-4 xx-flex xx-items-center xx-justify-center xx-text-slate-200">
      <Dashboard
        walletAddress={walletAddress}
        isEditing={isEditing}
        handleEditClick={handleEditClick}
      />
      <SetWallet
        walletAddress={walletAddress}
        isEditing={isEditing}
        haveWallet={haveWallet}
        apiError={apiError}
        saveWalletAddress={saveWalletAddress}
        setWalletAddress={setWalletAddress}
      />
    </main>
  );
};
