import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXTwitter,
  faTelegram,
  faDiscord,
} from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const footerLinks = [
  {
    name: 'twitter',
    icon: faXTwitter,
    link: 'https://twitter.com/Trollana_Solana',
  },
  { name: 'telegram', icon: faTelegram, link: 'https://t.co/PlWpBNKM6r' },
  { name: 'discord', icon: faDiscord, link: 'https://discord.gg/xD6H9QjS' },
  { name: 'web', icon: faGlobe, link: 'https://trollana.vip' },
  // { name: "help", icon: faCircleQuestion, link: "https://trollana.vip" },
];

export function Footer() {
  return (
    <footer className="xx-h-12 xx-border-t-2 xx-border-indigo-500 xx-flex xx-items-center xx-justify-center xx-text-slate-200">
      <div className="xx-mx-auto xx-max-w-7xl xx-px-4 xx-sm:px-6 vlg:px-8">
        {footerLinks.map((item) => (
          <a key={item.name} href={item.link} target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={item.icon} className="xx-mr-4" />
          </a>
        ))}
      </div>
    </footer>
  );
}
