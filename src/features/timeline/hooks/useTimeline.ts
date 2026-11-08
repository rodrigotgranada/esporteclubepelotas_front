'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { timelineService, TimelineEventData, TimelineCategoryData } from '../services/timeline.service';

export const useTimeline = () => {
  const [events, setEvents] = useState<TimelineEventData[]>([]);
  const [categories, setCategories] = useState<TimelineCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [activeYear, setActiveYear] = useState<number | null>(null);

  // Estados de Filtro e Busca
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Trava de rolagem suave para impedir que o IntersectionObserver sobrescreva o ano enquanto o salto acontece
  const isNavigatingRef = useRef(false);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const loadTimeline = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const [timelineRes, categoriesRes] = await Promise.allSettled([
        timelineService.getTimeline(),
        timelineService.getCategories(),
      ]);

      const list =
        timelineRes.status === 'fulfilled' && Array.isArray(timelineRes.value?.data)
          ? timelineRes.value.data
          : [];
      setEvents(list);

      const cats =
        categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value)
          ? categoriesRes.value.filter((c) => c.isActive !== false)
          : [];
      setCategories(cats);

      if (list.length > 0) {
        setActiveYear((prev) => prev ?? list[0].year);
      } else {
        setActiveYear(null);
      }
    } catch {
      setEvents([]);
      setCategories([]);
      setActiveYear(null);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // Contagem dinâmica de eventos por categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      const catKey = event.category || (event.categoryId ? String(event.categoryId) : 'outros');
      counts[catKey] = (counts[catKey] || 0) + 1;
    });
    return counts;
  }, [events]);

  // Eventos filtrados pela categoria selecionada e termo de busca
  const filteredEvents = useMemo(() => {
    let result = events;

    // Filtro por Categoria
    if (selectedCategory) {
      result = result.filter(
        (e) =>
          e.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          e.categoryId === selectedCategory
      );
    }

    // Filtro por Busca Textual
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((e) => {
        const titleMatch = e.title?.toLowerCase().includes(query);
        const descMatch = e.description?.toLowerCase().includes(query);
        const yearMatch = String(e.year).includes(query);
        const dateMatch = e.dateFormatted?.toLowerCase().includes(query);
        const categoryMatch = e.categoryName?.toLowerCase().includes(query);
        return titleMatch || descMatch || yearMatch || dateMatch || categoryMatch;
      });
    }

    return result;
  }, [events, selectedCategory, searchQuery]);

  // Lista única ordenada de anos disponíveis calculada a partir dos eventos filtrados
  const availableYears = useMemo(() => {
    return Array.from(new Set(filteredEvents.map((e) => e.year))).sort((a, b) => a - b);
  }, [filteredEvents]);

  // Se os anos filtrados mudarem e o activeYear não pertencer mais à lista, atualiza para o primeiro
  useEffect(() => {
    if (availableYears.length > 0 && (!activeYear || !availableYears.includes(activeYear))) {
      setActiveYear(availableYears[0]);
    }
  }, [availableYears, activeYear]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
  }, []);

  const scrollToYear = useCallback((year: number) => {
    setActiveYear(year);

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
    filteredEvents,
    categories,
    categoryCounts,
    availableYears,
    activeYear,
    setActiveYear,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    clearFilters,
    scrollToYear,
    scrollToTop,
    isNavigatingRef,
    isLoading,
    hasError,
    reload: loadTimeline,
  };
};
