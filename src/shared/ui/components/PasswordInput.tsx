import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-gray-200">{label}</label>}
        <div className="relative">
          <input
            {...props}
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            className={`w-full bg-white/5 border ${
              error ? 'border-red-500' : 'border-white/10'
            } rounded-lg px-4 py-2.5 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 pr-10 ${className}`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';
