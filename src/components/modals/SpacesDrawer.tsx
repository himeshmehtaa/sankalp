import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import { SankalpSymbol } from '../brand/SankalpLogo';
import {
  X,
  Target,
  CheckSquare,
  BookOpen,
  Repeat,
  Activity,
  Briefcase,
  DollarSign,
  Library,
  Sparkles,
  BarChart3,
  Settings,
  Shield,
  Download,
} from 'lucide-react';

interface SpacesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSpace: (space: ViewType) => void;
}

export const SpacesDrawer: React.FC<SpacesDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSpace,
}) => {
  const { profile, exportDataJSON } = useApp();

  if (!isOpen) return null;

  const spaces: { id: ViewType; label: string; desc: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'goals', label: 'Goals & Vision', desc: 'Life Vision, 90-day focus & milestones', icon: Target },
    { id: 'tasks', label: 'All Tasks & Backlog', desc: 'Upcoming, someday, completed', icon: CheckSquare },
    { id: 'habits', label: 'Habits & Rhythms', desc: '7-day gentle consistency', icon: Repeat },
    { id: 'journal', label: 'Journal & Notes', desc: 'Private reflections & insights', icon: BookOpen },
    { id: 'health', label: 'Health & Vitality', desc: 'Movement, sleep, and hydration', icon: Activity },
    { id: 'career', label: 'Career Mastery', desc: 'Skills roadmap & opportunities', icon: Briefcase },
    { id: 'finances', label: 'Finances & Admin', desc: 'Runway funds & commitments', icon: DollarSign },
    { id: 'library', label: 'Life Library', desc: 'Guiding principles & book notes', icon: Library },
    { id: 'coach', label: 'AI Life Coach', desc: 'Strategic counsel & goal breakdown', icon: Sparkles },
    { id: 'insights', label: 'Weekly Reviews', desc: 'Actual focus data & reflections', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Privacy', desc: 'Data backup, restore, and profile', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A19]/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-[#FAF8F4] border-l border-[#E7E1DA] shadow-2xl h-full flex flex-col justify-between p-6 z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Top */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E7E1DA]">
            <div className="flex items-center gap-2">
              <SankalpSymbol className="w-4 h-4" fillColor="#B85C3B" />
              <h2 className="text-sm font-semibold tracking-wider font-wordmark uppercase text-[#1B1A19]">
                SANKALP SPACES
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#8F877F] hover:bg-[#F4EFEB] hover:text-[#1B1A19] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Spaces List */}
          <div className="mt-4 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
            {spaces.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSpace(s.id);
                    onClose();
                  }}
                  className="w-full flex items-start gap-3 p-2.5 rounded-xl text-left hover:bg-white border border-transparent hover:border-[#E7E1DA] transition-all group"
                >
                  <div className="p-2 rounded-lg bg-white border border-[#E7E1DA] text-[#78716C] group-hover:text-[#B85C3B] group-hover:border-[#B85C3B]/30 transition-colors shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-[#1B1A19] group-hover:text-[#B85C3B] transition-colors">
                      {s.label}
                    </p>
                    <p className="text-[11px] text-[#8F877F] truncate">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: User & Quick Backup */}
        <div className="pt-4 border-t border-[#E7E1DA] space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8F877F]">
            <span>{profile.name}</span>
            <span className="font-mono text-[10px] text-[#B85C3B]">Offline & Encrypted</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={exportDataJSON}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-[#E7E1DA] text-xs font-medium text-[#57534E] hover:bg-[#FAF8F4] transition-colors"
              title="Download local JSON copy"
            >
              <Download className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>Backup JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
