import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import CryptoIcon from '@/components/CryptoIcon';
import NetworkBadge from '@/components/NetworkBadge';
import QRCode from 'qrcode';
import { useToast } from '@/hooks/use-toast';

type Asset = {
  name: string;
  symbol: string;
  balance: number;
  price: number;
  network: string | null;
};

interface PortfolioTabProps {
  assets: Asset[];
  animatingAsset: string | null;
  selectedAsset: Asset | null;
  showAssetDialog: boolean;
  sendAddress: string;
  sendAmount: string;
  currentReceiveAddress: string;
  assetQrCanvasRef: React.RefObject<HTMLCanvasElement>;
  setSelectedAsset: (asset: Asset | null) => void;
  setShowAssetDialog: (show: boolean) => void;
  setSendAddress: (address: string) => void;
  setSendAmount: (amount: string) => void;
  handleSendConfirm: () => void;
}

export default function PortfolioTab({
  assets,
  animatingAsset,
  selectedAsset,
  showAssetDialog,
  sendAddress,
  sendAmount,
  currentReceiveAddress,
  assetQrCanvasRef,
  setSelectedAsset,
  setShowAssetDialog,
  setSendAddress,
  setSendAmount,
  handleSendConfirm,
}: PortfolioTabProps) {
  const { toast } = useToast();

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
  }, [currentReceiveAddress, selectedAsset, showAssetDialog, assetQrCanvasRef]);

  return (
    <>
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

      <Dialog open={showAssetDialog} onOpenChange={setShowAssetDialog}>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              {selectedAsset && (
                <>
                  <CryptoIcon symbol={selectedAsset.symbol} size={32} />
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
                  {selectedAsset.symbol === 'USDD' ? (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <div className="flex items-center gap-2 text-destructive mb-2">
                        <Icon name="AlertCircle" size={20} />
                        <p className="font-semibold">Вывод запрещён</p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Токен USDD временно недоступен для вывода
                      </p>
                    </div>
                  ) : (
                    <>
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
                    </>
                  )}
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
    </>
  );
}