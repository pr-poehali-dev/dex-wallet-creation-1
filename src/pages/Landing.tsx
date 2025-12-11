import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import AnimatedBackground from '@/components/AnimatedBackground';
import { GradientButton } from '@/components/ui/gradient-button';
import { LiquidButton } from '@/components/ui/liquid-glass-button';
import { ParticleTextEffect } from '@/components/ui/interactive-text-particle';
import { GooeyText } from '@/components/ui/gooey-text-morphing';

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
        <header className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Wallet" className="text-primary" size={24} />
            </div>
            {/* Мобильная версия с анимацией */}
            <div className="block md:hidden">
              <GooeyText
                texts={["DEXXX", "WALLET", "CRYPTO", "SECURE"]}
                morphTime={1.2}
                cooldownTime={0.5}
                textClassName="text-2xl sm:text-3xl font-bold tracking-tight"
                className="h-12"
              />
            </div>
            {/* Десктопная версия без анимации */}
            <h1 className="hidden md:block text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              DEXXX WALLET
            </h1>
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
          
          <div className="flex flex-col md:flex-row min-h-[400px] sm:min-h-[500px] md:h-[600px]">
            <div className="flex-1 p-4 sm:p-6 md:p-12 relative z-10 flex flex-col justify-center">
              <div className="relative h-[640px] md:h-[768px] mb-8 overflow-hidden w-full hidden md:block">
                <ParticleTextEffect
                  text="DEXXXWALLET"
                  colors={['6b7280', '9ca3af', 'a1a1aa', '71717a', '52525b']}
                  animationForce={70}
                  particleDensity={2}
                />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-muted/30 text-foreground text-xs sm:text-sm font-medium mb-4 sm:mb-6 w-fit">
                <Icon name="Sparkles" size={14} className="sm:w-4 sm:h-4" />
                <span className="line-clamp-1">Децентрализованный кошелек</span>
              </div>
              <p className="text-sm sm:text-base md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-xl">
                Безопасное хранение, мгновенные переводы и обмен криптовалюты в одном приложении
              </p>
              <div className="flex flex-col gap-3 sm:gap-4">
                <GradientButton 
                  onClick={() => navigate('/app?mode=create')} 
                  className="w-full h-14 sm:h-12 text-base sm:text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
                >
                  <Icon name="Plus" size={22} className="mr-2.5" />
                  <span>Создать кошелек</span>
                </GradientButton>
                <GradientButton 
                  onClick={() => navigate('/app?mode=restore')} 
                  variant="variant" 
                  className="w-full h-14 sm:h-12 text-base sm:text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all border-2"
                >
                  <Icon name="RotateCcw" size={22} className="mr-2.5" />
                  <span>Восстановить кошелек</span>
                </GradientButton>
              </div>
            </div>

            <div className="flex-1 relative hidden md:block">
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
          <div className="p-6 sm:p-8 md:p-12 relative z-10">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Поддерживаемые токены</h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">
                Храните и управляйте популярными криптовалютами в одном месте
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {supportedTokens.map((token, index) => (
                <div key={`${token.symbol}-${token.network || 'native'}-${index}`} className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-300 hover:shadow-lg active:scale-[0.97] touch-manipulation">
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-background/50 flex items-center justify-center flex-shrink-0 shadow-md">
                    <img src={token.icon} alt={token.name} className="w-6 h-6 sm:w-7 sm:h-7 object-contain" />
                    {token.network && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-background border-2 border-card flex items-center justify-center overflow-hidden shadow-lg">
                        <img 
                          src={getNetworkIcon(token.network)!} 
                          alt={token.network} 
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 object-contain"
                        />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm sm:text-base truncate">{token.symbol}</div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground truncate leading-tight">{token.network || 'Native'}</div>
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

        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Почему выбирают нас</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Современные технологии для безопасного управления криптовалютой
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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
                <div className="p-5 sm:p-6 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-4 shadow-lg">
                    <Icon name={feature.icon as any} className="text-primary" size={26} />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
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
          <div className="p-6 sm:p-8 md:p-12 text-center relative z-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mx-auto mb-5 sm:mb-6 shadow-xl">
              <Icon name="Rocket" className="text-primary" size={36} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Готовы начать?</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Создайте свой безопасный кошелек прямо сейчас. Это займет меньше минуты.
            </p>
            <div className="max-w-md mx-auto px-4">
              <GradientButton 
                onClick={() => navigate('/app')} 
                className="w-full h-14 sm:h-12 text-base sm:text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
              >
                <Icon name="Plus" size={22} className="mr-2" />
                Создать кошелек бесплатно
              </GradientButton>
            </div>
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
                <span className="font-bold">DEXXX Wallet</span>
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
            © 2024 DEXXX Wallet. Все права защищены.
          </div>
        </footer>
      </div>
    </div>
  );
}