import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
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
            try {
              confetti({ particleCount: 40, spread: 70, colors: ['#B85C3B', '#6B7A5B'] });
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
            showToast('Focus session complete. Mind is peaceful.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, selectedTask, durationMins, parkedThoughts]);

  const handleTogglePlay = () => {
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
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#B85C3B] uppercase">
          Focus Sanctuary
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#1B1A19] tracking-tight font-editorial">
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
                className={`text-[11px] px-3.5 py-1 rounded-full border transition-all ${
                  selectedTask?.id === t.id
                    ? 'bg-[#1B1A19] text-[#FAF8F4] border-[#1B1A19] font-semibold shadow-2xs'
                    : 'bg-[#FFFFFF] text-[#78716C] border-[#E7E1DA] hover:bg-[#F2EFEB]'
                }`}
              >
                {t.title.slice(0, 28)}...
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modern Focus Card with Ambient Glow */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#161722] to-[#0E0F15] text-white p-8 sm:p-12 shadow-2xl border border-white/10 overflow-hidden text-center">
        {/* Glow behind timer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#B85C3B]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Giant Timer Display */}
        <div className="relative z-10 my-8 select-none">
          <div className="text-7xl sm:text-9xl font-light font-mono tracking-tight text-white drop-shadow-sm">
            {timeFormatted}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  setDurationMins(mins);
                  setSecondsRemaining(mins * 60);
                  setIsRunning(false);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  durationMins === mins
                    ? 'bg-white text-[#1B1A19] font-bold shadow-md'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="relative z-10 flex items-center justify-center gap-4">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#B85C3B] hover:bg-[#B34D10] text-white text-sm font-bold shadow-lg shadow-[#B85C3B]/25 active:scale-95 transition-transform"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(durationMins * 60);
            }}
            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* In-Session Thought Parker */}
      <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3">
        <p className="text-xs font-bold text-[#1B1A19]">
          Park Distractions (Keep your attention single-threaded)
        </p>

        <form onSubmit={handleParkThought} className="flex gap-2">
          <input
            type="text"
            placeholder="Type fleeting thought to review later and press Enter..."
            value={distractionText}
            onChange={(e) => setDistractionText(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-semibold"
          >
            Park
          </button>
        </form>

        {parkedThoughts.length > 0 && (
          <div className="flex gap-2 flex-wrap pt-2">
            {parkedThoughts.map((pt, i) => (
              <span
                key={i}
                className="text-[11px] bg-[#FAF8F4] border border-[#E7E1DA] px-2.5 py-1 rounded-lg text-[#57534E]"
              >
                • {pt}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
