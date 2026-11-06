'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LayoutContainer, Text, IconButton } from '@/shared/ui/components';
import { ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';

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
  const wheelRef = useRef<HTMLElement>(null);

  // Flags para controle mútuo estrito entre gesto do usuário e sincronização programática
  const isUserInteractingRef = useRef(false);
  const isProgrammaticWheelScrollRef = useRef(false);
  const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const programmaticScrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const debounceSelectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Marca que o usuário está ativamente interagindo com a roleta (toque, drag ou rodinha do mouse)
  const markUserInteracting = useCallback(() => {
    isUserInteractingRef.current = true;
    if (interactionTimeoutRef.current) clearTimeout(interactionTimeoutRef.current);
    interactionTimeoutRef.current = setTimeout(() => {
      isUserInteractingRef.current = false;
    }, 400);
  }, []);

  // Sincroniza a posição do tambor quando o activeYear muda devido à rolagem da página
  useEffect(() => {
    if (!activeYear || years.length === 0) return;
    // Se o usuário estiver com o dedo/mouse na roleta, não sobrescreve
    if (isUserInteractingRef.current) return;

    const idx = years.indexOf(activeYear);
    if (idx !== -1 && idx !== currentIndex) {
      setCurrentIndex(idx);

      // Marca como rolagem programática para que o evento onScroll não dispare onSelectYear de volta
      isProgrammaticWheelScrollRef.current = true;
      if (wheelRef.current) {
        wheelRef.current.scrollTo({
          top: idx * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }

      if (programmaticScrollTimeoutRef.current) clearTimeout(programmaticScrollTimeoutRef.current);
      programmaticScrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticWheelScrollRef.current = false;
      }, 450);
    }
  }, [activeYear, years, currentIndex]);

  // Listener de scroll do tambor da Apple (quando o usuário gira ou solta o tambor)
  const handleWheelScroll = useCallback(() => {
    if (!wheelRef.current) return;

    // Se foi uma rolagem disparada por código (da página ou dos botões), ignora absolutamente
    if (isProgrammaticWheelScrollRef.current) return;

    const scrollTop = wheelRef.current.scrollTop;
    const rawIndex = Math.round(scrollTop / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(years.length - 1, rawIndex));

    // Atualiza o índice visual imediatamente no tambor
    setCurrentIndex(clampedIndex);

    // Se o usuário interagiu com a roleta, debounced dispara o scroll da página até o ano escolhido
    if (isUserInteractingRef.current) {
      if (debounceSelectTimeoutRef.current) clearTimeout(debounceSelectTimeoutRef.current);
      debounceSelectTimeoutRef.current = setTimeout(() => {
        onSelectYear(years[clampedIndex]);
      }, 200);
    }
  }, [years, onSelectYear]);

  // Pular direto para um ano ao clicar no item do tambor
  const handleItemClick = useCallback(
    (idx: number) => {
      if (idx === currentIndex) return;
      setCurrentIndex(idx);

      isProgrammaticWheelScrollRef.current = true;
      if (wheelRef.current) {
        wheelRef.current.scrollTo({
          top: idx * ITEM_HEIGHT,
          behavior: 'smooth',
        });
      }

      onSelectYear(years[idx]);

      if (programmaticScrollTimeoutRef.current) clearTimeout(programmaticScrollTimeoutRef.current);
      programmaticScrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticWheelScrollRef.current = false;
      }, 450);
    },
    [currentIndex, onSelectYear, years]
  );

  // Navegação passo a passo pelos botões anterior / próximo
  const stepYear = useCallback(
    (direction: 'prev' | 'next') => {
      if (years.length === 0) return;
      const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      const clampedIndex = Math.max(0, Math.min(years.length - 1, newIndex));
      if (clampedIndex !== currentIndex) {
        handleItemClick(clampedIndex);
      }
    },
    [currentIndex, handleItemClick, years]
  );

  if (!years || years.length === 0) return null;

  return (
    <LayoutContainer className="sticky top-16 sm:top-20 z-30 w-full flex justify-center px-4 py-2 pointer-events-none">
      {/* Dynamic Floating Apple Watch Wheel Capsule */}
      <LayoutContainer className="pointer-events-auto flex items-center gap-2 sm:gap-3 bg-surface/95 backdrop-blur-xl border border-primary/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-2xl shadow-primary/10 transition-all duration-300">
        
        {/* Botão Retornar ao Início da Linha */}
        {onScrollToTop && (
          <IconButton
            icon={<ArrowUp className="w-4 h-4" />}
            size="sm"
            variant="secondary"
            onClick={onScrollToTop}
            title="Voltar ao início da Linha do Tempo"
            aria-label="Voltar ao início da Linha do Tempo"
            className="!w-8 !h-8 sm:!w-9 sm:!h-9 border border-border/80 hover:border-primary/50 text-text-secondary hover:text-primary shrink-0"
          />
        )}

        {/* Botão Anterior (Marco anterior) */}
        <IconButton
          icon={<ChevronLeft className="w-4 h-4" />}
          size="sm"
          variant="secondary"
          onClick={() => stepYear('prev')}
          disabled={currentIndex <= 0}
          title="Marco anterior"
          aria-label="Marco anterior"
          className="!w-8 !h-8 sm:!w-9 sm:!h-9 border border-border/80 hover:border-primary/50 text-text-secondary hover:text-primary shrink-0"
        />

        {/* Tambor Central Estilo Relógio / Apple Watch */}
        <LayoutContainer className="relative flex items-center justify-center w-36 sm:w-44 h-[52px] overflow-hidden rounded-xl bg-background/80 border border-primary/30 select-none">
          {/* Gradiente Superior de Fade */}
          <LayoutContainer
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none"
          />

          {/* Lente Central de Foco / Seleção Ativa com Bordas de Relógio */}
          <LayoutContainer
            aria-hidden="true"
            className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-[38px] rounded-lg bg-primary/15 border-y border-primary/50 pointer-events-none z-0"
          />

          {/* Tambor Vertical Rolável com Snap Nativo */}
          <LayoutContainer
            ref={wheelRef}
            onScroll={handleWheelScroll}
            onPointerDown={markUserInteracting}
            onTouchStart={markUserInteracting}
            onWheel={markUserInteracting}
            className="w-full h-full overflow-y-auto no-scrollbar snap-y snap-mandatory py-1 z-1"
            style={{
              scrollSnapType: 'y mandatory',
              scrollBehavior: 'smooth',
            }}
          >
            {years.map((y, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <LayoutContainer
                  key={y}
                  onClick={() => handleItemClick(idx)}
                  className={`h-[44px] flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'scale-110 font-black text-primary text-base sm:text-lg tracking-wider'
                      : 'opacity-35 hover:opacity-75 text-text-secondary text-xs sm:text-sm font-semibold'
                  }`}
                  style={{
                    height: `${ITEM_HEIGHT}px`,
                  }}
                >
                  <Text as="span" className="flex items-center gap-1">
                    {y}
                  </Text>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>

          {/* Gradiente Inferior de Fade */}
          <LayoutContainer
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none"
          />
        </LayoutContainer>

        {/* Botão Próximo (Próximo marco) */}
        <IconButton
          icon={<ChevronRight className="w-4 h-4" />}
          size="sm"
          variant="secondary"
          onClick={() => stepYear('next')}
          disabled={currentIndex >= years.length - 1}
          title="Próximo marco"
          aria-label="Próximo marco"
          className="!w-8 !h-8 sm:!w-9 sm:!h-9 border border-border/80 hover:border-primary/50 text-text-secondary hover:text-primary shrink-0"
        />

        {/* Indicador Numérico de Posição (Ex: 5 de 9) */}
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
