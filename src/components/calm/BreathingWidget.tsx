import React, { useState, useEffect, useRef } from 'react';
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
  VolumeX,
  Bell,
  Headphones,
  Music,
  CloudRain,
  Waves,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MeditationHalo, BreathCloud, LeafMotif } from '../brand/Illustrations';

export type MeditationMode = 'box' | 'sigh' | '478' | 'zen';
export type SoundGuidanceMode = 'voice-chimes' | 'chimes-only' | 'silent';
export type AmbientMode = 'none' | 'rain' | 'ocean' | 'breeze';

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
    description: '4s In • 4s Hold • 4s Out • 4s Rest. Navy SEAL standard protocol for razor composure under high stress.',
    badge: '4-4-4-4 Protocol',
  },
  {
    id: 'sigh',
    name: 'Physiological Sigh',
    tagline: 'Instant Anxiety Relief',
    icon: Zap,
    inhale: 3,
    hold1: 1, // quick top-off sip
    exhale: 6,
    hold2: 2,
    description: 'Two quick inhales through nose, followed by one long slow exhale through mouth. Fast autonomic reset.',
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
    description: 'Dr. Andrew Weil method: Stimulates the vagus nerve and activates deep parasympathetic physical recovery.',
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
    description: 'Unstructured natural breath rhythm. Anchor mindful awareness to the gentle rising and falling of your chest.',
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

  // Sound Guidance Configuration
  const [soundMode, setSoundMode] = useState<SoundGuidanceMode>('voice-chimes');
  const [ambientSound, setAmbientSound] = useState<AmbientMode>('none');
  const [isPlayingAudioTest, setIsPlayingAudioTest] = useState(false);

  const currentConfig = MODES.find((m) => m.id === mode)!;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const handleTestAudio = () => {
    setIsPlayingAudioTest(true);
    soundManager.warmUp();
    soundManager.warmUpSpeech();
    soundManager.playChime();
    soundManager.speakGuidedCue('Guided sound is ready');
    soundManager.triggerHaptic([30, 40, 30]);
    setTimeout(() => setIsPlayingAudioTest(false), 2200);
  };

  const playPhaseGuidance = (
    targetPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2',
    targetMode: MeditationMode,
    sMode: SoundGuidanceMode
  ) => {
    if (sMode === 'silent') return;

    // 1. Play harmonic Solfeggio sound tone
    soundManager.playBreathingTone(targetPhase);

    // 2. Tactile haptic pulse for mobile
    soundManager.triggerHaptic(
      targetPhase === 'hold1' || targetPhase === 'hold2' ? [30, 40, 30] : 45
    );

    // 3. Play voice cue if 'voice-chimes' enabled
    if (sMode === 'voice-chimes') {
      let voiceCue = '';
      if (targetMode === 'box') {
        if (targetPhase === 'inhale') voiceCue = 'Breathe in';
        else if (targetPhase === 'hold1') voiceCue = 'Hold';
        else if (targetPhase === 'exhale') voiceCue = 'Breathe out slowly';
        else if (targetPhase === 'hold2') voiceCue = 'Rest';
      } else if (targetMode === 'sigh') {
        if (targetPhase === 'inhale') voiceCue = 'Deep breath in';
        else if (targetPhase === 'hold1') voiceCue = 'Take a second sip in';
        else if (targetPhase === 'exhale') voiceCue = 'Long slow exhale';
        else if (targetPhase === 'hold2') voiceCue = 'Release and relax';
      } else if (targetMode === '478') {
        if (targetPhase === 'inhale') voiceCue = 'Inhale quietly through your nose';
        else if (targetPhase === 'hold1') voiceCue = 'Hold your breath';
        else if (targetPhase === 'exhale') voiceCue = 'Exhale completely through your mouth';
        else if (targetPhase === 'hold2') voiceCue = 'Rest';
      } else {
        if (targetPhase === 'inhale') voiceCue = 'Inhale naturally';
        else if (targetPhase === 'hold1') voiceCue = 'Hold gently';
        else if (targetPhase === 'exhale') voiceCue = 'Exhale and let go';
        else if (targetPhase === 'hold2') voiceCue = 'Stillness';
      }
      soundManager.speakGuidedCue(voiceCue);
    }
  };

  // Timer & Phase Progression Effect
  useEffect(() => {
    let timer: any;
    if (isActive) {
      if (mode === 'zen') {
        timer = setInterval(() => {
          setZenSecondsRemaining((prev) => {
            if (prev <= 1) {
              soundManager.playChime();
              if (soundMode === 'voice-chimes') {
                soundManager.speakGuidedCue('Meditation complete. Gently return to the present moment.');
              }
              setIsActive(false);
              try {
                confetti({ particleCount: 50, spread: 70, colors: ['#B85C3B', '#6B7A5B', '#FAF8F4'] });
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
              let nextPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2' = 'inhale';
              let nextDuration = currentConfig.inhale;

              if (phaseRef.current === 'inhale') {
                if (currentConfig.hold1 > 0) {
                  nextPhase = 'hold1';
                  nextDuration = currentConfig.hold1;
                } else {
                  nextPhase = 'exhale';
                  nextDuration = currentConfig.exhale;
                }
              } else if (phaseRef.current === 'hold1') {
                nextPhase = 'exhale';
                nextDuration = currentConfig.exhale;
              } else if (phaseRef.current === 'exhale') {
                if (currentConfig.hold2 > 0) {
                  nextPhase = 'hold2';
                  nextDuration = currentConfig.hold2;
                } else {
                  nextPhase = 'inhale';
                  nextDuration = currentConfig.inhale;
                  setCyclesCompleted((c) => c + 1);
                }
              } else {
                nextPhase = 'inhale';
                nextDuration = currentConfig.inhale;
                setCyclesCompleted((c) => c + 1);
              }

              setPhase(nextPhase);
              playPhaseGuidance(nextPhase, mode, soundMode);
              return nextDuration;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, mode, currentConfig, soundMode]);

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
      // CRITICAL: Warm up audio context from user gesture for mobile
      soundManager.warmUp();
      if (soundMode === 'voice-chimes') {
        soundManager.warmUpSpeech();
      }
      setIsActive(true);
      playPhaseGuidance(phase, mode, soundMode);
    } else {
      setIsActive(false);
    }
  };

  const handleReset = () => {
    soundManager.warmUp(); // Ensure audio unlocked
    setIsActive(false);
    setPhase('inhale');
    setSecondsLeft(currentConfig.inhale);
    if (mode === 'zen') {
      setZenSecondsRemaining(zenMinutes * 60);
    }
    soundManager.playChime();
  };

  const handleAmbientChange = (snd: AmbientMode) => {
    soundManager.warmUp(); // User gesture unlock
    setAmbientSound(snd);
    soundManager.setAmbientSound(snd);
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
        return 'Empty stillness & rest...';
    }
  };

  // Light, soothing Ivory / Stone / Terracotta / Sage Visual Mandalas (NO dark bg)
  const getVisualScale = () => {
    if (mode === 'zen') {
      return isActive
        ? 'scale-105 bg-gradient-to-tr from-[#FAF8F4] via-[#FFFFFF] to-[#F8EDE8] border-2 border-[#6B7A5B]/50 shadow-xl ring-8 ring-[#6B7A5B]/15'
        : 'scale-95 bg-[#FFFFFF] border-2 border-[#E7E1DA] shadow-sm';
    }
    switch (phase) {
      case 'inhale':
        return 'scale-110 sm:scale-120 bg-gradient-to-tr from-[#FAF8F4] via-[#FFFFFF] to-[#F8EDE8] border-2 border-[#6B7A5B] shadow-2xl ring-12 ring-[#6B7A5B]/20';
      case 'hold1':
        return 'scale-110 sm:scale-120 bg-gradient-to-tr from-[#FAF8F4] via-[#F8EDE8] to-[#FFFFFF] border-2 border-[#B85C3B] shadow-2xl ring-12 ring-[#B85C3B]/25 animate-pulse';
      case 'exhale':
        return 'scale-95 bg-gradient-to-tr from-[#FAF8F4] to-[#F5F2EB] border-2 border-[#D4C3B3] shadow-md ring-4 ring-[#E7E1DA]';
      case 'hold2':
        return 'scale-85 bg-[#FAF8F4] border-2 border-[#E7E1DA] shadow-xs ring-0';
    }
  };

  const zenMinsLeft = Math.floor(zenSecondsRemaining / 60);
  const zenSecsLeft = zenSecondsRemaining % 60;

  return (
    <div className="max-w-3xl mx-auto py-3 px-4 sm:px-6 space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6B7A5B]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#6B7A5B]">
              Sanctuary Space
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1B1A19] mt-0.5">
            Breathe & Meditation
          </h1>
          <p className="text-xs text-[#78716C] mt-0.5">
            Real physiological reset with guided voice and acoustic harmonic monitoring
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8F877F] hover:bg-[#F2EFEB] transition-colors"
            title="Close Sanctuary"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Guided Sound Monitoring Controls (Prominent Bar) */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Headphones className="w-4 h-4 text-[#B85C3B]" />
            <div>
              <span className="text-xs font-bold text-[#1B1A19]">Audio Guidance Monitor</span>
              <p className="text-[10px] text-[#78716C]">
                Close your eyes and let harmonic tones and voice cues pace your breathing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Quick Test Audio Button (Instant Mobile Sound Check) */}
            <button
              onClick={handleTestAudio}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#F8EDE8] border border-[#B85C3B]/25 hover:bg-[#F2DACE] text-[#B85C3B] text-xs font-semibold shadow-2xs transition-all active:scale-95"
              title="Test speaker sound output on mobile"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudioTest ? 'animate-bounce text-[#B85C3B]' : ''}`} />
              <span>{isPlayingAudioTest ? 'Playing...' : 'Test Sound'}</span>
            </button>

            {/* Sound Guidance Selector */}
            <div className="flex items-center gap-1 bg-[#FAF8F4] p-1 rounded-xl border border-[#E7E1DA]">
              <button
                onClick={() => { soundManager.warmUp(); soundManager.warmUpSpeech(); setSoundMode('voice-chimes'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  soundMode === 'voice-chimes'
                    ? 'bg-[#B85C3B] text-white shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1B1A19]'
                }`}
                title="Spoken voice cues and Solfeggio sound tones"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Voice & Chimes</span>
              </button>

              <button
                onClick={() => { soundManager.warmUp(); setSoundMode('chimes-only'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  soundMode === 'chimes-only'
                    ? 'bg-[#B85C3B] text-white shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1B1A19]'
                }`}
                title="Gentle acoustic singing bowl tones for each breath phase"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Chimes Only</span>
              </button>

              <button
                onClick={() => setSoundMode('silent')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  soundMode === 'silent'
                    ? 'bg-[#1B1A19] text-white shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1B1A19]'
                }`}
                title="Mute all audio"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Mute</span>
              </button>
            </div>
          </div>
        </div>

        {/* Ambient Nature Soundscapes Selector */}
        <div className="pt-2 border-t border-[#E7E1DA]/60 flex items-center justify-between text-xs text-[#78716C]">
          <span className="text-[11px] font-medium flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-[#6B7A5B]" />
            <span>Ambient Atmosphere:</span>
          </span>
          <div className="flex items-center gap-1.5">
            {[
              { id: 'none', label: 'Off' },
              { id: 'rain', label: 'Gentle Rain' },
              { id: 'ocean', label: 'Ocean Waves' },
              { id: 'breeze', label: 'Forest Wind' },
            ].map((amb) => (
              <button
                key={amb.id}
                onClick={() => handleAmbientChange(amb.id as AmbientMode)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  ambientSound === amb.id
                    ? 'bg-[#6B7A5B] text-white font-semibold'
                    : 'bg-[#FAF8F4] border border-[#E7E1DA] text-[#78716C] hover:bg-[#F2EFEB]'
                }`}
              >
                {amb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs (Terracotta active, warm white cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {MODES.map((m) => {
          const Icon = m.icon;
          const isSelected = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => handleSwitchMode(m.id)}
              className={`flex flex-col items-start p-3 sm:p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#B85C3B] text-white border-[#B85C3B] shadow-sm ring-2 ring-[#B85C3B]/20'
                  : 'bg-white border-[#E7E1DA] hover:border-[#B85C3B]/40 text-[#1B1A19] hover:bg-[#FAF8F4]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-white' : 'text-[#B85C3B]'
                  }`}
                />
                <span
                  className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F8EDE8] text-[#B85C3B]'
                  }`}
                >
                  {m.id === 'box' ? '4-4-4' : m.id === 'sigh' ? 'Fast' : m.id === '478' ? 'Sleep' : 'Zen'}
                </span>
              </div>
              <span className="text-xs font-bold leading-tight">{m.name}</span>
              <span
                className={`text-[10px] mt-0.5 truncate w-full ${
                  isSelected ? 'text-white/80' : 'text-[#8F877F]'
                }`}
              >
                {m.tagline}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Mode Description Box */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] text-xs text-[#57534E] flex items-center justify-between shadow-2xs">
        <div>
          <span className="font-bold text-[#1B1A19]">{currentConfig.name}: </span>
          <span>{currentConfig.description}</span>
        </div>
      </div>

      {/* Zen Duration Picker if in Zen Mode */}
      {mode === 'zen' && (
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-[#78716C] mr-1">Sitting Time:</span>
          {[3, 5, 10, 15, 20].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setZenMinutes(mins);
                setZenSecondsRemaining(mins * 60);
                setIsActive(false);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                zenMinutes === mins
                  ? 'bg-[#B85C3B] text-white border-[#B85C3B]'
                  : 'bg-white border-[#E7E1DA] text-[#78716C] hover:bg-[#FAF8F4]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      )}

      {/* Visual Expanding Breathing Mandala / Bubble (Serene Light Aesthetic, NO Dark BG) */}
      <div className="py-6 sm:py-8 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#FFFFFF] to-[#FAF8F4] rounded-3xl border border-[#E7E1DA] shadow-xs">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
          {/* Ambient Warm Halo Aura */}
          <div
            className={`absolute inset-0 rounded-full blur-3xl transition-all duration-1000 ${
              isActive
                ? 'bg-gradient-to-tr from-[#6B7A5B]/20 via-[#B85C3B]/15 to-[#F8EDE8]/50 scale-125'
                : 'bg-transparent'
            }`}
          />

          {/* Sacred Meditation Halo Illustration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <MeditationHalo
              className={`w-64 h-64 sm:w-80 sm:h-80 transition-all duration-1000 ${
                isActive ? 'scale-110 opacity-70 rotate-45' : 'scale-90 opacity-30'
              }`}
              pulseColor="#B85C3B"
              animate={isActive}
            />
          </div>

          {/* Core Interactive Breathing Disc */}
          <div
            onClick={handleToggle}
            className={`w-52 h-52 sm:w-60 sm:h-60 rounded-full flex flex-col items-center justify-center text-center p-5 transition-all duration-1000 ease-in-out cursor-pointer select-none relative z-10 ${getVisualScale()}`}
          >
            <p className="text-sm sm:text-base font-bold text-[#1B1A19] transition-all leading-tight max-w-[150px]">
              {getPhasePrompt()}
            </p>

            {isActive ? (
              <span className="text-3xl sm:text-4xl font-mono font-bold text-[#B85C3B] mt-2 tracking-tight">
                {mode === 'zen'
                  ? `${String(zenMinsLeft).padStart(2, '0')}:${String(zenSecsLeft).padStart(2, '0')}`
                  : `${secondsLeft}s`}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-[#B85C3B] mt-2 bg-[#F8EDE8] px-3.5 py-1 rounded-full border border-[#B85C3B]/30 shadow-2xs">
                Tap to Start
              </span>
            )}
          </div>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-3 mt-6 sm:mt-8">
          <button
            onClick={handleToggle}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#B85C3B] hover:bg-[#A04F32] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            {isActive ? (
              <Pause className="w-4 h-4 text-white" />
            ) : (
              <Play className="w-4 h-4 text-white fill-current" />
            )}
            <span>{isActive ? 'Pause Flow' : 'Begin Guided Breathwork'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 rounded-full bg-white border border-[#E7E1DA] text-[#78716C] hover:text-[#1B1A19] hover:bg-[#FAF8F4] shadow-2xs transition-colors"
            title="Singing bowl chime & reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Real-time Guidance Feedback Pill */}
        {isActive && soundMode !== 'silent' && (
          <p className="text-[11px] text-[#6B7A5B] font-medium mt-4 bg-[#EEF2EC] px-4 py-1.5 rounded-full border border-[#D5E0D0] animate-in fade-in flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Audio monitoring is active • You can close your eyes</span>
          </p>
        )}

        {cyclesCompleted > 0 && mode !== 'zen' && (
          <p className="text-xs text-[#6B7A5B] font-semibold mt-3 bg-[#EEF2EC] px-4 py-1.5 rounded-full border border-[#D5E0D0] animate-in fade-in">
            ✨ {cyclesCompleted} calming breath cycles completed
          </p>
        )}
      </div>
    </div>
  );
};
