import React from 'react';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ children, level: Component = 'h1', className = '', ...props }, ref) => {
    return (
      <Component ref={ref} className={className} {...props}>
        {children}
      </Component>
    );
  }
);
Title.displayName = 'Title';
