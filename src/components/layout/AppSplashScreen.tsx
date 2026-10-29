import React, { useState, useEffect } from 'react';
import { SankalpSymbol } from '../brand/SankalpLogo';
import { LeafMotif, MeditationHalo, ConstellationDots } from '../brand/Illustrations';

interface AppSplashScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onFinish,
  minDurationMs = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(10);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Stagger content entry
    const contentTimer = setTimeout(() => setShowContent(true), 100);

    // Smooth progress animation
    const p1 = setTimeout(() => setProgress(40), 200);
    const p2 = setTimeout(() => setProgress(70), 600);
    const p3 = setTimeout(() => setProgress(100), 1000);

    // Fade out timer
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, minDurationMs);

    // Complete removal timer
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    }, minDurationMs + 500);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
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
        }, 250);
      }}
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-between p-8 bg-[#FAF8F4] select-none transition-all duration-500 ease-out ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Sankalp is loading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-left leaf */}
        <div className="absolute -top-10 -left-10 opacity-30">
          <LeafMotif className="w-40 h-40" color="#6B7A5B" />
        </div>
        {/* Bottom-right leaf */}
        <div className="absolute -bottom-10 -right-10 opacity-20 rotate-180">
          <LeafMotif className="w-48 h-48" color="#B85C3B" />
        </div>
        {/* Constellation dots pattern */}
        <div className="absolute top-1/4 left-0 right-0 opacity-50">
          <ConstellationDots className="w-full h-32" color="#E7E1DA" />
        </div>
      </div>

      {/* Top version badge */}
      <div className="relative z-10 w-full flex justify-end">
        <span className="text-[10px] tracking-widest uppercase text-[#8F877F] font-mono opacity-60">
          v1.0
        </span>
      </div>

      {/* Center Brand Identity */}
      <div
        className={`relative z-10 flex flex-col items-center text-center space-y-6 transition-all duration-700 ease-out ${
          showContent
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Meditation halo behind the symbol */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center -m-12">
            <MeditationHalo className="w-44 h-44 opacity-40" pulseColor="#B85C3B" animate />
          </div>

          {/* Symbol with warm glow */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center p-3 rounded-3xl bg-white shadow-md border border-[#E7E1DA]">
            <SankalpSymbol className="w-14 h-14 sm:w-16 sm:h-16" fillColor="#B85C3B" />
          </div>
        </div>

        {/* Wordmark */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[0.32em] text-[#1B1A19] font-wordmark">
            S A N K A L P
          </h1>
          <p className="text-sm font-medium tracking-wide text-[#78716C]">
            A promise to the person you're becoming.
          </p>
        </div>
      </div>

      {/* Bottom Loading Progress */}
      <div
        className={`relative z-10 w-full max-w-xs flex flex-col items-center space-y-3 pb-6 transition-all duration-500 ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar with glow */}
        <div className="w-full h-1.5 bg-[#E7E1DA] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#B85C3B] to-[#D4785B] rounded-full transition-all duration-700 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-[11px] font-medium tracking-wider uppercase text-[#8F877F]">
          Preparing your sanctuary...
        </p>
      </div>
    </div>
  );
};
