import { FC } from 'react';

interface NetworkBadgeProps {
  network: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NetworkBadge: FC<NetworkBadgeProps> = ({ network, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'text-[7px] px-1 py-0.5 rounded',
    md: 'text-[9px] px-1.5 py-0.5 rounded-md',
    lg: 'text-[10px] px-2 py-1 rounded-lg',
  };

  const networkStyles: { [key: string]: { bg: string; text: string; icon?: JSX.Element } } = {
    ETH: {
      bg: '#627EEA',
      text: 'ETH',
      icon: (
        <svg viewBox="0 0 8 8" width="8" height="8" className="mr-0.5">
          <path d="M4 0L4 3L7 4.5L4 0Z" fill="white" fillOpacity="0.6"/>
          <path d="M4 0L1 4.5L4 3L4 0Z" fill="white"/>
          <path d="M4 8L4 5.5L7 4.8L4 8Z" fill="white" fillOpacity="0.6"/>
          <path d="M4 8L1 4.8L4 5.5L4 8Z" fill="white"/>
        </svg>
      ),
    },
    BSC: {
      bg: '#F3BA2F',
      text: 'BSC',
      icon: (
        <svg viewBox="0 0 8 8" width="8" height="8" className="mr-0.5">
          <circle cx="4" cy="4" r="3" fill="white"/>
          <circle cx="4" cy="4" r="1.5" fill="#F3BA2F"/>
        </svg>
      ),
    },
    TRX: {
      bg: '#FF060A',
      text: 'TRX',
    },
    MATIC: {
      bg: '#8247E5',
      text: 'MATIC',
    },
    ARB: {
      bg: '#28A0F0',
      text: 'ARB',
    },
    OP: {
      bg: '#FF0420',
      text: 'OP',
    },
  };

  const style = networkStyles[network] || { bg: '#6b7280', text: network };

  return (
    <div
      className={`${sizeClasses[size]} font-bold leading-none flex items-center justify-center border border-white/20 shadow-lg ${className}`}
      style={{ backgroundColor: style.bg, color: 'white' }}
    >
      {style.icon}
      <span>{style.text}</span>
    </div>
  );
};

export default NetworkBadge;
