import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import { SankalpLogo } from '../brand/SankalpLogo';
import {
  Sun,
  Compass,
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
    <header className="sticky top-0 z-30 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E7E1DA] px-4 sm:px-8 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('today');
          }}
          className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
          title="Return to Today"
        >
          <SankalpLogo variant="horizontal" size="sm" />
        </button>
      </div>

      {/* Center Tabs: Today, Tasks, Breathe, Focus, Reflect */}
      <nav className="hidden md:flex items-center gap-1 bg-[#F4EFEB] p-1 rounded-full border border-[#E7E1DA]">
        {/* Today */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('today');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeDeepSpace && activeTab === 'today'
              ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs'
              : 'text-[#78716C] hover:text-[#1B1A19]'
          }`}
        >
          <Sun className="w-3.5 h-3.5 text-[#B85C3B]" />
          <span>Today</span>
        </button>

        {/* Tasks */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace('tasks');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeDeepSpace === 'tasks'
              ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs'
              : 'text-[#78716C] hover:text-[#1B1A19]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#1B1A19]" />
          <span>Tasks</span>
        </button>

        {/* Guided Journeys */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace('journeys');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeDeepSpace === 'journeys'
              ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs'
              : 'text-[#78716C] hover:text-[#1B1A19]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#B85C3B]" />
          <span>Journeys</span>
        </button>

        {/* Breathe & Meditation */}
        <button
          onClick={() => {
            if (onSelectDeepSpace) onSelectDeepSpace(null);
            setActiveTab('breathe');
          }}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            !activeDeepSpace && activeTab === 'breathe'
              ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs'
              : 'text-[#78716C] hover:text-[#1B1A19]'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-[#6B7A5B]" />
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
              ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs'
              : 'text-[#78716C] hover:text-[#1B1A19]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#B85C3B]" />
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
              ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-2xs'
              : 'text-[#78716C] hover:text-[#1B1A19]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#B85C3B]" />
          <span>Reflect</span>
        </button>
      </nav>

      {/* Right Controls: + Capture, Unstuck, Spaces Drawer */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Quick Capture Button (Desktop) */}
        {onOpenCapture && (
          <button
            onClick={onOpenCapture}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1B1A19] text-[#FAF8F4] hover:bg-[#2B2927] text-xs font-semibold shadow-xs transition-transform active:scale-95"
            title="Quick Capture thought or task (Ctrl+K or tap)"
          >
            <Plus className="w-3.5 h-3.5 text-[#B85C3B]" />
            <span>Capture</span>
          </button>
        )}

        {/* Get Me Unstuck */}
        <button
          onClick={() => openUnstuckWithState()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F8EDE8] text-[#B85C3B] border border-[#E7E1DA] hover:bg-[#F2E2DA] text-xs font-semibold shadow-2xs transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-[#B85C3B]" />
          <span>Get Unstuck</span>
        </button>

        {/* All Spaces / Menu Drawer Button */}
        <button
          onClick={onOpenSpaces}
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-full bg-white border border-[#E7E1DA] hover:bg-[#FAF8F4] text-[#1B1A19] text-xs font-semibold shadow-2xs transition-colors"
          title="All Life Spaces & Settings"
        >
          <Menu className="w-4 h-4 text-[#78716C]" />
          <span className="hidden sm:inline">Spaces</span>
        </button>
      </div>
    </header>
  );
};
