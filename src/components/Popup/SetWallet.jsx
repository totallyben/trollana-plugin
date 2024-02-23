import React from 'react';

export function SetWallet(props) {
  return (
    <div className="xx-text-center">
      <div className="xx-mb-4 xx-text-xl">
        {!props.haveWallet && (
          <>
            <div className="xx-text-sm">
              Inject wit into your tweets with troll-like comebacks. I'm your
              digital jest-maker, turning ordinary exchanges into moments of
              laughter and lightening up the Twitter atmosphere.
            </div>
            <div className="xx-text-sm xx-mt-3">
              And get paid while having fun!!
            </div>
            <div className="xx-text-sm xx-mt-5">
              Head to{' '}
              <a
                href="https://app.trollana.vip"
                target="_blank"
                rel="noreferrer"
              >
                https://app.trollana.vip
              </a>{' '}
              to register and then enter your Wallet Address below.
            </div>
          </>
        )}
        {props.apiError && (
          <div className="xx-text-red-500 xx-text-base xx-text-bold xx-mt-3">
            Error: {props.apiError}
          </div>
        )}
        {(props.isEditing || !props.walletAddress) && (
          <div className="xx-rounded-lg xx-mt-3 xx-px-4 xx-py-2 xx-text-indigo-600 xx-bg-slate-100 xx-mx-6">
            <div className="xx-mb-2 xx-text-lg xx-font-bold">
              Wallet address
            </div>
            <div className="xx-flex xx-rounded-md xx-shadow-sm xx-ring-1 xx-ring-inset xx-ring-gray-300 xx-focus-within:ring-2 xx-focus-within:ring-inset xx-focus-within:ring-indigo-600 xx-sm:max-w-md">
              <input
                type="text"
                value={props.walletAddress}
                onChange={(e) => props.setWalletAddress(e.target.value)}
                className="xx-block xx-text-sm xx-flex-1 xx-border-2 xx-rounded-md xx-border-indigo-500 xx-p-1.5 xx-text-gray-900 xx-placeholder:text-gray-400 xx-focus:ring-0 xx-sm:text-sm xx-sm:leading-6"
                placeholder="Wallet address"
              />
            </div>
            <button
              type="button"
              className="xx-rounded-md xx-bg-indigo-600 xx-mt-3 xx-px-3 xx-py-2 xx-text-sm xx-font-semibold xx-text-white xx-shadow-sm xx-hover:bg-indigo-500 xx-focus-visible:outline xx-focus-visible:outline-2 xx-focus-visible:outline-offset-2 xx-focus-visible:outline-indigo-600"
              onClick={props.saveWalletAddress}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
