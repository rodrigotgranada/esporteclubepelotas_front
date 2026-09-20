import React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  children: React.ReactNode;
  as?: 'p' | 'span' | 'strong' | 'em' | 'small';
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ children, as: Component = 'p', className = '', ...props }, ref) => {
    return (
      <Component ref={ref as any} className={className} {...props}>
        {children}
      </Component>
    );
  }
);
Text.displayName = 'Text';
