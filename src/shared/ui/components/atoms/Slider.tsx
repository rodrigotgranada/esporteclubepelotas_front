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
        className={`w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';
