import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 10000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadingComplete();
          }, 200);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center gap-16 w-full max-w-7xl">
        <h1 className="text-[8rem] md:text-[12rem] lg:text-[16rem] font-black text-center bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text text-transparent leading-none">
          DEXXX WALLET
        </h1>

        <div className="w-full max-w-2xl space-y-4">
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-lg text-center text-muted-foreground">
            Страница загружается...
          </p>
        </div>
      </div>
    </div>
  );
}