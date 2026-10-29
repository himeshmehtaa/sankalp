import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskBucket, TaskPriority } from '../../types';
import {
  CheckSquare,
  Plus,
  Play,
  Circle,
  CheckCircle2,
  Clock,
  Calendar,
  Target,
  Trash2,
  Archive,
  ArrowRight,
  Check,
  ChevronDown,
  X,
  Star,
  Flame,
  Inbox,
  CalendarRange,
} from 'lucide-react';
import { CustomSelect, SelectOption } from '../common/CustomSelect';

export const TasksView: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    toggleSubtask,
    startFocusSession,
    goals,
    showToast,
  } = useApp();

  const [activeBucket, setActiveBucket] = useState<TaskBucket | 'completed'>('today');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const priorityOptions: SelectOption[] = [
    { value: 'proof', label: '#1 Proof Action', icon: <Flame className="w-3.5 h-3.5" /> },
    { value: 'supporting', label: 'Supporting Priority', icon: <Star className="w-3.5 h-3.5" /> },
    { value: 'normal', label: 'Normal Priority', icon: <Circle className="w-3.5 h-3.5" /> },
    { value: 'low', label: 'Low Priority', icon: <Clock className="w-3.5 h-3.5" /> },
  ];

  const bucketOptions: SelectOption[] = [
    { value: 'today', label: 'Today', icon: <Clock className="w-3.5 h-3.5" /> },
    { value: 'inbox', label: 'Inbox', icon: <Inbox className="w-3.5 h-3.5" /> },
    { value: 'upcoming', label: 'Upcoming', icon: <CalendarRange className="w-3.5 h-3.5" /> },
    { value: 'someday', label: 'Someday / Later', icon: <Archive className="w-3.5 h-3.5" /> },
  ];

  // Form State
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('normal');
  const [bucket, setBucket] = useState<TaskBucket>('today');
  const [goalId, setGoalId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);

  const buckets: { key: TaskBucket | 'completed'; label: string; count: number }[] = [
    { key: 'today', label: 'Today', count: tasks.filter((t) => t.bucket === 'today' && t.status !== 'completed').length },
    { key: 'inbox', label: 'Inbox', count: tasks.filter((t) => t.bucket === 'inbox' && t.status !== 'completed').length },
    { key: 'upcoming', label: 'Upcoming', count: tasks.filter((t) => t.bucket === 'upcoming' && t.status !== 'completed').length },
    { key: 'someday', label: 'Someday / Later', count: tasks.filter((t) => t.bucket === 'someday' && t.status !== 'completed').length },
    { key: 'completed', label: 'Completed', count: tasks.filter((t) => t.status === 'completed').length },
  ];

  const currentTasks = tasks.filter((t) => {
    if (activeBucket === 'completed') return t.status === 'completed';
    return t.bucket === activeBucket && t.status !== 'completed';
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      notes: notes.trim() || undefined,
      bucket,
      priority,
      status: 'todo',
      goalId: goalId || undefined,
      dueDate: dueDate || (bucket === 'today' ? new Date().toISOString().split('T')[0] : undefined),
      estimatedMinutes: estimatedMinutes > 0 ? estimatedMinutes : undefined,
      subtasks: [],
    });

    setTitle('');
    setNotes('');
    setIsNewTaskOpen(false);
  };

  const handleReschedule = (taskId: string, targetBucket: TaskBucket) => {
    updateTask(taskId, { bucket: targetBucket });
    showToast(`Task moved to ${targetBucket}`);
  };

  const handleDropTask = (taskId: string) => {
    updateTask(taskId, { status: 'dropped' });
    showToast('Task dropped without guilt.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              Tasks & Intentional Execution
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Designed to protect attention rather than accumulate endless backlogs
          </p>
        </div>

        <button
          onClick={() => setIsNewTaskOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#C85A17]" />
          <span>New Task</span>
        </button>
      </div>

      {/* Bucket Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 border-b border-[#E8E2D8]/60">
        {buckets.map((b) => (
          <button
            key={b.key}
            onClick={() => setActiveBucket(b.key)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeBucket === b.key
                ? 'bg-[#FFFFFF] border border-[#E2DBD0] text-[#1C1917] font-semibold shadow-2xs'
                : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#F2EFEB]'
            }`}
          >
            <span>{b.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                activeBucket === b.key
                  ? 'bg-[#C85A17]/10 text-[#C85A17] font-bold'
                  : 'bg-[#EBE5DB] text-[#8F877F]'
              }`}
            >
              {b.count}
            </span>
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {currentTasks.map((task) => {
          const linkedGoal = task.goalId ? goals.find((g) => g.id === task.goalId) : null;
          return (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all ${
                task.status === 'completed'
                  ? 'bg-[#F4F9F5] border-[#CFDFD3]'
                  : task.priority === 'proof'
                  ? 'bg-[#FFFFFF] border-[#C85A17]/40 shadow-xs ring-1 ring-[#C85A17]/10'
                  : 'bg-[#FFFFFF] border-[#E8E2D8] hover:border-[#D6CEBE]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-[#8F877F] hover:text-[#C85A17] transition-colors"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4D6B53]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {task.priority === 'proof' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#FAF0E6] text-[#C85A17] border border-[#E9D5C3]">
                          #1 Proof Action
                        </span>
                      )}
                      {task.priority === 'supporting' && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-medium uppercase tracking-wider bg-[#F2EFEB] text-[#78716C]">
                          Supporting
                        </span>
                      )}
                      {task.estimatedMinutes && (
                        <span className="text-[10px] text-[#8F877F] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{task.estimatedMinutes}m</span>
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="text-[10px] text-[#8F877F] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </span>
                      )}
                    </div>

                    <p
                      className={`text-sm font-semibold leading-snug ${
                        task.status === 'completed'
                          ? 'line-through text-[#8F877F]'
                          : 'text-[#1C1917]'
                      }`}
                    >
                      {task.title}
                    </p>

                    {task.notes && (
                      <p className="text-xs text-[#57534E] leading-normal">{task.notes}</p>
                    )}

                    {linkedGoal && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-[#C85A17]">
                        <Target className="w-3 h-3" />
                        <span className="truncate">Advances: {linkedGoal.title}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => startFocusSession(task)}
                      className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#C85A17] hover:bg-[#FAF0E6] transition-colors"
                      title="Launch Focus Sanctuary"
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  )}

                  {/* Reschedule / Consciously Drop Menu */}
                  {task.status !== 'completed' && (
                    <div className="relative group">
                      <button
                        onClick={() => handleReschedule(task.id, activeBucket === 'today' ? 'someday' : 'today')}
                        className="px-2 py-1 rounded-md text-[10px] border border-[#E8E2D8] text-[#78716C] hover:bg-[#F2EFEB]"
                        title={activeBucket === 'today' ? 'Move to Someday' : 'Move to Today'}
                      >
                        {activeBucket === 'today' ? '→ Someday' : '→ Today'}
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-[#DDD7CB] hover:text-[#DC2626] transition-colors"
                    title="Remove task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {currentTasks.length === 0 && (
          <div className="p-8 text-center rounded-2xl border border-dashed border-[#DDD7CB] bg-[#FFFFFF]/60">
            <CheckSquare className="w-8 h-8 text-[#8F877F] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1C1917]">
              No tasks currently in {activeBucket}.
            </p>
            <p className="text-xs text-[#8F877F] mt-0.5">
              A clear list is an opportunity for quiet focus.
            </p>
          </div>
        )}
      </div>

      {/* New Task Dialog */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 sm:p-7 text-[#1C1917]">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <h2 className="text-sm font-bold text-[#1C1917]">Create Task</h2>
              <button
                onClick={() => setIsNewTaskOpen(false)}
                className="p-1 rounded-lg text-[#8F877F] hover:bg-[#EBE5DB]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Action Title
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  placeholder="e.g. Polish mobile responsive navigation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Notes & Context (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Context, physical first step, or reminder..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Priority</label>
                  <CustomSelect
                    value={priority}
                    onChange={(val) => setPriority(val as TaskPriority)}
                    options={priorityOptions}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">Bucket</label>
                  <CustomSelect
                    value={bucket}
                    onChange={(val) => setBucket(val as TaskBucket)}
                    options={bucketOptions}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Estimated Time (Minutes)
                  </label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 25)}
                    className="w-full text-xs p-2 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#57534E] mb-1">
                    Linked Goal
                  </label>
                  <CustomSelect
                    value={goalId}
                    onChange={(val) => setGoalId(val)}
                    options={[
                      { value: '', label: 'None (Independent)' },
                      ...goals.map((g) => ({
                        value: g.id,
                        label: g.title,
                        icon: <Target className="w-3.5 h-3.5" />,
                      })),
                    ]}
                    placeholder="Select goal..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E8E2D8]">
                <button
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C] hover:bg-[#EBE5DB]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
