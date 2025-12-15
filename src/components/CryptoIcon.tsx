import { FC, useState } from 'react';

interface CryptoIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const CryptoIcon: FC<CryptoIconProps> = ({ symbol, size = 40, className = '' }) => {
  const [error, setError] = useState(false);

  const emojiMap: { [key: string]: string } = {
    BTC: '₿',
    ETH: 'Ξ',
    BNB: '🔶',
    USDT: '₮',
    USDC: '🔵',
    BUSD: '🟡',
    DAI: '◈',
    TUSD: '🔷',
    USDP: '🔸',
    FRAX: '🔺',
    USDD: '💵',
  };

  const iconUrls: { [key: string]: string } = {
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    USDT: 'https://cryptologos.cc/logos/tether-usdt-logo.png',
    USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    BUSD: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png',
    DAI: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png',
    TUSD: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png',
    USDP: 'https://assets.coingecko.com/coins/images/6013/small/Pax_Dollar.png',
    FRAX: 'https://cryptologos.cc/logos/frax-frax-logo.png',
    USDD: 'https://assets.coingecko.com/coins/images/25380/small/USDD.png',
  };

  const iconUrl = iconUrls[symbol] || iconUrls['BTC'];
  const emoji = emojiMap[symbol] || '🪙';

  if (error) {
    return (
      <div 
        className={`rounded-full bg-primary/20 flex items-center justify-center font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {emoji}
      </div>
    );
  }

  return (
    <img 
      src={iconUrl} 
      alt={symbol} 
      width={size} 
      height={size} 
      className={`rounded-full ${className}`}
      style={{ width: size, height: size }}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};

export default CryptoIcon;