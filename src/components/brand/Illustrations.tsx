import React from 'react';

// ─── 1. Organic Leaf Motif (Brand identity botanical extension) ─────────────────
export const LeafMotif: React.FC<{ className?: string; color?: string; opacity?: number }> = ({
  className = 'w-24 h-24',
  color = '#B85C3B',
  opacity = 0.15,
}) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <path
      d="M60 10 C30 20, 15 50, 30 75 C40 90, 55 95, 60 110 C65 95, 80 90, 90 75 C105 50, 90 20, 60 10 Z"
      fill={color}
      opacity={opacity}
    />
    <path
      d="M60 25 C40 32, 28 55, 38 72 C45 82, 55 86, 60 100 C65 86, 75 82, 82 72 C92 55, 80 32, 60 25 Z"
      fill={color}
      opacity={opacity * 0.75}
    />
    {/* Central spine */}
    <line x1="60" y1="22" x2="60" y2="102" stroke={color} strokeWidth="1.2" opacity={opacity * 1.5} />
    {/* Side veins */}
    <path d="M60 38 Q48 48 38 52" stroke={color} strokeWidth="0.8" opacity={opacity * 1.2} />
    <path d="M60 38 Q72 48 82 52" stroke={color} strokeWidth="0.8" opacity={opacity * 1.2} />
    <path d="M60 52 Q44 64 36 68" stroke={color} strokeWidth="0.8" opacity={opacity * 1.2} />
    <path d="M60 52 Q76 64 84 68" stroke={color} strokeWidth="0.8" opacity={opacity * 1.2} />
    <path d="M60 68 Q50 78 44 80" stroke={color} strokeWidth="0.8" opacity={opacity * 1.2} />
    <path d="M60 68 Q70 78 76 80" stroke={color} strokeWidth="0.8" opacity={opacity * 1.2} />
  </svg>
);

// ─── 2. Flowing Wave / River Motif ────────────────────────────────────
export const WaveMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-12',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 400 40" fill="none" className={className} preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 20 C50 8, 100 32, 150 20 C200 8, 250 32, 300 20 C350 8, 400 32, 450 20"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.6"
      fill="none"
    />
    <path
      d="M0 28 C60 16, 110 40, 160 28 C210 16, 260 40, 310 28 C360 16, 410 40, 460 28"
      stroke={color}
      strokeWidth="1"
      opacity="0.35"
      fill="none"
    />
  </svg>
);

// ─── 3. Concentric Sacred Geometry Halo (Breathing / Focus) ───────────
export const MeditationHalo: React.FC<{
  className?: string;
  pulseColor?: string;
  animate?: boolean;
}> = ({
  className = 'w-80 h-80',
  pulseColor = '#B85C3B',
  animate = false,
}) => (
  <svg viewBox="0 0 240 240" fill="none" className={className} aria-hidden="true">
    {/* Outer halo rings */}
    <circle cx="120" cy="120" r="115" stroke={pulseColor} strokeWidth="0.75" opacity="0.12" strokeDasharray="3 3" />
    <circle cx="120" cy="120" r="100" stroke={pulseColor} strokeWidth="0.75" opacity="0.16" />
    <circle cx="120" cy="120" r="84" stroke={pulseColor} strokeWidth="0.85" opacity="0.2" />
    <circle cx="120" cy="120" r="68" stroke={pulseColor} strokeWidth="1" opacity="0.25" strokeDasharray="2 4" />
    <circle cx="120" cy="120" r="52" stroke={pulseColor} strokeWidth="1.2" opacity="0.3" />
    <circle cx="120" cy="120" r="36" stroke={pulseColor} strokeWidth="1.2" opacity="0.35" />
    {/* 8 radiating sacred rays */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <line
        key={angle}
        x1="120"
        y1="120"
        x2={120 + 112 * Math.cos((angle * Math.PI) / 180)}
        y2={120 + 112 * Math.sin((angle * Math.PI) / 180)}
        stroke={pulseColor}
        strokeWidth="0.6"
        opacity="0.12"
      />
    ))}
    {/* Central radiant glowing core */}
    <circle cx="120" cy="120" r="12" fill={pulseColor} opacity="0.15" />
    <circle cx="120" cy="120" r="6" fill={pulseColor} opacity="0.25">
      {animate && (
        <animate attributeName="r" values="5;9;5" dur="4s" repeatCount="indefinite" />
      )}
    </circle>
  </svg>
);

