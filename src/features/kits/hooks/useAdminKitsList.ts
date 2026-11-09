import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { ClubKit, KitType } from '../types/kits.types';
import { kitsService } from '../services/kits.service';
import { KITS_TEXTS } from '../constants/kits.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export type AdminKitTypeFilter = 'ALL' | KitType;
export type AdminKitStatusFilter = 'ALL' | 'CURRENT' | 'HISTORICAL';

export const useAdminKitsList = () => {
  const [kits, setKits] = useState<ClubKit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<AdminKitTypeFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<AdminKitStatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer de Criação/Edição
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingKit, setEditingKit] = useState<ClubKit | null>(null);

  // Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [kitToDelete, setKitToDelete] = useState<ClubKit | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchKits = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await kitsService.adminGetAll();
      setKits(data);
    } catch (err) {
      console.error('Erro ao listar mantos:', err);
      toast.error('Erro ao carregar uniformes.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKits();
  }, [fetchKits]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents('kits', () => {
    fetchKits();
  });

  // Métricas e Contagens
  const metrics = useMemo(() => {
    const total = kits.length;
    const currentCount = kits.filter((k) => k.isCurrent).length;
    const historicalCount = kits.filter((k) => !k.isCurrent).length;
    const competitionsCount = new Set(kits.map((k) => k.competition.trim().toLowerCase())).size;

    return {
      total,
      currentCount,
      historicalCount,
      competitionsCount,
    };
  }, [kits]);

  // Filtro dinâmico por busca, tipo e status
  const filteredKits = useMemo(() => {
    return kits.filter((kit) => {
      const matchesType = typeFilter === 'ALL' || kit.kitType === typeFilter;

      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'CURRENT' && kit.isCurrent) ||
        (statusFilter === 'HISTORICAL' && !kit.isCurrent);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        kit.name.toLowerCase().includes(q) ||
        kit.competition.toLowerCase().includes(q) ||
        kit.seasonYear.toString().includes(q) ||
        (kit.manufacturer && kit.manufacturer.toLowerCase().includes(q)) ||
        (kit.sponsor && kit.sponsor.toLowerCase().includes(q));

      return matchesType && matchesStatus && matchesSearch;
    });
  }, [kits, typeFilter, statusFilter, searchQuery]);

  const handleOpenNew = () => {
    setEditingKit(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (kit: ClubKit) => {
    setEditingKit(kit);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingKit(null);
  };

  const handleDeleteClick = (kit: ClubKit) => {
    setKitToDelete(kit);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setKitToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!kitToDelete) return;
    try {
      setIsDeleting(true);
      await kitsService.adminDelete(kitToDelete.id);
      toast.success('Manto excluído com sucesso!');
      handleCloseDeleteModal();
      fetchKits();
    } catch (err) {
      console.error('Erro ao excluir manto:', err);
      toast.error('Erro ao excluir manto.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    kits: filteredKits,
    totalCount: kits.length,
    metrics,
    isLoading,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    isDrawerOpen,
    editingKit,
    isDeleteModalOpen,
    kitToDelete,
    isDeleting,
    handleOpenNew,
    handleEdit,
    handleCloseDrawer,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleConfirmDelete,
    refreshKits: fetchKits,
  };
};

