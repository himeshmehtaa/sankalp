import {
  UserProfile,
  Goal,
  Task,
  RoutineItem,
  FocusSession,
  UnstuckLog,
  JournalEntry,
  GratitudeEntry,
  Habit,
  HealthLog,
  CareerSkill,
  PortfolioProject,
  JobApplication,
  SavingsGoal,
  FinanceBill,
  LifeAdminItem,
  LifeLibraryItem,
  WeeklyReview,
} from '../types';

export const initialProfile: UserProfile = {
  name: 'Himesh',
  lifeVision: 'Build enduring, meaningful work while maintaining deep family presence, physical vitality, and inner stillness.',
  guidingPrinciple: 'I can move without complete certainty.',
  primaryDomain: 'career',
  onboardingCompleted: true,
  soundEnabled: true,
  todayMood: 'focused',
  energyLevel: 4,
  density: 'comfortable',
};

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const initialGoals: Goal[] = [
  {
    id: 'g-vision',
    title: 'Cultivate intellectual mastery and holistic family prosperity',
    description: 'A life where high-agency creative work supports deep stillness, health, and generosity to loved ones.',
    whyItMatters: 'To live with deliberate intention rather than passive reaction.',
    domain: 'growth',
    level: 'vision',
    progress: 45,
    status: 'active',
    milestones: [
      { id: 'm-v1', title: 'Achieve complete geographical & creative autonomy', completed: false },
      { id: 'm-v2', title: 'Publish seminal writings on systems and craft', completed: false },
    ],
    createdAt: '2026-01-01',
  },
  {
    id: 'g-3y-career',
    title: 'Lead design & product architecture for human-scale systems',
    description: 'Transition from general execution into principal-level strategic systems architecture and independent ventures.',
    whyItMatters: 'Direct alignment of daily craft with high leverage and autonomy.',
    domain: 'career',
    level: '3-5year',
    parentId: 'g-vision',
    targetDate: '2028-12-31',
    progress: 35,
    status: 'active',
    milestones: [
      { id: 'm-3y-1', title: 'Ship 3 end-to-end landmark design systems', completed: true },
      { id: 'm-3y-2', title: 'Establish advisory role with select craft-focused founders', completed: false },
    ],
    createdAt: '2026-01-10',
  },
  {
    id: 'g-ann-health',
    title: 'Build peak functional mobility, endurance, and restorative sleep',
    description: 'Sustain VO2 max baseline, injury-free resistance training, and consistent 7.5 hours of sleep.',
    whyItMatters: 'Energy is the foundational multiplier of every ambition and presence.',
    domain: 'health',
    level: 'annual',
    parentId: 'g-vision',
    targetDate: '2026-12-31',
    progress: 68,
    status: 'active',
    milestones: [
      { id: 'm-ann-h1', title: 'Complete half-marathon under 1h 50m with smooth recovery', completed: true },
      { id: 'm-ann-h2', title: 'Maintain 4x/week strength & mobility routine for 6 straight months', completed: false },
    ],
    createdAt: '2026-01-05',
  },
  {
    id: 'g-q-design-system',
    title: 'Ship SANKALP v1.0 and write the architecture case study',
    description: 'Finalize the personal life operating system, polish responsive interactions, and document design decisions.',
    whyItMatters: 'Validates ability to conceptualize, design, and engineer holistic products with deep restraint.',
    domain: 'career',
    level: 'quarterly',
    parentId: 'g-3y-career',
    targetDate: '2026-11-30',
    progress: 75,
    status: 'active',
    milestones: [
      { id: 'm-q1', title: 'Implement core state engine and local-first data persistence', completed: true },
      { id: 'm-q2', title: 'Complete Get Me Unstuck signature intervention flow', completed: true },
      { id: 'm-q3', title: 'Polish mobile layout, bottom sheet drawers, and keyboard shortcuts', completed: false },
      { id: 'm-q4', title: 'Draft and publish interactive deep-dive case study', completed: false },
    ],
    createdAt: '2026-10-01',
  },
  {
    id: 'g-q-finance',
    title: 'Consolidate 6-Month Emergency & Freedom Runway Fund',
    description: 'Automate surplus transfers and optimize monthly operating expenses.',
    whyItMatters: 'Freedom from anxious financial reaction brings calm and creative courage.',
    domain: 'finances',
    level: 'quarterly',
    parentId: 'g-vision',
    targetDate: '2026-12-15',
    progress: 82,
    status: 'active',
    milestones: [
      { id: 'm-qf1', title: 'Audit subscriptions and recurring services', completed: true },
      { id: 'm-qf2', title: 'Reach ₹5,00,000 target in high-yield liquid fund', completed: false },
    ],
    createdAt: '2026-10-01',
  },
];

