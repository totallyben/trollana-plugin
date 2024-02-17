import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { faTelegram } from '@fortawesome/free-brands-svg-icons'
import { faGlobe } from '@fortawesome/free-solid-svg-icons'

const footerLinks = [
  { name: "twitter", icon: faXTwitter, link: "https://twitter.com/Trollana_Solana" },
  { name: "telegram", icon: faTelegram, link: "https://t.co/PlWpBNKM6r" },
  { name: "web", icon: faGlobe, link: "https://trollana.vip" },
  // { name: "help", icon: faCircleQuestion, link: "https://trollana.vip" },
]

export function Footer() {
  return (
    <footer className="h-12 border-t-2 border-indigo-500 flex items-center justify-center text-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {footerLinks.map((item) => (
          <a key={item.name} href={item.link} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={item.icon} className="mr-4" />
          </a>
        ))}
      </div>
    </footer>
  );
}