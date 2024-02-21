import React from 'react';

export function WalletConnected({ walletAddress, isEditing, apiError, saveWalletAddress, handleEditClick }) {
  const formatWalletAddress = (address) => {
    if (address.length > 8) {
      return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
    return address; // Return the full address if it's too short to format
  };

  return (
    <>
      <div className="xx-text-sm xx-mt-3">
        You're all set.
      </div>
      <div className="xx-text-sm xx-mt-3">
        Now head over to <a href="https://twitter.com" target="_blank" rel="noreferrer">X</a> and let's go trolling!!
      </div>
      {apiError && (
        <div className="xx-text-red-500 xx-mt-2">
          Error: {apiError}
        </div>
      )}
      <div className="xx-rounded-lg xx-border-slate-200 xx-border-2 xx-border-dotted xx-p-4">
        <div className="xx-mb-2 xx-text-lg">Wallet address</div>
        <div className="xx-text-slate-200 xx-text-lg xx-mb-4">{formatWalletAddress(walletAddress)}</div>
        
        <button
          type="button"
          className="xx-rounded-md xx-bg-indigo-600 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
          onClick={handleEditClick}
        >
          Edit
        </button>
      </div>
    </>
  );
}
