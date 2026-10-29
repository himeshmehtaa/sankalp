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
      confetti({ particleCount: 20, spread: 40, colors: ['#C85A17', '#F59E0B'] });
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
            <span className="w-2 h-2 rounded-full bg-[#C85A17]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1917] font-editorial">
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
            className="w-full text-xs font-medium pl-4 pr-12 py-3 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-2xs focus:outline-none focus:border-[#C85A17] focus:ring-2 focus:ring-[#C85A17]/10 transition-all text-[#1C1917] placeholder:text-[#8F877F]"
          />
          <button
            type="submit"
            disabled={!newTaskTitle.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-white disabled:opacity-30 transition-opacity"
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
                    ? 'bg-gradient-to-r from-[#FAF0E6]/80 to-[#FFFFFF] border-[#E9D5C3] shadow-xs ring-1 ring-[#C85A17]/20'
                    : 'bg-[#FFFFFF] border-[#E8E2D8] hover:border-[#D6CEBE]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => toggleTaskStatus(t.id)}
                    className="text-[#8F877F] hover:text-[#C85A17] transition-colors shrink-0"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-[#4D6B53] fill-[#EEF4F0]" />
                    ) : (
                      <Circle className="w-5 h-5 hover:text-[#C85A17]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold truncate ${
                        isDone ? 'line-through text-[#8F877F]' : 'text-[#1C1917]'
                      }`}
                    >
                      {t.title}
                    </p>
                    {isProof && (
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#C85A17]">
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
                      className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#C85A17] hover:bg-[#FAF0E6]"
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
            <Edit3 className="w-3.5 h-3.5 text-[#C85A17]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1C1917] font-editorial">
              Thought Sanctuary & Scratchpad
            </h3>
          </div>
          <span className="text-[10px] text-[#8F877F]">Auto-saves locally</span>
        </div>

        <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs space-y-2">
          <textarea
            rows={8}
            value={scratchpadText}
            onChange={(e) => handleScratchpadChange(e.target.value)}
            placeholder="Jot down quick thoughts, fleeting ideas, phone numbers, or immediate reminders without breaking focus..."
            className="w-full text-xs leading-relaxed font-serif-quote p-2 bg-transparent focus:outline-none resize-none text-[#292524] placeholder:text-[#A8A29E]"
          />
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8]/60 text-[10px] text-[#8F877F]">
            <span>{scratchpadText.length} characters</span>
            <span className="text-[#4D6B53]">● In sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
