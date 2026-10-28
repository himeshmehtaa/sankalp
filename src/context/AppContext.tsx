import React, { createContext, useContext, useState, useEffect } from 'react';
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
  ViewType,
  UnstuckStateKey,
} from '../types';
import {
  initialProfile,
  initialGoals,
  initialTasks,
  initialRoutines,
  initialFocusSessions,
  initialUnstuckLogs,
  initialJournalEntries,
  initialGratitudes,
  initialHabits,
  initialHealthLogs,
  initialCareerSkills,
  initialPortfolioProjects,
  initialJobApplications,
  initialSavingsGoals,
  initialFinanceBills,
  initialLifeAdminItems,
  initialLibraryItems,
  initialWeeklyReviews,
} from '../utils/seedData';

const STORAGE_KEY = 'sankalp_os_state_v1';

interface AppContextType {
  // Navigation & View
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;

  // Modals
  isFocusModalOpen: boolean;
  setIsFocusModalOpen: (open: boolean) => void;
  activeFocusTask: Task | null;
  startFocusSession: (task?: Task | null) => void;
  isUnstuckModalOpen: boolean;
  setIsUnstuckModalOpen: (open: boolean) => void;
  openUnstuckWithState: (stateKey?: UnstuckStateKey) => void;
  unstuckPreselectedKey?: UnstuckStateKey;
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Profile
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Goals
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;

  // Routines
  routines: RoutineItem[];
  toggleRoutineToday: (id: string) => void;

  // Focus Sessions
  focusSessions: FocusSession[];
  logFocusSession: (session: Omit<FocusSession, 'id' | 'timestamp'>) => void;

  // Unstuck Logs
  unstuckLogs: UnstuckLog[];
  logUnstuckIntervention: (log: Omit<UnstuckLog, 'id' | 'createdAt'>) => void;

  // Journal
  journalEntries: JournalEntry[];
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJournalEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteJournalEntry: (id: string) => void;

  // Gratitude
  gratitudes: GratitudeEntry[];
  addGratitudeEntry: (entry: Omit<GratitudeEntry, 'id' | 'createdAt'>) => void;

  // Habits
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  toggleHabitDate: (habitId: string, dateStr: string) => void;
  deleteHabit: (id: string) => void;

  // Health
  healthLogs: HealthLog[];
  addOrUpdateHealthLog: (log: HealthLog) => void;

  // Career
  careerSkills: CareerSkill[];
  updateCareerSkill: (id: string, updates: Partial<CareerSkill>) => void;
  portfolioProjects: PortfolioProject[];
  addPortfolioProject: (proj: Omit<PortfolioProject, 'id'>) => void;
  updatePortfolioProject: (id: string, updates: Partial<PortfolioProject>) => void;
  jobApplications: JobApplication[];
  addJobApplication: (app: Omit<JobApplication, 'id'>) => void;
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;

  // Finances & Admin
  savingsGoals: SavingsGoal[];
  updateSavingsGoal: (id: string, currentAmount: number) => void;
  financeBills: FinanceBill[];
  toggleBillPaid: (id: string) => void;
  lifeAdminItems: LifeAdminItem[];
  toggleAdminItem: (id: string) => void;
  addAdminItem: (item: Omit<LifeAdminItem, 'id'>) => void;

  // Library
  libraryItems: LifeLibraryItem[];
  addLibraryItem: (item: Omit<LifeLibraryItem, 'id' | 'createdAt'>) => void;

  // Reviews
  weeklyReviews: WeeklyReview[];
  addWeeklyReview: (review: Omit<WeeklyReview, 'id' | 'createdAt'>) => void;

