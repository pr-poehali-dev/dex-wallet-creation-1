import { useEffect, useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { ParticleTextEffect } from '@/components/ui/interactive-text-particle';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 10000;
    const startTime = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          onLoadingComplete();
        }, 200);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  const particleColors = useMemo(() => ['d9d9d9', 'bfbfbf', '999999', '808080', '737373', '666666', '525252', '404040', '333333'], []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="flex flex-col items-center gap-8 w-full h-full">
        <div className="relative w-full flex-1 flex items-center justify-center">
          <ParticleTextEffect
            text="DEXXX WALLET"
            colors={particleColors}
            animationForce={80}
            particleDensity={4}
            className="absolute inset-0"
          />
        </div>

        <div className="w-full max-w-2xl space-y-4 relative z-10">
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