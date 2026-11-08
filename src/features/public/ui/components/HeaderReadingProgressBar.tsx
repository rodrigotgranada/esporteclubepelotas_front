'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { LayoutContainer } from '@/shared/ui/components';

/**
 * Barra áureo-cerúlea de progresso de leitura fixada exatamente na borda inferior do Header.
 * Ativa automaticamente em páginas de leitura contínua:
 * - Matérias individuais (/noticias/[slug])
 * - Estádio Boca do Lobo (/estadio)
 * - Linha do Tempo e Memorial (/historia e /timeline)
 */
export const HeaderReadingProgressBar: React.FC = () => {
  const rawPathname = usePathname();
  const [progress, setProgress] = useState(0);

  // Normalização do caminho atual para prevenir falhas com trailing slashes
  const cleanPath = (rawPathname || '').replace(/\/$/, '') || '/';

  const isReadingPage =
    cleanPath === '/estadio' ||
    cleanPath === '/historia' ||
    cleanPath === '/timeline' ||
    (cleanPath.startsWith('/noticias/') && cleanPath !== '/noticias');

  const computeProgress = useCallback(() => {
    if (typeof window === 'undefined') return;

    const scrollTop =
      window.pageYOffset ||
      window.scrollY ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const scrollHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.offsetHeight
    );

    const clientHeight =
      window.innerHeight || document.documentElement.clientHeight || 0;

    const scrollableDistance = scrollHeight - clientHeight;

    if (scrollableDistance > 20) {
      const rawPercent = (scrollTop / scrollableDistance) * 100;
      // Garante limites estritos entre 0 e 100 (inclui proteções contra rubber-banding no iOS)
      const clamped = Math.min(100, Math.max(0, rawPercent));
      setProgress(clamped);
    } else {
      setProgress(0);
    }
  }, []);

  useEffect(() => {
    if (!isReadingPage) {
      setProgress(0);
      return;
    }

    computeProgress();

    window.addEventListener('scroll', computeProgress, { passive: true });
    window.addEventListener('resize', computeProgress, { passive: true });

    // Recalcula após carregamento dinâmico de fontes, imagens e dados assíncronos da API
    const timer1 = setTimeout(computeProgress, 400);
    const timer2 = setTimeout(computeProgress, 1200);
    const timer3 = setTimeout(computeProgress, 2500);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && document.body) {
      resizeObserver = new ResizeObserver(() => {
        computeProgress();
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      window.removeEventListener('scroll', computeProgress);
      window.removeEventListener('resize', computeProgress);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [isReadingPage, cleanPath, computeProgress]);

  if (!isReadingPage) return null;

  return (
    <LayoutContainer
      className={`absolute top-full left-0 right-0 z-50 h-[3.5px] pointer-events-none transition-opacity duration-200 ${
        progress > 0.2 ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* Trilho de contraste sutil para perfeita legibilidade sobre qualquer fundo */}
      <LayoutContainer className="w-full h-full bg-header-border/40 backdrop-blur-xs relative overflow-hidden">
        {/* Preenchimento Áureo-Cerúleo que corre acompanhando o scroll da torcida */}
        <LayoutContainer
          className="h-full bg-primary shadow-[0_0_8px_rgba(255,204,0,0.75)] transition-all duration-75 ease-out"
          style={{ width: `${progress}%` }}
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
