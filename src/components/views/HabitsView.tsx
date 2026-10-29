import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Habit, LifeDomain } from '../../types';
import {
  Repeat,
  Plus,
  Check,
  Calendar,
  Sparkles,
  Shield,
  Trash2,
  X,
  Briefcase,
  Heart,
  DollarSign,
  Users,
  Compass,
  Clock,
} from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import confetti from 'canvas-confetti';

export const HabitsView: React.FC = () => {
  const { habits, addHabit, toggleHabitDate, deleteHabit, showToast } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [domain, setDomain] = useState<LifeDomain>('growth');
  const [targetPerWeek, setTargetPerWeek] = useState<number>(7);
  const [notes, setNotes] = useState('');

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    return {
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isToday: i === 6,
    };
  });

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      domain,
      targetPerWeek,
      completions: [new Date().toISOString().split('T')[0]],
      status: 'active',
      notes: notes.trim() || undefined,
    });

    try {
      confetti({ particleCount: 20, spread: 45, colors: ['#C85A17', '#4D6B53'] });
    } catch (e) {}

    setName('');
    setNotes('');
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              Habits & Rhythms
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Consistency through compassion. A missed day is merely feedback, not a reset.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C85A17]" />
          <span>New Rhythm</span>
        </button>
      </div>

      {/* Philosophy Card */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] flex items-center gap-3">
        <Shield className="w-5 h-5 text-[#4D6B53] shrink-0" />
        <p className="text-xs text-[#57534E] leading-relaxed">
          <strong className="font-semibold text-[#1C1917]">No-guilt philosophy:</strong> We do
          not track punitive "streaks" that break your spirit after one travel day or illness. We
          measure total frequency and the ease of returning.
        </p>
      </div>

      {/* Habits List */}
      <div className="space-y-3">
        {habits.map((habit) => {
          const completedCountThisWeek = habit.completions.filter((d) =>
            last7Days.some((ld) => ld.dateStr === d)
          ).length;

          return (
            <div
              key={habit.id}
              className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs space-y-4 hover:border-[#D6CEBE] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF0E6] text-[#C85A17]">
                      {habit.domain}
                    </span>
                    <span className="text-xs text-[#8F877F]">
                      Target: {habit.targetPerWeek}x / week
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1C1917]">{habit.name}</h3>
                  {habit.notes && <p className="text-xs text-[#78716C]">{habit.notes}</p>}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#1C1917]">
                      {completedCountThisWeek}/{habit.targetPerWeek}
                    </span>
                    <span className="text-[10px] text-[#8F877F] block">this week</span>
                  </div>

                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-1 rounded text-[#DDD7CB] hover:text-[#DC2626] transition-colors"
                    title="Archive Habit"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 7-Day Completion Dots */}
              <div className="pt-2 border-t border-[#E8E2D8]/60 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#8F877F] tracking-wider">
                  Past 7 Days
                </span>
                <div className="flex items-center gap-2">
                  {last7Days.map((day) => {
                    const isDone = habit.completions.includes(day.dateStr);
                    return (
                      <button
                        key={day.dateStr}
                        onClick={() => toggleHabitDate(habit.id, day.dateStr)}
                        className={`w-7 h-8 rounded-lg flex flex-col items-center justify-center transition-all ${
                          isDone
                            ? 'bg-[#4D6B53] text-[#FFFFFF]'
                            : day.isToday
                            ? 'border-2 border-dashed border-[#C85A17] bg-[#FAF8F5] text-[#C85A17]'
                            : 'bg-[#F2EFEB] text-[#8F877F] hover:bg-[#E8E2D8]'
                        }`}
                        title={`${day.dateStr}: ${isDone ? 'Completed' : 'Click to toggle'}`}
                      >
                        <span className="text-[9px] font-bold">{day.dayName}</span>
                        {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Habit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#1C1917]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <h2 className="text-sm font-bold text-[#1C1917]">Establish Habit / Rhythm</h2>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-lg text-[#8F877F] hover:bg-[#EBE5DB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHabit} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Read 20 pages of deep literature or philosophy"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Domain</label>
                  <CustomSelect
                    value={domain}
                    onChange={(val) => setDomain(val as LifeDomain)}
                    options={[
                      { value: 'growth', label: 'Personal Growth', icon: <Sparkles className="w-3.5 h-3.5" /> },
                      { value: 'health', label: 'Health & Vitality', icon: <Heart className="w-3.5 h-3.5" /> },
                      { value: 'career', label: 'Career', icon: <Briefcase className="w-3.5 h-3.5" /> },
                      { value: 'finances', label: 'Finances', icon: <DollarSign className="w-3.5 h-3.5" /> },
                      { value: 'relationships', label: 'Relationships', icon: <Users className="w-3.5 h-3.5" /> },
                      { value: 'lifestyle', label: 'Lifestyle', icon: <Compass className="w-3.5 h-3.5" /> },
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Target Days per Week
                  </label>
                  <CustomSelect
                    value={String(targetPerWeek)}
                    onChange={(val) => setTargetPerWeek(parseInt(val) || 7)}
                    options={[
                      { value: '7', label: 'Daily (7 days / wk)', icon: <Clock className="w-3.5 h-3.5" /> },
                      { value: '5', label: 'Weekdays (5 days / wk)', icon: <Clock className="w-3.5 h-3.5" /> },
                      { value: '4', label: '4 times / week', icon: <Clock className="w-3.5 h-3.5" /> },
                      { value: '3', label: '3 times / week', icon: <Clock className="w-3.5 h-3.5" /> },
                      { value: '2', label: '2 times / week', icon: <Clock className="w-3.5 h-3.5" /> },
                      { value: '1', label: 'Weekly anchor (1x / wk)', icon: <Clock className="w-3.5 h-3.5" /> },
                    ]}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Context / Intention (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. First thing in the morning before turning on wifi"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
