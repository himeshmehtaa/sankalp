import React, { useState } from 'react';
import { GuidedJourney } from '../../types/journeys';
import { X, Search, FileText, ExternalLink, Copy, Check, BookOpen } from 'lucide-react';
import { SankalpSymbol } from '../brand/SankalpLogo';

interface SourceDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  journey: GuidedJourney;
  highlightDayNumber?: number;
}

export const SourceDocumentModal: React.FC<SourceDocumentModalProps> = ({
  isOpen,
  onClose,
  journey,
  highlightDayNumber,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    navigator.clipboard.writeText(journey.sourceRawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJumpToDay = (dayNum: number) => {
    const el = document.getElementById(`doc-day-${dayNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Split lines and render with highlight
  const rawText = journey.sourceRawText;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A19]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E1DA] bg-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F8EDE8] text-[#B85C3B] flex items-center justify-center border border-[#B85C3B]/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C3B]">
                  SOURCE OF TRUTH
                </span>
                <span className="text-[10px] text-[#78716C] bg-[#FAF8F4] px-2 py-0.5 rounded-full border border-[#E7E1DA]">
                  {journey.sourceFileName}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-[#1B1A19]">
                Original Mentor Programme Document
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-medium text-[#57534E] transition-colors"
              title="Copy original text"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#6B7A5B]" />
                  <span className="text-[#6B7A5B]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1B1A19] hover:bg-[#FAF8F4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick jump day selector */}
        <div className="px-6 py-2.5 bg-[#FAF8F4] border-b border-[#E7E1DA] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-[#78716C] shrink-0">Jump to Day:</span>
          {journey.days.map((d) => (
            <button
              key={d.id}
              onClick={() => handleJumpToDay(d.dayNumber)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                highlightDayNumber === d.dayNumber
                  ? 'bg-[#B85C3B] text-white shadow-2xs'
                  : 'bg-white hover:bg-[#F2ECE6] text-[#57534E] border border-[#E7E1DA]'
              }`}
            >
              Day {String(d.dayNumber).padStart(2, '0')}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-6 py-2 bg-white/60 border-b border-[#E7E1DA]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8F877F] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mentor's instructions, themes, or rules..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-white border border-[#E7E1DA] text-xs text-[#1B1A19] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#B85C3B]"
            />
          </div>
        </div>

        {/* Verbatim Document Reader */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 font-mono text-xs sm:text-sm text-[#292524] leading-relaxed bg-[#FAF8F4]">
          {/* Note Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] font-sans space-y-1 text-xs">
            <p className="font-bold text-[#1B1A19]">
              Mentor: {journey.mentorName} • Dates: {journey.startDate} to {journey.endDate}
            </p>
            <p className="text-[#57534E]">
              This text is preserved verbatim from the uploaded document. SANKALP uses this exact
              content to guide your daily actions.
            </p>
          </div>

          <div className="whitespace-pre-wrap font-sans leading-relaxed text-[#1B1A19] space-y-4">
            {rawText.split('\n\n').map((paragraph, pIdx) => {
              // Check if paragraph is a day header
              const dayHeaderMatch = paragraph.match(/DAY\s+(\d\d?)/i);
              const dayNum = dayHeaderMatch ? parseInt(dayHeaderMatch[1], 10) : null;
              const isHighlighted = highlightDayNumber && dayNum === highlightDayNumber;

              if (dayNum) {
                return (
                  <div
                    key={pIdx}
                    id={`doc-day-${dayNum}`}
                    className={`p-4 rounded-2xl border transition-all ${
                      isHighlighted
                        ? 'bg-[#FDF6F0] border-[#B85C3B] shadow-sm'
                        : 'bg-white border-[#E7E1DA]'
                    }`}
                  >
                    <p className="font-mono text-xs font-bold text-[#B85C3B] uppercase tracking-wider mb-2">
                      Source Section Anchor: Day {String(dayNum).padStart(2, '0')}
                    </p>
                    <div className="text-sm font-medium text-[#1B1A19] leading-relaxed">
                      {paragraph}
                    </div>
                  </div>
                );
              }

              // Normal paragraphs
              const hasMatch =
                searchQuery.trim().length > 0 &&
                paragraph.toLowerCase().includes(searchQuery.toLowerCase());

              return (
                <p
                  key={pIdx}
                  className={`leading-relaxed ${
                    hasMatch ? 'bg-[#FDF3C7] p-2 rounded-lg' : 'text-[#292524]'
                  }`}
                >
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#E7E1DA] bg-white flex items-center justify-between">
          <span className="text-[11px] text-[#78716C]">
            Source: {journey.sourceFileName} ({journey.sourceRawText.length} characters)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1B1A19] text-white hover:bg-[#2B2927] text-xs font-semibold transition-colors"
          >
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};