export const initialTasks: Task[] = [
  {
    id: 't-proof-1',
    title: 'Complete SANKALP mobile responsive navigation and touch drawer tests',
    notes: 'Connects directly to Q4 goal: Ship SANKALP v1.0. Focus on clean thumb-zone access.',
    bucket: 'today',
    priority: 'proof',
    status: 'in_progress',
    goalId: 'g-q-design-system',
    dueDate: today,
    dueTime: '14:00',
    estimatedMinutes: 50,
    actualMinutes: 30,
    subtasks: [
      { id: 'st-1', title: 'Verify bottom navigation tap targets (min 48px)', completed: true },
      { id: 'st-2', title: 'Test keyboard dismissal in drawer dialogs', completed: true },
      { id: 'st-3', title: 'Validate quick capture on narrow mobile viewport', completed: false },
    ],
    createdAt: '2026-10-27',
  },
  {
    id: 't-sup-1',
    title: 'Review weekly progress and calibrate upcoming milestones',
    notes: 'Reflect on actual focus hours, habit consistency, and recalibrate expectations without judgment.',
    bucket: 'today',
    priority: 'supporting',
    status: 'todo',
    dueDate: today,
    dueTime: '17:30',
    estimatedMinutes: 30,
    subtasks: [],
    createdAt: '2026-10-28',
  },
  {
    id: 't-sup-2',
    title: '45-minute zone 2 trail run or mobility workout',
    notes: 'Keep heart rate in aerobic zone. Leave phone in bag.',
    bucket: 'today',
    priority: 'supporting',
    status: 'completed',
    goalId: 'g-ann-health',
    dueDate: today,
    dueTime: '07:30',
    estimatedMinutes: 45,
    actualMinutes: 45,
    subtasks: [],
    createdAt: '2026-10-27',
    completedAt: '2026-10-28T08:15:00Z',
  },
  {
    id: 't-up-1',
    title: 'Synthesize user interviews on daily planning friction',
    notes: 'Look for recurring patterns in avoidance behaviors and energy dips.',
    bucket: 'upcoming',
    priority: 'normal',
    status: 'todo',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    goalId: 'g-q-design-system',
    estimatedMinutes: 60,
    subtasks: [],
    createdAt: '2026-10-26',
  },
  {
    id: 't-someday-1',
    title: 'Explore Sanskrit roots of Sankalpa, Dhriti, and Viveka for essay',
    notes: 'Ancient perspectives on inner alignment and will.',
    bucket: 'someday',
    priority: 'low',
    status: 'todo',
    subtasks: [],
    createdAt: '2026-10-20',
  },
  {
    id: 't-inbox-1',
    title: 'Schedule annual vehicle insurance renewal',
    notes: 'Policy expires in two weeks.',
    bucket: 'inbox',
    priority: 'normal',
    status: 'todo',
    subtasks: [],
    createdAt: '2026-10-28',
  },
];

export const initialRoutines: RoutineItem[] = [
  {
    id: 'r-morning',
    title: 'Morning Reset',
    description: '10 min stillness, hydration, daylight exposure, review single proof action.',
    timeOfDay: 'morning',
    completedDates: [yesterday, today],
  },
  {
    id: 'r-focus',
    title: 'Deep Focus Session',
    description: 'Uninterrupted block dedicated exclusively to the #1 Proof Action.',
    timeOfDay: 'focus',
    completedDates: [yesterday],
  },
  {
    id: 'r-movement',
    title: 'Movement & Physical Vitality',
    description: 'Aerobic zone, strength, or intentional stretching.',
    timeOfDay: 'movement',
    completedDates: [twoDaysAgo, yesterday, today],
  },
  {
    id: 'r-evening',
    title: 'Evening Reflection & Shutdown',
    description: 'Acknowledge today’s effort, record gratitude, define tomorrow’s one anchor.',
    timeOfDay: 'evening',
    completedDates: [twoDaysAgo, yesterday],
  },
];

