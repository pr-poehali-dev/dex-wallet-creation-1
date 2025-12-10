import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import QRCode from 'qrcode';
import WalletSetup from '@/components/WalletSetup';

const mockAssets = [
  { name: 'Bitcoin', symbol: 'BTC', balance: 0, price: 43250.00, icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Ethereum', symbol: 'ETH', balance: 0, price: 2280.50, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'Tether TRC20', symbol: 'USDT', balance: 100.00, price: 1.00, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'TRC20' },
  { name: 'Binance Coin', symbol: 'BNB', balance: 0, price: 312.75, icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
];

const mockTransactions = [
  { id: 1, type: 'receive', asset: 'BTC', amount: 0.0234, date: '2024-12-10 14:32', status: 'completed', hash: '0x7f3a...9d2c' },
  { id: 2, type: 'send', asset: 'ETH', amount: 0.5, date: '2024-12-10 12:15', status: 'completed', hash: '0x3c1b...4e8f' },
  { id: 3, type: 'swap', asset: 'USDT→BNB', amount: 500, date: '2024-12-09 18:45', status: 'completed', hash: '0x9a2d...7b5c' },
  { id: 4, type: 'receive', asset: 'ETH', amount: 1.2, date: '2024-12-09 10:22', status: 'pending', hash: '0x5e7f...1c9a' },
];

export default function Index() {
  const [walletCreated, setWalletCreated] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [fromToken, setFromToken] = useState('BTC');
  const [toToken, setToToken] = useState('ETH');
  const [swapAmount, setSwapAmount] = useState('');
  const [receiveAddress] = useState('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const hasWallet = localStorage.getItem('walletCreated');
    if (!hasWallet) {
      setShowSetup(true);
    } else {
      setWalletCreated(true);
    }
  }, []);

  const handleWalletComplete = () => {
    localStorage.setItem('walletCreated', 'true');
    setWalletCreated(true);
    setShowSetup(false);
  };

  useEffect(() => {
    if (qrCanvasRef.current && receiveAddress) {
      QRCode.toCanvas(qrCanvasRef.current, receiveAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#1a1f2c'
        }
      });
    }
  }, [receiveAddress]);

  const totalBalance = mockAssets.reduce((sum, asset) => sum + (asset.balance * asset.price), 0);

  const calculateSwapOutput = () => {
    if (!swapAmount) return '0.00';
    const fromAsset = mockAssets.find(a => a.symbol === fromToken);
    const toAsset = mockAssets.find(a => a.symbol === toToken);
    if (!fromAsset || !toAsset) return '0.00';
    const usdValue = parseFloat(swapAmount) * fromAsset.price;
    return (usdValue / toAsset.price * 0.997).toFixed(4);
  };

  return (
    <>
      {!walletCreated && <WalletSetup open={showSetup} onComplete={handleWalletComplete} />}
      {!walletCreated ? null : (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Wallet" className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DEX Wallet</h1>
              <p className="text-sm text-muted-foreground">Безопасный криптокошелек</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="hover-scale">
              <Icon name="Bell" size={20} />
            </Button>
            <Button variant="outline" size="icon" className="hover-scale">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2 p-6 hover-scale bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Общий баланс</p>
                <h2 className="text-4xl font-bold">${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              </div>
              <div className="px-3 py-1 rounded-full bg-success/20 text-success text-sm font-medium flex items-center gap-1">
                <Icon name="TrendingUp" size={16} />
                +12.4%
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1 gap-2">
                    <Icon name="Send" size={18} />
                    Отправить
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Отправить криптовалюту</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label>Актив</Label>
                      <Select defaultValue="BTC">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mockAssets.map(asset => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              <div className="flex items-center gap-2">
                                <img src={asset.icon} alt={asset.symbol} className="w-4 h-4 object-contain" />
                                {asset.symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Адрес получателя</Label>
                      <Input placeholder="0x..." />
                    </div>
                    <div>
                      <Label>Сумма</Label>
                      <Input type="number" placeholder="0.00" />
                    </div>
                    <Button className="w-full">Отправить</Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Icon name="Download" size={18} />
                    Получить
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card">
                  <DialogHeader>
                    <DialogTitle>Получить криптовалюту</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4 text-center">
                    <div className="flex justify-center">
                      <canvas ref={qrCanvasRef} className="rounded-lg" />
                    </div>
                    <div>
                      <Label>Ваш адрес</Label>
                      <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                        {receiveAddress}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full gap-2">
                      <Icon name="Copy" size={16} />
                      Копировать адрес
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="flex-1 gap-2">
                <Icon name="QrCode" size={18} />
                Сканировать
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover-scale">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Icon name="Shield" className="text-primary" size={20} />
                Безопасность
              </h3>
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">2FA защита</span>
                <Icon name="CheckCircle" className="text-success" size={18} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Резервная копия</span>
                <Icon name="CheckCircle" className="text-success" size={18} />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <span className="text-sm">Биометрия</span>
                <Icon name="CheckCircle" className="text-success" size={18} />
              </div>
            </div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="portfolio">Портфель</TabsTrigger>
            <TabsTrigger value="swap">Обмен</TabsTrigger>
            <TabsTrigger value="history">История</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <div className="grid gap-4">
              {mockAssets.map((asset) => (
                <Card key={asset.symbol} className="p-5 hover-scale cursor-pointer transition-all hover:border-primary/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center overflow-hidden">
                        <img src={asset.icon} alt={asset.name} className="w-8 h-8 object-contain" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{asset.name}</h4>
                        <p className="text-sm text-muted-foreground">{asset.symbol}{(asset as any).network ? ` (${(asset as any).network})` : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{asset.balance} {asset.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        ${(asset.balance * asset.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="swap" className="space-y-4">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="ArrowLeftRight" className="text-primary" size={24} />
                Обмен токенов
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Отдаете</Label>
                  <div className="flex gap-2">
                    <Select value={fromToken} onValueChange={setFromToken}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAssets.map(asset => (
                          <SelectItem key={asset.symbol} value={asset.symbol}>
                            <div className="flex items-center gap-2">
                              <img src={asset.icon} alt={asset.symbol} className="w-4 h-4 object-contain" />
                              {asset.symbol}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Доступно: {mockAssets.find(a => a.symbol === fromToken)?.balance} {fromToken}
                  </p>
                </div>

                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full"
                    onClick={() => {
                      const temp = fromToken;
                      setFromToken(toToken);
                      setToToken(temp);
                    }}
                  >
                    <Icon name="ArrowUpDown" size={20} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Получаете</Label>
                  <div className="flex gap-2">
                    <Select value={toToken} onValueChange={setToToken}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {mockAssets.map(asset => (
                          <SelectItem key={asset.symbol} value={asset.symbol}>
                            <div className="flex items-center gap-2">
                              <img src={asset.icon} alt={asset.symbol} className="w-4 h-4 object-contain" />
                              {asset.symbol}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={calculateSwapOutput()}
                      readOnly
                      className="flex-1 bg-muted"
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Курс обмена</span>
                    <span>1 {fromToken} = {(mockAssets.find(a => a.symbol === fromToken)!.price / mockAssets.find(a => a.symbol === toToken)!.price).toFixed(4)} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Комиссия сети</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Проскальзывание</span>
                    <span className="text-success">0.3%</span>
                  </div>
                </div>

                <Button className="w-full" size="lg" disabled={!swapAmount}>
                  Обменять
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            {mockTransactions.map((tx) => (
              <Card key={tx.id} className="p-5 hover-scale cursor-pointer transition-all hover:border-primary/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === 'receive' ? 'bg-success/20' : 
                      tx.type === 'send' ? 'bg-destructive/20' : 'bg-secondary/20'
                    }`}>
                      <Icon 
                        name={tx.type === 'receive' ? 'ArrowDownLeft' : tx.type === 'send' ? 'ArrowUpRight' : 'ArrowLeftRight'} 
                        className={
                          tx.type === 'receive' ? 'text-success' : 
                          tx.type === 'send' ? 'text-destructive' : 'text-secondary'
                        }
                        size={20} 
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold capitalize">{
                          tx.type === 'receive' ? 'Получение' : 
                          tx.type === 'send' ? 'Отправка' : 'Обмен'
                        }</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          tx.status === 'completed' ? 'bg-success/20 text-success' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {tx.status === 'completed' ? 'Завершено' : 'В обработке'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{tx.hash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${tx.type === 'receive' ? 'text-success' : 'text-foreground'}`}>
                      {tx.type === 'receive' ? '+' : tx.type === 'send' ? '-' : ''}{tx.amount} {tx.asset}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
      )}
    </>
  );
}