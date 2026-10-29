import React from 'react';

// ─── Organic Leaf Motif (Brand identity extension) ─────────────────
export const LeafMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-24 h-24',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 120 120" fill="none" className={className} aria-hidden="true">
    <path
      d="M60 10 C30 20, 15 50, 30 75 C40 90, 55 95, 60 110 C65 95, 80 90, 90 75 C105 50, 90 20, 60 10 Z"
      fill={color}
      opacity="0.08"
    />
    <path
      d="M60 25 C40 32, 28 55, 38 72 C45 82, 55 86, 60 100 C65 86, 75 82, 82 72 C92 55, 80 32, 60 25 Z"
      fill={color}
      opacity="0.06"
    />
    {/* Central vein */}
    <line x1="60" y1="25" x2="60" y2="100" stroke={color} strokeWidth="0.8" opacity="0.12" />
    {/* Side veins */}
    <path d="M60 40 L45 55" stroke={color} strokeWidth="0.5" opacity="0.1" />
    <path d="M60 40 L75 55" stroke={color} strokeWidth="0.5" opacity="0.1" />
    <path d="M60 55 L42 70" stroke={color} strokeWidth="0.5" opacity="0.1" />
    <path d="M60 55 L78 70" stroke={color} strokeWidth="0.5" opacity="0.1" />
    <path d="M60 70 L48 80" stroke={color} strokeWidth="0.5" opacity="0.1" />
    <path d="M60 70 L72 80" stroke={color} strokeWidth="0.5" opacity="0.1" />
  </svg>
);

// ─── Flowing Wave / River Motif ────────────────────────────────────
export const WaveMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-12',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 400 40" fill="none" className={className} preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 20 C50 8, 100 32, 150 20 C200 8, 250 32, 300 20 C350 8, 400 32, 450 20"
      stroke={color}
      strokeWidth="1.5"
      opacity="0.5"
      fill="none"
    />
    <path
      d="M0 28 C60 16, 110 40, 160 28 C210 16, 260 40, 310 28 C360 16, 410 40, 460 28"
      stroke={color}
      strokeWidth="1"
      opacity="0.3"
      fill="none"
    />
  </svg>
);

// ─── Concentric Circle Halo (Meditation / Breathing) ───────────────
export const MeditationHalo: React.FC<{
  className?: string;
  pulseColor?: string;
  animate?: boolean;
}> = ({
  className = 'w-80 h-80',
  pulseColor = '#B85C3B',
  animate = false,
}) => (
  <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
    <circle cx="100" cy="100" r="95" stroke={pulseColor} strokeWidth="0.5" opacity="0.08" />
    <circle cx="100" cy="100" r="80" stroke={pulseColor} strokeWidth="0.5" opacity="0.1" />
    <circle cx="100" cy="100" r="65" stroke={pulseColor} strokeWidth="0.6" opacity="0.12" />
    <circle cx="100" cy="100" r="50" stroke={pulseColor} strokeWidth="0.7" opacity="0.14" />
    <circle cx="100" cy="100" r="35" stroke={pulseColor} strokeWidth="0.8" opacity="0.16" />
    <circle cx="100" cy="100" r="20" stroke={pulseColor} strokeWidth="1" opacity="0.18" />
    {/* Radiant dot center */}
    <circle cx="100" cy="100" r="4" fill={pulseColor} opacity="0.2">
      {animate && (
        <animate attributeName="r" values="3;6;3" dur="4s" repeatCount="indefinite" />
      )}
    </circle>
  </svg>
);

// ─── Soft Cloud / Breath Puff ──────────────────────────────────────
export const BreathCloud: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-10',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 80 50" fill="none" className={className} aria-hidden="true">
    <ellipse cx="40" cy="30" rx="32" ry="16" fill={color} opacity="0.3" />
    <ellipse cx="28" cy="24" rx="18" ry="14" fill={color} opacity="0.25" />
    <ellipse cx="55" cy="22" rx="20" ry="15" fill={color} opacity="0.25" />
    <ellipse cx="40" cy="18" rx="22" ry="14" fill={color} opacity="0.2" />
  </svg>
);

// ─── Mountain Silhouette (Grounding / Goals) ───────────────────────
export const MountainSilhouette: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-16',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 400 60" fill="none" className={className} preserveAspectRatio="none" aria-hidden="true">
    <path
      d="M0 60 L60 28 L90 42 L140 12 L180 35 L220 18 L260 38 L310 8 L350 30 L400 15 L400 60 Z"
      fill={color}
      opacity="0.15"
    />
    <path
      d="M0 60 L80 35 L120 48 L180 22 L230 40 L280 25 L340 42 L400 28 L400 60 Z"
      fill={color}
      opacity="0.08"
    />
  </svg>
);

