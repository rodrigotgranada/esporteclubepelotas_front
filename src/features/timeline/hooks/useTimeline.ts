'use client';

import { useState, useEffect, useCallback } from 'react';
import { timelineService, TimelineEventData } from '../services/timeline.service';
import { toast } from 'react-hot-toast';

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const loadTimeline = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await timelineService.getTimeline();
      setEvents(res.data || []);
    } catch (err) {
      console.error('Erro ao carregar linha do tempo:', err);
      toast.error('Não foi possível carregar a história do Pelotas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Unique years for quick jump / navigation bar
  const availableYears = Array.from(new Set(events.map((e) => e.year))).sort((a, b) => a - b);

  const filteredEvents = selectedYear
    ? events.filter((e) => e.year === selectedYear)
    : events;

  return {
    events: filteredEvents,
    allEvents: events,
    availableYears,
    selectedYear,
    setSelectedYear,
    isLoading,
    reload: loadTimeline,
  };
};
