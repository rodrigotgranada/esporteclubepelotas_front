'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LayoutContainer, Title, Text, Button } from '@/shared/ui/components';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Clock, ArrowUp, Sparkles } from 'lucide-react';

interface AppleYearWheelPickerProps {
  years: number[];
  activeYear: number | null;
  onSelectYear: (year: number) => void;
  onScrollToTop?: () => void;
}

const ITEM_HEIGHT = 44; // Altura de cada slot do tambor em pixels

export const AppleYearWheelPicker: React.FC<AppleYearWheelPickerProps> = ({
  years,
  activeYear,
  onSelectYear,
  onScrollToTop,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // Sincroniza o index atual quando o activeYear vindo da página muda (Scroll Spy da timeline)
  useEffect(() => {
    if (!activeYear || years.length === 0) return;
    const idx = years.indexOf(activeYear);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);
      // Se não foi o usuário rolando o tambor diretamente, alinha o tambor suavemente
      if (!isProgrammaticScrollRef.current && wheelRef.current) {
        wheelRef.current.scrollTo({
          top: idx * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }
    }
  }, [activeYear, years, currentIndex]);

  // Listener de scroll do tambor da Apple (quando o usuário gira a rodinha)
  const handleWheelScroll = useCallback(() => {
    if (!wheelRef.current) return;
    const scrollTop = wheelRef.current.scrollTop;
    const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(years.length - 1, rawIndex));

    if (clampedIndex !== currentIndex) {
      setCurrentIndex(clampedIndex);

      // Marca como rolagem programática para a página descer até o ano
      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        onSelectYear(years[clampedIndex]);
        isProgrammaticScrollRef.current = false;
      }, 150);
    }
  }, [years, currentIndex, onSelectYear]);

  // Navegação pelos botões passo a passo
  const stepYear = (direction: 'prev' | 'next') => {
    if (years.length === 0) return;
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    newIndex = Math.max(0, Math.min(years.length - 1, newIndex));

    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
      if (wheelRef.current) {
        wheelRef.current.scrollTo({
          top: newIndex * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }
      onSelectYear(years[newIndex]);
    }
  };

  // Pular direto para um ano ao clicar no item
  const handleItemClick = (idx: number) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
    if (wheelRef.current) {
      wheelRef.current.scrollTo({
        top: idx * ITEM_HEIGHT,
        behavior: 'smooth',
      });
    }
    onSelectYear(years[idx]);
  };

  if (!years || years.length === 0) return null;

  const currentYearDisplay = years[currentIndex] || activeYear || years[0];

  return (
    <LayoutContainer className="sticky top-16 sm:top-20 z-30 w-full flex justify-center px-4 py-2 pointer-events-none">
      {/* Dynamic Floating Apple Watch Wheel Capsule */}
      <LayoutContainer className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-surface/95 backdrop-blur-xl border border-primary/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl shadow-primary/10 transition-all duration-300">
        
        {/* Botão Retornar ao Início */}
        {onScrollToTop && (
          <button
            type="button"
            onClick={onScrollToTop}
            title="Voltar ao início da Linha do Tempo"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/80 hover:bg-surface border border-border/80 hover:border-primary/50 text-text-secondary hover:text-primary flex items-center justify-center transition-all cursor-pointer shrink-0"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Botão Anterior (Passo no tempo para trás) */}
        <button
          type="button"
          onClick={() => stepYear('prev')}
          disabled={currentIndex <= 0}
          title="Marco anterior"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/80 hover:bg-surface disabled:opacity-30 disabled:hover:bg-background/80 border border-border/80 hover:border-primary/50 text-text-secondary hover:text-primary flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Central Drum Wheel Apple Clock */}
        <LayoutContainer className="relative flex items-center justify-center w-36 sm:w-44 h-12 sm:h-14 overflow-hidden rounded-xl bg-background/60 border border-primary/20 select-none group">
          {/* Top Fade Gradient */}
          <LayoutContainer
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-3.5 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"
          />

          {/* Central Target Lens / Seleção Ativa com Linhas de Relógio */}
          <LayoutContainer
            aria-hidden="true"
            className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[34px] rounded-lg bg-primary/10 border-y border-primary/40 pointer-events-none z-0"
          />

          {/* Vertical Wheel Drum (Snap Vertical da Apple) */}
          <div
            ref={wheelRef}
            onScroll={handleWheelScroll}
            className="w-full h-full overflow-y-auto scrollbar-none snap-y snap-mandatory py-[10px]"
            style={{
              scrollSnapType: 'y mandatory',
              scrollBehavior: 'smooth',
            }}
          >
            {years.map((y, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <div
                  key={y}
                  onClick={() => handleItemClick(idx)}
                  className={`h-[44px] flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'scale-110 font-black text-primary text-base sm:text-lg tracking-wider'
                      : 'opacity-40 hover:opacity-80 text-text-secondary text-xs sm:text-sm font-semibold'
                  }`}
                  style={{
                    height: `${ITEM_HEIGHT}px`,
                  }}
                >
                  <span className="flex items-center gap-1">
                    {y}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Fade Gradient */}
          <LayoutContainer
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-3.5 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"
          />
        </LayoutContainer>

        {/* Botão Próximo (Passo no tempo para frente) */}
        <button
          type="button"
          onClick={() => stepYear('next')}
          disabled={currentIndex >= years.length - 1}
          title="Próximo marco"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/80 hover:bg-surface disabled:opacity-30 disabled:hover:bg-background/80 border border-border/80 hover:border-primary/50 text-text-secondary hover:text-primary flex items-center justify-center transition-all cursor-pointer shrink-0"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Contador Informativo (Ex: 5 de 12 marcos) */}
        <LayoutContainer className="hidden md:flex flex-col items-start pl-1 pr-2 border-l border-border/60">
          <Text className="text-[10px] font-bold text-text-secondary/70 uppercase tracking-wider">
            Marco Histórico
          </Text>
          <Text className="text-xs font-black text-primary">
            {currentIndex + 1} de {years.length}
          </Text>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
