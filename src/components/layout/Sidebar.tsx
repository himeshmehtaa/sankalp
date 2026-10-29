import React from 'react';
import { useApp } from '../../context/AppContext';
import { ViewType } from '../../types';
import { SankalpLogo } from '../brand/SankalpLogo';
import {
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
  ChevronLeft,
  ChevronRight,
  Flame,
  Clock,
  Zap,
} from 'lucide-react';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    sidebarCollapsed,
    setSidebarCollapsed,
    openUnstuckWithState,
    startFocusSession,
    tasks,
    profile,
  } = useApp();

  const todayPendingTasks = tasks.filter(
    (t) => t.bucket === 'today' && t.status !== 'completed'
  ).length;

  const navItems: NavItem[] = [
    { id: 'today', label: 'Today', icon: Compass, badge: todayPendingTasks > 0 ? todayPendingTasks : undefined },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'gratitude', label: 'Gratitude', icon: Heart },
    { id: 'habits', label: 'Habits', icon: Repeat },
    { id: 'health', label: 'Health', icon: Activity },
    { id: 'career', label: 'Career', icon: Briefcase },
    { id: 'finances', label: 'Finances', icon: DollarSign },
    { id: 'library', label: 'Life Library', icon: Library },
    { id: 'coach', label: 'AI Coach', icon: Sparkles },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-[#E7E1DA] bg-[#F7F4EE] transition-all duration-300 ease-in-out select-none ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Main sidebar navigation"
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#E7E1DA]">
        {!sidebarCollapsed ? (
          <div className="flex flex-col">
            <SankalpLogo variant="full" size="md" />
          </div>
        ) : (
          <div className="mx-auto flex flex-col items-center">
            <SankalpLogo variant="symbol" size="sm" />
          </div>
        )}

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-md text-[#8F877F] hover:text-[#1B1A19] hover:bg-[#E7E1DA] transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Signature Quick Actions */}
      <div className="p-3 space-y-2">
        {/* Get Me Unstuck */}
        <button
          onClick={() => openUnstuckWithState()}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group shadow-xs ${
            sidebarCollapsed
              ? 'justify-center bg-[#F8EDE8] text-[#B85C3B] hover:bg-[#F5E2D0]'
              : 'bg-gradient-to-r from-[#F8EDE8] to-[#F5E6D8] text-[#9A420E] border border-[#E7E1DA] hover:border-[#D97706]/40 hover:shadow-sm'
          }`}
          title="Get Me Unstuck (Press U)"
        >
          <Zap className="w-4 h-4 text-[#B85C3B] shrink-0 group-hover:scale-110 transition-transform" />
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between flex-1 text-left">
              <span className="font-semibold text-xs tracking-wide">Get Me Unstuck</span>
              <kbd className="text-[10px] bg-[#FFFFFF]/80 text-[#8F877F] px-1.5 py-0.5 rounded border border-[#E7E1DA]">
                U
              </kbd>
            </div>
          )}
        </button>

        {/* Focus Mode */}
        <button
          onClick={() => startFocusSession(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-[#57534E] hover:text-[#1B1A19] hover:bg-[#EBE5DB] ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Start Focus Timer"
        >
          <Clock className="w-4 h-4 text-[#8F877F] shrink-0" />
          {!sidebarCollapsed && <span>Deep Focus Mode</span>}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5" role="navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                isActive
                  ? 'bg-[#FFFFFF] text-[#1B1A19] shadow-xs font-semibold border border-[#E2DBD0]'
                  : 'text-[#6B655F] hover:text-[#1B1A19] hover:bg-[#EBE5DB]/70'
              } ${sidebarCollapsed ? 'justify-center px-2' : ''}`}
              title={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#B85C3B]' : 'text-[#8F877F]'
                }`}
              />
              {!sidebarCollapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold bg-[#B85C3B]/10 text-[#B85C3B] rounded-full">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* User & Guiding Principle Footer */}
      <div className="p-3 border-t border-[#E7E1DA]/60 bg-[#F3EFE8]/70">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E5DDCF] flex items-center justify-center text-xs font-bold text-[#57534E] border border-[#DDD4C3]">
              {profile.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#1B1A19] truncate">{profile.name}</p>
              <p className="text-[10px] text-[#8F877F] truncate capitalize">
                Mood: {profile.todayMood.replace('-', ' ')}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-[#E5DDCF] flex items-center justify-center text-xs font-bold text-[#57534E]">
              {profile.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
