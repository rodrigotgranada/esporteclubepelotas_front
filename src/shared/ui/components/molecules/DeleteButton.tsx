import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '../atoms/Button';
import { Trash2 } from 'lucide-react';

export const DeleteButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children = 'Excluir', variant = 'danger', ...props }, ref) => {
    return (
      <Button ref={ref} variant={variant} {...props}>
        {children}
        <Trash2 size={18} />
      </Button>
    );
  }
);
DeleteButton.displayName = 'DeleteButton';
