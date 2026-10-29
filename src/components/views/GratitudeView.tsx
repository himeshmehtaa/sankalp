import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GratitudeEntry } from '../../types';
import {
  Heart,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Award,
  BookOpen,
  Edit2,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GratitudeView: React.FC = () => {
  const {
    gratitudes,
    addGratitudeEntry,
    updateGratitudeEntry,
    deleteGratitudeEntry,
    profile,
    showToast,
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [selfAppreciation, setSelfAppreciation] = useState('');
  const [dailyWin, setDailyWin] = useState('');
  const [lessonLearned, setLessonLearned] = useState('');

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState<GratitudeEntry | null>(null);
  const [editG1, setEditG1] = useState('');
  const [editG2, setEditG2] = useState('');
  const [editG3, setEditG3] = useState('');
  const [editSelf, setEditSelf] = useState('');
  const [editDailyWin, setEditDailyWin] = useState('');
  const [editLesson, setEditLesson] = useState('');

  const handleOpenEdit = (entry: GratitudeEntry) => {
    setEditingEntry(entry);
    setEditG1(entry.gratitude1 || '');
    setEditG2(entry.gratitude2 || '');
    setEditG3(entry.gratitude3 || '');
    setEditSelf(entry.selfAppreciation || '');
    setEditDailyWin(entry.dailyWin || '');
    setEditLesson(entry.lessonLearned || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    updateGratitudeEntry(editingEntry.id, {
      gratitude1: editG1.trim(),
      gratitude2: editG2.trim(),
      gratitude3: editG3.trim(),
      selfAppreciation: editSelf.trim(),
      dailyWin: editDailyWin.trim(),
      lessonLearned: editLesson.trim(),
    });

    setEditingEntry(null);
    showToast('Reflection updated successfully');
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const hasEntryToday = gratitudes.some((g) => g.date === todayStr);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude1.trim()) return;

    addGratitudeEntry({
      date: todayStr,
      gratitude1: gratitude1.trim(),
      gratitude2: gratitude2.trim() || 'A peaceful breath in this moment.',
      gratitude3: gratitude3.trim() || 'The capacity to learn and adapt.',
      selfAppreciation: selfAppreciation.trim() || 'I chose to show up today.',
      dailyWin: dailyWin.trim() || 'Took deliberate action.',
      lessonLearned: lessonLearned.trim() || 'Growth compounds in silence.',
      affirmation: profile.guidingPrinciple,
    });

    try {
      confetti({ particleCount: 30, spread: 60, colors: ['#C85A17', '#FAF0E6'] });
    } catch (e) {}

    setIsAdding(false);
    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSelfAppreciation('');
    setDailyWin('');
    setLessonLearned('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              Gratitude & Peaceful Self-Reflection
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Grounded appreciation without guilt-based streaks or punitive metrics
          </p>
        </div>

        {!hasEntryToday && !isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 text-[#C85A17]" />
            <span>Today's Reflection</span>
          </button>
        )}
      </div>

      {/* Guiding Principle Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FAF0E6]/70 to-[#F5E6D8]/50 border border-[#E9D5C3] text-center space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C85A17]">
          Sankalp Core Principle
        </p>
        <p className="text-sm sm:text-base font-serif-quote italic text-[#1C1917]">
          "{profile.guidingPrinciple}"
        </p>
      </div>

      {/* Today's Entry Form */}
      {isAdding && (
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#C85A17]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                Today's Gratitude & Appreciation
              </span>
            </div>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-[#8F877F] hover:text-[#1C1917]"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#57534E]">
                Three Things I Am Grateful For
              </label>
              <input
                type="text"
                required
                placeholder="1. e.g. The morning quiet and a warm cup of coffee..."
                value={gratitude1}
                onChange={(e) => setGratitude1(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
              />
              <input
                type="text"
                placeholder="2. e.g. A kind message from an old collaborator..."
                value={gratitude2}
                onChange={(e) => setGratitude2(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
              />
              <input
                type="text"
                placeholder="3. e.g. A body capable of moving freely and recovering..."
                value={gratitude3}
                onChange={(e) => setGratitude3(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C85A17] mb-1">
                One Thing I Appreciate About Myself
              </label>
              <input
                type="text"
                placeholder="e.g. I chose patience when I felt like reacting with frustration..."
                value={selfAppreciation}
                onChange={(e) => setSelfAppreciation(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E9D5C3] bg-[#FAF0E6]/30 focus:outline-none focus:border-[#C85A17]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Daily Win (Even Small)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shipped the interface feature..."
                  value={dailyWin}
                  onChange={(e) => setDailyWin(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Lesson Learned
                </label>
                <input
                  type="text"
                  placeholder="e.g. Pausing is an active, strategic choice..."
                  value={lessonLearned}
                  onChange={(e) => setLessonLearned(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
              >
                Save Reflection
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History of Gratitudes */}
      <div className="space-y-4">
        {gratitudes.map((entry) => (
          <div
            key={entry.id}
            className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs space-y-4 hover:border-[#D6CEBE] transition-colors"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#78716C]">
                <Calendar className="w-3.5 h-3.5 text-[#C85A17]" />
                <span>{entry.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(entry)}
                  className="p-1.5 rounded-lg text-[#78716C] hover:text-[#C85A17] hover:bg-[#FAF0E6] transition-colors flex items-center gap-1 text-[11px] font-medium"
                  title="Edit reflection"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this reflection entry?')) {
                      deleteGratitudeEntry(entry.id);
                      showToast('Reflection removed');
                    }
                  }}
                  className="p-1.5 rounded-lg text-[#DDD7CB] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                  title="Delete reflection"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Gratitudes List */}
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F]">
                Grateful For
              </p>
              <ul className="space-y-1 text-xs text-[#1C1917] font-serif-quote italic">
                <li className="flex items-start gap-2">
                  <span className="text-[#C85A17] font-sans font-bold">1.</span>
                  <span>{entry.gratitude1}</span>
                </li>
                {entry.gratitude2 && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#C85A17] font-sans font-bold">2.</span>
                    <span>{entry.gratitude2}</span>
                  </li>
                )}
                {entry.gratitude3 && (
                  <li className="flex items-start gap-2">
                    <span className="text-[#C85A17] font-sans font-bold">3.</span>
                    <span>{entry.gratitude3}</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Self Appreciation Card */}
            {entry.selfAppreciation && (
              <div className="p-3 rounded-xl bg-[#FAF0E6]/50 border border-[#E9D5C3] space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A17]">
                  Self-Appreciation
                </span>
                <p className="text-xs text-[#57534E] leading-relaxed">
                  {entry.selfAppreciation}
                </p>
              </div>
            )}

            {/* Daily Win & Lesson */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              {entry.dailyWin && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                    Daily Win
                  </span>
                  <p className="text-xs font-semibold text-[#1C1917] mt-0.5">
                    {entry.dailyWin}
                  </p>
                </div>
              )}
              {entry.lessonLearned && (
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                    Lesson Learned
                  </span>
                  <p className="text-xs font-medium text-[#57534E] mt-0.5">
                    {entry.lessonLearned}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Reflection Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 text-[#1C1917] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#C85A17]" />
                <h2 className="text-sm font-bold text-[#1C1917]">
                  Edit Reflection — {editingEntry.date}
                </h2>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1 rounded-lg text-[#8F877F] hover:bg-[#EBE5DB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#57534E]">
                  Three Gratitudes
                </label>
                <input
                  type="text"
                  required
                  value={editG1}
                  onChange={(e) => setEditG1(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                  placeholder="1. Grateful for..."
                />
                <input
                  type="text"
                  value={editG2}
                  onChange={(e) => setEditG2(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                  placeholder="2. Grateful for..."
                />
                <input
                  type="text"
                  value={editG3}
                  onChange={(e) => setEditG3(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                  placeholder="3. Grateful for..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C85A17] mb-1">
                  Self-Appreciation
                </label>
                <input
                  type="text"
                  value={editSelf}
                  onChange={(e) => setEditSelf(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E9D5C3] bg-[#FAF0E6]/30 focus:outline-none focus:border-[#C85A17]"
                  placeholder="One thing you appreciate about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Daily Win
                  </label>
                  <input
                    type="text"
                    value={editDailyWin}
                    onChange={(e) => setEditDailyWin(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                    placeholder="Small win..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Lesson Learned
                  </label>
                  <input
                    type="text"
                    value={editLesson}
                    onChange={(e) => setEditLesson(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                    placeholder="Lesson learned..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Reflection</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
