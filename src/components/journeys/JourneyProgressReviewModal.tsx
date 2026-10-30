import React, { useState } from 'react';
import { GuidedJourney } from '../../types/journeys';
import {
  X,
  Award,
  CheckCircle2,
  Calendar,
  FileCheck,
  BookOpen,
  ArrowRight,
  Sparkles,
  Flame,
  ShieldCheck,
  HeartHandshake,
} from 'lucide-react';

interface JourneyProgressReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: GuidedJourney;
}

export const JourneyProgressReviewModal: React.FC<JourneyProgressReviewModalProps> = ({
  isOpen,
  onClose,
  journey,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'reflections' | 'closing_audit'>('evidence');

  if (!isOpen) return null;

  const completedDays = journey.days.filter((d) => d.status === 'completed');
  const skippedDays = journey.days.filter((d) => d.status === 'skipped');
  const totalDays = journey.durationDays;
  const completionPercentage = Math.round((completedDays.length / totalDays) * 100);

  // Collect all proof submissions
  const daysWithProof = journey.days.filter((d) => d.proofSubmitted && d.proofSubmitted.trim().length > 0);
  // Collect all reflections written
  const daysWithReflections = journey.days.filter((d) => d.reflectionResponse && d.reflectionResponse.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A19]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E1DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF2EC] text-[#6B7A5B] flex items-center justify-center border border-[#6B7A5B]/20 shadow-2xs">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A5B]">
                AUTHENTIC PROGRESS AUDIT
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1B1A19]">
                Programme Review & Evidence Ledger
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1B1A19] hover:bg-[#FAF8F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mentor's Core Audit Principle */}
        <div className="px-6 py-3 bg-[#FAF8F4] border-b border-[#E7E1DA] flex items-start gap-3">
          <Flame className="w-4 h-4 text-[#B85C3B] shrink-0 mt-0.5" />
          <p className="text-xs text-[#57534E] leading-relaxed">
            <strong className="text-[#1B1A19]">Mentor Guidance: </strong>
            "Review what you actually completed, not whether you felt confident every single day. Evidence over mood."
          </p>
        </div>

        {/* Top Summary Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 bg-white border-b border-[#E7E1DA]">
          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
              Days Completed
            </span>
            <p className="text-xl font-bold text-[#1B1A19]">
              {completedDays.length} <span className="text-xs font-normal text-[#78716C]">/ {totalDays}</span>
            </p>
            <span className="text-[10px] text-[#6B7A5B] font-semibold">{completionPercentage}% done</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
              Proof Recorded
            </span>
            <p className="text-xl font-bold text-[#B85C3B]">{daysWithProof.length}</p>
            <span className="text-[10px] text-[#78716C]">Deliverables saved</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
              Reflections
            </span>
            <p className="text-xl font-bold text-[#1B1A19]">{daysWithReflections.length}</p>
            <span className="text-[10px] text-[#78716C]">Evening logs</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
              Skipped Days
            </span>
            <p className="text-xl font-bold text-[#78716C]">{skippedDays.length}</p>
            <span className="text-[10px] text-[#78716C]">No penalties</span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="px-6 py-2.5 bg-[#FAF8F4] border-b border-[#E7E1DA] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'evidence'
                ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1B1A19]'
            }`}
          >
            Delivered Proof ({daysWithProof.length})
          </button>

          <button
            onClick={() => setActiveTab('reflections')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'reflections'
                ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1B1A19]'
            }`}
          >
            Reflections Log ({daysWithReflections.length})
          </button>

          <button
            onClick={() => setActiveTab('closing_audit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'closing_audit'
                ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                : 'text-[#78716C] hover:text-[#1B1A19]'
            }`}
          >
            End-of-Programme Questions
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              {daysWithProof.length > 0 ? (
                daysWithProof.map((day) => (
                  <div
                    key={day.id}
                    className="p-4 rounded-2xl bg-white border border-[#E7E1DA] space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B85C3B]">
                        Day {String(day.dayNumber).padStart(2, '0')} · {day.dateString}
                      </span>
                      <span className="text-[11px] font-semibold text-[#6B7A5B] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#1B1A19]">"{day.theme}"</p>
                    <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#292524]">
                      <span className="font-bold text-[#78716C] block text-[10px] uppercase">
                        Recorded Proof:
                      </span>
                      <p className="mt-1">{day.proofSubmitted}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2">
                  <FileCheck className="w-10 h-10 mx-auto text-[#A8A29E]" />
                  <p className="text-sm font-semibold text-[#1B1A19]">No proof deliverables recorded yet</p>
                  <p className="text-xs text-[#78716C]">
                    As you complete each day, record your tangible outputs in the Proof Deliverable section.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reflections' && (
            <div className="space-y-3">
              {daysWithReflections.length > 0 ? (
                daysWithReflections.map((day) => (
                  <div
                    key={day.id}
                    className="p-4 rounded-2xl bg-white border border-[#E7E1DA] space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B85C3B]">
                        Day {String(day.dayNumber).padStart(2, '0')} · {day.dateString}
                      </span>
                      <span className="text-[10px] text-[#78716C]">Evening 90s Log</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1B1A19]">"{day.theme}"</p>
                    <div className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#292524] italic">
                      "{day.reflectionResponse}"
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 space-y-2">
                  <BookOpen className="w-10 h-10 mx-auto text-[#A8A29E]" />
                  <p className="text-sm font-semibold text-[#1B1A19]">No reflections logged yet</p>
                  <p className="text-xs text-[#78716C]">
                    Fill in the 90-second evening reflection template each night.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'closing_audit' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] space-y-3">
                <h4 className="text-sm font-bold text-[#1B1A19]">
                  Closing Arc Reflections (For 11 November Review)
                </h4>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  When your 14-day window concludes on Wednesday 11 Nov, sit down with your mentor's final review questions:
                </p>

                <div className="space-y-2.5 pt-2">
                  {[
                    '1. What did I actually complete and send/show?',
                    '2. What changed in how I relate to friction or perfectionism?',
                    '3. What was difficult, and what did I learn when worry appeared?',
                    '4. Which 2 practices (body steadiness, action before Notion) will I keep beyond 11 Nov?',
                    '5. What should my next journey or project focus be?',
                  ].map((q, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs font-medium text-[#1B1A19]"
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E7E1DA] bg-white flex items-center justify-between">
          <span className="text-[11px] text-[#78716C]">
            Grounded in actual logged data • No arbitrary gamification
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2B2927] text-white text-xs font-semibold transition-colors"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
