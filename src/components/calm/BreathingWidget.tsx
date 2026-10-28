import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import { Play, Pause, RotateCcw, Volume2, Sparkles, X } from 'lucide-react';

export const BreathingWidget: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  useEffect(() => {
    let timer: any;
    if (isActive) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Transition phase
            if (phase === 'inhale') {
              setPhase('hold');
              return 4;
            } else if (phase === 'hold') {
              setPhase('exhale');
              return 4;
            } else if (phase === 'exhale') {
              setPhase('rest');
              return 2;
            } else {
              setPhase('inhale');
              setCyclesCompleted((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase]);

  const handleToggle = () => {
    if (!isActive) {
      soundManager.playChime();
    }
    setIsActive(!isActive);
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In...';
      case 'hold':
        return 'Hold gently...';
      case 'exhale':
        return 'Slow Exhale...';
      case 'rest':
        return 'Stillness';
    }
  };

  const getCircleScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-125 bg-gradient-to-tr from-[#FAF0E6] via-[#F5E2D0] to-[#E9D5C3] shadow-lg ring-8 ring-[#C85A17]/15';
      case 'hold':
        return 'scale-125 bg-gradient-to-tr from-[#F5E2D0] to-[#E9D5C3] shadow-xl ring-12 ring-[#C85A17]/25 animate-pulse';
      case 'exhale':
        return 'scale-90 bg-gradient-to-tr from-[#F2EFEB] to-[#E8E2D8] shadow-xs ring-2 ring-[#E8E2D8]';
      case 'rest':
        return 'scale-85 bg-[#FAF8F5] shadow-2xs ring-0';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center max-w-lg mx-auto relative animate-in fade-in duration-300">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#8F877F] hover:bg-[#EBE5DB]"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="space-y-1 mb-8">
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#C85A17] uppercase">
          Mindful Breath
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#1C1917] tracking-tight font-editorial">
          Release Tension
        </h2>
        <p className="text-xs text-[#78716C]">
          Follow the expanding circle. 4 seconds in, 4 hold, 4 out.
        </p>
      </div>

      {/* Breathing Bubble */}
      <div className="relative w-64 h-64 flex items-center justify-center my-6">
        {/* Soft background aura */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
            phase === 'inhale' || phase === 'hold' ? 'bg-[#C85A17]/15 scale-110' : 'bg-transparent'
          }`}
        />

        {/* Animated Circle */}
        <div
          className={`w-48 h-48 rounded-full border border-[#E8E2D8] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out select-none cursor-pointer ${getCircleScale()}`}
          onClick={handleToggle}
        >
          <p className="text-base font-medium text-[#1C1917] transition-all">
            {isActive ? getPhaseText() : 'Tap to Begin'}
          </p>
          {isActive && (
            <span className="text-2xl font-light font-mono text-[#C85A17] mt-1">
              {secondsLeft}s
            </span>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={handleToggle}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1917] text-[#FAF8F5] text-xs font-semibold shadow-md active:scale-95 transition-transform"
        >
          {isActive ? <Pause className="w-4 h-4 text-[#C85A17]" /> : <Play className="w-4 h-4 text-[#C85A17]" />}
          <span>{isActive ? 'Pause' : 'Start Session'}</span>
        </button>

        <button
          onClick={() => {
            setIsActive(false);
            setPhase('inhale');
            setSecondsLeft(4);
            soundManager.playChime();
          }}
          className="p-3 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-[#78716C] hover:bg-[#F2EFEB] transition-colors"
          title="Singing bowl chime & reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {cyclesCompleted > 0 && (
        <p className="text-xs text-[#4D6B53] font-medium mt-6 bg-[#EEF4F0] px-3.5 py-1 rounded-full">
          ✨ {cyclesCompleted} calming breaths completed
        </p>
      )}
    </div>
  );
};
