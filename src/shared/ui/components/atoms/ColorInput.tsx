import React, { forwardRef } from 'react';

export interface ColorInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(
  ({ label, error, value = '#000000', className = '', onChange, ...props }, ref) => {
    const hexValue = typeof value === 'string' ? value.toUpperCase() : '#000000';

    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-xs font-medium text-text-secondary">{label}</label>}
        <div
          className={`flex items-center justify-between px-3 py-2 bg-surface border ${
            error ? 'border-error' : 'border-border'
          } rounded-xl hover:border-primary/50 transition-colors ${className}`}
        >
          <span className="text-xs font-mono font-medium text-text-primary">{hexValue}</span>
          <div className="relative flex items-center">
            <div
              className="w-7 h-7 rounded-lg border border-border shadow-sm cursor-pointer"
              style={{ backgroundColor: typeof value === 'string' ? value : '#000000' }}
            />
            <input
              {...props}
              ref={ref}
              type="color"
              value={value}
              onChange={onChange}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);

ColorInput.displayName = 'ColorInput';