export const initialFocusSessions: FocusSession[] = [
  {
    id: 'fs-1',
    taskId: 't-proof-1',
    taskTitle: 'Complete SANKALP mobile responsive navigation',
    goalId: 'g-q-design-system',
    durationMinutes: 25,
    actualMinutes: 25,
    distractionNotes: ['Check email from client', 'Buy organic almonds'],
    sessionOutcome: 'Finished mobile bottom nav styling and responsive breakpoints.',
    timestamp: '2026-10-28T10:30:00Z',
  },
  {
    id: 'fs-2',
    taskId: 't-sup-2',
    taskTitle: '45-minute zone 2 trail run or mobility workout',
    goalId: 'g-ann-health',
    durationMinutes: 45,
    actualMinutes: 45,
    distractionNotes: [],
    sessionOutcome: 'Completed smooth 5km run feeling refreshed.',
    timestamp: '2026-10-28T07:45:00Z',
  },
];

export const initialUnstuckLogs: UnstuckLog[] = [
  {
    id: 'u-1',
    stateKey: 'scrolling',
    stateLabel: 'I am scrolling instead of working',
    userNotes: 'Felt tired after lunch, ended up on social feed for 40 minutes.',
    guidanceText: 'You do not need to recover the lost time right now. Forgiveness is practical. Open your workspace and complete one small physical action for two minutes.',
    recommendedPhysicalAction: 'Close browser tabs, put phone in another room, and write out the first heading.',
    durationSelected: '2min',
    wasHelpful: true,
    createdAt: '2026-10-27T14:20:00Z',
  },
];

export const initialJournalEntries: JournalEntry[] = [
  {
    id: 'j-1',
    title: 'The art of moving without complete certainty',
    content: `For years I waited for total confidence before committing to a project. But clarity isn't the prerequisite for action; it's the result of action.

When I sat down to sketch SANKALP this morning, the initial friction was noticeable. Instead of wrestling with self-doubt, I applied the two-minute rule: write one interface component. Within five minutes the flow state took over.

What matters today is not finishing everything, but leaving a clear trail of proof that I showed up with full attention.`,
    date: today,
    mood: 'focused',
    energy: 4,
    tags: ['Mindset', 'Craft', 'Clarity'],
    linkedGoalId: 'g-q-design-system',
    isPrivate: false,
    createdAt: '2026-10-28T09:00:00Z',
    updatedAt: '2026-10-28T09:15:00Z',
  },
  {
    id: 'j-2',
    title: 'Solitude and the rhythm of deep work',
    content: `Notice how much quieter the mind becomes when notifications are silenced and there is only one defined priority on the desk. High performance is not about doing ten things at once; it is about protecting the sanctity of one thing done with full devotion.`,
    date: yesterday,
    mood: 'calm',
    energy: 5,
    tags: ['Focus', 'Stillness'],
    isPrivate: false,
    createdAt: '2026-10-27T21:00:00Z',
    updatedAt: '2026-10-27T21:10:00Z',
  },
];

export const initialGratitudes: GratitudeEntry[] = [
  {
    id: 'gr-1',
    date: today,
    gratitude1: 'The morning silence and the aroma of fresh roasted filter coffee.',
    gratitude2: 'The clarity to say no to distracting projects that do not serve the long vision.',
    gratitude3: 'A healthy body capable of moving freely and recovering quickly.',
    selfAppreciation: 'I paused when I felt impatient today, took three slow breaths, and responded with calm understanding.',
    dailyWin: 'Completed the core design system without unnecessary dependencies or visual clutter.',
    lessonLearned: 'Resistance always appears right before meaningful breakthrough. Greet it as a companion.',
    affirmation: 'I can move without complete certainty.',
    createdAt: '2026-10-28T08:30:00Z',
  },
  {
    id: 'gr-2',
    date: yesterday,
    gratitude1: 'Deep laughter during dinner with family.',
    gratitude2: 'Crisp autumn air on the evening walk.',
    gratitude3: 'The privilege of working on intellectual problems of my own choosing.',
    selfAppreciation: 'I kept my boundary around evening phone usage.',
    dailyWin: 'Finished 50 uninterrupted minutes on the core architecture.',
    lessonLearned: 'Patience produces higher compounding than speed.',
    createdAt: '2026-10-27T21:30:00Z',
  },
];

