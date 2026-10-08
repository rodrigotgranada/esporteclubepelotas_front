import React, { OptionHTMLAttributes } from 'react';

export interface OptionProps extends OptionHTMLAttributes<HTMLOptionElement> {}

export const Option = React.forwardRef<HTMLOptionElement, OptionProps>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <option
        ref={ref}
        className={`bg-surface text-text-primary ${className}`}
        {...props}
      >
        {children}
      </option>
    );
  }
);

Option.displayName = 'Option';
