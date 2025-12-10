import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { SplineScene } from '@/components/ui/splite';
import { Spotlight } from '@/components/ui/spotlight';
import AnimatedBackground from '@/components/AnimatedBackground';
import { GradientButton } from '@/components/ui/gradient-button';

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
    { symbol: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { symbol: 'USDT', name: 'Tether TRC20', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  ];

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
          <GradientButton onClick={() => navigate('/app')} variant="variant">
            Войти
          </GradientButton>
        </header>

        <Card className="mb-20 bg-card/80 backdrop-blur-sm relative overflow-hidden border-border">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="gray"
          />
          
          <div className="flex flex-col md:flex-row h-[600px]">
            <div className="flex-1 p-8 md:p-12 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/30 text-foreground text-sm font-medium mb-6 w-fit">
                <Icon name="Sparkles" size={16} />
                <span>Децентрализованный кошелек нового поколения</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
                Ваши криптоактивы<br />
                под полным контролем
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-xl">
                Безопасное хранение, мгновенные переводы и обмен криптовалюты в одном приложении
              </p>
              <div className="flex gap-4">
                <GradientButton onClick={() => navigate('/app')}>
                  Создать кошелек
                  <Icon name="ArrowRight" size={20} className="ml-2" />
                </GradientButton>
                <GradientButton variant="variant">
                  <Icon name="Play" size={20} className="mr-2" />
                  Как работает
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
        </Card>

        <section className="mb-20">
          <Card className="p-8 md:p-12 bg-card/60 backdrop-blur-sm border-border">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Поддерживаемые токены</h2>
                <p className="text-muted-foreground mb-6">
                  Храните и управляйте популярными криптовалютами в одном месте
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {supportedTokens.map((token) => (
                    <div key={token.symbol} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center overflow-hidden">
                        <img src={token.icon} alt={token.name} className="w-6 h-6 object-contain" />
                      </div>
                      <div>
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-muted/20 blur-3xl rounded-full"></div>
                <div className="relative bg-card backdrop-blur-sm rounded-2xl p-6 border-border border">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Общий баланс</span>
                      <Icon name="TrendingUp" size={16} className="text-success" />
                    </div>
                    <div className="text-4xl font-bold">$48,729.15</div>
                    <div className="text-success text-sm">+12.5% за месяц</div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <GradientButton className="w-full min-w-0 px-4">
                        <Icon name="ArrowDownLeft" size={16} className="mr-2" />
                        Получить
                      </GradientButton>
                      <GradientButton variant="variant" className="w-full min-w-0 px-4">
                        <Icon name="ArrowUpRight" size={16} className="mr-2" />
                        Отправить
                      </GradientButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
              <Card key={index} className="p-6 cursor-pointer transition-all hover:border-foreground/30 bg-card/60 backdrop-blur-sm">
                <div className="w-12 h-12 rounded-xl bg-muted/30 flex items-center justify-center mb-4">
                  <Icon name={feature.icon as any} className="text-foreground" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <Card className="p-12 text-center bg-card/60 backdrop-blur-sm border-border">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Создайте свой безопасный кошелек прямо сейчас. Это займет меньше минуты.
            </p>
            <GradientButton onClick={() => navigate('/app')}>
              Создать кошелек бесплатно
              <Icon name="Rocket" size={20} className="ml-2" />
            </GradientButton>
          </Card>
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