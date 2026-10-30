import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Upload,
  FileText,
  Presentation,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  FileCode,
  ClipboardPaste,
} from 'lucide-react';
import { LotusMotif } from '../brand/Illustrations';

export const ScheduleConverterCard: React.FC = () => {
  const { openJourneyUpload } = useApp();

  // Tab mode on the card: 'upload' or 'paste'
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedSchedule, setPastedSchedule] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);

  const durationOptions = [7, 14, 21, 30, 60, 90];

  const handleConvertPasted = () => {
    if (!pastedSchedule.trim()) {
      openJourneyUpload('paste', '');
      return;
    }
    openJourneyUpload('paste', pastedSchedule);
  };

  const handleLoadSampleChatGPT = () => {
    const sample = `30-Day High Performance & Focus Schedule

Day 1: Grounding & Baseline Audit
- Morning: 10m breathwork + write 1 core goal
- Work: 40m Deep Work on highest leverage deliverable
- Evening: 1-line evidence review

Day 2: Friction Removal
- Morning: 5m stretch + physical workstation reset
- Work: Complete priority deliverable before checking email
- Evening: Note what resistance showed up

Day 3: Output Over Perfection
- Morning: 4m mindset focus: Done is better than perfect
- Work: Ship one draft end-to-end (35 mins)
- Evening: Document tangible proof

Day 4 to Day 30: Daily Cadence & Review
- Maintain 35-min execution block each day
- Weekly review every 7th day
- Final transformation synthesis on Day 30`;

    setPastedSchedule(sample);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F4] to-[#F8EDE8]/50 border border-[#E7E1DA] p-6 sm:p-8 shadow-xs hover:shadow-sm transition-all">
      {/* Decorative floral watermark */}
      <div className="absolute -bottom-8 -right-8 opacity-20 pointer-events-none">
        <LotusMotif className="w-32 h-32" color="#B85C3B" />
      </div>

      <div className="relative z-10 space-y-5">
        {/* Header Tag & Title */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F8EDE8] text-[#B85C3B] flex items-center justify-center border border-[#B85C3B]/20 shadow-2xs">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85C3B]">
                SCHEDULE CONVERTER
              </span>
              <p className="text-[11px] text-[#78716C] italic font-editorial">
                Convert any document or ChatGPT prompt into Day 1, Day 2 tasks
              </p>
            </div>
          </div>

          {/* Direct Mode Switcher Pills */}
          <div className="flex items-center gap-1 bg-[#FAF8F4] p-1 rounded-full border border-[#E7E1DA]">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-[#1B1A19] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1B1A19]'
              }`}
            >
              <FileText className="w-3 h-3 text-[#B85C3B]" />
              <span>Upload PDF / PPT</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeTab === 'paste'
                  ? 'bg-[#B85C3B] text-white shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1B1A19]'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Paste ChatGPT Schedule</span>
            </button>
          </div>
        </div>

        {/* Headline Description */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B1A19] tracking-tight font-editorial">
            {activeTab === 'upload'
              ? 'Turn your PDF, Word, or PowerPoint into Day 1, Day 2 Tasks'
              : 'Paste your ChatGPT Schedule to Convert into Day 1, Day 2 Tasks'}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-2xl">
            {activeTab === 'upload'
              ? 'Upload a PDF, Word doc, or PowerPoint file. SANKALP will automatically extract the daily instructions and distribute them into interactive Day 1, Day 2, Day 3... cards.'
              : 'Copy your schedule, routine, or challenge from ChatGPT and paste it below. SANKALP formats it into checkable daily tasks with focus timers.'}
          </p>
        </div>

        {/* ================= MODE 1: FILE UPLOAD ================= */}
        {activeTab === 'upload' ? (
          <div
            onClick={() => openJourneyUpload('upload')}
            className="group p-5 sm:p-6 rounded-2xl bg-white/90 border-2 border-dashed border-[#E7E1DA] hover:border-[#B85C3B] cursor-pointer transition-all shadow-2xs hover:shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] group-hover:bg-[#F8EDE8] text-[#78716C] group-hover:text-[#B85C3B] flex items-center justify-center transition-all shadow-2xs shrink-0">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-[#1B1A19] group-hover:text-[#B85C3B] transition-colors">
                    Click to select or drag and drop your PDF / DOCX / PPT file
                  </p>
                  <p className="text-xs text-[#78716C]">
                    Distributes automatically into Day 1, Day 2, Day 3... (7, 14, 21, 30, 60, or 90 days)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab('paste');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-semibold text-[#57534E] transition-colors"
                >
                  Or Paste Text
                </button>

                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-[#1B1A19] group-hover:bg-[#2F2B28] text-white text-xs font-bold shadow-xs shrink-0 flex items-center gap-1.5 transition-all self-start sm:self-auto"
                >
                  <span>Upload & Convert</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B85C3B]" />
                </button>
              </div>
            </div>

            {/* Supported Format Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#E7E1DA]/60">
              <span className="text-[11px] font-semibold text-[#78716C] mr-1">Formats:</span>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#FAF8F4] text-[#44403C] border border-[#E7E1DA] flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#B85C3B]" />
                <span>PDF (.pdf)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#FAF8F4] text-[#44403C] border border-[#E7E1DA] flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#2563EB]" />
                <span>Word (.docx, .doc)</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#FAF8F4] text-[#44403C] border border-[#E7E1DA] flex items-center gap-1">
                <Presentation className="w-3 h-3 text-[#D97706]" />
                <span>PowerPoint (.pptx, .ppt)</span>
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveTab('paste');
                }}
                className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#F8EDE8] text-[#B85C3B] border border-[#B85C3B]/30 hover:bg-[#F2DACE] flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3 text-[#B85C3B]" />
                <span>Click to Paste ChatGPT Schedule</span>
              </button>
            </div>
          </div>
        ) : (
          /* ================= MODE 2: INLINE CHATGPT SCHEDULE PASTE ================= */
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E7E1DA] shadow-2xs space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1B1A19] flex items-center gap-1.5">
                  <ClipboardPaste className="w-3.5 h-3.5 text-[#B85C3B]" />
                  <span>Paste Your ChatGPT Schedule Here:</span>
                </label>
                <button
                  type="button"
                  onClick={handleLoadSampleChatGPT}
                  className="text-[11px] font-semibold text-[#B85C3B] hover:underline"
                >
                  Load 30-Day ChatGPT Example
                </button>
              </div>

              <textarea
                value={pastedSchedule}
                onChange={(e) => setPastedSchedule(e.target.value)}
                placeholder="Paste your daily routine, 30-day challenge, or ChatGPT output here (e.g. Day 1: ... Day 2: ... or daily tasks)..."
                rows={5}
                className="w-full p-4 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#B85C3B] leading-relaxed"
              />
            </div>

            {/* Duration Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-[#E7E1DA]/70">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold text-[#78716C] mr-1">Duration:</span>
                {durationOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDuration(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedDuration === d
                        ? 'bg-[#B85C3B] text-white shadow-2xs'
                        : 'bg-[#FAF8F4] text-[#57534E] border border-[#E7E1DA] hover:border-[#B85C3B]'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1B1A19]"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConvertPasted}
                  disabled={!pastedSchedule.trim()}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] disabled:opacity-40 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#B85C3B]" />
                  <span>Convert into Day 1, Day 2 Tasks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
