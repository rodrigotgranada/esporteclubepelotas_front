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
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

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

  // Delete Actions
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

  // Toggle rápido de Destaque
  const handleToggleFeatured = async (sponsor: Sponsor) => {
    try {
      const nextFeatured = !sponsor.isFeatured;
      await adminSponsorsService.updateSponsor(sponsor.id, { isFeatured: nextFeatured });
      toast.success(ADMIN_SPONSORS_TEXTS.TOAST.TOGGLE_SUCCESS);
      loadSponsors();
    } catch (err) {
      console.error('Erro ao alternar destaque do patrocinador:', err);
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_SAVE);
    }
  };

  // Toggle rápido de Ativo
  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const nextActive = !sponsor.isActive;
      await adminSponsorsService.updateSponsor(sponsor.id, { isActive: nextActive });
      toast.success(ADMIN_SPONSORS_TEXTS.TOAST.TOGGLE_SUCCESS);
      loadSponsors();
    } catch (err) {
      console.error('Erro ao alternar status ativo do patrocinador:', err);
      toast.error(ADMIN_SPONSORS_TEXTS.TOAST.ERROR_SAVE);
    }
  };

  return {
    sponsors,
    total,
    page,
    totalPages,
    isLoading,
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
    handleToggleFeatured,
    handleToggleActive,
  };
};