// ─── Sun / Radiance (Morning / Today) ──────────────────────────────
export const SunRadiance: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-20 h-20',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 100 100" fill="none" className={className} aria-hidden="true">
    {/* Outer rays */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
      <line
        key={angle}
        x1="50"
        y1="50"
        x2={50 + 42 * Math.cos((angle * Math.PI) / 180)}
        y2={50 + 42 * Math.sin((angle * Math.PI) / 180)}
        stroke={color}
        strokeWidth="0.6"
        opacity="0.1"
        strokeLinecap="round"
      />
    ))}
    {/* Warm core glow */}
    <circle cx="50" cy="50" r="18" fill={color} opacity="0.06" />
    <circle cx="50" cy="50" r="12" fill={color} opacity="0.08" />
    <circle cx="50" cy="50" r="6" fill={color} opacity="0.12" />
  </svg>
);

// ─── Dotted Constellation Pattern ──────────────────────────────────
export const ConstellationDots: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full h-full',
  color = '#E7E1DA',
}) => (
  <svg viewBox="0 0 200 100" fill="none" className={className} aria-hidden="true">
    {/* Scattered organic dots */}
    {[
      [15, 20], [45, 12], [80, 30], [120, 15], [155, 25], [185, 10],
      [30, 50], [65, 45], [95, 60], [130, 42], [170, 55], [195, 48],
      [20, 80], [50, 75], [85, 85], [115, 72], [150, 88], [180, 78],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={1 + (i % 3) * 0.4} fill={color} opacity={0.15 + (i % 4) * 0.05} />
    ))}
    {/* Subtle connecting lines */}
    <line x1="15" y1="20" x2="45" y2="12" stroke={color} strokeWidth="0.3" opacity="0.1" />
    <line x1="80" y1="30" x2="65" y2="45" stroke={color} strokeWidth="0.3" opacity="0.1" />
    <line x1="120" y1="15" x2="130" y2="42" stroke={color} strokeWidth="0.3" opacity="0.1" />
    <line x1="155" y1="25" x2="170" y2="55" stroke={color} strokeWidth="0.3" opacity="0.1" />
    <line x1="50" y1="75" x2="85" y2="85" stroke={color} strokeWidth="0.3" opacity="0.1" />
  </svg>
);

// ─── Lotus / Flower Motif (Reflection / Gratitude) ─────────────────
export const LotusMotif: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-16 h-16',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    {/* Center circle */}
    <circle cx="40" cy="40" r="5" fill={color} opacity="0.15" />
    {/* Petals */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
      <ellipse
        key={angle}
        cx="40"
        cy="20"
        rx="8"
        ry="18"
        fill={color}
        opacity="0.06"
        transform={`rotate(${angle} 40 40)`}
      />
    ))}
    {/* Inner petals */}
    {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
      <ellipse
        key={angle}
        cx="40"
        cy="26"
        rx="5"
        ry="12"
        fill={color}
        opacity="0.08"
        transform={`rotate(${angle} 40 40)`}
      />
    ))}
  </svg>
);

// ─── Flowing Gradient Blob (Organic accents) ───────────────────────
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
          <stop offset="0%" stopColor={color1} stopOpacity="0.08" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <path d={paths[variant]} fill={`url(#${id})`} />
    </svg>
  );
};

// ─── Horizontal Divider with leaf accent ───────────────────────────
export const LeafDivider: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-full',
  color = '#E7E1DA',
}) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.5 }} />
    <svg viewBox="0 0 20 12" fill="none" className="w-5 h-3 shrink-0" aria-hidden="true">
      <path
        d="M10 1 C6 2, 3 5, 4 8 C5 10, 8 11, 10 11 C12 11, 15 10, 16 8 C17 5, 14 2, 10 1 Z"
        fill={color}
        opacity="0.4"
      />
    </svg>
    <div className="flex-1 h-px" style={{ backgroundColor: color, opacity: 0.5 }} />
  </div>
);

// ─── Stars / Sparkle for celebration ───────────────────────────────
export const SparkleCluster: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-8 h-8',
  color = '#B85C3B',
}) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    {/* 4-point star */}
    <path d="M20 5 L22 17 L34 20 L22 23 L20 35 L18 23 L6 20 L18 17 Z" fill={color} opacity="0.2" />
    {/* Small accent stars */}
    <circle cx="8" cy="8" r="1.5" fill={color} opacity="0.15" />
    <circle cx="34" cy="10" r="1" fill={color} opacity="0.12" />
    <circle cx="10" cy="34" r="1.2" fill={color} opacity="0.1" />
    <circle cx="32" cy="32" r="0.8" fill={color} opacity="0.15" />
  </svg>
);
