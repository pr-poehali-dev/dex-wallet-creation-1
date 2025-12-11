import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QRCode from 'qrcode';
import WalletSetup from '@/components/WalletSetup';
import WalletHeader from '@/components/wallet/WalletHeader';
import WalletBalance from '@/components/wallet/WalletBalance';
import PortfolioTab from '@/components/wallet/PortfolioTab';
import SwapTab from '@/components/wallet/SwapTab';
import HistoryTab from '@/components/wallet/HistoryTab';
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
    if (symbol === 'BTC') {
      return 'bc1qvxgf2afh2rrsdyvtk7dt3nmk6dfy4qt0fe3v7t';
    }
    
    if (network === 'TRX') {
      return 'TJutXHkM9kr7bRWw6ZDQEB9qBGDnXT8dSp';
    }
    
    if (symbol === 'ETH' || network === 'ETH' || network === 'BSC' || network === 'MATIC' || network === 'ARB' || network === 'OP') {
      return '0xE4f2a92BCFC75C7618B4E3f58E777f1cF6C9F855';
    }
    
    if (symbol === 'BNB') {
      return '0xE4f2a92BCFC75C7618B4E3f58E777f1cF6C9F855';
    }
    
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
        <WalletHeader userId={userId} onLogout={handleLogout} />

        <WalletBalance
          totalBalance={totalBalance}
          lastPriceUpdate={lastPriceUpdate}
          animatingAsset={animatingAsset}
          assets={assets}
          mainSendAsset={mainSendAsset}
          mainSendAddress={mainSendAddress}
          mainSendAmount={mainSendAmount}
          showMainSendDialog={showMainSendDialog}
          setMainSendAsset={setMainSendAsset}
          setMainSendAddress={setMainSendAddress}
          setMainSendAmount={setMainSendAmount}
          setShowMainSendDialog={setShowMainSendDialog}
          handleMainSendConfirm={handleMainSendConfirm}
          selectedReceiveAsset={selectedReceiveAsset}
          setSelectedReceiveAsset={setSelectedReceiveAsset}
          currentReceiveAddress={currentReceiveAddress}
          qrCanvasRef={qrCanvasRef}
        />

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-5 md:space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md h-14 md:h-12 rounded-2xl shadow-md">
            <TabsTrigger value="portfolio" className="text-base font-medium rounded-xl">Портфель</TabsTrigger>
            <TabsTrigger value="swap" className="text-base font-medium rounded-xl">Обмен</TabsTrigger>
            <TabsTrigger value="history" className="text-base font-medium rounded-xl">История</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-3">
            <PortfolioTab
              assets={assets}
              animatingAsset={animatingAsset}
              selectedAsset={selectedAsset}
              showAssetDialog={showAssetDialog}
              sendAddress={sendAddress}
              sendAmount={sendAmount}
              currentReceiveAddress={currentReceiveAddress}
              assetQrCanvasRef={assetQrCanvasRef}
              setSelectedAsset={setSelectedAsset}
              setShowAssetDialog={setShowAssetDialog}
              setSendAddress={setSendAddress}
              setSendAmount={setSendAmount}
              handleSendConfirm={handleSendConfirm}
            />
          </TabsContent>

          <TabsContent value="swap" className="space-y-4">
            <SwapTab
              assets={assets}
              fromToken={fromToken}
              toToken={toToken}
              swapAmount={swapAmount}
              fromNetwork={fromNetwork}
              toNetwork={toNetwork}
              showSwapConfirmation={showSwapConfirmation}
              lastPriceUpdate={lastPriceUpdate}
              setFromToken={setFromToken}
              setToToken={setToToken}
              setSwapAmount={setSwapAmount}
              setFromNetwork={setFromNetwork}
              setToNetwork={setToNetwork}
              setShowSwapConfirmation={setShowSwapConfirmation}
              getAssetsBySymbol={getAssetsBySymbol}
              getSelectedAsset={getSelectedAsset}
              calculateSwapOutput={calculateSwapOutput}
              handleSwapConfirm={handleSwapConfirm}
            />
          </TabsContent>

          <TabsContent value="history" className="space-y-3">
            <HistoryTab transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
      )}
    </>
  );
}
