import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import CryptoIcon from '@/components/CryptoIcon';

type Asset = {
  name: string;
  symbol: string;
  balance: number;
  price: number;
  network: string | null;
};

interface SwapTabProps {
  assets: Asset[];
  fromToken: string;
  toToken: string;
  swapAmount: string;
  fromNetwork: string;
  toNetwork: string;
  showSwapConfirmation: boolean;
  lastPriceUpdate: Date | null;
  setFromToken: (token: string) => void;
  setToToken: (token: string) => void;
  setSwapAmount: (amount: string) => void;
  setFromNetwork: (network: string) => void;
  setToNetwork: (network: string) => void;
  setShowSwapConfirmation: (show: boolean) => void;
  getAssetsBySymbol: (symbol: string) => Asset[];
  getSelectedAsset: (symbol: string, network: string) => Asset | undefined;
  calculateSwapOutput: () => string;
  handleSwapConfirm: () => void;
}

export default function SwapTab({
  assets,
  fromToken,
  toToken,
  swapAmount,
  fromNetwork,
  toNetwork,
  showSwapConfirmation,
  lastPriceUpdate,
  setFromToken,
  setToToken,
  setSwapAmount,
  setFromNetwork,
  setToNetwork,
  setShowSwapConfirmation,
  getAssetsBySymbol,
  getSelectedAsset,
  calculateSwapOutput,
  handleSwapConfirm,
}: SwapTabProps) {
  return (
    <>
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
    </>
  );
}
