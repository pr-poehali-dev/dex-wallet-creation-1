import { FC } from 'react';

interface NetworkBadgeProps {
  network: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NetworkBadge: FC<NetworkBadgeProps> = ({ network, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  const networkIcons: { [key: string]: string } = {
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    BSC: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    TRX: 'https://cryptologos.cc/logos/tron-trx-logo.png',
    MATIC: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
    ARB: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
    OP: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  };

  const iconUrl = networkIcons[network];

  if (!iconUrl) {
    return null;
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-background border-2 border-card flex items-center justify-center overflow-hidden shadow-lg ${className}`}
    >
      <img 
        src={iconUrl} 
        alt={network} 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default NetworkBadge;
