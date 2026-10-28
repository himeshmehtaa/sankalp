import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Zap,
  Clock,
  Sparkles,
  Smile,
  Compass,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    profile,
    updateProfile,
    openUnstuckWithState,
    startFocusSession,
    setIsQuickCaptureOpen,
    setIsCommandPaletteOpen,
  } = useApp();

  const [showMoodMenu, setShowMoodMenu] = useState(false);

  // Determine greeting
  const hour = new Date().getHours();
  let greetingTime = 'morning';
  if (hour >= 12 && hour < 17) greetingTime = 'afternoon';
  else if (hour >= 17) greetingTime = 'evening';

  // Format date
  const todayDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const moodOptions: { key: typeof profile.todayMood; label: string; dotColor: string }[] = [
    { key: 'focused', label: 'Focused', dotColor: 'bg-[#C85A17]' },
    { key: 'serene', label: 'Serene', dotColor: 'bg-[#4D6B53]' },
    { key: 'reflective', label: 'Reflective', dotColor: 'bg-[#7C3AED]' },
    { key: 'seeking-clarity', label: 'Seeking Clarity', dotColor: 'bg-[#D97706]' },
    { key: 'restless', label: 'Restless', dotColor: 'bg-[#DC2626]' },
  ];

  return (
    <header className="sticky top-0 z-20 bg-[#FAF8F5]/95 backdrop-blur-sm border-b border-[#E8E2D8] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left: Greeting & Date */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-semibold text-[#1C1917] tracking-tight">
            Good {greetingTime}, {profile.name}
          </h1>
          <span className="hidden sm:inline-block text-[#DDD7CB]">•</span>
          <span className="hidden sm:inline-block text-xs font-serif-quote italic text-[#78716C]">
            "{profile.guidingPrinciple}"
          </span>
        </div>
        <p className="text-xs text-[#8F877F] mt-0.5">{todayDateStr}</p>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mood & Energy Check-in Pill */}
        <div className="relative">
          <button
            onClick={() => setShowMoodMenu(!showMoodMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-full border border-[#E8E2D8] bg-[#FFFFFF] hover:border-[#D6CEBE] text-xs text-[#57534E] shadow-2xs transition-colors"
            title="Check in your current state"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                moodOptions.find((m) => m.key === profile.todayMood)?.dotColor || 'bg-[#C85A17]'
              }`}
            />
            <span className="capitalize hidden sm:inline">
              {profile.todayMood.replace('-', ' ')}
            </span>
            <span className="text-[10px] bg-[#F2EFEB] px-1 rounded text-[#78716C]">
              ⚡{profile.energyLevel}/5
            </span>
          </button>

          {/* Mood Popover */}
          {showMoodMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#E2DBD0] rounded-xl shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setShowMoodMenu(false)}
            >
              <p className="text-[11px] font-semibold text-[#8F877F] uppercase tracking-wider px-2 py-1">
                Current Mindset
              </p>
              <div className="space-y-0.5 mt-1">
                {moodOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      updateProfile({ todayMood: opt.key });
                      setShowMoodMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                      profile.todayMood === opt.key
                        ? 'bg-[#FAF0E6] text-[#C85A17] font-medium'
                        : 'text-[#57534E] hover:bg-[#F7F4EE]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${opt.dotColor}`} />
                      <span>{opt.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-[#E8E2D8] mt-2 pt-2 px-2">
                <p className="text-[11px] font-semibold text-[#8F877F] mb-1.5">Energy Level</p>
                <div className="flex justify-between gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => {
                        updateProfile({ energyLevel: lvl });
                        setShowMoodMenu(false);
                      }}
                      className={`flex-1 py-1 rounded text-xs font-medium transition-colors ${
                        profile.energyLevel === lvl
                          ? 'bg-[#C85A17] text-[#FFFFFF]'
                          : 'bg-[#F2EFEB] text-[#57534E] hover:bg-[#E8E2D8]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Global Search / Command Palette (Cmd+K) */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] hover:border-[#D6CEBE] text-xs text-[#78716C] shadow-2xs transition-colors"
          title="Search anything (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#8F877F]" />
          <span>Search...</span>
          <kbd className="text-[10px] bg-[#F2EFEB] px-1 py-0.5 rounded border border-[#E8E2D8] text-[#8F877F]">
            ⌘K
          </kbd>
        </button>

        {/* Get Me Unstuck Trigger */}
        <button
          onClick={() => openUnstuckWithState()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF0E6] text-[#9A420E] border border-[#E9D5C3] hover:bg-[#F5E2D0] hover:border-[#D97706]/40 text-xs font-semibold shadow-2xs transition-all"
          title="Get Me Unstuck"
        >
          <Zap className="w-3.5 h-3.5 text-[#C85A17]" />
          <span className="hidden xs:inline">Get Me Unstuck</span>
        </button>

        {/* Quick Capture (C) */}
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-medium shadow-2xs transition-colors"
          title="Quick Capture (Press C)"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Capture</span>
        </button>
      </div>
    </header>
  );
};
