import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  Circle,
  Repeat,
  Flame,
  Droplets,
  Play,
  Zap,
  Target,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const VitalityRings: React.FC = () => {
  const {
    focusSessions,
    tasks,
    habits,
    healthLogs,
    addOrUpdateHealthLog,
    toggleTaskStatus,
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
      confetti({ particleCount: 15, spread: 35, colors: ['#06B6D4', '#3B82F6', '#60A5FA'] });
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

  // SVG Circular math
  const size = 150;
  const strokeWidth = 10;
  const center = size / 2;

  // Ring 1 (Focus - Amber Glow): r = 60
  const r1 = 60;
  const c1 = 2 * Math.PI * r1;
  const offset1 = c1 - (focusPct / 100) * c1;

  // Ring 2 (Actions - Electric Indigo): r = 46
  const r2 = 46;
  const c2 = 2 * Math.PI * r2;
  const offset2 = c2 - (taskPct / 100) * c2;

  // Ring 3 (Habits - Emerald Cyan): r = 32
  const r3 = 32;
  const c3 = 2 * Math.PI * r3;
  const offset3 = c3 - (habitPct / 100) * c3;

  const totalMomentumScore = Math.round((focusPct + taskPct + habitPct) / 3);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0B0F1C] via-[#0E1528] to-[#070A14] text-white border border-indigo-500/20 shadow-2xl relative overflow-hidden transition-all">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Top Row: Info & Glowing Rings */}
      <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Information Column */}
        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">
              Live Daily Momentum
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/20 font-medium">
              Sankalp OS
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Daily Vitality & Rhythm
          </h3>

          <p className="text-xs text-white/70 leading-relaxed max-w-md">
            Holistic progress without punitive guilt. Show up for deep focus, your daily proof action, and restorative physical health.
          </p>

          {/* Key Metrics Row */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                  Focus
                </span>
              </div>
              <p className="text-sm font-bold text-white">{totalFocusMinutes}m</p>
              <p className="text-[10px] text-white/50">{targetFocus}m goal</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#818CF8]" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                  Actions
                </span>
              </div>
              <p className="text-sm font-bold text-white">
                {completedToday}/{todayTasks.length || 1}
              </p>
              <p className="text-[10px] text-white/50">Done today</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-[10px] text-white/60 uppercase tracking-wider font-semibold">
                  Rhythms
                </span>
              </div>
              <p className="text-sm font-bold text-white">
                {habitsDone}/{activeHabits.length || 1}
              </p>
              <p className="text-[10px] text-white/50">Habits checked</p>
            </div>
          </div>
        </div>

        {/* Right: SVG Multi-Layer Glowing Rings */}
        <div className="relative shrink-0 flex items-center justify-center select-none">
          <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
            <defs>
              <linearGradient id="glowFocus" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#FB923C" />
              </linearGradient>
              <linearGradient id="glowAction" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
              <linearGradient id="glowRhythm" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>

            {/* Crystal Translucent Glass Background Tracks */}
            <circle cx={center} cy={center} r={r1} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={center} cy={center} r={r2} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
            <circle cx={center} cy={center} r={r3} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />

            {/* Active Vibrant Gradient Rings */}
            <circle
              cx={center}
              cy={center}
              r={r1}
              stroke="url(#glowFocus)"
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
              stroke="url(#glowAction)"
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
              stroke="url(#glowRhythm)"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={c3}
              strokeDashoffset={offset3}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Momentum Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <Flame className="w-5 h-5 text-[#F59E0B] fill-[#F59E0B]/20 animate-pulse" />
            <span className="text-xs font-mono font-bold text-white mt-0.5 tracking-tight">
              {totalMomentumScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Visual Circadian Energy Wave Banner */}
      <div className="px-6 py-4 bg-white/5 border-t border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
        <div className="flex items-center gap-2">
          {currentHour >= 6 && currentHour < 18 ? (
            <Sun className="w-4 h-4 text-[#F59E0B] shrink-0" />
          ) : (
            <Moon className="w-4 h-4 text-[#818CF8] shrink-0" />
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">{circadianPhase}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-mono">
              {circadianBadge}
            </span>
            <span className="text-white/60 text-[11px] hidden md:inline">
              — {circadianDesc}
            </span>
          </div>
        </div>

        {/* Live Hour Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] text-white/60 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
          <span>Active Window</span>
        </div>
      </div>

      {/* Bottom Interactive Utility Dials: Real Actions right from the card */}
      <div className="p-4 sm:p-6 bg-black/20 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        {/* 1. Quick Hydration Dial */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/20 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Daily Hydration</p>
              <p className="text-[11px] text-white/60 font-mono">
                {currentWater}/8 glasses logged
              </p>
            </div>
          </div>

          <button
            onClick={handleAddWater}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#070A14] text-xs font-bold transition-transform active:scale-95 shadow-md shadow-cyan-500/20"
          >
            <span>+1 Glass</span>
          </button>
        </div>

        {/* 2. Instant Proof Action Shortcut */}
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 truncate">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">
                {proofTask ? proofTask.title : 'No active proof action'}
              </p>
              <p className="text-[11px] text-white/60">
                {proofTask && proofTask.status === 'completed'
                  ? 'Completed today'
                  : 'Tap play to enter flow'}
              </p>
            </div>
          </div>

          {proofTask && proofTask.status !== 'completed' && (
            <button
              onClick={() => startFocusSession(proofTask)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-[#070A14] text-xs font-bold transition-transform active:scale-95 shadow-md shadow-amber-500/20 shrink-0"
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
