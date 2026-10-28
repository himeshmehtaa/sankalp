import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIChatMessage, Task } from '../../types';
import {
  Sparkles,
  Send,
  Target,
  Clock,
  Zap,
  CheckCircle2,
  HelpCircle,
  Plus,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AICoachView: React.FC = () => {
  const {
    profile,
    goals,
    tasks,
    focusSessions,
    journalEntries,
    addTask,
    startFocusSession,
    openUnstuckWithState,
    showToast,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: `Hello ${profile.name}. I am your SANKALP personal coach. I am grounded in your recorded life vision: "${profile.lifeVision}".

How can I serve your execution today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const presetPrompts = [
    "Help me pick today's #1 Proof Action",
    "Break down my goal into 3 practical steps",
    "I only have 45 minutes today—what should I do?",
    "Summarise my recent focus sessions and progress",
    "Help me prepare for an important conversation",
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');

    // Generate grounded, contextual response based on actual user data
    setTimeout(() => {
      const lower = text.toLowerCase();
      let replyContent = '';
      let suggestedAction: AIChatMessage['suggestedAction'] = undefined;

      if (lower.includes('priority') || lower.includes('proof action') || lower.includes("today's")) {
        const pendingProof = tasks.find((t) => t.priority === 'proof' && t.status !== 'completed');
        if (pendingProof) {
          replyContent = `Looking at your recorded tasks, you already designated "${pendingProof.title}" as your #1 Proof Action. 

My honest coaching advice: do not search for a new priority until this anchor is finished. Would you like to enter a 25-minute focus sanctuary right now to make tangible progress?`;
          suggestedAction = {
            type: 'start_focus',
            label: `Launch Focus: ${pendingProof.title.slice(0, 30)}...`,
            payload: pendingProof,
          };
        } else {
          const activeQuarterlyGoal = goals.find((g) => g.level === 'quarterly' && g.status === 'active');
          replyContent = activeQuarterlyGoal
            ? `Your active 90-day goal is "${activeQuarterlyGoal.title}". The highest-leverage Proof Action today is to advance its next milestone. Here is a concrete proposal:`
            : `You do not have a defined Proof Action yet for today. Here is a proposed anchor:`;
          suggestedAction = {
            type: 'create_task',
            label: 'Add Proposed Proof Action',
            payload: {
              title: activeQuarterlyGoal ? `Execute key sprint for ${activeQuarterlyGoal.title}` : 'Complete 45-minute deep focus block on main project',
              priority: 'proof',
              bucket: 'today',
            },
          };
        }
      } else if (lower.includes('break down') || lower.includes('steps')) {
        const primaryGoal = goals.find((g) => g.status === 'active') || goals[0];
        replyContent = `Let's break down "${primaryGoal.title}" into three sequential, physical steps to eliminate cognitive overload:

1. **Step 1 (Clarify)**: Write a 1-page architecture brief defining non-negotiables (25m).
2. **Step 2 (Draft)**: Build the simplest workable prototype without polish (50m).
3. **Step 3 (Review)**: Test against real constraints and note 3 lessons learned (20m).

Would you like me to add Step 1 to today's task list?`;
        suggestedAction = {
          type: 'create_task',
          label: 'Add Step 1 to Today’s Tasks',
          payload: {
            title: `Step 1: Write 1-page architecture brief for ${primaryGoal.title.slice(0, 25)}...`,
            priority: 'supporting',
            bucket: 'today',
            estimatedMinutes: 25,
            goalId: primaryGoal.id,
          },
        };
      } else if (lower.includes('45 minutes') || lower.includes('limited time')) {
        replyContent = `With 45 minutes of available time, avoid context-switching. 

Recommendation:
- **5 min**: Close all distractions and write out your single goal for this block.
- **35 min**: Deep, single-threaded execution on your highest priority task.
- **5 min**: Log actual output in SANKALP and shutdown cleanly.`;
        suggestedAction = {
          type: 'start_focus',
          label: 'Start 35-Minute Focus Block',
          payload: null,
        };
      } else if (lower.includes('summarise') || lower.includes('focus') || lower.includes('sessions')) {
        const totalMinutes = focusSessions.reduce((acc, curr) => acc + curr.actualMinutes, 0);
        replyContent = `Based strictly on your recorded sessions:
- You have completed **${focusSessions.length} focus sessions** totaling **${totalMinutes} minutes** of documented deep work.
- Latest session: "${focusSessions[0]?.taskTitle || 'Focused deep work'}" (${focusSessions[0]?.actualMinutes || 0}m).

Observation: Your focus consistency is solid. Maintain the boundary around morning blocks to sustain momentum.`;
      } else if (lower.includes('conversation') || lower.includes('difficult')) {
        replyContent = `Difficult conversations feel heavy because we try to solve the entire relationship at once.

3 Grounded Rules:
1. **State the core fact without blame**: "When X happened, the impact on the project was Y."
2. **Express your shared commitment**: "I want us to build great work together."
3. **Listen for their reality**: Ask, "How did this look from your side?" and remain silent for 10 seconds.`;
      } else {
        replyContent = `I hear you. Remember your personal principle: "${profile.guidingPrinciple}". 

What is the single smallest physical action you can take in the next 120 seconds to move this forward?`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: replyContent,
          suggestedAction,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  const handleApplyAction = (action: AIChatMessage['suggestedAction']) => {
    if (!action) return;

    if (action.type === 'create_task') {
      addTask({
        ...action.payload,
        status: 'todo',
        subtasks: [],
      });
      try {
        confetti({ particleCount: 25, spread: 50, colors: ['#C85A17', '#FAF0E6'] });
      } catch (e) {}
      showToast('Task added to your list with your confirmation.');
    } else if (action.type === 'start_focus') {
      startFocusSession(action.payload);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              AI Life Coach & Strategic Counsel
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Empathetic, accountable, and grounded. Requires your explicit confirmation before saving any changes.
          </p>
        </div>
      </div>

      {/* Preset Prompts Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {presetPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="text-xs text-[#57534E] hover:text-[#C85A17] bg-[#FFFFFF] border border-[#E8E2D8] hover:border-[#C85A17]/40 px-3 py-1.5 rounded-full whitespace-nowrap shadow-2xs transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 shadow-xs space-y-4 min-h-[420px] max-h-[58vh] overflow-y-auto">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-[#8F877F] px-1">
                <span>{isUser ? profile.name : 'SANKALP Coach'}</span>
                <span>•</span>
                <span>{m.timestamp}</span>
              </div>

              <div
                className={`p-4 rounded-2xl max-w-xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#1C1917] text-[#FAF8F5] rounded-br-xs'
                    : 'bg-[#FAF8F5] border border-[#E8E2D8] text-[#1C1917] rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Suggested Action Pill requiring confirmation */}
                {m.suggestedAction && (
                  <div className="mt-3 pt-3 border-t border-[#E8E2D8] flex items-center justify-between gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A17]">
                      Proposed Change
                    </span>
                    <button
                      onClick={() => handleApplyAction(m.suggestedAction)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#C85A17] hover:bg-[#B34D10] text-[#FFFFFF] text-[11px] font-bold shadow-xs transition-colors"
                    >
                      <span>{m.suggestedAction.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask for guidance on priorities, goal breakdown, or overcoming resistance..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-1 text-xs px-4 py-3 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] text-[#1C1917]"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="px-5 py-3 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
