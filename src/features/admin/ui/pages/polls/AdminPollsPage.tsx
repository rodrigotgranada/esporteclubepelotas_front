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
import { Plus, Edit2, Trash2, Power, Crown, Vote } from 'lucide-react';
import { POLL_TEXTS } from '@/features/poll/constants/poll.constants';
import { useAdminPolls } from '@/features/admin/hooks/useAdminPolls';
import { AdminPollDrawer } from './AdminPollDrawer';

export function AdminPollsPage() {
  const {
    polls,
    isLoading,
    isDrawerOpen,
    editingPoll,
    handleOpenDrawer,
    handleCloseDrawer,
    handleToggleActive,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfirmDelete,
    refetch,
  } = useAdminPolls();

  return (
    <LayoutContainer className="flex flex-col gap-6 p-6">
      {/* Cabeçalho */}
      <LayoutContainer className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <LayoutContainer>
          <Title level="h2" className="text-2xl font-bold text-white mb-1">
            {POLL_TEXTS.ADMIN.PAGE_TITLE}
          </Title>
          <Text className="text-sm text-gray-400">
            {POLL_TEXTS.ADMIN.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          <Button
            onClick={() => handleOpenDrawer()}
            className="flex items-center gap-2 bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300"
          >
            <Plus size={16} />
            <Text as="span">{POLL_TEXTS.ADMIN.NEW_POLL_BUTTON}</Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Conteúdo */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size={32} className="text-amber-400" />
          <Text className="text-sm text-gray-400">Carregando enquetes...</Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="rounded-xl border border-gray-800 bg-[#0B1B3D]/30 overflow-hidden">
          <Table>
            <thead>
              <tr className="border-b border-gray-800 bg-[#071126]/60 text-left text-xs uppercase text-gray-400">
                <th className="p-4">{POLL_TEXTS.ADMIN.TABLE_TITLE}</th>
                <th className="p-4">{POLL_TEXTS.ADMIN.TABLE_AUDIENCE}</th>
                <th className="p-4">{POLL_TEXTS.ADMIN.TABLE_TOTAL_VOTES}</th>
                <th className="p-4">{POLL_TEXTS.ADMIN.TABLE_STATUS}</th>
                <th className="p-4 text-right">{POLL_TEXTS.ADMIN.TABLE_ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {polls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Nenhuma enquete cadastrada até o momento.
                  </td>
                </tr>
              ) : (
                polls.map((p) => (
                  <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 text-sm">
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      <Vote size={16} className="text-amber-400 flex-shrink-0" />
                      <span>{p.title}</span>
                    </td>
                    <td className="p-4">
                      {p.onlyMembers ? (
                        <Badge className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs flex items-center gap-1 w-fit">
                          <Crown size={12} />
                          {POLL_TEXTS.ADMIN.AUDIENCE_MEMBERS}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-800 text-gray-300 text-xs w-fit">
                          {POLL_TEXTS.ADMIN.AUDIENCE_PUBLIC}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-amber-400 font-bold">
                      {p.totalVotes} votos
                    </td>
                    <td className="p-4">
                      {p.active ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                          {POLL_TEXTS.ADMIN.STATUS_ACTIVE}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
                          {POLL_TEXTS.ADMIN.STATUS_CLOSED}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <LayoutContainer className="inline-flex items-center gap-2">
                        <IconButton
                          icon={<Power size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(p.id)}
                          aria-label={p.active ? 'Encerrar Enquete' : 'Ativar Enquete'}
                          title={p.active ? 'Encerrar Enquete' : 'Ativar Enquete'}
                          className={`text-gray-400 hover:text-white ${p.active ? 'hover:text-amber-400' : 'hover:text-emerald-400'}`}
                        />
                        <IconButton
                          icon={<Edit2 size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDrawer(p)}
                          aria-label="Editar"
                          className="text-gray-400 hover:text-white"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(p)}
                          aria-label="Excluir"
                          className="text-gray-400 hover:text-orange-500"
                        />
                      </LayoutContainer>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </LayoutContainer>
      )}

      {/* Drawer */}
      <AdminPollDrawer
        poll={editingPoll}
        isOpen={isDrawerOpen}
        onSuccess={refetch}
        onClose={handleCloseDrawer}
      />

      {/* Modal de Exclusão */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Excluir Enquete"
        description={`Tem certeza que deseja excluir a enquete "${deleteTarget?.title}"? Todos os votos registrados serão apagados permanentemente.`}
        confirmText="Excluir Enquete"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </LayoutContainer>
  );
}

