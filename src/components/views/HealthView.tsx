import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HealthLog } from '../../types';
import {
  Activity,
  Moon,
  Droplets,
  Zap,
  Plus,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const HealthView: React.FC = () => {
  const { healthLogs, addOrUpdateHealthLog, showToast } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const existingToday = healthLogs.find((l) => l.date === todayStr);

  const [movementMinutes, setMovementMinutes] = useState<number>(
    existingToday?.movementMinutes || 30
  );
  const [movementType, setMovementType] = useState<string>(
    existingToday?.movementType || 'Zone 2 Movement & Walk'
  );
  const [sleepHours, setSleepHours] = useState<number>(
    existingToday?.sleepHours || 7.5
  );
  const [sleepQuality, setSleepQuality] = useState<HealthLog['sleepQuality']>(
    existingToday?.sleepQuality || 'restful'
  );
  const [waterGlasses, setWaterGlasses] = useState<number>(
    existingToday?.waterGlasses || 6
  );
  const [energyRating, setEnergyRating] = useState<number>(
    existingToday?.energyRating || 4
  );
  const [notes, setNotes] = useState<string>(existingToday?.notes || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateHealthLog({
      id: existingToday?.id || `hl-${Date.now()}`,
      date: todayStr,
      movementMinutes,
      movementType,
      sleepHours,
      sleepQuality,
      waterGlasses,
      energyRating,
      notes: notes.trim(),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E8E2D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4D6B53]" />
            <h1 className="text-xl font-bold tracking-tight text-[#1C1917] font-editorial">
              Health & Vitality
            </h1>
          </div>
          <p className="text-xs text-[#8F877F] mt-0.5">
            Non-medical wellness tracking to sustain calm energy and cognitive clarity
          </p>
        </div>
      </div>

      {/* Today's Log Card */}
      <div className="bg-[#FFFFFF] border border-[#E8E2D8] rounded-2xl p-6 sm:p-7 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]/80">
          <h2 className="text-sm font-bold text-[#1C1917]">
            Today's Wellness Baseline ({todayStr})
          </h2>
          <span className="text-xs text-[#8F877F]">Private & local</span>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Movement */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#C85A17]" />
                <span className="text-xs font-bold text-[#1C1917]">Movement & Exercise</span>
              </div>

              <div>
                <label className="block text-[11px] text-[#78716C] mb-1">
                  Active Duration: {movementMinutes} minutes
                </label>
                <input
                  type="range"
                  min={0}
                  max={120}
                  step={5}
                  value={movementMinutes}
                  onChange={(e) => setMovementMinutes(parseInt(e.target.value))}
                  className="w-full accent-[#C85A17]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#78716C] mb-1">Movement Type</label>
                <input
                  type="text"
                  placeholder="e.g. Zone 2 Run, Mobility Flow, Strength..."
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17]"
                />
              </div>
            </div>

            {/* Sleep */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-bold text-[#1C1917]">Rest & Recovery</span>
              </div>

              <div>
                <label className="block text-[11px] text-[#78716C] mb-1">
                  Sleep Duration: {sleepHours} hours
                </label>
                <input
                  type="range"
                  min={4}
                  max={12}
                  step={0.5}
                  value={sleepHours}
                  onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                  className="w-full accent-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#78716C] mb-1">Sleep Quality</label>
                <div className="flex gap-2">
                  {(['restful', 'average', 'restless'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setSleepQuality(q)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${
                        sleepQuality === q
                          ? 'bg-[#FFFFFF] border-[#7C3AED] text-[#7C3AED] font-semibold'
                          : 'bg-[#FFFFFF] border-[#E8E2D8] text-[#78716C]'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Hydration */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[#0284C7]" />
                <span className="text-xs font-bold text-[#1C1917]">Hydration</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-[#57534E]">{waterGlasses} glasses (approx. {waterGlasses * 250}ml)</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
                    className="w-7 h-7 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] text-xs font-bold hover:bg-[#F2EFEB]"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => setWaterGlasses(waterGlasses + 1)}
                    className="w-7 h-7 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] text-xs font-bold text-[#0284C7] hover:bg-[#F2EFEB]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Energy */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E2D8] space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#D97706]" />
                <span className="text-xs font-bold text-[#1C1917]">Vitality & Energy</span>
              </div>

              <div className="flex justify-between gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEnergyRating(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      energyRating === lvl
                        ? 'bg-[#D97706] text-[#FFFFFF] border-[#D97706]'
                        : 'bg-[#FFFFFF] border-[#E8E2D8] text-[#57534E]'
                    }`}
                  >
                    ⚡{lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57534E] mb-1">
              Personal Health & Energy Observations (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Felt light and focused during afternoon work. Digestion smooth."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-[#E8E2D8] bg-[#FFFFFF] focus:outline-none focus:border-[#C85A17] resize-none"
            />
          </div>

          <div className="flex justify-end pt-2 border-t border-[#E8E2D8]">
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1C1917] hover:bg-[#2F2B28] text-[#FAF8F5] text-xs font-semibold shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-[#C85A17]" />
              <span>Save Wellness Log</span>
            </button>
          </div>
        </form>
      </div>

      {/* Historical Health Logs */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
          Recent Vitality History
        </h3>
        {healthLogs.map((log) => (
          <div
            key={log.id}
            className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E8E2D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
          >
            <div>
              <p className="font-bold text-[#1C1917]">{log.date}</p>
              <p className="text-[#78716C] mt-0.5">
                {log.movementMinutes}m {log.movementType} • {log.sleepHours}h sleep ({log.sleepQuality}) • {log.waterGlasses} glasses
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 rounded bg-[#FAF0E6] text-[#C85A17] font-semibold">
                Energy: ⚡{log.energyRating}/5
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
