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
    <LayoutContainer className={`flex flex-col items-center justify-center gap-3 p-8 ${className}`}>
      <Loader2 size={size} className="animate-spin text-primary" />
      {text && <Text className="text-text-secondary text-sm">{text}</Text>}
    </LayoutContainer>
  );
};
