import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';
import {
  Volume2,
  VolumeX,
  Compass,
  Clock,
  Wind,
  Heart,
  Menu,
  Zap,
  Sparkles,
  Droplets,
  Waves,
} from 'lucide-react';

interface CalmHeaderProps {
  onOpenSpaces: () => void;
  activeTab: 'today' | 'focus' | 'breathe' | 'reflect';
  setActiveTab: (tab: 'today' | 'focus' | 'breathe' | 'reflect') => void;
}

export const CalmHeader: React.FC<CalmHeaderProps> = ({
  onOpenSpaces,
  activeTab,
  setActiveTab,
}) => {
  const { profile, openUnstuckWithState } = useApp();
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'ocean' | 'breeze'>('none');
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);

  const toggleSound = (sound: 'none' | 'rain' | 'ocean' | 'breeze') => {
    soundManager.setAmbientSound(sound);
    setAmbientSound(sound);
    setIsSoundMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D8]/70 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Brand & Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17] shadow-xs animate-pulse" />
          <span className="text-lg font-bold tracking-[0.24em] text-[#1C1917] font-editorial">
            SANKALP
          </span>
        </div>
      </div>

      {/* Center Calm Tabs: The 4 Core Experiences */}
      <nav className="hidden md:flex items-center gap-1 bg-[#F2EFEB]/80 p-1 rounded-full border border-[#E8E2D8]">
        <button
          onClick={() => setActiveTab('today')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'today'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Today</span>
        </button>

        <button
          onClick={() => setActiveTab('focus')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'focus'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Focus</span>
        </button>

        <button
          onClick={() => setActiveTab('breathe')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'breathe'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-[#4D6B53]" />
          <span>Breathe</span>
        </button>

        <button
          onClick={() => setActiveTab('reflect')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            activeTab === 'reflect'
              ? 'bg-[#FFFFFF] text-[#1C1917] shadow-xs'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#C85A17]" />
          <span>Reflect</span>
        </button>
      </nav>

      {/* Right Controls: Ambient Sounds + Unstuck + Spaces Drawer */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ambient Soundscape Player */}
        <div className="relative">
          <button
            onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              ambientSound !== 'none'
                ? 'bg-[#FAF0E6] text-[#C85A17] border-[#E9D5C3] shadow-xs'
                : 'bg-[#FFFFFF] text-[#78716C] border-[#E8E2D8] hover:bg-[#F2EFEB]'
            }`}
            title="Calming soundscapes"
          >
            {ambientSound !== 'none' ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#C85A17]" />
                <span className="capitalize hidden sm:inline">{ambientSound}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#8F877F]" />
                <span className="hidden sm:inline">Sounds</span>
              </>
            )}
          </button>

          {/* Sound Menu Popover */}
          {isSoundMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#E2DBD0] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              onMouseLeave={() => setIsSoundMenuOpen(false)}
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8F877F] px-2 py-1">
                Ambient Soundscape
              </p>
              <div className="space-y-0.5 mt-1">
                {[
                  { key: 'none', label: 'Silence / Mute', icon: VolumeX },
                  { key: 'rain', label: 'Gentle Rain', icon: Droplets },
                  { key: 'ocean', label: 'Ocean Waves', icon: Waves },
                  { key: 'breeze', label: 'Mountain Breeze', icon: Wind },
                ].map((s) => {
                  const Icon = s.icon;
                  const isCur = ambientSound === s.key;
                  return (
                    <button
                      key={s.key}
                      onClick={() => toggleSound(s.key as any)}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-left transition-colors ${
                        isCur
                          ? 'bg-[#FAF0E6] text-[#C85A17] font-semibold'
                          : 'text-[#57534E] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 text-[#8F877F]" />
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Get Me Unstuck */}
        <button
          onClick={() => openUnstuckWithState()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF0E6] text-[#9A420E] border border-[#E9D5C3] hover:bg-[#F5E2D0] text-xs font-semibold shadow-2xs transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-[#C85A17]" />
          <span className="hidden sm:inline">Unstuck</span>
        </button>

        {/* All Spaces / Menu Drawer Button */}
        <button
          onClick={onOpenSpaces}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors"
          title="All Life Spaces & Settings"
        >
          <Menu className="w-4 h-4 text-[#FAF8F5]" />
          <span className="hidden sm:inline">All Spaces</span>
        </button>
      </div>
    </header>
  );
};
