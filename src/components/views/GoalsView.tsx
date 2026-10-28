import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Goal, GoalLevel, LifeDomain } from '../../types';
import {
  Target,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  Calendar,
  X,
  Edit2,
  Trash2,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    toggleMilestone,
    tasks,
    showToast,
  } = useApp();

  const [selectedDomain, setSelectedDomain] = useState<LifeDomain | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<GoalLevel | 'all'>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hierarchy' | 'map'>('hierarchy');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [domain, setDomain] = useState<LifeDomain>('career');
  const [level, setLevel] = useState<GoalLevel>('quarterly');
  const [targetDate, setTargetDate] = useState('');
  const [parentId, setParentId] = useState('');
  const [milestonesInput, setMilestonesInput] = useState('');

  const domainsList: { key: LifeDomain | 'all'; label: string }[] = [
    { key: 'all', label: 'All Domains' },
    { key: 'career', label: 'Career & Work' },
    { key: 'health', label: 'Health & Vitality' },
    { key: 'finances', label: 'Finances' },
    { key: 'growth', label: 'Personal Growth' },
    { key: 'creativity', label: 'Creativity' },
    { key: 'relationships', label: 'Relationships' },
    { key: 'lifestyle', label: 'Lifestyle' },
  ];

  const levelsList: { key: GoalLevel | 'all'; label: string }[] = [
    { key: 'all', label: 'All Horizons' },
    { key: 'vision', label: 'Life Vision' },
    { key: '3-5year', label: '3-5 Years' },
    { key: 'annual', label: 'Annual' },
    { key: 'quarterly', label: '90-Day Focus' },
  ];

  const filteredGoals = goals.filter((g) => {
    if (selectedDomain !== 'all' && g.domain !== selectedDomain) return false;
    if (selectedLevel !== 'all' && g.level !== selectedLevel) return false;
    return true;
  });

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const milestones = milestonesInput
      .split('\n')
      .map((m) => m.trim())
      .filter(Boolean)
      .map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        title: m,
        completed: false,
      }));

    addGoal({
      title: title.trim(),
      description: description.trim(),
      whyItMatters: whyItMatters.trim() || 'Direct alignment with life vision.',
      domain,
      level,
      parentId: parentId || undefined,
      targetDate: targetDate || undefined,
      progress: 0,
      status: 'active',
      milestones,
    });

    setTitle('');
    setDescription('');
    setWhyItMatters('');
    setMilestonesInput('');
    setIsCreateOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              Goals & Life Planning
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Connecting deep life ambitions to concrete daily execution
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Selector: Hierarchy vs Visual Map */}
          <div className="flex bg-[#F2EFEB] p-1 rounded-xl text-xs">
            <button
              onClick={() => setActiveTab('hierarchy')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'hierarchy'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs font-semibold'
                  : 'text-[#78716C]'
              }`}
            >
              Hierarchy
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                activeTab === 'map'
                  ? 'bg-[#FFFFFF] text-[#1C1917] shadow-2xs font-semibold'
                  : 'text-[#78716C]'
              }`}
            >
              Goal Map
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#C85A17]" />
            <span>Create Goal</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {domainsList.map((d) => (
            <button
              key={d.key}
              onClick={() => setSelectedDomain(d.key)}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedDomain === d.key
                  ? 'bg-[#1C1917] text-[#FAF8F5] font-semibold'
                  : 'bg-[#FFFFFF] border border-[#E8E2D8] text-[#78716C] hover:bg-[#F2EFEB]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Goal Map View */}
      {activeTab === 'map' ? (
        <div className="space-y-6 bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-8 shadow-xs">
          <div>
            <h2 className="text-base font-bold text-[#1C1917] font-editorial">
              Visual Alignment Map
            </h2>
            <p className="text-xs text-[#8F877F]">
              How long-term visions cascade into 90-day focus and today's actions
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-[#E8E2D8]">
            {goals
              .filter((g) => g.level === 'vision')
              .map((vision) => {
                const childGoals = goals.filter((g) => g.parentId === vision.id);
                return (
                  <div key={vision.id} className="relative pl-9 space-y-4">
                    {/* Vision Node */}
                    <div className="relative">
                      <span className="absolute -left-9 top-1.5 w-3.5 h-3.5 rounded-full bg-[#C85A17] border-2 border-[#FAF8F5]" />
                      <div className="p-4 rounded-xl bg-[#FAF0E6]/50 border border-[#E9D5C3]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A17]">
                          Life Vision
                        </span>
                        <h3 className="text-sm font-bold text-[#1C1917] mt-0.5">{vision.title}</h3>
                        <p className="text-xs text-[#78716C] mt-1 font-serif-quote italic">
                          "{vision.whyItMatters}"
                        </p>
                      </div>
                    </div>

                    {/* Cascading Objectives */}
                    <div className="space-y-3 pl-4 border-l border-[#E9D5C3]">
                      {childGoals.map((child) => {
                        const linkedTasks = tasks.filter((t) => t.goalId === child.id);
                        return (
                          <div
                            key={child.id}
                            className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                                {child.level} Focus • {child.domain}
                              </span>
                              <span className="text-xs font-mono font-medium text-[#C85A17]">
                                {child.progress}%
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-[#1C1917]">{child.title}</h4>

                            {/* Linked Action Count */}
                            <div className="flex items-center gap-3 text-[11px] text-[#8F877F] pt-1 border-t border-[#E8E2D8]/60">
                              <span>
                                {child.milestones.filter((m) => m.completed).length}/
                                {child.milestones.length} milestones
                              </span>
                              <span>•</span>
                              <span>{linkedTasks.length} connected daily actions</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* Hierarchy List View */
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const linkedTasks = tasks.filter((t) => t.goalId === goal.id);
            return (
              <div
                key={goal.id}
                className="p-5 sm:p-6 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs space-y-4 hover:border-[#D6CEBE] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#C85A17] border border-[#E9D5C3]">
                        {goal.level}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#F2EFEB] text-[#78716C]">
                        {goal.domain}
                      </span>
                      {goal.targetDate && (
                        <span className="text-[11px] text-[#8F877F] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Target: {goal.targetDate}</span>
                        </span>
                      )}
                    </div>

                    <h2 className="text-base font-bold text-[#1C1917] tracking-tight">
                      {goal.title}
                    </h2>
                    {goal.description && (
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        {goal.description}
                      </p>
                    )}
                    {goal.whyItMatters && (
                      <p className="text-xs text-[#78716C] font-serif-quote italic">
                        Why it matters: "{goal.whyItMatters}"
                      </p>
                    )}
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-[#1C1917]">
                        {goal.progress}%
                      </span>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-1 rounded-md text-[#DDD7CB] hover:text-[#DC2626] transition-colors"
                        title="Delete Goal"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-24 sm:w-28 h-1.5 bg-[#E8E2D8] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C85A17] rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Milestones Checklist */}
                {goal.milestones && goal.milestones.length > 0 && (
                  <div className="pt-3 border-t border-[#E8E2D8]/60 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F]">
                      Key Milestones
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {goal.milestones.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => toggleMilestone(goal.id, m.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-lg text-xs text-left transition-colors border ${
                            m.completed
                              ? 'bg-[#EEF4F0] border-[#CFDFD3] text-[#4D6B53]'
                              : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#57534E] hover:bg-[#F2EFEB]'
                          }`}
                        >
                          <div
                            className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                              m.completed
                                ? 'bg-[#4D6B53] border-[#4D6B53] text-[#FFFFFF]'
                                : 'border-[#DDD7CB]'
                            }`}
                          >
                            {m.completed && <Check className="w-2.5 h-2.5" />}
                          </div>
                          <span className={`truncate ${m.completed ? 'line-through' : ''}`}>
                            {m.title}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connected Tasks list */}
                {linkedTasks.length > 0 && (
                  <div className="pt-2 text-xs text-[#8F877F] flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-[11px]">Daily actions linked:</span>
                    {linkedTasks.map((t) => (
                      <span
                        key={t.id}
                        className={`px-2 py-0.5 rounded-md text-[11px] border ${
                          t.status === 'completed'
                            ? 'bg-[#EEF4F0] border-[#CFDFD3] text-[#4D6B53] line-through'
                            : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#57534E]'
                        }`}
                      >
                        {t.title}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredGoals.length === 0 && (
            <div className="p-8 text-center rounded-2xl border border-dashed border-[#DDD7CB] bg-[#FFFFFF]/60">
              <Target className="w-8 h-8 text-[#8F877F] mx-auto mb-2" />
              <p className="text-sm font-semibold text-[#1C1917]">No goals match current filter.</p>
              <p className="text-xs text-[#8F877F] mt-1">
                Establish an intentional direction to guide your daily efforts.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Create Goal Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#1C1917]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <h2 className="text-sm font-bold text-[#1C1917]">Establish New Goal</h2>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-lg text-[#8F877F] hover:bg-[#EBE5DB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Goal Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Lead design architecture for human-scale systems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Domain</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as LifeDomain)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                  >
                    <option value="career">Career & Growth</option>
                    <option value="health">Health & Vitality</option>
                    <option value="finances">Finances</option>
                    <option value="growth">Personal Growth</option>
                    <option value="creativity">Creativity</option>
                    <option value="relationships">Relationships</option>
                    <option value="lifestyle">Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Time Horizon
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as GoalLevel)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                  >
                    <option value="quarterly">90-Day Focus</option>
                    <option value="annual">Annual Objective</option>
                    <option value="3-5year">3-5 Year Horizon</option>
                    <option value="vision">Life Vision</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Why It Matters (Intrinsic Motivation)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Direct alignment of craft with freedom and presence."
                  value={whyItMatters}
                  onChange={(e) => setWhyItMatters(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Key Milestones (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Ship MVP architecture\nTest with 5 thoughtful users\nDocument lessons learned`}
                  value={milestonesInput}
                  onChange={(e) => setMilestonesInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
