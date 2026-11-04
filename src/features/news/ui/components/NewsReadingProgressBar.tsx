'use client';

import React, { useState, useEffect } from 'react';
import { LayoutContainer } from '@/shared/ui/components';

export const NewsReadingProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (progress <= 0) return null;

  return (
    <LayoutContainer className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent">
      <LayoutContainer
        className="h-full bg-primary transition-all duration-150 ease-out shadow-xs shadow-primary/50"
        style={{ width: `${progress}%` }}
      />
    </LayoutContainer>
  );
};

