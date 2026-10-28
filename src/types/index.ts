export type LifeDomain =
  | 'career'
  | 'health'
  | 'finances'
  | 'relationships'
  | 'growth'
  | 'creativity'
  | 'lifestyle'
  | 'custom';

export type GoalLevel = 'vision' | '3-5year' | 'annual' | 'quarterly' | 'milestone';

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  whyItMatters: string;
  domain: LifeDomain;
  level: GoalLevel;
  parentId?: string;
  targetDate?: string;
  progress: number; // 0-100
  status: 'active' | 'completed' | 'paused' | 'archived';
  milestones: Milestone[];
  notes?: string;
  createdAt: string;
}

export type TaskPriority = 'proof' | 'supporting' | 'normal' | 'low';
export type TaskBucket = 'today' | 'upcoming' | 'someday' | 'inbox';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'dropped';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  bucket: TaskBucket;
  priority: TaskPriority;
  status: TaskStatus;
  goalId?: string;
  dueDate?: string;
  dueTime?: string;
  estimatedMinutes?: number;
  actualMinutes?: number;
  subtasks: Subtask[];
  recurring?: 'daily' | 'weekly' | 'none';
  createdAt: string;
  completedAt?: string;
}

export interface RoutineItem {
  id: string;
  title: string;
  description?: string;
  timeOfDay: 'morning' | 'focus' | 'movement' | 'evening';
  completedDates: string[]; // YYYY-MM-DD
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle: string;
  goalId?: string;
  durationMinutes: number;
  actualMinutes: number;
  distractionNotes: string[];
  sessionOutcome?: string;
  timestamp: string;
}

export type UnstuckStateKey =
  | 'scrolling'
  | 'overthinking'
  | 'imperfection_fear'
  | 'task_overwhelm'
  | 'avoiding_conversation'
  | 'defensive_frustrated'
  | 'lost_momentum'
  | 'custom';

export interface UnstuckLog {
  id: string;
  stateKey: UnstuckStateKey;
  stateLabel: string;
  userNotes?: string;
  guidanceText: string;
  recommendedPhysicalAction: string;
  durationSelected: '2min' | '10min' | 'custom';
  wasHelpful?: boolean;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  mood?: 'calm' | 'energized' | 'thoughtful' | 'challenging' | 'grateful';
  energy?: number; // 1-5
  tags: string[];
  linkedGoalId?: string;
  isPrivate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GratitudeEntry {
  id: string;
  date: string; // YYYY-MM-DD
  gratitude1: string;
  gratitude2: string;
  gratitude3: string;
  selfAppreciation: string;
  dailyWin: string;
  lessonLearned: string;
  affirmation?: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  domain: LifeDomain;
  targetPerWeek: number; // e.g. 7 for daily, 5 for weekdays, 3 for 3x/week
  completions: string[]; // array of YYYY-MM-DD
  status: 'active' | 'paused';
  notes?: string;
  createdAt: string;
}

export interface HealthLog {
  id: string;
  date: string; // YYYY-MM-DD
  movementMinutes: number;
  movementType: string;
  sleepHours: number;
  sleepQuality: 'restful' | 'average' | 'restless';
  waterGlasses: number;
  energyRating: number; // 1-5
  notes?: string;
}

export interface CareerSkill {
  id: string;
  name: string;
  category: string;
  level: 'learning' | 'practicing' | 'proficient' | 'mastering';
  targetMilestone?: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  stage: 'concept' | 'drafting' | 'refining' | 'shipped';
  linkedGoalId?: string;
  description: string;
}

export interface JobApplication {
  id: string;
  role: string;
  organization: string;
  stage: 'saved' | 'applied' | 'interview' | 'offer' | 'archived';
  salaryTarget?: string;
  nextFollowUp?: string;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

export interface FinanceBill {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  recurring: 'monthly' | 'annual' | 'once';
  category: string;
  paidThisMonth?: boolean;
}

export interface LifeAdminItem {
  id: string;
  title: string;
  category: 'family' | 'documents' | 'medical' | 'travel' | 'home';
  dueDate: string;
  completed: boolean;
}

export interface LifeLibraryItem {
  id: string;
  type: 'principle' | 'vision_item' | 'book_insight' | 'memory' | 'idea';
  title: string;
  sourceOrAuthor?: string;
  content: string;
  keyTakeaway?: string;
  linkedDomain: LifeDomain;
  tags: string[];
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  whatWentWell: string;
  whatMovedForward: string;
  whereGotStuck: string;
  lessonsLearned: string;
  nextWeekPriority: string;
  focusMinutesTotal: number;
  completedPrioritiesCount: number;
  createdAt: string;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestedAction?: {
    type: 'create_task' | 'breakdown_goal' | 'start_focus' | 'open_unstuck';
    label: string;
    payload: any;
  };
  timestamp: string;
}

export interface UserProfile {
  name: string;
  lifeVision: string;
  guidingPrinciple: string;
  primaryDomain: LifeDomain;
  onboardingCompleted: boolean;
  soundEnabled: boolean;
  todayMood: 'serene' | 'focused' | 'reflective' | 'seeking-clarity' | 'restless';
  energyLevel: number; // 1-5
  density: 'comfortable' | 'compact';
}

export type ViewType =
  | 'today'
  | 'goals'
  | 'tasks'
  | 'journal'
  | 'gratitude'
  | 'habits'
  | 'health'
  | 'career'
  | 'finances'
  | 'library'
  | 'coach'
  | 'insights'
  | 'settings';
