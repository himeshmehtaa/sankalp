import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JournalEntry } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Tag,
  Smile,
  Zap,
  Calendar,
  Lock,
  Target,
  Sparkles,
  Trash2,
  Edit2,
  Check,
  Heart,
  Compass,
} from 'lucide-react';
import { CustomSelect, SelectOption } from '../common/CustomSelect';

export const JournalView: React.FC = () => {
  const {
    journalEntries,
    addJournalEntry,
    updateJournalEntry,
    deleteJournalEntry,
    goals,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isWriting, setIsWriting] = useState(false);
  const [activeEntry, setActiveEntry] = useState<JournalEntry | null>(
    journalEntries.length > 0 ? journalEntries[0] : null
  );

  // New/Edit Entry Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<JournalEntry['mood']>('calm');
  const [energy, setEnergy] = useState<number>(4);
  const [tagsInput, setTagsInput] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Thoughtful prompts
  const prompts = [
    'What gave me genuine energy or quiet satisfaction today?',
    'Where did I experience resistance or hesitation, and what was underneath it?',
    'What assumption am I making about my situation that might not be true?',
    'If I could only accomplish one thing tomorrow, what would move the needle most?',
  ];

  // Collect all unique tags
  const allTags = Array.from(
    new Set(journalEntries.flatMap((e) => e.tags || []))
  );

  const filteredEntries = journalEntries.filter((entry) => {
    const matchesQuery =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag =
      selectedTag === 'all' || (entry.tags && entry.tags.includes(selectedTag));
    return matchesQuery && matchesTag;
  });

  const handleStartNew = () => {
    setTitle('');
    setContent('');
    setMood('calm');
    setEnergy(4);
    setTagsInput('Reflection');
    setLinkedGoalId('');
    setIsWriting(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addJournalEntry({
      title: title.trim() || 'Untitled Reflection',
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
      mood,
      energy,
      tags,
      linkedGoalId: linkedGoalId || undefined,
      isPrivate,
    });

    setIsWriting(false);
  };

  const applyPrompt = (prompt: string) => {
    setContent((prev) => (prev ? `${prev}\n\n*${prompt}*\n` : `*${prompt}*\n`));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]/70">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1917]">
            Journal & Personal Knowledge
          </h1>
          <p className="text-xs text-[#8F877F] mt-0.5">
            A quiet sanctuary for self-awareness, learning notes, and honest self-reflection
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C85A17]" />
          <span>Write Reflection</span>
        </button>
      </div>

      {/* Editor Modal / View */}
      {isWriting ? (
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C85A17]">
              New Reflection Entry
            </span>
            <button
              onClick={() => setIsWriting(false)}
              className="text-xs text-[#8F877F] hover:text-[#1C1917] font-medium"
            >
              Cancel
            </button>
          </div>

          {/* Prompts Drawer */}
          <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#E8E2D8] space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#C85A17]" />
              <span>Optional prompts (Click to insert)</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPrompt(p)}
                  className="text-xs text-[#57534E] hover:text-[#C85A17] bg-[#FFFFFF] px-2.5 py-1.5 rounded-lg border border-[#E8E2D8] hover:border-[#C85A17]/40 transition-colors text-left"
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div>
              <input
                type="text"
                autoFocus
                placeholder="Title of this reflection..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-base font-semibold text-[#1C1917] placeholder:text-[#8F877F] px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] transition-all"
              />
            </div>

            <div>
              <textarea
                rows={9}
                placeholder="Write freely. Autosaved locally. No judgment, no rush..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full text-xs leading-relaxed p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] focus:bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] resize-none text-[#1C1917] placeholder:text-[#8F877F] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  Mindset State
                </label>
                <CustomSelect
                  value={mood}
                  onChange={(val) => setMood(val as JournalEntry['mood'])}
                  options={[
                    { value: 'calm', label: 'Calm & Still', icon: <Smile className="w-3.5 h-3.5" /> },
                    { value: 'focused', label: 'Focused', icon: <Target className="w-3.5 h-3.5" /> },
                    { value: 'thoughtful', label: 'Thoughtful', icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { value: 'challenging', label: 'Challenging / Resisting', icon: <Zap className="w-3.5 h-3.5" /> },
                    { value: 'grateful', label: 'Deeply Grateful', icon: <Heart className="w-3.5 h-3.5" /> },
                  ]}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Craft, Clarity, Mindset"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  Connect to Goal
                </label>
                <CustomSelect
                  value={linkedGoalId}
                  onChange={(val) => setLinkedGoalId(val)}
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

            <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setIsWriting(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
              >
                Discard
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
      ) : (
        /* Journal Entries 2-Column Reader */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Entries Sidebar */}
          <div className="md:col-span-5 space-y-3">
            {/* Search and Tag filter */}
            <div className="flex items-center gap-2 px-3 py-2 bg-[#FFFFFF] border border-[#E8E2D8] rounded-xl text-xs">
              <Search className="w-3.5 h-3.5 text-[#8F877F]" />
              <input
                type="text"
                placeholder="Search reflections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none"
              />
            </div>

            {/* Entries List */}
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {filteredEntries.map((entry) => {
                const isSelected = activeEntry?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => setActiveEntry(entry)}
                    className={`w-full p-4 rounded-xl border text-left transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-[#FFFFFF] border-[#C85A17] shadow-xs'
                        : 'bg-[#FFFFFF]/70 border-[#E8E2D8] hover:border-[#D6CEBE]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#8F877F]">
                      <span>{entry.date}</span>
                      {entry.mood && (
                        <span className="capitalize px-1.5 py-0.2 rounded bg-[#F2EFEB] text-[#78716C]">
                          {entry.mood}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#1C1917] truncate">{entry.title}</h4>

                    <p className="text-[11px] text-[#78716C] line-clamp-2 leading-relaxed">
                      {entry.content}
                    </p>

                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex gap-1 pt-1 overflow-hidden">
                        {entry.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-[#FAF0E6] text-[#C85A17]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}

              {filteredEntries.length === 0 && (
                <div className="p-6 text-center text-xs text-[#8F877F] border border-dashed border-[#DDD7CB] rounded-xl">
                  No journal entries found.
                </div>
              )}
            </div>
          </div>

          {/* Active Entry Detail View */}
          <div className="md:col-span-7 bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
            {activeEntry ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
                  <div className="flex items-center gap-2 text-xs text-[#8F877F]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{activeEntry.date}</span>
                    {activeEntry.mood && (
                      <>
                        <span>•</span>
                        <span className="capitalize">Mood: {activeEntry.mood}</span>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      deleteJournalEntry(activeEntry.id);
                      setActiveEntry(journalEntries.find((e) => e.id !== activeEntry.id) || null);
                    }}
                    className="p-1 rounded text-[#DDD7CB] hover:text-[#DC2626] transition-colors"
                    title="Delete reflection"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#1C1917] font-editorial tracking-tight">
                  {activeEntry.title}
                </h2>

                <div className="text-xs sm:text-sm text-[#1C1917] leading-relaxed whitespace-pre-wrap">
                  {activeEntry.content}
                </div>

                {activeEntry.tags && activeEntry.tags.length > 0 && (
                  <div className="pt-4 border-t border-[#E8E2D8]/60 flex gap-1.5 flex-wrap">
                    {activeEntry.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-[#F2EFEB] text-[#57534E]"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-[#8F877F]">
                Select an entry or write a new reflection.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
