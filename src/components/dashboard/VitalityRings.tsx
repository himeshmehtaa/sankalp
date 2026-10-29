import React from 'react';
import { useApp } from '../../context/AppContext';
import { SankalpSymbol } from '../brand/SankalpLogo';
import { ConstellationDots, GradientBlob } from '../brand/Illustrations';
import {
  Clock,
  CheckCircle2,
  Repeat,
  Droplets,
  Play,
  Target,
  Sun,
  Moon,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VitalityRings: React.FC = () => {
  const {
    focusSessions,
    tasks,
    habits,
    healthLogs,
    addOrUpdateHealthLog,
    startFocusSession,
    showToast,
  } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingTodayHealth = healthLogs.find((l) => l.date === todayStr);

  // 1. Focus Minutes (Target: 90 mins)
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.actualMinutes, 0);
  const targetFocus = 90;
  const focusPct = Math.min(100, Math.round((totalFocusMinutes / targetFocus) * 100));

  // 2. Proof / Today's Actions Completed
  const todayTasks = tasks.filter((t) => t.bucket === 'today');
  const completedToday = todayTasks.filter((t) => t.status === 'completed').length;
  const totalTodayTasks = Math.max(1, todayTasks.length);
  const taskPct = Math.min(100, Math.round((completedToday / totalTodayTasks) * 100));

  // 3. Habits (Target: active habits)
  const activeHabits = habits.filter((h) => h.status === 'active');
  const habitsDone = activeHabits.filter((h) => h.completions.includes(todayStr)).length;
  const habitPct = activeHabits.length > 0 ? Math.min(100, Math.round((habitsDone / activeHabits.length) * 100)) : 0;

  // 4. Hydration count from HealthLog
  const currentWater = existingTodayHealth?.waterGlasses || 5;

  const handleAddWater = () => {
    const nextWater = currentWater + 1;
    addOrUpdateHealthLog({
      id: existingTodayHealth?.id || `hl-${Date.now()}`,
      date: todayStr,
      movementMinutes: existingTodayHealth?.movementMinutes || 30,
      movementType: existingTodayHealth?.movementType || 'Walk & Mobility',
      sleepHours: existingTodayHealth?.sleepHours || 7.5,
      sleepQuality: existingTodayHealth?.sleepQuality || 'restful',
      waterGlasses: nextWater,
      energyRating: existingTodayHealth?.energyRating || 4,
      notes: existingTodayHealth?.notes || '',
    });

    try {
      confetti({ particleCount: 15, spread: 35, colors: ['#B85C3B', '#E7E1DA', '#6B7A5B'] });
    } catch (e) {}

    showToast(`Hydration logged: ${nextWater}/8 glasses 💧`);
  };

  // Proof action task
  const proofTask = todayTasks.find((t) => t.priority === 'proof' && t.status !== 'completed') || todayTasks[0];

  // Current Circadian Phase Calculation
  const currentHour = new Date().getHours();
  let circadianPhase = 'Morning Clarity';
  let circadianBadge = 'Waking & Intention';
  let circadianDesc = 'Cortisol rising naturally. Set primary intention before opening incoming feeds.';
  if (currentHour >= 10 && currentHour < 14) {
    circadianPhase = 'Peak Cognitive Focus';
    circadianBadge = 'Golden Window';
    circadianDesc = 'Peak prefrontal cortex activation. Best window for your #1 Proof Action.';
  } else if (currentHour >= 14 && currentHour < 18) {
    circadianPhase = 'Afternoon Execution';
    circadianBadge = 'Action Flow';
    circadianDesc = 'Tactical execution, communication, and movement.';
  } else if (currentHour >= 18) {
    circadianPhase = 'Evening Stillness';
    circadianBadge = 'Wind Down';
    circadianDesc = 'Melatonin synthesis. Unclutter mind with reflection and dim warm light.';
  }

  // SVG Concentric Rings Geometry
  const size = 150;
  const strokeWidth = 9;
  const center = size / 2;

  // Ring 1 (Focus - Terracotta): r = 60
  const r1 = 60;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (focusPct / 100) * c1;

  // Ring 2 (Actions - Ivory/Stone): r = 46
  const r2 = 46;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (taskPct / 100) * c2;

  // Ring 3 (Habits - Sage): r = 32
  const r3 = 32;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (habitPct / 100) * c3;

  return (
    <div className="rounded-3xl bg-[#FFFFFF] text-[#1B1A19] border border-[#E7E1DA] shadow-xs overflow-hidden transition-all relative">
      {/* Background Subtle Constellation Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 opacity-25 pointer-events-none">
        <ConstellationDots className="w-full h-full" color="#B85C3B" />
      </div>

      {/* Main Top Row: Info & Concentric Rings */}
      <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Information Column */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B85C3B] animate-pulse" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B85C3B] font-wordmark">
              Live Daily Momentum
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4EFEB] text-[#78716C] border border-[#E7E1DA] font-medium">
              Sankalp OS
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1B1A19] font-editorial">
            Daily Vitality & Rhythm
          </h3>

          <p className="text-xs text-[#57534E] leading-relaxed max-w-md">
            Deliberate commitment in action: deep focused craft, intentional daily proof, and healthy biological recovery.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {/* Metric 1: Focus */}
            <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#B85C3B]" />
                <span className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">
                  Focus
                </span>
              </div>
              <p className="text-sm font-bold text-[#1B1A19]">{totalFocusMinutes}m</p>
              <p className="text-[10px] text-[#8F877F]">{targetFocus}m target</p>
            </div>

            {/* Metric 2: Actions */}
            <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#1B1A19]" />
                <span className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">
                  Actions
                </span>
              </div>
              <p className="text-sm font-bold text-[#1B1A19]">
                {completedToday}/{todayTasks.length || 1}
              </p>
              <p className="text-[10px] text-[#8F877F]">Done today</p>
            </div>

            {/* Metric 3: Habits */}
            <div className="p-3 rounded-2xl bg-[#FAF8F4] border border-[#E7E1DA]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#6B7A5B]" />
                <span className="text-[10px] text-[#78716C] uppercase tracking-wider font-semibold">
                  Rhythms
                </span>
              </div>
              <p className="text-sm font-bold text-[#1B1A19]">
                {habitsDone}/{activeHabits.length || 1}
              </p>
              <p className="text-[10px] text-[#8F877F]">Habits checked</p>
            </div>
          </div>
        </div>

        {/* Right: SVG Concentric Rings */}
        <div className="relative shrink-0 flex items-center justify-center select-none">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Tracks */}
            <circle cx={center} cy={center} r={r1} stroke="#E7E1DA" strokeWidth={strokeWidth} fill="none" />
            <circle cx={center} cy={center} r={r2} stroke="#E7E1DA" strokeWidth={strokeWidth} fill="none" />
            <circle cx={center} cy={center} r={r3} stroke="#E7E1DA" strokeWidth={strokeWidth} fill="none" />

            {/* Active Brand Arcs */}
            {/* 1. Focus: Terracotta #B85C3B */}
            <circle
              cx={center}
              cy={center}
              r={r1}
              stroke="#B85C3B"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c1}
              strokeDashoffset={offset1}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* 2. Actions: Charcoal #1B1A19 */}
            <circle
              cx={center}
              cy={center}
              r={r2}
              stroke="#1B1A19"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c2}
              strokeDashoffset={offset2}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            {/* 3. Habits: Sage #6B7A5B */}
            <circle
              cx={center}
              cy={center}
              r={r3}
              stroke="#6B7A5B"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c3}
              strokeDashoffset={offset3}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Brand Symbol */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <SankalpSymbol className="w-5 h-5" fillColor="#B85C3B" />
            <span className="text-[10px] font-mono font-bold text-[#1B1A19] mt-1">
              {Math.round((focusPct + taskPct + habitPct) / 3)}%
            </span>
          </div>
        </div>
      </div>

      {/* Circadian Energy Wave Banner */}
      <div className="px-6 sm:px-8 py-3 bg-[#F4EFEB] border-t border-b border-[#E7E1DA] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {currentHour >= 18 || currentHour < 6 ? (
            <Moon className="w-4 h-4 text-[#78716C]" />
          ) : (
            <Sun className="w-4 h-4 text-[#B85C3B]" />
          )}
          <span className="font-semibold text-[#1B1A19]">{circadianPhase}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#57534E] border border-[#E7E1DA]">
            {circadianBadge}
          </span>
        </div>
        <p className="text-[11px] text-[#78716C] italic truncate">
          "{circadianDesc}"
        </p>
      </div>

      {/* High-Utility Quick Actions Row */}
      <div className="p-4 sm:p-6 bg-[#FAF8F4] grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 1. Quick Hydration Dial */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7E1DA] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EEF2EC] text-[#6B7A5B] border border-[#E7E1DA] flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4 text-[#6B7A5B]" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#1B1A19]">Daily Hydration</p>
              <p className="text-[11px] text-[#78716C] font-mono">
                {currentWater}/8 glasses logged
              </p>
            </div>
          </div>

          <button
            onClick={handleAddWater}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#6B7A5B] hover:bg-[#5A684C] text-white text-xs font-bold transition-transform active:scale-95 shadow-2xs"
          >
            <span>+1 Glass</span>
          </button>
        </div>

        {/* 2. Instant Proof Action Shortcut */}
        <div className="p-3.5 rounded-2xl bg-white border border-[#E7E1DA] flex items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-[#F8EDE8] text-[#B85C3B] border border-[#E7E1DA] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-[#1B1A19] truncate">
                {proofTask ? proofTask.title : 'No active proof action'}
              </p>
              <p className="text-[11px] text-[#78716C]">
                {proofTask && proofTask.status === 'completed'
                  ? 'Completed today'
                  : 'Tap play to enter flow'}
              </p>
            </div>
          </div>

          {proofTask && proofTask.status !== 'completed' && (
            <button
              onClick={() => startFocusSession(proofTask, 25)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#B85C3B] hover:bg-[#A34E30] text-white text-xs font-bold transition-transform active:scale-95 shadow-xs shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Focus</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
