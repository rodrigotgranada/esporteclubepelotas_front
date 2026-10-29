'use client';

import React, { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

export interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mask: string;
  onAccept?: (value: string, mask: unknown, e: unknown) => void;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ label, error, className = '', mask, onAccept, onChange, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
        <IMaskInput
          {...(props as any)}
          inputRef={ref as React.Ref<HTMLInputElement>}
          mask={mask}
          onAccept={(val, maskRef, e) => {
            if (onAccept) onAccept(val as string, maskRef, e);
            if (onChange) {
              const event = {
                target: { value: val, name: props.name },
              } as unknown as React.ChangeEvent<HTMLInputElement>;
              onChange(event);
            }
          }}
          className={`w-full bg-surface border ${
            error ? 'border-error focus:ring-error' : 'border-border focus:ring-primary'
          } rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 ${className}`}
        />
        {error && <span className="text-xs text-error">{error}</span>}
      </div>
    );
  }
);
MaskedInput.displayName = 'MaskedInput';
