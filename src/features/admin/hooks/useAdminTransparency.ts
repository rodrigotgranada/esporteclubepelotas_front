'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { transparencyService } from '@/features/transparency/services/transparency.service';
import { TransparencyDocument, TransparencyBoardMember } from '@/features/transparency/types/transparency.types';
import { TRANSPARENCY_TEXTS } from '@/features/transparency/constants/transparency.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export function useAdminTransparency() {
  const [activeTab, setActiveTab] = useState<'DOCUMENTS' | 'MEMBERS'>('DOCUMENTS');
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [members, setMembers] = useState<TransparencyBoardMember[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados dos Drawers
  const [isDocDrawerOpen, setIsDocDrawerOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<TransparencyDocument | null>(null);

  const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TransparencyBoardMember | null>(null);

  // Estados do Modal de Exclusão
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'DOC' | 'MEMBER'; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [docs, mbrs] = await Promise.all([
        transparencyService.getAdminDocuments(),
        transparencyService.getAdminBoardMembers(),
      ]);
      setDocuments(docs || []);
      setMembers(mbrs || []);
    } catch (err) {
      console.error('Erro ao buscar dados de transparência no admin:', err);
      toast.error('Erro ao carregar dados do painel.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useRealtimeEvents('transparency', () => {
    fetchData();
  });

  const handleOpenDocDrawer = (doc?: TransparencyDocument) => {
    setEditingDoc(doc || null);
    setIsDocDrawerOpen(true);
  };

  const handleCloseDocDrawer = () => {
    setIsDocDrawerOpen(false);
    setEditingDoc(null);
  };

  const handleOpenMemberDrawer = (member?: TransparencyBoardMember) => {
    setEditingMember(member || null);
    setIsMemberDrawerOpen(true);
  };

  const handleCloseMemberDrawer = () => {
    setIsMemberDrawerOpen(false);
    setEditingMember(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === 'DOC') {
        await transparencyService.deleteDocument(deleteTarget.id);
        toast.success(TRANSPARENCY_TEXTS.ADMIN.DELETE_SUCCESS);
      } else {
        await transparencyService.deleteBoardMember(deleteTarget.id);
        toast.success(TRANSPARENCY_TEXTS.ADMIN.MEMBER_DELETE_SUCCESS);
      }
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      console.error('Erro ao excluir item:', err);
      toast.error('Falha ao excluir registro.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    documents,
    members,
    isLoading,
    isDocDrawerOpen,
    editingDoc,
    handleOpenDocDrawer,
    handleCloseDocDrawer,
    isMemberDrawerOpen,
    editingMember,
    handleOpenMemberDrawer,
    handleCloseMemberDrawer,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
    refetch: fetchData,
  };
}

