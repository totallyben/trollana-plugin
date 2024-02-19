import React from 'react';

export function Header() {
  return (
    <header className="xx-h-12 xx-border-b-2 xx-border-indigo-500 xx-flex xx-items-center xx-justify-center xx-w-full">
      <img 
        src="logo.png"
        width={120}
        alt="Trollan logo"
      />
    </header>

    // <header className="flex items-center justify-between h-16 w-full fixed top-0 left-0 border-b-2 border-indigo-500 z-10">
    //   <Image
    //     src={Logo}
    //     width={150}
    //     alt="Trollan logo"
    //     className="ml-3"
    //   />

    //   <div>
    //     <WalletMultiButton />
    //   </div>
    // </header>
  );
}
