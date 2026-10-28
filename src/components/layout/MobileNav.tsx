import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import {
  Compass,
  Target,
  Plus,
  BarChart3,
  Menu,
  X,
  CheckSquare,
  BookOpen,
  Heart,
  Repeat,
  Activity,
  Briefcase,
  DollarSign,
  Library,
  Sparkles,
  Settings,
  Zap,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    setIsQuickCaptureOpen,
    openUnstuckWithState,
    profile,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primaryItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'today', label: 'Today', icon: Compass },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  const drawerItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'journal', label: 'Journal & Notes', icon: BookOpen },
    { id: 'gratitude', label: 'Gratitude & Reflection', icon: Heart },
    { id: 'habits', label: 'Habits & Routines', icon: Repeat },
    { id: 'health', label: 'Health & Vitality', icon: Activity },
    { id: 'career', label: 'Career & Growth', icon: Briefcase },
    { id: 'finances', label: 'Finances & Admin', icon: DollarSign },
    { id: 'library', label: 'Life Library', icon: Library },
    { id: 'coach', label: 'AI Life Coach', icon: Sparkles },
    { id: 'settings', label: 'Settings & Data', icon: Settings },
  ];

  const handleSelectView = (v: ViewType) => {
    setCurrentView(v);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Bottom Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF8F5]/98 backdrop-blur-md border-t border-[#E8E2D8] px-3 py-2 flex items-center justify-around"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => handleSelectView('today')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
            currentView === 'today' ? 'text-[#C85A17] font-semibold' : 'text-[#78716C]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Today</span>
        </button>

        <button
          onClick={() => handleSelectView('goals')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
            currentView === 'goals' ? 'text-[#C85A17] font-semibold' : 'text-[#78716C]'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>Goals</span>
        </button>

        {/* Center Floating Quick-Capture FAB */}
        <button
          onClick={() => setIsQuickCaptureOpen(true)}
          className="w-12 h-12 -mt-5 rounded-full bg-[#1C1917] text-[#FAF8F5] flex items-center justify-center shadow-md active:scale-95 transition-transform border-2 border-[#FAF8F5]"
          title="Quick Capture"
          aria-label="Quick Capture"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={() => handleSelectView('insights')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
            currentView === 'insights' ? 'text-[#C85A17] font-semibold' : 'text-[#78716C]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Insights</span>
        </button>

        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[11px] font-medium transition-colors ${
            isMenuOpen || drawerItems.some((d) => d.id === currentView)
              ? 'text-[#C85A17] font-semibold'
              : 'text-[#78716C]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span>Spaces</span>
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-[#1C1917]/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="relative bg-[#FAF8F5] rounded-t-2xl max-h-[82vh] overflow-y-auto p-5 border-t border-[#E8E2D8] shadow-2xl z-50 animate-in slide-in-from-bottom duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
                <span className="font-bold text-sm tracking-widest font-editorial text-[#1C1917]">
                  SANKALP SPACES
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-lg text-[#8F877F] hover:bg-[#EBE5DB]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Unstuck Banner */}
            <div className="mt-4">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  openUnstuckWithState();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-r from-[#FAF0E6] to-[#F5E6D8] border border-[#E9D5C3] text-[#9A420E]"
              >
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#C85A17]" />
                  <div className="text-left">
                    <p className="text-xs font-bold">Get Me Unstuck</p>
                    <p className="text-[11px] text-[#78716C]">
                      Interrupt overthinking, avoidance, or scrolling
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold bg-[#FFFFFF]/80 px-2 py-0.5 rounded text-[#C85A17]">
                  Action
                </span>
              </button>
            </div>

            {/* Spaces Grid */}
            <div className="grid grid-cols-2 gap-2 mt-4 pb-12">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectView(item.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#FFFFFF] border-[#C85A17] text-[#C85A17] font-semibold shadow-2xs'
                        : 'bg-[#FFFFFF] border-[#E8E2D8] text-[#57534E] hover:border-[#D6CEBE]'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-[#8F877F]" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
