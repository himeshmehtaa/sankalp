import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import {
  Compass,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Plus,
  Flame,
  ArrowRight,
  Sparkles,
  ChevronRight,
  BookOpen,
  Heart,
  Activity,
  Check,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TodayView: React.FC = () => {
  const {
    profile,
    tasks,
    goals,
    routines,
    toggleRoutineToday,
    toggleTaskStatus,
    toggleSubtask,
    startFocusSession,
    setIsQuickCaptureOpen,
    openUnstuckWithState,
    addGratitudeEntry,
    addJournalEntry,
    addTask,
    showToast,
  } = useApp();

  const [reflectionTab, setReflectionTab] = useState<'evening' | 'none'>('none');
  const [reflectionWhatCompleted, setReflectionWhatCompleted] = useState('');
  const [reflectionWhatLearned, setReflectionWhatLearned] = useState('');
  const [reflectionWhatChallenged, setReflectionWhatChallenged] = useState('');
  const [reflectionGratefulFor, setReflectionGratefulFor] = useState('');
  const [reflectionTomorrowAnchor, setReflectionTomorrowAnchor] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Tasks categorized for Today
  const todayTasks = tasks.filter((t) => t.bucket === 'today');
  const proofTask = todayTasks.find((t) => t.priority === 'proof');
  const supportingTasks = todayTasks.filter((t) => t.priority === 'supporting');
  const otherTodayTasks = todayTasks.filter(
    (t) => t.priority !== 'proof' && t.priority !== 'supporting'
  );

  // Linked Goal for Proof Action
  const proofGoal = proofTask?.goalId ? goals.find((g) => g.id === proofTask.goalId) : null;

  // Handle End-of-Day Reflection Submission
  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionWhatCompleted && !reflectionTomorrowAnchor) return;

    // Save gratitude if filled
    if (reflectionGratefulFor.trim()) {
      addGratitudeEntry({
        date: todayStr,
        gratitude1: reflectionGratefulFor.trim(),
        gratitude2: 'Showed up for today’s commitments.',
        gratitude3: 'Opportunity to reflect and rest.',
        selfAppreciation: 'Reflecting mindfully before resting.',
        dailyWin: reflectionWhatCompleted || 'Completed today with awareness.',
        lessonLearned: reflectionWhatLearned || 'Every day provides insight.',
      });
    }

    // Save evening journal entry
    addJournalEntry({
      title: `Evening Reflection — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      content: `### What I completed:
${reflectionWhatCompleted || 'N/A'}

### What I learned:
${reflectionWhatLearned || 'N/A'}

### What challenged me:
${reflectionWhatChallenged || 'N/A'}

### Tomorrow’s Anchor:
${reflectionTomorrowAnchor || 'N/A'}`,
      date: todayStr,
      mood: 'calm',
      energy: 3,
      tags: ['Evening Reflection', 'End of Day'],
    });

    // Create tomorrow's anchor task if provided
    if (reflectionTomorrowAnchor.trim()) {
      addTask({
        title: reflectionTomorrowAnchor.trim(),
        bucket: 'today',
        priority: 'proof',
        status: 'todo',
        subtasks: [],
      });
    }

    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#B85C3B', '#6B7A5B'] });
    } catch (e) {}

    showToast('Evening reflection recorded. Rest deeply.');
    setReflectionTab('none');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-in fade-in duration-200">
      {/* 1. Life Direction Anchor Card */}
      <section className="bg-gradient-to-br from-[#F8EDE8]/60 via-[#FFFFFF] to-[#F5EFE8] border border-[#E8DEC8] rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B85C3B]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#B85C3B] font-editorial">
                Personal Direction
              </span>
            </div>
            <p className="text-sm font-medium text-[#1B1A19] leading-relaxed">
              "{profile.lifeVision}"
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={() => openUnstuckWithState()}
              className="px-3.5 py-2 rounded-xl bg-[#F8EDE8] hover:bg-[#F5E2D0] border border-[#E7E1DA] text-xs font-semibold text-[#9A420E] transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>Get Me Unstuck</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Today's Primary Anchor: The #1 Proof Action */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B85C3B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B1A19] font-editorial">
              Today's #1 Proof Action
            </h2>
          </div>
          <span className="text-xs text-[#8F877F]">
            The single action that makes today meaningful
          </span>
        </div>

        {proofTask ? (
          <div
            className={`p-6 rounded-2xl border transition-all ${
              proofTask.status === 'completed'
                ? 'bg-[#F4F9F5] border-[#CFDFD3]'
                : 'bg-[#FFFFFF] border-[#E2DBD0] shadow-xs hover:border-[#D6CEBE]'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                <button
                  onClick={() => toggleTaskStatus(proofTask.id)}
                  className="mt-0.5 text-[#8F877F] hover:text-[#B85C3B] transition-colors"
                  aria-label="Toggle task status"
                >
                  {proofTask.status === 'completed' ? (
                    <CheckCircle2 className="w-6 h-6 text-[#6B7A5B] fill-[#EEF2EC]" />
                  ) : (
                    <Circle className="w-6 h-6 hover:text-[#B85C3B]" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <h3
                    className={`text-base font-bold tracking-tight ${
                      proofTask.status === 'completed'
                        ? 'line-through text-[#78716C]'
                        : 'text-[#1B1A19]'
                    }`}
                  >
                    {proofTask.title}
                  </h3>

                  {proofTask.notes && (
                    <p className="text-xs text-[#57534E] leading-relaxed">
                      {proofTask.notes}
                    </p>
                  )}

                  {/* Goal Connection Pill */}
                  {proofGoal && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F8EDE8] text-[#9A420E] text-[11px] font-medium border border-[#E7E1DA]">
                      <Target className="w-3 h-3 text-[#B85C3B]" />
                      <span>Advances: {proofGoal.title}</span>
                    </div>
                  )}

                  {/* Subtasks if any */}
                  {proofTask.subtasks && proofTask.subtasks.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#E7E1DA]/60 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F]">
                        Milestone Steps
                      </p>
                      {proofTask.subtasks.map((st) => (
                        <button
                          key={st.id}
                          onClick={() => toggleSubtask(proofTask.id, st.id)}
                          className="flex items-center gap-2 text-xs text-left w-full text-[#57534E] hover:text-[#1B1A19]"
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                              st.completed
                                ? 'bg-[#6B7A5B] border-[#6B7A5B] text-[#FFFFFF]'
                                : 'border-[#DDD7CB]'
                            }`}
                          >
                            {st.completed && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className={st.completed ? 'line-through text-[#8F877F]' : ''}>
                            {st.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Start Focus Session Button */}
              {proofTask.status !== 'completed' && (
                <button
                  onClick={() => startFocusSession(proofTask)}
                  className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-transform active:scale-95"
                >
                  <Play className="w-3.5 h-3.5 text-[#B85C3B] fill-[#B85C3B]" />
                  <span className="hidden sm:inline">Enter Focus Sanctuary</span>
                  <span className="sm:hidden">Focus</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-[#DDD7CB] bg-[#FFFFFF]/70 text-center space-y-2">
            <p className="text-xs text-[#78716C]">
              No Proof Action defined yet for today. What is the one thing that matters most?
            </p>
            <button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F8EDE8] text-[#B85C3B] text-xs font-semibold hover:bg-[#F5E2D0]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Define Today's Proof Action</span>
            </button>
          </div>
        )}
      </section>

      {/* 3. Supporting Priorities (Up to 2) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8F877F]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B1A19] font-editorial">
              Supporting Priorities
            </h2>
          </div>
          <span className="text-xs text-[#8F877F]">Secondary focused blocks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supportingTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.status === 'completed'
                  ? 'bg-[#F4F9F5] border-[#CFDFD3]'
                  : 'bg-[#FFFFFF] border-[#E7E1DA] hover:border-[#D6CEBE]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-[#8F877F] hover:text-[#B85C3B]"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-[#6B7A5B]" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold leading-snug ${
                      task.status === 'completed'
                        ? 'line-through text-[#8F877F]'
                        : 'text-[#1B1A19]'
                    }`}
                  >
                    {task.title}
                  </p>
                  {task.estimatedMinutes && (
                    <span className="text-[10px] text-[#8F877F] mt-1 inline-block">
                      ⏱ {task.estimatedMinutes}m planned
                    </span>
                  )}
                </div>

                {task.status !== 'completed' && (
                  <button
                    onClick={() => startFocusSession(task)}
                    className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#B85C3B] hover:bg-[#F2EFEB]"
                    title="Focus on this task"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {supportingTasks.length === 0 && (
            <div className="p-4 rounded-xl border border-dashed border-[#DDD7CB] text-center text-xs text-[#8F877F] sm:col-span-2">
              No supporting priorities set. Keeping your day simple is high leverage.
            </div>
          )}
        </div>
      </section>

      {/* 4. Daily Rhythm & Routines */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6B7A5B]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#1B1A19] font-editorial">
              Daily Rhythm & Routines
            </h2>
          </div>
          <span className="text-xs text-[#8F877F]">Foundational anchors</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {routines.map((routine) => {
            const isDoneToday = routine.completedDates.includes(todayStr);
            return (
              <button
                key={routine.id}
                onClick={() => toggleRoutineToday(routine.id)}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
                  isDoneToday
                    ? 'bg-[#EEF2EC] border-[#CFDFD3]'
                    : 'bg-[#FFFFFF] border-[#E7E1DA] hover:border-[#D6CEBE]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F]">
                    {routine.timeOfDay}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isDoneToday
                        ? 'bg-[#6B7A5B] border-[#6B7A5B] text-[#FFFFFF]'
                        : 'border-[#DDD7CB]'
                    }`}
                  >
                    {isDoneToday && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold ${
                      isDoneToday ? 'text-[#3E5642]' : 'text-[#1B1A19]'
                    }`}
                  >
                    {routine.title}
                  </p>
                  <p className="text-[10px] text-[#78716C] line-clamp-1 mt-0.5">
                    {routine.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. End-of-Day Reflection Accordion */}
      <section className="border border-[#E7E1DA] rounded-2xl bg-[#FFFFFF] overflow-hidden shadow-2xs">
        <button
          onClick={() => setReflectionTab(reflectionTab === 'evening' ? 'none' : 'evening')}
          className="w-full p-5 flex items-center justify-between text-left hover:bg-[#FAF8F4] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F8EDE8] flex items-center justify-center text-[#B85C3B] border border-[#E7E1DA]">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1B1A19]">End-of-Day Reflection</h3>
              <p className="text-xs text-[#8F877F]">
                Close today intentionally: complete, learn, challenge, gratitude, tomorrow
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-[#8F877F] transition-transform ${
              reflectionTab === 'evening' ? 'rotate-90' : ''
            }`}
          />
        </button>

        {reflectionTab === 'evening' && (
          <form
            onSubmit={handleSaveReflection}
            className="p-5 pt-0 border-t border-[#E7E1DA]/80 space-y-4 animate-in fade-in duration-150"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  What did I complete today?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shipped the mobile nav and ran 5km..."
                  value={reflectionWhatCompleted}
                  onChange={(e) => setReflectionWhatCompleted(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  What did I learn?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Resistance fades after 2 minutes of real motion..."
                  value={reflectionWhatLearned}
                  onChange={(e) => setReflectionWhatLearned(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  What challenged me?
                </label>
                <input
                  type="text"
                  placeholder="e.g. Post-lunch attention dip..."
                  value={reflectionWhatChallenged}
                  onChange={(e) => setReflectionWhatChallenged(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#57534E] mb-1">
                  What am I grateful for?
                </label>
                <input
                  type="text"
                  placeholder="e.g. An honest conversation, quiet tea..."
                  value={reflectionGratefulFor}
                  onChange={(e) => setReflectionGratefulFor(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#FAF8F4] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#B85C3B] mb-1">
                Tomorrow's #1 Most Important Action
              </label>
              <input
                type="text"
                placeholder="What single anchor will you show up for tomorrow?"
                value={reflectionTomorrowAnchor}
                onChange={(e) => setReflectionTomorrowAnchor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E7E1DA] bg-[#F8EDE8]/30 focus:outline-none focus:border-[#B85C3B] font-medium"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-[#B85C3B]" />
                <span>Save Reflection & Close Day</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
