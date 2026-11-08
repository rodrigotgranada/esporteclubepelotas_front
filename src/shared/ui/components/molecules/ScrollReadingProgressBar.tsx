'use client';

import React, { useState, useEffect } from 'react';
import { LayoutContainer } from '../atoms/LayoutContainer';

export interface ScrollReadingProgressBarProps {
  className?: string;
}

/**
 * Barra universal de progresso de leitura e scroll áureo-cerúlea.
 * Fixada no topo da tela com alta prioridade visual (z-[60]), sem bloquear cliques.
 */
export const ScrollReadingProgressBar: React.FC<ScrollReadingProgressBarProps> = ({
  className = '',
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;

      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight || 0;
      const clientHeight =
        document.documentElement.clientHeight || window.innerHeight || 0;

      const windowHeight = scrollHeight - clientHeight;

      if (windowHeight > 0) {
        const scrollPercent = (scrollTop / windowHeight) * 100;
        setProgress(Math.min(100, Math.max(0, scrollPercent)));
      } else {
        setProgress(0);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <LayoutContainer
      className={`fixed top-0 left-0 right-0 z-[60] h-[3.5px] pointer-events-none bg-primary/10 transition-opacity duration-300 ${
        progress > 0.5 ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      aria-hidden="true"
    >
      <LayoutContainer
        className="h-full bg-primary shadow-xs shadow-primary/80 transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </LayoutContainer>
  );
};
