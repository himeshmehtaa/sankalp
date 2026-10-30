import React from 'react';
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
} from 'lucide-react';
import { LotusMotif, GradientBlob } from '../brand/Illustrations';

export const ScheduleConverterCard: React.FC = () => {
  const { setIsJourneyUploadOpen } = useApp();

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
                Convert any document into Day 1, Day 2 tasks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#57534E] font-medium bg-white px-3 py-1 rounded-full border border-[#E7E1DA] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#6B7A5B]" />
            <span>PDF • Word • PPT • ChatGPT</span>
          </div>
        </div>

        {/* Headline Description */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-[#1B1A19] tracking-tight font-editorial">
            Turn your PDF, Word, or PowerPoint into Day 1, Day 2 Tasks
          </h2>
          <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-2xl">
            Upload any daily schedule, 7/14/30/60/90-day coaching programme, or ChatGPT prompt. SANKALP automatically extracts the plan and formats it into interactive daily cards with checkable tasks and focus timers.
          </p>
        </div>

        {/* Interactive Drop / Upload Trigger Banner */}
        <div
          onClick={() => setIsJourneyUploadOpen(true)}
          className="group p-5 sm:p-6 rounded-2xl bg-white/90 border-2 border-dashed border-[#E7E1DA] hover:border-[#B85C3B] cursor-pointer transition-all shadow-2xs hover:shadow-xs space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] group-hover:bg-[#F8EDE8] text-[#78716C] group-hover:text-[#B85C3B] flex items-center justify-center transition-all shadow-2xs shrink-0">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-bold text-[#1B1A19] group-hover:text-[#B85C3B] transition-colors">
                  Click or drag to upload your PDF / DOCX / PPT file
                </p>
                <p className="text-xs text-[#78716C]">
                  Distribute into Day 1, Day 2, Day 3... (7, 14, 21, 30, 60, or 90 days)
                </p>
              </div>
            </div>

            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-[#1B1A19] group-hover:bg-[#2F2B28] text-white text-xs font-bold shadow-xs shrink-0 flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <span>Upload & Convert</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B85C3B]" />
            </button>
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
            <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#FAF8F4] text-[#44403C] border border-[#E7E1DA] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#6B7A5B]" />
              <span>ChatGPT Schedule Paste</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
