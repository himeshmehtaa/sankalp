import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Key,
  Trash2,
  Check,
  User,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    exportDataJSON,
    importDataJSON,
    resetToSampleData,
    showToast,
  } = useApp();

  const [name, setName] = useState(profile.name);
  const [lifeVision, setLifeVision] = useState(profile.lifeVision);
  const [guidingPrinciple, setGuidingPrinciple] = useState(profile.guidingPrinciple);
  const [density, setDensity] = useState(profile.density);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Traveler',
      lifeVision: lifeVision.trim(),
      guidingPrinciple: guidingPrinciple.trim(),
      density,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJSON(content);
        if (success) {
          setName(profile.name);
          setLifeVision(profile.lifeVision);
          setGuidingPrinciple(profile.guidingPrinciple);
        }
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleWipeData = () => {
    if (
      confirm(
        'Are you sure you want to completely erase all SANKALP data from this browser? This cannot be undone unless you exported a backup.'
      )
    ) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C85A17]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              Settings, Privacy & Data Sovereignty
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Your data remains strictly private and client-side by design
          </p>
        </div>
      </div>

      {/* 1. Profile & Guiding Philosophy Form */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
          <User className="w-4 h-4 text-[#C85A17]" />
          <h2 className="text-sm font-bold text-[#1C1917]">Personal Identity & Vision</h2>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#57534E] mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#57534E] mb-1">
                Visual Density
              </label>
              <div className="flex gap-2">
                {(['comfortable', 'compact'] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDensity(d)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize border transition-colors ${
                      density === d
                        ? 'bg-[#1C1917] text-[#FAF8F5] border-[#1C1917]'
                        : 'bg-[#FAF8F5] border-[#E8E2D8] text-[#78716C]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Guiding Principle (Your Daily Anchor)
            </label>
            <input
              type="text"
              value={guidingPrinciple}
              onChange={(e) => setGuidingPrinciple(e.target.value)}
              placeholder="e.g. I can move without complete certainty."
              className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Overall Life Vision Statement
            </label>
            <textarea
              rows={2}
              value={lifeVision}
              onChange={(e) => setLifeVision(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17] resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      {/* 2. Data Sovereignty & Backup */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
          <Shield className="w-4 h-4 text-[#4D6B53]" />
          <h2 className="text-sm font-bold text-[#1C1917]">Data Sovereignty & Local Storage</h2>
        </div>

        <p className="text-xs text-[#57534E] leading-relaxed">
          SANKALP stores 100% of your private life entries, reflections, goals, and financials
          directly in your device's browser memory (Local-First). No unauthorized servers, no
          tracking scripts, and zero advertising.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Export */}
          <button
            onClick={exportDataJSON}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] hover:bg-[#F2EFEB] text-xs font-semibold text-[#1C1917] shadow-2xs transition-colors"
          >
            <Download className="w-4 h-4 text-[#C85A17]" />
            <span>Export Full JSON Backup</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] hover:bg-[#F2EFEB] text-xs font-semibold text-[#1C1917] shadow-2xs transition-colors"
          >
            <Upload className="w-4 h-4 text-[#78716C]" />
            <span>Restore Backup JSON</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="pt-3 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={resetToSampleData}
            className="text-xs text-[#78716C] hover:text-[#C85A17] flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Authentic Sample Data</span>
          </button>

          <button
            onClick={handleWipeData}
            className="text-xs text-[#DC2626] hover:underline flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe All Data</span>
          </button>
        </div>
      </div>

      {/* 3. Keyboard Shortcuts Reference */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#E8E2D8]">
          <Key className="w-4 h-4 text-[#8F877F]" />
          <h2 className="text-sm font-bold text-[#1C1917]">Keyboard Mastery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between">
            <span className="text-[#57534E]">Command Palette</span>
            <kbd className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DDD7CB] text-[10px] font-mono">
              ⌘K / Ctrl+K
            </kbd>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between">
            <span className="text-[#57534E]">Get Me Unstuck</span>
            <kbd className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DDD7CB] text-[10px] font-mono">
              U
            </kbd>
          </div>

          <div className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E8E2D8] flex items-center justify-between">
            <span className="text-[#57534E]">Quick Capture</span>
            <kbd className="bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DDD7CB] text-[10px] font-mono">
              C
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
