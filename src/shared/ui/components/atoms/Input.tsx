import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-gray-200">{label}</label>}
        <input
          {...props}
          ref={ref}
          className={`w-full bg-white/5 border ${
            error ? 'border-yellow-500' : 'border-white/10'
          } rounded-lg px-4 py-2.5 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
        />
        {error && <span className="text-xs text-yellow-500">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
