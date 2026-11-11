'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminAuditService, AuditLogItem } from '../services/admin-audit.service';

export const useAdminAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  // Details Modal
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const loadLogs = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const params: Record<string, string | number> = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (moduleFilter) params.module = moduleFilter;
      if (actionFilter) params.action = actionFilter;

      const res = await adminAuditService.getLogs(params);
      setLogs(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || Math.ceil((res.total || 0) / limit) || 1);
    } catch (err: unknown) {
      console.error('Failed to load audit logs', err);
      if (!options?.silent) {
        const apiErr = err as { response?: { data?: { message?: string } } };
        toast.error(apiErr?.response?.data?.message || 'Erro ao carregar trilha de auditoria.');
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, [page, limit, search, moduleFilter, actionFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleModuleChange = (val: string) => {
    setModuleFilter(val);
    setPage(1);
  };

  const handleActionChange = (val: string) => {
    setActionFilter(val);
    setPage(1);
  };

  const openDetails = (log: AuditLogItem) => {
    setSelectedLog(log);
    setIsDetailsModalOpen(true);
  };

  const closeDetails = () => {
    setSelectedLog(null);
    setIsDetailsModalOpen(false);
  };

  return {
    logs,
    total,
    page,
    setPage,
    totalPages,
    isLoading,
    search,
    handleSearchChange,
    moduleFilter,
    handleModuleChange,
    actionFilter,
    handleActionChange,
    selectedLog,
    isDetailsModalOpen,
    openDetails,
    closeDetails,
  };
};

