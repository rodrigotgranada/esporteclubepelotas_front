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
      className={`inline-flex items-center gap-3 select-none ${
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

      {/* Pill / Trilho do Switch (Alto Contraste Claro e Escuro) */}
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
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
          checked
            ? 'bg-primary border-2 border-primary shadow-sm'
            : 'bg-zinc-300 dark:bg-zinc-700 border-2 border-zinc-400 dark:border-zinc-500 hover:bg-zinc-400/70 dark:hover:bg-zinc-600'
        }`}
      >
        {/* Thumb / Bolinha Deslizante (Sempre altamente visível) */}
        <LayoutContainer
          as="div"
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 rounded-full shadow-md transform transition duration-200 ease-in-out ${
            checked
              ? 'translate-x-5 bg-secondary border border-secondary/60'
              : 'translate-x-0.5 bg-white border border-zinc-300 shadow-sm'
          }`}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
