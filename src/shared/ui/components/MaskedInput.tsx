import React, { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  mask: string;
  onAccept?: (value: string, mask: unknown, e: unknown) => void;
}

export const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ label, error, className = '', mask, onAccept, onChange, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1 w-full">
        {label && <label className="text-sm font-medium text-gray-200">{label}</label>}
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
          className={`w-full bg-white/5 border ${
            error ? 'border-red-500' : 'border-white/10'
          } rounded-lg px-4 py-2.5 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${className}`}
        />
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
MaskedInput.displayName = 'MaskedInput';
