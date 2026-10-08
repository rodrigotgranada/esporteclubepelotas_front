import React, { forwardRef } from 'react';
import { Text } from './Text';
import { LayoutContainer } from './LayoutContainer';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  description?: React.ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, className = '', disabled, ...props }, ref) => {
    return (
      <label className={`flex items-start gap-3 cursor-pointer group ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
        <div className="mt-1">
          <input 
            type="checkbox" 
            ref={ref}
            disabled={disabled}
            className={`w-4 h-4 rounded bg-black/50 border-white/20 text-yellow-400 focus:ring-yellow-400 disabled:opacity-50 transition-colors ${className}`} 
            {...props} 
          />
        </div>
        <LayoutContainer>
          <Text as="span" className="text-sm text-gray-400 group-hover:text-white transition-colors">{label}</Text>
          {description && (
            <Text as="p" className="text-sm text-gray-500 mt-0.5">{description}</Text>
          )}
        </LayoutContainer>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
