'use client';

import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { newsletterService } from '@/features/newsletter/services/newsletter.service';
import { NewsletterSubscriber } from '@/features/newsletter/types/newsletter.types';
import { NEWSLETTER_TEXTS } from '@/features/newsletter/constants/newsletter.constants';

export function useAdminNewsletter() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await newsletterService.getAdminSubscribers(page, 20);
      setSubscribers(data.content || []);
      setTotalElements(data.totalElements || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Erro ao buscar inscritos:', err);
      toast.error('Erro ao carregar lista de inscritos.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      await newsletterService.deleteSubscriber(deleteTarget.id);
      toast.success(NEWSLETTER_TEXTS.ADMIN.DELETE_SUCCESS);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      console.error('Erro ao excluir inscrito:', err);
      toast.error('Falha ao remover inscrito.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      const all = await newsletterService.getAllSubscribersForExport();
      if (!all || all.length === 0) {
        toast.error('Nenhum inscrito disponível para exportação.');
        return;
      }

      const headers = ['Email', 'Nome', 'Status', 'Data de Inscrição'];
      const rows = all.map((s) => [
        `"${s.email}"`,
        `"${s.name || ''}"`,
        s.active ? 'Ativo' : 'Inativo',
        `"${new Date(s.createdAt).toLocaleString('pt-BR')}"`,
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter_ecpelotas_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Lista exportada com sucesso!');
    } catch (err) {
      console.error('Erro ao exportar CSV:', err);
      toast.error('Falha ao exportar lista.');
    } finally {
      setIsExporting(false);
    }
  };

  return {
    subscribers,
    totalElements,
    totalPages,
    page,
    setPage,
    isLoading,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    isExporting,
    handleConfirmDelete,
    handleExportCsv,
    refetch: fetchData,
  };
}

