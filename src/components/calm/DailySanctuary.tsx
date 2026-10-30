import React from 'react';
import { useApp } from '../../context/AppContext';
import { VitalityRings } from '../dashboard/VitalityRings';
import { InteractiveTaskScratchpad } from '../dashboard/InteractiveTaskScratchpad';
import { ActiveJourneyCard } from '../journeys/ActiveJourneyCard';
import {
  LeafMotif,
  SunRadiance,
  WaveMotif,
  LotusMotif,
  GradientBlob,
  LeafDivider,
  HeroSanctuaryIllustration,
} from '../brand/Illustrations';
import {
  Play,
  CheckCircle2,
  Circle,
  Target,
  Wind,
  Zap,
  Heart,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface DailySanctuaryProps {
  onStartBreathe: () => void;
  onStartReflect: () => void;
  onOpenJourneys?: () => void;
  onOpenDay?: (dayId: string) => void;
}

export const DailySanctuary: React.FC<DailySanctuaryProps> = ({
  onStartBreathe,
  onStartReflect,
  onOpenJourneys = () => {},
  onOpenDay = () => {},
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

  // Dynamic greeting and time-of-day illustration
  const hour = new Date().getHours();
  const timeOfDay: 'morning' | 'afternoon' | 'evening' =
    hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const greeting =
    timeOfDay === 'morning'
      ? 'Good morning'
      : timeOfDay === 'afternoon'
      ? 'Good afternoon'
      : 'Good evening';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2 animate-in fade-in duration-500">
      {/* 1. Greeting Card with Bespoke Editorial Illustration */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F4] to-[#F8EDE8]/50 border border-[#E7E1DA] p-6 sm:p-8 shadow-xs">
        {/* Ambient botanical leaf watermark */}
        <div className="absolute -bottom-10 -left-10 opacity-20 pointer-events-none">
          <LeafMotif className="w-36 h-36" color="#6B7A5B" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Greeting Text Block */}
          <div className="space-y-2 flex-1">
            <p className="text-[11px] uppercase font-bold tracking-widest text-[#B85C3B]">
              {todayDateStr}
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1B1A19] tracking-tight leading-tight font-editorial">
              {greeting}, {profile.name}
            </h1>
            {profile.guidingPrinciple && (
              <div className="flex items-start gap-2.5 mt-2.5 max-w-md pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B85C3B] shrink-0 mt-1.5" />
                <p className="text-xs text-[#57534E] leading-relaxed italic">
                  "{profile.guidingPrinciple}"
                </p>
              </div>
            )}
          </div>

          {/* Hero Editorial Sanctuary Landscape Illustration */}
          <div className="shrink-0 flex items-center justify-center pointer-events-none self-end md:self-auto -mr-2 sm:-mr-4 -my-4 sm:-my-6">
            <HeroSanctuaryIllustration timeOfDay={timeOfDay} className="w-52 h-28 sm:w-64 sm:h-36 drop-shadow-2xs" />
          </div>
        </div>
      </div>

      {/* 2. Visual Vitality Rings */}
      <VitalityRings />

      {/* 3. Three Mindful Rituals Row with better visuals */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onStartBreathe}
          className="group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] hover:border-[#6B7A5B]/60 shadow-2xs hover:shadow-sm transition-all overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <GradientBlob className="absolute -top-4 -right-4 w-24 h-24" color1="#6B7A5B" color2="#B85C3B" variant={1} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#EEF2EC] to-[#E0EBD8] flex items-center justify-center text-[#6B7A5B] mb-3 group-hover:scale-110 transition-transform shadow-2xs">
              <Wind className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#1B1A19]">Breathe</span>
            <span className="text-[10px] text-[#8F877F] mt-0.5">Guided reset</span>
          </div>
        </button>

        <button
          onClick={() => openUnstuckWithState()}
          className="group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-[#F8EDE8]/60 to-[#FFFFFF] border border-[#E7E1DA] hover:border-[#B85C3B]/50 shadow-2xs hover:shadow-sm transition-all overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <GradientBlob className="absolute -bottom-4 -left-4 w-24 h-24" color1="#B85C3B" color2="#E7E1DA" variant={2} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F8EDE8] to-[#F2DACE] flex items-center justify-center text-[#B85C3B] mb-3 group-hover:scale-110 transition-transform shadow-2xs">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#9A420E]">Get Unstuck</span>
            <span className="text-[10px] text-[#8F877F] mt-0.5">Instant relief</span>
          </div>
        </button>

        <button
          onClick={onStartReflect}
          className="group relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] hover:border-[#B85C3B]/40 shadow-2xs hover:shadow-sm transition-all overflow-hidden"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <GradientBlob className="absolute -top-4 -left-4 w-24 h-24" color1="#B85C3B" color2="#6B7A5B" variant={3} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F8EDE8] to-[#F2DACE] flex items-center justify-center text-[#B85C3B] mb-3 group-hover:scale-110 transition-transform shadow-2xs">
              <Heart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#1B1A19]">Reflect</span>
            <span className="text-[10px] text-[#8F877F] mt-0.5">Gratitude</span>
          </div>
        </button>
      </div>

      {/* 3b. Active Guided Journey (Mentor, Coach & Trainer Programme) */}
      <ActiveJourneyCard
        onOpenJourneys={onOpenJourneys}
        onOpenDay={onOpenDay}
      />

      {/* Organic leaf divider */}
      <LeafDivider className="px-8 sm:px-16" />

      {/* 4. The Daily Anchor (Proof Action Hero Card) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8EDE8] via-[#FFFFFF] to-[#F2E2DA] border border-[#E7E1DA] p-6 sm:p-8 shadow-sm">
        {/* Decorative corner */}
        <div className="absolute -bottom-6 -right-6 opacity-20 pointer-events-none">
          <LotusMotif className="w-28 h-28" color="#B85C3B" />
        </div>

        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#B85C3B] flex items-center justify-center shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85C3B]">
                  Today's #1 Proof Action
                </span>
              </div>
            </div>

            {proofGoal && (
              <span className="text-[11px] text-[#78716C] bg-[#FFFFFF]/80 px-2.5 py-1 rounded-full border border-[#E7E1DA] flex items-center gap-1.5 shadow-2xs">
                <Target className="w-3 h-3 text-[#B85C3B]" />
                <span className="truncate max-w-[140px]">{proofGoal.title}</span>
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
                    <ArrowRight className="w-3.5 h-3.5 text-[#8F877F]" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <LotusMotif className="w-12 h-12 mx-auto" color="#B85C3B" />
              <p className="text-sm font-semibold text-[#1B1A19]">No primary anchor set for today.</p>
              <p className="text-xs text-[#78716C]">Set your most important action to anchor your day</p>
              <button
                onClick={() => setIsQuickCaptureOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#B85C3B] hover:bg-[#A04F32] text-[#FFFFFF] text-xs font-semibold shadow-xs transition-all active:scale-95"
              >
                Add Today's Anchor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Modern Interactive Task Flow & Scratchpad */}
      <InteractiveTaskScratchpad />

      {/* Bottom organic wave */}
      <div className="pt-2">
        <WaveMotif className="w-full h-8 opacity-40" color="#E7E1DA" />
      </div>
    </div>
  );
};
