'use client';

import React from 'react';
import { LayoutContainer, Text } from '../atoms';
import { Check, Circle } from 'lucide-react';
import { PASSWORD_STRENGTH_TEXTS } from './PasswordStrengthMeter.constants';

export interface PasswordStrengthMeterProps {
  password?: string;
  showCriteria?: boolean;
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password = '',
  showCriteria = true,
  className = '',
}) => {
  if (!password) return null;

  const minChars = password.length >= 8;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasUpperLower = hasLower && hasUpper;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (password.length >= 6) {
    if (minChars) score += 1;
    if (hasUpperLower) score += 1;
    if (hasNumber) score += 1;
    if (hasSpecial) score += 1;
  }

  let levelLabel = PASSWORD_STRENGTH_TEXTS.LEVELS.VERY_WEAK;
  let activeColorClass = 'bg-error';
  let textColorClass = 'text-error';

  if (score === 1) {
    levelLabel = PASSWORD_STRENGTH_TEXTS.LEVELS.WEAK;
    activeColorClass = 'bg-error';
    textColorClass = 'text-error';
  } else if (score === 2) {
    levelLabel = PASSWORD_STRENGTH_TEXTS.LEVELS.MEDIUM;
    activeColorClass = 'bg-warning';
    textColorClass = 'text-warning';
  } else if (score === 3) {
    levelLabel = PASSWORD_STRENGTH_TEXTS.LEVELS.GOOD;
    activeColorClass = 'bg-primary';
    textColorClass = 'text-primary';
  } else if (score >= 4) {
    levelLabel = PASSWORD_STRENGTH_TEXTS.LEVELS.STRONG;
    activeColorClass = 'bg-success';
    textColorClass = 'text-success';
  }

  const criteriaList = [
    { met: minChars, label: PASSWORD_STRENGTH_TEXTS.CRITERIA.MIN_CHARS },
    { met: hasUpperLower, label: PASSWORD_STRENGTH_TEXTS.CRITERIA.UPPER_LOWER },
    { met: hasNumber, label: PASSWORD_STRENGTH_TEXTS.CRITERIA.NUMBERS },
    { met: hasSpecial, label: PASSWORD_STRENGTH_TEXTS.CRITERIA.SPECIAL },
  ];

  return (
    <LayoutContainer className={`flex flex-col gap-2 mt-1.5 ${className}`}>
      {/* Bar and Label Header */}
      <LayoutContainer className="flex items-center justify-between gap-2">
        <LayoutContainer className="flex items-center gap-1.5 flex-1">
          {[1, 2, 3, 4].map((step) => {
            const isFilled = score >= step;
            return (
              <LayoutContainer
                key={step}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  isFilled ? activeColorClass : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
            );
          })}
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-1 shrink-0">
          <Text as="span" className="text-xs text-text-secondary">
            {PASSWORD_STRENGTH_TEXTS.TITLE}
          </Text>
          <Text as="span" className={`text-xs font-bold ${textColorClass}`}>
            {levelLabel}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Criteria Checklist */}
      {showCriteria && (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
          {criteriaList.map((crit, idx) => (
            <LayoutContainer key={idx} className="flex items-center gap-1.5">
              {crit.met ? (
                <Check size={13} className="text-success shrink-0" />
              ) : (
                <Circle size={10} className="text-text-secondary/50 shrink-0" />
              )}
              <Text
                as="span"
                className={`text-[11px] leading-tight transition-colors ${
                  crit.met ? 'text-text-primary font-medium' : 'text-text-secondary/70'
                }`}
              >
                {crit.label}
              </Text>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};

