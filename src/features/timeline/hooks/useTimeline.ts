'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { timelineService, TimelineEventData } from '../services/timeline.service';

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Trava de rolagem suave para impedir que o IntersectionObserver sobrescreva o ano enquanto o salto acontece
  const isNavigatingRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadTimeline = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const res = await timelineService.getTimeline();
      const list = Array.isArray(res?.data) ? res.data : [];
      setEvents(list);
      if (list.length > 0) {
        setActiveYear((prev) => prev ?? list[0].year);
      } else {
        setActiveYear(null);
      }
    } catch {
      // Trata amigavelmente sem disparar toasts invasivos na tela de visualização pública
      setEvents([]);
      setActiveYear(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Lista única ordenada de anos disponíveis para a roleta Apple
  const availableYears = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => a - b);

  const scrollToYear = useCallback((year: number) => {
    setActiveYear(year);

    // Ativa a trava temporária para evitar feedback loop com o Scroll Spy
    isNavigatingRef.current = true;
    if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 850);

    const targetEl = document.getElementById(`timeline-year-${year}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    isNavigatingRef.current = true;
    if (navigationTimeoutRef.current) clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = setTimeout(() => {
      isNavigatingRef.current = false;
    }, 850);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (availableYears.length > 0) {
      setActiveYear(availableYears[0]);
    }
  }, [availableYears]);

  return {
    events,
    availableYears,
    activeYear,
    setActiveYear,
    scrollToYear,
    scrollToTop,
    isNavigatingRef,
    isLoading,
    hasError,
    reload: loadTimeline,
  };
};
