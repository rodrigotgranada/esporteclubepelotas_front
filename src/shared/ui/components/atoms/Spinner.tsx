import React from 'react';
import { Loader2 } from 'lucide-react';
import { LayoutContainer, Text } from '@/shared/ui/components';

export interface SpinnerProps {
  size?: number;
  text?: string;
  className?: string;
}

export const Spinner = ({ size = 24, text, className = '' }: SpinnerProps) => {
  return (
    <LayoutContainer
      className={`inline-flex flex-col items-center justify-center gap-2.5 text-primary ${text ? 'p-4' : 'p-1'} ${className}`}
    >
      <Loader2
        size={size}
        style={{ width: size, height: size }}
        className="animate-spin text-current shrink-0"
      />
      {text && <Text className="text-text-secondary text-sm">{text}</Text>}
    </LayoutContainer>
  );
};
