import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Plus,
  Star,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Edit3,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const InteractiveTaskScratchpad: React.FC = () => {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    startFocusSession,
    showToast,
  } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [scratchpadText, setScratchpadText] = useState(() => {
    return localStorage.getItem('sankalp_scratchpad') || 'Focus on depth, not surface velocity. Complete the mobile touch targets and hydrate.';
  });

  const todayTasks = tasks.filter((t) => t.bucket === 'today');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      bucket: 'today',
      priority: todayTasks.length === 0 ? 'proof' : 'normal',
      status: 'todo',
      subtasks: [],
    });

    setNewTaskTitle('');
    showToast('Task added to Today');
  };

  const handlePromoteProof = (taskId: string) => {
    // Demote current proof task
    todayTasks.forEach((t) => {
      if (t.priority === 'proof' && t.id !== taskId) {
        updateTask(t.id, { priority: 'supporting' });
      }
    });
    // Promote selected
    updateTask(taskId, { priority: 'proof' });
    try {
      confetti({ particleCount: 20, spread: 40, colors: ['#B85C3B', '#F59E0B'] });
    } catch (e) {}
    showToast('Promoted to today’s #1 Proof Action');
  };

  const handleScratchpadChange = (text: string) => {
    setScratchpadText(text);
    localStorage.setItem('sankalp_scratchpad', text);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Cols: Instant Execution Planner */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B85C3B]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B1A19] font-editorial">
              Today's Action Flow
            </h3>
          </div>
          <span className="text-xs text-[#8F877F] font-mono">
            {todayTasks.filter((t) => t.status === 'completed').length}/{todayTasks.length} Done
          </span>
        </div>

        {/* Quick Inline Task Input */}
        <form onSubmit={handleAddTask} className="relative">
          <input
            type="text"
            placeholder="Type an action and press Enter to add..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full text-xs font-medium pl-4 pr-12 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-2xs focus:outline-none focus:border-[#B85C3B] focus:ring-2 focus:ring-[#B85C3B]/10 transition-all text-[#1B1A19] placeholder:text-[#8F877F]"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-white disabled:opacity-30 transition-opacity"
            title="Add task"
          >
            <Plus className="w-4 h-4" />
          </button>
        </form>

        {/* Tasks List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {todayTasks.map((t) => {
            const isProof = t.priority === 'proof';
            const isDone = t.status === 'completed';

            return (
              <div
                key={t.id}
                className={`group flex items-center justify-between gap-3 p-3.5 rounded-2xl border transition-all ${
                  isDone
                    ? 'bg-[#F4F9F5] border-[#CFDFD3]/70 opacity-75'
                    : isProof
                    ? 'bg-gradient-to-r from-[#F8EDE8]/80 to-[#FFFFFF] border-[#E7E1DA] shadow-xs ring-1 ring-[#B85C3B]/20'
                    : 'bg-[#FFFFFF] border-[#E7E1DA] hover:border-[#D6CEBE]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="text-[#8F877F] hover:text-[#B85C3B] transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#6B7A5B] fill-[#EEF2EC]" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-[#B85C3B]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isDone ? 'line-through text-[#8F877F]' : 'text-[#1B1A19]'
                      }`}
                    >
                      {t.title}
                    </p>
                    {isProof && (
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#B85C3B]">
                        ★ Primary Anchor
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Quick Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  {/* Star as Proof Action */}
                  <button
                    onClick={() => handlePromoteProof(t.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isProof
                        ? 'text-[#F59E0B] fill-[#F59E0B]'
                        : 'text-[#DDD7CB] hover:text-[#F59E0B]'
                    }`}
                    title={isProof ? 'Primary Anchor' : 'Make #1 Proof Action'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isProof ? 'fill-current' : ''}`} />
                  </button>

                  {/* Start Focus Timer */}
                  {!isDone && (
                    <button
                      onClick={() => startFocusSession(t)}
                      className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#B85C3B] hover:bg-[#F8EDE8]"
                      title="Launch Focus Session"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(t.id)}
                    className="p-1.5 rounded-lg text-transparent group-hover:text-[#DDD7CB] hover:text-[#DC2626] transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right 5 Cols: Ambient Scratchpad & Brain Dump */}
      <div className="lg:col-span-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-3.5 h-3.5 text-[#B85C3B]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1B1A19] font-editorial">
              Thought Sanctuary & Scratchpad
            </h3>
          </div>
          <span className="text-[10px] text-[#8F877F]">Auto-saves locally</span>
        </div>

        <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-xs space-y-2">
          <textarea
            rows={8}
            value={scratchpadText}
            onChange={(e) => handleScratchpadChange(e.target.value)}
            placeholder="Jot down quick thoughts, fleeting ideas, phone numbers, or immediate reminders without breaking focus..."
            className="w-full text-xs leading-relaxed p-2 bg-transparent focus:outline-none resize-none text-[#1B1A19] placeholder:text-[#8F877F]"
          />
          <div className="flex items-center justify-between pt-2 border-t border-[#E7E1DA]/60 text-[10px] text-[#8F877F]">
            <span>{scratchpadText.length} characters</span>
            <span className="text-[#6B7A5B]">● In sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
