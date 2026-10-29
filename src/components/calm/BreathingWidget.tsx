import React, { useState, useEffect } from 'react';
import { soundManager } from '../../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Wind,
  Moon,
  Zap,
  CheckCircle2,
  X,
  Volume2,
  Clock,
  Heart,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type MeditationMode = 'box' | 'sigh' | '478' | 'zen';

interface ModeConfig {
  id: MeditationMode;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
  description: string;
  badge: string;
}

const MODES: ModeConfig[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    tagline: 'Focus & Mental Clarity',
    icon: Wind,
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: '4s In • 4s Hold • 4s Out • 4s Rest. Standard Navy SEAL protocol for composure under pressure.',
    badge: '4-4-4-4 Protocol',
  },
  {
    id: 'sigh',
    name: 'Physiological Sigh',
    tagline: 'Instant Anxiety Relief',
    icon: Zap,
    inhale: 3,
    hold1: 1, // quick top-off inhale
    exhale: 6,
    hold2: 2,
    description: 'Two quick inhales through nose, followed by one long slow exhale through mouth. Huberman protocol.',
    badge: 'Fast Somatic Reset',
  },
  {
    id: '478',
    name: '4-7-8 Restorative',
    tagline: 'Deep Nervous Recovery',
    icon: Moon,
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 1,
    description: 'Dr. Andrew Weil technique that stimulates the vagus nerve and activates parasympathetic recovery.',
    badge: 'Vagus Activation',
  },
  {
    id: 'zen',
    name: 'Zen Meditation',
    tagline: 'Silent Conscious Presence',
    icon: Sparkles,
    inhale: 5,
    hold1: 2,
    exhale: 5,
    hold2: 2,
    description: 'Unstructured natural breath rhythm. Anchor attention to the gentle rise and fall of the chest.',
    badge: 'Mindful Stillness',
  },
];

