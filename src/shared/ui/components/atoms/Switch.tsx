'use client';

import React from 'react';
import { LayoutContainer, Text } from '@/shared/ui/components';
import { SWITCH_CONSTANTS } from './Switch.constants';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  id?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
  id,
}) => {
  const switchId = id || (label ? `switch-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <LayoutContainer
      className={`flex items-start justify-between gap-4 select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
      onClick={() => {
        if (!disabled) {
          onChange(!checked);
        }
      }}
    >
      {(label || description) && (
        <LayoutContainer className="flex flex-col gap-0.5">
          {label && (
            <Text
              as="span"
              className={`text-xs sm:text-sm font-bold text-text-primary ${
                disabled ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {label}
            </Text>
          )}
          {description && (
            <Text as="p" className="text-xs text-text-muted leading-relaxed">
              {description}
            </Text>
          )}
        </LayoutContainer>
      )}

      {/* Pill do Switch */}
      <LayoutContainer
        id={switchId}
        role="switch"
        aria-checked={checked}
        aria-label={label || SWITCH_CONSTANTS.ARIA_LABEL_DEFAULT}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          checked ? 'bg-primary' : 'bg-surface-secondary border border-border'
        }`}
      >
        {/* Thumb Circular */}
        <LayoutContainer
          as="div"
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white dark:bg-background shadow-md transform ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5 bg-background dark:bg-primary text-primary' : 'translate-x-0'
          }`}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
