import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

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
    { symbol: 'BTC', name: 'Bitcoin', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', icon: '₮' },
    { symbol: 'BNB', name: 'Binance', icon: '🔶' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Wallet" className="text-primary" size={24} />
            </div>
            <span className="text-xl font-bold">DEX Wallet</span>
          </div>
          <Button onClick={() => navigate('/app')} variant="outline">
            Войти
          </Button>
        </header>

        <section className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Icon name="Sparkles" size={16} />
            <span>Децентрализованный кошелек нового поколения</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Ваши криптоактивы<br />
            под полным контролем
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Безопасное хранение, мгновенные переводы и обмен криптовалюты в одном приложении
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/app')} size="lg" className="text-lg px-8">
              Создать кошелек
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              <Icon name="Play" size={20} className="mr-2" />
              Как это работает
            </Button>
          </div>
        </section>

        <section className="mb-20">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Поддерживаемые токены</h2>
                <p className="text-muted-foreground mb-6">
                  Храните и управляйте популярными криптовалютами в одном месте
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {supportedTokens.map((token) => (
                    <div key={token.symbol} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                      <span className="text-2xl">{token.icon}</span>
                      <div>
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-sm text-muted-foreground">{token.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                <div className="relative bg-background/80 backdrop-blur-sm rounded-2xl p-6 border">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Общий баланс</span>
                      <Icon name="TrendingUp" size={16} className="text-success" />
                    </div>
                    <div className="text-4xl font-bold">$48,729.15</div>
                    <div className="text-success text-sm">+12.5% за месяц</div>
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <Button className="w-full" size="sm">
                        <Icon name="ArrowDownLeft" size={16} className="mr-2" />
                        Получить
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Icon name="ArrowUpRight" size={16} className="mr-2" />
                        Отправить
                      </Button>
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
              <Card key={index} className="p-6 hover-scale cursor-pointer transition-all hover:border-primary/50">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon name={feature.icon as any} className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <Card className="p-12 text-center bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Создайте свой безопасный кошелек прямо сейчас. Это займет меньше минуты.
            </p>
            <Button onClick={() => navigate('/app')} size="lg" className="text-lg px-12">
              Создать кошелек бесплатно
              <Icon name="Rocket" size={20} className="ml-2" />
            </Button>
          </Card>
        </section>

        <footer className="border-t pt-8 pb-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Icon name="Wallet" className="text-primary" size={18} />
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
