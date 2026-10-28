import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';
import { Play, Pause, RotateCcw, CheckCircle2, Clock, Droplets, Waves, Wind, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalmFocusView: React.FC = () => {
  const { tasks, logFocusSession, toggleTaskStatus, showToast } = useApp();

  const todayTasks = tasks.filter((t) => t.bucket === 'today' && t.status !== 'completed');
  const [selectedTask, setSelectedTask] = useState(todayTasks[0] || null);

  const [durationMins, setDurationMins] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'ocean' | 'breeze'>('none');

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            soundManager.playChime();
            try {
              confetti({ particleCount: 35, spread: 60, colors: ['#C85A17', '#4D6B53'] });
            } catch (e) {}
            if (selectedTask) {
              logFocusSession({
                taskId: selectedTask.id,
                taskTitle: selectedTask.title,
                durationMinutes: durationMins,
                actualMinutes: durationMins,
                distractionNotes: [],
              });
            }
            showToast('Focus session complete. Mind is peaceful.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedTask, durationMins]);

  const handleTogglePlay = () => {
    if (!isRunning) {
      soundManager.playChime();
    }
    setIsRunning(!isRunning);
  };

  const handleSoundChange = (s: 'none' | 'rain' | 'ocean' | 'breeze') => {
    setAmbientSound(s);
    soundManager.setAmbientSound(s);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="max-w-2xl mx-auto py-8 text-center space-y-8 animate-in fade-in duration-300">
      {/* Anchor Task Selector */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold tracking-[0.2em] text-[#C85A17] uppercase">
          Focus Sanctuary
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-[#1C1917] tracking-tight">
          {selectedTask?.title || 'Singular Devoted Attention'}
        </h2>
        {todayTasks.length > 1 && (
          <div className="flex justify-center gap-1.5 flex-wrap pt-1">
            {todayTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTask(t);
                  setSecondsRemaining(durationMins * 60);
                  setIsRunning(false);
                }}
                className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
                  selectedTask?.id === t.id
                    ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917]'
                    : 'bg-[#FFFFFF] text-[#78716C] border-[#E8E2D8] hover:bg-[#F2EFEB]'
                }`}
              >
                {t.title.slice(0, 30)}...
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Giant Serene Timer */}
      <div className="my-6 select-none">
        <div className="text-7xl sm:text-8xl font-light font-mono text-[#1C1917] tracking-tight">
          {timeFormatted}
        </div>

        {/* Presets */}
        <div className="flex justify-center gap-2 mt-6">
          {[10, 25, 45].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setDurationMins(mins);
                setSecondsRemaining(mins * 60);
                setIsRunning(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                durationMins === mins
                  ? 'bg-[#FAF0E6] text-[#C85A17] border-[#E9D5C3]'
                  : 'bg-[#FFFFFF] text-[#78716C] border-[#E8E2D8] hover:bg-[#F2EFEB]'
              }`}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleTogglePlay}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1C1917] text-[#FAF8F5] text-sm font-semibold shadow-md active:scale-95 transition-transform"
        >
          {isRunning ? <Pause className="w-4 h-4 text-[#C85A17]" /> : <Play className="w-4 h-4 text-[#C85A17]" />}
          <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsRemaining(durationMins * 60);
          }}
          className="p-3.5 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] text-[#78716C] hover:bg-[#F2EFEB] transition-colors"
          title="Reset timer"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Ambient Soundscape Pills */}
      <div className="pt-6 border-t border-[#E8E2D8]/60 space-y-2">
        <p className="text-[11px] font-semibold text-[#8F877F] uppercase tracking-wider">
          Ambient Soundscape
        </p>
        <div className="flex justify-center gap-2">
          {[
            { key: 'none', label: 'Silence', icon: VolumeX },
            { key: 'rain', label: 'Rain', icon: Droplets },
            { key: 'ocean', label: 'Ocean', icon: Waves },
            { key: 'breeze', label: 'Breeze', icon: Wind },
          ].map((s) => {
            const Icon = s.icon;
            const isCur = ambientSound === s.key;
            return (
              <button
                key={s.key}
                onClick={() => handleSoundChange(s.key as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isCur
                    ? 'bg-[#FAF0E6] text-[#C85A17] border-[#E9D5C3] font-semibold'
                    : 'bg-[#FFFFFF] text-[#78716C] border-[#E8E2D8] hover:bg-[#F2EFEB]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
