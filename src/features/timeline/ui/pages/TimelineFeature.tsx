'use client';

import React, { useEffect, useRef } from 'react';
import { LayoutContainer, Title, Text, Spinner, Button, MembershipCtaCard } from '@/shared/ui/components';
import { useTimeline } from '../../hooks/useTimeline';
import { TimelineHero } from '../components/TimelineHero';
import { TimelineCard } from '../components/TimelineCard';
import { AppleYearWheelPicker } from '../components/AppleYearWheelPicker';
import { TIMELINE_CONSTANTS } from '../../constants/timeline.constants';
import { Shield, RotateCcw } from 'lucide-react';

export const TimelineFeature: React.FC = () => {
  const {
    events,
    availableYears,
    activeYear,
    setActiveYear,
    scrollToYear,
    scrollToTop,
    isNavigatingRef,
    isLoading,
    hasError,
    reload,
  } = useTimeline();

  const timelineContainerRef = useRef<HTMLElement>(null);

  // Scroll Spy: Detecta qual marco histórico está atualmente em foco na tela
  useEffect(() => {
    if (availableYears.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Se estiver ocorrendo um salto acionado pelo usuário (botão ou roleta), ignora marcos intermediários
      if (isNavigatingRef.current) return;

      let bestEntry: IntersectionObserverEntry | null = null;
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        }
      }

      if (bestEntry) {
        const yearAttr = bestEntry.target.getAttribute('data-year');
        if (yearAttr) {
          const y = Number(yearAttr);
          if (!isNaN(y)) {
            setActiveYear(y);
          }
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0.1, 0.3, 0.5],
    });

    const milestoneEls = document.querySelectorAll('.timeline-milestone-item');
    milestoneEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [availableYears, events, setActiveYear, isNavigatingRef]);

  const handleScrollToTimeline = () => {
    if (availableYears.length > 0) {
      scrollToYear(availableYears[0]);
    } else if (timelineContainerRef.current) {
      timelineContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <LayoutContainer className="min-h-[70vh] flex flex-col items-center justify-center p-8">
        <Spinner text={TIMELINE_CONSTANTS.LOADING_TEXT} />
      </LayoutContainer>
    );
  }

  // Set para rastrear o primeiro evento de cada ano e atribuir âncora de salto única
  const seenYears = new Set<number>();

  return (
    <LayoutContainer className="min-h-screen pb-24">
      {/* Hero Header */}
      <TimelineHero
        totalMilestones={events.length}
        onScrollToTimeline={handleScrollToTimeline}
      />

      {/* Sticky Apple Watch Wheel Picker (apenas se houver anos disponíveis) */}
      {availableYears.length > 0 && (
        <AppleYearWheelPicker
          years={availableYears}
          activeYear={activeYear}
          onSelectYear={scrollToYear}
          onScrollToTop={scrollToTop}
        />
      )}

      {/* Main Timeline Section */}
      <LayoutContainer
        ref={timelineContainerRef}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 relative"
      >
        {events.length === 0 ? (
          <LayoutContainer className="text-center py-16 sm:py-20 p-8 rounded-3xl bg-surface/90 border border-border shadow-xs max-w-xl mx-auto flex flex-col items-center">
            <LayoutContainer className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary">
              <Shield className="w-8 h-8" />
            </LayoutContainer>
            <Title level="h3" className="text-xl font-bold text-text-primary mb-2">
              {hasError ? TIMELINE_CONSTANTS.ERROR_TITLE : TIMELINE_CONSTANTS.EMPTY_TITLE}
            </Title>
            <Text className="text-text-secondary max-w-md mx-auto text-sm leading-relaxed mb-6">
              {hasError ? TIMELINE_CONSTANTS.ERROR_DESC : TIMELINE_CONSTANTS.EMPTY_DESC}
            </Text>
            {hasError && (
              <Button
                variant="primary"
                size="sm"
                onClick={reload}
                leftIcon={<RotateCcw className="w-4 h-4" />}
                className="font-bold text-blue-950 px-5 py-2.5 shadow-sm hover:scale-105 transition-all cursor-pointer"
              >
                {TIMELINE_CONSTANTS.BTN_RETRY}
              </Button>
            )}
          </LayoutContainer>
        ) : (
          <LayoutContainer className="relative">
            {/* The Vertical Spine Line */}
            {/* Mobile: linha fixada à esquerda em left-6 (24px) */}
            {/* Desktop (lg): linha centralizada exatamente no meio em left-1/2 */}
            <LayoutContainer
              aria-hidden="true"
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary/10 rounded-full left-6 lg:left-1/2 -translate-x-1/2 pointer-events-none"
            />

            {/* Lista Contínua de Marcos Históricos */}
            <LayoutContainer className="flex flex-col gap-10 sm:gap-14">
              {events.map((event, index) => {
                const isEven = index % 2 === 0;
                const isFirstOfYear = !seenYears.has(event.year);
                if (isFirstOfYear) {
                  seenYears.add(event.year);
                }

                return (
                  <LayoutContainer
                    key={event.id || event._id || index}
                    id={isFirstOfYear ? `timeline-year-${event.year}` : undefined}
                    data-year={event.year}
                    className="timeline-milestone-item relative flex items-center w-full scroll-mt-32 sm:scroll-mt-36"
                  >
                    {/* Marcador de Ano sobre a Linha do Tempo */}
                    {/* Mobile: posicionado em left-6 */}
                    {/* Desktop (lg): posicionado em left-1/2 */}
                    <LayoutContainer
                      role="button"
                      tabIndex={0}
                      onClick={() => scrollToYear(event.year)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          scrollToYear(event.year);
                        }
                      }}
                      title={`Ir para o ano ${event.year}`}
                      className={`absolute z-20 flex items-center justify-center rounded-full font-black text-xs sm:text-sm tracking-wider shadow-lg transition-transform hover:scale-110 cursor-pointer left-6 lg:left-1/2 -translate-x-1/2 select-none ${
                        event.isHighlighted
                          ? 'w-12 h-12 sm:w-14 sm:h-14 bg-primary text-blue-950 ring-4 ring-primary/30 font-black'
                          : activeYear === event.year
                          ? 'w-11 h-11 sm:w-13 sm:h-13 bg-primary text-blue-950 ring-4 ring-primary/40 font-black'
                          : 'w-10 h-10 sm:w-12 sm:h-12 bg-surface border-2 border-primary text-primary ring-2 ring-primary/20'
                      }`}
                    >
                      <Text as="span">{event.year}</Text>
                    </LayoutContainer>

                    {/* Container do Card de Conteúdo */}
                    {/* Mobile: recuo para a direita (pl-14 sm:pl-16) ocupando largura cheia */}
                    {/* Desktop (lg): ocupa metade da largura alternando esquerda ou direita */}
                    <LayoutContainer
                      className={`w-full pl-14 sm:pl-16 lg:pl-0 lg:w-[calc(50%-2.5rem)] ${
                        isEven ? 'lg:mr-auto' : 'lg:ml-auto'
                      }`}
                    >
                      <TimelineCard event={event} isEven={isEven} />
                    </LayoutContainer>
                  </LayoutContainer>
                );
              })}
            </LayoutContainer>

            {/* Timeline End Marker */}
            <LayoutContainer className="relative flex items-center justify-center mt-14 sm:mt-18">
              <LayoutContainer className="absolute left-6 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-surface shadow-md z-10" />
            </LayoutContainer>
          </LayoutContainer>
        )}

        {/* Footer Membership CTA (Oculta automaticamente caso o usuário autenticado já seja Sócio) */}
        <MembershipCtaCard
          title={TIMELINE_CONSTANTS.CTA_TITLE}
          description={TIMELINE_CONSTANTS.CTA_DESC}
          buttonText={TIMELINE_CONSTANTS.BTN_JOIN_CLUB}
          className="mt-20 max-w-4xl mx-auto"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
