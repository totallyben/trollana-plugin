import React from 'react';

export function WalletNotConnected({ walletAddress, isEditing, apiError, saveWalletAddress, handleEditClick }) {
  return (
    <>
      <div className="xx-text-sm xx-mt-3">
        Inject wit into your tweets with troll-like comebacks.
        I'm your digital jest-maker, turning ordinary exchanges into moments of laughter and lightening up the Twitter atmosphere.
      </div>
      <div className="xx-text-sm xx-mt-3">
        And earn while having fun!!
      </div>
      <div className="xx-text-sm xx-mt-5 xx-font-bold">
        If you haven't registered yet, head to <a href="https://app.trollana.vip" target="_blank" rel="noreferrer">https://app.trollana.vip</a>
        and then enter your Wallet Address below.
      </div>
      {apiError && (
        <div className="xx-text-red-500 xx-mt-2">
          Error: {apiError}
        </div>
      )}
      <div className="xx-rounded-lg xx-border-slate-200 xx-border-2 xx-border-dotted xx-p-4">
        <div className="xx-mb-2 xx-text-lg">Wallet address</div>
        <div className="xx-flex xx-rounded-md xx-shadow-sm xx-ring-1 xx-ring-inset xx-ring-gray-300 xx-focus-within:ring-2 xx-focus-within:ring-inset xx-focus-within:ring-indigo-600 xx-sm:max-w-md">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => saveWalletAddress(e.target.value)} // Updated to use saveWalletAddress prop
            className="xx-block xx-w-3/4 xx-flex-1 border-0 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
            placeholder="Wallet address"
            disabled={isEditing} // Disable input if not in editing mode
          />
        </div>
        {!isEditing && ( // Only show Save button if not in editing mode
          <button
            type="button"
            className="xx-rounded-md xx-bg-indigo-600 xx-mt-3 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
            onClick={saveWalletAddress}
          >
            Save
          </button>
        )}
      </div>
    </>
  );
}
