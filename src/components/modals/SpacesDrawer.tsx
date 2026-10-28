import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
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
    { id: 'tasks', label: 'All Tasks & Lists', desc: 'Upcoming, someday, completed', icon: CheckSquare },
    { id: 'habits', label: 'Habits & Rhythms', desc: '7-day gentle consistency', icon: Repeat },
    { id: 'journal', label: 'Journal & Notes', desc: 'Private reflections & insights', icon: BookOpen },
    { id: 'health', label: 'Health & Vitality', desc: 'Movement, sleep, and hydration', icon: Activity },
    { id: 'career', label: 'Career Mastery', desc: 'Skills roadmap & opportunities', icon: Briefcase },
    { id: 'finances', label: 'Finances & Admin', desc: 'Runway funds & commitments', icon: DollarSign },
    { id: 'library', label: 'Life Library', desc: 'Guiding principles & book notes', icon: Library },
    { id: 'coach', label: 'AI Life Coach', desc: 'Strategic counsel & goal breakdown', icon: Sparkles },
    { id: 'insights', label: 'Weekly Reviews', desc: 'Actual focus data & sabbath reflections', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Privacy', desc: 'Data backup, restore, and profile', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C1917]/30 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm bg-[#FAF8F5] border-l border-[#E8E2D8] shadow-2xl h-full flex flex-col justify-between p-6 z-10 animate-in slide-in-from-right duration-200">
        <div>
          {/* Top */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
              <h2 className="text-sm font-bold tracking-wider font-editorial uppercase text-[#1C1917]">
                Life Spaces
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-[#8F877F] hover:bg-[#EBE5DB]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#8F877F] mt-2 mb-4">
            Deep life management spaces, kept calm and out of the way until you need them.
          </p>

          {/* Spaces List */}
          <div className="space-y-1.5 max-h-[72vh] overflow-y-auto pr-1">
            {spaces.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    onSelectSpace(s.id);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#C85A17]/40 hover:bg-[#FAF0E6]/30 text-left transition-all shadow-2xs group"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] group-hover:bg-[#FAF0E6] flex items-center justify-center text-[#78716C] group-hover:text-[#C85A17] shrink-0 border border-[#E8E2D8] transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1C1917] truncate">{s.label}</p>
                    <p className="text-[10px] text-[#8F877F] truncate">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#E5DDCF] flex items-center justify-center text-[10px] font-bold text-[#57534E]">
              {profile.name.charAt(0)}
            </div>
            <span className="font-semibold text-[#1C1917]">{profile.name}</span>
          </div>

          <button
            onClick={exportDataJSON}
            className="flex items-center gap-1 text-[11px] text-[#C85A17] hover:underline"
          >
            <Download className="w-3 h-3" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>
    </div>
  );
};
