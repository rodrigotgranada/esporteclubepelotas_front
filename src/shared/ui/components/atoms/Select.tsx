import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  onChange?: (e: any) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = '', children, value, onChange, disabled, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const options: { value: string; label: React.ReactNode }[] = [];
    let selectedLabel: React.ReactNode = '';
    
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        const childVal = child.props.value;
        const childLabel = child.props.children;
        options.push({ value: childVal, label: childLabel });
        if (childVal === value) {
          selectedLabel = childLabel;
        }
      }
    });

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      if (isOpen) document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSelect = (val: string) => {
      if (onChange) {
        onChange({ target: { value: val } } as any);
      }
      setIsOpen(false);
    };

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <select 
            ref={ref} 
            value={value} 
            onChange={onChange} 
            className="hidden" 
            disabled={disabled}
            {...props}
          >
            {children}
          </select>
          
          <button
            type="button"
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full bg-surface border ${error ? 'border-error' : 'border-border'} ${isOpen ? 'ring-2 ring-primary border-transparent' : ''} rounded-lg px-4 py-2.5 text-left text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-between ${className}`}
          >
            <span className={!selectedLabel ? 'text-text-secondary truncate block' : 'truncate block'}>
              {selectedLabel || 'Selecione...'}
            </span>
            <ChevronDown size={18} className={`text-text-secondary flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-2 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <ul className="max-h-60 overflow-y-auto p-1.5 custom-scrollbar">
                {options.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  return (
                    <li
                      key={`${opt.value}-${idx}`}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm ${
                        isSelected 
                          ? 'bg-primary/10 text-primary font-bold' 
                          : 'text-text-secondary hover:bg-background hover:text-text-primary'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected && <Check size={16} className="text-primary flex-shrink-0" />}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        {error && <span className="text-error text-xs mt-1 block">{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
