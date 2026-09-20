import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '../atoms/Button';
import { X } from 'lucide-react';

export const CancelButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = 'Cancelar', variant = 'ghost', ...props }, ref) => {
    return (
      <Button ref={ref} variant={variant} {...props}>
        {children}
        <X size={18} />
      </Button>
    );
  }
);
CancelButton.displayName = 'CancelButton';
