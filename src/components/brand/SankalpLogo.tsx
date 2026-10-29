import React from 'react';

interface SankalpLogoProps {
  variant?: 'symbol' | 'horizontal' | 'vertical' | 'full' | 'wordmark';
  theme?: 'primary' | 'dark' | 'terracotta' | 'monochrome';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  symbolClassName?: string;
  onClick?: () => void;
}

export const SankalpSymbol: React.FC<{
  className?: string;
  fillColor?: string;
  width?: number | string;
  height?: number | string;
}> = ({ className = 'w-6 h-6', fillColor = '#B85C3B', width, height }) => (
  <svg
    viewBox="0 0 95 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 ${className}`}
    style={{ width, height }}
    aria-hidden="true"
  >
    {/* Upper leaf segment */}
    <path
      d="M 68.78 5.0 C 44.54 8.83, 25.41 26.69, 35.61 45.82 C 40.72 57.3, 61.13 67.5, 71.33 82.81 C 82.81 68.78, 89.19 49.65, 81.54 31.79 C 77.71 19.03, 72.61 11.38, 68.78 5.0 Z"
      fill={fillColor}
    />
    {/* Lower leaf segment */}
    <path
      d="M 20.31 34.34 C 5.0 41.99, 5.0 63.68, 20.31 77.71 C 29.24 85.36, 40.72 91.74, 43.27 108.32 C 57.3 94.29, 58.57 76.43, 45.82 64.95 C 35.61 54.75, 26.69 45.82, 20.31 34.34 Z"
      fill={fillColor}
    />
  </svg>
);

export const SankalpLogo: React.FC<SankalpLogoProps> = ({
  variant = 'horizontal',
  theme = 'primary',
  size = 'md',
  className = '',
  symbolClassName = '',
  onClick,
}) => {
  // Color configuration
  const symbolColor =
    theme === 'dark'
      ? '#FAF8F4'
      : theme === 'monochrome'
      ? '#1B1A19'
      : '#B85C3B'; // Terracotta

  const textColor =
    theme === 'dark'
      ? 'text-[#FAF8F4]'
      : theme === 'terracotta'
      ? 'text-[#B85C3B]'
      : 'text-[#1B1A19]';

  const taglineColor =
    theme === 'dark' ? 'text-[#FAF8F4]/70' : 'text-[#78716C]';

  // Size configuration
  const sizeMap = {
    xs: { symbol: 'w-4 h-4', text: 'text-xs tracking-[0.24em]', tagline: 'text-[9px]' },
    sm: { symbol: 'w-5 h-5', text: 'text-sm tracking-[0.26em]', tagline: 'text-[10px]' },
    md: { symbol: 'w-6 h-6', text: 'text-base sm:text-lg tracking-[0.28em]', tagline: 'text-[11px]' },
    lg: { symbol: 'w-8 h-8', text: 'text-xl sm:text-2xl tracking-[0.3em]', tagline: 'text-xs' },
    xl: { symbol: 'w-12 h-12', text: 'text-3xl tracking-[0.32em]', tagline: 'text-sm' },
  }[size];

  // Pure symbol
  if (variant === 'symbol') {
    return (
      <SankalpSymbol
        className={`${sizeMap.symbol} ${symbolClassName} ${className}`}
        fillColor={symbolColor}
      />
    );
  }

  // Pure wordmark
  if (variant === 'wordmark') {
    return (
      <span
        onClick={onClick}
        className={`font-semibold uppercase select-none font-wordmark ${sizeMap.text} ${textColor} ${className}`}
      >
        S A N K A L P
      </span>
    );
  }

  // Vertical lockup
  if (variant === 'vertical') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center text-center gap-2 select-none ${className}`}
      >
        <SankalpSymbol
          className={`${sizeMap.symbol} ${symbolClassName}`}
          fillColor={symbolColor}
        />
        <span className={`font-semibold uppercase font-wordmark ${sizeMap.text} ${textColor}`}>
          S A N K A L P
        </span>
        <span className={`font-medium tracking-wide ${sizeMap.tagline} ${taglineColor}`}>
          A promise to the person you're becoming.
        </span>
      </div>
    );
  }

  // Full lockup (Symbol + Wordmark + Tagline stacked)
  if (variant === 'full') {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col gap-1 select-none ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <SankalpSymbol
            className={`${sizeMap.symbol} ${symbolClassName}`}
            fillColor={symbolColor}
          />
          <span className={`font-semibold uppercase font-wordmark ${sizeMap.text} ${textColor}`}>
            S A N K A L P
          </span>
        </div>
        <p className={`font-medium tracking-wider uppercase text-[10px] sm:text-[11px] ${taglineColor} pl-0.5`}>
          A promise to the person you're becoming
        </p>
      </div>
    );
  }

  // Horizontal lockup (default: Symbol + Wordmark)
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 select-none ${className}`}
    >
      <SankalpSymbol
        className={`${sizeMap.symbol} ${symbolClassName}`}
        fillColor={symbolColor}
      />
      <span className={`font-semibold uppercase font-wordmark ${sizeMap.text} ${textColor}`}>
        S A N K A L P
      </span>
    </div>
  );
};
