import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, CheckCircle2, Repeat, Flame } from 'lucide-react';

export const VitalityRings: React.FC = () => {
  const { focusSessions, tasks, habits } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  // 1. Focus Minutes (Target: 90 mins)
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.actualMinutes, 0);
  const targetFocus = 90;
  const focusPct = Math.min(100, Math.round((totalFocusMinutes / targetFocus) * 100));

  // 2. Priorities Completed (Target: 3)
  const todayTasks = tasks.filter((t) => t.bucket === 'today');
  const completedToday = todayTasks.filter((t) => t.status === 'completed').length;
  const taskPct = todayTasks.length > 0 ? Math.min(100, Math.round((completedToday / Math.min(3, todayTasks.length)) * 100)) : 0;

  // 3. Habits (Target: active habits)
  const activeHabits = habits.filter((h) => h.status === 'active');
  const habitsDone = activeHabits.filter((h) => h.completions.includes(todayStr)).length;
  const habitPct = activeHabits.length > 0 ? Math.min(100, Math.round((habitsDone / activeHabits.length) * 100)) : 0;

  // SVG Circular math
  const size = 140;
  const strokeWidth = 10;
  const center = size / 2;

  // Ring 1 (Outer - Focus): r = 58
  const r1 = 56;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (focusPct / 100) * c1;

  // Ring 2 (Middle - Priorities): r = 44
  const r2 = 43;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (taskPct / 100) * c2;

  // Ring 3 (Inner - Habits): r = 30
  const r3 = 30;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (habitPct / 100) * c3;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-br from-[#161722] to-[#0E0F15] text-white border border-white/10 shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C85A17]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Left Info */}
      <div className="space-y-3 z-10 flex-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            Daily Momentum
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white font-editorial">
          Today's Vitality Rings
        </h3>
        <p className="text-xs text-white/60 leading-relaxed max-w-sm">
          Progress without punitive guilt. Show up for focused work, proof actions, and daily rhythm.
        </p>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
            <div>
              <p className="text-[10px] text-white/50">Focus</p>
              <p className="font-semibold text-white">{totalFocusMinutes}m / {targetFocus}m</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <div>
              <p className="text-[10px] text-white/50">Actions</p>
              <p className="font-semibold text-white">{completedToday} / {todayTasks.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
            <div>
              <p className="text-[10px] text-white/50">Rhythms</p>
              <p className="font-semibold text-white">{habitsDone} / {activeHabits.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: SVG Concentric Rings */}
      <div className="relative shrink-0 flex items-center justify-center select-none z-10">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background tracks */}
          <circle cx={center} cy={center} r={r1} stroke="#2D211B" strokeWidth={strokeWidth} fill="none" />
          <circle cx={center} cy={center} r={r2} stroke="#2E2619" strokeWidth={strokeWidth} fill="none" />
          <circle cx={center} cy={center} r={r3} stroke="#172A22" strokeWidth={strokeWidth} fill="none" />

          {/* Animated active strokes */}
          <circle
            cx={center}
            cy={center}
            r={r1}
            stroke="#EA580C"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={c1}
            strokeDashoffset={offset1}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={r2}
            stroke="#F59E0B"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={c2}
            strokeDashoffset={offset2}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <circle
            cx={center}
            cy={center}
            r={r3}
            stroke="#10B981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={c3}
            strokeDashoffset={offset3}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Flame Icon */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]/20 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-white/80 mt-0.5">
            {Math.round((focusPct + taskPct + habitPct) / 3)}%
          </span>
        </div>
      </div>
    </div>
  );
};
