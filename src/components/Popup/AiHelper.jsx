import React, { useEffect, useState } from 'react';

import { getKeyFromLocalStorage } from '../../utils';

import { PersonaSelect } from './PersonaSelect';

const { useDispatch } = require('react-redux');

export const AiHelper = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [haveWallet, setHaveWallet] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletAddr = await getKeyFromLocalStorage('walletAddress');
      console.log(walletAddr);
      setWalletAddress(walletAddr);
      setIsEditing(!walletAddr);
      setHaveWallet(walletAddr);
    };

    fetchWallet();
  }, []);

  const saveWalletAddress = async () => {
    console.log('saveWalletAddress local');

    if (walletAddress === '') {
      chrome.storage.local.set(
        {
          walletAddress: walletAddress,
        },
        () => {
          setWalletAddress(walletAddress);
          // dispatch(setWallet(walletAddress));
          // Only set isEditing to false after successful save
          setIsEditing(false);
          setHaveWallet(false);
        }
      );
      return;
    }
  };

  // const handleEditClick = () => {
  //   setIsEditing(true);
  // };

  return (
    <main className="xx-flex-1 xx-overflow-auto xx-p-4 xx-flex xx-items-center xx-justify-center">
      <PersonaSelect />
    </main>
  );
};
