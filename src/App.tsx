import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { CalmHeader } from './components/layout/CalmHeader';
import { DailySanctuary } from './components/calm/DailySanctuary';
import { CalmFocusView } from './components/views/CalmFocusView';
import { BreathingWidget } from './components/calm/BreathingWidget';
import { CalmReflectView } from './components/views/CalmReflectView';
import { SpacesDrawer } from './components/modals/SpacesDrawer';

// Deep spaces (accessible via drawer)
import { GoalsView } from './components/views/GoalsView';
import { TasksView } from './components/views/TasksView';
import { HabitsView } from './components/views/HabitsView';
import { JournalView } from './components/views/JournalView';
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
import { AppSplashScreen } from './components/layout/AppSplashScreen';

import {
  ArrowLeft,
  Compass,
  Clock,
  Wind,
  Heart,
  Menu,
  Sun,
  CheckSquare,
  Plus,
  MoreHorizontal,
} from 'lucide-react';
import { ViewType } from './types';

const CalmMainLayout: React.FC = () => {
  const { toastMessage } = useApp();

  const [activeTab, setActiveTab] = useState<'today' | 'focus' | 'breathe' | 'reflect'>('today');
  const [activeDeepSpace, setActiveDeepSpace] = useState<ViewType | null>(null);
  const [isSpacesDrawerOpen, setIsSpacesDrawerOpen] = useState(false);

  const handleSelectDeepSpace = (space: ViewType) => {
    setActiveDeepSpace(space);
  };

  const handleReturnToSanctuary = () => {
    setActiveDeepSpace(null);
  };

  const renderActiveScreen = () => {
    // If user opened a specific deep space from the drawer
    if (activeDeepSpace) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E1DA]/70">
            <button
              onClick={handleReturnToSanctuary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFFFFF] border border-[#E7E1DA] hover:bg-[#FAF8F4] text-xs font-medium text-[#57534E] hover:text-[#1B1A19] shadow-2xs transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#B85C3B]" />
              <span>Back to Sanctuary</span>
            </button>
            <span className="text-xs font-semibold text-[#1B1A19] capitalize">
              {activeDeepSpace === 'library'
                ? 'Life Library'
                : activeDeepSpace === 'coach'
                ? 'AI Coach'
                : activeDeepSpace}
            </span>
          </div>

          {activeDeepSpace === 'goals' && <GoalsView />}
          {activeDeepSpace === 'tasks' && <TasksView />}
          {activeDeepSpace === 'habits' && <HabitsView />}
          {activeDeepSpace === 'journal' && <JournalView />}
          {activeDeepSpace === 'health' && <HealthView />}
          {activeDeepSpace === 'career' && <CareerView />}
          {activeDeepSpace === 'finances' && <FinancesView />}
          {activeDeepSpace === 'library' && <LifeLibraryView />}
          {activeDeepSpace === 'coach' && <AICoachView />}
          {activeDeepSpace === 'insights' && <InsightsView />}
          {activeDeepSpace === 'settings' && <SettingsView />}
        </div>
      );
    }

    // Default 4 Calm core experiences
    switch (activeTab) {
      case 'today':
        return (
          <DailySanctuary
            onStartBreathe={() => setActiveTab('breathe')}
            onStartReflect={() => setActiveTab('reflect')}
          />
        );
      case 'focus':
        return <CalmFocusView />;
      case 'breathe':
        return <BreathingWidget onClose={() => setActiveTab('today')} />;
      case 'reflect':
        return <CalmReflectView />;
      default:
        return (
          <DailySanctuary
            onStartBreathe={() => setActiveTab('breathe')}
            onStartReflect={() => setActiveTab('reflect')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-screen overflow-x-hidden bg-[#FAF8F4] text-[#1B1A19] flex flex-col justify-between">
      {/* Calm Header */}
      <CalmHeader
        onOpenSpaces={() => setIsSpacesDrawerOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveDeepSpace(null);
          setActiveTab(tab);
        }}
        activeDeepSpace={activeDeepSpace}
        onSelectDeepSpace={handleSelectDeepSpace}
        onOpenCapture={() => setIsQuickCaptureOpen(true)}
      />

      {/* Main Sanctuary Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 pb-28 md:pb-12">
        {renderActiveScreen()}
      </main>

      {/* Mobile Dark Bottom Bar - Matching Brand & Screenshot 1 */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1B1A19]/95 backdrop-blur-xl border-t border-[#2D2A28] px-2 pt-2.5 pb-6 flex items-center justify-around shadow-2xl">
        {/* 1. Today */}
        <button
          onClick={() => {
            setActiveDeepSpace(null);
            setActiveTab('today');
          }}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
            !activeDeepSpace && activeTab === 'today'
              ? 'text-[#B85C3B]'
              : 'text-[#8F877F] hover:text-white'
          }`}
        >
          <Sun className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium tracking-tight">Today</span>
        </button>

        {/* 2. Tasks */}
        <button
          onClick={() => {
            setActiveDeepSpace('tasks');
          }}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
            activeDeepSpace === 'tasks'
              ? 'text-[#B85C3B]'
              : 'text-[#8F877F] hover:text-white'
          }`}
        >
          <CheckSquare className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium tracking-tight">Tasks</span>
        </button>

        {/* 3. Center Elevated + Quick Capture Button */}
        <div className="flex flex-1 items-center justify-center">
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="w-12 h-12 -mt-5 rounded-full bg-white text-[#1B1A19] shadow-xl shadow-black/40 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
            title="Quick Capture"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* 4. Breathe & Meditation (User request: "the fourth one is breathe and meditation") */}
        <button
          onClick={() => {
            setActiveDeepSpace(null);
            setActiveTab('breathe');
          }}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
            !activeDeepSpace && activeTab === 'breathe'
              ? 'text-[#B85C3B]'
              : 'text-[#8F877F] hover:text-white'
          }`}
        >
          <Wind className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium tracking-tight">Breathe</span>
        </button>

        {/* 5. More */}
        <button
          onClick={() => setIsSpacesDrawerOpen(true)}
          className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
            isSpacesDrawerOpen || (activeDeepSpace && activeDeepSpace !== 'tasks')
              ? 'text-[#B85C3B]'
              : 'text-[#8F877F] hover:text-white'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 stroke-[2.2]" />
          <span className="text-[10px] font-medium tracking-tight">More</span>
        </button>
      </nav>

      {/* Spaces Side Drawer */}
      <SpacesDrawer
        isOpen={isSpacesDrawerOpen}
        onClose={() => setIsSpacesDrawerOpen(false)}
        onSelectSpace={handleSelectDeepSpace}
      />

      {/* Modals */}
      <UnstuckModal />
      <FocusModeModal />
      <QuickCaptureModal />
      <CommandPalette />
      <OnboardingModal />

      {/* App Splash/Loading Screen on Opening */}
      <AppSplashScreen />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="bg-[#1B1A19] text-[#FAF8F4] text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-[#2D2A28] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B85C3B] animate-pulse" />
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
      <CalmMainLayout />
    </AppProvider>
  );
};

export default App;
