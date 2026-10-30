import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GuidedJourney, JourneyDay, JourneyDayStatus } from '../../types/journeys';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  FileText,
  Play,
  Flame,
  Send,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Compass,
} from 'lucide-react';
import { LotusMotif, GradientBlob } from '../brand/Illustrations';

interface JourneyDayViewProps {
  journey: GuidedJourney;
  day: JourneyDay;
  onBack: () => void;
  onSelectDay: (dayId: string) => void;
  onOpenSourceDoc: (dayNumber: number) => void;
  onOpenAIAssistant: (day: JourneyDay) => void;
}

export const JourneyDayView: React.FC<JourneyDayViewProps> = ({
  journey,
  day,
  onBack,
  onSelectDay,
  onOpenSourceDoc,
  onOpenAIAssistant,
}) => {
  const {
    toggleJourneyDayActivity,
    updateJourneyDayReflection,
    updateJourneyDayProof,
    updateJourneyDayNotes,
    markJourneyDayStatus,
    toggleJourneyDayMinimum,
    toggleJourneyDayBookmark,
    syncJourneyActivityToDailyTasks,
    startFocusSession,
  } = useApp();

  // Find previous and next days
  const currentIndex = journey.days.findIndex((d) => d.id === day.id);
  const prevDay = currentIndex > 0 ? journey.days[currentIndex - 1] : null;
  const nextDay = currentIndex < journey.days.length - 1 ? journey.days[currentIndex + 1] : null;

  // Local inputs synced with day properties
  const [reflectionText, setReflectionText] = useState(
    day.reflectionResponse ||
      'Today I completed ___ ; when worry/hesitation showed up I ___ ; first step tomorrow ___ .'
  );
  const [proofText, setProofText] = useState(day.proofSubmitted || '');
  const [userNotes, setUserNotes] = useState(day.userNotes || '');
  const [skipReasonModalOpen, setSkipReasonModalOpen] = useState(false);
  const [skipReasonInput, setSkipReasonInput] = useState('');

  const handleSaveReflection = () => {
    updateJourneyDayReflection(journey.id, day.id, reflectionText);
  };

  const handleSaveProof = () => {
    updateJourneyDayProof(journey.id, day.id, proofText);
  };

  const handleSaveNotes = () => {
    updateJourneyDayNotes(journey.id, day.id, userNotes);
  };

  const workSection = day.sections.find((s) => s.type === 'work');

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-[#E7E1DA] pb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E] hover:text-[#1B1A19] shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#B85C3B]" />
          <span>Programme Overview</span>
        </button>

        {/* Previous / Next Day Quick Stepper */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => prevDay && onSelectDay(prevDay.id)}
            disabled={!prevDay}
            className="p-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] disabled:opacity-30 text-[#57534E] transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-[#1B1A19]">
            Day {String(day.dayNumber).padStart(2, '0')} of {journey.durationDays}
          </span>

          <button
            onClick={() => nextDay && onSelectDay(nextDay.id)}
            disabled={!nextDay}
            className="p-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] disabled:opacity-30 text-[#57534E] transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Day Header Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F4] to-[#F8EDE8]/50 border border-[#E7E1DA] p-6 sm:p-8 shadow-xs">
        <div className="absolute -bottom-8 -right-8 opacity-20 pointer-events-none">
          <LotusMotif className="w-32 h-32" color="#B85C3B" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85C3B] bg-[#F8EDE8] px-2.5 py-1 rounded-full border border-[#B85C3B]/20">
                {journey.title}
              </span>
              <span className="text-xs text-[#78716C]">• {day.dateString}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleJourneyDayBookmark(journey.id, day.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  day.isBookmarked
                    ? 'bg-[#B85C3B] text-white border-[#B85C3B]'
                    : 'bg-white text-[#78716C] border-[#E7E1DA] hover:text-[#1B1A19]'
                }`}
                title={day.isBookmarked ? 'Bookmarked' : 'Bookmark this day'}
              >
                {day.isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => onOpenSourceDoc(day.dayNumber)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E] transition-colors"
                title="View verbatim mentor source section"
              >
                <FileText className="w-3.5 h-3.5 text-[#B85C3B]" />
                <span className="hidden sm:inline">Source Reference</span>
              </button>

              <button
                onClick={() => onOpenAIAssistant(day)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B85C3B]" />
                <span>Ask AI</span>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#B85C3B] text-white shadow-2xs">
                {day.dayLabel || `D${day.dayNumber}`}
              </span>
              <span className="text-sm font-bold text-[#1B1A19]">
                Day {String(day.dayNumber).padStart(2, '0')}
              </span>
              <span
                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                  day.status === 'completed'
                    ? 'bg-[#EEF2EC] text-[#6B7A5B] border border-[#6B7A5B]/30'
                    : day.status === 'today'
                    ? 'bg-[#F8EDE8] text-[#B85C3B] border border-[#B85C3B]/30'
                    : day.status === 'skipped'
                    ? 'bg-[#F5F5F4] text-[#78716C] border border-[#E7E1DA]'
                    : 'bg-white text-[#78716C] border border-[#E7E1DA]'
                }`}
              >
                {day.status === 'in_progress' ? 'In Progress' : day.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#1B1A19] tracking-tight font-editorial">
              "{day.theme}"
            </h1>
          </div>

          {/* Minimum Day Toggle Bar */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-2xl bg-white border border-[#E7E1DA]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#B85C3B]" />
              <span className="text-xs text-[#1B1A19] font-medium">
                {day.isMinimumDayUsed
                  ? 'Minimum Day active (11.5m: 1m breath + 10m task + 30s note)'
                  : 'Feeling overwhelmed or heavy office day?'}
              </span>
            </div>

            <button
              onClick={() => toggleJourneyDayMinimum(journey.id, day.id)}
              className="text-xs font-bold text-[#B85C3B] hover:underline self-start sm:self-auto"
            >
              {day.isMinimumDayUsed ? 'Switch to Full Programme' : 'Switch to Minimum Day'}
            </button>
          </div>
        </div>
      </div>

      {/* Mentor Instructions & Checklist Sections */}
      <div className="space-y-5">
        {day.sections.map((section) => {
          const isWorkBlock = section.type === 'work';
          const isMorning = section.type === 'morning';
          const isPattern = section.type === 'pattern';
          const isEvening = section.type === 'evening';
          const isProof = section.type === 'proof';

          return (
            <div
              key={section.id}
              className={`rounded-3xl border p-6 sm:p-7 space-y-4 transition-all shadow-2xs ${
                isWorkBlock
                  ? 'bg-gradient-to-br from-white via-[#FAF8F4] to-[#F8EDE8]/30 border-[#B85C3B]/30'
                  : 'bg-white border-[#E7E1DA]'
              }`}
            >
              {/* Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E7E1DA]/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isWorkBlock
                        ? 'bg-[#B85C3B]'
                        : isMorning
                        ? 'bg-[#6B7A5B]'
                        : isPattern
                        ? 'bg-[#D97706]'
                        : 'bg-[#78716C]'
                    }`}
                  />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-[#1B1A19]">
                      {section.title}
                    </h3>
                    {section.subtitle && (
                      <p className="text-[11px] text-[#78716C]">{section.subtitle}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {section.durationBadge && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF8F4] text-[#57534E] border border-[#E7E1DA]">
                      {section.durationBadge}
                    </span>
                  )}
                  {isWorkBlock && (
                    <button
                      onClick={() =>
                        syncJourneyActivityToDailyTasks(day.theme, day.dayNumber)
                      }
                      className="text-[11px] font-semibold text-[#B85C3B] hover:underline flex items-center gap-1"
                      title="Sync this deliverable to today's sanctuary tasks"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Sync to Tasks</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Verbatim Mentor Instructions Block */}
              <div className="p-4 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs sm:text-sm text-[#292524] leading-relaxed whitespace-pre-wrap font-sans">
                {section.content}
              </div>

              {/* Action Trigger for Work Block */}
              {isWorkBlock && (
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() =>
                      startFocusSession(
                        {
                          id: `focus-journey-${day.id}`,
                          title: `[Day ${day.dayNumber}] ${day.theme}`,
                          bucket: 'today',
                          priority: 'proof',
                          status: 'in_progress',
                          subtasks: [],
                          createdAt: new Date().toISOString(),
                        },
                        25
                      )
                    }
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 text-[#B85C3B] fill-current" />
                    <span>Begin 25-Min Focus Sanctuary</span>
                  </button>

                  <span className="text-[11px] text-[#78716C] italic">
                    Output before Notion. Deliverable first.
                  </span>
                </div>
              )}

              {/* Interactive Checklist Items */}
              {section.checklist.length > 0 && (
                <div className="space-y-2 pt-1">
                  {section.checklist.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleJourneyDayActivity(journey.id, day.id, item.id)}
                      className={`flex items-start gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                        item.completed
                          ? 'bg-[#EEF2EC]/40 border-[#6B7A5B]/30'
                          : 'bg-white border-[#E7E1DA] hover:border-[#B85C3B]/40'
                      }`}
                    >
                      <button className="mt-0.5 shrink-0 text-[#78716C]">
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-[#6B7A5B] fill-[#EEF2EC]" />
                        ) : (
                          <Circle className="w-5 h-5 text-[#A8A29E] hover:text-[#B85C3B]" />
                        )}
                      </button>

                      <div className="flex-1 text-xs">
                        <span
                          className={`font-medium ${
                            item.completed ? 'line-through text-[#78716C]' : 'text-[#1B1A19]'
                          }`}
                        >
                          {item.text}
                        </span>
                        {item.durationEstimate && (
                          <span className="ml-2 text-[10px] text-[#78716C]">
                            ({item.durationEstimate})
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Evening Reflection Interactive Box */}
              {isEvening && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#1B1A19] block">
                    Your One-Line Evening Reflection (90 Seconds):
                  </label>
                  <textarea
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    onBlur={handleSaveReflection}
                    rows={2}
                    className="w-full p-3 rounded-xl bg-white border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                    placeholder="Today I completed ___ ; when worry appeared I ___ ; first step tomorrow ___"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#78716C]">
                      Auto-saves on blur or tap Save
                    </span>
                    <button
                      onClick={handleSaveReflection}
                      className="px-3 py-1 rounded-lg bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E]"
                    >
                      Save Reflection
                    </button>
                  </div>
                </div>
              )}

              {/* Proof Deliverable Input Box */}
              {isProof && (
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-[#1B1A19] block">
                    Record Your Proof of Completion:
                  </label>
                  <input
                    type="text"
                    value={proofText}
                    onChange={(e) => setProofText(e.target.value)}
                    onBlur={handleSaveProof}
                    placeholder="e.g. Saved updated Figma layout (1 section finished and committed)"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#78716C]">
                      Tangible deliverable or note for review
                    </span>
                    <button
                      onClick={handleSaveProof}
                      className="px-3 py-1 rounded-lg bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E]"
                    >
                      Save Proof
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Personal Notes Box */}
        <div className="rounded-3xl bg-white border border-[#E7E1DA] p-6 space-y-3 shadow-2xs">
          <h4 className="text-sm font-bold text-[#1B1A19]">Personal Day Notes (Optional)</h4>
          <textarea
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            onBlur={handleSaveNotes}
            rows={2}
            placeholder="Add personal observations, thoughts, or reminders..."
            className="w-full p-3 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              className="px-3 py-1 rounded-lg bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E]"
            >
              Save Notes
            </button>
          </div>
        </div>
      </div>

      {/* Completion & Skip Action Sticky Bar */}
      <div className="sticky bottom-4 z-20 rounded-2xl bg-white/95 backdrop-blur-md border border-[#E7E1DA] p-4 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {day.status === 'completed' ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#6B7A5B]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Day Completed!</span>
            </span>
          ) : (
            <span className="text-xs font-semibold text-[#78716C]">
              Finish today's outputs to complete Day {day.dayNumber}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {day.status !== 'completed' ? (
            <button
              onClick={() => markJourneyDayStatus(journey.id, day.id, 'completed')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>Mark Day Complete</span>
            </button>
          ) : (
            <button
              onClick={() => markJourneyDayStatus(journey.id, day.id, 'in_progress')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs font-medium text-[#78716C] hover:text-[#1B1A19]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reopen Day</span>
            </button>
          )}

          <button
            onClick={() => setSkipReasonModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-medium text-[#78716C] hover:text-[#1B1A19]"
          >
            Skip Day
          </button>
        </div>
      </div>

      {/* Skip Day Modal */}
      {skipReasonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#1B1A19]/40 backdrop-blur-xs"
            onClick={() => setSkipReasonModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white border border-[#E7E1DA] rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <h3 className="text-sm font-bold text-[#1B1A19]">Skip Day {day.dayNumber} Gently</h3>
            <p className="text-xs text-[#57534E] leading-relaxed">
              Your mentor's rule: "Never catch up by doubling tomorrow's work. If today's practice passed, begin with the next useful task." Skipping does not mark the programme as failed.
            </p>
            <input
              type="text"
              value={skipReasonInput}
              onChange={(e) => setSkipReasonInput(e.target.value)}
              placeholder="Optional reason (e.g. Travel, illness, emergency)"
              className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19]"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSkipReasonModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  markJourneyDayStatus(journey.id, day.id, 'skipped', skipReasonInput);
                  setSkipReasonModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-[#1B1A19] text-white text-xs font-semibold"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
