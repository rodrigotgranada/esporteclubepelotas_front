'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { adminTimelineService } from '../../services/admin-timeline.service';
import { TimelineEventData, TimelineCategory } from '@/features/timeline/services/timeline.service';
import { ADMIN_TIMELINE_CONSTANTS } from '../../constants/admin-timeline.constants';

export const useAdminTimelineList = () => {
  const [events, setEvents] = useState<TimelineEventData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(50);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [highlightFilter, setHighlightFilter] = useState<string>('ALL');

  // Delete modal
  const [eventToDelete, setEventToDelete] = useState<TimelineEventData | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = { page, limit };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter) params.category = categoryFilter as TimelineCategory;
      if (highlightFilter === 'HIGHLIGHTED') params.isHighlighted = true;

      const res = await adminTimelineService.getEvents(params);
      setEvents(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Erro ao carregar marcos históricos:', err);
      toast.error('Não foi possível carregar a lista de marcos históricos.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, categoryFilter, highlightFilter]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDelete = async () => {
    if (!eventToDelete) return;
    try {
      setIsDeleting(true);
      await adminTimelineService.deleteEvent(eventToDelete.id || eventToDelete._id || '');
      toast.success(ADMIN_TIMELINE_CONSTANTS.DELETE_MODAL.SUCCESS_DELETE);
      setEventToDelete(null);
      await loadEvents();
    } catch (err) {
      console.error('Erro ao inativar marco histórico:', err);
      toast.error('Erro ao inativar marco histórico.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    events,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    highlightFilter,
    setHighlightFilter,
    setPage,
    reload: loadEvents,
    eventToDelete,
    setEventToDelete,
    isDeleting,
    handleDelete,
  };
};
