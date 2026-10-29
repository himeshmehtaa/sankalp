import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';
import {
  MountainSilhouette,
  MeditationHalo,
  ConstellationDots,
  LeafMotif,
  SparkleCluster,
} from '../brand/Illustrations';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Target,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalmFocusView: React.FC = () => {
  const { tasks, logFocusSession, toggleTaskStatus, showToast } = useApp();

  const todayTasks = tasks.filter((t) => t.bucket === 'today' && t.status !== 'completed');
  const [selectedTask, setSelectedTask] = useState(todayTasks[0] || null);

  const [durationMins, setDurationMins] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [distractionText, setDistractionText] = useState('');
  const [parkedThoughts, setParkedThoughts] = useState<string[]>([]);

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
              confetti({ particleCount: 50, spread: 70, colors: ['#B85C3B', '#6B7A5B', '#FAF8F4'] });
            } catch (e) {}
            if (selectedTask) {
              logFocusSession({
                taskId: selectedTask.id,
                taskTitle: selectedTask.title,
                durationMinutes: durationMins,
                actualMinutes: durationMins,
                distractionNotes: parkedThoughts,
              });
            }
            showToast('Focus session complete. Mind is peaceful and centered.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedTask, durationMins, parkedThoughts]);

  const handleTogglePlay = () => {
    soundManager.warmUp();
    if (!isRunning) {
      soundManager.playChime();
    }
    setIsRunning(!isRunning);
  };

  const handleParkThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distractionText.trim()) return;
    setParkedThoughts((prev) => [...prev, distractionText.trim()]);
    setDistractionText('');
    showToast('Distraction parked. Flow protected.');
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-8 animate-in fade-in duration-300">
      {/* Anchor Task Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8EDE8] border border-[#E7E1DA]">
          <span className="w-2 h-2 rounded-full bg-[#B85C3B] animate-pulse" />
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#B85C3B] uppercase">
            Focus Sanctuary
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1A19] tracking-tight font-editorial">
          {selectedTask?.title || 'Singular Devoted Attention'}
        </h2>

        {todayTasks.length > 1 && (
          <div className="flex justify-center gap-1.5 flex-wrap pt-2">
            {todayTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTask(t);
                  setSecondsRemaining(durationMins * 60);
                  setIsRunning(false);
                }}
                className={`text-[11px] px-3.5 py-1 rounded-full border transition-all ${
                  selectedTask?.id === t.id
                    ? 'bg-[#B85C3B] text-white border-[#B85C3B] font-semibold shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#78716C] border-[#E7E1DA] hover:bg-[#F2EFEB]'
                }`}
              >
                {t.title.slice(0, 28)}...
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Serene Daylight Focus Card with Subtle Illustrations (NO dark bg) */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F4] to-[#F8EDE8]/60 text-[#1B1A19] p-8 sm:p-12 shadow-sm border border-[#E7E1DA] overflow-hidden text-center">
        {/* Background Sacred Geometric Halo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <MeditationHalo className="w-80 h-80 sm:w-96 sm:h-96" pulseColor="#B85C3B" animate={isRunning} />
        </div>

        {/* Mountain Silhouette Grounding at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-30">
          <MountainSilhouette className="w-full h-14" color="#B85C3B" />
        </div>

        {/* Constellation Dots */}
        <div className="absolute top-2 left-0 right-0 pointer-events-none opacity-20">
          <ConstellationDots className="w-full h-20" color="#6B7A5B" />
        </div>

        {/* Giant Timer Display */}
        <div className="relative z-10 my-6 sm:my-8 select-none">
          <div className="text-7xl sm:text-9xl font-light font-mono tracking-tight text-[#1B1A19] drop-shadow-2xs">
            {timeFormatted}
          </div>

          {/* Duration Selector Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setDurationMins(mins);
                  setSecondsRemaining(mins * 60);
                  setIsRunning(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  durationMins === mins
                    ? 'bg-[#B85C3B] text-white border-[#B85C3B] font-bold shadow-xs'
                    : 'bg-white border-[#E7E1DA] text-[#78716C] hover:bg-[#FAF8F4]'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#B85C3B] hover:bg-[#A04F32] text-white text-xs font-bold tracking-wide shadow-md active:scale-95 transition-all"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Begin Flow</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(durationMins * 60);
              soundManager.playChime();
            }}
            className="p-3.5 rounded-full bg-white border border-[#E7E1DA] text-[#78716C] hover:text-[#1B1A19] hover:bg-[#FAF8F4] shadow-2xs transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-Session Thought Parker */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold text-[#1B1A19]">
            Park Fleeting Distractions (Protect single-threaded flow)
          </p>
          <span className="text-[10px] text-[#78716C] bg-[#FAF8F4] px-2 py-0.5 rounded-md border border-[#E7E1DA]">
            Safe Holding Space
          </span>
        </div>

        <form onSubmit={handleParkThought} className="flex gap-2">
          <input
            type="text"
            placeholder="Type stray thought or idea to review later..."
            value={distractionText}
            onChange={(e) => setDistractionText(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B] transition-colors"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#B85C3B] hover:bg-[#A04F32] text-white text-xs font-semibold shadow-2xs transition-all active:scale-95"
          >
            Park Thought
          </button>
        </form>

        {parkedThoughts.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-2">
            {parkedThoughts.map((pt, i) => (
              <span
                key={i}
                className="text-[11px] bg-[#FAF8F4] border border-[#E7E1DA] px-2.5 py-1 rounded-lg text-[#57534E] flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85C3B]" />
                <span>{pt}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
