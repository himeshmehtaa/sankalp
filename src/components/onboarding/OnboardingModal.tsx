import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Check, Compass, Heart, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, profile, updateProfile, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState(profile.name || '');
  const [vision, setVision] = useState(profile.lifeVision || '');
  const [principle, setPrinciple] = useState(profile.guidingPrinciple || '');

  if (!isOnboardingOpen) return null;

  const handleFinish = () => {
    updateProfile({
      name: name.trim() || 'Himesh',
      lifeVision: vision.trim() || profile.lifeVision,
      guidingPrinciple: principle.trim() || 'I can move without complete certainty.',
      onboardingCompleted: true,
    });

    try {
      confetti({ particleCount: 40, spread: 70, colors: ['#B85C3B', '#6B7A5B'] });
    } catch (e) {}

    setIsOnboardingOpen(false);
    showToast('Welcome to SANKALP. Your journey begins.');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1A19]/70 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-[#FAF8F4] border border-[#E7E1DA] rounded-3xl shadow-2xl p-7 sm:p-9 text-[#1B1A19] overflow-hidden space-y-6">
        {/* Step 1: Philosophy */}
        {step === 1 && (
          <div className="space-y-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-full bg-[#F8EDE8] flex items-center justify-center mx-auto text-[#B85C3B] border border-[#E7E1DA]">
              <Compass className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#B85C3B] uppercase font-editorial">
                SANKALP
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1B1A19] tracking-tight font-editorial">
                A promise to the person you're becoming.
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed max-w-md mx-auto font-medium">
                "Self-awareness → Intention → Action → Reflection → Growth"
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E7E1DA] text-left text-xs text-[#57534E] space-y-2">
              <p>
                SANKALP is not a cluttered list of endless chores or guilt-inducing streaks. It is a
                calm operating system to align long-term aspirations with daily proof actions.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Begin Alignment</span>
              <ArrowRight className="w-4 h-4 text-[#B85C3B]" />
            </button>
          </div>
        )}

        {/* Step 2: Name & Principle */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right duration-150">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#1B1A19] font-editorial">
                Define Your Anchor
              </h3>
              <p className="text-xs text-[#8F877F]">
                How should SANKALP greet you, and what principle will guide your courage?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">Your Name</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Himesh"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#57534E] mb-1">
                  Guiding Daily Principle
                </label>
                <input
                  type="text"
                  placeholder="e.g. I can move without complete certainty."
                  value={principle}
                  onChange={(e) => setPrinciple(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B]"
                />
                <p className="text-[10px] text-[#8F877F] mt-1">
                  This reminder stays anchored on your header when resistance strikes.
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-3 rounded-xl bg-[#1B1A19] hover:bg-[#2F2B28] text-[#FAF8F4] text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4 text-[#B85C3B]" />
            </button>
          </div>
        )}

        {/* Step 3: Life Vision */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right duration-150">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-[#1B1A19] font-editorial">
                Articulate Your Life Vision
              </h3>
              <p className="text-xs text-[#8F877F]">
                A short, authentic statement of what you are striving to build.
              </p>
            </div>

            <div>
              <textarea
                rows={4}
                autoFocus
                placeholder="e.g. Build enduring, high-agency work while maintaining deep family presence, physical vitality, and inner stillness."
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#E7E1DA] bg-[#FFFFFF] focus:outline-none focus:border-[#B85C3B] resize-none"
              />
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3 rounded-xl bg-[#B85C3B] hover:bg-[#B34D10] text-[#FFFFFF] text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>Enter SANKALP</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
