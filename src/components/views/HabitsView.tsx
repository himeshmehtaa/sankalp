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
  Edit2,
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
  const { habits, addHabit, updateHabit, toggleHabitDate, deleteHabit, showToast } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
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

  const handleOpenAdd = () => {
    setEditingHabitId(null);
    setName('');
    setNotes('');
    setTargetPerWeek(7);
    setDomain('growth');
    setIsAdding(true);
  };

  const handleStartEdit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setName(habit.name);
    setNotes(habit.notes || '');
    setTargetPerWeek(habit.targetPerWeek);
    setDomain(habit.domain);
    setIsAdding(true);
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingHabitId) {
      updateHabit(editingHabitId, {
        name: name.trim(),
        domain,
        targetPerWeek,
        notes: notes.trim() || undefined,
      });
      showToast('Habit updated');
    } else {
      addHabit({
        name: name.trim(),
        domain,
        targetPerWeek,
        completions: [new Date().toISOString().split('T')[0]],
        status: 'active',
        notes: notes.trim() || undefined,
      });

      try {
        confetti({ particleCount: 20, spread: 45, colors: ['#B85C3B', '#6B7A5B'] });
      } catch (e) {}
      showToast('Habit created');
    }

    setName('');
    setNotes('');
    setEditingHabitId(null);
    setIsAdding(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E7E1DA]">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1B1A19]">
            Habits & Daily Rhythms
          </h1>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Gentle consistency over rigid streaks. Show up without shame or punishment.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1B1A19] hover:bg-[#2B2927] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B85C3B]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habit Cards */}
      <div className="space-y-3">
        {habits.map((habit) => {
          // Calculate completions in the last 7 days
          const completedCountThisWeek = habit.completions.filter((dateStr) => {
            const date = new Date(dateStr);
            const weekAgo = new Date(Date.now() - 7 * 86400000);
            return date >= weekAgo;
          }).length;

          return (
            <div
              key={habit.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-3 hover:border-[#D6CEBE] transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F4EFEB] text-[#78716C]">
                      {habit.domain}
                    </span>
                    <h2 className="text-sm font-bold text-[#1B1A19]">{habit.name}</h2>
                  </div>
                  {habit.notes && (
                    <p className="text-xs text-[#78716C] italic">{habit.notes}</p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#1B1A19]">
                      {completedCountThisWeek}/{habit.targetPerWeek}
                    </span>
                    <span className="text-[10px] text-[#8F877F] block">this week</span>
                  </div>

                  {/* Edit and Delete Kept Together */}
                  <div className="flex items-center gap-1 bg-[#F4EFEB] p-1 rounded-lg border border-[#E7E1DA]">
                    <button
                      onClick={() => handleStartEdit(habit)}
                      className="p-1 rounded text-[#78716C] hover:text-[#1B1A19] hover:bg-white transition-colors"
                      title="Edit Habit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 rounded text-[#78716C] hover:text-[#DC2626] hover:bg-white transition-colors"
                      title="Archive Habit"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* 7-Day Completion Dots */}
              <div className="pt-2 border-t border-[#E7E1DA] flex items-center justify-between">
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
                            ? 'bg-[#6B7A5B] text-[#FFFFFF]'
                            : day.isToday
                            ? 'border-2 border-[#B85C3B] text-[#1B1A19] bg-[#F8EDE8]/50'
                            : 'bg-[#F4EFEB] text-[#8F877F] hover:bg-[#E7E1DA]'
                        }`}
                        title={`${day.dateStr}: ${isDone ? 'Completed' : 'Not completed'}`}
                      >
                        <span className="text-[9px] font-bold">{day.dayName}</span>
                        {isDone ? (
                          <Check className="w-3 h-3 stroke-[3]" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {habits.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#E7E1DA] bg-[#FFFFFF]/60">
            <Repeat className="w-8 h-8 text-[#8F877F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1B1A19]">No active habits yet.</p>
            <p className="text-xs text-[#8F877F] mt-1">
              Start with one keystone daily action that connects to your quarterly horizon.
            </p>
          </div>
        )}
      </div>

      {/* Create / Edit Habit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FAF8F4] border border-[#E7E1DA] rounded-2xl shadow-2xl p-6 text-[#1B1A19]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]">
              <h2 className="text-sm font-bold text-[#1B1A19]">
                {editingHabitId ? 'Edit Habit' : 'Create Daily Rhythm'}
              </h2>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setEditingHabitId(null);
                }}
                className="p-1 rounded-lg text-[#8F877F] hover:bg-[#F4EFEB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHabit} className="mt-4 space-y-3">
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
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
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
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7E1DA]">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingHabitId(null);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#F4EFEB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#B85C3B] hover:bg-[#A34E30] text-[#FFFFFF] text-xs font-semibold shadow-xs transition-colors"
                >
                  {editingHabitId ? 'Update Habit' : 'Save Rhythm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