  // Backup & Reset
  exportDataJSON: () => void;
  importDataJSON: (jsonString: string) => boolean;
  resetToSampleData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage
  const loadStored = () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse saved SANKALP state from localStorage:', e);
    }
    return null;
  };

  const stored = loadStored();

  // Core States
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [activeFocusTask, setActiveFocusTask] = useState<Task | null>(null);
  const [isUnstuckModalOpen, setIsUnstuckModalOpen] = useState(false);
  const [unstuckPreselectedKey, setUnstuckPreselectedKey] = useState<UnstuckStateKey | undefined>(undefined);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Data States
  const [profile, setProfile] = useState<UserProfile>(stored?.profile || initialProfile);
  const [goals, setGoals] = useState<Goal[]>(stored?.goals || initialGoals);
  const [tasks, setTasks] = useState<Task[]>(stored?.tasks || initialTasks);
  const [routines, setRoutines] = useState<RoutineItem[]>(stored?.routines || initialRoutines);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(stored?.focusSessions || initialFocusSessions);
  const [unstuckLogs, setUnstuckLogs] = useState<UnstuckLog[]>(stored?.unstuckLogs || initialUnstuckLogs);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(stored?.journalEntries || initialJournalEntries);
  const [gratitudes, setGratitudes] = useState<GratitudeEntry[]>(stored?.gratitudes || initialGratitudes);
  const [habits, setHabits] = useState<Habit[]>(stored?.habits || initialHabits);
  const [healthLogs, setHealthLogs] = useState<HealthLog[]>(stored?.healthLogs || initialHealthLogs);
  const [careerSkills, setCareerSkills] = useState<CareerSkill[]>(stored?.careerSkills || initialCareerSkills);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>(stored?.portfolioProjects || initialPortfolioProjects);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>(stored?.jobApplications || initialJobApplications);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(stored?.savingsGoals || initialSavingsGoals);
  const [financeBills, setFinanceBills] = useState<FinanceBill[]>(stored?.financeBills || initialFinanceBills);
  const [lifeAdminItems, setLifeAdminItems] = useState<LifeAdminItem[]>(stored?.lifeAdminItems || initialLifeAdminItems);
  const [libraryItems, setLibraryItems] = useState<LifeLibraryItem[]>(stored?.libraryItems || initialLibraryItems);
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>(stored?.weeklyReviews || initialWeeklyReviews);

  // Sync to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        profile,
        goals,
        tasks,
        routines,
        focusSessions,
        unstuckLogs,
        journalEntries,
        gratitudes,
        habits,
        healthLogs,
        careerSkills,
        portfolioProjects,
        jobApplications,
        savingsGoals,
        financeBills,
        lifeAdminItems,
        libraryItems,
        weeklyReviews,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [
    profile,
    goals,
    tasks,
    routines,
    focusSessions,
    unstuckLogs,
    journalEntries,
    gratitudes,
    habits,
    healthLogs,
    careerSkills,
    portfolioProjects,
    jobApplications,
    savingsGoals,
    financeBills,
    lifeAdminItems,
    libraryItems,
    weeklyReviews,
  ]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // 'u' when not inside input: quick open Get Me Unstuck
      if (
        e.key.toLowerCase() === 'u' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
        !isFocusModalOpen &&
        !isUnstuckModalOpen &&
        !isQuickCaptureOpen &&
        !isCommandPaletteOpen
      ) {
        e.preventDefault();
        setIsUnstuckModalOpen(true);
      }
      // 'c' when not inside input: Quick Capture
      if (
        e.key.toLowerCase() === 'c' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName) &&
        !isFocusModalOpen &&
        !isUnstuckModalOpen &&
        !isQuickCaptureOpen &&
        !isCommandPaletteOpen
      ) {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFocusModalOpen, isUnstuckModalOpen, isQuickCaptureOpen, isCommandPaletteOpen]);

  // Toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Helper actions
  const startFocusSession = (task: Task | null = null) => {
    setActiveFocusTask(task);
    setIsFocusModalOpen(true);
  };

  const openUnstuckWithState = (stateKey?: UnstuckStateKey) => {
    setUnstuckPreselectedKey(stateKey);
    setIsUnstuckModalOpen(true);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    showToast('Preferences updated');
  };

  // Goals
  const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      ...goalData,
      id: `g-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setGoals((prev) => [newGoal, ...prev]);
    showToast(`Goal created: ${newGoal.title}`);
    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
    showToast('Goal updated');
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast('Goal deleted');
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMilestones = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const completedCount = updatedMilestones.filter((m) => m.completed).length;
        const autoProgress = updatedMilestones.length
          ? Math.round((completedCount / updatedMilestones.length) * 100)
          : g.progress;
        return {
          ...g,
          milestones: updatedMilestones,
          progress: autoProgress,
        };
      })
    );
  };

  // Tasks
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `t-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task added: ${newTask.title}`);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast('Task removed');
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const isNowCompleted = t.status !== 'completed';
        const updated = {
          ...t,
          status: (isNowCompleted ? 'completed' : 'todo') as Task['status'],
          completedAt: isNowCompleted ? new Date().toISOString() : undefined,
        };
        if (isNowCompleted) {
          showToast(`Completed: ${t.title}`);
        }
        return updated;
      })
    );
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          ),
        };
      })
    );
  };

  // Routines
  const toggleRoutineToday = (id: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setRoutines((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const alreadyDone = r.completedDates.includes(todayStr);
        return {
          ...r,
          completedDates: alreadyDone
            ? r.completedDates.filter((d) => d !== todayStr)
            : [...r.completedDates, todayStr],
        };
      })
    );
  };

  // Focus
  const logFocusSession = (sessionData: Omit<FocusSession, 'id' | 'timestamp'>) => {
    const newSession: FocusSession = {
      ...sessionData,
      id: `fs-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setFocusSessions((prev) => [newSession, ...prev]);
    showToast(`Recorded ${newSession.actualMinutes}m focused work`);
  };

  // Unstuck
  const logUnstuckIntervention = (logData: Omit<UnstuckLog, 'id' | 'createdAt'>) => {
    const newLog: UnstuckLog = {
      ...logData,
      id: `u-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUnstuckLogs((prev) => [newLog, ...prev]);
  };

  // Journal
  const addJournalEntry = (entryData: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newEntry: JournalEntry = {
      ...entryData,
      id: `j-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    showToast('Reflection saved to journal');
  };

  const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
    setJournalEntries((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates, updatedAt: new Date().toISOString() } : j))
    );
    showToast('Entry updated');
  };

  const deleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((j) => j.id !== id));
    showToast('Journal entry deleted');
  };

  // Gratitude
  const addGratitudeEntry = (entryData: Omit<GratitudeEntry, 'id' | 'createdAt'>) => {
    const newEntry: GratitudeEntry = {
      ...entryData,
      id: `gr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setGratitudes((prev) => [newEntry, ...prev]);
    showToast('Gratitude recorded with gratitude & peace');
  };

  // Habits
  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: `h-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setHabits((prev) => [newHabit, ...prev]);
    showToast('New habit established');
  };

  const toggleHabitDate = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completions.includes(dateStr);
        return {
          ...h,
          completions: exists ? h.completions.filter((d) => d !== dateStr) : [...h.completions, dateStr],
        };
      })
    );
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    showToast('Habit archived');
  };

  // Health
  const addOrUpdateHealthLog = (log: HealthLog) => {
    setHealthLogs((prev) => {
      const idx = prev.findIndex((l) => l.date === log.date);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = log;
        return copy;
      }
      return [log, ...prev];
    });
    showToast('Daily wellness logged');
  };

  // Career
  const updateCareerSkill = (id: string, updates: Partial<CareerSkill>) => {
    setCareerSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Skill level updated');
  };

  const addPortfolioProject = (proj: Omit<PortfolioProject, 'id'>) => {
    const newProj = { ...proj, id: `pp-${Date.now()}` };
    setPortfolioProjects((prev) => [newProj, ...prev]);
    showToast('Project added to portfolio');
  };

  const updatePortfolioProject = (id: string, updates: Partial<PortfolioProject>) => {
    setPortfolioProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const addJobApplication = (app: Omit<JobApplication, 'id'>) => {
    const newApp = { ...app, id: `ja-${Date.now()}` };
    setJobApplications((prev) => [newApp, ...prev]);
    showToast('Opportunity added to tracker');
  };

  const updateJobApplication = (id: string, updates: Partial<JobApplication>) => {
    setJobApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Finances & Admin
  const updateSavingsGoal = (id: string, currentAmount: number) => {
    setSavingsGoals((prev) => prev.map((g) => (g.id === id ? { ...g, currentAmount } : g)));
    showToast('Savings amount updated');
  };

  const toggleBillPaid = (id: string) => {
    setFinanceBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paidThisMonth: !b.paidThisMonth } : b))
    );
  };

  const toggleAdminItem = (id: string) => {
    setLifeAdminItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const addAdminItem = (itemData: Omit<LifeAdminItem, 'id'>) => {
    const newItem = { ...itemData, id: `la-${Date.now()}` };
    setLifeAdminItems((prev) => [newItem, ...prev]);
    showToast('Admin task recorded');
  };

  // Library
  const addLibraryItem = (itemData: Omit<LifeLibraryItem, 'id' | 'createdAt'>) => {
    const newItem: LifeLibraryItem = {
      ...itemData,
      id: `lib-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLibraryItems((prev) => [newItem, ...prev]);
    showToast('Added to Life Library');
  };

  // Reviews
  const addWeeklyReview = (reviewData: Omit<WeeklyReview, 'id' | 'createdAt'>) => {
    const newReview: WeeklyReview = {
      ...reviewData,
      id: `wr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setWeeklyReviews((prev) => [newReview, ...prev]);
    showToast('Weekly review recorded');
  };

  // Export / Import
  const exportDataJSON = () => {
    const fullState = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile,
      goals,
      tasks,
      routines,
      focusSessions,
      unstuckLogs,
      journalEntries,
      gratitudes,
      habits,
      healthLogs,
      careerSkills,
      portfolioProjects,
      jobApplications,
      savingsGoals,
      financeBills,
      lifeAdminItems,
      libraryItems,
      weeklyReviews,
    };
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sankalp-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('SANKALP complete data backup exported');
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') return false;
      if (parsed.profile) setProfile(parsed.profile);
      if (Array.isArray(parsed.goals)) setGoals(parsed.goals);
      if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
      if (Array.isArray(parsed.routines)) setRoutines(parsed.routines);
      if (Array.isArray(parsed.focusSessions)) setFocusSessions(parsed.focusSessions);
      if (Array.isArray(parsed.unstuckLogs)) setUnstuckLogs(parsed.unstuckLogs);
      if (Array.isArray(parsed.journalEntries)) setJournalEntries(parsed.journalEntries);
      if (Array.isArray(parsed.gratitudes)) setGratitudes(parsed.gratitudes);
      if (Array.isArray(parsed.habits)) setHabits(parsed.habits);
      if (Array.isArray(parsed.healthLogs)) setHealthLogs(parsed.healthLogs);
      if (Array.isArray(parsed.careerSkills)) setCareerSkills(parsed.careerSkills);
      if (Array.isArray(parsed.portfolioProjects)) setPortfolioProjects(parsed.portfolioProjects);
      if (Array.isArray(parsed.jobApplications)) setJobApplications(parsed.jobApplications);
      if (Array.isArray(parsed.savingsGoals)) setSavingsGoals(parsed.savingsGoals);
      if (Array.isArray(parsed.financeBills)) setFinanceBills(parsed.financeBills);
      if (Array.isArray(parsed.lifeAdminItems)) setLifeAdminItems(parsed.lifeAdminItems);
      if (Array.isArray(parsed.libraryItems)) setLibraryItems(parsed.libraryItems);
      if (Array.isArray(parsed.weeklyReviews)) setWeeklyReviews(parsed.weeklyReviews);
      showToast('Data restored successfully');
      return true;
    } catch (e) {
      console.error('Import failed:', e);
      showToast('Error restoring backup file: invalid format');
      return false;
    }
  };

  const resetToSampleData = () => {
    setProfile(initialProfile);
    setGoals(initialGoals);
    setTasks(initialTasks);
    setRoutines(initialRoutines);
    setFocusSessions(initialFocusSessions);
    setUnstuckLogs(initialUnstuckLogs);
    setJournalEntries(initialJournalEntries);
    setGratitudes(initialGratitudes);
    setHabits(initialHabits);
    setHealthLogs(initialHealthLogs);
    setCareerSkills(initialCareerSkills);
    setPortfolioProjects(initialPortfolioProjects);
    setJobApplications(initialJobApplications);
    setSavingsGoals(initialSavingsGoals);
    setFinanceBills(initialFinanceBills);
    setLifeAdminItems(initialLifeAdminItems);
    setLibraryItems(initialLibraryItems);
    setWeeklyReviews(initialWeeklyReviews);
    showToast('Reset to authentic sample data');
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        sidebarCollapsed,
        setSidebarCollapsed,
        isFocusModalOpen,
        setIsFocusModalOpen,
        activeFocusTask,
        startFocusSession,
        isUnstuckModalOpen,
        setIsUnstuckModalOpen,
        openUnstuckWithState,
        unstuckPreselectedKey,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isOnboardingOpen,
        setIsOnboardingOpen,
        toastMessage,
        showToast,
        profile,
        updateProfile,
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        toggleSubtask,
        routines,
        toggleRoutineToday,
        focusSessions,
        logFocusSession,
        unstuckLogs,
        logUnstuckIntervention,
        journalEntries,
        addJournalEntry,
        updateJournalEntry,
        deleteJournalEntry,
        gratitudes,
        addGratitudeEntry,
        habits,
        addHabit,
        toggleHabitDate,
        deleteHabit,
        healthLogs,
        addOrUpdateHealthLog,
        careerSkills,
        updateCareerSkill,
        portfolioProjects,
        addPortfolioProject,
        updatePortfolioProject,
        jobApplications,
        addJobApplication,
        updateJobApplication,
        savingsGoals,
        updateSavingsGoal,
        financeBills,
        toggleBillPaid,
        lifeAdminItems,
        toggleAdminItem,
        addAdminItem,
        libraryItems,
        addLibraryItem,
        weeklyReviews,
        addWeeklyReview,
        exportDataJSON,
        importDataJSON,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
