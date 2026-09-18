import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', type = 'button', ...props }, ref) => {
    return (
      <button ref={ref} type={type} className={className} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
