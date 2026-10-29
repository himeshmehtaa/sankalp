import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GratitudeEntry } from '../../types';
import {
  Heart,
  Sparkles,
  Send,
  Check,
  Edit2,
  Trash2,
  X,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalmReflectView: React.FC = () => {
  const {
    gratitudes,
    addGratitudeEntry,
    updateGratitudeEntry,
    deleteGratitudeEntry,
    profile,
    updateProfile,
    showToast,
  } = useApp();

  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [selfAppreciation, setSelfAppreciation] = useState('');

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState<GratitudeEntry | null>(null);
  const [editG1, setEditG1] = useState('');
  const [editG2, setEditG2] = useState('');
  const [editG3, setEditG3] = useState('');
  const [editSelf, setEditSelf] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const moods: { key: typeof profile.todayMood; label: string; emoji: string }[] = [
    { key: 'serene', label: 'Serene', emoji: '🌿' },
    { key: 'focused', label: 'Focused', emoji: '🎯' },
    { key: 'reflective', label: 'Reflective', emoji: '✨' },
    { key: 'seeking-clarity', label: 'Seeking Clarity', emoji: '🌤️' },
    { key: 'restless', label: 'Restless', emoji: '🌊' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude1.trim()) return;

    addGratitudeEntry({
      date: todayStr,
      gratitude1: gratitude1.trim(),
      gratitude2: gratitude2.trim() || 'A moment of stillness.',
      gratitude3: gratitude3.trim() || 'The gift of a new day.',
      selfAppreciation: selfAppreciation.trim() || 'I showed up with genuine care.',
      dailyWin: 'Took time for conscious reflection.',
      lessonLearned: 'Gratitude grounds the restless mind.',
    });

    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#B85C3B', '#6B7A5B'] });
    } catch (e) {}

    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSelfAppreciation('');
  };

  const handleOpenEdit = (entry: GratitudeEntry) => {
    setEditingEntry(entry);
    setEditG1(entry.gratitude1 || '');
    setEditG2(entry.gratitude2 || '');
    setEditG3(entry.gratitude3 || '');
    setEditSelf(entry.selfAppreciation || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;

    updateGratitudeEntry(editingEntry.id, {
      gratitude1: editG1.trim(),
      gratitude2: editG2.trim(),
      gratitude3: editG3.trim(),
      selfAppreciation: editSelf.trim(),
    });

    setEditingEntry(null);
    showToast('Reflection updated');
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#B85C3B]">
          Reflection Sanctuary
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#1B1A19] font-editorial">
          What warmed your heart today?
        </h2>
      </div>

      {/* Mood Selector Row */}
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold text-[#8F877F] uppercase tracking-wider">
          Current Mindset
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {moods.map((m) => {
            const isSelected = profile.todayMood === m.key;
            return (
              <button
                key={m.key}
                onClick={() => updateProfile({ todayMood: m.key })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#F8EDE8] border-[#B85C3B] text-[#B85C3B] font-semibold shadow-xs'
                    : 'bg-[#FFFFFF] border-[#E7E1DA] text-[#78716C] hover:bg-[#F2EFEB]'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gratitude Form */}
      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-5"
      >
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1B1A19]">
            Three Simple Gratitudes
          </label>
          <input
            type="text"
            required
            placeholder="1. Something you noticed, felt, or enjoyed today..."
            value={gratitude1}
            onChange={(e) => setGratitude1(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
          />
          <input
            type="text"
            placeholder="2. Someone who made your day a little lighter..."
            value={gratitude2}
            onChange={(e) => setGratitude2(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
          />
          <input
            type="text"
            placeholder="3. A simple privilege or comfort..."
            value={gratitude3}
            onChange={(e) => setGratitude3(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#B85C3B] mb-1.5">
            One Thing You Appreciate About Yourself
          </label>
          <input
            type="text"
            placeholder="e.g. I stayed gentle when plans changed..."
            value={selfAppreciation}
            onChange={(e) => setSelfAppreciation(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#F8EDE8]/30 focus:outline-none focus:border-[#B85C3B]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-[#B85C3B]" />
            <span>Save Reflection</span>
          </button>
        </div>
      </form>

      {/* Recent Gratitudes Card Feed with EDIT & DELETE */}
      {gratitudes.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between px-1">
            <p className="text-[11px] font-bold text-[#8F877F] uppercase tracking-wider">
              Recent Peaceful Moments
            </p>
            <span className="text-[10px] text-[#8F877F]">
              {gratitudes.length} entries recorded
            </span>
          </div>

          <div className="space-y-3">
            {gratitudes.map((g) => (
              <div
                key={g.id}
                className="group p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] hover:border-[#D6CEBE] shadow-2xs transition-all space-y-2.5 relative"
              >
                <div className="flex items-center justify-between text-[11px] text-[#8F877F]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#B85C3B]" />
                    <span>{g.date}</span>
                  </div>

                  {/* Actions: Edit & Delete buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(g)}
                      className="p-1.5 rounded-lg text-[#78716C] hover:text-[#B85C3B] hover:bg-[#F8EDE8] transition-colors flex items-center gap-1 text-[11px] font-medium"
                      title="Edit this reflection"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm('Delete this reflection entry?')) {
                          deleteGratitudeEntry(g.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#DDD7CB] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors"
                      title="Delete reflection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#1B1A19]">
                  <p>"{g.gratitude1}"</p>
                  {g.gratitude2 && <p>"{g.gratitude2}"</p>}
                  {g.gratitude3 && <p>"{g.gratitude3}"</p>}
                </div>

                {g.selfAppreciation && (
                  <div className="pt-2 border-t border-[#E7E1DA]/60 flex items-start gap-1.5 text-[11px] text-[#57534E]">
                    <span className="font-semibold text-[#B85C3B]">Self:</span>
                    <span className="leading-relaxed">{g.selfAppreciation}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Gratitude Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl p-6 sm:p-7 text-[#1B1A19] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#B85C3B]" />
                <h3 className="text-sm font-bold text-[#1B1A19]">
                  Edit Reflection ({editingEntry.date})
                </h3>
              </div>
              <button
                onClick={() => setEditingEntry(null)}
                className="p-1 rounded-full text-[#8F877F] hover:bg-[#EBE5DB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Gratitude 1
                </label>
                <input
                  type="text"
                  required
                  value={editG1}
                  onChange={(e) => setEditG1(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Gratitude 2
                </label>
                <input
                  type="text"
                  value={editG2}
                  onChange={(e) => setEditG2(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Gratitude 3
                </label>
                <input
                  type="text"
                  value={editG3}
                  onChange={(e) => setEditG3(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#B85C3B] mb-1">
                  Self-Appreciation
                </label>
                <input
                  type="text"
                  value={editSelf}
                  onChange={(e) => setEditSelf(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#F8EDE8]/30 focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E1DA]">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B85C3B] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
