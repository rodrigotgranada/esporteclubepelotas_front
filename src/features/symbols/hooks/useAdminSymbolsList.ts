import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { ClubSymbol, SymbolCategory } from '../types/symbols.types';
import { symbolsService } from '../services/symbols.service';
import { SYMBOLS_TEXTS } from '../constants/symbols.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export type AdminCategoryFilter = 'ALL' | SymbolCategory;

export const useAdminSymbolsList = () => {
  const [symbols, setSymbols] = useState<ClubSymbol[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<AdminCategoryFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer de Criação/Edição
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSymbol, setEditingSymbol] = useState<ClubSymbol | null>(null);

  // Modal de Exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [symbolToDelete, setSymbolToDelete] = useState<ClubSymbol | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSymbols = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await symbolsService.adminGetAll();
      setSymbols(data);
    } catch (err) {
      console.error('Erro ao listar símbolos:', err);
      toast.error(SYMBOLS_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSymbols();
  }, [fetchSymbols]);

  // Sincronização em tempo real via WebSocket
  useRealtimeEvents('symbols', () => {
    fetchSymbols();
  });

  // Contagem por categoria
  const counts = useMemo(() => {
    return {
      ALL: symbols.length,
      MASCOT: symbols.filter((s) => s.category === 'MASCOT').length,
      SHIELD: symbols.filter((s) => s.category === 'SHIELD').length,
      FLAG: symbols.filter((s) => s.category === 'FLAG').length,
      COLORS: symbols.filter((s) => s.category === 'COLORS').length,
    };
  }, [symbols]);

  // Lista filtrada por busca e categoria
  const filteredSymbols = useMemo(() => {
    return symbols.filter((item) => {
      const matchesCategory =
        categoryFilter === 'ALL' || item.category === categoryFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.yearStart && item.yearStart.toString().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [symbols, categoryFilter, searchQuery]);

  const handleOpenNew = () => {
    setEditingSymbol(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (symbol: ClubSymbol) => {
    setEditingSymbol(symbol);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingSymbol(null);
  };

  const handleDeleteClick = (symbol: ClubSymbol) => {
    setSymbolToDelete(symbol);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSymbolToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!symbolToDelete) return;
    setIsDeleting(true);
    try {
      await symbolsService.adminDelete(symbolToDelete.id);
      toast.success(SYMBOLS_TEXTS.TOAST_DELETE_SUCCESS);
      handleCloseDeleteModal();
      fetchSymbols();
    } catch (err) {
      console.error('Erro ao excluir símbolo:', err);
      toast.error(SYMBOLS_TEXTS.TOAST_GENERIC_ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSetOfficial = async (id: string) => {
    try {
      await symbolsService.adminSetOfficial(id);
      toast.success(SYMBOLS_TEXTS.TOAST_SET_OFFICIAL_SUCCESS);
      fetchSymbols();
    } catch (err) {
      console.error('Erro ao definir símbolo como oficial:', err);
      toast.error(SYMBOLS_TEXTS.TOAST_GENERIC_ERROR);
    }
  };

  return {
    symbols: filteredSymbols,
    totalCount: symbols.length,
    counts,
    isLoading,
    categoryFilter,
    setCategoryFilter,
    searchQuery,
    setSearchQuery,
    isDrawerOpen,
    editingSymbol,
    isDeleteModalOpen,
    symbolToDelete,
    isDeleting,
    handleOpenNew,
    handleEdit,
    handleCloseDrawer,
    handleDeleteClick,
    handleCloseDeleteModal,
    handleConfirmDelete,
    handleSetOfficial,
    refreshSymbols: fetchSymbols,
  };
};

