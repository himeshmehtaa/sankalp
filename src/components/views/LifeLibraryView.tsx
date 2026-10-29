import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LifeLibraryItem, LifeDomain } from '../../types';
import {
  Library,
  Plus,
  Search,
  BookOpen,
  Lightbulb,
  Compass,
  Bookmark,
  Sparkles,
  Quote,
  X,
  Eye,
  Heart,
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

export const LifeLibraryView: React.FC = () => {
  const { libraryItems, addLibraryItem, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<LifeLibraryItem['type'] | 'all'>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New Item State
  const [title, setTitle] = useState('');
  const [sourceOrAuthor, setSourceOrAuthor] = useState('');
  const [content, setContent] = useState('');
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [type, setType] = useState<LifeLibraryItem['type']>('principle');
  const [linkedDomain, setLinkedDomain] = useState<LifeDomain>('growth');

  const categories: { key: LifeLibraryItem['type'] | 'all'; label: string }[] = [
    { key: 'all', label: 'All Artifacts' },
    { key: 'principle', label: 'Guiding Principles' },
    { key: 'book_insight', label: 'Book Insights' },
    { key: 'vision_item', label: 'Vision Board' },
    { key: 'idea', label: 'Future Ideas' },
    { key: 'memory', label: 'Meaningful Memories' },
  ];

  const filteredItems = libraryItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sourceOrAuthor && item.sourceOrAuthor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = activeCategory === 'all' || item.type === activeCategory;
    return matchesSearch && matchesCat;
  });

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addLibraryItem({
      title: title.trim(),
      sourceOrAuthor: sourceOrAuthor.trim() || undefined,
      content: content.trim(),
      keyTakeaway: keyTakeaway.trim() || undefined,
      type,
      linkedDomain,
      tags: [type],
    });

    setTitle('');
    setSourceOrAuthor('');
    setContent('');
    setKeyTakeaway('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E7E1DA]/70">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1B1A19]">
            Life Library & Principles
          </h1>
          <p className="text-xs text-[#8F877F] mt-0.5">
            A permanent sanctuary for timeless principles, seminal book insights, and future visions
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B85C3B]" />
          <span>Add Insight</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === c.key
                  ? 'bg-[#1B1A19] text-[#FAF8F4] font-semibold'
                  : 'bg-[#FFFFFF] border border-[#E7E1DA] text-[#78716C] hover:bg-[#F2EFEB]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#E7E1DA] rounded-xl text-xs w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8F877F]" />
          <input
            type="text"
            placeholder="Search vault..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent focus:outline-none"
          />
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3 hover:border-[#D6CEBE] transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F8EDE8] text-[#B85C3B]">
                  {item.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] uppercase font-medium text-[#8F877F]">
                  {item.linkedDomain}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#1B1A19] leading-snug">{item.title}</h3>

              {item.sourceOrAuthor && (
                <p className="text-[11px] text-[#78716C]">
                  — {item.sourceOrAuthor}
                </p>
              )}

              <p className="text-xs text-[#57534E] leading-relaxed">
                "{item.content}"
              </p>
            </div>

            {item.keyTakeaway && (
              <div className="pt-2 border-t border-[#E7E1DA]/60 text-[11px] text-[#9A420E] bg-[#FAF8F4] p-2.5 rounded-xl">
                <strong className="font-semibold block text-[10px] uppercase text-[#B85C3B]">
                  Key Takeaway:
                </strong>
                {item.keyTakeaway}
              </div>
            )}
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full p-8 text-center rounded-2xl border border-dashed border-[#DDD7CB] bg-[#FFFFFF]/60">
            <Library className="w-8 h-8 text-[#8F877F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1B1A19]">No insights match your filter.</p>
          </div>
        )}
      </div>

      {/* Add Insight Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F4] border border-[#E7E1DA] rounded-2xl shadow-2xl p-6 text-[#1B1A19]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
              <h2 className="text-sm font-bold text-[#1B1A19]">Save Insight to Life Library</h2>
              <button onClick={() => setIsAdding(false)} className="p-1 rounded-lg hover:bg-[#EBE5DB]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. I can move without complete certainty."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Type</label>
                  <CustomSelect
                    value={type}
                    onChange={(val) => setType(val as LifeLibraryItem['type'])}
                    options={[
                      { value: 'principle', label: 'Guiding Principle', icon: <Compass className="w-3.5 h-3.5" /> },
                      { value: 'book_insight', label: 'Book / Lecture Insight', icon: <BookOpen className="w-3.5 h-3.5" /> },
                      { value: 'vision_item', label: 'Vision Board Item', icon: <Eye className="w-3.5 h-3.5" /> },
                      { value: 'idea', label: 'Future Project Idea', icon: <Lightbulb className="w-3.5 h-3.5" /> },
                      { value: 'memory', label: 'Meaningful Memory', icon: <Heart className="w-3.5 h-3.5" /> },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Source / Author</label>
                  <input
                    type="text"
                    placeholder="e.g. Marcus Aurelius / Personal note"
                    value={sourceOrAuthor}
                    onChange={(e) => setSourceOrAuthor(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Content / Excerpt</label>
                <textarea
                  rows={3}
                  required
                  placeholder="The original quote, thought, or memory..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Key Actionable Takeaway</label>
                <input
                  type="text"
                  placeholder="e.g. Take the 2-minute physical step; courage follows movement."
                  value={keyTakeaway}
                  onChange={(e) => setKeyTakeaway(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E1DA]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#B85C3B] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Insight
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