// ─── 4. Blooming Lotus Mandala for Breathing Cycle ────────────────────
export const BloomingMandala: React.FC<{
  className?: string;
  phase?: 'inhale' | 'hold1' | 'exhale' | 'hold2';
  color?: string;
}> = ({
  className = 'w-64 h-64',
  phase = 'inhale',
  color = '#B85C3B',
}) => {
  const isExpanded = phase === 'inhale' || phase === 'hold1';
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      className={`${className} transition-all duration-1000 ease-in-out`}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="mandala-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="60%" stopColor={color} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Ambient center glow */}
      <circle cx="100" cy="100" r={isExpanded ? 90 : 65} fill="url(#mandala-glow)" className="transition-all duration-1000" />

      {/* Outer 8 Sacred Petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path
          key={`outer-${angle}`}
          d="M100 100 C92 70, 85 45, 100 28 C115 45, 108 70, 100 100 Z"
          fill={color}
          opacity={isExpanded ? 0.16 : 0.08}
          transform={`rotate(${angle} 100 100)`}
          className="transition-all duration-1000 origin-center"
        />
      ))}

      {/* Inner 8 Sacred Petals (offset by 22.5 deg) */}
      {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
        <path
          key={`inner-${angle}`}
          d="M100 100 C94 78, 88 58, 100 46 C112 58, 106 78, 100 100 Z"
          fill={color}
          opacity={isExpanded ? 0.22 : 0.12}
          transform={`rotate(${angle} 100 100)`}
          className="transition-all duration-1000 origin-center"
        />
      ))}

      {/* Concentric harmony rings */}
      <circle cx="100" cy="100" r={isExpanded ? 55 : 42} stroke={color} strokeWidth="1" opacity="0.3" className="transition-all duration-1000" />
      <circle cx="100" cy="100" r={isExpanded ? 36 : 28} stroke={color} strokeWidth="0.8" opacity="0.35" strokeDasharray="3 3" className="transition-all duration-1000" />
      <circle cx="100" cy="100" r={isExpanded ? 18 : 14} fill={color} opacity="0.2" className="transition-all duration-1000" />
    </svg>
  );
};

// ─── 5. Hero Sanctuary Header Illustration (Editorial Calm Landscape) ───
export const HeroSanctuaryIllustration: React.FC<{
  className?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}> = ({
  className = 'w-64 h-36',
  timeOfDay = 'evening',
}) => {
  const isNight = timeOfDay === 'evening';
  const sunColor = isNight ? '#D4785B' : '#B85C3B';
  const hill1 = '#6B7A5B'; // Sage
  const hill2 = '#B85C3B'; // Terracotta
  const skyTint = '#E7E1DA'; // Stone

  return (
    <svg viewBox="0 0 280 160" fill="none" className={className} aria-hidden="true">
      {/* Radiant celestial orb (Sun or Moon) */}
      <circle cx="190" cy="65" r="28" fill={sunColor} opacity="0.16" />
      <circle cx="190" cy="65" r="20" fill={sunColor} opacity="0.24" />
      <circle cx="190" cy="65" r="12" fill={sunColor} opacity="0.35" />

      {/* Orbit / Radiance rings */}
      <circle cx="190" cy="65" r="42" stroke={sunColor} strokeWidth="0.75" opacity="0.2" strokeDasharray="2 3" />
      <circle cx="190" cy="65" r="56" stroke={sunColor} strokeWidth="0.5" opacity="0.12" />

      {/* Floating celestial stars */}
      {[
        [35, 30, 1.5], [75, 45, 1], [115, 25, 2], [145, 50, 1.2],
        [240, 35, 1.8], [260, 60, 1.2], [55, 75, 1]
      ].map(([x, y, r], idx) => (
        <circle key={idx} cx={x} cy={y} r={r} fill={sunColor} opacity="0.3" />
      ))}

      {/* Background Soft Mountain Hill */}
      <path
        d="M60 160 C110 110, 150 95, 210 115 C240 125, 260 140, 280 160 Z"
        fill={hill1}
        opacity="0.1"
      />

      {/* Midground Flowing Gentle Terracotta Hill */}
      <path
        d="M0 160 C50 120, 100 115, 160 135 C200 148, 240 140, 280 160 Z"
        fill={hill2}
        opacity="0.14"
      />

      {/* Foreground Rolling Contour with Botanical Leaf Stem */}
      <path
        d="M-10 160 C30 140, 80 135, 140 150 C180 160, 220 155, 280 160 Z"
        fill={skyTint}
        opacity="0.5"
      />

      {/* Serene Botanical Plant Silhouettes */}
      <g opacity="0.35">
        {/* Main stem */}
        <path d="M45 160 Q55 125 72 105" stroke={hill1} strokeWidth="1.4" fill="none" />
        {/* Leaves */}
        <path d="M54 135 C42 130, 40 120, 52 125 C58 128, 56 133, 54 135 Z" fill={hill1} />
        <path d="M60 125 C72 120, 75 110, 63 115 C58 118, 59 123, 60 125 Z" fill={hill1} />
        <path d="M66 113 C56 108, 55 98, 64 104 C68 107, 67 111, 66 113 Z" fill={hill1} />
        <path d="M72 105 C78 95, 75 90, 70 98 C68 102, 70 104, 72 105 Z" fill={hill1} />
      </g>
    </svg>
  );
};

// ─── 6. Mountain Horizon Grounding Silhouette ─────────────────────────
export const MountainSilhouette: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-16',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 400 60" fill="none" className={className} preserveAspectRatio="none" aria-hidden="true">
    {/* Far range */}
    <path
      d="M0 60 L45 32 L85 45 L135 15 L175 38 L220 20 L260 40 L310 10 L355 32 L400 18 L400 60 Z"
      fill={color}
      opacity="0.18"
    />
    {/* Near range */}
    <path
      d="M0 60 L70 38 L110 50 L170 24 L220 42 L275 28 L330 45 L380 32 L400 36 L400 60 Z"
      fill={color}
      opacity="0.1"
    />
  </svg>
);

