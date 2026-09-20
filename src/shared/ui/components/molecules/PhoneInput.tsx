import React, { forwardRef } from 'react';
import { MaskedInput } from '../atoms/MaskedInput';

export interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ label = 'Telefone', placeholder = '(00) 00000-0000', ...props }, ref) => {
    return (
      <MaskedInput
        ref={ref}
        mask="(00) 00000-0000"
        label={label}
        placeholder={placeholder}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';