export const initialHabits: Habit[] = [
  {
    id: 'h-reading',
    name: 'Read 20 pages of deep literature or philosophy',
    domain: 'growth',
    targetPerWeek: 6,
    completions: [twoDaysAgo, yesterday, today],
    status: 'active',
    notes: 'Currently reading Marcus Aurelius and J. Krishnamurti.',
    createdAt: '2026-09-01',
  },
  {
    id: 'h-movement',
    name: '30+ minutes deliberate physical movement',
    domain: 'health',
    targetPerWeek: 5,
    completions: [twoDaysAgo, yesterday, today],
    status: 'active',
    notes: 'Resistance, zone 2 run, or mobility.',
    createdAt: '2026-09-01',
  },
  {
    id: 'h-stillness',
    name: '10 minutes morning meditation & breathwork',
    domain: 'growth',
    targetPerWeek: 7,
    completions: [yesterday, today],
    status: 'active',
    notes: 'Breath awareness without phone.',
    createdAt: '2026-09-15',
  },
  {
    id: 'h-shutdown',
    name: 'Screen shutdown by 22:00',
    domain: 'health',
    targetPerWeek: 5,
    completions: [twoDaysAgo, yesterday],
    status: 'active',
    notes: 'Helps circadian rhythm and sleep onset.',
    createdAt: '2026-10-01',
  },
];

export const initialHealthLogs: HealthLog[] = [
  {
    id: 'hl-today',
    date: today,
    movementMinutes: 45,
    movementType: 'Zone 2 Trail Run',
    sleepHours: 7.5,
    sleepQuality: 'restful',
    waterGlasses: 7,
    energyRating: 4,
    notes: 'Felt light on my feet. Good hydration throughout the day.',
  },
  {
    id: 'hl-yesterday',
    date: yesterday,
    movementMinutes: 50,
    movementType: 'Kettlebell & Core Flow',
    sleepHours: 7.2,
    sleepQuality: 'restful',
    waterGlasses: 8,
    energyRating: 5,
    notes: 'Strong power output. No lower back stiffness.',
  },
];

export const initialCareerSkills: CareerSkill[] = [
  { id: 'cs-1', name: 'Systems Architecture & Product Design', category: 'Core Craft', level: 'mastering', targetMilestone: 'Ship SANKALP v1.0 architecture review' },
  { id: 'cs-2', name: 'TypeScript & Modern Frontend Performance', category: 'Engineering', level: 'proficient', targetMilestone: 'Sub-100ms interaction latency everywhere' },
  { id: 'cs-3', name: 'Written Synthesis & Essay Publishing', category: 'Influence', level: 'practicing', targetMilestone: 'Publish 1 longform essay monthly' },
  { id: 'cs-4', name: 'High-Stakes Negotiation & Advisory', category: 'Commercial', level: 'learning', targetMilestone: 'Facilitate executive strategy offsite' },
];

export const initialPortfolioProjects: PortfolioProject[] = [
  { id: 'pp-1', title: 'SANKALP — Personal Life Operating System', stage: 'refining', linkedGoalId: 'g-q-design-system', description: 'Editorial minimalist operating system uniting vision, action, and reflection.' },
  { id: 'pp-2', title: 'Veda UI — Restrained Indian-Modern Component Token Library', stage: 'concept', description: 'Design tokens and micro-interactions balancing warmth with precision.' },
];

export const initialJobApplications: JobApplication[] = [
  { id: 'ja-1', role: 'Staff Product Architect', organization: 'Linear / Craft Studio', stage: 'interview', salaryTarget: '$180,000 / ₹1.5 Cr', nextFollowUp: 'Thursday 15:00 Architecture presentation', notes: 'Discuss state-driven systems and micro-interactions.' },
  { id: 'ja-2', role: 'Design Systems Lead Advisory', organization: 'Wellness Tech Co.', stage: 'offer', salaryTarget: 'Retainer ₹3,50,000/mo', nextFollowUp: 'Counter-proposal sent on scope clarity.', notes: 'Great alignment on editorial aesthetics.' },
];

