import React, { useState, useEffect } from 'react';
import { focusMusic, FOCUS_TRACKS, MusicTrack } from '../../utils/focusAudio';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
  Disc3,
  Sliders,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

export const MusicPlayerDock: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(focusMusic.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(focusMusic.getCurrentTrack());
  const [volume, setVolume] = useState(focusMusic.getVolume());
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsPlaying(focusMusic.getIsPlaying());
      setCurrentTrack(focusMusic.getCurrentTrack());
      setVolume(focusMusic.getVolume());
    };
    focusMusic.subscribe(update);
    return () => focusMusic.subscribe(() => {});
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full sm:w-80 select-none">
      <div className="relative rounded-2xl bg-[#12131A]/95 backdrop-blur-2xl border border-white/10 shadow-2xl p-3 text-white transition-all overflow-hidden">
        {/* Subtle glowing ambient background aura */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#C85A17]/20 rounded-full blur-2xl pointer-events-none" />

        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Spinning Vinyl / Disc Icon */}
            <div
              className={`w-9 h-9 rounded-full bg-gradient-to-tr from-[#C85A17] to-[#D97706] flex items-center justify-center shrink-0 shadow-sm ${
                isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''
              }`}
            >
              <Disc3 className="w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold truncate text-white">
                  {currentTrack.title}
                </span>
                {isPlaying && (
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-2 bg-[#C85A17] animate-pulse" />
                    <span className="w-0.5 h-3 bg-[#D97706] animate-pulse delay-75" />
                    <span className="w-0.5 h-1.5 bg-[#F59E0B] animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="text-[10px] text-white/50 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => focusMusic.prevTrack()}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Previous Track"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => focusMusic.togglePlay()}
              className="w-8 h-8 rounded-full bg-[#C85A17] hover:bg-[#B34D10] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform"
              title={isPlaying ? 'Pause' : 'Play Focus Music'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => focusMusic.nextTrack()}
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 ml-1"
              title={isExpanded ? 'Collapse' : 'Track List'}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Drawer: Track Selector & Volume */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 space-y-3 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* Volume Control */}
            <div className="flex items-center gap-2 px-1">
              <button
                onClick={() => focusMusic.setVolume(volume > 0 ? 0 : 0.5)}
                className="text-white/60 hover:text-white"
              >
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => focusMusic.setVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 bg-white/20 rounded-full accent-[#C85A17] cursor-pointer"
              />
              <span className="text-[10px] text-white/50 font-mono w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Track Selector List */}
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {FOCUS_TRACKS.map((t) => {
                const isSelected = t.id === currentTrack.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => focusMusic.play(t.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-white/15 text-white font-semibold'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="truncate">
                      <p className="truncate text-[11px] font-medium">{t.title}</p>
                      <p className="text-[9px] text-white/40 truncate">{t.description}</p>
                    </div>
                    {isSelected && isPlaying && (
                      <span className="w-2 h-2 rounded-full bg-[#C85A17] animate-ping shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
