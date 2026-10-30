import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Compass,
  ArrowRight,
  Layers,
  Sliders,
  Plus,
  Trash2,
  Edit2,
  Palette,
  Check,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { ProgrammeCategory, GuidedJourney, JourneyDay } from '../../types/journeys';
import { extractTextFromFile, parseProgrammeText } from '../../utils/programmeParser';
import { resetEntropyJourney } from '../../utils/transformationSeed';

interface UploadProgrammeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProgrammeCreated: (journey: GuidedJourney) => void;
}

export const UploadProgrammeModal: React.FC<UploadProgrammeModalProps> = ({
  isOpen,
  onClose,
  onProgrammeCreated,
}) => {
  const {
    addJourney,
    showToast,
    journeyUploadInitialMode,
    journeyUploadInitialText,
  } = useApp();

  // Step state: 'upload' -> 'designer'
  const [step, setStep] = useState<'upload' | 'designer'>('upload');

  // Input states
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState(journeyUploadInitialText || '');
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste'>(
    journeyUploadInitialMode || 'upload'
  );
  const [rawExtractedText, setRawExtractedText] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (journeyUploadInitialMode) {
        setActiveInputMode(journeyUploadInitialMode);
      }
      if (journeyUploadInitialText) {
        setPastedText(journeyUploadInitialText);
      }
    }
  }, [isOpen, journeyUploadInitialMode, journeyUploadInitialText]);

  // Target duration presets (7, 14, 21, 30, 60, 90, custom)
  const [targetDaysCount, setTargetDaysCount] = useState<number>(30);
  const [themeColor, setThemeColor] = useState<'terracotta' | 'sage' | 'charcoal' | 'amber'>('terracotta');

  // Metadata states
  const [title, setTitle] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [category, setCategory] = useState<ProgrammeCategory>('transformation');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [personalNotes, setPersonalNotes] = useState('');

  // Processing & Designer state
  const [isProcessing, setIsProcessing] = useState(false);
  const [designedJourney, setDesignedJourney] = useState<GuidedJourney | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Day editor active in designer
  const [editingDayId, setEditingDayId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: ProgrammeCategory; label: string }[] = [
    { id: 'transformation', label: 'Personal Transformation' },
    { id: 'productivity', label: 'Productivity & Daily Schedule' },
    { id: 'career', label: 'Career & Work Roadmap' },
    { id: 'learning', label: 'Learning & Skill Building' },
    { id: 'habits', label: 'Habit Mastery' },
    { id: 'fitness', label: 'Fitness & Health' },
    { id: 'business', label: 'Business & Entrepreneurship' },
    { id: 'creative', label: 'Creative Challenge' },
    { id: 'emotional', label: 'Mindset & Emotional Growth' },
    { id: 'custom', label: 'Custom Schedule' },
  ];

  const durationPresets = [7, 14, 21, 30, 60, 90];

  // Handler for File upload (.pdf, .docx, .txt)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const rawText = await extractTextFromFile(selectedFile);
      setRawExtractedText(rawText);

      // Auto parse initial draft
      const parsed = parseProgrammeText(rawText, {
        title: title.trim() || undefined,
        mentorName: mentorName.trim() || undefined,
        category,
        startDate,
        fileName: selectedFile.name,
        targetDaysCount,
        themeColor,
      });

      setDesignedJourney(parsed);
      if (!title) setTitle(parsed.title);
      if (!mentorName) setMentorName(parsed.mentorName);
      setTargetDaysCount(parsed.durationDays);
      setStep('designer');
    } catch (err: any) {
      console.error('File extraction error:', err);
      setErrorMessage(
        'Could not read text from this file. Please ensure it is a PDF with readable text, a Word (.docx) file, or paste your schedule directly.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for pasted text (ChatGPT schedule, notes)
  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);
    setRawExtractedText(pastedText);

    try {
      const parsed = parseProgrammeText(pastedText, {
        title: title.trim() || undefined,
        mentorName: mentorName.trim() || undefined,
        category,
        startDate,
        fileName: 'Pasted Schedule.txt',
        targetDaysCount,
        themeColor,
      });

      setDesignedJourney(parsed);
      if (!title) setTitle(parsed.title);
      if (!mentorName) setMentorName(parsed.mentorName);
      setTargetDaysCount(parsed.durationDays);
      setStep('designer');
    } catch (err) {
      setErrorMessage('Failed to parse text. Please review the schedule formatting.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-distribute days when user changes duration (e.g. from 14 to 30 or 60 days)
  const handleDurationChange = (newDuration: number) => {
    setTargetDaysCount(newDuration);
    if (!rawExtractedText) return;

    const reDistributed = parseProgrammeText(rawExtractedText, {
      title: title.trim() || designedJourney?.title,
      mentorName: mentorName.trim() || designedJourney?.mentorName,
      category,
      startDate,
      fileName: file?.name || 'Schedule.pdf',
      targetDaysCount: newDuration,
      themeColor,
    });

    setDesignedJourney(reDistributed);
  };

  // Update a specific day's title or tasks inside designer
  const handleUpdateDayTheme = (dayId: string, newTheme: string) => {
    if (!designedJourney) return;
    setDesignedJourney({
      ...designedJourney,
      days: designedJourney.days.map((d) => (d.id === dayId ? { ...d, theme: newTheme } : d)),
    });
  };

  const handleUpdateDayTask = (dayId: string, sectionIdx: number, chkIdx: number, newText: string) => {
    if (!designedJourney) return;
    setDesignedJourney({
      ...designedJourney,
      days: designedJourney.days.map((d) => {
        if (d.id !== dayId) return d;
        const updatedSections = [...d.sections];
        if (updatedSections[sectionIdx] && updatedSections[sectionIdx].checklist[chkIdx]) {
          updatedSections[sectionIdx].checklist[chkIdx].text = newText;
        }
        return { ...d, sections: updatedSections };
      }),
    });
  };

  // 1-Click Sample Load
  const handleLoadSample = () => {
    addJourney(resetEntropyJourney);
    onProgrammeCreated(resetEntropyJourney);
    onClose();
  };

  // Finalize and Launch
  const handleLaunchJourney = () => {
    if (!designedJourney) return;

    const finalJourney: GuidedJourney = {
      ...designedJourney,
      title: title.trim() || designedJourney.title,
      mentorName: mentorName.trim() || designedJourney.mentorName,
      category,
      startDate,
      themeColor,
    };

    addJourney(finalJourney);
    onProgrammeCreated(finalJourney);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A19]/55 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Main Designer Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E7E1DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#F8EDE8] text-[#B85C3B] flex items-center justify-center border border-[#B85C3B]/20 shadow-2xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85C3B]">
                  {step === 'upload' ? 'STEP 1: UPLOAD SCHEDULE' : 'STEP 2: D1–DN JOURNEY DESIGNER'}
                </span>
                <span className="text-[10px] text-[#78716C] bg-[#FAF8F4] px-2 py-0.5 rounded-full border border-[#E7E1DA]">
                  PDF / Word / ChatGPT
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#1B1A19]">
                {step === 'upload'
                  ? 'Upload any PDF or Document Schedule'
                  : `Design & Distribute into D1–D${targetDaysCount}`}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step === 'designer' && (
              <button
                onClick={() => setStep('upload')}
                className="px-3 py-1.5 rounded-xl border border-[#E7E1DA] text-xs font-semibold text-[#57534E] hover:bg-[#FAF8F4] transition-colors"
              >
                Change File
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1B1A19] hover:bg-[#FAF8F4] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= STEP 1: UPLOAD ================= */}
        {step === 'upload' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Quick Demo Sample Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F8EDE8]/50 via-white to-[#FAF8F4] border border-[#B85C3B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C3B]">
                  1-Click Sample
                </span>
                <p className="text-xs font-bold text-[#1B1A19]">
                  RESET ENTROPY™ 14-Day Transformation Continuation
                </p>
                <p className="text-[11px] text-[#78716C]">
                  Full 14-day mentor plan with D1–D14 verbatim instructions and rules.
                </p>
              </div>
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 rounded-xl bg-[#B85C3B] hover:bg-[#A04F32] text-white text-xs font-semibold shrink-0 shadow-xs transition-colors"
              >
                Load Sample Plan
              </button>
            </div>

            {/* Input Format Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E7E1DA] pb-2">
              <button
                onClick={() => setActiveInputMode('upload')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeInputMode === 'upload'
                    ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1B1A19]'
                }`}
              >
                Upload File (PDF / DOCX)
              </button>
              <button
                onClick={() => setActiveInputMode('paste')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeInputMode === 'paste'
                    ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                    : 'text-[#78716C] hover:text-[#1B1A19]'
                }`}
              >
                Paste Schedule (from ChatGPT or Notes)
              </button>
            </div>

            {/* Upload Area */}
            {activeInputMode === 'upload' ? (
              <div className="space-y-3">
                <label
                  htmlFor="universal-file-upload"
                  className="group relative flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed border-[#E7E1DA] hover:border-[#B85C3B] bg-white cursor-pointer transition-all shadow-2xs"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF8F4] group-hover:bg-[#F8EDE8] text-[#78716C] group-hover:text-[#B85C3B] flex items-center justify-center transition-all shadow-2xs mb-3">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-sm font-bold text-[#1B1A19]">
                    {file ? file.name : 'Drop your PDF or Word document here'}
                  </p>
                  <p className="text-xs text-[#78716C] mt-1 text-center max-w-sm">
                    Upload any PDF or .docx file (e.g. 7-day, 14-day, 30-day, 60-day, or 90-day plan created by mentors or generated in ChatGPT).
                  </p>
                  <span className="mt-3 px-3 py-1 rounded-full text-[10px] font-bold bg-[#FAF8F4] text-[#B85C3B] border border-[#E7E1DA]">
                    Supports PDF, DOCX, TXT
                  </span>
                  <input
                    id="universal-file-upload"
                    type="file"
                    accept=".pdf,.docx,.doc,.txt,.md"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1B1A19] block">
                  Paste Schedule or ChatGPT Output:
                </label>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your daily schedule or plan text here (e.g., Day 1: ..., Day 2: ... or a 30-day schedule)..."
                  rows={7}
                  className="w-full p-4 rounded-2xl bg-white border border-[#E7E1DA] text-xs text-[#1B1A19] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#B85C3B]"
                />
                <button
                  onClick={handleProcessPastedText}
                  disabled={!pastedText.trim() || isProcessing}
                  className="px-5 py-2.5 rounded-xl bg-[#1B1A19] text-white text-xs font-bold disabled:opacity-40 transition-colors shadow-xs"
                >
                  Analyze & Open Designer
                </button>
              </div>
            )}

            {/* Quick Preset Duration Selector */}
            <div className="p-5 rounded-2xl bg-white border border-[#E7E1DA] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B1A19]">
                  Expected Journey Duration:
                </span>
                <span className="text-xs font-bold text-[#B85C3B]">
                  {targetDaysCount} Days (D1–D{targetDaysCount})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {durationPresets.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setTargetDaysCount(days)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      targetDaysCount === days
                        ? 'bg-[#B85C3B] text-white shadow-2xs'
                        : 'bg-[#FAF8F4] text-[#57534E] border border-[#E7E1DA] hover:border-[#B85C3B]'
                    }`}
                  >
                    {days} Days
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-[#78716C]">
                If your PDF doesn't have every day numbered, SANKALP will distribute its activities across your selected duration (e.g. D1 to D30).
              </p>
            </div>

            {/* Optional Metadata */}
            <div className="p-5 rounded-2xl bg-white border border-[#E7E1DA] space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                Programme Metadata (Optional)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                    Title / Subject
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 30-Day Design Sprint or ChatGPT Routine"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                    Mentor / Author / Source
                  </label>
                  <input
                    type="text"
                    value={mentorName}
                    onChange={(e) => setMentorName(e.target.value)}
                    placeholder="e.g. Coach or ChatGPT"
                    className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                  />
                </div>
              </div>
            </div>

            {isProcessing && (
              <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] flex items-center gap-3 text-xs text-[#78716C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B85C3B] animate-ping" />
                <span>Extracting PDF text and generating D1, D2, D3 distribution...</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center gap-2 text-xs text-[#DC2626]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        )}

        {/* ================= STEP 2: D1, D2, D3 DESIGNER ================= */}
        {step === 'designer' && designedJourney && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Designer Toolbar: Title, Duration adjuster, Theme Color */}
            <div className="p-5 rounded-2xl bg-white border border-[#E7E1DA] space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E1DA] pb-3">
                <div className="flex-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                    Journey Title
                  </label>
                  <input
                    type="text"
                    value={title || designedJourney.title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-base font-bold text-[#1B1A19] bg-transparent border-none focus:outline-hidden"
                  />
                </div>

                {/* Duration Presets Bar in Designer */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#78716C] mr-1">Duration:</span>
                  {durationPresets.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDurationChange(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        targetDaysCount === d
                          ? 'bg-[#1B1A19] text-white shadow-xs'
                          : 'bg-[#FAF8F4] text-[#57534E] border border-[#E7E1DA] hover:border-[#1B1A19]'
                      }`}
                    >
                      D{d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Color Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#57534E]">Visual Accent:</span>
                  {[
                    { id: 'terracotta', label: 'Terracotta', bg: 'bg-[#B85C3B]' },
                    { id: 'sage', label: 'Sage', bg: 'bg-[#6B7A5B]' },
                    { id: 'charcoal', label: 'Charcoal', bg: 'bg-[#1B1A19]' },
                    { id: 'amber', label: 'Warm Sand', bg: 'bg-[#D97706]' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setThemeColor(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        themeColor === t.id
                          ? 'bg-white border-[#1B1A19] text-[#1B1A19] shadow-2xs font-bold'
                          : 'bg-[#FAF8F4] border-[#E7E1DA] text-[#78716C]'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${t.bg}`} />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <span className="text-xs font-semibold text-[#6B7A5B] bg-[#EEF2EC] px-3 py-1 rounded-full border border-[#6B7A5B]/30">
                  {designedJourney.days.length} Days Distributed (D1 to D{designedJourney.days.length})
                </span>
              </div>
            </div>

            {/* D1, D2, D3 Interactive Visual Canvas */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#1B1A19]">
                    Interactive Schedule Timeline (D1 – D{designedJourney.days.length})
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Click any day to customize its directive or tasks before launching.
                  </p>
                </div>
              </div>

              {/* Grid of Days */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {designedJourney.days.map((day) => {
                  const isEditing = editingDayId === day.id;

                  return (
                    <div
                      key={day.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isEditing
                          ? 'bg-white border-[#B85C3B] ring-2 ring-[#B85C3B]/20 shadow-md'
                          : 'bg-white border-[#E7E1DA] hover:border-[#B85C3B]/40 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#F8EDE8] text-[#B85C3B] border border-[#B85C3B]/20">
                          {day.dayLabel || `D${day.dayNumber}`}
                        </span>
                        <span className="text-[10px] text-[#78716C]">{day.dateString}</span>
                      </div>

                      {/* Day Theme (Editable inline) */}
                      {isEditing ? (
                        <div className="space-y-2 mt-2">
                          <input
                            type="text"
                            value={day.theme}
                            onChange={(e) => handleUpdateDayTheme(day.id, e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-[#FAF8F4] border border-[#E7E1DA] text-xs font-bold text-[#1B1A19]"
                            placeholder="Day focus..."
                          />

                          {/* Task List items in edit mode */}
                          <div className="space-y-1">
                            {day.sections[0]?.checklist.map((chk, cIdx) => (
                              <input
                                key={chk.id}
                                type="text"
                                value={chk.text}
                                onChange={(e) => handleUpdateDayTask(day.id, 0, cIdx, e.target.value)}
                                className="w-full px-2 py-1 rounded bg-[#FAF8F4] border border-[#E7E1DA] text-[11px] text-[#44403C]"
                              />
                            ))}
                          </div>

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => setEditingDayId(null)}
                              className="px-2.5 py-1 rounded-md bg-[#1B1A19] text-white text-[10px] font-bold"
                            >
                              Done Editing
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div
                          onClick={() => setEditingDayId(day.id)}
                          className="cursor-pointer space-y-1.5"
                        >
                          <h4 className="text-xs font-bold text-[#1B1A19] line-clamp-1 hover:text-[#B85C3B] transition-colors">
                            {day.theme}
                          </h4>
                          <p className="text-[11px] text-[#57534E] line-clamp-2 leading-relaxed">
                            {day.sections.find((s) => s.type === 'work')?.content ||
                              day.sections[0]?.content}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-[#78716C] pt-1">
                            <span>{day.sections.length} Sections</span>
                            <span className="text-[#B85C3B] font-semibold flex items-center gap-0.5">
                              <Edit2 className="w-2.5 h-2.5" />
                              <span>Edit</span>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer Bar */}
        <div className="px-6 py-4 border-t border-[#E7E1DA] bg-white flex items-center justify-between">
          {step === 'designer' ? (
            <>
              <button
                onClick={() => setStep('upload')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1B1A19] transition-colors"
              >
                ← Back to Upload
              </button>

              <button
                onClick={handleLaunchJourney}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-bold shadow-md transition-all active:scale-98"
              >
                <span>Launch D1–D{targetDaysCount} Journey</span>
                <ArrowRight className="w-4 h-4 text-[#B85C3B]" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1B1A19] transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  if (file || pastedText.trim()) {
                    if (file) handleFileChange({ target: { files: [file] } } as any);
                    else handleProcessPastedText();
                  } else {
                    handleLoadSample();
                  }
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white text-xs font-bold shadow-xs transition-all"
              >
                <span>Open Designer</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#B85C3B]" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
