export type ProgrammeCategory =
  | 'transformation'
  | 'fitness'
  | 'career'
  | 'learning'
  | 'habits'
  | 'business'
  | 'productivity'
  | 'emotional'
  | 'creative'
  | 'custom';

export type JourneyDayStatus =
  | 'completed'
  | 'today'
  | 'upcoming'
  | 'in_progress'
  | 'skipped'
  | 'rest_day';

export interface JourneyChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  durationEstimate?: string;
  linkedTaskId?: string;
  isMinimumDay?: boolean;
}

export type JourneySectionType =
  | 'morning'
  | 'work'
  | 'pattern'
  | 'evening'
  | 'proof'
  | 'body_focus'
  | 'belief'
  | 'general';

export interface JourneyDaySection {
  id: string;
  type: JourneySectionType;
  title: string;
  subtitle?: string;
  durationBadge?: string;
  content: string; // Mentor's exact verbatim words
  checklist: JourneyChecklistItem[];
}

export interface JourneyDay {
  id: string;
  dayNumber: number; // 1, 2, ...
  dateString: string; // e.g. "Thu 29 Oct 2026"
  isoDate?: string; // e.g. "2026-10-29"
  theme: string; // e.g. "Show yourself what already works"
  phaseId: string;
  status: JourneyDayStatus;
  skipReason?: string;
  isMinimumDayUsed?: boolean;
  completedAt?: string;
  isBookmarked?: boolean;
  userNotes?: string;
  reflectionResponse?: string;
  proofSubmitted?: string;
  proofPrompt?: string; // Expected output description
  sourceSectionReference: string; // e.g. "PHASE 1 > DAY 01"
  sections: JourneyDaySection[];
}

export interface JourneyPhase {
  id: string;
  phaseNumber: number;
  title: string;
  subtitle?: string;
  description?: string;
  startDay: number;
  endDay: number;
  dateRange: string; // e.g. "29 Oct – 4 Nov"
}

export interface GuidedJourney {
  id: string;
  title: string;
  tagline: string;
  mentorName: string;
  organization?: string;
  category: ProgrammeCategory;
  durationDays: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'active' | 'completed' | 'paused' | 'archived';
  sourceFileName: string;
  sourceRawText: string;
  summary: string;
  importantRule?: string; // e.g. "OUTPUT BEFORE ORGANIZATION"
  continuationRule?: string; // e.g. "THIS IS NOT A RESTART"
  minimumDayRule?: string; // e.g. "Feet on floor (1m) → 10m task → 1-line note"
  safetyNotes?: string;
  phases: JourneyPhase[];
  days: JourneyDay[];
  currentDayNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface JourneyAIPromptOption {
  id: string;
  label: string;
  prompt: string;
}
