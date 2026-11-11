'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Table,
  Badge,
  IconButton,
  ConfirmModal,
  Spinner,
} from '@/shared/ui/components';
import { Download, Trash2, Mail, Users } from 'lucide-react';
import { NEWSLETTER_TEXTS } from '@/features/newsletter/constants/newsletter.constants';
import { useAdminNewsletter } from '@/features/admin/hooks/useAdminNewsletter';

export function AdminNewsletterPage() {
  const {
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
  } = useAdminNewsletter();

  return (
    <LayoutContainer className="flex flex-col gap-6 p-6">
      {/* Cabeçalho */}
      <LayoutContainer className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <LayoutContainer>
          <Title level="h2" className="text-2xl font-bold text-white mb-1">
            {NEWSLETTER_TEXTS.ADMIN.PAGE_TITLE}
          </Title>
          <Text className="text-sm text-gray-400">
            {NEWSLETTER_TEXTS.ADMIN.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          <Button
            onClick={handleExportCsv}
            disabled={isExporting || subscribers.length === 0}
            variant="outline"
            className="flex items-center gap-2 border-amber-400/40 text-amber-400 hover:bg-amber-400/10 font-bold"
          >
            {isExporting ? <Spinner size={16} /> : <Download size={16} />}
            <Text as="span">{NEWSLETTER_TEXTS.ADMIN.EXPORT_CSV}</Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Card de Métricas */}
      <LayoutContainer className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#0B1B3D]/40 p-4 max-w-xs">
        <LayoutContainer className="p-3 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
          <Users size={24} />
        </LayoutContainer>
        <LayoutContainer>
          <Text className="text-xs text-gray-400">{NEWSLETTER_TEXTS.ADMIN.TOTAL_SUBSCRIBERS}</Text>
          <Title level="h3" className="text-2xl font-black text-white">
            {totalElements}
          </Title>
        </LayoutContainer>
      </LayoutContainer>

      {/* Tabela */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size={32} className="text-amber-400" />
          <Text className="text-sm text-gray-400">Carregando inscritos...</Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="rounded-xl border border-gray-800 bg-[#0B1B3D]/30 overflow-hidden">
          <Table>
            <thead>
              <tr className="border-b border-gray-800 bg-[#071126]/60 text-left text-xs uppercase text-gray-400">
                <th className="p-4">{NEWSLETTER_TEXTS.ADMIN.TABLE_EMAIL}</th>
                <th className="p-4">{NEWSLETTER_TEXTS.ADMIN.TABLE_NAME}</th>
                <th className="p-4">{NEWSLETTER_TEXTS.ADMIN.TABLE_DATE}</th>
                <th className="p-4">{NEWSLETTER_TEXTS.ADMIN.TABLE_STATUS}</th>
                <th className="p-4 text-right">{NEWSLETTER_TEXTS.ADMIN.TABLE_ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    {NEWSLETTER_TEXTS.ADMIN.EMPTY_STATE}
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 text-sm">
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      <Mail size={16} className="text-amber-400 flex-shrink-0" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="p-4 text-gray-300">{sub.name || '-'}</td>
                    <td className="p-4 text-gray-400 text-xs">
                      {new Date(sub.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                      {sub.active ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                          {NEWSLETTER_TEXTS.ADMIN.STATUS_ACTIVE}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
                          {NEWSLETTER_TEXTS.ADMIN.STATUS_INACTIVE}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <IconButton
                        icon={<Trash2 size={16} />}
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteTarget(sub)}
                        aria-label="Remover"
                        className="text-gray-400 hover:text-orange-500"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Paginação */}
          {totalPages > 1 && (
            <LayoutContainer className="flex items-center justify-between p-4 border-t border-gray-800 bg-[#071126]/30">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
              >
                Anterior
              </Button>
              <Text className="text-xs text-gray-400">
                Página {page} de {totalPages}
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
              >
                Próxima
              </Button>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}

      {/* Confirmação de exclusão */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remover Inscrito"
        description={`Deseja remover o e-mail "${deleteTarget?.email}" da newsletter oficial?`}
        confirmText="Remover"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </LayoutContainer>
  );
}

