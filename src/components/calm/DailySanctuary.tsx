import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Play,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  Wind,
  Zap,
  Heart,
  Plus,
  Compass,
} from 'lucide-react';

interface DailySanctuaryProps {
  onStartBreathe: () => void;
  onStartReflect: () => void;
}

export const DailySanctuary: React.FC<DailySanctuaryProps> = ({
  onStartBreathe,
  onStartReflect,
}) => {
  const {
    profile,
    tasks,
    goals,
    toggleTaskStatus,
    startFocusSession,
    openUnstuckWithState,
    setIsQuickCaptureOpen,
  } = useApp();

  const todayDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const todayTasks = tasks.filter((t) => t.bucket === 'today');
  const proofTask = todayTasks.find((t) => t.priority === 'proof') || todayTasks[0];
  const supportingTasks = todayTasks.filter((t) => t.id !== proofTask?.id).slice(0, 2);
  const proofGoal = proofTask?.goalId ? goals.find((g) => g.id === proofTask.goalId) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4 animate-in fade-in duration-300">
      {/* 1. Atmospheric Greeting Hero */}
      <div className="text-center space-y-2 py-4">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#8F877F]">
          {todayDateStr}
        </span>
        <h1 className="text-3xl sm:text-4xl font-light text-[#1C1917] tracking-tight font-editorial">
          Peace and clarity, {profile.name}
        </h1>
        <p className="text-sm font-serif-quote italic text-[#78716C] max-w-md mx-auto">
          "{profile.guidingPrinciple}"
        </p>
      </div>

      {/* 2. Three Mindful Rituals Row */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onStartBreathe}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#C85A17]/40 shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#EEF4F0] flex items-center justify-center text-[#4D6B53] mb-2 group-hover:scale-105 transition-transform">
            <Wind className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#1C1917]">Breathe</span>
          <span className="text-[10px] text-[#8F877F] mt-0.5">1-min reset</span>
        </button>

        <button
          onClick={() => openUnstuckWithState()}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#FAF0E6]/80 to-[#FFFFFF] border border-[#E9D5C3] hover:border-[#C85A17] shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C85A17] mb-2 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#9A420E]">Get Unstuck</span>
          <span className="text-[10px] text-[#8F877F] mt-0.5">Instant relief</span>
        </button>

        <button
          onClick={onStartReflect}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#C85A17]/40 shadow-xs hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C85A17] mb-2 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#1C1917]">Reflect</span>
          <span className="text-[10px] text-[#8F877F] mt-0.5">Gratitude & peace</span>
        </button>
      </div>

      {/* 3. The Daily Anchor (Singular Proof Action Hero Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FAF0E6] via-[#FFFFFF] to-[#F5E2D0] border border-[#E9D5C3] p-7 sm:p-9 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C85A17] font-editorial">
              Today's Singular Anchor
            </span>
          </div>

          {proofGoal && (
            <span className="text-xs text-[#78716C] bg-[#FFFFFF]/80 px-2.5 py-1 rounded-full border border-[#E8E2D8] flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#C85A17]" />
              <span className="truncate max-w-[160px]">{proofGoal.title}</span>
            </span>
          )}
        </div>

        {proofTask ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskStatus(proofTask.id)}
                className="mt-1 text-[#8F877F] hover:text-[#C85A17] transition-colors"
                title="Mark completed"
              >
                {proofTask.status === 'completed' ? (
                  <CheckCircle2 className="w-7 h-7 text-[#4D6B53] fill-[#EEF4F0]" />
                ) : (
                  <Circle className="w-7 h-7 hover:text-[#C85A17]" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <h2
                  className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    proofTask.status === 'completed'
                      ? 'line-through text-[#78716C]'
                      : 'text-[#1C1917]'
                  }`}
                >
                  {proofTask.title}
                </h2>
                {proofTask.notes && (
                  <p className="text-xs text-[#57534E] leading-relaxed max-w-lg">
                    {proofTask.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Big Relaxed Start Action */}
            {proofTask.status !== 'completed' && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => startFocusSession(proofTask)}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-md active:scale-95 transition-transform"
                >
                  <Play className="w-4 h-4 text-[#C85A17] fill-current" />
                  <span>Begin 25-Min Focus Sanctuary</span>
                </button>

                <button
                  onClick={() => setIsQuickCaptureOpen(true)}
                  className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] text-[#78716C] hover:bg-[#FAF8F5] text-xs font-medium"
                  title="Quick capture thought"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 space-y-2">
            <p className="text-sm font-semibold text-[#1C1917]">No primary anchor set for today.</p>
            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#C85A17] text-[#FFFFFF] text-xs font-semibold shadow-xs"
            >
              Add Today's Anchor
            </button>
          </div>
        )}
      </div>

      {/* 4. Supporting Intentions (Clean, Visual, Max 2) */}
      {supportingTasks.length > 0 && (
        <div className="space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8F877F]">
            Supporting Intentions
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {supportingTasks.map((t) => (
              <div
                key={t.id}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] flex items-center justify-between gap-3 shadow-2xs hover:border-[#D6CEBE] transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="text-[#8F877F] hover:text-[#C85A17]"
                  >
                    {t.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4D6B53]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>
                  <span
                    className={`text-xs font-semibold truncate ${
                      t.status === 'completed' ? 'line-through text-[#8F877F]' : 'text-[#1C1917]'
                    }`}
                  >
                    {t.title}
                  </span>
                </div>

                {t.status !== 'completed' && (
                  <button
                    onClick={() => startFocusSession(t)}
                    className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#C85A17] hover:bg-[#FAF0E6]"
                    title="Focus on this"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