// ─── 7. Sun / Morning Radiance ───────────────────────────────────────
export const SunRadiance: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-20 h-20',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
    {/* Radiating 12 rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
      <line
        key={angle}
        x1="50"
        y1="50"
        x2={50 + 44 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 44 * Math.sin((angle * Math.PI) / 180)}
        stroke={color}
        strokeWidth="0.8"
        opacity="0.18"
        strokeLinecap="round"
      />
    ))}
    {/* Concentric warmth */}
    <circle cx="50" cy="50" r="22" fill={color} opacity="0.08" />
    <circle cx="50" cy="50" r="14" fill={color} opacity="0.14" />
    <circle cx="50" cy="50" r="7" fill={color} opacity="0.25" />
  </svg>
);

// ─── 8. Constellation & Floating Starfield ───────────────────────────
export const ConstellationDots: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-full',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 200 100" fill="none" className={className} aria-hidden="true">
    {[
      [15, 20], [45, 12], [80, 30], [120, 15], [155, 25], [185, 10],
      [30, 50], [65, 45], [95, 60], [130, 42], [170, 55], [195, 48],
      [20, 80], [50, 75], [85, 85], [115, 72], [150, 88], [180, 78],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1.2 + (i % 3) * 0.4} fill={color} opacity={0.22 + (i % 4) * 0.08} />
    ))}
    <line x1="15" y1="20" x2="45" y2="12" stroke={color} strokeWidth="0.4" opacity="0.18" />
    <line x1="80" y1="30" x2="65" y2="45" stroke={color} strokeWidth="0.4" opacity="0.18" />
    <line x1="120" y1="15" x2="130" y2="42" stroke={color} strokeWidth="0.4" opacity="0.18" />
    <line x1="155" y1="25" x2="170" y2="55" stroke={color} strokeWidth="0.4" opacity="0.18" />
  </svg>
);

// ─── 9. Lotus Motif (Reflection & Stillness) ─────────────────────────
export const LotusMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-16',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <circle cx="40" cy="40" r="5" fill={color} opacity="0.25" />
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse
        key={angle}
        cx="40"
        cy="20"
        rx="9"
        ry="19"
        fill={color}
        opacity="0.1"
        transform={`rotate(${angle} 40 40)`}
      />
    ))}
    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
      <ellipse
        key={angle}
        cx="40"
        cy="26"
        rx="6"
        ry="13"
        fill={color}
        opacity="0.15"
        transform={`rotate(${angle} 40 40)`}
      />
    ))}
  </svg>
);

// ─── 10. Soft Organic Gradient Blob ──────────────────────────────────
export const GradientBlob: React.FC<{
  className?: string;
  color1?: string;
  color2?: string;
  variant?: 1 | 2 | 3;
}> = ({
  className = 'w-32 h-32',
  color1 = '#B85C3B',
  color2 = '#6B7A5B',
  variant = 1,
}) => {
  const id = `blob-grad-${variant}`;
  const paths = {
    1: 'M45 5 C70 0, 95 20, 90 45 C85 70, 60 95, 35 90 C10 85, -5 60, 5 35 C15 10, 20 10, 45 5 Z',
    2: 'M50 2 C75 5, 98 30, 92 55 C86 80, 55 98, 30 90 C5 82, -2 55, 8 30 C18 5, 25 -1, 50 2 Z',
    3: 'M40 8 C65 2, 92 22, 95 48 C98 74, 75 96, 48 95 C21 94, 2 72, 5 46 C8 20, 15 14, 40 8 Z',
  };
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <path d={paths[variant]} fill={`url(#${id})`} />
    </svg>
  );
};

// ─── 11. Leaf Section Divider ─────────────────────────────────────────
export const LeafDivider: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full',
  color = '#E7E1DA',
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.6 }} />
    <svg viewBox="0 0 20 12" fill="none" className="w-5 h-3 shrink-0" aria-hidden="true">
      <path
        d="M10 1 C6 2, 3 5, 4 8 C5 10, 8 11, 10 11 C12 11, 15 10, 16 8 C17 5, 14 2, 10 1 Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
    <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.6 }} />
  </div>
);

// ─── 12. Soft Breath Cloud ───────────────────────────────────────────
export const BreathCloud: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-10',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 80 50" fill="none" className={className} aria-hidden="true">
    <ellipse cx="40" cy="30" rx="32" ry="16" fill={color} opacity="0.35" />
    <ellipse cx="28" cy="24" rx="18" ry="14" fill={color} opacity="0.3" />
    <ellipse cx="55" cy="22" rx="20" ry="15" fill={color} opacity="0.3" />
    <ellipse cx="40" cy="18" rx="22" ry="14" fill={color} opacity="0.25" />
  </svg>
);
