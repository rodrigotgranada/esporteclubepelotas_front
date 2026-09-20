import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '../atoms/Button';
import { Check } from 'lucide-react';

export const ConfirmButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = 'Confirmar', variant = 'primary', ...props }, ref) => {
    return (
      <Button ref={ref} variant={variant} {...props}>
        {children}
        <Check size={18} />
      </Button>
    );
  }
);
ConfirmButton.displayName = 'ConfirmButton';
