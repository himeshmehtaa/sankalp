import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GuidedJourney, JourneyDay, JourneyDayStatus } from '../../types/journeys';
import {
  Compass,
  Calendar,
  Sparkles,
  FileText,
  Upload,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Flame,
  Layers,
  Search,
  Filter,
  Award,
  ChevronRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
} from 'lucide-react';
import { LotusMotif, GradientBlob, LeafMotif } from '../brand/Illustrations';
import { UploadProgrammeModal } from './UploadProgrammeModal';
import { SourceDocumentModal } from './SourceDocumentModal';
import { JourneyAIAssistant } from './JourneyAIAssistant';
import { JourneyProgressReviewModal } from './JourneyProgressReviewModal';
import { JourneyDayView } from './JourneyDayView';

export const GuidedJourneysView: React.FC = () => {
  const {
    journeys,
    activeJourneyId,
    setActiveJourneyId,
    activeJourneyDayId,
    setActiveJourneyDayId,
  } = useApp();

  const journey = journeys.find((j) => j.id === activeJourneyId) || journeys[0];

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isSourceDocOpen, setIsSourceDocOpen] = useState(false);
  const [sourceHighlightDay, setSourceHighlightDay] = useState<number | undefined>(undefined);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // View mode: 'timeline' | 'phases' | 'calendar'
  const [viewMode, setViewMode] = useState<'timeline' | 'phases' | 'calendar'>('timeline');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | JourneyDayStatus>('all');

  if (!journey) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <Compass className="w-12 h-12 mx-auto text-[#B85C3B]" />
        <h2 className="text-xl font-bold text-[#1B1A19]">No Guided Journeys active</h2>
        <p className="text-xs text-[#78716C]">
          Upload a programme document from your coach or mentor to begin.
        </p>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#1B1A19] text-white text-xs font-semibold"
        >
          Upload Programme
        </button>
      </div>
    );
  }

  // If a specific day is selected, render the dedicated JourneyDayView
  const selectedDay = journey.days.find((d) => d.id === activeJourneyDayId);
  if (selectedDay) {
    return (
      <>
        <JourneyDayView
          journey={journey}
          day={selectedDay}
          onBack={() => setActiveJourneyDayId(null)}
          onSelectDay={(dayId) => setActiveJourneyDayId(dayId)}
          onOpenSourceDoc={(dayNum) => {
            setSourceHighlightDay(dayNum);
            setIsSourceDocOpen(true);
          }}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        <SourceDocumentModal
          isOpen={isSourceDocOpen}
          onClose={() => setIsSourceDocOpen(false)}
          journey={journey}
          highlightDayNumber={sourceHighlightDay}
        />

        <JourneyAIAssistant
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          journey={journey}
          currentDay={selectedDay}
        />
      </>
    );
  }

  // Metrics
  const completedDaysCount = journey.days.filter((d) => d.status === 'completed').length;
  const progressPct = Math.round((completedDaysCount / journey.durationDays) * 100);
  const remainingDays = journey.durationDays - completedDaysCount;

  // Filtered days
  const filteredDays = journey.days.filter((d) => {
    const matchesSearch =
      searchQuery.trim().length === 0 ||
      d.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.sections.some((s) => s.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-7 pb-20 animate-in fade-in duration-300">
      {/* 1. Programme Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F4] to-[#F8EDE8]/50 border border-[#E7E1DA] p-6 sm:p-8 shadow-xs">
        <div className="absolute -top-10 -right-10 opacity-15 pointer-events-none">
          <LotusMotif className="w-40 h-40" color="#B85C3B" />
        </div>

        <div className="relative z-10 space-y-5">
          {/* Top metadata tags */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#F8EDE8] text-[#B85C3B] border border-[#B85C3B]/20">
                GUIDED JOURNEY
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white text-[#78716C] border border-[#E7E1DA]">
                {journey.category}
              </span>
            </div>

            {/* Programme Switcher if multiple */}
            {journeys.length > 1 && (
              <select
                value={journey.id}
                onChange={(e) => {
                  setActiveJourneyId(e.target.value);
                  setActiveJourneyDayId(null);
                }}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#E7E1DA] text-xs font-semibold text-[#1B1A19]"
              >
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Title & Mentor Attribution */}
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1B1A19] tracking-tight font-editorial">
              {journey.title}
            </h1>
            <p className="text-sm sm:text-base text-[#57534E] italic font-editorial">
              "{journey.tagline}"
            </p>
            <p className="text-xs text-[#78716C] pt-1">
              Mentor / Coach: <strong className="text-[#1B1A19]">{journey.mentorName}</strong> • Window: {journey.startDate} to {journey.endDate} ({journey.durationDays} Days)
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={() => {
                setSourceHighlightDay(undefined);
                setIsSourceDocOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E] transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>Original Source Document</span>
            </button>

            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>AI Programme Assistant</span>
            </button>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E] transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-[#6B7A5B]" />
              <span>Progress & Evidence Audit</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>Upload New Programme</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Progress Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
            Days Completed
          </span>
          <p className="text-xl sm:text-2xl font-bold text-[#1B1A19]">
            {completedDaysCount}{' '}
            <span className="text-xs font-normal text-[#78716C]">/ {journey.durationDays}</span>
          </p>
          <div className="w-full bg-[#E7E1DA]/60 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[#B85C3B] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
            Current Arc
          </span>
          <p className="text-sm sm:text-base font-bold text-[#1B1A19] truncate">
            {journey.phases[0]?.title || 'Foundation'}
          </p>
          <span className="text-[11px] text-[#6B7A5B] font-semibold">
            {journey.phases[0]?.dateRange || 'In rhythm'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
            Days Remaining
          </span>
          <p className="text-xl sm:text-2xl font-bold text-[#1B1A19]">{remainingDays}</p>
          <span className="text-[11px] text-[#78716C]">Until 11 Nov review</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] shadow-2xs space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716C]">
            Status
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6B7A5B] animate-pulse" />
            <span className="text-sm font-bold text-[#1B1A19] capitalize">{journey.status}</span>
          </div>
          <span className="text-[10px] text-[#78716C]">Client Edition</span>
        </div>
      </div>

      {/* 3. Mentor Rules Banner */}
      {journey.importantRule && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#F8EDE8] via-white to-[#FAF8F4] border border-[#B85C3B]/20 flex items-start gap-3 shadow-2xs">
          <Flame className="w-5 h-5 text-[#B85C3B] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85C3B]">
              Mentor's Golden Rule
            </span>
            <p className="text-xs sm:text-sm font-bold text-[#1B1A19] leading-relaxed">
              {journey.importantRule}
            </p>
            {journey.continuationRule && (
              <p className="text-xs text-[#57534E] pt-1">
                {journey.continuationRule}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 4. Controls: View Toggle, Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#E7E1DA] shadow-2xs">
        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-[#FAF8F4] p-1 rounded-xl border border-[#E7E1DA]">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'timeline'
                ? 'bg-white text-[#1B1A19] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1B1A19]'
            }`}
          >
            Timeline View
          </button>
          <button
            onClick={() => setViewMode('phases')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'phases'
                ? 'bg-white text-[#1B1A19] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1B1A19]'
            }`}
          >
            Phases Arc
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-[#1B1A19] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1B1A19]'
            }`}
          >
            Calendar
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#8F877F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search days or themes..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#B85C3B] w-40 sm:w-48"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs font-medium text-[#1B1A19]"
          >
            <option value="all">All States</option>
            <option value="today">Today</option>
            <option value="completed">Completed</option>
            <option value="in_progress">In Progress</option>
            <option value="upcoming">Upcoming</option>
            <option value="skipped">Skipped</option>
          </select>
        </div>
      </div>

      {/* 5. Main Content by View Mode */}
      {viewMode === 'timeline' && (
        <div className="space-y-6">
          {journey.phases.map((phase) => {
            const phaseDays = filteredDays.filter((d) => d.phaseId === phase.id);
            if (phaseDays.length === 0) return null;

            return (
              <div key={phase.id} className="space-y-3">
                {/* Phase Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E7E1DA]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#B85C3B] uppercase tracking-wider">
                      Phase {phase.phaseNumber}
                    </span>
                    <h3 className="text-sm font-bold text-[#1B1A19]">
                      — {phase.title}
                    </h3>
                  </div>
                  <span className="text-xs text-[#78716C]">{phase.dateRange}</span>
                </div>

                {/* Day Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {phaseDays.map((day) => {
                    const isToday = day.status === 'today';
                    const isCompleted = day.status === 'completed';
                    const isSkipped = day.status === 'skipped';
                    const workSec = day.sections.find((s) => s.type === 'work');

                    return (
                      <div
                        key={day.id}
                        onClick={() => setActiveJourneyDayId(day.id)}
                        className={`group relative rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-md ${
                          isToday
                            ? 'bg-gradient-to-br from-white to-[#F8EDE8]/50 border-[#B85C3B] ring-2 ring-[#B85C3B]/20 shadow-sm'
                            : isCompleted
                            ? 'bg-white border-[#6B7A5B]/30 hover:border-[#6B7A5B]'
                            : isSkipped
                            ? 'bg-[#F9F9F8] border-[#E7E1DA] opacity-75'
                            : 'bg-white border-[#E7E1DA] hover:border-[#B85C3B]/40'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs font-bold ${
                                  isToday ? 'text-[#B85C3B]' : 'text-[#1B1A19]'
                                }`}
                              >
                                DAY {String(day.dayNumber).padStart(2, '0')}
                              </span>
                              <span className="text-[11px] text-[#78716C]">
                                • {day.dateString}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {day.isBookmarked && (
                                <BookmarkCheck className="w-3.5 h-3.5 text-[#B85C3B]" />
                              )}
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  isCompleted
                                    ? 'bg-[#EEF2EC] text-[#6B7A5B]'
                                    : isToday
                                    ? 'bg-[#B85C3B] text-white'
                                    : isSkipped
                                    ? 'bg-[#F5F5F4] text-[#78716C]'
                                    : 'bg-[#FAF8F4] text-[#78716C] border border-[#E7E1DA]'
                                }`}
                              >
                                {day.status === 'in_progress' ? 'In Progress' : day.status}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <h4 className="text-sm font-bold text-[#1B1A19] group-hover:text-[#B85C3B] transition-colors">
                              "{day.theme}"
                            </h4>
                            {workSec && (
                              <p className="text-xs text-[#57534E] line-clamp-2 leading-relaxed">
                                {workSec.content}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#E7E1DA]/60 text-[11px]">
                            <span className="text-[#78716C]">
                              {day.sections.length} Mentor Sections
                            </span>
                            <span className="font-semibold text-[#B85C3B] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                              <span>Open Day</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === 'phases' && (
        <div className="space-y-6">
          {journey.phases.map((phase) => (
            <div
              key={phase.id}
              className="p-6 rounded-3xl bg-white border border-[#E7E1DA] shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E7E1DA] pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C3B]">
                    Phase {phase.phaseNumber} • Days {phase.startDay}–{phase.endDay}
                  </span>
                  <h3 className="text-lg font-bold text-[#1B1A19]">{phase.title}</h3>
                </div>
                <span className="text-xs text-[#78716C] font-semibold">{phase.dateRange}</span>
              </div>

              {phase.description && (
                <p className="text-xs text-[#57534E] leading-relaxed italic">
                  "{phase.description}"
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
                {journey.days
                  .filter((d) => d.phaseId === phase.id)
                  .map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setActiveJourneyDayId(d.id)}
                      className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] hover:border-[#B85C3B] text-left transition-all"
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-[#B85C3B]">
                          Day {String(d.dayNumber).padStart(2, '0')}
                        </span>
                        <span className="text-[#78716C] text-[10px]">{d.status}</span>
                      </div>
                      <p className="text-xs font-semibold text-[#1B1A19] line-clamp-1">
                        {d.theme}
                      </p>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'calendar' && (
        <div className="p-6 rounded-3xl bg-white border border-[#E7E1DA] shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E1DA] pb-3">
            <div>
              <h3 className="text-sm font-bold text-[#1B1A19]">14-Day Calendar Matrix</h3>
              <p className="text-xs text-[#78716C]">
                {journey.startDate} to {journey.endDate}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {journey.days.map((day) => {
              const isToday = day.status === 'today';
              const isCompleted = day.status === 'completed';

              return (
                <button
                  key={day.id}
                  onClick={() => setActiveJourneyDayId(day.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all hover:scale-102 ${
                    isToday
                      ? 'bg-[#F8EDE8] border-[#B85C3B] shadow-xs'
                      : isCompleted
                      ? 'bg-[#EEF2EC]/60 border-[#6B7A5B]/40'
                      : 'bg-[#FAF8F4] border-[#E7E1DA] hover:border-[#B85C3B]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] mb-1.5">
                    <span className="font-bold text-[#1B1A19]">
                      Day {String(day.dayNumber).padStart(2, '0')}
                    </span>
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6B7A5B]" />
                    ) : isToday ? (
                      <span className="w-2 h-2 rounded-full bg-[#B85C3B]" />
                    ) : null}
                  </div>
                  <p className="text-[10px] text-[#78716C] line-clamp-1 mb-1">
                    {day.dateString}
                  </p>
                  <p className="text-xs font-bold text-[#1B1A19] line-clamp-2">
                    {day.theme}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <UploadProgrammeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onProgrammeCreated={(newJourney) => {
          setActiveJourneyId(newJourney.id);
          setActiveJourneyDayId(null);
        }}
      />

      {/* Source Document Modal */}
      <SourceDocumentModal
        isOpen={isSourceDocOpen}
        onClose={() => setIsSourceDocOpen(false)}
        journey={journey}
        highlightDayNumber={sourceHighlightDay}
      />

      {/* AI Assistant Modal */}
      <JourneyAIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        journey={journey}
      />

      {/* Progress & Review Modal */}
      <JourneyProgressReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        journey={journey}
      />
    </div>
  );
};
