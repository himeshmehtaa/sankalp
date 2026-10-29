import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  sublabel?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  disabled?: boolean;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select option...',
  className = '',
  buttonClassName = '',
  dropdownClassName = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-150 ${
          isOpen
            ? 'border-[#B85C3B] bg-[#FFFFFF] shadow-xs ring-1 ring-[#B85C3B]/20 text-[#1B1A19]'
            : 'border-[#E7E1DA] bg-[#FFFFFF] hover:border-[#D6CEBE] text-[#1B1A19] hover:bg-[#FAF8F4]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${buttonClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon && (
            <span className="shrink-0 text-[#B85C3B]">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : <span className="text-[#8F877F]">{placeholder}</span>}
          </span>
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8F877F] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#B85C3B]' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 mt-1.5 p-1 bg-[#FFFFFF] border border-[#E7E1DA] rounded-xl shadow-lg max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 ${dropdownClassName}`}
          role="listbox"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                  isSelected
                    ? 'bg-[#F8EDE8] text-[#B85C3B] font-semibold'
                    : 'text-[#1B1A19] hover:bg-[#FAF8F4] hover:text-[#B85C3B]'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && (
                    <span className={`shrink-0 ${isSelected ? 'text-[#B85C3B]' : 'text-[#8F877F]'}`}>
                      {opt.icon}
                    </span>
                  )}
                  <div className="truncate">
                    <div className="truncate">{opt.label}</div>
                    {opt.sublabel && (
                      <div className="text-[10px] text-[#8F877F] font-normal leading-tight">
                        {opt.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-[#B85C3B] shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
