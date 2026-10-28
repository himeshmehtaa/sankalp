import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Sparkles, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CalmReflectView: React.FC = () => {
  const { gratitudes, addGratitudeEntry, profile, updateProfile, showToast } = useApp();

  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [selfAppreciation, setSelfAppreciation] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const moods: { key: typeof profile.todayMood; label: string; emoji: string }[] = [
    { key: 'serene', label: 'Serene', emoji: '🌿' },
    { key: 'focused', label: 'Focused', emoji: '🎯' },
    { key: 'reflective', label: 'Reflective', emoji: '✨' },
    { key: 'seeking-clarity', label: 'Seeking Clarity', emoji: '🌤️' },
    { key: 'restless', label: 'Restless', emoji: '🌊' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gratitude1.trim()) return;

    addGratitudeEntry({
      date: todayStr,
      gratitude1: gratitude1.trim(),
      gratitude2: gratitude2.trim() || 'A moment of stillness.',
      gratitude3: gratitude3.trim() || 'The gift of a new day.',
      selfAppreciation: selfAppreciation.trim() || 'I showed up with genuine care.',
      dailyWin: 'Took time for conscious reflection.',
      lessonLearned: 'Gratitude grounds the restless mind.',
    });

    try {
      confetti({ particleCount: 30, spread: 50, colors: ['#C85A17', '#4D6B53'] });
    } catch (e) {}

    setGratitude1('');
    setGratitude2('');
    setGratitude3('');
    setSelfAppreciation('');
  };

  return (
    <div className="max-w-2xl mx-auto py-4 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#C85A17]">
          Reflection Sanctuary
        </span>
        <h2 className="text-2xl sm:text-3xl font-light text-[#1C1917] font-editorial">
          What warmed your heart today?
        </h2>
      </div>

      {/* Mood Selector Row */}
      <div className="space-y-2 text-center">
        <p className="text-[11px] font-semibold text-[#8F877F] uppercase tracking-wider">
          Current Mindset
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          {moods.map((m) => {
            const isSelected = profile.todayMood === m.key;
            return (
              <button
                key={m.key}
                onClick={() => updateProfile({ todayMood: m.key })}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-[#FAF0E6] border-[#C85A17] text-[#C85A17] font-semibold shadow-xs'
                    : 'bg-[#FFFFFF] border-[#E8E2D8] text-[#78716C] hover:bg-[#F2EFEB]'
                }`}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gratitude Form */}
      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-3xl bg-[#FFFFFF] border border-[#E8E2D8] shadow-xs space-y-5"
      >
        <div className="space-y-3">
          <label className="block text-xs font-bold text-[#1C1917]">
            Three Simple Gratitudes
          </label>
          <input
            type="text"
            required
            placeholder="1. Something you noticed, felt, or enjoyed today..."
            value={gratitude1}
            onChange={(e) => setGratitude1(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
          />
          <input
            type="text"
            placeholder="2. Someone who made your day a little lighter..."
            value={gratitude2}
            onChange={(e) => setGratitude2(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
          />
          <input
            type="text"
            placeholder="3. A simple privilege or comfort..."
            value={gratitude3}
            onChange={(e) => setGratitude3(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] focus:outline-none focus:border-[#C85A17]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#C85A17] mb-1.5">
            One Thing You Appreciate About Yourself
          </label>
          <input
            type="text"
            placeholder="e.g. I stayed gentle when plans changed..."
            value={selfAppreciation}
            onChange={(e) => setSelfAppreciation(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-[#E9D5C3] bg-[#FAF0E6]/30 focus:outline-none focus:border-[#C85A17]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-[#C85A17]" />
            <span>Save Reflection</span>
          </button>
        </div>
      </form>

      {/* Recent Gratitudes Card Feed */}
      {gratitudes.length > 0 && (
        <div className="space-y-3 pt-4">
          <p className="text-[11px] font-bold text-[#8F877F] uppercase tracking-wider text-center">
            Recent Peaceful Moments
          </p>
          <div className="space-y-2.5">
            {gratitudes.slice(0, 3).map((g) => (
              <div
                key={g.id}
                className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#E8E2D8] text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] text-[#8F877F]">
                  <span>{g.date}</span>
                  <span className="text-[#C85A17] font-semibold">Gratitude</span>
                </div>
                <p className="text-[#1C1917] font-serif-quote italic">"{g.gratitude1}"</p>
                {g.selfAppreciation && (
                  <p className="text-[11px] text-[#78716C]">Self: {g.selfAppreciation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
