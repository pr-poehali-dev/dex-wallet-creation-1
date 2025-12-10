import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import * as bip39 from 'bip39';
import { useToast } from '@/hooks/use-toast';
import { DotScreenShader } from '@/components/ui/dot-shader-background';

interface WalletSetupProps {
  open: boolean;
  onComplete: () => void;
  initialMode?: 'create' | 'restore';
}

export default function WalletSetup({ open, onComplete, initialMode = 'create' }: WalletSetupProps) {
  const [step, setStep] = useState<'intro' | 'generate' | 'confirm' | 'success' | 'restore'>(initialMode === 'restore' ? 'restore' : 'intro');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [confirmedWords, setConfirmedWords] = useState<{ [key: number]: string }>({});
  const [verificationIndexes] = useState<number[]>([2, 5, 8]);
  const [copied, setCopied] = useState(false);
  const [restoreSeed, setRestoreSeed] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (step === 'generate') {
      const mnemonic = bip39.generateMnemonic();
      setSeedPhrase(mnemonic.split(' '));
    }
  }, [step]);

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase.join(' '));
    setCopied(true);
    toast({
      title: "Скопировано!",
      description: "Seed-фраза скопирована в буфер обмена",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const generateUserId = async (seed: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(seed);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 16);
  };

  const handleConfirm = async () => {
    const isValid = verificationIndexes.every(
      index => confirmedWords[index]?.toLowerCase().trim() === seedPhrase[index]?.toLowerCase()
    );

    if (isValid) {
      const seed = seedPhrase.join(' ');
      const userId = await generateUserId(seed);
      localStorage.setItem('walletSeed', seed);
      localStorage.setItem('userId', userId);
      setStep('success');
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      toast({
        variant: "destructive",
        title: "Ошибка проверки",
        description: "Введенные слова не совпадают с seed-фразой",
      });
    }
  };

  const handleRestore = async () => {
    const words = restoreSeed.trim().toLowerCase().split(/\s+/);
    
    if (words.length !== 12) {
      toast({
        variant: "destructive",
        title: "Неверный формат",
        description: "Seed-фраза должна содержать ровно 12 слов",
      });
      return;
    }

    if (!bip39.validateMnemonic(words.join(' '))) {
      toast({
        variant: "destructive",
        title: "Неверная seed-фраза",
        description: "Введенная фраза не является корректной BIP39 мнемоникой",
      });
      return;
    }

    const seed = words.join(' ');
    const userId = await generateUserId(seed);
    localStorage.setItem('walletSeed', seed);
    localStorage.setItem('userId', userId);
    setStep('success');
    toast({
      title: "Кошелек восстановлен!",
      description: "Доступ к вашему кошельку успешно восстановлен",
    });
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-card/95 backdrop-blur-sm max-w-2xl relative overflow-hidden" hideClose={step !== 'success'}>
        <div className="absolute inset-0 -z-10">
          <DotScreenShader />
        </div>
        {step === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name="Wallet" className="text-primary" size={28} />
                </div>
                Создание кошелька
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <Icon name="Shield" className="text-primary mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Безопасность превыше всего</h4>
                    <p className="text-sm text-muted-foreground">
                      Мы создадим для вас seed-фразу из 12 слов. Это ключ к вашему кошельку.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                  <Icon name="AlertTriangle" className="text-destructive mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Важное предупреждение</h4>
                    <p className="text-sm text-muted-foreground">
                      Никогда не делитесь своей seed-фразой. Сохраните её в безопасном месте.
                      Потеря фразы = потеря доступа к средствам.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Icon name="FileText" className="text-foreground mt-1" size={24} />
                  <div>
                    <h4 className="font-semibold mb-1">Запишите на бумаге</h4>
                    <p className="text-sm text-muted-foreground">
                      Рекомендуем записать seed-фразу на бумаге и хранить в надёжном месте,
                      недоступном для посторонних.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep('generate')} 
                  className="flex-1" 
                  size="lg"
                >
                  Создать новый кошелек
                  <Icon name="Plus" className="ml-2" size={18} />
                </Button>
                <Button 
                  onClick={() => setStep('restore')} 
                  variant="outline"
                  className="flex-1" 
                  size="lg"
                >
                  Восстановить кошелек
                  <Icon name="RotateCcw" className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'generate' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Ваша Seed-фраза</DialogTitle>
              <p className="text-muted-foreground">
                Запишите эти 12 слов в правильном порядке
              </p>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-3 gap-3">
                {seedPhrase.map((word, index) => (
                  <Card key={index} className="p-3 bg-muted/50 hover:bg-muted transition-colors">
                    <div className="text-xs text-muted-foreground mb-1">#{index + 1}</div>
                    <div className="font-mono font-semibold">{word}</div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleCopySeed} 
                  variant="outline" 
                  className="flex-1 gap-2"
                >
                  <Icon name={copied ? "Check" : "Copy"} size={18} />
                  {copied ? 'Скопировано' : 'Копировать всё'}
                </Button>
              </div>

              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <div className="flex items-start gap-2">
                  <Icon name="AlertCircle" className="text-destructive mt-0.5" size={20} />
                  <p className="text-sm text-muted-foreground">
                    Убедитесь, что вы записали все слова. На следующем шаге нужно будет подтвердить несколько слов.
                  </p>
                </div>
              </div>

              <Button 
                onClick={() => setStep('confirm')} 
                className="w-full" 
                size="lg"
              >
                Я записал seed-фразу
                <Icon name="ArrowRight" className="ml-2" size={18} />
              </Button>
            </div>
          </>
        )}

        {step === 'confirm' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Подтверждение seed-фразы</DialogTitle>
              <p className="text-muted-foreground">
                Введите указанные слова для проверки
              </p>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-4">
                {verificationIndexes.map((wordIndex) => (
                  <div key={wordIndex}>
                    <label className="text-sm font-medium mb-2 block">
                      Слово #{wordIndex + 1}
                    </label>
                    <Input
                      placeholder="Введите слово..."
                      value={confirmedWords[wordIndex] || ''}
                      onChange={(e) => 
                        setConfirmedWords({
                          ...confirmedWords,
                          [wordIndex]: e.target.value
                        })
                      }
                      className="font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep('generate')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Icon name="ArrowLeft" className="mr-2" size={18} />
                  Назад
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  className="flex-1"
                  disabled={!verificationIndexes.every(i => confirmedWords[i]?.trim())}
                >
                  Подтвердить
                  <Icon name="Check" className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'restore' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Icon name="RotateCcw" className="text-primary" size={28} />
                </div>
                Восстановление кошелька
              </DialogTitle>
              <p className="text-muted-foreground">
                Введите вашу seed-фразу из 12 слов
              </p>
            </DialogHeader>
            <div className="space-y-6 mt-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  Seed-фраза (12 слов через пробел)
                </label>
                <textarea
                  value={restoreSeed}
                  onChange={(e) => setRestoreSeed(e.target.value)}
                  placeholder="word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12"
                  className="w-full min-h-[120px] p-3 rounded-lg border bg-background font-mono text-sm resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Введите 12 слов в правильном порядке, разделяя их пробелами
                </p>
              </div>

              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-start gap-2">
                  <Icon name="Info" className="text-primary mt-0.5" size={20} />
                  <p className="text-sm text-muted-foreground">
                    Ваша seed-фраза никуда не отправляется. Восстановление происходит локально в вашем браузере.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => setStep('intro')} 
                  variant="outline" 
                  className="flex-1"
                >
                  <Icon name="ArrowLeft" className="mr-2" size={18} />
                  Назад
                </Button>
                <Button 
                  onClick={handleRestore} 
                  className="flex-1"
                  disabled={!restoreSeed.trim()}
                >
                  Восстановить
                  <Icon name="Check" className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Кошелек создан!</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-4 text-center py-8">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-success" size={48} />
                </div>
              </div>
              <div>
                <p className="text-lg font-semibold mb-2">Всё готово!</p>
                <p className="text-muted-foreground">
                  Ваш кошелек успешно создан и защищён
                </p>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}