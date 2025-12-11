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
import CryptoIcon from '@/components/CryptoIcon';
import NetworkBadge from '@/components/NetworkBadge';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';



const initialAssets = [
  { name: 'Bitcoin', symbol: 'BTC', balance: 0, price: 43250.00, network: null },
  { name: 'Ethereum', symbol: 'ETH', balance: 0, price: 2280.50, network: null },
  { name: 'Binance Coin', symbol: 'BNB', balance: 0, price: 312.75, network: null },
  
  { name: 'Tether (Ethereum)', symbol: 'USDT', balance: 0, price: 1.00, network: 'ETH' },
  { name: 'Tether (Tron)', symbol: 'USDT', balance: 0, price: 1.00, network: 'TRX' },
  { name: 'Tether (BSC)', symbol: 'USDT', balance: 0, price: 1.00, network: 'BSC' },
  { name: 'Tether (Polygon)', symbol: 'USDT', balance: 0, price: 1.00, network: 'MATIC' },
  { name: 'Tether (Arbitrum)', symbol: 'USDT', balance: 0, price: 1.00, network: 'ARB' },
  
  { name: 'USD Coin (Ethereum)', symbol: 'USDC', balance: 0, price: 1.00, network: 'ETH' },
  { name: 'USD Coin (BSC)', symbol: 'USDC', balance: 0, price: 1.00, network: 'BSC' },
  { name: 'USD Coin (Polygon)', symbol: 'USDC', balance: 0, price: 1.00, network: 'MATIC' },
  { name: 'USD Coin (Arbitrum)', symbol: 'USDC', balance: 0, price: 1.00, network: 'ARB' },
  { name: 'USD Coin (Optimism)', symbol: 'USDC', balance: 0, price: 1.00, network: 'OP' },
  
  { name: 'Binance USD (BSC)', symbol: 'BUSD', balance: 0, price: 1.00, network: 'BSC' },
  { name: 'Binance USD (Ethereum)', symbol: 'BUSD', balance: 0, price: 1.00, network: 'ETH' },
  
  { name: 'Dai (Ethereum)', symbol: 'DAI', balance: 0, price: 1.00, network: 'ETH' },
  { name: 'Dai (BSC)', symbol: 'DAI', balance: 0, price: 1.00, network: 'BSC' },
  { name: 'Dai (Polygon)', symbol: 'DAI', balance: 0, price: 1.00, network: 'MATIC' },
  
  { name: 'TrueUSD (Ethereum)', symbol: 'TUSD', balance: 0, price: 1.00, network: 'ETH' },
  { name: 'TrueUSD (Tron)', symbol: 'TUSD', balance: 0, price: 1.00, network: 'TRX' },
  
  { name: 'Pax Dollar (Ethereum)', symbol: 'USDP', balance: 0, price: 1.00, network: 'ETH' },
  
  { name: 'Frax (Ethereum)', symbol: 'FRAX', balance: 0, price: 1.00, network: 'ETH' },
  { name: 'Frax (BSC)', symbol: 'FRAX', balance: 0, price: 1.00, network: 'BSC' },
  
  { name: 'USDD (Tron)', symbol: 'USDD', balance: 0, price: 1.00, network: 'TRX' },
  { name: 'USDD (Ethereum)', symbol: 'USDD', balance: 0, price: 1.00, network: 'ETH' },
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
  const [animatingAsset, setAnimatingAsset] = useState<string | null>(null);
  const [previousBalances, setPreviousBalances] = useState<Record<string, number>>({});
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);

  const generateAddressForNetwork = async (userId: string, network: string, symbol: string): Promise<string> => {
    // Bitcoin - фиксированный адрес
    if (symbol === 'BTC') {
      return 'bc1qvxgf2afh2rrsdyvtk7dt3nmk6dfy4qt0fe3v7t';
    }
    
    // TRON и все токены на TRON (USDT TRC20, TUSD TRC20, USDD TRC20)
    if (network === 'TRX') {
      return 'TJutXHkM9kr7bRWw6ZDQEB9qBGDnXT8dSp';
    }
    
    // Ethereum и все EVM-совместимые сети (ETH, BSC, Polygon, Arbitrum, Optimism)
    // Сюда входят: ETH, BNB, USDT (на ETH/BSC/Polygon/Arbitrum), USDC, BUSD, DAI, и т.д.
    if (symbol === 'ETH' || network === 'ETH' || network === 'BSC' || network === 'MATIC' || network === 'ARB' || network === 'OP') {
      return '0xE4f2a92BCFC75C7618B4E3f58E777f1cF6C9F855';
    }
    
    // BNB (native) также использует EVM адрес
    if (symbol === 'BNB') {
      return '0xE4f2a92BCFC75C7618B4E3f58E777f1cF6C9F855';
    }
    
    // Для остальных генерируем уникальный адрес (fallback)
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

  const saveBalances = async (updatedAssets: typeof initialAssets) => {
    if (userId) {
      for (const asset of updatedAssets) {
        try {
          await api.balances.update(
            userId,
            asset.symbol,
            asset.network || null,
            asset.balance
          );
        } catch (error) {
          console.error('Failed to save balance:', error);
        }
      }
    }
  };

  const addTransaction = async (type: 'receive' | 'send' | 'swap', asset: string, amount: number) => {
    const txHash = generateTransactionHash();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newTransaction = {
      id: Date.now(),
      type,
      asset,
      amount,
      date: dateStr,
      status: 'completed' as const,
      hash: txHash
    };

    setTransactions(prev => [newTransaction, ...prev]);
    
    if (userId) {
      try {
        await api.transactions.create(userId, type, asset, amount, txHash);
      } catch (error) {
        console.error('Failed to save transaction:', error);
      }
    }
  };

  const [currentReceiveAddress, setCurrentReceiveAddress] = useState<string>('');

  const loadUserData = async (userId: string, skipAnimation = false) => {
    try {
      const [balances, prices] = await Promise.all([
        api.balances.get(userId),
        api.cryptoPrices.get().catch((error) => {
          console.error('Failed to load crypto prices:', error);
          return {};
        })
      ]);
      
      console.log('Loaded prices:', prices);
      
      setAssets(prevAssets => prevAssets.map(asset => {
        const key = `${asset.symbol}-${asset.network || 'native'}`;
        const newBalance = balances[key] !== undefined ? balances[key] : asset.balance;
        const oldBalance = previousBalances[key] || asset.balance;
        
        if (!skipAnimation && newBalance > oldBalance) {
          setAnimatingAsset(key);
          setTimeout(() => setAnimatingAsset(null), 2000);
          
          toast({
            title: "Баланс пополнен! 💰",
            description: `+${(newBalance - oldBalance).toFixed(8)} ${asset.symbol}`,
          });
        }
        
        return {
          ...asset,
          balance: newBalance,
          price: prices[asset.symbol] !== undefined ? prices[asset.symbol] : asset.price
        };
      }));
      
      setPreviousBalances(balances);
      
      const txList = await api.transactions.get(userId);
      const formattedTransactions = txList.map(tx => ({
        id: tx.id,
        type: tx.tx_type as 'receive' | 'send' | 'swap',
        asset: tx.asset,
        amount: tx.amount,
        date: new Date(tx.tx_date).toLocaleString('ru-RU', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }).replace(',', ''),
        status: tx.status as 'completed' | 'pending',
        hash: tx.tx_hash
      }));
      setTransactions(formattedTransactions);
      
      await api.users.updateLogin(userId);
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  useEffect(() => {
    const hasWallet = localStorage.getItem('walletCreated');
    const mode = searchParams.get('mode');
    const storedUserId = localStorage.getItem('userId');
    const storedSeed = localStorage.getItem('walletSeed');
    
    if (!hasWallet || !storedUserId || !storedSeed) {
      if (mode === 'create' || mode === 'restore') {
        setShowSetup(true);
        if (mode === 'restore') {
          setSetupMode('restore');
        }
      } else {
        navigate('/');
      }
    } else {
      setWalletCreated(true);
      setUserId(storedUserId);
      loadUserData(storedUserId, true);
    }

    if (!mainSendAsset && assets.length > 0) {
      setMainSendAsset(assets[0]);
    }
  }, [searchParams, mainSendAsset, assets.length]);

  useEffect(() => {
    const updatePrices = async () => {
      try {
        const prices = await api.cryptoPrices.get();
        console.log('Updating prices:', prices);
        setAssets(prevAssets => prevAssets.map(asset => ({
          ...asset,
          price: prices[asset.symbol] !== undefined ? prices[asset.symbol] : asset.price
        })));
        setLastPriceUpdate(new Date());
      } catch (error) {
        console.error('Failed to update prices:', error);
      }
    };

    if (walletCreated) {
      updatePrices();
      const priceInterval = setInterval(updatePrices, 30000);
      return () => clearInterval(priceInterval);
    }
  }, [walletCreated]);

  useEffect(() => {
    const handleBalanceUpdate = () => {
      const storedUserId = localStorage.getItem('userId');
      if (storedUserId) {
        loadUserData(storedUserId);
      }
    };

    window.addEventListener('balanceUpdate', handleBalanceUpdate);
    return () => window.removeEventListener('balanceUpdate', handleBalanceUpdate);
  }, []);

  useEffect(() => {
    if (!walletCreated || !userId) return;

    const updatePrices = async () => {
      try {
        const prices = await api.cryptoPrices.get();
        setAssets(prevAssets => prevAssets.map(asset => ({
          ...asset,
          price: prices[asset.symbol] !== undefined ? prices[asset.symbol] : asset.price
        })));
      } catch (error) {
        console.error('Failed to update prices:', error);
      }
    };

    const priceInterval = setInterval(updatePrices, 30000);
    const balanceInterval = setInterval(() => {
      if (userId) {
        loadUserData(userId);
      }
    }, 5000);
    
    return () => {
      clearInterval(priceInterval);
      clearInterval(balanceInterval);
    };
  }, [walletCreated, userId]);

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
      return assets.find(a => a.symbol === symbol && a.network === null);
    }
    return assets.find(a => a.symbol === symbol && a.network === network);
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
          if (asset.symbol === fromAsset.symbol && asset.network === fromAsset.network) {
            return { ...asset, balance: asset.balance - swapAmountNum };
          }
          if (asset.symbol === toAsset.symbol && asset.network === toAsset.network) {
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
          if (asset.symbol === selectedAsset.symbol && asset.network === selectedAsset.network) {
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
          if (a.symbol === mainSendAsset.symbol && a.network === mainSendAsset.network) {
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
    <div className="min-h-screen bg-background p-3 sm:p-4 md:p-6 pb-safe">
      <div className="max-w-7xl mx-auto">
        <header className="mb-4 sm:mb-6 md:mb-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-xl z-50 py-3 sm:py-4 -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6 border-b border-border/40">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Icon name="Wallet" className="text-primary" size={18} />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl font-bold">DEXXX Wallet</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-mono truncate">ID: {userId}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {userId === 'ae25420cd4106d43' && (
              <Button 
                variant="outline" 
                size="icon" 
                className="hover-scale h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => navigate('/admin')}
                title="Админ-панель"
              >
                <Icon name="Shield" size={16} className="sm:w-5 sm:h-5" />
              </Button>
            )}
            <Button 
              variant="outline" 
              size="icon" 
              className="hover-scale text-destructive hover:text-destructive h-8 w-8 sm:h-10 sm:w-10"
              onClick={handleLogout}
            >
              <Icon name="LogOut" size={16} className="sm:w-5 sm:h-5" />
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 md:gap-6 mb-5 md:mb-6">
          <Card className="p-5 md:p-6 transition-all duration-300 hover:shadow-2xl bg-gradient-to-br from-primary/15 to-secondary/10 border-primary/30 shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm md:text-sm text-muted-foreground font-medium">Общий баланс</p>
                  {lastPriceUpdate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Icon name="RefreshCw" size={10} className="text-success" />
                      <span>{lastPriceUpdate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  )}
                </div>
                <h2 className={`text-3xl md:text-4xl font-bold truncate tracking-tight transition-all duration-500 ${
                  animatingAsset ? 'text-success scale-105' : ''
                }`}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              </div>
              <div className="px-3 py-1.5 rounded-full bg-success/20 text-success text-sm font-semibold flex items-center gap-1.5 flex-shrink-0 shadow-md">
                <Icon name="TrendingUp" size={16} />
                <span>+12%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <Dialog open={showMainSendDialog} onOpenChange={setShowMainSendDialog}>
                <DialogTrigger asChild>
                  <Button className="flex-1 gap-2.5 h-14 md:h-12 text-base font-semibold touch-manipulation rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all">
                    <Icon name="Send" size={20} />
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
                  <Button variant="outline" className="flex-1 gap-2.5 h-14 md:h-12 text-base font-semibold touch-manipulation rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all border-2">
                    <Icon name="Download" size={20} />
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
                      {assets.map((asset, index) => (
                        <Button
                          key={`${asset.symbol}-${asset.network || 'native'}-${index}`}
                          variant="outline"
                          className="w-full justify-start h-auto py-3 px-4 hover:bg-muted"
                          onClick={() => setSelectedReceiveAsset(asset)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="relative flex-shrink-0">
                              <CryptoIcon symbol={asset.symbol} size={40} />
                              {asset.network && (
                                <div className="absolute -bottom-1 -right-1">
                                  <NetworkBadge network={asset.network} size="sm" />
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
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4 mt-4">
                      <div className="flex justify-center items-center gap-3 p-4 bg-muted/50 rounded-lg">
                        <div className="relative">
                          <CryptoIcon symbol={selectedReceiveAsset.symbol} size={48} />
                          {selectedReceiveAsset.network && (
                            <div className="absolute -bottom-1 -right-1">
                              <NetworkBadge network={selectedReceiveAsset.network} size="md" />
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
              
              <Button variant="outline" className="flex-1 gap-2.5 h-14 md:h-12 text-base font-semibold touch-manipulation rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all border-2">
                <Icon name="QrCode" size={20} />
                Сканировать
              </Button>
            </div>
          </Card>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-5 md:space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md h-14 md:h-12 rounded-2xl shadow-md">
            <TabsTrigger value="portfolio" className="text-base font-medium rounded-xl">Портфель</TabsTrigger>
            <TabsTrigger value="swap" className="text-base font-medium rounded-xl">Обмен</TabsTrigger>
            <TabsTrigger value="history" className="text-base font-medium rounded-xl">История</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-3">
            <div className="grid gap-3">
              {[...assets].sort((a, b) => (b.balance * b.price) - (a.balance * a.price)).map((asset, index) => {
                return (
                  <Card 
                    key={`${asset.symbol}-${asset.network}-${index}`} 
                    className="p-5 cursor-pointer transition-all duration-300 hover:border-primary/60 hover:shadow-xl active:scale-[0.97] touch-manipulation rounded-2xl shadow-md"
                    onClick={() => {
                      setSelectedAsset(asset);
                      setShowAssetDialog(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <CryptoIcon symbol={asset.symbol} size={56} />
                          {asset.network && (
                            <div className="absolute -bottom-1.5 -right-1.5">
                              <NetworkBadge network={asset.network} size="md" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-base">{asset.name}</h4>
                          <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold text-base transition-all duration-300 ${
                          animatingAsset === `${asset.symbol}-${asset.network || 'native'}` ? 'text-success scale-110' : ''
                        }`}>{asset.balance} {asset.symbol}</p>
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
            <Card className="p-5 md:p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name="ArrowLeftRight" className="text-primary" size={22} />
                </div>
                Обмен токенов
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Отдаете</Label>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1">
                      <Select value={fromToken} onValueChange={(val) => { 
                        setFromToken(val);
                        const assetOptions = assets.filter(a => a.symbol === val);
                        if (assetOptions.length === 1) {
                          setFromNetwork(assetOptions[0].network || '');
                        } else {
                          setFromNetwork('');
                        }
                      }}>
                        <SelectTrigger className="w-28 md:w-32 h-14 md:h-12 rounded-xl font-semibold text-base">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(assets.map(a => a.symbol))).map(symbol => (
                            <SelectItem key={symbol} value={symbol}>
                              <div className="flex items-center gap-2">
                                <CryptoIcon symbol={symbol} size={20} />
                                {symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getAssetsBySymbol(fromToken).length > 1 && (
                        <Select value={fromNetwork} onValueChange={setFromNetwork}>
                          <SelectTrigger className="w-24 sm:w-32 h-8 text-xs">
                            <SelectValue placeholder="Сеть" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAssetsBySymbol(fromToken).map((asset, idx) => (
                              <SelectItem key={idx} value={asset.network || ''}>
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
                      className="flex-1 h-14 md:h-12 touch-manipulation rounded-xl text-base font-semibold"
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
                  <Label className="text-sm">Получаете</Label>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1">
                      <Select value={toToken} onValueChange={(val) => { 
                        setToToken(val);
                        const assetOptions = assets.filter(a => a.symbol === val);
                        if (assetOptions.length === 1) {
                          setToNetwork(assetOptions[0].network || '');
                        } else {
                          setToNetwork('');
                        }
                      }}>
                        <SelectTrigger className="w-24 sm:w-32 h-11 sm:h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(new Set(assets.map(a => a.symbol))).map(symbol => (
                            <SelectItem key={symbol} value={symbol}>
                              <div className="flex items-center gap-2">
                                <CryptoIcon symbol={symbol} size={20} />
                                {symbol}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {getAssetsBySymbol(toToken).length > 1 && (
                        <Select value={toNetwork} onValueChange={setToNetwork}>
                          <SelectTrigger className="w-24 sm:w-32 h-8 text-xs">
                            <SelectValue placeholder="Сеть" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAssetsBySymbol(toToken).map((asset, idx) => (
                              <SelectItem key={idx} value={asset.network || ''}>
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
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Курс обмена</span>
                    <div className="flex items-center gap-2">
                      <span>1 {fromToken} ≈ {(() => {
                        const fromAsset = getSelectedAsset(fromToken, fromNetwork);
                        const toAsset = getSelectedAsset(toToken, toNetwork);
                        if (!fromAsset || !toAsset) return '0.00';
                        return (fromAsset.price / toAsset.price).toFixed(6);
                      })()} {toToken}</span>
                      {lastPriceUpdate && (
                        <Icon name="RefreshCw" size={12} className="text-success animate-pulse" />
                      )}
                    </div>
                  </div>
                  {lastPriceUpdate && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Обновлено</span>
                      <span className="text-muted-foreground">
                        {lastPriceUpdate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
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
                  className="w-full h-14 md:h-12 text-base font-semibold touch-manipulation rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all" 
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

          <TabsContent value="history" className="space-y-3">
            {transactions.length === 0 ? (
              <Card className="p-12 text-center rounded-2xl shadow-lg">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                    <Icon name="History" size={32} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2">История транзакций пуста</h3>
                    <p className="text-muted-foreground text-sm">
                      Здесь будут отображаться ваши отправки, получения и обмены
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              transactions.map((tx) => (
              <Card key={tx.id} className="p-5 cursor-pointer transition-all duration-300 hover:border-primary/60 hover:shadow-xl active:scale-[0.97] touch-manipulation rounded-2xl shadow-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
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
                        <h4 className="font-semibold capitalize text-base">{
                          tx.type === 'receive' ? 'Получение' : 
                          tx.type === 'send' ? 'Отправка' : 'Обмен'
                        }</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          tx.status === 'completed' ? 'bg-success/20 text-success' : 'bg-yellow-500/20 text-yellow-500'
                        }`}>
                          {tx.status === 'completed' ? 'Завершено' : 'В обработке'}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">{tx.date}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground font-mono mt-1 truncate max-w-[150px] sm:max-w-none">{tx.hash}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm sm:text-base ${tx.type === 'receive' ? 'text-success' : 'text-foreground'}`}>
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