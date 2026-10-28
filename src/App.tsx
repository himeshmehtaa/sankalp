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

import { ArrowLeft, Compass, Clock, Wind, Heart, Menu } from 'lucide-react';
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
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <button
              onClick={handleReturnToSanctuary}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#E8E2D8] hover:bg-[#F2EFEB] text-xs font-semibold text-[#1C1917] shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>Back to Sanctuary</span>
            </button>
            <span className="text-xs font-mono uppercase text-[#8F877F]">
              Space: {activeDeepSpace}
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
    <div className="min-h-screen w-screen overflow-x-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F8F5EE] to-[#FAF8F5] text-[#1C1917] flex flex-col justify-between">
      {/* Calm Header */}
      <CalmHeader
        onOpenSpaces={() => setIsSpacesDrawerOpen(true)}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveDeepSpace(null);
          setActiveTab(tab);
        }}
      />

      {/* Main Sanctuary Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-6 pb-28 md:pb-12">
        {renderActiveScreen()}
      </main>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#E8E2D8] rounded-full shadow-lg px-4 py-2 flex items-center justify-around">
        <button
          onClick={() => {
            setActiveDeepSpace(null);
            setActiveTab('today');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            !activeDeepSpace && activeTab === 'today' ? 'text-[#C85A17]' : 'text-[#78716C]'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Today</span>
        </button>

        <button
          onClick={() => {
            setActiveDeepSpace(null);
            setActiveTab('focus');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            !activeDeepSpace && activeTab === 'focus' ? 'text-[#C85A17]' : 'text-[#78716C]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => {
            setActiveDeepSpace(null);
            setActiveTab('breathe');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            !activeDeepSpace && activeTab === 'breathe' ? 'text-[#4D6B53]' : 'text-[#78716C]'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Breathe</span>
        </button>

        <button
          onClick={() => {
            setActiveDeepSpace(null);
            setActiveTab('reflect');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            !activeDeepSpace && activeTab === 'reflect' ? 'text-[#C85A17]' : 'text-[#78716C]'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Reflect</span>
        </button>

        <button
          onClick={() => setIsSpacesDrawerOpen(true)}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition-colors ${
            activeDeepSpace ? 'text-[#C85A17]' : 'text-[#78716C]'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Spaces</span>
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="bg-[#1C1917] text-[#FAF8F5] text-xs font-medium px-4 py-2 rounded-full shadow-lg border border-[#3E3A37] flex items-center gap-2">
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
      <CalmMainLayout />
    </AppProvider>
  );
};

export default App;
