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
  Copy,
  Check,
  Flame,
  ShieldAlert,
  Compass,
  ArrowLeft,
  Volume2,
  Wind,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CustomSelect } from '../common/CustomSelect';

interface DetailedProtocol {
  key: UnstuckStateKey;
  label: string;
  category: string;
  protocolName: string;
  tagline: string;
  rootCause: string;
  quote: string;
  steps: string[];
  toolType:
    | 'anchor_line'
    | 'reversibility_coin'
    | 'shitty_draft'
    | 'task_sieve'
    | 'communication_script'
    | 'sigh_pacer'
    | 'never_twice'
    | 'custom_input';
  defaultMicroAction: string;
}

const detailedProtocols: DetailedProtocol[] = [
  {
    key: 'scrolling',
    label: 'I am scrolling instead of working.',
    category: 'Attention Drift',
    protocolName: 'The Cold Disconnect & Single-Line Anchor',
    tagline: 'Dopamine Circuit Reset',
    rootCause:
      'Your brain encountered starting friction or mild cognitive fatigue, triggering an automated reflex to seek effortless micro-dopamine.',
    quote:
      "You don't need to recover the lost hour right now. Forgiveness is practical. Momentum begins with 120 seconds of physical contact with your craft.",
    steps: [
      'Physically move your phone at least 10 feet away or face-down in another room right now.',
      'Close all browser tabs except the single document or tool you need.',
      'Write just 1 rough sentence or line of code—no matter how messy—before looking at anything else.',
    ],
    toolType: 'anchor_line',
    defaultMicroAction: 'Open the working file and write the single worst sentence of the draft.',
  },
  {
    key: 'overthinking',
    label: 'I am overthinking my next step.',
    category: 'Analysis Paralysis',
    protocolName: 'The 70% Reversibility Protocol',
    tagline: 'Two-Way Door Decision Framework',
    rootCause:
      'Treating a reversible, low-stakes choice (Type 2) as if it were an irreversible catastrophe (Type 1). Overthinking is often fear in a business suit.',
    quote:
      'Clarity is not the prerequisite for action; clarity is the consequence of action. In 95% of work, moving with 70% certainty beats waiting for 100%.',
    steps: [
      'Ask: "Can this decision be reversed or modified within 24 hours?" If yes, it is a two-way door.',
      'Apply Colin Powell’s rule: Once you have between 40% and 70% of the information, execute.',
      'Commit to Option A for the next 15 minutes. Action will generate the exact data you are waiting for.',
    ],
    toolType: 'reversibility_coin',
    defaultMicroAction: 'Choose Option A for the next 15 minutes and produce the first tangible artifact.',
  },
  {
    key: 'imperfection_fear',
    label: 'I am afraid my work will not be good enough.',
    category: 'Ego Protection',
    protocolName: 'The Deliberate "Shitty First Draft" License',
    tagline: 'Perfectionism Neutralizer',
    rootCause:
      'Conflating the raw, initial quality of an unedited draft with your intrinsic capability or intelligence.',
    quote:
      'No seminal work was born fully formed. Perfectionism is not a standard of excellence; it is the terror of being judged. Grant yourself permission to make something ugly.',
    steps: [
      'Explicitly declare: "My only goal for the next 5 minutes is to produce quantity, not quality."',
      'Backspacing, deleting, and editing sentences is strictly forbidden during this sprint.',
      'Remember: Polish is an editorial craft. Creation is an untidy, messy accumulation.',
    ],
    toolType: 'shitty_draft',
    defaultMicroAction: 'Produce 120 seconds of raw, unpolished text without hitting backspace once.',
  },
  {
    key: 'task_overwhelm',
    label: 'I feel overwhelmed by too many tasks.',
    category: 'Executive RAM Overload',
    protocolName: 'The Surgical 1-Item Sieve',
    tagline: 'Cognitive Load Reduction',
    rootCause:
      'Holding 7+ open loops in working memory triggers acute cortisol release and frontal lobe paralysis.',
    quote:
      'You cannot do five things at once, and nobody expects you to. When everything feels urgent, nothing is intentional.',
    steps: [
      'Hide every list, email tab, and slack window.',
      'Isolate the single Proof Action that, if completed, would make today a win.',
      'Give yourself full permission to drop or ignore every other responsibility until this single block finishes.',
    ],
    toolType: 'task_sieve',
    defaultMicroAction: 'Focus exclusively on your #1 Proof Action for 10 uninterrupted minutes.',
  },
  {
    key: 'avoiding_conversation',
    label: 'I am avoiding a difficult conversation.',
    category: 'Interpersonal Friction',
    protocolName: 'The 3-Part Non-Violent Communication Script',
    tagline: 'Clean Direct Communication',
    rootCause:
      'Anticipatory dread magnifies the imagined emotional fallout by 10x compared to actual reality.',
    quote:
      'The anxiety of avoidance is almost always heavier than the conversation itself. State the clean observation without emotional armor.',
    steps: [
      'Step 1 (Observation): State the neutral fact ("When the timeline adjusted yesterday...").',
      'Step 2 (Impact/Need): State your intention ("...I want to ensure we stay aligned and neither of us feels stressed").',
      'Step 3 (Invitation): Request a bounded sync ("Can we take 7 minutes tomorrow morning to align?").',
    ],
    toolType: 'communication_script',
    defaultMicroAction: 'Draft and send a 3-sentence calendar or message invitation, then step away.',
  },
  {
    key: 'defensive_frustrated',
    label: 'I am frustrated or defensive.',
    category: 'Somatic Dysregulation',
    protocolName: 'The Vagus Nerve Physiological Sigh Reset',
    tagline: 'Neurochemical Down-Regulation',
    rootCause:
      'Sympathetic nervous system arousal has flooded your bloodstream with adrenaline, constricting your cognitive aperture and prefrontal control.',
    quote:
      'Frustration is an unexamined expectation colliding with reality. You cannot think your way out of a nervous system storm; you must breathe your way through it.',
    steps: [
      'Do two quick, sharp inhales through your nose, followed by one long, slow, audible exhale through your mouth.',
      'Repeat this physiological sigh 3 times to immediately drop heart rate and CO2 levels.',
      'Enforce a strict 15-minute moratorium before replying to any email, chat, or message.',
    ],
    toolType: 'sigh_pacer',
    defaultMicroAction: 'Perform 3 physiological sighs, drink a full glass of cold water, and pause.',
  },
  {
    key: 'lost_momentum',
    label: 'I have lost momentum after missing a day.',
    category: 'Continuity Reclaim',
    protocolName: 'The "Never Twice" Identity Anchor',
    tagline: 'James Clear Habit Protocol',
    rootCause:
      'The "all-or-nothing" fallacy tricks you into believing that 1 missed day erases 30 days of compounding.',
    quote:
      'Missing once is an accident. Missing twice is the start of a new habit. Progress is a continuum, never a fragile streak.',
    steps: [
      'Do not attempt to double your workload today to compensate for yesterday.',
      'Execute the absolute minimum atomic version of your habit right now (60 seconds).',
      'Declare to yourself: "I am a person who still shows up, even on imperfect days."',
    ],
    toolType: 'never_twice',
    defaultMicroAction: 'Perform a 60-second baseline rep of your anchor habit right now.',
  },
  {
    key: 'custom',
    label: 'Something else...',
    category: 'General Friction',
    protocolName: 'The 120-Second Micro-Wedge',
    tagline: 'Physical Friction Breakdown',
    rootCause:
      'A vague cloud of internal friction is obscuring a very small, concrete physical motion.',
    quote:
      'Behind every vague resistance is a tiny physical movement you are avoiding. Identify the physics, shrink the scope, and begin.',
    steps: [
      'Name the physical action: Is it opening a file? Clicking a link? Dialing a number?',
      'Shrink the expectation until your brain stops resisting the movement.',
      'Commit to exactly 120 seconds. Once physical motion begins, momentum takes over.',
    ],
    toolType: 'custom_input',
    defaultMicroAction: 'Perform 120 seconds of the simplest physical starting action.',
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
  const [stage, setStage] = useState<'select' | 'protocol'>('select');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [customText, setCustomText] = useState('');
  const [anchorLine, setAnchorLine] = useState('');
  const [selectedProofTaskId, setSelectedProofTaskId] = useState('');
  const [sighCount, setSighCount] = useState(0);
  const [scriptCopied, setScriptCopied] = useState(false);
  const [coinResult, setCoinResult] = useState<'A' | 'B' | null>(null);

  useEffect(() => {
    if (unstuckPreselectedKey) {
      setSelectedKey(unstuckPreselectedKey);
      setStage('protocol');
      setCompletedSteps([]);
    } else {
      setSelectedKey(null);
      setStage('select');
      setCompletedSteps([]);
    }
  }, [unstuckPreselectedKey, isUnstuckModalOpen]);

  if (!isUnstuckModalOpen) return null;

  const currentProtocol = detailedProtocols.find((p) => p.key === selectedKey);

  const handleSelectProtocol = (key: UnstuckStateKey) => {
    setSelectedKey(key);
    setStage('protocol');
    setCompletedSteps([]);
    setCoinResult(null);
    setScriptCopied(false);
  };

  const toggleStep = (idx: number) => {
    if (completedSteps.includes(idx)) {
      setCompletedSteps(completedSteps.filter((i) => i !== idx));
    } else {
      setCompletedSteps([...completedSteps, idx]);
    }
  };

  const handleStartFocus = (duration: '25min' | '10min' | '50min') => {
    if (!currentProtocol) return;

    let targetTaskTitle = currentProtocol.defaultMicroAction;
    if (currentProtocol.toolType === 'anchor_line' && anchorLine.trim()) {
      targetTaskTitle = `Anchor Action: ${anchorLine.trim()}`;
    } else if (currentProtocol.toolType === 'task_sieve' && selectedProofTaskId) {
      const found = tasks.find((t) => t.id === selectedProofTaskId);
      if (found) targetTaskTitle = found.title;
    } else if (currentProtocol.toolType === 'custom_input' && customText.trim()) {
      targetTaskTitle = `Unstuck: ${customText.trim()}`;
    }

    logUnstuckIntervention({
      stateKey: currentProtocol.key,
      stateLabel: currentProtocol.label,
      userNotes: customText || anchorLine,
      guidanceText: currentProtocol.quote,
      recommendedPhysicalAction: targetTaskTitle,
      durationSelected: duration,
      wasHelpful: true,
    });

    try {
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#B85C3B', '#E7E1DA', '#FAF8F4'],
      });
    } catch (e) {}

    setIsUnstuckModalOpen(false);

    // Seed task and launch with 25m or selected duration
    const durationMins = duration === '25min' ? 25 : duration === '10min' ? 10 : 50;
    const existingTask = tasks.find((t) => t.id === selectedProofTaskId);
    startFocusSession(
      existingTask || {
        id: `unstuck-${Date.now()}`,
        title: targetTaskTitle,
        bucket: 'today',
        priority: 'proof',
        status: 'in_progress',
        subtasks: [],
        createdAt: new Date().toISOString(),
      },
      durationMins
    );

    showToast(`Focus session launched (${durationMins}m). You are moving forward.`);
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setScriptCopied(true);
    showToast('Script copied to clipboard');
    setTimeout(() => setScriptCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/55 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl overflow-hidden text-[#1B1A19]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E1DA] bg-[#FFFFFF]/80 shrink-0">
          <div className="flex items-center gap-2.5">
            {stage === 'protocol' && (
              <button
                onClick={() => setStage('select')}
                className="p-1 rounded-lg text-[#8F877F] hover:text-[#1B1A19] hover:bg-[#F2EFEB] transition-colors mr-1"
                title="Back to states"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-[#F8EDE8] flex items-center justify-center text-[#B85C3B] border border-[#E7E1DA]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#1B1A19] tracking-tight">
                Get Me Unstuck
              </h2>
              <p className="text-[11px] text-[#8F877F]">
                {stage === 'select'
                  ? 'Identify your current friction to activate a tailored protocol'
                  : currentProtocol?.tagline}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsUnstuckModalOpen(false)}
            className="p-1.5 rounded-xl text-[#8F877F] hover:text-[#1B1A19] hover:bg-[#EBE5DB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* STAGE 1: Specific Mental State Selection */}
          {stage === 'select' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#8F877F] pb-1">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  What describes your situation right now?
                </span>
                <span className="text-[11px] font-medium">8 Protocols</span>
              </div>

              <div className="space-y-2.5">
                {detailedProtocols.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => handleSelectProtocol(p.key)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] hover:border-[#B85C3B]/60 hover:bg-[#FAF8F4] text-left transition-all group shadow-2xs"
                  >
                    <div className="space-y-1 pr-3">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85C3B]">
                        {p.category}
                      </span>
                      <p className="text-xs sm:text-sm font-semibold text-[#1B1A19] leading-snug">
                        {p.label}
                      </p>
                      <p className="text-[11px] text-[#78716C]">
                        {p.protocolName}
                      </p>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-[#FAF8F4] group-hover:bg-[#F8EDE8] flex items-center justify-center text-[#8F877F] group-hover:text-[#B85C3B] shrink-0 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 2: Deep Tailored Protocol */}
          {stage === 'protocol' && currentProtocol && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Protocol Title & Diagnosis */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1DA] shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#B85C3B]">
                    {currentProtocol.protocolName}
                  </span>
                  <span className="text-[10px] text-[#8F877F]">
                    {currentProtocol.tagline}
                  </span>
                </div>

                <p className="text-sm font-medium text-[#1B1A19] leading-relaxed">
                  "{currentProtocol.quote}"
                </p>

                <div className="pt-2 border-t border-[#E7E1DA]/60 text-xs text-[#57534E] flex items-start gap-1.5">
                  <span className="font-semibold text-[#8F877F] shrink-0">Diagnosis:</span>
                  <span>{currentProtocol.rootCause}</span>
                </div>
              </div>

              {/* Interactive Tactical Checklist */}
              <div className="space-y-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8F877F] block">
                  Action Checklist (Complete before restarting)
                </span>
                <div className="space-y-2">
                  {currentProtocol.steps.map((step, idx) => {
                    const isDone = completedSteps.includes(idx);
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left text-xs transition-all ${
                          isDone
                            ? 'bg-[#EEF2EC] border-[#CFDFD3] text-[#6B7A5B]'
                            : 'bg-[#FFFFFF] border-[#E7E1DA] text-[#1B1A19] hover:border-[#D6CEBE]'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isDone
                              ? 'bg-[#6B7A5B] border-[#6B7A5B] text-[#FFFFFF]'
                              : 'border-[#DDD7CB] bg-[#FAF8F4]'
                          }`}
                        >
                          {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={isDone ? 'line-through opacity-85' : 'font-medium'}>
                          {step}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Micro-Tool for this Specific Protocol */}
              <div className="p-4 rounded-2xl bg-[#F8EDE8]/50 border border-[#E7E1DA] space-y-3">
                {/* TOOL: Anchor Line for Scrolling */}
                {currentProtocol.toolType === 'anchor_line' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#1B1A19]">
                      Type 1 ugly sentence or code line to break the freeze:
                    </label>
                    <input
                      type="text"
                      autoFocus
                      placeholder="e.g. In this section, we need to test the auth callback handler..."
                      value={anchorLine}
                      onChange={(e) => setAnchorLine(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                    />
                  </div>
                )}

                {/* TOOL: Reversibility Coin for Overthinking */}
                {currentProtocol.toolType === 'reversibility_coin' && (
                  <div className="space-y-2 text-center">
                    <p className="text-xs font-semibold text-[#1B1A19]">
                      Coin-Flip Decider for Reversible Choices
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-1">
                      <button
                        onClick={() => setCoinResult('A')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          coinResult === 'A'
                            ? 'bg-[#B85C3B] text-[#FFFFFF] border-[#B85C3B] shadow-xs'
                            : 'bg-[#FFFFFF] border-[#E7E1DA] text-[#1B1A19]'
                        }`}
                      >
                        Lock in Option A (Recommended)
                      </button>
                      <button
                        onClick={() => setCoinResult('B')}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                          coinResult === 'B'
                            ? 'bg-[#B85C3B] text-[#FFFFFF] border-[#B85C3B] shadow-xs'
                            : 'bg-[#FFFFFF] border-[#E7E1DA] text-[#1B1A19]'
                        }`}
                      >
                        Lock in Option B
                      </button>
                    </div>
                    {coinResult && (
                      <p className="text-[11px] text-[#6B7A5B] font-medium pt-1">
                        Locked Option {coinResult}. Execute for 15 minutes before re-evaluating.
                      </p>
                    )}
                  </div>
                )}

                {/* TOOL: Shitty Draft Sandbox */}
                {currentProtocol.toolType === 'shitty_draft' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#1B1A19]">
                        Unfiltered Draft Sandbox (No Backspacing Allowed)
                      </span>
                      <span className="text-[10px] text-[#8F877F] uppercase tracking-wider">
                        Raw Stream
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Write freely here. Do not edit, do not judge, just get raw words onto the screen..."
                      value={anchorLine}
                      onChange={(e) => setAnchorLine(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B] resize-none"
                    />
                  </div>
                )}

                {/* TOOL: Task Sieve */}
                {currentProtocol.toolType === 'task_sieve' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#1B1A19]">
                      Pick ONLY ONE task to protect for today:
                    </label>
                    <CustomSelect
                      value={selectedProofTaskId}
                      onChange={(val) => setSelectedProofTaskId(val)}
                      options={[
                        { value: '', label: 'Select your #1 Anchor Task...' },
                        ...tasks
                          .filter((t) => t.status !== 'completed')
                          .map((t) => ({
                            value: t.id,
                            label: `${t.title} (${t.priority})`,
                            icon: <Target className="w-3.5 h-3.5" />,
                          })),
                      ]}
                      placeholder="Select your #1 Anchor Task..."
                    />
                  </div>
                )}

                {/* TOOL: Non-Violent Communication Script */}
                {currentProtocol.toolType === 'communication_script' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1B1A19]">
                        Ready-to-Use Direct Message Template:
                      </span>
                      <button
                        onClick={() =>
                          handleCopyScript(
                            `Hey [Name], I've been reflecting on our project timeline. I want to ensure we're both completely aligned and not carrying unnecessary friction. Can we grab 10 minutes tomorrow morning to sync quickly?`
                          )
                        }
                        className="flex items-center gap-1 text-[11px] font-semibold text-[#B85C3B] hover:underline"
                      >
                        {scriptCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{scriptCopied ? 'Copied' : 'Copy Template'}</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E7E1DA] text-xs text-[#57534E] leading-relaxed font-mono">
                      "Hey [Name], I've been reflecting on our project timeline. I want to ensure we're both completely aligned and not carrying unnecessary friction. Can we grab 10 minutes tomorrow morning to sync quickly?"
                    </div>
                  </div>
                )}

                {/* TOOL: Vagus Nerve Physiological Sigh Pacer */}
                {currentProtocol.toolType === 'sigh_pacer' && (
                  <div className="text-center space-y-3 py-1">
                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1B1A19]">
                      <Wind className="w-4 h-4 text-[#B85C3B]" />
                      <span>Physiological Sigh Pacer (Huberman Protocol)</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setSighCount((c) => Math.min(3, c + 1))}
                        className="px-4 py-2 rounded-xl bg-[#FFFFFF] border border-[#E7E1DA] text-xs font-semibold text-[#1B1A19] hover:bg-[#F8EDE8] transition-colors"
                      >
                        Completed Rep ({sighCount}/3)
                      </button>
                      {sighCount >= 3 && (
                        <span className="text-xs font-semibold text-[#6B7A5B] flex items-center gap-1">
                          <Check className="w-4 h-4" /> Reset completed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#78716C]">
                      Two quick inhales through nose + one long slow mouth exhale.
                    </p>
                  </div>
                )}

                {/* TOOL: Never Twice */}
                {currentProtocol.toolType === 'never_twice' && (
                  <div className="space-y-1.5 text-xs text-[#1B1A19]">
                    <span className="font-bold">The Minimum Atomic Rep:</span>
                    <p className="text-[#57534E] leading-relaxed">
                      "Even if you only write 2 sentences, do 5 pushups, or review 1 note—doing it today keeps the habit chain intact."
                    </p>
                  </div>
                )}

                {/* TOOL: Custom Input */}
                {currentProtocol.toolType === 'custom_input' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#1B1A19]">
                      Describe what you are avoiding or feeling:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Afraid of getting rejected by the client..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                    />
                  </div>
                )}
              </div>

              {/* Action Bridge: 25-Min Deep Focus or 10-Min Sprint */}
              <div className="pt-2 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F] block">
                  Bridge to Momentum (Select Start Option)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleStartFocus('25min')}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-[#1B1A19] hover:bg-[#2B2927] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-all active:scale-[0.99]"
                  >
                    <Clock className="w-4 h-4 text-[#B85C3B]" />
                    <span>Launch 25-Min Deep Focus</span>
                  </button>

                  <button
                    onClick={() => handleStartFocus('10min')}
                    className="flex items-center justify-center gap-2 p-3.5 rounded-2xl border border-[#E7E1DA] bg-[#FFFFFF] hover:bg-[#FAF8F4] text-[#1B1A19] text-xs font-semibold shadow-xs transition-all active:scale-[0.99]"
                  >
                    <Clock className="w-4 h-4 text-[#78716C]" />
                    <span>10-Min Sprint</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {stage === 'protocol' && (
          <div className="px-6 py-3 border-t border-[#E7E1DA] bg-[#FFFFFF]/60 flex items-center justify-between text-xs text-[#8F877F] shrink-0">
            <button
              onClick={() => setStage('select')}
              className="text-[#78716C] hover:text-[#1B1A19] font-medium"
            >
              ← Choose different state
            </button>
            <span className="text-[11px]">Sankalp Cognitive Resilience Engine</span>
          </div>
        )}
      </div>
    </div>
  );
};
