import React, { useState, useEffect } from 'react';
import { SankalpSymbol } from '../brand/SankalpLogo';

interface AppSplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onFinish,
  minDurationMs = 1200,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Progress fill animation
    const progressTimer = setTimeout(() => {
      setProgress(100);
    }, 300);

    // Fade out timer
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDurationMs);

    // Complete removal timer
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, minDurationMs + 400);

    return () => {
      clearTimeout(progressTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [minDurationMs, onFinish]);

  if (!isVisible) return null;

  return (
    <div
      onClick={() => {
        setIsFadingOut(true);
        setTimeout(() => {
          setIsVisible(false);
          if (onFinish) onFinish();
        }, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-[#FAF8F4] select-none transition-opacity duration-400 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Sankalp is loading"
    >
      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <span className="text-[10px] tracking-widest uppercase text-[#8F877F] font-mono">
          v1.0
        </span>
      </div>

      {/* Center Brand Identity */}
      <div className="flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-500">
        {/* Abstract Two-Part S Mark */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-3xl bg-white shadow-sm border border-[#E7E1DA]">
          <SankalpSymbol className="w-12 h-12 sm:w-14 sm:h-14" fillColor="#B85C3B" />
        </div>

        {/* Wordmark */}
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[0.32em] text-[#1B1A19] font-wordmark">
            S A N K A L P
          </h1>
          <p className="text-xs sm:text-sm font-medium tracking-wide text-[#78716C]">
            A promise to the person you're becoming.
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress & Calming Whisper */}
      <div className="w-full max-w-xs flex flex-col items-center space-y-3 pb-6">
        <div className="w-full h-1 bg-[#E7E1DA] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#B85C3B] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] font-medium tracking-wider uppercase text-[#8F877F]">
          Preparing Sanctuary...
        </p>
      </div>
    </div>
  );
};
