import React from 'react';

export interface LayoutContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  as?: 'div' | 'main' | 'section' | 'article' | 'header' | 'footer' | 'nav';
}

export const LayoutContainer = React.forwardRef<HTMLDivElement, LayoutContainerProps>(
  ({ children, as: Component = 'div', className = '', ...props }, ref) => {
    return (
      <Component ref={ref} className={className} {...props}>
        {children}
      </Component>
    );
  }
);
LayoutContainer.displayName = 'LayoutContainer';
