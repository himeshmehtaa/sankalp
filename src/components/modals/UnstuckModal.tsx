import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UnstuckStateKey } from '../../types';
import {
  Zap,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StateOption {
  key: UnstuckStateKey;
  label: string;
  ack: string;
  obstacle: string;
  action: string;
}

const stateOptions: StateOption[] = [
  {
    key: 'scrolling',
    label: 'I am scrolling instead of working.',
    ack: "You don't need to recover the lost time right now. Forgiveness is practical.",
    obstacle: 'Dopamine seeking triggered by mild cognitive fatigue or starting friction.',
    action: 'Close your browser tabs, set your phone face down in another room, and write just the title or first line of your current task for 2 minutes.',
  },
  {
    key: 'overthinking',
    label: 'I am overthinking my next step.',
    ack: 'Clarity is not the prerequisite for action; clarity is the result of action.',
    obstacle: 'Treating a provisional decision as an irreversible commitment.',
    action: 'Pick the single simplest next step—even if imperfect—and execute it now. "I can move without complete certainty."',
  },
  {
    key: 'imperfection_fear',
    label: 'I am afraid my work will not be good enough.',
    ack: 'No seminal work was born fully formed. Give yourself permission to make an ugly first draft.',
    obstacle: 'Conflating initial draft quality with your personal identity or capability.',
    action: 'Deliberately create a messy rough sketch or draft for 10 minutes without judging or polishing a single line.',
  },
  {
    key: 'task_overwhelm',
    label: 'I feel overwhelmed by too many tasks.',
    ack: 'You cannot do five things at once, and you are not expected to.',
    obstacle: 'Cognitive load caused by holding multiple competing demands simultaneously.',
    action: 'Hide all lists. Pick only your #1 Proof Action for today. Ignore everything else until that single block is complete.',
  },
  {
    key: 'avoiding_conversation',
    label: 'I am avoiding a difficult conversation.',
    ack: 'The anxiety of avoidance is almost always heavier than the conversation itself.',
    obstacle: 'Anticipatory dread and fear of conflict or vulnerability.',
    action: 'Open a blank note and write out the single fact you need to communicate in 140 characters or less. Do not send yet; just articulate the core truth.',
  },
  {
    key: 'defensive_frustrated',
    label: 'I am frustrated or defensive.',
    ack: 'Frustration is simply an unmet expectation colliding with reality. Take a full breath.',
    obstacle: 'Adrenaline and ego threat narrowing your cognitive aperture.',
    action: 'Step away from the screen for 2 minutes. Drink a full glass of cold water, loosen your shoulders, and exhale slowly.',
  },
  {
    key: 'lost_momentum',
    label: 'I have lost momentum after missing a day.',
    ack: 'A missed day is just a data point, never a moral deficit. Progress is a continuum, not a streak.',
    obstacle: 'The all-or-nothing cognitive distortion.',
    action: 'Do not attempt to make up for yesterday. Do 2 minutes of today’s baseline habit right now to re-establish the groove.',
  },
  {
    key: 'custom',
    label: 'Something else...',
    ack: 'Whatever you are feeling right now is understandable. Let us strip away the noise.',
    obstacle: 'Friction between internal resistance and external expectation.',
    action: 'Identify the smallest physical action that takes less than 120 seconds and do only that.',
  },
];

export const UnstuckModal: React.FC = () => {
  const {
    isUnstuckModalOpen,
    setIsUnstuckModalOpen,
    unstuckPreselectedKey,
    logUnstuckIntervention,
    startFocusSession,
    tasks,
    showToast,
  } = useApp();

  const [selectedKey, setSelectedKey] = useState<UnstuckStateKey | null>(null);
  const [customDescription, setCustomDescription] = useState('');
  const [stage, setStage] = useState<'select' | 'solution' | 'completed'>('select');
  const [helpfulFeedback, setHelpfulFeedback] = useState<boolean | null>(null);

  useEffect(() => {
    if (unstuckPreselectedKey) {
      setSelectedKey(unstuckPreselectedKey);
      setStage('solution');
    } else {
      setSelectedKey(null);
      setStage('select');
      setHelpfulFeedback(null);
    }
  }, [unstuckPreselectedKey, isUnstuckModalOpen]);

  if (!isUnstuckModalOpen) return null;

  const currentOption = stateOptions.find((o) => o.key === selectedKey);

  const handleSelectState = (key: UnstuckStateKey) => {
    setSelectedKey(key);
    setStage('solution');
  };

  const handleStartTimer = (duration: '2min' | '10min') => {
    if (!currentOption) return;

    // Log the intervention
    logUnstuckIntervention({
      stateKey: currentOption.key,
      stateLabel: currentOption.label,
      userNotes: customDescription,
      guidanceText: currentOption.ack,
      recommendedPhysicalAction: currentOption.action,
      durationSelected: duration,
      wasHelpful: true,
    });

    try {
      confetti({
        particleCount: 25,
        spread: 40,
        origin: { y: 0.8 },
        colors: ['#C85A17', '#E9D5C3', '#4D6B53'],
      });
    } catch (e) {
      // ignore
    }

    setIsUnstuckModalOpen(false);

    // Find proof action or generic task
    const proofTask = tasks.find((t) => t.priority === 'proof' && t.status !== 'completed');
    startFocusSession(
      proofTask || {
        id: `unstuck-${Date.now()}`,
        title: currentOption.action.slice(0, 60) + '...',
        bucket: 'today',
        priority: 'proof',
        status: 'in_progress',
        subtasks: [],
        createdAt: new Date().toISOString(),
      }
    );

    showToast(`Micro-focus started (${duration}). You are moving.`);
  };

  const handleRecordHelpful = (helpful: boolean) => {
    setHelpfulFeedback(helpful);
    if (currentOption) {
      logUnstuckIntervention({
        stateKey: currentOption.key,
        stateLabel: currentOption.label,
        userNotes: customDescription,
        guidanceText: currentOption.ack,
        recommendedPhysicalAction: currentOption.action,
        durationSelected: '2min',
        wasHelpful: helpful,
      });
    }
    showToast(helpful ? 'Saved! You have reclaimed momentum.' : 'Logged. Take it gently.');
    setTimeout(() => {
      setIsUnstuckModalOpen(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="unstuck-modal-title"
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F5] border border-[#E8E2D8] rounded-2xl shadow-2xl p-6 sm:p-7 overflow-hidden text-[#1C1917]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FAF0E6] flex items-center justify-center text-[#C85A17] border border-[#E9D5C3]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 id="unstuck-modal-title" className="text-base font-bold text-[#1C1917] tracking-tight">
                Get Me Unstuck
              </h2>
              <p className="text-xs text-[#8F877F]">
                Non-judgmental intervention to interrupt resistance
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUnstuckModalOpen(false)}
            className="p-1.5 rounded-lg text-[#8F877F] hover:text-[#1C1917] hover:bg-[#EBE5DB] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stage 1: State Selection */}
        {stage === 'select' && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
              What is happening right now?
            </p>
            <div className="space-y-1.5 max-h-[50vh] overflow-y-auto pr-1">
              {stateOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSelectState(opt.key)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-[#E8E2D8] bg-[#FFFFFF] hover:border-[#C85A17]/60 hover:bg-[#FAF0E6]/30 text-left text-xs font-medium text-[#1C1917] transition-all group shadow-2xs"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">
                    {opt.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8F877F] group-hover:text-[#C85A17] shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Stage 2: Immediate Practical Solution */}
        {stage === 'solution' && currentOption && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Step 1: Acknowledgment */}
            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E2DBD0] shadow-2xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C85A17]">
                Acknowledge
              </span>
              <p className="text-sm text-[#1C1917] font-medium leading-relaxed font-serif-quote italic">
                "{currentOption.ack}"
              </p>
            </div>

            {/* Step 2: Immediate Obstacle Identified */}
            <div className="p-3.5 rounded-xl bg-[#F4EFEA] border border-[#E8E2D8] space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                The Immediate Obstacle
              </span>
              <p className="text-xs text-[#57534E] leading-normal">{currentOption.obstacle}</p>
            </div>

            {/* Step 3: Specific Physical Action */}
            <div className="p-4 rounded-xl bg-[#FAF0E6] border border-[#E9D5C3] space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9A420E]">
                One Physical Next Action
              </span>
              <p className="text-xs font-semibold text-[#1C1917] leading-relaxed">
                {currentOption.action}
              </p>
            </div>

            {/* Optional Custom Note */}
            {currentOption.key === 'custom' && (
              <textarea
                placeholder="Briefly describe what you are avoiding or feeling..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] resize-none h-16"
              />
            )}

            {/* Step 4: Micro-starting options */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-[#8F877F] uppercase tracking-wider mb-2">
                Choose a micro-start
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => handleStartTimer('2min')}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1C1917] text-[#FAF8F5] hover:bg-[#2F2B28] text-xs font-semibold shadow-xs transition-colors"
                >
                  <Clock className="w-4 h-4 text-[#C85A17]" />
                  <span>2-Minute Micro Action</span>
                </button>
                <button
                  onClick={() => handleStartTimer('10min')}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl border border-[#D6CEBE] bg-[#FFFFFF] hover:bg-[#F3EFEA] text-xs font-semibold text-[#1C1917] shadow-xs transition-colors"
                >
                  <Clock className="w-4 h-4 text-[#78716C]" />
                  <span>10-Minute Focus Session</span>
                </button>
              </div>
            </div>

            {/* Feedback / Back */}
            <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D8]">
              <button
                onClick={() => setStage('select')}
                className="text-xs text-[#8F877F] hover:text-[#1C1917] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Choose another situation</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#8F877F]">Did this perspective help?</span>
                <button
                  onClick={() => handleRecordHelpful(true)}
                  className={`p-1.5 rounded-md hover:bg-[#EBE5DB] transition-colors ${
                    helpfulFeedback === true ? 'text-[#C85A17]' : 'text-[#8F877F]'
                  }`}
                  title="Yes, this was helpful"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleRecordHelpful(false)}
                  className={`p-1.5 rounded-md hover:bg-[#EBE5DB] transition-colors ${
                    helpfulFeedback === false ? 'text-[#C85A17]' : 'text-[#8F877F]'
                  }`}
                  title="Not quite"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
