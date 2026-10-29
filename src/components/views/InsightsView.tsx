import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WeeklyReview } from '../../types';
import {
  BarChart3,
  Clock,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
  Send,
  Plus,
  Repeat,
  Activity,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InsightsView: React.FC = () => {
  const {
    tasks,
    goals,
    focusSessions,
    habits,
    unstuckLogs,
    weeklyReviews,
    addWeeklyReview,
    showToast,
  } = useApp();

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [whatWentWell, setWhatWentWell] = useState('');
  const [whatMovedForward, setWhatMovedForward] = useState('');
  const [whereGotStuck, setWhereGotStuck] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [nextWeekPriority, setNextWeekPriority] = useState('');

  // Computations based on actual saved data
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const completedProof = tasks.filter((t) => t.status === 'completed' && t.priority === 'proof');
  const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + curr.actualMinutes, 0);

  // Active goals progress
  const activeGoals = goals.filter((g) => g.status === 'active');
  const avgGoalProgress = activeGoals.length
    ? Math.round(activeGoals.reduce((a, b) => a + b.progress, 0) / activeGoals.length)
    : 0;

  const handleSaveWeeklyReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatWentWell.trim() && !nextWeekPriority.trim()) return;

    const today = new Date();
    const lastWeek = new Date(Date.now() - 7 * 86400000);

    addWeeklyReview({
      weekStartDate: lastWeek.toISOString().split('T')[0],
      weekEndDate: today.toISOString().split('T')[0],
      whatWentWell: whatWentWell.trim() || 'Showed up with honest effort.',
      whatMovedForward: whatMovedForward.trim() || 'Executed core daily actions.',
      whereGotStuck: whereGotStuck.trim() || 'Felt occasional cognitive fatigue.',
      lessonsLearned: lessonsLearned.trim() || 'Action produces clarity.',
      nextWeekPriority: nextWeekPriority.trim() || 'Protect morning focus sanctuaries.',
      focusMinutesTotal: totalFocusMinutes,
      completedPrioritiesCount: completedProof.length,
    });

    try {
      confetti({ particleCount: 35, spread: 60, colors: ['#C85A17', '#4D6B53'] });
    } catch (e) {}

    setIsReviewOpen(false);
    setWhatWentWell('');
    setWhatMovedForward('');
    setWhereGotStuck('');
    setLessonsLearned('');
    setNextWeekPriority('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#E8E2D8]/70">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#1C1917]">
            Insights & Weekly Review
          </h1>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Real data reflecting deliberate action, without artificial scores or toxic gamification
          </p>
        </div>

        <button
          onClick={() => setIsReviewOpen(!isReviewOpen)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-[#C85A17]" />
          <span>Conduct Weekly Review</span>
        </button>
      </div>

      {/* Actual Data Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Deep Focus</span>
          </span>
          <p className="text-xl font-bold font-mono text-[#1C1917]">
            {totalFocusMinutes} <span className="text-xs font-normal text-[#8F877F]">min</span>
          </p>
          <p className="text-[10px] text-[#78716C]">{focusSessions.length} recorded blocks</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#4D6B53]" />
            <span>Proof Actions</span>
          </span>
          <p className="text-xl font-bold font-mono text-[#1C1917]">
            {completedProof.length} <span className="text-xs font-normal text-[#8F877F]">done</span>
          </p>
          <p className="text-[10px] text-[#78716C]">{completedTasks.length} total tasks completed</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F] flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Goal Velocity</span>
          </span>
          <p className="text-xl font-bold font-mono text-[#1C1917]">{avgGoalProgress}%</p>
          <p className="text-[10px] text-[#78716C]">{activeGoals.length} active objectives</p>
        </div>

        <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-2xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Reclaimed Momentum</span>
          </span>
          <p className="text-xl font-bold font-mono text-[#1C1917]">
            {unstuckLogs.length} <span className="text-xs font-normal text-[#8F877F]">times</span>
          </p>
          <p className="text-[10px] text-[#78716C]">Overcame resistance</p>
        </div>
      </div>

      {/* Guided Weekly Review Form */}
      {isReviewOpen && (
        <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C85A17]" />
              <h2 className="text-sm font-bold text-[#1C1917]">
                Weekly Sabbath & Recalibration
              </h2>
            </div>
            <button
              onClick={() => setIsReviewOpen(false)}
              className="text-xs text-[#8F877F] hover:text-[#1C1917]"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSaveWeeklyReview} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  1. What went well this week?
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Protected morning stillness 4 days, finished the prototype..."
                  value={whatWentWell}
                  onChange={(e) => setWhatWentWell(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  2. What genuinely moved me forward?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Saying no to a distracting side-project proposal..."
                  value={whatMovedForward}
                  onChange={(e) => setWhatMovedForward(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  3. Where did I get stuck or hesitate?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Avoided drafting the difficult section on Tuesday afternoon..."
                  value={whereGotStuck}
                  onChange={(e) => setWhereGotStuck(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  4. What core lesson did I discover?
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Physical movement dissipates mental dread faster than analysis..."
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17] resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C85A17] mb-1">
                5. What is the single non-negotiable priority for next week?
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ship and test SANKALP v1.0 with real feedback."
                value={nextWeekPriority}
                onChange={(e) => setNextWeekPriority(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E9D5C3] bg-[#FAF0E6]/30 focus:outline-none focus:border-[#C85A17] font-semibold"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8E2D8]">
              <button
                type="button"
                onClick={() => setIsReviewOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
              >
                Save Weekly Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Historical Reviews */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
          Saved Weekly Calibrations
        </h3>

        {weeklyReviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <span className="text-xs font-bold text-[#1C1917]">
                Week: {rev.weekStartDate} to {rev.weekEndDate}
              </span>
              <span className="text-xs font-mono font-semibold text-[#C85A17]">
                {rev.focusMinutesTotal}m focused work
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                <strong className="text-[10px] font-bold uppercase tracking-wider text-[#4D6B53] block mb-1">
                  What Went Well
                </strong>
                <p className="text-[#57534E] leading-relaxed">{rev.whatWentWell}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                <strong className="text-[10px] font-bold uppercase tracking-wider text-[#C85A17] block mb-1">
                  Where Got Stuck
                </strong>
                <p className="text-[#57534E] leading-relaxed">{rev.whereGotStuck}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8]">
                <strong className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block mb-1">
                  Lesson Learned
                </strong>
                <p className="text-[#57534E] leading-relaxed">{rev.lessonsLearned}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF0E6]/50 border border-[#E9D5C3]">
                <strong className="text-[10px] font-bold uppercase tracking-wider text-[#9A420E] block mb-1">
                  Priority Established
                </strong>
                <p className="text-[#1C1917] font-semibold leading-relaxed">
                  {rev.nextWeekPriority}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
