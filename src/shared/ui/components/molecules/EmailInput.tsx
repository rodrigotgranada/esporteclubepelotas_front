import React, { forwardRef } from 'react';
import { Mail } from 'lucide-react';
import { InputProps } from '../atoms/Input';

export interface EmailInputProps extends InputProps {
  label?: string;
  error?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary">
            <Mail size={18} />
          </div>
          <input
            {...props}
            type="email"
            ref={ref}
            className={`w-full pl-11 pr-4 py-3 bg-surface border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-text-primary placeholder:text-text-secondary ${
              error ? 'border-error focus:ring-error' : 'border-border'
            } ${className}`}
          />
        </div>
        {error && <span className="text-error text-xs mt-1 block">{error}</span>}
      </div>
    );
  }
);
EmailInput.displayName = 'EmailInput';
