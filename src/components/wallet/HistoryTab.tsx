import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

type Transaction = {
  id: number;
  type: 'receive' | 'send' | 'swap';
  asset: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
  hash: string;
};

interface HistoryTabProps {
  transactions: Transaction[];
}

export default function HistoryTab({ transactions }: HistoryTabProps) {
  if (transactions.length === 0) {
    return (
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
    );
  }

  return (
    <>
      {transactions.map((tx) => (
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
      ))}
    </>
  );
}
