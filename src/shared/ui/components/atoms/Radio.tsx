import React, { forwardRef } from 'react';
import { Text } from './Text';
import { LayoutContainer } from './LayoutContainer';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  card?: boolean;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, description, card = false, checked, className = '', disabled, ...props }, ref) => {
    const cardClasses = card
      ? `w-full p-3.5 rounded-xl border transition-all text-left ${
          checked
            ? 'border-primary bg-primary/10'
            : 'border-border bg-background/60 hover:border-primary/50'
        }`
      : '';

    return (
      <label
        className={`flex items-start gap-3 cursor-pointer group ${cardClasses} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="mt-0.5 shrink-0">
          <input
            type="radio"
            ref={ref}
            checked={checked}
            disabled={disabled}
            className={`w-4 h-4 accent-primary border-border focus:ring-primary disabled:opacity-50 cursor-pointer ${className}`}
            {...props}
          />
        </div>
        <LayoutContainer className="flex flex-col">
          <Text
            as="span"
            className={`text-sm font-medium transition-colors ${
              checked ? 'text-text-primary font-semibold' : 'text-text-secondary group-hover:text-text-primary'
            }`}
          >
            {label}
          </Text>
          {description && (
            <Text as="p" className="text-xs text-text-secondary mt-0.5">
              {description}
            </Text>
          )}
        </LayoutContainer>
      </label>
    );
  },
);

Radio.displayName = 'Radio';

