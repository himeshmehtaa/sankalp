import React from 'react';
import { useApp } from '../../context/AppContext';
import { VitalityRings } from '../dashboard/VitalityRings';
import { InteractiveTaskScratchpad } from '../dashboard/InteractiveTaskScratchpad';
import {
  Play,
  CheckCircle2,
  Circle,
  Target,
  Wind,
  Zap,
  Heart,
  Plus,
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
  const proofGoal = proofTask?.goalId ? goals.find((g) => g.id === proofTask.goalId) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2 animate-in fade-in duration-300">
      {/* 1. Greeting & Context */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E7E1DA]/60">
        <div className="space-y-1">
          <p className="text-[11px] uppercase font-semibold tracking-wider text-[#8F877F]">
            {todayDateStr}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#1B1A19] tracking-tight">
            Peace and clarity, {profile.name}
          </h1>
        </div>
        {profile.guidingPrinciple && (
          <div className="flex items-center gap-2 text-xs text-[#78716C] self-start sm:self-auto py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B85C3B] shrink-0" />
            <span className="font-medium">"{profile.guidingPrinciple}"</span>
          </div>
        )}
      </div>

      {/* 2. Visual Vitality Rings (Apple Watch / Endel style) */}
      <VitalityRings />

      {/* 3. Three Mindful Rituals Row */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onStartBreathe}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] hover:border-[#10B981]/50 shadow-2xs hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#EEF2EC] flex items-center justify-center text-[#10B981] mb-2 group-hover:scale-105 transition-transform">
            <Wind className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#1B1A19]">Breathe</span>
          <span className="text-[10px] text-[#8F877F] mt-0.5">1-min reset</span>
        </button>

        <button
          onClick={() => openUnstuckWithState()}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-[#F8EDE8]/80 to-[#FFFFFF] border border-[#E7E1DA] hover:border-[#B85C3B] shadow-2xs hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#F8EDE8] flex items-center justify-center text-[#B85C3B] mb-2 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#9A420E]">Get Unstuck</span>
          <span className="text-[10px] text-[#8F877F] mt-0.5">Instant relief</span>
        </button>

        <button
          onClick={onStartReflect}
          className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] hover:border-[#B85C3B]/50 shadow-2xs hover:shadow-xs transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-[#F8EDE8] flex items-center justify-center text-[#B85C3B] mb-2 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-[#1B1A19]">Reflect</span>
          <span className="text-[10px] text-[#8F877F] mt-0.5">Gratitude</span>
        </button>
      </div>

      {/* 4. The Daily Anchor (Singular Proof Action Hero Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8EDE8] via-[#FFFFFF] to-[#F2E2DA] border border-[#E7E1DA] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B85C3B] animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85C3B] font-editorial">
              Today's #1 Proof Action
            </span>
          </div>

          {proofGoal && (
            <span className="text-xs text-[#78716C] bg-[#FFFFFF]/80 px-2.5 py-1 rounded-full border border-[#E7E1DA] flex items-center gap-1.5 shadow-2xs">
              <Target className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span className="truncate max-w-[160px]">Advances: {proofGoal.title}</span>
            </span>
          )}
        </div>

        {proofTask ? (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskStatus(proofTask.id)}
                className="mt-1 text-[#8F877F] hover:text-[#B85C3B] transition-colors"
                title="Mark completed"
              >
                {proofTask.status === 'completed' ? (
                  <CheckCircle2 className="w-7 h-7 text-[#6B7A5B] fill-[#EEF2EC]" />
                ) : (
                  <Circle className="w-7 h-7 hover:text-[#B85C3B]" />
                )}
              </button>

              <div className="space-y-1 flex-1">
                <h2
                  className={`text-xl sm:text-2xl font-bold tracking-tight ${
                    proofTask.status === 'completed'
                      ? 'line-through text-[#78716C]'
                      : 'text-[#1B1A19]'
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

            {/* Start Focus Action */}
            {proofTask.status !== 'completed' && (
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => startFocusSession(proofTask)}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-md active:scale-95 transition-transform"
                >
                  <Play className="w-4 h-4 text-[#B85C3B] fill-current" />
                  <span>Begin 25-Min Focus Sanctuary</span>
                </button>

                <button
                  onClick={() => setIsQuickCaptureOpen(true)}
                  className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] text-[#78716C] hover:bg-[#FAF8F4] text-xs font-medium"
                  title="Quick capture thought"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-4 space-y-2">
            <p className="text-sm font-semibold text-[#1B1A19]">No primary anchor set for today.</p>
            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#B85C3B] text-[#FFFFFF] text-xs font-semibold shadow-xs"
            >
              Add Today's Anchor
            </button>
          </div>
        )}
      </div>

      {/* 5. Modern Interactive Task Flow & Scratchpad */}
      <InteractiveTaskScratchpad />
    </div>
  );
};
