import React, { forwardRef } from 'react';
import { MaskedInput } from '../atoms/MaskedInput';

export interface CpfInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const CpfInput = forwardRef<HTMLInputElement, CpfInputProps>(
  ({ label = 'CPF', placeholder = '000.000.000-00', ...props }, ref) => {
    return (
      <MaskedInput
        ref={ref}
        mask="000.000.000-00"
        label={label}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);
CpfInput.displayName = 'CpfInput';
