'use client';

import React, { useRef, useEffect, useState } from 'react';
import { LayoutContainer, Button, Text } from '@/shared/ui/components';
import { ChevronLeft, ChevronRight, Calendar, ArrowUp } from 'lucide-react';

interface TimelineYearScrollerProps {
  years: number[];
  activeYear: number | null;
  onSelectYear: (year: number) => void;
  onScrollToTop?: () => void;
}

export const TimelineYearScroller: React.FC<TimelineYearScrollerProps> = ({
  years,
  activeYear,
  onSelectYear,
  onScrollToTop,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [years]);

  // Keep active year centered in the horizontal strip
  useEffect(() => {
    if (!activeYear || !scrollContainerRef.current) return;
    const activeBtn = scrollContainerRef.current.querySelector(
      `[data-year="${activeYear}"]`
    ) as HTMLElement | null;
    if (activeBtn) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeYear]);

  // Mouse wheel horizontal scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (!scrollContainerRef.current) return;
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      scrollContainerRef.current.scrollLeft += e.deltaY;
      checkScroll();
    }
  };

  // Drag to scroll for mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
    checkScroll();
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scrollByAmount = (offset: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    setTimeout(checkScroll, 300);
  };

  if (!years || years.length === 0) return null;

  return (
    <LayoutContainer className="sticky top-16 sm:top-20 z-30 w-full bg-background/90 backdrop-blur-md border-y border-border/80 shadow-xs transition-all duration-200">
      <LayoutContainer className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center relative py-2.5">
        {/* Left Scroll Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByAmount(-200)}
            aria-label="Rolar anos para a esquerda"
            className="absolute left-1 sm:left-2 z-20 w-8 h-8 rounded-full bg-surface/95 border border-border/80 shadow-md flex items-center justify-center text-text-primary hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Left Fade Gradient */}
        <LayoutContainer
          aria-hidden="true"
          className={`absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 px-4 sm:px-8 w-full cursor-grab active:cursor-grabbing select-none"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Scroll to Top Pill */}
          {onScrollToTop && (
            <button
              type="button"
              onClick={onScrollToTop}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-surface/60 border border-border/80 hover:border-primary/50 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
            >
              <ArrowUp className="w-3 h-3 text-primary" />
              <span>Início</span>
            </button>
          )}

          {/* Years Pills */}
          {years.map((year) => {
            const isActive = activeYear === year;
            return (
              <button
                key={year}
                data-year={year}
                type="button"
                onClick={() => onSelectYear(year)}
                className={`shrink-0 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-primary text-blue-950 shadow-md shadow-primary/25 scale-105 ring-2 ring-primary/40'
                    : 'bg-surface/70 border border-border/80 text-text-secondary hover:text-text-primary hover:border-primary/60 hover:bg-surface'
                }`}
              >
                <span>{year}</span>
              </button>
            );
          })}
        </div>

        {/* Right Fade Gradient */}
        <LayoutContainer
          aria-hidden="true"
          className={`absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Right Scroll Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByAmount(200)}
            aria-label="Rolar anos para a direita"
            className="absolute right-1 sm:right-2 z-20 w-8 h-8 rounded-full bg-surface/95 border border-border/80 shadow-md flex items-center justify-center text-text-primary hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};
