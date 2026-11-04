'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { adminIdolsService } from '../../services/admin-idols.service';
import { IdolData } from '../../../idols/services/idols.service';
import { ADMIN_IDOLS_TEXTS } from '../../constants/admin-idols.constants';

export const useAdminIdolsList = () => {
  const [idols, setIdols] = useState<IdolData[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [idolToDelete, setIdolToDelete] = useState<IdolData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedIdolId, setSelectedIdolId] = useState<string | null>(null);

  const loadIdols = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: any = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (categoryFilter) params.category = categoryFilter;

      const res = await adminIdolsService.getIdols(params);
      setIdols(res.data || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Erro ao carregar ídolos:', err);
      toast.error('Erro ao carregar lista de ídolos.');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, search, categoryFilter]);

  useEffect(() => {
    loadIdols();
  }, [loadIdols]);

  // Drawer Actions
  const openCreateDrawer = () => {
    setSelectedIdolId(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = (id: string) => {
    setSelectedIdolId(id);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedIdolId(null);
  };

  const handleDrawerSuccess = () => {
    closeDrawer();
    loadIdols();
  };

  // Delete Actions
  const openDeleteModal = (idol: IdolData) => {
    setIdolToDelete(idol);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setIdolToDelete(null);
  };

  const confirmDelete = async () => {
    if (!idolToDelete) return;
    const id = idolToDelete._id || idolToDelete.id;
    if (!id) return;

    try {
      setIsDeleting(true);
      await adminIdolsService.deleteIdol(id);
      toast.success(ADMIN_IDOLS_TEXTS.TOAST.SUCCESS_DELETE);
      closeDeleteModal();
      loadIdols();
    } catch (err) {
      console.error('Erro ao excluir ídolo:', err);
      toast.error('Erro ao excluir ídolo.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle Featured Quick Action
  const handleToggleFeatured = async (idol: IdolData) => {
    const id = idol._id || idol.id;
    if (!id) return;

    try {
      const updated = await adminIdolsService.updateIdol(id, {
        isFeatured: !idol.isFeatured,
      });
      setIdols((prev) =>
        prev.map((item) => ((item._id || item.id) === id ? { ...item, isFeatured: updated.isFeatured } : item)),
      );
      toast.success(`Destaque ${updated.isFeatured ? 'ativado' : 'desativado'}.`);
    } catch (err) {
      console.error('Erro ao alterar destaque:', err);
      toast.error('Erro ao alterar destaque do ídolo.');
    }
  };

  return {
    idols,
    total,
    page,
    totalPages,
    isLoading,
    setPage,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    // Drawer
    drawerOpen,
    selectedIdolId,
    openCreateDrawer,
    openEditDrawer,
    closeDrawer,
    handleDrawerSuccess,
    // Delete
    deleteModalOpen,
    idolToDelete,
    isDeleting,
    openDeleteModal,
    closeDeleteModal,
    confirmDelete,
    handleToggleFeatured,
    reload: loadIdols,
  };
};
