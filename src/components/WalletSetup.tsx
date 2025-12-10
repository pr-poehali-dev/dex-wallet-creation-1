import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import * as bip39 from 'bip39';
import { useToast } from '@/hooks/use-toast';

interface WalletSetupProps {
  open: boolean;
  onComplete: () => void;
}

export default function WalletSetup({ open, onComplete }: WalletSetupProps) {
  const [step, setStep] = useState<'intro' | 'generate' | 'confirm' | 'success'>('intro');
  const [seedPhrase, setSeedPhrase] = useState<string[]>([]);
  const [confirmedWords, setConfirmedWords] = useState<{ [key: number]: string }>({});
  const [verificationIndexes] = useState<number[]>([2, 5, 8]);
  const [copied, setCopied] = useState(false);
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

  const handleConfirm = () => {
    const isValid = verificationIndexes.every(
      index => confirmedWords[index]?.toLowerCase().trim() === seedPhrase[index]?.toLowerCase()
    );

    if (isValid) {
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

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="bg-card max-w-2xl" hideClose={step !== 'success'}>
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

              <Button 
                onClick={() => setStep('generate')} 
                className="w-full" 
                size="lg"
              >
                Создать новый кошелек
                <Icon name="ArrowRight" className="ml-2" size={18} />
              </Button>
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
