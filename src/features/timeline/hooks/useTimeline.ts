'use client';

import { useState, useEffect, useCallback } from 'react';
import { timelineService, TimelineEventData } from '../services/timeline.service';
import { toast } from 'react-hot-toast';

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const loadTimeline = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await timelineService.getTimeline();
      const list = res.data || [];
      setEvents(list);
      if (list.length > 0 && activeYear === null) {
        setActiveYear(list[0].year);
      }
    } catch (err) {
      console.error('Erro ao carregar linha do tempo:', err);
      toast.error('Não foi possível carregar a história do Pelotas.');
    } finally {
      setIsLoading(false);
    }
  }, [activeYear]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Unique years for the Apple-style scroller
  const availableYears = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => a - b);

  const scrollToYear = (year: number) => {
    setActiveYear(year);
    const targetEl = document.getElementById(`timeline-year-${year}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (availableYears.length > 0) {
      setActiveYear(availableYears[0]);
    }
  };

  return {
    events,
    availableYears,
    activeYear,
    setActiveYear,
    scrollToYear,
    scrollToTop,
    isLoading,
    reload: loadTimeline,
  };
};
