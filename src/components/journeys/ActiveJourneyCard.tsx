import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Flame,
  ChevronRight,
  Zap,
  Upload,
} from 'lucide-react';
import { LotusMotif, GradientBlob } from '../brand/Illustrations';

interface ActiveJourneyCardProps {
  onOpenJourneys: () => void;
  onOpenDay: (dayId: string) => void;
}

export const ActiveJourneyCard: React.FC<ActiveJourneyCardProps> = ({
  onOpenJourneys,
  onOpenDay,
}) => {
  const {
    journeys,
    activeJourneyId,
    toggleJourneyDayMinimum,
    startFocusSession,
    setIsJourneyUploadOpen,
  } = useApp();

  const journey = journeys.find((j) => j.id === activeJourneyId) || journeys[0];

  if (!journey) return null;

  // Find today's day (or the first in_progress or today day)
  const todayDay =
    journey.days.find((d) => d.status === 'today') ||
    journey.days.find((d) => d.status === 'in_progress') ||
    journey.days.find((d) => d.dayNumber === journey.currentDayNumber) ||
    journey.days[0];

  const completedDaysCount = journey.days.filter((d) => d.status === 'completed').length;
  const progressPct = Math.round((completedDaysCount / journey.durationDays) * 100);

  // Extract today's primary work instruction
  const workSection = todayDay?.sections.find((s) => s.type === 'work');
  const morningSection = todayDay?.sections.find((s) => s.type === 'morning');
  const workInstruction = workSection?.content || todayDay?.theme;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F4] to-[#F8EDE8]/40 border border-[#E7E1DA] p-6 sm:p-7 shadow-xs hover:shadow-sm transition-all">
      {/* Ambient background decoration */}
      <div className="absolute -top-10 -right-10 opacity-15 pointer-events-none">
        <LotusMotif className="w-36 h-36" color="#B85C3B" />
      </div>

      <div className="relative z-10 space-y-5">
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#B85C3B] text-white flex items-center justify-center shadow-2xs">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#B85C3B]">
                YOUR ACTIVE JOURNEY
              </span>
              <p className="text-[11px] text-[#78716C] italic font-editorial">
                Every day, one step closer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EEF2EC] text-[#6B7A5B] border border-[#6B7A5B]/20">
              <CheckCircle2 className="w-3 h-3" />
              <span>
                {completedDaysCount}/{journey.durationDays} Days Done ({progressPct}%)
              </span>
            </span>

            <button
              onClick={() => setIsJourneyUploadOpen(true)}
              className="text-xs font-bold text-[#B85C3B] hover:text-[#9A420E] flex items-center gap-1 bg-[#F8EDE8] px-2.5 py-1 rounded-full border border-[#B85C3B]/20 transition-colors"
              title="Upload any PDF or Word schedule to convert to Day 1, Day 2"
            >
              <Upload className="w-3 h-3" />
              <span>Upload PDF</span>
            </button>

            <button
              onClick={onOpenJourneys}
              className="text-xs font-semibold text-[#57534E] hover:text-[#B85C3B] flex items-center gap-1 transition-colors"
            >
              <span>Full Arc</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Programme Title & Current Day Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/90 border border-[#E7E1DA]/80 shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E1DA]/60 pb-3">
            <div>
              <p className="text-[11px] font-medium text-[#78716C]">
                {journey.mentorName} • {journey.durationDays} Days
              </p>
              <h3 className="text-base sm:text-lg font-bold text-[#1B1A19] tracking-tight">
                {journey.title}
              </h3>
            </div>

            {todayDay && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F8EDE8] border border-[#B85C3B]/20 text-[#B85C3B] text-xs font-bold self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-[#B85C3B] animate-pulse" />
                <span className="font-extrabold">Day {todayDay.dayNumber}</span>
                <span className="font-normal text-[#78716C]">· {todayDay.dateString}</span>
              </div>
            )}
          </div>

          {/* Today's Theme & Directive */}
          {todayDay && (
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
                    Today's Directive
                  </span>
                  <h4 className="text-sm sm:text-base font-semibold text-[#1B1A19]">
                    "{todayDay.theme}"
                  </h4>
                </div>

                {todayDay.isMinimumDayUsed && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF0E6] text-[#A04F32] border border-[#B85C3B]/30">
                    Minimum Day Active (11.5m)
                  </span>
                )}
              </div>

              {/* Work instruction preview */}
              <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#44403C] leading-relaxed">
                <p className="line-clamp-2">
                  <span className="font-bold text-[#1B1A19]">Do The Work: </span>
                  {workInstruction}
                </p>
              </div>

              {/* Golden rule indicator */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#B85C3B] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#B85C3B]" />
                  <span>Output before organization</span>
                </span>

                <button
                  onClick={() => toggleJourneyDayMinimum(journey.id, todayDay.id)}
                  className="text-[11px] text-[#78716C] hover:text-[#B85C3B] underline underline-offset-2 transition-colors"
                >
                  {todayDay.isMinimumDayUsed
                    ? 'Switch back to Full Day'
                    : 'Heavy day? Switch to Minimum Day (11.5m)'}
                </button>
              </div>
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full bg-[#E7E1DA]/60 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#B85C3B] to-[#6B7A5B] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {todayDay && (
            <button
              onClick={() => onOpenDay(todayDay.id)}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-bold shadow-md active:scale-98 transition-all"
            >
              <span>Continue Day {todayDay.dayNumber} Journey</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B85C3B]" />
            </button>
          )}

          <button
            onClick={() => setIsJourneyUploadOpen(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#F8EDE8] border border-[#B85C3B]/30 hover:bg-[#F2DACE] text-[#B85C3B] text-xs font-bold shadow-2xs transition-colors"
            title="Upload any PDF/DOCX/PPT schedule to convert to Day 1, Day 2..."
          >
            <Upload className="w-3.5 h-3.5 text-[#B85C3B]" />
            <span>Upload PDF / PPT</span>
          </button>

          <button
            onClick={onOpenJourneys}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-[#1B1A19] text-xs font-semibold shadow-2xs transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#78716C]" />
            <span>All {journey.durationDays} Days</span>
          </button>
        </div>
      </div>
    </div>
  );
};
