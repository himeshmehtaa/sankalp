import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  Search,
  X,
  Compass,
  Target,
  CheckSquare,
  BookOpen,
  Heart,
  Repeat,
  Activity,
  Briefcase,
  DollarSign,
  Library,
  Sparkles,
  BarChart3,
  Settings,
  Zap,
  Clock,
  Plus,
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    setCurrentView,
    openUnstuckWithState,
    startFocusSession,
    setIsQuickCaptureOpen,
    goals,
    tasks,
    journalEntries,
  } = useApp();

  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
    }
  }, [isCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (view: ViewType) => {
    setCurrentView(view);
    setIsCommandPaletteOpen(false);
  };

  const navActions: { label: string; view: ViewType; icon: React.ComponentType<{ className?: string }> }[] = [
    { label: "Go to Today's Dashboard", view: 'today', icon: Compass },
    { label: 'Go to Goals & Life Planning', view: 'goals', icon: Target },
    { label: 'Go to Tasks & Execution', view: 'tasks', icon: CheckSquare },
    { label: 'Go to Journal & Reflections', view: 'journal', icon: BookOpen },
    { label: 'Go to Gratitude Practice', view: 'gratitude', icon: Heart },
    { label: 'Go to Habits & Routines', view: 'habits', icon: Repeat },
    { label: 'Go to Health & Vitality', view: 'health', icon: Activity },
    { label: 'Go to Career & Growth', view: 'career', icon: Briefcase },
    { label: 'Go to Finances & Life Admin', view: 'finances', icon: DollarSign },
    { label: 'Go to Life Library & Principles', view: 'library', icon: Library },
    { label: 'Go to AI Life Coach', view: 'coach', icon: Sparkles },
    { label: 'Go to Insights & Reviews', view: 'insights', icon: BarChart3 },
    { label: 'Go to Settings & Backup', view: 'settings', icon: Settings },
  ];

  const filteredNav = navActions.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );

  const matchedTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  );

  const matchedGoals = goals.filter((g) =>
    g.title.toLowerCase().includes(query.toLowerCase())
  );

  const matchedJournal = journalEntries.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#1C1917]/50 backdrop-blur-xs animate-in fade-in duration-100"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="relative w-full max-w-xl bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl overflow-hidden text-[#1C1917]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E8E2D8] gap-3">
          <Search className="w-5 h-5 text-[#8F877F] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search goals, tasks, journal, or jump to space..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-[#8F877F] text-[#1C1917]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#8F877F] hover:bg-[#EBE5DB]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-[10px] bg-[#F2EFEB] px-1.5 py-0.5 rounded border border-[#E8E2D8] text-[#8F877F]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-4">
          {/* Quick Shortcuts */}
          <div>
            <p className="text-[10px] font-bold text-[#8F877F] uppercase tracking-wider px-3 py-1">
              Quick Interventions
            </p>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  openUnstuckWithState();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#FAF0E6] text-xs font-semibold text-[#C85A17] text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4" />
                  <span>Get Me Unstuck</span>
                </div>
                <span className="text-[10px] bg-[#FAF0E6] text-[#C85A17] px-1.5 py-0.5 rounded border border-[#E9D5C3]">
                  Action
                </span>
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  startFocusSession(null);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2EFEB] text-xs font-semibold text-[#1C1917] text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#8F877F]" />
                  <span>Start Focus Session</span>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsCommandPaletteOpen(false);
                  setIsQuickCaptureOpen(true);
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2EFEB] text-xs font-semibold text-[#1C1917] text-left transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Plus className="w-4 h-4 text-[#8F877F]" />
                  <span>Quick Capture (C)</span>
                </div>
              </button>
            </div>
          </div>

          {/* Navigation Matches */}
          {filteredNav.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#8F877F] uppercase tracking-wider px-3 py-1">
                Spaces & Navigation
              </p>
              <div className="space-y-0.5">
                {filteredNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.view}
                      onClick={() => navigateTo(item.view)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F2EFEB] text-xs text-[#57534E] text-left transition-colors"
                    >
                      <Icon className="w-4 h-4 text-[#8F877F]" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks matches */}
          {query && matchedTasks.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#8F877F] uppercase tracking-wider px-3 py-1">
                Tasks ({matchedTasks.length})
              </p>
              <div className="space-y-0.5">
                {matchedTasks.slice(0, 5).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => navigateTo('tasks')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2EFEB] text-xs text-[#1C1917] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <CheckSquare className="w-3.5 h-3.5 text-[#8F877F]" />
                      <span className="truncate">{t.title}</span>
                    </div>
                    <span className="text-[10px] text-[#8F877F] capitalize shrink-0 ml-2">
                      {t.bucket}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Goals matches */}
          {query && matchedGoals.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#8F877F] uppercase tracking-wider px-3 py-1">
                Goals ({matchedGoals.length})
              </p>
              <div className="space-y-0.5">
                {matchedGoals.slice(0, 5).map((g) => (
                  <button
                    key={g.id}
                    onClick={() => navigateTo('goals')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2EFEB] text-xs text-[#1C1917] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Target className="w-3.5 h-3.5 text-[#C85A17]" />
                      <span className="truncate">{g.title}</span>
                    </div>
                    <span className="text-[10px] text-[#8F877F] capitalize shrink-0 ml-2">
                      {g.level}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Journal matches */}
          {query && matchedJournal.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-[#8F877F] uppercase tracking-wider px-3 py-1">
                Journal ({matchedJournal.length})
              </p>
              <div className="space-y-0.5">
                {matchedJournal.slice(0, 4).map((j) => (
                  <button
                    key={j.id}
                    onClick={() => navigateTo('journal')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-[#F2EFEB] text-xs text-[#1C1917] text-left transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <BookOpen className="w-3.5 h-3.5 text-[#78716C]" />
                      <span className="truncate">{j.title}</span>
                    </div>
                    <span className="text-[10px] text-[#8F877F] shrink-0 ml-2">{j.date}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
