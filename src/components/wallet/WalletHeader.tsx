import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';

interface WalletHeaderProps {
  userId: string;
  onLogout: () => void;
}

export default function WalletHeader({ userId, onLogout }: WalletHeaderProps) {
  const navigate = useNavigate();

  return (
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
          onClick={onLogout}
        >
          <Icon name="LogOut" size={16} className="sm:w-5 sm:h-5" />
        </Button>
      </div>
    </header>
  );
}
