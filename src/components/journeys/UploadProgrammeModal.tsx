import React, { useState } from 'react';
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
  FileCheck,
} from 'lucide-react';
import { ProgrammeCategory, GuidedJourney } from '../../types/journeys';
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
  const { addJourney, showToast } = useApp();

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [activeInputMode, setActiveInputMode] = useState<'upload' | 'paste'>('upload');

  const [title, setTitle] = useState('');
  const [mentorName, setMentorName] = useState('');
  const [category, setCategory] = useState<ProgrammeCategory>('transformation');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [personalNotes, setPersonalNotes] = useState('');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedPreview, setExtractedPreview] = useState<GuidedJourney | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories: { id: ProgrammeCategory; label: string }[] = [
    { id: 'transformation', label: 'Personal Transformation' },
    { id: 'career', label: 'Career Development' },
    { id: 'productivity', label: 'Productivity & Focus' },
    { id: 'habits', label: 'Habit Building' },
    { id: 'fitness', label: 'Fitness & Wellness' },
    { id: 'learning', label: 'Learning & Education' },
    { id: 'business', label: 'Business & Entrepreneurship' },
    { id: 'emotional', label: 'Emotional Development' },
    { id: 'creative', label: 'Creative Challenges' },
    { id: 'custom', label: 'Custom Programme' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const rawText = await extractTextFromFile(selectedFile);
      const parsed = parseProgrammeText(rawText, {
        title: title.trim() || undefined,
        mentorName: mentorName.trim() || undefined,
        category,
        startDate,
        fileName: selectedFile.name,
        personalNotes,
      });

      setExtractedPreview(parsed);
      if (!title) setTitle(parsed.title);
      if (!mentorName) setMentorName(parsed.mentorName);
    } catch (err: any) {
      console.error('File extraction error:', err);
      setErrorMessage('Could not extract text from file. Please ensure it is a valid .docx or text document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const parsed = parseProgrammeText(pastedText, {
        title: title.trim() || undefined,
        mentorName: mentorName.trim() || undefined,
        category,
        startDate,
        fileName: 'Pasted Programme.txt',
        personalNotes,
      });

      setExtractedPreview(parsed);
      if (!title) setTitle(parsed.title);
      if (!mentorName) setMentorName(parsed.mentorName);
    } catch (err) {
      setErrorMessage('Failed to parse text. Please review the structure.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = () => {
    addJourney(resetEntropyJourney);
    onProgrammeCreated(resetEntropyJourney);
    onClose();
  };

  const handleConfirmCreate = () => {
    if (!extractedPreview) return;

    // Apply any customized metadata
    const finalJourney: GuidedJourney = {
      ...extractedPreview,
      title: title.trim() || extractedPreview.title,
      mentorName: mentorName.trim() || extractedPreview.mentorName,
      category,
      startDate,
    };

    addJourney(finalJourney);
    onProgrammeCreated(finalJourney);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A19]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E7E1DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F8EDE8] text-[#B85C3B] flex items-center justify-center border border-[#B85C3B]/20 shadow-2xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C3B]">
                STEP 1 & 2 • PROGRAMME IMPORT
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#1B1A19]">
                Turn your programme into a daily journey.
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

        {/* Subtitle description */}
        <div className="px-6 py-3 bg-[#FAF8F4] border-b border-[#E7E1DA] flex items-center justify-between">
          <p className="text-xs text-[#57534E] leading-relaxed">
            Upload a PDF or Word document from your mentor, coach, or trainer. SANKALP will organise it into a guided daily experience while preserving their exact instructions.
          </p>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick 1-Click Sample Button */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F8EDE8]/50 via-white to-[#FAF8F4] border border-[#B85C3B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B85C3B]">
                Instant Demo
              </span>
              <p className="text-xs font-bold text-[#1B1A19]">
                RESET ENTROPY™ 14-Day Transformation Continuation
              </p>
              <p className="text-[11px] text-[#78716C]">
                Himesh's coach programme (29 Oct – 11 Nov 2026) with all 14 days and rules.
              </p>
            </div>
            <button
              onClick={handleLoadSample}
              className="px-4 py-2 rounded-xl bg-[#B85C3B] hover:bg-[#A04F32] text-white text-xs font-semibold shrink-0 shadow-xs transition-colors"
            >
              Load Sample Arc
            </button>
          </div>

          {/* Input Method Tabs */}
          <div className="flex items-center gap-2 border-b border-[#E7E1DA] pb-2">
            <button
              onClick={() => setActiveInputMode('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeInputMode === 'upload'
                  ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1B1A19]'
              }`}
            >
              Upload Document (.docx, .pdf, .txt)
            </button>
            <button
              onClick={() => setActiveInputMode('paste')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeInputMode === 'paste'
                  ? 'bg-white text-[#1B1A19] border border-[#E7E1DA] shadow-2xs'
                  : 'text-[#78716C] hover:text-[#1B1A19]'
              }`}
            >
              Paste Programme Text
            </button>
          </div>

          {/* Upload Area */}
          {activeInputMode === 'upload' ? (
            <div className="space-y-2">
              <label
                htmlFor="programme-file-upload"
                className="group relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-[#E7E1DA] hover:border-[#B85C3B] bg-white cursor-pointer transition-all shadow-2xs"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#FAF8F4] group-hover:bg-[#F8EDE8] text-[#78716C] group-hover:text-[#B85C3B] flex items-center justify-center transition-all shadow-2xs mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#1B1A19]">
                  {file ? file.name : 'Click to select or drag and drop your document'}
                </p>
                <p className="text-[11px] text-[#78716C] mt-1">
                  Supports .docx, .txt, .md, .pdf files
                </p>
                <input
                  id="programme-file-upload"
                  type="file"
                  accept=".docx,.txt,.md,.doc,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#1B1A19] block">
                Paste Programme Schedule / Daily Plan:
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full text from your mentor, coach, or trainer here..."
                rows={6}
                className="w-full p-3 rounded-2xl bg-white border border-[#E7E1DA] text-xs text-[#1B1A19] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#B85C3B]"
              />
              <button
                onClick={handleProcessPastedText}
                disabled={!pastedText.trim() || isProcessing}
                className="px-4 py-2 rounded-xl bg-[#1B1A19] text-white text-xs font-semibold disabled:opacity-40 transition-colors"
              >
                Analyze Pasted Text
              </button>
            </div>
          )}

          {/* Optional Metadata Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7E1DA] space-y-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
              Optional Programme Details
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                  Programme Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 14-Day Transformation Continuation"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                  Mentor / Coach Name
                </label>
                <input
                  type="text"
                  value={mentorName}
                  onChange={(e) => setMentorName(e.target.value)}
                  placeholder="e.g. Reset Entropy / Coach"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProgrammeCategory)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[#57534E] block mb-1">
                Personal Intentions or Notes (Optional)
              </label>
              <input
                type="text"
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                placeholder="e.g. Focus on output before Notion; steady breathing"
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs text-[#1B1A19] focus:outline-hidden focus:border-[#B85C3B]"
              />
            </div>
          </div>

          {/* AI Analysis Result Preview */}
          {isProcessing && (
            <div className="p-4 rounded-2xl bg-white border border-[#E7E1DA] flex items-center gap-3 text-xs text-[#78716C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B85C3B] animate-ping" />
              <span>Analyzing document and generating daily structure...</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] flex items-center gap-2 text-xs text-[#DC2626]">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {extractedPreview && (
            <div className="p-5 rounded-2xl bg-[#FAF8F4] border border-[#6B7A5B]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7A5B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Analysis Complete</span>
                </span>
                <span className="text-xs font-bold text-[#1B1A19]">
                  {extractedPreview.days.length} Days Extracted
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-[#E7E1DA] space-y-2 text-xs">
                <p className="font-bold text-[#1B1A19]">{extractedPreview.title}</p>
                <p className="text-[#57534E]">{extractedPreview.summary}</p>
                <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-[#78716C]">
                  <span className="bg-[#FAF8F4] px-2 py-0.5 rounded-md border border-[#E7E1DA]">
                    Phases: {extractedPreview.phases.length}
                  </span>
                  <span className="bg-[#FAF8F4] px-2 py-0.5 rounded-md border border-[#E7E1DA]">
                    Duration: {extractedPreview.durationDays} Days
                  </span>
                  {extractedPreview.importantRule && (
                    <span className="bg-[#F8EDE8] text-[#B85C3B] px-2 py-0.5 rounded-md border border-[#B85C3B]/20">
                      Rule Detected
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E7E1DA] bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#78716C] hover:text-[#1B1A19] transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmCreate}
            disabled={!extractedPreview}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] disabled:opacity-40 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <span>Create Guided Journey</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B85C3B]" />
          </button>
        </div>
      </div>
    </div>
  );
};
