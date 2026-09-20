import React, { forwardRef } from 'react';
import { Mail } from 'lucide-react';
import { Input, InputProps } from '../atoms/Input';

export interface EmailInputProps extends InputProps {
  label?: string;
  error?: string;
}

export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-gray-200">{label}</label>}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
            <Mail size={18} />
          </div>
          <input
            {...props}
            type="email"
            ref={ref}
            className={`w-full pl-11 pr-4 py-3 bg-black/50 border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all outline-none text-white placeholder-gray-600 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-white/10'
            } ${className}`}
          />
        </div>
        {error && <span className="text-red-400 text-xs mt-1 block">{error}</span>}
      </div>
    );
  }
);
EmailInput.displayName = 'EmailInput';
