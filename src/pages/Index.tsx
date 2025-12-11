import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { useToast } from '@/hooks/use-toast';

const initialAssets = [
  { name: 'Bitcoin', symbol: 'BTC', balance: 0, price: 43250.00, icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Ethereum', symbol: 'ETH', balance: 0, price: 2280.50, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'Binance Coin', symbol: 'BNB', balance: 0, price: 312.75, icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  
  { name: 'Tether (Ethereum)', symbol: 'USDT', balance: 100.00, price: 1.00, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'ETH' },
  { name: 'Tether (Tron)', symbol: 'USDT', balance: 50.00, price: 1.00, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'TRX' },
  { name: 'Tether (BSC)', symbol: 'USDT', balance: 75.00, price: 1.00, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'BSC' },
  { name: 'Tether (Polygon)', symbol: 'USDT', balance: 25.00, price: 1.00, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'MATIC' },
  { name: 'Tether (Arbitrum)', symbol: 'USDT', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png', network: 'ARB' },
  
  { name: 'USD Coin (Ethereum)', symbol: 'USDC', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'ETH' },
  { name: 'USD Coin (BSC)', symbol: 'USDC', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'BSC' },
  { name: 'USD Coin (Polygon)', symbol: 'USDC', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'MATIC' },
  { name: 'USD Coin (Arbitrum)', symbol: 'USDC', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'ARB' },
  { name: 'USD Coin (Optimism)', symbol: 'USDC', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png', network: 'OP' },
  
  { name: 'Binance USD (BSC)', symbol: 'BUSD', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', network: 'BSC' },
  { name: 'Binance USD (Ethereum)', symbol: 'BUSD', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/binance-usd-busd-logo.png', network: 'ETH' },
  
  { name: 'Dai (Ethereum)', symbol: 'DAI', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', network: 'ETH' },
  { name: 'Dai (BSC)', symbol: 'DAI', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', network: 'BSC' },
  { name: 'Dai (Polygon)', symbol: 'DAI', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png', network: 'MATIC' },
  
  { name: 'TrueUSD (Ethereum)', symbol: 'TUSD', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', network: 'ETH' },
  { name: 'TrueUSD (Tron)', symbol: 'TUSD', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/trueusd-tusd-logo.png', network: 'TRX' },
  
  { name: 'Pax Dollar (Ethereum)', symbol: 'USDP', balance: 0, price: 1.00, icon: 'https://assets.coingecko.com/coins/images/6013/small/Pax_Dollar.png', network: 'ETH' },
  
  { name: 'Frax (Ethereum)', symbol: 'FRAX', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/frax-frax-logo.png', network: 'ETH' },
  { name: 'Frax (BSC)', symbol: 'FRAX', balance: 0, price: 1.00, icon: 'https://cryptologos.cc/logos/frax-frax-logo.png', network: 'BSC' },
  
  { name: 'USDD (Tron)', symbol: 'USDD', balance: 0, price: 1.00, icon: 'https://assets.coingecko.com/coins/images/25380/small/USDD.png', network: 'TRX' },
  { name: 'USDD (Ethereum)', symbol: 'USDD', balance: 0, price: 1.00, icon: 'https://assets.coingecko.com/coins/images/25380/small/USDD.png', network: 'ETH' },
];

export default function Index() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [walletCreated, setWalletCreated] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [assets, setAssets] = useState(initialAssets);
  const [setupMode, setSetupMode] = useState<'create' | 'restore'>('create');
  const [userId, setUserId] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [fromToken, setFromToken] = useState('BTC');
  const [toToken, setToToken] = useState('ETH');
  const [swapAmount, setSwapAmount] = useState('');
  const [selectedReceiveAsset, setSelectedReceiveAsset] = useState<typeof initialAssets[0] | null>(null);
  const [showSwapConfirmation, setShowSwapConfirmation] = useState(false);
  const [fromNetwork, setFromNetwork] = useState<string>('');
  const [toNetwork, setToNetwork] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<typeof initialAssets[0] | null>(null);
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');
  const [mainSendAsset, setMainSendAsset] = useState<typeof initialAssets[0] | null>(null);
  const [mainSendAddress, setMainSendAddress] = useState('');
  const [mainSendAmount, setMainSendAmount] = useState('');
  const [showMainSendDialog, setShowMainSendDialog] = useState(false);
  const [transactions, setTransactions] = useState<Array<{
    id: number;
    type: 'receive' | 'send' | 'swap';
    asset: string;
    amount: number;
    date: string;
    status: 'completed' | 'pending';
    hash: string;
  }>>([]);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const assetQrCanvasRef = useRef<HTMLCanvasElement>(null);

  const generateAddressForNetwork = async (userId: string, network: string, symbol: string): Promise<string> => {
    const input = `${userId}-${network}-${symbol}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    if (network === 'TRX') {
      return 'T' + hashHex.substring(0, 33).toUpperCase();
    } else if (network === 'BTC') {
      return '1' + hashHex.substring(0, 33);
    } else {
      return '0x' + hashHex.substring(0, 40);
    }
  };

  const generateTransactionHash = () => {
    const randomBytes = crypto.getRandomValues(new Uint8Array(4));
    const hashHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hashHex}...${hashHex.substring(0, 4)}`;
  };

  const saveBalances = (updatedAssets: typeof initialAssets) => {
    if (userId) {
      const balances: { [key: string]: number } = {};
      updatedAssets.forEach(asset => {
        balances[asset.symbol] = asset.balance;
      });
      localStorage.setItem(`balances_${userId}`, JSON.stringify(balances));
    }
  };

  const addTransaction = (type: 'receive' | 'send' | 'swap', asset: string, amount: number) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newTransaction = {
      id: Date.now(),
      type,
      asset,
      amount,
      date: dateStr,
      status: 'completed' as const,
      hash: generateTransactionHash()
    };

    setTransactions(prev => [newTransaction, ...prev]);
  };

  const [currentReceiveAddress, setCurrentReceiveAddress] = useState<string>('');

  useEffect(() => {
    const hasWallet = localStorage.getItem('walletCreated');
    const mode = searchParams.get('mode');
    const storedUserId = localStorage.getItem('userId');
    
    if (!hasWallet) {
      setShowSetup(true);
      if (mode === 'restore') {
        setSetupMode('restore');
      }
    } else {
      setWalletCreated(true);
      if (storedUserId) {
        setUserId(storedUserId);
        
        const balancesKey = `balances_${storedUserId}`;
        const savedBalances = localStorage.getItem(balancesKey);
        if (savedBalances) {
          const balances = JSON.parse(savedBalances);
          setAssets(prevAssets => prevAssets.map(asset => ({
            ...asset,
            balance: balances[asset.symbol] || asset.balance
          })));
        }
      }
    }

    if (!mainSendAsset && assets.length > 0) {
      setMainSendAsset(assets[0]);
    }
  }, [searchParams, mainSendAsset, assets.length]);

  const handleWalletComplete = (userId: string) => {
    localStorage.setItem('walletCreated', 'true');
    setWalletCreated(true);
    setShowSetup(false);
    setUserId(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem('walletCreated');
    localStorage.removeItem('walletSeed');
    localStorage.removeItem('userId');
    navigate('/');
  };

  useEffect(() => {
    const generateAddress = async () => {
      const asset = selectedReceiveAsset || selectedAsset;
      if (asset && userId) {
        const network = asset.network || asset.symbol;
        const address = await generateAddressForNetwork(userId, network, asset.symbol);
        setCurrentReceiveAddress(address);
      }
    };
    generateAddress();
  }, [selectedReceiveAsset, selectedAsset, userId]);

  useEffect(() => {
    if (qrCanvasRef.current && currentReceiveAddress && selectedReceiveAsset) {
      QRCode.toCanvas(qrCanvasRef.current, currentReceiveAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#1a1f2c'
        }
      });
    }
  }, [currentReceiveAddress, selectedReceiveAsset]);

  useEffect(() => {
    if (assetQrCanvasRef.current && currentReceiveAddress && selectedAsset && showAssetDialog) {
      QRCode.toCanvas(assetQrCanvasRef.current, currentReceiveAddress, {
        width: 200,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#1a1f2c'
        }
      });
    }
  }, [currentReceiveAddress, selectedAsset, showAssetDialog]);

  const totalBalance = assets.reduce((sum, asset) => sum + (asset.balance * asset.price), 0);

  const getAssetsBySymbol = (symbol: string) => {
    return assets.filter(a => a.symbol === symbol);
  };

  const getSelectedAsset = (symbol: string, network: string) => {
    if (!network) {
      const assetsBySymbol = getAssetsBySymbol(symbol);
      return assetsBySymbol[0];
    }
    return assets.find(a => a.symbol === symbol && (a.network || a.symbol) === network);
  };

  const calculateSwapOutput = () => {
    if (!swapAmount) return '0.00';
    const fromAsset = getSelectedAsset(fromToken, fromNetwork);
    const toAsset = getSelectedAsset(toToken, toNetwork);
    if (!fromAsset || !toAsset) return '0.00';
    const usdValue = parseFloat(swapAmount) * fromAsset.price;
    return (usdValue / toAsset.price * 0.997).toFixed(4);
  };

  const handleSwapConfirm = () => {
    const fromAsset = getSelectedAsset(fromToken, fromNetwork);
    const toAsset = getSelectedAsset(toToken, toNetwork);
    const swapAmountNum = parseFloat(swapAmount);
    const outputAmount = parseFloat(calculateSwapOutput());

    if (fromAsset && toAsset && swapAmountNum > 0) {
      setAssets(prevAssets => {
        const updatedAssets = prevAssets.map(asset => {
          if (asset.symbol === fromAsset.symbol && (asset.network || asset.symbol) === (fromAsset.network || fromAsset.symbol)) {
            return { ...asset, balance: asset.balance - swapAmountNum };
          }
          if (asset.symbol === toAsset.symbol && (asset.network || asset.symbol) === (toAsset.network || toAsset.symbol)) {
            return { ...asset, balance: asset.balance + outputAmount };
          }
          return asset;
        });
        saveBalances(updatedAssets);
        return updatedAssets;
      });

      addTransaction('swap', `${fromToken}→${toToken}`, swapAmountNum);
    }

    setShowSwapConfirmation(false);
    toast({
      title: "Обмен выполнен!",
      description: `Обменяно ${swapAmount} ${fromToken} на ${calculateSwapOutput()} ${toToken}`,
    });
    setSwapAmount('');
  };

  const handleSendConfirm = () => {
    const amount = parseFloat(sendAmount);
    if (selectedAsset && amount > 0 && sendAddress) {
      setAssets(prevAssets => {
        const updatedAssets = prevAssets.map(asset => {
          if (asset.symbol === selectedAsset.symbol && (asset.network || asset.symbol) === (selectedAsset.network || selectedAsset.symbol)) {
            return { ...asset, balance: asset.balance - amount };
          }
          return asset;
        });
        saveBalances(updatedAssets);
        return updatedAssets;
      });

      addTransaction('send', selectedAsset.symbol, amount);

      toast({
        title: "Отправка выполнена!",
        description: `Отправлено ${amount} ${selectedAsset.symbol} на адрес ${sendAddress.substring(0, 10)}...`,
      });

      setSendAmount('');
      setSendAddress('');
      setShowAssetDialog(false);
      setSelectedAsset(null);
    }
  };

  const handleMainSendConfirm = () => {
    const amount = parseFloat(mainSendAmount);
    
    if (mainSendAsset && amount > 0 && mainSendAddress && amount <= mainSendAsset.balance) {
      setAssets(prevAssets => {
        const updatedAssets = prevAssets.map(a => {
          if (a.symbol === mainSendAsset.symbol && (a.network || a.symbol) === (mainSendAsset.network || mainSendAsset.symbol)) {
            return { ...a, balance: a.balance - amount };
          }
          return a;
        });
        saveBalances(updatedAssets);
        return updatedAssets;
      });

      addTransaction('send', mainSendAsset.symbol, amount);

      toast({
        title: "Отправка выполнена!",
        description: `Отправлено ${amount} ${mainSendAsset.symbol} на адрес ${mainSendAddress.substring(0, 10)}...`,
      });

      setMainSendAmount('');
      setMainSendAddress('');
      setShowMainSendDialog(false);
    }
  };

  return (
    <>
      {!walletCreated && <WalletSetup open={showSetup} onComplete={handleWalletComplete} initialMode={setupMode} />}
      {!walletCreated ? null : (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon name="Wallet" className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DEXXX Wallet</h1>
              <p className="text-xs text-muted-foreground font-mono">ID: {userId}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="hover-scale text-destructive hover:text-destructive"
            onClick={handleLogout}
          >
            <Icon name="LogOut" size={20} />
          </Button>
        </header>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <Card className="p-6 hover-scale bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
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
              <Dialog open={showMainSendDialog} onOpenChange={setShowMainSendDialog}>
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
                      <Select 
                        value={mainSendAsset ? `${mainSendAsset.symbol}-${mainSendAsset.network || 'native'}` : undefined}
                        onValueChange={(value) => {
                          const asset = assets.find(a => `${a.symbol}-${a.network || 'native'}` === value);
                          if (asset) setMainSendAsset(asset);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите криптовалюту" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {assets.map((asset, index) => {
                            const getNetworkIcon = (network: string) => {
                              const icons: { [key: string]: string } = {
                                'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                                'BSC': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                                'TRX': 'https://cryptologos.cc/logos/tron-trx-logo.png',
                                'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                                'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
                                'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
                              };
                              return icons[network] || '';
                            };

                            return (
                              <SelectItem key={`${asset.symbol}-${asset.network || 'native'}-${index}`} value={`${asset.symbol}-${asset.network || 'native'}`}>
                                <div className="flex items-center gap-2">
                                  <div className="relative">
                                    <img src={asset.icon} alt={asset.symbol} className="w-5 h-5 object-contain" />
                                    {asset.network && (
                                      <img 
                                        src={getNetworkIcon(asset.network)} 
                                        alt={asset.network}
                                        className="w-3 h-3 object-contain absolute -bottom-0.5 -right-0.5 rounded-full bg-background border border-card"
                                      />
                                    )}
                                  </div>
                                  <span>{asset.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Адрес получателя</Label>
                      <Input 
                        placeholder="0x..." 
                        value={mainSendAddress}
                        onChange={(e) => setMainSendAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Сумма</Label>
                      <Input 
                        type="number" 
                        placeholder="0.00"
                        value={mainSendAmount}
                        onChange={(e) => setMainSendAmount(e.target.value)}
                      />
                      {mainSendAsset && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Доступно: {mainSendAsset.balance} {mainSendAsset.symbol}
                        </p>
                      )}
                    </div>
                    <Button 
                      className="w-full gap-2"
                      onClick={handleMainSendConfirm}
                      disabled={!mainSendAsset || !mainSendAddress || !mainSendAmount || parseFloat(mainSendAmount) <= 0 || parseFloat(mainSendAmount) > (mainSendAsset?.balance || 0)}
                    >
                      <Icon name="Send" size={18} />
                      Отправить
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <Dialog onOpenChange={(open) => { if (!open) setSelectedReceiveAsset(null); }}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Icon name="Download" size={18} />
                    Получить
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {selectedReceiveAsset ? `Получить ${selectedReceiveAsset.name}` : 'Выберите актив'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  {!selectedReceiveAsset ? (
                    <div className="space-y-2 mt-4">
                      {assets.map((asset, index) => {
                        const getNetworkIcon = (network: string) => {
                          const icons: { [key: string]: string } = {
                            'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                            'BSC': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                            'BNB': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                            'TRX': 'https://cryptologos.cc/logos/tron-trx-logo.png',
                            'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                            'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                            'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
                            'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
                          };
                          return icons[network] || '';
                        };
                        
                        return (
                          <Button
                            key={`${asset.symbol}-${asset.network || 'native'}-${index}`}
                            variant="outline"
                            className="w-full justify-start h-auto py-3 px-4 hover:bg-muted"
                            onClick={() => setSelectedReceiveAsset(asset)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="relative w-10 h-10 rounded-full bg-background/50 flex items-center justify-center flex-shrink-0">
                                <img src={asset.icon} alt={asset.name} className="w-7 h-7 object-contain" />
                                {asset.network && (
                                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-background border-2 border-card flex items-center justify-center overflow-hidden shadow-md">
                                    <img 
                                      src={getNetworkIcon(asset.network)} 
                                      alt={asset.network} 
                                      className="w-4 h-4 object-contain"
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="text-left flex-1">
                                <div className="font-semibold">{asset.name}</div>
                                <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                              </div>
                              <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-center items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="relative w-12 h-12 rounded-full bg-background/50 flex items-center justify-center">
                          <img src={selectedReceiveAsset.icon} alt={selectedReceiveAsset.name} className="w-8 h-8 object-contain" />
                          {selectedReceiveAsset.network && (() => {
                            const getNetworkIcon = (network: string) => {
                              const icons: { [key: string]: string } = {
                                'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                                'BSC': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                                'BNB': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                                'TRX': 'https://cryptologos.cc/logos/tron-trx-logo.png',
                                'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                                'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                                'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
                                'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
                              };
                              return icons[network] || '';
                            };
                            return (
                              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-background border-2 border-card flex items-center justify-center overflow-hidden shadow-md">
                                <img 
                                  src={getNetworkIcon(selectedReceiveAsset.network)} 
                                  alt={selectedReceiveAsset.network} 
                                  className="w-5 h-5 object-contain"
                                />
                              </div>
                            );
                          })()}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold">{selectedReceiveAsset.name}</div>
                          <div className="text-sm text-muted-foreground">{selectedReceiveAsset.symbol}</div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <canvas ref={qrCanvasRef} className="rounded-lg" />
                      </div>
                      
                      <div>
                        <Label>Ваш адрес</Label>
                        <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                          {currentReceiveAddress || 'Генерация адреса...'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2"
                          onClick={() => setSelectedReceiveAsset(null)}
                        >
                          <Icon name="ArrowLeft" size={16} />
                          Назад
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 gap-2"
                          onClick={() => navigator.clipboard.writeText(currentReceiveAddress)}
                          disabled={!currentReceiveAddress}
                        >
                          <Icon name="Copy" size={16} />
                          Копировать
                        </Button>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              
              <Button variant="outline" className="flex-1 gap-2">
                <Icon name="QrCode" size={18} />
                Сканировать
              </Button>
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
              {[...assets].sort((a, b) => (b.balance * b.price) - (a.balance * a.price)).map((asset, index) => {
                const getNetworkIcon = (network: string) => {
                  const icons: { [key: string]: string } = {
                    'ETH': 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
                    'BSC': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                    'BNB': 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
                    'TRX': 'https://cryptologos.cc/logos/tron-trx-logo.png',
                    'BTC': 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
                    'MATIC': 'https://cryptologos.cc/logos/polygon-matic-logo.png',
                    'ARB': 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
                    'OP': 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
                  };
                  return icons[network] || '';
                };
                
                return (
                  <Card 
                    key={`${asset.symbol}-${asset.network}-${index}`} 
                    className="p-5 hover-scale cursor-pointer transition-all hover:border-primary/50"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowAssetDialog(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full bg-background/50 flex items-center justify-center">
                          <img src={asset.icon} alt={asset.name} className="w-8 h-8 object-contain" />
                          {asset.network && (
                            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-background border-2 border-card flex items-center justify-center overflow-hidden shadow-md">
                              <img 
                                src={getNetworkIcon(asset.network)} 
                                alt={asset.network} 
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold">{asset.name}</h4>
                          <p className="text-sm text-muted-foreground">{asset.symbol}</p>
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
                );
              })}
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
                    <div className="flex flex-col gap-1">
                      <Select value={fromToken} onValueChange={(val) => { setFromToken(val); setFromNetwork(''); }}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(assets.map(a => a.symbol))).map(symbol => (
                            <SelectItem key={symbol} value={symbol}>
                              <div className="flex items-center gap-2">
                                <img src={assets.find(a => a.symbol === symbol)!.icon} alt={symbol} className="w-4 h-4 object-contain" />
                                {symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getAssetsBySymbol(fromToken).length > 1 && (
                        <Select value={fromNetwork} onValueChange={setFromNetwork}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Сеть" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAssetsBySymbol(fromToken).map((asset, idx) => (
                              <SelectItem key={idx} value={asset.network || asset.symbol}>
                                {asset.network || 'Native'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Доступно: {getSelectedAsset(fromToken, fromNetwork)?.balance || 0} {fromToken}
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
                    <div className="flex flex-col gap-1">
                      <Select value={toToken} onValueChange={(val) => { setToToken(val); setToNetwork(''); }}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(assets.map(a => a.symbol))).map(symbol => (
                            <SelectItem key={symbol} value={symbol}>
                              <div className="flex items-center gap-2">
                                <img src={assets.find(a => a.symbol === symbol)!.icon} alt={symbol} className="w-4 h-4 object-contain" />
                                {symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getAssetsBySymbol(toToken).length > 1 && (
                        <Select value={toNetwork} onValueChange={setToNetwork}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue placeholder="Сеть" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAssetsBySymbol(toToken).map((asset, idx) => (
                              <SelectItem key={idx} value={asset.network || asset.symbol}>
                                {asset.network || 'Native'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
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
                    <span>1 {fromToken} ≈ {(() => {
                      const fromAsset = getSelectedAsset(fromToken, fromNetwork);
                      const toAsset = getSelectedAsset(toToken, toNetwork);
                      if (!fromAsset || !toAsset) return '0.00';
                      return (fromAsset.price / toAsset.price).toFixed(6);
                    })()} {toToken}</span>
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

                <Button 
                  className="w-full" 
                  size="lg" 
                  disabled={!swapAmount || parseFloat(swapAmount) <= 0 || parseFloat(swapAmount) > (getSelectedAsset(fromToken, fromNetwork)?.balance || 0)}
                  onClick={() => setShowSwapConfirmation(true)}
                >
                  Обменять
                </Button>
              </div>
            </Card>
          </TabsContent>

          <Dialog open={showSwapConfirmation} onOpenChange={setShowSwapConfirmation}>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Подтверждение обмена</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Вы отдаете</span>
                    <div className="flex items-center gap-2">
                      <img src={getSelectedAsset(fromToken, fromNetwork)?.icon} alt={fromToken} className="w-5 h-5 object-contain" />
                      <span className="font-semibold">{swapAmount} {fromToken}</span>
                    </div>
                  </div>
                  {fromNetwork && getAssetsBySymbol(fromToken).length > 1 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Сеть</span>
                      <span>{fromNetwork}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-center">
                    <Icon name="ArrowDown" className="text-primary" size={24} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Вы получите</span>
                    <div className="flex items-center gap-2">
                      <img src={getSelectedAsset(toToken, toNetwork)?.icon} alt={toToken} className="w-5 h-5 object-contain" />
                      <span className="font-semibold">{calculateSwapOutput()} {toToken}</span>
                    </div>
                  </div>
                  {toNetwork && getAssetsBySymbol(toToken).length > 1 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Сеть</span>
                      <span>{toNetwork}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Курс обмена</span>
                    <span className="font-mono">1 {fromToken} = {(() => {
                      const fromAsset = getSelectedAsset(fromToken, fromNetwork);
                      const toAsset = getSelectedAsset(toToken, toNetwork);
                      if (!fromAsset || !toAsset) return '0.00';
                      return (fromAsset.price / toAsset.price).toFixed(6);
                    })()} {toToken}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Комиссия</span>
                    <span>~$2.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Проскальзывание</span>
                    <span className="text-success">0.3%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border">
                    <span className="text-muted-foreground font-semibold">Итоговая сумма</span>
                    <span className="font-semibold">${(() => {
                      const toAsset = getSelectedAsset(toToken, toNetwork);
                      if (!toAsset) return '0.00';
                      return (parseFloat(calculateSwapOutput()) * toAsset.price).toFixed(2);
                    })()}</span>
                  </div>
                </div>

                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex items-start gap-2">
                    <Icon name="AlertTriangle" className="text-yellow-500 mt-0.5" size={18} />
                    <p className="text-xs text-muted-foreground">
                      Обмен будет выполнен по текущему рыночному курсу. Итоговая сумма может немного отличаться из-за волатильности рынка.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowSwapConfirmation(false)}
                  >
                    Отмена
                  </Button>
                  <Button 
                    className="flex-1 gap-2"
                    onClick={handleSwapConfirm}
                  >
                    <Icon name="Check" size={18} />
                    Подтвердить обмен
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <TabsContent value="history" className="space-y-4">
            {transactions.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <Icon name="History" size={32} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">История транзакций пуста</h3>
                    <p className="text-muted-foreground text-sm">
                      Здесь будут отображаться ваши отправки, получения и обмены
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              transactions.map((tx) => (
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
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedAsset && (
                <>
                  <img src={selectedAsset.icon} alt={selectedAsset.name} className="w-8 h-8 object-contain" />
                  {selectedAsset.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-6 mt-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Баланс</p>
                <p className="text-2xl font-bold">{selectedAsset.balance} {selectedAsset.symbol}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  ≈ ${(selectedAsset.balance * selectedAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <Tabs defaultValue="send" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="send">Отправить</TabsTrigger>
                  <TabsTrigger value="receive">Получить</TabsTrigger>
                </TabsList>

                <TabsContent value="send" className="space-y-4 mt-4">
                  <div>
                    <Label>Адрес получателя</Label>
                    <Input 
                      placeholder="0x..." 
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Сумма</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Доступно: {selectedAsset.balance} {selectedAsset.symbol}
                    </p>
                  </div>
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleSendConfirm}
                    disabled={!sendAddress || !sendAmount || parseFloat(sendAmount) <= 0 || parseFloat(sendAmount) > selectedAsset.balance}
                  >
                    <Icon name="Send" size={18} />
                    Отправить
                  </Button>
                </TabsContent>

                <TabsContent value="receive" className="space-y-4 mt-4">
                  <div className="flex justify-center">
                    <canvas ref={assetQrCanvasRef} className="rounded-lg" />
                  </div>
                  <div>
                    <Label>Ваш адрес</Label>
                    <div className="mt-2 p-3 bg-muted rounded-lg font-mono text-sm break-all">
                      {currentReceiveAddress || 'Генерация адреса...'}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      if (currentReceiveAddress) {
                        navigator.clipboard.writeText(currentReceiveAddress);
                        toast({
                          title: "Скопировано!",
                          description: "Адрес скопирован в буфер обмена",
                        });
                      }
                    }}
                    disabled={!currentReceiveAddress}
                  >
                    <Icon name="Copy" size={16} />
                    Копировать адрес
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
      )}
    </>
  );
}