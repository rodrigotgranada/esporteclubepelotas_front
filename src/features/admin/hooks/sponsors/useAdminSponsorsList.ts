'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminSponsorsService } from '../../services/admin-sponsors.service';
import { Sponsor } from '@/features/sponsors/types/sponsors.types';
import { ADMIN_SPONSORS_TEXTS } from '../../constants/admin-sponsors.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const useAdminSponsorsList = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(25);
  const [isLoading, setIsLoading] = useState(true);
  const [isReordering, setIsReordering] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [featuredFilter, setFeaturedFilter] = useState<string>('');

  // Modal de Exclusão
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drawer de Cadastro / Edição
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedSponsorId, setSelectedSponsorId] = useState<string | null>(null);

  const loadSponsors = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;
      if (featuredFilter === 'true') params.isFeatured = true;
      if (featuredFilter === 'false') params.isFeatured = false;

      const res = await adminSponsorsService.getSponsors(params);
      setSponsors(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Erro ao carregar patrocinadores:', err);
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_LOAD);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, statusFilter, featuredFilter]);

  useEffect(() => {
    loadSponsors();
  }, [loadSponsors]);

  useRealtimeEvents('sponsors', () => {
    loadSponsors();
  });

  // Drawer Actions
  const openCreateDrawer = () => {
    setSelectedSponsorId(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (sponsor: Sponsor) => {
    setSelectedSponsorId(sponsor.id);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedSponsorId(null);
  };

  const handleDrawerSuccess = () => {
    closeDrawer();
    loadSponsors();
  };

  // Delete Actions (Soft Delete no Backend)
  const openDeleteModal = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSponsorToDelete(null);
  };

  const confirmDelete = async () => {
    if (!sponsorToDelete) return;
    try {
      setIsDeleting(true);
      await adminSponsorsService.deleteSponsor(sponsorToDelete.id);
      toast.success(ADMIN_SPONSORS_TEXTS.TOAST.DELETE_SUCCESS);
      closeDeleteModal();
      loadSponsors();
    } catch (err) {
      console.error('Erro ao excluir patrocinador:', err);
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_DELETE);
    } finally {
      setIsDeleting(false);
    }
  };

  // Reordenação de Patrocinadores (Subir / Descer com persistência atômica)
  const handleMoveUp = async (sponsor: Sponsor) => {
    const index = sponsors.findIndex((s) => s.id === sponsor.id);
    if (index <= 0 || isReordering) return;

    const previousSponsor = sponsors[index - 1];
    const newSponsors = [...sponsors];

    // Troca de posição no array
    newSponsors[index - 1] = sponsor;
    newSponsors[index] = previousSponsor;
    setSponsors(newSponsors);

    try {
      setIsReordering(true);
      await adminSponsorsService.reorderSponsors([
        { id: sponsor.id, displayOrder: index },
        { id: previousSponsor.id, displayOrder: index + 1 },
      ]);
      toast.success(ADMIN_SPONSORS_TEXTS.TOAST.REORDER_SUCCESS);
      loadSponsors();
    } catch (err) {
      console.error('Erro ao reordenar patrocinadores:', err);
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_REORDER);
      loadSponsors();
    } finally {
      setIsReordering(false);
    }
  };

  const handleMoveDown = async (sponsor: Sponsor) => {
    const index = sponsors.findIndex((s) => s.id === sponsor.id);
    if (index === -1 || index >= sponsors.length - 1 || isReordering) return;

    const nextSponsor = sponsors[index + 1];
    const newSponsors = [...sponsors];

    // Troca de posição no array
    newSponsors[index + 1] = sponsor;
    newSponsors[index] = nextSponsor;
    setSponsors(newSponsors);

    try {
      setIsReordering(true);
      await adminSponsorsService.reorderSponsors([
        { id: sponsor.id, displayOrder: index + 2 },
        { id: nextSponsor.id, displayOrder: index + 1 },
      ]);
      toast.success(ADMIN_SPONSORS_TEXTS.TOAST.REORDER_SUCCESS);
      loadSponsors();
    } catch (err) {
      console.error('Erro ao reordenar patrocinadores:', err);
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_REORDER);
      loadSponsors();
    } finally {
      setIsReordering(false);
    }
  };

  // Exportação de Relatório de Desempenho e Cliques em CSV formatado para Excel
  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      // Busca todos os patrocinadores para o relatório completo
      const res = await adminSponsorsService.getSponsors({ limit: 100 });
      const dataToExport = res.data && res.data.length > 0 ? res.data : sponsors;

      if (!dataToExport || dataToExport.length === 0) {
        toast.error('Nenhum patrocinador disponível para exportação.');
        return;
      }

      const headers = [
        'ID',
        'Nome do Patrocinador',
        'Status Contratual',
        'Destaque Ticker',
        'Início do Contrato',
        'Término do Contrato',
        'Total de Cliques Registrados',
        'URL Oficial',
        'Data de Cadastro',
      ];

      const rows = dataToExport.map((s) => [
        `"${s.id}"`,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.status}"`,
        s.isFeatured ? '"SIM"' : '"NÃO"',
        s.contractStartDate ? `"${s.contractStartDate.slice(0, 10)}"` : '"Indeterminado"',
        s.contractEndDate ? `"${s.contractEndDate.slice(0, 10)}"` : '"Indeterminado"',
        s.clicksCount ?? 0,
        `"${s.websiteUrl || ''}"`,
        s.createdAt ? `"${s.createdAt.slice(0, 10)}"` : '""',
      ]);

      const csvContent =
        '\uFEFF' +
        [headers.join(';'), ...rows.map((row) => row.join(';'))].join('\r\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const todayStr = new Date().toISOString().slice(0, 10);
      link.setAttribute('href', url);
      link.setAttribute('download', `relatorio-patrocinadores-ecpelotas-${todayStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(ADMIN_SPONSORS_TEXTS.TOAST.EXPORT_SUCCESS);
    } catch (err) {
      console.error('Erro ao exportar relatório de patrocinadores:', err);
      toast.error('Erro ao gerar relatório CSV.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    sponsors,
    total,
    page,
    totalPages,
    isLoading,
    isReordering,
    isExporting,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    featuredFilter,
    setFeaturedFilter,
    drawerOpen,
    selectedSponsorId,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleDrawerSuccess,
    deleteModalOpen,
    sponsorToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    handleMoveUp,
    handleMoveDown,
    handleExportReport,
  };
};
