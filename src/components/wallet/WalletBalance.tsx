import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import CryptoIcon from '@/components/CryptoIcon';
import NetworkBadge from '@/components/NetworkBadge';
import QRCode from 'qrcode';

type Asset = {
  name: string;
  symbol: string;
  balance: number;
  price: number;
  network: string | null;
};

interface WalletBalanceProps {
  totalBalance: number;
  lastPriceUpdate: Date | null;
  animatingAsset: string | null;
  assets: Asset[];
  mainSendAsset: Asset | null;
  mainSendAddress: string;
  mainSendAmount: string;
  showMainSendDialog: boolean;
  setMainSendAsset: (asset: Asset | null) => void;
  setMainSendAddress: (address: string) => void;
  setMainSendAmount: (amount: string) => void;
  setShowMainSendDialog: (show: boolean) => void;
  handleMainSendConfirm: () => void;
  selectedReceiveAsset: Asset | null;
  setSelectedReceiveAsset: (asset: Asset | null) => void;
  currentReceiveAddress: string;
  qrCanvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function WalletBalance({
  totalBalance,
  lastPriceUpdate,
  animatingAsset,
  assets,
  mainSendAsset,
  mainSendAddress,
  mainSendAmount,
  showMainSendDialog,
  setMainSendAsset,
  setMainSendAddress,
  setMainSendAmount,
  setShowMainSendDialog,
  handleMainSendConfirm,
  selectedReceiveAsset,
  setSelectedReceiveAsset,
  currentReceiveAddress,
  qrCanvasRef,
}: WalletBalanceProps) {
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
                      {assets.map((asset, index) => (
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
                      ))}
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
                      )}
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
  );
}