export const initialSavingsGoals: SavingsGoal[] = [
  { id: 'sg-1', title: 'Freedom & Runway Reserve (6 Months)', targetAmount: 600000, currentAmount: 495000, targetDate: '2026-12-31' },
  { id: 'sg-2', title: 'Himalayan Retreat & Quiet Study Sabbatical', targetAmount: 150000, currentAmount: 90000, targetDate: '2027-04-15' },
];

export const initialFinanceBills: FinanceBill[] = [
  { id: 'fb-1', title: 'Domain Registrations & Cloud Hosting', amount: 3200, dueDate: '2026-11-05', recurring: 'monthly', category: 'Infrastructure', paidThisMonth: false },
  { id: 'fb-2', title: 'Comprehensive Health & Term Insurance', amount: 28000, dueDate: '2026-11-20', recurring: 'annual', category: 'Security', paidThisMonth: false },
  { id: 'fb-3', title: 'High-Speed Fiber Internet', amount: 1499, dueDate: '2026-11-02', recurring: 'monthly', category: 'Utilities', paidThisMonth: true },
];

export const initialLifeAdminItems: LifeAdminItem[] = [
  { id: 'la-1', title: 'Renew Passport & International Travel Documents', category: 'documents', dueDate: '2026-11-15', completed: false },
  { id: 'la-2', title: 'Schedule parents health checkup & blood panel', category: 'family', dueDate: '2026-11-08', completed: true },
  { id: 'la-3', title: 'Service car and balance wheel alignment', category: 'home', dueDate: '2026-11-12', completed: false },
];

export const initialLibraryItems: LifeLibraryItem[] = [
  {
    id: 'lib-1',
    type: 'principle',
    title: 'I can move without complete certainty.',
    sourceOrAuthor: 'Core SANKALP Principle',
    content: 'Waiting for 100% emotional certainty before taking action is procrastination disguised as prudence. Physical movement generates emotional courage.',
    keyTakeaway: 'Take the 2-minute step; courage follows movement.',
    linkedDomain: 'growth',
    tags: ['Action', 'Courage', 'Philosophy'],
    createdAt: '2026-09-01',
  },
  {
    id: 'lib-2',
    type: 'book_insight',
    title: 'Essentialism: The Disciplined Pursuit of Less',
    sourceOrAuthor: 'Greg McKeown',
    content: 'If you do not prioritize your life, someone else will. The ability to choose cannot be taken away or even given away—it can only be forgotten.',
    keyTakeaway: 'Say a calm, decisive no to the non-essential to protect what is vital.',
    linkedDomain: 'growth',
    tags: ['Books', 'Focus', 'Simplicity'],
    createdAt: '2026-09-10',
  },
  {
    id: 'lib-3',
    type: 'vision_item',
    title: 'The Calm Studio Sanctuary',
    sourceOrAuthor: 'Personal Vision',
    content: 'Natural teak desk, morning sunlight filtering through bamboo blinds, single notebook, brass pen, deep stillness.',
    keyTakeaway: 'Environment dictates cognitive capacity.',
    linkedDomain: 'lifestyle',
    tags: ['Vision', 'Environment'],
    createdAt: '2026-09-15',
  },
];

export const initialWeeklyReviews: WeeklyReview[] = [
  {
    id: 'wr-last-week',
    weekStartDate: '2026-10-19',
    weekEndDate: '2026-10-25',
    whatWentWell: 'Protected morning focus blocks 4 out of 5 days. Shipped the initial state architecture.',
    whatMovedForward: 'Completed 185 focused minutes on core design system. Ran 24km total over three sessions.',
    whereGotStuck: 'Late Thursday evening scrolling trap after feeling drained by a long meeting.',
    lessonsLearned: 'When mental energy is zero, shut the laptop immediately. Browsing never restores energy.',
    nextWeekPriority: 'Deliver SANKALP responsive mobile touch targets and Get Me Unstuck signature experience.',
    focusMinutesTotal: 460,
    completedPrioritiesCount: 12,
    createdAt: '2026-10-25T18:00:00Z',
  },
];
