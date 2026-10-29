import React, { forwardRef } from 'react';

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  // Can add custom slider props here if needed
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className = '', disabled, ...props }, ref) => {
    return (
      <input
        type="range"
        ref={ref}
        disabled={disabled}
        className={`w-full h-2 bg-neutral-200 dark:bg-neutral-700 border border-border/50 rounded-lg appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
