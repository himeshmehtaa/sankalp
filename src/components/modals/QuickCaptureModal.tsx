import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeDomain } from '../../types';
import {
  X,
  CheckSquare,
  FileText,
  Lightbulb,
  BookOpen,
  Target,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CustomSelect, SelectOption } from '../common/CustomSelect';

type CaptureType = 'task' | 'note' | 'idea' | 'journal' | 'goal';

export const QuickCaptureModal: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    addTask,
    addJournalEntry,
    addLibraryItem,
    addGoal,
    goals,
    showToast,
  } = useApp();

  const [captureType, setCaptureType] = useState<CaptureType>('task');
  const [content, setContent] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<LifeDomain>('growth');

  if (!isQuickCaptureOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (captureType === 'task') {
      addTask({
        title: content.trim(),
        notes: secondaryText.trim() || undefined,
        bucket: 'today',
        priority: 'normal',
        status: 'todo',
        goalId: selectedGoalId || undefined,
        subtasks: [],
      });
    } else if (captureType === 'journal') {
      addJournalEntry({
        title: content.trim(),
        content: secondaryText.trim() || content.trim(),
        date: new Date().toISOString().split('T')[0],
        mood: 'calm',
        energy: 4,
        tags: ['Quick Capture'],
        linkedGoalId: selectedGoalId || undefined,
      });
    } else if (captureType === 'idea' || captureType === 'note') {
      addLibraryItem({
        type: captureType === 'idea' ? 'idea' : 'book_insight',
        title: content.trim(),
        content: secondaryText.trim() || content.trim(),
        linkedDomain: selectedDomain,
        tags: [captureType],
      });
    } else if (captureType === 'goal') {
      addGoal({
        title: content.trim(),
        description: secondaryText.trim(),
        whyItMatters: 'Captured during flow state.',
        domain: selectedDomain,
        level: 'quarterly',
        progress: 0,
        status: 'active',
        milestones: [],
      });
    }

    setContent('');
    setSecondaryText('');
    setIsQuickCaptureOpen(false);
  };

  const types: { key: CaptureType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'task', label: 'Task', icon: CheckSquare },
    { key: 'journal', label: 'Journal Entry', icon: BookOpen },
    { key: 'idea', label: 'Idea', icon: Lightbulb },
    { key: 'note', label: 'Note', icon: FileText },
    { key: 'goal', label: 'Goal', icon: Target },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-capture-title"
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#1C1917]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
          <h2 id="quick-capture-title" className="text-sm font-bold text-[#1C1917] tracking-tight">
            Quick Capture
          </h2>
          <button
            onClick={() => setIsQuickCaptureOpen(false)}
            className="p-1 rounded-lg text-[#8F877F] hover:bg-[#EBE5DB]"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Capture Type Tabs */}
        <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
          {types.map((t) => {
            const Icon = t.icon;
            const isSelected = captureType === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setCaptureType(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#1C1917] text-[#FAF8F5]'
                    : 'bg-[#FFFFFF] border border-[#E8E2D8] text-[#57534E] hover:bg-[#F2EFEB]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C85A17]' : 'text-[#8F877F]'}`} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Capture Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <input
              type="text"
              autoFocus
              placeholder={
                captureType === 'task'
                  ? 'What needs doing today?'
                  : captureType === 'journal'
                  ? 'Title or key reflection of this moment...'
                  : captureType === 'idea'
                  ? 'The core insight or creative spark...'
                  : captureType === 'goal'
                  ? 'What ambition is forming?'
                  : 'Quick note title...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-sm font-medium px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] text-[#1C1917]"
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Add details, why it matters, or context (optional)..."
              value={secondaryText}
              onChange={(e) => setSecondaryText(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] resize-none text-[#57534E]"
            />
          </div>

          {/* Goal Link if Task or Journal */}
          {(captureType === 'task' || captureType === 'journal') && goals.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#8F877F] shrink-0">Link to Goal:</span>
              <div className="flex-1">
                <CustomSelect
                  value={selectedGoalId}
                  onChange={(val) => setSelectedGoalId(val)}
                  options={[
                    { value: '', label: 'None (Standalone)' },
                    ...goals.map((g) => ({
                      value: g.id,
                      label: g.title,
                      icon: <Target className="w-3.5 h-3.5" />,
                    })),
                  ]}
                  placeholder="Select linked goal..."
                />
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D8]">
            <span className="text-[11px] text-[#8F877F]">
              Press <kbd className="bg-[#EBE5DB] px-1 py-0.5 rounded text-[10px]">Enter</kbd> to save
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsQuickCaptureOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!content.trim()}
                className="px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs disabled:opacity-50 transition-colors"
              >
                Capture Now
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
