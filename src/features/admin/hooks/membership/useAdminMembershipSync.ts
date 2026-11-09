'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { membershipService } from '@/features/membership/services/membership.service';
import {
  EleventicketsSummary,
  EleventicketsMember,
  EleventicketsImportSummary,
} from '@/features/membership/types/membership.types';
import { MEMBERSHIP_TEXTS } from '@/features/membership/constants/membership.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAdminMembershipSync = () => {
  const [summary, setSummary] = useState<EleventicketsSummary | null>(null);
  const [members, setMembers] = useState<EleventicketsMember[]>([]);
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  // Filtros & Paginação
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMembers, setTotalMembers] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [syncModeFilter, setSyncModeFilter] = useState('ALL');

  // Upload CSV
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<EleventicketsImportSummary | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadSummary = useCallback(async () => {
    try {
      setIsLoadingSummary(true);
      const data = await membershipService.getEleventicketsSummary();
      setSummary(data);
    } catch (err: unknown) {
      console.error('Erro ao carregar métricas de sócios:', err);
    } finally {
      setIsLoadingSummary(false);
    }
  }, []);

  const loadMembers = useCallback(async () => {
    try {
      setIsLoadingMembers(true);
      const isSocioParam =
        statusFilter === 'ACTIVE'
          ? true
          : statusFilter === 'INACTIVE'
          ? false
          : undefined;

      const data = await membershipService.getEleventicketsMembers({
        search: search.trim() || undefined,
        isSocio: isSocioParam,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        syncMode: syncModeFilter !== 'ALL' ? syncModeFilter : undefined,
        page,
        limit: 15,
      });

      setMembers(data.content || []);
      setTotalPages(data.totalPages || 1);
      setTotalMembers(data.totalElements || 0);
    } catch (err: unknown) {
      console.error('Erro ao listar sócios:', err);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [search, statusFilter, syncModeFilter, page]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Sincronização em Tempo Real via WebSocket
  useRealtimeEvents(['membership_sync', 'users'], () => {
    loadSummary();
    loadMembers();
  });

  const handleSelectFile = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleTriggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImportCsv = async () => {
    if (!selectedFile) {
      toast.error('Selecione um arquivo CSV para importar.');
      return;
    }

    try {
      setIsImporting(true);
      const result = await membershipService.importEleventicketsCsv(selectedFile);
      setImportResult(result);
      setIsResultModalOpen(true);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success(MEMBERSHIP_TEXTS.TOAST_IMPORT_SUCCESS);
      await Promise.all([loadSummary(), loadMembers()]);
    } catch (err: unknown) {
      console.error('Erro ao importar CSV:', err);
      const msg = err instanceof Error ? err.message : MEMBERSHIP_TEXTS.TOAST_GENERIC_ERROR;
      toast.error(msg);
    } finally {
      setIsImporting(false);
    }
  };

  const handleReleaseOverride = async (userId: string) => {
    try {
      await membershipService.releaseMemberOverride(userId);
      toast.success(MEMBERSHIP_TEXTS.TOAST_RELEASE_SUCCESS);
      await Promise.all([loadSummary(), loadMembers()]);
    } catch (err: unknown) {
      console.error('Erro ao restaurar modo automático:', err);
      toast.error(MEMBERSHIP_TEXTS.TOAST_GENERIC_ERROR);
    }
  };

  const handleCloseResultModal = () => {
    setIsResultModalOpen(false);
    setImportResult(null);
  };

  return {
    summary,
    members,
    isLoadingSummary,
    isLoadingMembers,
    page,
    setPage,
    totalPages,
    totalMembers,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    syncModeFilter,
    setSyncModeFilter,
    selectedFile,
    handleSelectFile,
    fileInputRef,
    handleTriggerFileInput,
    isImporting,
    importResult,
    isResultModalOpen,
    handleImportCsv,
    handleReleaseOverride,
    handleCloseResultModal,
    refetch: () => {
      loadSummary();
      loadMembers();
    },
  };
};

