import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import AnimatedBackground from '@/components/AnimatedBackground';
import { GradientButton } from '@/components/ui/gradient-button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ParticleTextEffect } from '@/components/ui/interactive-text-particle';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: 'Shield',
      title: 'Полная безопасность',
      description: 'Ваши ключи хранятся локально, никто не имеет к ним доступа'
    },
    {
      icon: 'Zap',
      title: 'Быстрые транзакции',
      description: 'Мгновенная отправка и получение криптовалюты'
    },
    {
      icon: 'ArrowLeftRight',
      title: 'Встроенный обмен',
      description: 'Обменивайте токены без посредников'
    },
    {
      icon: 'LineChart',
      title: 'Отслеживание портфеля',
      description: 'Следите за балансом и историей операций'
    },
    {
      icon: 'Smartphone',
      title: 'Удобный интерфейс',
      description: 'Простой и понятный дизайн для всех'
    },
    {
      icon: 'Lock',
      title: 'Без регистрации',
      description: 'Создайте кошелек за 30 секунд'
    }
  ];

  const supportedTokens = [
    { symbol: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', network: null },
    { symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', network: null },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', network: null },
    
    { symbol: 'USDT', name: 'Tether (Ethereum)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'ETH' },
    { symbol: 'USDT', name: 'Tether (Tron)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'TRX' },
    { symbol: 'USDT', name: 'Tether (BSC)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'BSC' },
    { symbol: 'USDT', name: 'Tether (Polygon)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'MATIC' },
    { symbol: 'USDT', name: 'Tether (Arbitrum)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'ARB' },
    
    { symbol: 'USDC', name: 'USD Coin (Ethereum)', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'ETH' },
    { symbol: 'USDC', name: 'USD Coin (BSC)', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'BSC' },
    { symbol: 'USDC', name: 'USD Coin (Polygon)', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'MATIC' },
    { symbol: 'USDC', name: 'USD Coin (Arbitrum)', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'ARB' },
    { symbol: 'USDC', name: 'USD Coin (Optimism)', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'OP' },
    
    { symbol: 'BUSD', name: 'Binance USD (BSC)', icon: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', network: 'BSC' },
    { symbol: 'BUSD', name: 'Binance USD (Ethereum)', icon: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', network: 'ETH' },
    
    { symbol: 'DAI', name: 'Dai (Ethereum)', icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', network: 'ETH' },
    { symbol: 'DAI', name: 'Dai (BSC)', icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', network: 'BSC' },
    { symbol: 'DAI', name: 'Dai (Polygon)', icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', network: 'MATIC' },
    
    { symbol: 'TUSD', name: 'TrueUSD (Ethereum)', icon: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', network: 'ETH' },
    { symbol: 'TUSD', name: 'TrueUSD (Tron)', icon: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', network: 'TRX' },
    
    { symbol: 'USDP', name: 'Pax Dollar (Ethereum)', icon: 'https://assets.coingecko.com/coins/images/6013/small/Pax_Dollar.png', network: 'ETH' },
    
    { symbol: 'FRAX', name: 'Frax (Ethereum)', icon: 'https://cryptologos.cc/logos/frax-frax-logo.png', network: 'ETH' },
    { symbol: 'FRAX', name: 'Frax (BSC)', icon: 'https://cryptologos.cc/logos/frax-frax-logo.png', network: 'BSC' },
    
    { symbol: 'USDD', name: 'USDD (Tron)', icon: 'https://assets.coingecko.com/coins/images/25380/small/USDD.png', network: 'TRX' },
    { symbol: 'USDD', name: 'USDD (Ethereum)', icon: 'https://assets.coingecko.com/coins/images/25380/small/USDD.png', network: 'ETH' },
  ];

  const getNetworkIcon = (network: string | null) => {
    if (!network) return null;
    const icons: { [key: string]: string } = {
      'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
      'BSC': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
      'TRX': 'https://cryptologos.cc/logos/tron-trx-logo.png',
      'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
      'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
      'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
    };
    return icons[network] || null;
  };

  return (
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 relative z-10">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted/30 flex items-center justify-center">
              <Icon name="Wallet" className="text-foreground" size={24} />
            </div>
            <span className="text-xl font-bold">DEX Wallet</span>
          </div>
        </header>

        <div className="mb-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 z-0 h-full w-full rounded-xl 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
          <div
            className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-xl"
            style={{ backdropFilter: 'url("#hero-glass")' }}
          />
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="gray"
          />
          
          <div className="flex flex-col md:flex-row h-[600px]">
            <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
              <div className="relative h-32 md:h-40 mb-8 overflow-hidden max-w-3xl">
                <ParticleTextEffect
                  text="DEXXXWALLET"
                  colors={['3b82f6', '8b5cf6', 'a855f7', 'ec4899', 'f43f5e', '06b6d4', '14b8a6']}
                  animationForce={70}
                  particleDensity={2}
                />
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-foreground text-sm font-medium mb-6 w-fit">
                <Icon name="Sparkles" size={16} />
                <span>Децентрализованный кошелек нового поколения</span>
              </div>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Безопасное хранение, мгновенные переводы и обмен криптовалюты в одном приложении
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <GradientButton onClick={() => navigate('/app?mode=create')} className="flex-1 sm:flex-none">
                  Создать кошелек
                  <Icon name="Plus" size={20} className="ml-2" />
                </GradientButton>
                <GradientButton onClick={() => navigate('/app?mode=restore')} variant="variant" className="flex-1 sm:flex-none">
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Восстановить кошелек
                </GradientButton>
              </div>
            </div>

            <div className="flex-1 relative">
              <SplineScene 
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
          <svg className="hidden">
            <defs>
              <filter
                id="hero-glass"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.05 0.05"
                  numOctaves="1"
                  seed="1"
                  result="turbulence"
                />
                <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="blurredNoise"
                  scale="70"
                  xChannelSelector="R"
                  yChannelSelector="B"
                  result="displaced"
                />
                <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                <feComposite in="finalBlur" in2="finalBlur" operator="over" />
              </filter>
            </defs>
          </svg>
        </div>

        <section className="mb-20 relative">
          <div className="absolute top-0 left-0 z-0 h-full w-full rounded-xl 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
          <div
            className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-xl"
            style={{ backdropFilter: 'url("#tokens-glass")' }}
          />
          <div className="p-8 md:p-12 relative z-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Поддерживаемые токены</h2>
              <p className="text-muted-foreground text-lg">
                Храните и управляйте популярными криптовалютами в одном месте
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {supportedTokens.map((token, index) => (
                <div key={`${token.symbol}-${token.network || 'native'}-${index}`} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className="relative w-10 h-10 rounded-full bg-background flex items-center justify-center flex-shrink-0">
                    <img src={token.icon} alt={token.name} className="w-6 h-6 object-contain" />
                    {token.network && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-card flex items-center justify-center overflow-hidden shadow-md">
                        <img 
                          src={getNetworkIcon(token.network)!} 
                          alt={token.network} 
                          className="w-4 h-4 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{token.symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">{token.network || 'Native'}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <svg className="hidden">
            <defs>
              <filter id="tokens-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="2" result="turbulence" />
                <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                <feComposite in="finalBlur" in2="finalBlur" operator="over" />
              </filter>
            </defs>
          </svg>
        </section>

        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Почему выбирают нас</h2>
            <p className="text-muted-foreground text-lg">
              Современные технологии для безопасного управления криптовалютой
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="relative group cursor-pointer">
                <div className="absolute top-0 left-0 z-0 h-full w-full rounded-xl 
                  shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
                  dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)] 
                  transition-all group-hover:scale-105" />
                <div
                  className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-xl"
                  style={{ backdropFilter: `url(#feature-glass-${index})` }}
                />
                <div className="p-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-4">
                    <Icon name={feature.icon as any} className="text-foreground" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
                <svg className="hidden">
                  <defs>
                    <filter id={`feature-glass-${index}`} x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                      <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed={index + 3} result="turbulence" />
                      <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                      <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
                      <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                      <feComposite in="finalBlur" in2="finalBlur" operator="over" />
                    </filter>
                  </defs>
                </svg>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 relative">
          <div className="absolute top-0 left-0 z-0 h-full w-full rounded-xl 
            shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] 
            dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
          <div
            className="absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-xl"
            style={{ backdropFilter: 'url("#cta-glass")' }}
          />
          <div className="p-12 text-center relative z-10">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Создайте свой безопасный кошелек прямо сейчас. Это займет меньше минуты.
            </p>
            <GradientButton onClick={() => navigate('/app')}>
              Создать кошелек бесплатно
              <Icon name="Rocket" size={20} className="ml-2" />
            </GradientButton>
          </div>
          <svg className="hidden">
            <defs>
              <filter id="cta-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
                <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves="1" seed="10" result="turbulence" />
                <feGaussianBlur in="turbulence" stdDeviation="2" result="blurredNoise" />
                <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale="70" xChannelSelector="R" yChannelSelector="B" result="displaced" />
                <feGaussianBlur in="displaced" stdDeviation="4" result="finalBlur" />
                <feComposite in="finalBlur" in2="finalBlur" operator="over" />
              </filter>
            </defs>
          </svg>
        </section>

        <footer className="border-t pt-8 pb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-muted/30 flex items-center justify-center">
                  <Icon name="Wallet" className="text-foreground" size={18} />
                </div>
                <span className="font-bold">DEX Wallet</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Безопасный децентрализованный кошелек для управления криптоактивами
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Продукт</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Возможности</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Безопасность</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Токены</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Поддержка</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Документация</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Контакты</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2024 DEX Wallet. Все права защищены.
          </div>
        </footer>
      </div>
    </div>
  );
}