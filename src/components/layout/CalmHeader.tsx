import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Clock,
  Wind,
  Heart,
  Menu,
  Zap,
} from 'lucide-react';

interface CalmHeaderProps {
  onOpenSpaces: () => void;
  activeTab: 'today' | 'focus' | 'breathe' | 'reflect';
  setActiveTab: (tab: 'today' | 'focus' | 'breathe' | 'reflect') => void;
}

export const CalmHeader: React.FC<CalmHeaderProps> = ({
  onOpenSpaces,
  activeTab,
  setActiveTab,
}) => {
  const { openUnstuckWithState } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]/70 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17] shadow-xs" />
          <span className="text-lg font-bold tracking-[0.24em] text-[#1C1917] font-editorial">
            SANKALP
          </span>
        </div>
      </div>

      {/* Center Tabs: The 4 Core Experiences */}
      <nav className="hidden md:flex items-center gap-1 bg-[#F2EFEB]/80 p-1 rounded-full border border-[#E8E2D8]">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'today'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Today</span>
        </button>

        <button
          onClick={() => setActiveTab('focus')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'focus'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => setActiveTab('breathe')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'breathe'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-[#4D6B53]" />
          <span>Breathe</span>
        </button>

        <button
          onClick={() => setActiveTab('reflect')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'reflect'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Reflect</span>
        </button>
      </nav>

      {/* Right Controls: Unstuck + Spaces Drawer */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Get Me Unstuck */}
        <button
          onClick={() => openUnstuckWithState()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FAF0E6] text-[#9A420E] border border-[#E9D5C3] hover:bg-[#F5E2D0] text-xs font-semibold shadow-2xs transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Get Unstuck</span>
        </button>

        {/* All Spaces / Menu Drawer Button */}
        <button
          onClick={onOpenSpaces}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors"
          title="All Life Spaces & Settings"
        >
          <Menu className="w-4 h-4 text-[#FAF8F5]" />
          <span className="hidden sm:inline">All Spaces</span>
        </button>
      </div>
    </header>
  );
};
