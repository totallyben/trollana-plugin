import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setWallet } from '../../redux/Wallet/actions';
import { getKeyFromLocalStorage } from '../../utils';
import Api from '../../api';
import { WalletConnected, WalletNotConnected} from '../../components/Popup';

const Popup = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [apiError, setApiError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchWallet = async () => {
      const walletAddr = await getKeyFromLocalStorage('walletAddress');
      setWalletAddress(walletAddr);
      dispatch(setWallet(walletAddr));
      setIsEditing(!walletAddr); // Set isEditing based on the presence of a wallet address
    };

    fetchWallet();
  }, []);

  const saveWalletAddress = async (address) => {
    setWalletAddress(address); // Update local state with the new address

    if (address === '') {
      chrome.storage.local.set({ walletAddress: address }, () => {
        dispatch(setWallet(address));
        setIsEditing(false);
      });
      return;
    }

    try {
      const response = await Api.api().post('/wallet/validate', { walletAddress: address });
      if (response && response.error) {
        setApiError(response.error);
      } else {
        setApiError(null);
        chrome.storage.local.set({ walletAddress: address }, () => {
          dispatch(setWallet(address));
          setIsEditing(false);
        });
      }
    } catch (error) {
      setApiError(error.toString());
    }
  };

  const handleEditClick = () => setIsEditing(true);

  return (
    <main className="xx-flex-1 xx-overflow-auto xx-p-4 xx-flex xx-items-center xx-justify-center xx-text-slate-200">
      <div className="xx-text-center">
        <div className="xx-mb-8 xx-text-xl">
          Trollana's AI Reply Plugin
        </div>
        {walletAddress ? (
          <WalletConnected
            walletAddress={walletAddress}
            isEditing={isEditing}
            apiError={apiError}
            saveWalletAddress={saveWalletAddress}
            handleEditClick={handleEditClick}
          />
        ) : (
          <WalletNotConnected
            walletAddress={walletAddress}
            isEditing={isEditing}
            apiError={apiError}
            saveWalletAddress={saveWalletAddress}
            handleEditClick={handleEditClick}
          />
        )}
      </div>
    </main>
  );
};

export default Popup;
