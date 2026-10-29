import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SankalpSymbol } from '../brand/SankalpLogo';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Plus,
  Minimize2,
  Sparkles,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FocusModeModal: React.FC = () => {
  const {
    isFocusModalOpen,
    setIsFocusModalOpen,
    activeFocusTask,
    focusInitialMinutes,
    logFocusSession,
    toggleTaskStatus,
    showToast,
  } = useApp();

  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [distractionInput, setDistractionInput] = useState<string>('');
  const [distractions, setDistractions] = useState<string[]>([]);
  const [sessionOutcome, setSessionOutcome] = useState<string>('');
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Sync initial seconds when duration changes or modal opens
  useEffect(() => {
    if (isFocusModalOpen) {
      const initial = focusInitialMinutes || 25;
      setDurationMinutes(initial);
      setSecondsRemaining(initial * 60);
      setIsRunning(true);
      setDistractions([]);
      setSessionOutcome('');
      setIsFinishing(false);
    } else {
      setIsRunning(false);
      clearInterval(timerRef.current);
    }
  }, [isFocusModalOpen, focusInitialMinutes]);

  // Interval timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            setIsFinishing(true);
            try {
              confetti({ particleCount: 35, spread: 60, colors: ['#B85C3B', '#FAF8F4'] });
            } catch (e) {}
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  if (!isFocusModalOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const elapsedSeconds = durationMinutes * 60 - secondsRemaining;
  const elapsedMinutes = Math.max(1, Math.round(elapsedSeconds / 60));

  const handleAddDistraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!distractionInput.trim()) return;
    setDistractions((prev) => [...prev, distractionInput.trim()]);
    setDistractionInput('');
    showToast('Distraction parked. Mind is clear.');
  };

  const handleCompleteSession = (markTaskDone: boolean) => {
    logFocusSession({
      taskId: activeFocusTask?.id,
      taskTitle: activeFocusTask?.title || 'Focused Deep Work',
      goalId: activeFocusTask?.goalId,
      durationMinutes,
      actualMinutes: elapsedMinutes,
      distractionNotes: distractions,
      sessionOutcome: sessionOutcome.trim() || undefined,
    });

    if (markTaskDone && activeFocusTask && activeFocusTask.status !== 'completed') {
      toggleTaskStatus(activeFocusTask.id);
    }

    try {
      confetti({ particleCount: 40, spread: 70, colors: ['#B85C3B', '#6B7A5B'] });
    } catch (e) {}

    setIsFocusModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/75 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="focus-modal-title"
    >
      <div className="relative w-full max-w-xl bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl p-7 sm:p-9 text-[#1B1A19] overflow-hidden flex flex-col justify-between max-h-[92vh]">
        {/* Top Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E1DA]">
          <div className="flex items-center gap-2">
            <SankalpSymbol className="w-4 h-4" fillColor="#B85C3B" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#78716C] font-wordmark">
              SANKALP FOCUS SANCTUARY
            </span>
          </div>

          <button
            onClick={() => setIsFocusModalOpen(false)}
            className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#1B1A19] hover:bg-[#F4EFEB] transition-colors"
            title="Minimize focus session"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isFinishing ? (
          <div className="py-6 flex flex-col items-center text-center space-y-6">
            {/* Active Task Name */}
            <div className="max-w-md">
              <span className="text-[11px] font-semibold text-[#B85C3B] uppercase tracking-wider bg-[#F8EDE8] px-2.5 py-0.5 rounded-full border border-[#E7E1DA]">
                Current Anchor
              </span>
              <h2
                id="focus-modal-title"
                className="text-lg sm:text-xl font-bold text-[#1B1A19] mt-3 tracking-tight font-editorial"
              >
                {activeFocusTask?.title || 'Singular Focused Attention'}
              </h2>
              {activeFocusTask?.notes && (
                <p className="text-xs text-[#78716C] mt-1.5 line-clamp-2">
                  {activeFocusTask.notes}
                </p>
              )}
            </div>

            {/* Giant Minimalist Timer */}
            <div className="relative my-2 select-none">
              <div className="text-6xl sm:text-7xl font-mono font-light tracking-tight text-[#1B1A19]">
                {formattedTime}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {[10, 25, 50].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      setDurationMinutes(mins);
                      setSecondsRemaining(mins * 60);
                    }}
                    className={`px-3.5 py-1 text-xs rounded-full border transition-colors ${
                      durationMinutes === mins
                        ? 'border-[#B85C3B] bg-[#F8EDE8] text-[#B85C3B] font-semibold'
                        : 'border-[#E7E1DA] bg-[#FFFFFF] text-[#78716C] hover:bg-[#F4EFEB]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#1B1A19] text-[#FAF8F4] hover:bg-[#2B2927] text-sm font-semibold shadow-md transition-transform active:scale-95"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-4 h-4 text-[#B85C3B]" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-[#B85C3B]" />
                    <span>Resume</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setSecondsRemaining(durationMinutes * 60)}
                className="p-2.5 rounded-2xl border border-[#E7E1DA] bg-[#FFFFFF] hover:bg-[#F4EFEB] text-[#78716C] transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsFinishing(true)}
                className="px-4 py-2.5 rounded-2xl border border-[#E7E1DA] bg-[#FFFFFF] hover:bg-[#F4EFEB] text-xs font-semibold text-[#1B1A19] transition-colors"
              >
                Wrap Up Early
              </button>
            </div>

            {/* Distraction Parker */}
            <div className="w-full max-w-md pt-2 border-t border-[#E7E1DA] text-left">
              <p className="text-[11px] font-semibold text-[#8F877F] uppercase tracking-wider mb-2">
                Park fleeting thoughts (Keep mind clear)
              </p>
              <form onSubmit={handleAddDistraction} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Remember to buy milk, check flight..."
                  value={distractionInput}
                  onChange={(e) => setDistractionInput(e.target.value)}
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-[#F4EFEB] hover:bg-[#E7E1DA] text-xs font-medium text-[#57534E]"
                >
                  Park
                </button>
              </form>

              {distractions.length > 0 && (
                <div className="mt-2.5 space-y-1">
                  {distractions.map((d, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-[#78716C] bg-[#FFFFFF] px-2.5 py-1 rounded-md border border-[#E7E1DA] flex items-center justify-between"
                    >
                      <span>• {d}</span>
                      <span className="text-[9px] text-[#8F877F]">parked</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Session Wrap Up & Tangible Output Log */
          <div className="py-4 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[#F8EDE8] text-[#B85C3B] flex items-center justify-center mx-auto mb-2 border border-[#E7E1DA]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#1B1A19] font-editorial">
                Session Finished ({elapsedMinutes}m recorded)
              </h3>
              <p className="text-xs text-[#78716C] mt-0.5">
                "What tangible progress did you create during this block?"
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] mb-1.5">
                Tangible Output / Notes
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Finished problem statement, resolved responsive touch bug on mobile nav..."
                value={sessionOutcome}
                onChange={(e) => setSessionOutcome(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B] resize-none"
              />
            </div>

            {distractions.length > 0 && (
              <div className="p-3 bg-[#F2EFEB] rounded-xl text-xs text-[#57534E]">
                <p className="font-semibold text-[11px] text-[#78716C] uppercase mb-1">
                  Parked Distractions to Review:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {distractions.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => handleCompleteSession(false)}
                className="p-3 rounded-xl border border-[#D6CEBE] bg-[#FFFFFF] hover:bg-[#F2EFEB] text-xs font-semibold text-[#1B1A19]"
              >
                Save Session Log
              </button>
              <button
                onClick={() => handleCompleteSession(true)}
                className="p-3 rounded-xl bg-[#1B1A19] text-[#FAF8F4] hover:bg-[#2F2B28] text-xs font-semibold shadow-xs"
              >
                Mark Task Completed & Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
