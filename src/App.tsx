import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Views
import { TodayView } from './components/views/TodayView';
import { GoalsView } from './components/views/GoalsView';
import { TasksView } from './components/views/TasksView';
import { JournalView } from './components/views/JournalView';
import { GratitudeView } from './components/views/GratitudeView';
import { HabitsView } from './components/views/HabitsView';
import { HealthView } from './components/views/HealthView';
import { CareerView } from './components/views/CareerView';
import { FinancesView } from './components/views/FinancesView';
import { LifeLibraryView } from './components/views/LifeLibraryView';
import { AICoachView } from './components/views/AICoachView';
import { InsightsView } from './components/views/InsightsView';
import { SettingsView } from './components/views/SettingsView';

// Modals
import { UnstuckModal } from './components/modals/UnstuckModal';
import { FocusModeModal } from './components/modals/FocusModeModal';
import { QuickCaptureModal } from './components/modals/QuickCaptureModal';
import { CommandPalette } from './components/modals/CommandPalette';
import { OnboardingModal } from './components/onboarding/OnboardingModal';

const MainLayout: React.FC = () => {
  const { currentView, toastMessage } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'today':
        return <TodayView />;
      case 'goals':
        return <GoalsView />;
      case 'tasks':
        return <TasksView />;
      case 'journal':
        return <JournalView />;
      case 'gratitude':
        return <GratitudeView />;
      case 'habits':
        return <HabitsView />;
      case 'health':
        return <HealthView />;
      case 'career':
        return <CareerView />;
      case 'finances':
        return <FinancesView />;
      case 'library':
        return <LifeLibraryView />;
      case 'coach':
        return <AICoachView />;
      case 'insights':
        return <InsightsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5] text-[#1C1917]">
      {/* Desktop Collapsible Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header />

        {/* Scrollable Page Body */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 pb-24 md:pb-12 focus:outline-none"
          tabIndex={-1}
        >
          {renderCurrentView()}
        </main>

        {/* Mobile Navigation Bar */}
        <MobileNav />
      </div>

      {/* Global Interactive Modals */}
      <UnstuckModal />
      <FocusModeModal />
      <QuickCaptureModal />
      <CommandPalette />
      <OnboardingModal />

      {/* Toast Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="bg-[#1C1917] text-[#FAF8F5] text-xs font-medium px-4 py-2.5 rounded-full shadow-lg border border-[#3E3A37] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-pulse" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
