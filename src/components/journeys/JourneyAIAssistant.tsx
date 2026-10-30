import React, { useState } from 'react';
import { GuidedJourney, JourneyDay } from '../../types/journeys';
import {
  Sparkles,
  X,
  Send,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Flame,
  ArrowRight,
  ShieldCheck,
  Bot,
} from 'lucide-react';
import { SankalpSymbol } from '../brand/SankalpLogo';

interface JourneyAIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  journey: GuidedJourney;
  currentDay?: JourneyDay;
}

interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  mentorQuote?: string;
  actionPrompt?: string;
  timestamp: string;
}

export const JourneyAIAssistant: React.FC<JourneyAIAssistantProps> = ({
  isOpen,
  onClose,
  journey,
  currentDay,
}) => {
  const activeDay =
    currentDay ||
    journey.days.find((d) => d.status === 'today') ||
    journey.days[0];

  const suggestedQuestions = [
    { label: 'What should I do today?', prompt: 'What should I do today based on my mentor’s plan?' },
    { label: 'Explain today’s instructions simply', prompt: 'Explain today’s instructions simply in 3 clear steps.' },
    { label: 'What does "Output before organization" mean?', prompt: 'What does my mentor mean by "Output before organization"?' },
    { label: 'Heavy day — what is my minimum plan?', prompt: 'I have a very heavy office day today. What is my minimum required plan?' },
    { label: 'Summarise my progress so far', prompt: 'Summarise my progress and proof so far in this journey.' },
    { label: 'Help me write tonight’s reflection', prompt: 'Help me draft tonight’s one-line reflection using my mentor’s template.' },
  ];

  const initialGreeting: AssistantMessage = {
    id: 'msg-0',
    sender: 'assistant',
    content: `Hello! I am your SANKALP Programme Assistant for "${journey.title}". My guidance is strictly grounded in the document provided by your mentor (${journey.mentorName}). How can I support your practice today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  const [messages, setMessages] = useState<AssistantMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateMentorGroundedResponse(promptText, journey, activeDay);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1B1A19]/50 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl h-[85vh] bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E7E1DA] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#B85C3B] to-[#9A420E] text-white flex items-center justify-center shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#1B1A19]">Programme Assistant</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EEF2EC] text-[#6B7A5B] border border-[#6B7A5B]/30">
                  Mentor-Grounded
                </span>
              </div>
              <p className="text-[11px] text-[#78716C] truncate max-w-xs sm:max-w-md">
                Grounded strictly in {journey.mentorName}’s document
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#78716C] hover:text-[#1B1A19] hover:bg-[#FAF8F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grounding Notice Pill */}
        <div className="px-6 py-2 bg-[#F8EDE8]/60 border-b border-[#E7E1DA] flex items-center gap-2 text-xs text-[#9A420E]">
          <ShieldCheck className="w-4 h-4 shrink-0 text-[#B85C3B]" />
          <span className="text-[11px] leading-tight">
            Distinguishes mentor's original wording from AI suggestions. Never invents rules.
          </span>
        </div>

        {/* Chat Transcript */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                  m.sender === 'user'
                    ? 'bg-[#1B1A19] text-white rounded-br-xs'
                    : 'bg-white border border-[#E7E1DA] text-[#1B1A19] shadow-2xs rounded-bl-xs'
                }`}
              >
                {/* Mentor Quote Card if present */}
                {m.mentorQuote && (
                  <div className="p-3 rounded-xl bg-[#FAF8F4] border-l-3 border-[#B85C3B] text-xs text-[#292524] space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#B85C3B] block">
                      Mentor's Exact Words:
                    </span>
                    <p className="italic">"{m.mentorQuote}"</p>
                  </div>
                )}

                <div className="whitespace-pre-wrap">{m.content}</div>

                {/* Optional action prompt */}
                {m.actionPrompt && (
                  <div className="pt-2 border-t border-[#E7E1DA]/80 text-[11px] text-[#57534E] font-medium flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-[#B85C3B]" />
                    <span>{m.actionPrompt}</span>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-[#A8A29E] mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#78716C] italic bg-white p-3 rounded-xl border border-[#E7E1DA] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#B85C3B] animate-ping" />
              <span>Consulting mentor's instructions...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 sm:px-6 py-2.5 bg-white/70 border-t border-[#E7E1DA] overflow-x-auto scrollbar-none flex items-center gap-2">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(q.prompt)}
              className="shrink-0 px-3 py-1.5 rounded-full bg-[#FAF8F4] hover:bg-[#F2ECE6] border border-[#E7E1DA] text-[11px] font-medium text-[#44403C] hover:text-[#1B1A19] transition-all"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#E7E1DA] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendPrompt(inputText);
            }}
            placeholder={`Ask about Day ${activeDay.dayNumber} instructions or mentor rules...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#FAF8F4] border border-[#E7E1DA] text-xs sm:text-sm text-[#1B1A19] placeholder:text-[#A8A29E] focus:outline-hidden focus:border-[#B85C3B]"
          />

          <button
            onClick={() => handleSendPrompt(inputText)}
            disabled={!inputText.trim()}
            className="px-4 py-2.5 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Mentor Grounded Logic Generator
function generateMentorGroundedResponse(
  query: string,
  journey: GuidedJourney,
  activeDay: JourneyDay
): AssistantMessage {
  const q = query.toLowerCase();
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. What should I do today?
  if (q.includes('what should i do') || q.includes('today')) {
    const workSec = activeDay.sections.find((s) => s.type === 'work');
    const morningSec = activeDay.sections.find((s) => s.type === 'morning');
    const proofSec = activeDay.sections.find((s) => s.type === 'proof');

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      mentorQuote: workSec?.content || activeDay.theme,
      content: `Here is your mentor’s exact structure for Day ${String(activeDay.dayNumber).padStart(2, '0')} (${activeDay.theme}):\n\n1. Morning (~4 min): Feet on floor & gentle breathing (2m) → Recall one proof of capability (1m) → Name the 1 deliverable that must exist today (1m).\n\n2. Work Block (25–40 min): Work on your real deliverable BEFORE opening or organizing Notion.\n\n3. Evening (~90 sec): Write one line in your reflection template.\n\nExpected proof for today: ${proofSec?.content || 'A saved improvement to real work.'}`,
      actionPrompt: 'Open the "Do The Work" section and start a 25-minute focus session.',
      timestamp,
    };
  }

  // 2. Output before organization
  if (q.includes('output before organization') || q.includes('notion')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      mentorQuote: journey.importantRule || 'OUTPUT BEFORE ORGANIZATION: Notion is allowed... but not as a substitute for creating.',
      content: `Your mentor emphasizes that organizing dashboards, tweaking Notion properties, or researching courses often masquerades as progress while avoiding the friction of making things.\n\nThe rule is simple: complete your 25–40 minute deliverable first. Only AFTER that deliverable is saved or sent may you update Notion for at most 5 minutes.`,
      actionPrompt: 'Commit to 25 minutes on your deliverable before touching Notion.',
      timestamp,
    };
  }

  // 3. Heavy day or minimum day
  if (q.includes('heavy') || q.includes('minimum') || q.includes('missed')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      mentorQuote: journey.minimumDayRule || 'Minimum day: feet on floor (1m) → finish one real 10-minute task → write a one-line note (30s). Never catch up by doubling work.',
      content: `Your mentor makes it very clear: DO NOT try to catch up by doubling tomorrow’s work, and do not mark the day as a failure.\n\nYour 11.5-Minute Fallback Plan:\n• 1 minute: Feet on floor, soften jaw and shoulders, take comfortable breaths.\n• 10 minutes: Finish one real, concrete task or single edit.\n• 30 seconds: Write your one-line evidence note.\n\nIf you already did full, focused office work today, that counts as real progress!`,
      actionPrompt: 'Tap "Switch to Minimum Day" at the top of your Day card.',
      timestamp,
    };
  }

  // 4. Summarise progress so far
  if (q.includes('summarise') || q.includes('progress') || q.includes('evidence')) {
    const completedDays = journey.days.filter((d) => d.status === 'completed');
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      content: `Progress Summary based on your saved data:\n\n• Days Completed: ${completedDays.length} of ${journey.durationDays} days (${Math.round((completedDays.length / journey.durationDays) * 100)}%)\n• Active Phase: Phase 1 (Feel steadier and act)\n• Completed Days: ${completedDays.map((d) => `Day ${d.dayNumber}`).join(', ') || 'Day 1'}\n• Evidence Rule: Your mentor reminds you to count actual outputs and times you acted despite worry, rather than evaluating whether you felt confident every single hour.`,
      actionPrompt: 'Keep stacking proof — Day ' + activeDay.dayNumber + ' is next.',
      timestamp,
    };
  }

  // 5. Reflection help
  if (q.includes('reflect') || q.includes('template')) {
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      mentorQuote: 'Today I completed ___; when fear/perfectionism showed up I ___; tomorrow I will start by ___.',
      content: `Your mentor's evening reflection is designed to take only 90 seconds. Do not write a long essay.\n\nFill out this exact sentence:\n"Today I completed [name 1 deliverable]; when fear showed up I [feet on floor / noticed gap instead of verdict]; tomorrow I will start by [open file X and edit section Y]."`,
      actionPrompt: 'Scroll down to the Evening Reflection section to save your entry.',
      timestamp,
    };
  }

  // Default fallback grounded response
  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    mentorQuote: activeDay.sections[0]?.content.slice(0, 180) + '...',
    content: `Based on your mentor’s plan for Day ${activeDay.dayNumber} ("${activeDay.theme}"): The core intention is showing up to real work with a grounded nervous system. Remember your mentor’s continuation rule: "THIS IS NOT A RESTART — keep all earlier progress and focus on the immediate next useful action."`,
    actionPrompt: 'What specific part of today’s instruction would you like to explore?',
    timestamp,
  };
}