export const BreathingWidget: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const [mode, setMode] = useState<MeditationMode>('box');
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [zenMinutes, setZenMinutes] = useState(5);
  const [zenSecondsRemaining, setZenSecondsRemaining] = useState(5 * 60);

  const currentConfig = MODES.find((m) => m.id === mode)!;

  // Timer Effect
  useEffect(() => {
    let timer: any;
    if (isActive) {
      if (mode === 'zen') {
        timer = setInterval(() => {
          setZenSecondsRemaining((prev) => {
            if (prev <= 1) {
              soundManager.playChime();
              setIsActive(false);
              try {
                confetti({ particleCount: 40, spread: 60, colors: ['#10B981', '#6366F1', '#F59E0B'] });
              } catch (e) {}
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        timer = setInterval(() => {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              // Transition phase
              if (phase === 'inhale') {
                if (currentConfig.hold1 > 0) {
                  setPhase('hold1');
                  return currentConfig.hold1;
                } else {
                  setPhase('exhale');
                  return currentConfig.exhale;
                }
              } else if (phase === 'hold1') {
                setPhase('exhale');
                return currentConfig.exhale;
              } else if (phase === 'exhale') {
                if (currentConfig.hold2 > 0) {
                  setPhase('hold2');
                  return currentConfig.hold2;
                } else {
                  setPhase('inhale');
                  setCyclesCompleted((c) => c + 1);
                  return currentConfig.inhale;
                }
              } else {
                setPhase('inhale');
                setCyclesCompleted((c) => c + 1);
                return currentConfig.inhale;
              }
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, phase, mode, currentConfig]);

  const handleSwitchMode = (newMode: MeditationMode) => {
    setIsActive(false);
    setMode(newMode);
    const cfg = MODES.find((m) => m.id === newMode)!;
    setPhase('inhale');
    setSecondsLeft(cfg.inhale);
    if (newMode === 'zen') {
      setZenSecondsRemaining(zenMinutes * 60);
    }
  };

  const handleToggle = () => {
    if (!isActive) {
      soundManager.playChime();
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(currentConfig.inhale);
    if (mode === 'zen') {
      setZenSecondsRemaining(zenMinutes * 60);
    }
    soundManager.playChime();
  };

  const getPhasePrompt = () => {
    if (mode === 'zen') {
      return isActive ? 'Rest attention in the present moment...' : 'Sit comfortably & begin';
    }
    switch (phase) {
      case 'inhale':
        return mode === 'sigh' ? 'Deep Inhale (Nose)...' : 'Breathe In Deeply...';
      case 'hold1':
        return mode === 'sigh' ? 'Second sharp sip in...' : 'Hold gently at the top...';
      case 'exhale':
        return 'Long, slow, complete exhale...';
      case 'hold2':
        return 'Empty stillness...';
    }
  };

  const getVisualScale = () => {
    if (mode === 'zen') {
      return isActive
        ? 'scale-105 bg-gradient-to-tr from-indigo-500/20 via-emerald-500/15 to-amber-500/15 border-emerald-500/40 shadow-2xl'
        : 'scale-95 bg-white/5 border-white/10 shadow-md';
    }
    switch (phase) {
      case 'inhale':
        return 'scale-125 bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-indigo-500/20 border-emerald-400/50 shadow-2xl ring-8 ring-emerald-500/15';
      case 'hold1':
        return 'scale-125 bg-gradient-to-tr from-indigo-500/25 via-violet-500/25 to-purple-500/20 border-indigo-400/50 shadow-2xl ring-12 ring-indigo-500/20 animate-pulse';
      case 'exhale':
        return 'scale-90 bg-gradient-to-tr from-amber-500/15 via-orange-500/15 to-transparent border-amber-400/30 shadow-md ring-2 ring-white/10';
      case 'hold2':
        return 'scale-85 bg-white/5 border-white/10 shadow-xs ring-0';
    }
  };

  const zenMinsLeft = Math.floor(zenSecondsRemaining / 60);
  const zenSecsLeft = zenSecondsRemaining % 60;

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#10B981]">
            Sanctuary Space
          </span>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B1A19]">
            Breathe & Meditation
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Real physiological reset to dissolve cognitive fatigue and reset executive function
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8F877F] hover:bg-[#F2EFEB] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isSelected = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSwitchMode(m.id)}
              className={`flex flex-col items-start p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#1B1A19] text-white border-[#1B1A19] shadow-sm'
                  : 'bg-white border-[#E7E1DA] hover:border-[#10B981]/50 text-[#1B1A19] hover:bg-[#FAF8F4]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-[#10B981]' : 'text-[#78716C]'
                  }`}
                />
                <span
                  className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/10 text-white/90' : 'bg-[#F8EDE8] text-[#B85C3B]'
                  }`}
                >
                  {m.id === 'box' ? '4-4-4' : m.id === 'sigh' ? 'Fast' : m.id === '478' ? 'Sleep' : 'Zen'}
                </span>
              </div>
              <span className="text-xs font-bold leading-tight">{m.name}</span>
              <span
                className={`text-[10px] mt-0.5 truncate w-full ${
                  isSelected ? 'text-white/70' : 'text-[#8F877F]'
                }`}
              >
                {m.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Mode Description Box */}
      <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] text-xs text-[#57534E] flex items-center justify-between shadow-2xs">
        <div>
          <span className="font-semibold text-[#1B1A19]">{currentConfig.name}: </span>
          <span>{currentConfig.description}</span>
        </div>
      </div>

      {/* Zen Duration Picker if in Zen Mode */}
      {mode === 'zen' && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-[#78716C] mr-1">Sitting Time:</span>
          {[3, 5, 10, 15].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setZenMinutes(mins);
                setZenSecondsRemaining(mins * 60);
                setIsActive(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                zenMinutes === mins
                  ? 'bg-[#1B1A19] text-white border-[#1B1A19]'
                  : 'bg-white border-[#E7E1DA] text-[#78716C] hover:bg-[#FAF8F4]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      )}

      {/* Visual Expanding Breathing Mandala / Bubble */}
      <div className="py-6 flex flex-col items-center justify-center relative">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Ambient Glow Aura */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
              isActive
                ? 'bg-gradient-to-tr from-emerald-500/20 via-indigo-500/20 to-amber-500/15 scale-110'
                : 'bg-transparent'
            }`}
          />

          {/* Core Interactive Breathing Disc */}
          <div
            onClick={handleToggle}
            className={`w-52 h-52 sm:w-56 sm:h-56 rounded-full border flex flex-col items-center justify-center text-center p-4 transition-all duration-1000 ease-in-out cursor-pointer select-none relative z-10 ${getVisualScale()}`}
          >
            <p className="text-sm sm:text-base font-semibold text-[#1B1A19] transition-all leading-tight max-w-[140px]">
              {getPhasePrompt()}
            </p>

            {isActive ? (
              <span className="text-3xl sm:text-4xl font-mono font-bold text-[#10B981] mt-2 tracking-tight">
                {mode === 'zen'
                  ? `${String(zenMinsLeft).padStart(2, '0')}:${String(zenSecsLeft).padStart(2, '0')}`
                  : `${secondsLeft}s`}
              </span>
            ) : (
              <span className="text-[11px] font-medium text-[#8F877F] mt-2 bg-white/70 px-3 py-1 rounded-full border border-[#E7E1DA]">
                Tap to Start
              </span>
            )}
          </div>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={handleToggle}
            className="flex items-center gap-2 px-7 py-3 rounded-full bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
          >
            {isActive ? <Pause className="w-4 h-4 text-[#10B981]" /> : <Play className="w-4 h-4 text-[#10B981] fill-current" />}
            <span>{isActive ? 'Pause Flow' : 'Begin Meditation'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3 rounded-full bg-white border border-[#E7E1DA] text-[#78716C] hover:bg-[#FAF8F4] transition-colors"
            title="Singing bowl chime & reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {cyclesCompleted > 0 && mode !== 'zen' && (
          <p className="text-xs text-[#065F46] font-medium mt-4 bg-[#ECFDF5] px-4 py-1.5 rounded-full border border-[#A7F3D0] animate-in fade-in">
            ✨ {cyclesCompleted} calming breath cycles completed
          </p>
        )}
      </div>
    </div>
  );
};
