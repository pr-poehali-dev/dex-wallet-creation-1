import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import { ParticleTextEffect } from '@/components/ui/interactive-text-particle';

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
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="flex flex-col items-center gap-16 w-full h-full">
        <div className="relative w-full h-[60vh] flex items-center justify-center">
          <ParticleTextEffect
            text="DEXXX WALLET"
            colors={['6b7280', '9ca3af', 'a1a1aa', '71717a', '52525b']}
            animationForce={70}
            particleDensity={2}
            className="absolute inset-0"
          />
        </div>

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