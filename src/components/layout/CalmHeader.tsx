import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  Sun,
  CheckSquare,
  Wind,
  Clock,
  Heart,
  Menu,
  Zap,
  Plus,
} from 'lucide-react';

interface CalmHeaderProps {
  onOpenSpaces: () => void;
  activeTab: 'today' | 'focus' | 'breathe' | 'reflect';
  setActiveTab: (tab: 'today' | 'focus' | 'breathe' | 'reflect') => void;
  activeDeepSpace?: ViewType | null;
  onSelectDeepSpace?: (space: ViewType | null) => void;
  onOpenCapture?: () => void;
}

export const CalmHeader: React.FC<CalmHeaderProps> = ({
  onOpenSpaces,
  activeTab,
  setActiveTab,
  activeDeepSpace,
  onSelectDeepSpace,
  onOpenCapture,
}) => {
  const { openUnstuckWithState } = useApp();

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]/70 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('today');
          }}
          className="flex items-center gap-2 text-left"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-xs" />
          <span className="text-lg font-bold tracking-[0.24em] text-[#1C1917] font-editorial">
            SANKALP
          </span>
        </button>
      </div>

      {/* Center Tabs: Today, Tasks, Breathe, Focus, Reflect */}
      <nav className="hidden md:flex items-center gap-1 bg-[#F2EFEB]/80 p-1 rounded-full border border-[#E8E2D8]">
        {/* Today */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('today');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeDeepSpace && activeTab === 'today'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Today</span>
        </button>

        {/* Tasks */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace('tasks');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeDeepSpace === 'tasks'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#6366F1]" />
          <span>Tasks</span>
        </button>

        {/* Breathe & Meditation */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('breathe');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeDeepSpace && activeTab === 'breathe'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Breathe</span>
        </button>

        {/* Focus */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('focus');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeDeepSpace && activeTab === 'focus'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Focus</span>
        </button>

        {/* Reflect */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('reflect');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeDeepSpace && activeTab === 'reflect'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Reflect</span>
        </button>
      </nav>

      {/* Right Controls: + Capture, Unstuck, Spaces Drawer */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Capture Button */}
        {onOpenCapture && (
          <button
            onClick={onOpenCapture}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#1C1917] text-white hover:bg-[#2F2B28] text-xs font-semibold shadow-xs transition-transform active:scale-95"
            title="Quick Capture thought or task"
          >
            <Plus className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="hidden sm:inline">Capture</span>
          </button>
        )}

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
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#E8E2D8] hover:bg-[#FAF8F5] text-[#1C1917] text-xs font-semibold shadow-2xs transition-colors"
          title="All Life Spaces & Settings"
        >
          <Menu className="w-4 h-4 text-[#78716C]" />
          <span className="hidden sm:inline">Spaces</span>
        </button>
      </div>
    </header>
  );
};
