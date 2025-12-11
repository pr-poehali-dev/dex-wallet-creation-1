import { FC } from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const CryptoIcon: FC<CryptoIconProps> = ({ symbol, size = 40, className = '' }) => {
  const iconMap: { [key: string]: JSX.Element } = {
    BTC: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#F7931A"/>
        <path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z" fill="white"/>
      </svg>
    ),
    ETH: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#627EEA"/>
        <path d="M16.498 4v8.87l7.497 3.35z" fill="white" fillOpacity=".602"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z" fill="white"/>
        <path d="M16.498 21.968v6.027L24 17.616z" fill="white" fillOpacity=".602"/>
        <path d="M16.498 27.995v-6.028L9 17.616z" fill="white"/>
        <path d="M16.498 20.573l7.497-4.353-7.497-3.348z" fill="white" fillOpacity=".2"/>
        <path d="M9 16.22l7.498 4.353v-7.701z" fill="white" fillOpacity=".602"/>
      </svg>
    ),
    BNB: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
        <path d="M10.5 15.97l2.05-2.04 2.05 2.04-1.18 1.19-2.92-2.92 1.18-1.18zm5.47 0l3.54 3.54 2.04-2.05-5.58-5.58-2.05 2.05.88.88-.88.88 2.05 2.05-2.05 2.04 2.05 2.05zm-4.29 4.29l2.05 2.05 2.05-2.05-2.05-2.04-2.05 2.04zm8.58-8.58l-2.05-2.05-2.05 2.05 2.05 2.04 2.05-2.04z" fill="white"/>
      </svg>
    ),
    USDT: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#26A17B"/>
        <path d="M18.3 12.8h-4.6v2.2c1.5.1 3 .3 4.6.3v-2.5zm-4.6 3.5c-3.4 0-6.1-.6-6.1-1.3s2.7-1.3 6.1-1.3h4.6c3.4 0 6.1.6 6.1 1.3s-2.7 1.3-6.1 1.3h-4.6zm4.6-6.6h-4.6V8.5h-2.2v1.2H7.8v2.2h1.2c-.8.3-1.2.8-1.2 1.4 0 1.7 3.6 3.1 8.1 3.1h4.6c4.5 0 8.1-1.4 8.1-3.1 0-.6-.4-1.1-1.2-1.4h1.2v-2.2h-3.7V8.5h-2.2v1.2z" fill="white"/>
      </svg>
    ),
    USDC: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#2775CA"/>
        <path d="M20.5 14.5c0-1.4-1.1-2.3-2.9-2.4v-2c1.1.1 1.9.6 2.4 1.4l1.7-1c-.8-1.3-2.1-2.1-4.1-2.2V6h-1.3v2.3c-2.3.2-3.8 1.5-3.8 3.4 0 1.9 1.3 3 3.4 3.3v4.7c-1.3-.1-2.3-.8-2.8-1.9l-1.8.9c.7 1.6 2.2 2.6 4.6 2.8V24h1.3v-2.5c2.4-.2 4-1.6 4-3.6 0-2-1.4-3.2-3.7-3.4v-4.5c1.1.1 1.8.6 2.2 1.5l1.8-1zm-6.8-.6c-1.1-.2-1.6-.8-1.6-1.6 0-.9.7-1.5 1.9-1.6v3.2zm3.4 6.2v-3.4c1.2.2 1.8.8 1.8 1.7 0 .9-.7 1.6-1.8 1.7z" fill="white"/>
      </svg>
    ),
    BUSD: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#F0B90B"/>
        <path d="M10.5 15.97l2.05-2.04 2.05 2.04-1.18 1.19-2.92-2.92 1.18-1.18zm5.47 0l3.54 3.54 2.04-2.05-5.58-5.58-2.05 2.05.88.88-.88.88 2.05 2.05-2.05 2.04 2.05 2.05zm-4.29 4.29l2.05 2.05 2.05-2.05-2.05-2.04-2.05 2.04zm8.58-8.58l-2.05-2.05-2.05 2.05 2.05 2.04 2.05-2.04z" fill="white"/>
      </svg>
    ),
    DAI: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#F4B731"/>
        <path d="M9 12.5h7.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5H9v-9zm1.5 1.5v6h6c1.7 0 3-1.3 3-3s-1.3-3-3-3h-6zM8 15h16M8 17h16" stroke="white" strokeWidth="1" fill="none"/>
      </svg>
    ),
    TUSD: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#002868"/>
        <path d="M16 8l8 4v8l-8 4-8-4v-8l8-4zm0 2.3l-6 3v6l6 3 6-3v-6l-6-3z" fill="#00D4FF"/>
        <text x="16" y="19" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">T</text>
      </svg>
    ),
    USDP: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#00865A"/>
        <text x="16" y="21" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">P$</text>
      </svg>
    ),
    FRAX: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#000000"/>
        <path d="M16 8v16M10 12h12M10 20h12" stroke="white" strokeWidth="2"/>
      </svg>
    ),
    USDD: (
      <svg viewBox="0 0 32 32" width={size} height={size} className={className}>
        <circle cx="16" cy="16" r="16" fill="#1A1B20"/>
        <circle cx="16" cy="16" r="10" fill="none" stroke="#FFD700" strokeWidth="2"/>
        <text x="16" y="20" fill="#FFD700" fontSize="10" fontWeight="bold" textAnchor="middle">D</text>
      </svg>
    ),
  };

  return iconMap[symbol] || iconMap['BTC'];
};

export default CryptoIcon;
