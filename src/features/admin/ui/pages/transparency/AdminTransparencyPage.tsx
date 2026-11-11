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
  SafeImage,
} from '@/shared/ui/components';
import { Plus, Edit2, Trash2, Download, FileText, User } from 'lucide-react';
import { TRANSPARENCY_TEXTS } from '@/features/transparency/constants/transparency.constants';
import { useAdminTransparency } from '@/features/admin/hooks/useAdminTransparency';
import { AdminTransparencyDocumentDrawer } from './AdminTransparencyDocumentDrawer';
import { AdminTransparencyMemberDrawer } from './AdminTransparencyMemberDrawer';

export function AdminTransparencyPage() {
  const {
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
    refetch,
  } = useAdminTransparency();

  return (
    <LayoutContainer className="flex flex-col gap-6 p-6">
      {/* Cabeçalho */}
      <LayoutContainer className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6">
        <LayoutContainer>
          <Title level="h2" className="text-2xl font-bold text-white mb-1">
            {TRANSPARENCY_TEXTS.ADMIN.PAGE_TITLE}
          </Title>
          <Text className="text-sm text-gray-400">
            {TRANSPARENCY_TEXTS.ADMIN.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          {activeTab === 'DOCUMENTS' ? (
            <Button
              onClick={() => handleOpenDocDrawer()}
              className="flex items-center gap-2 bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300"
            >
              <Plus size={16} />
              <Text as="span">{TRANSPARENCY_TEXTS.ADMIN.NEW_DOC_BUTTON}</Text>
            </Button>
          ) : (
            <Button
              onClick={() => handleOpenMemberDrawer()}
              className="flex items-center gap-2 bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300"
            >
              <Plus size={16} />
              <Text as="span">{TRANSPARENCY_TEXTS.ADMIN.NEW_MEMBER_BUTTON}</Text>
            </Button>
          )}
        </LayoutContainer>
      </LayoutContainer>

      {/* Abas */}
      <LayoutContainer className="flex gap-2 border-b border-gray-800 pb-2">
        <Button
          variant={activeTab === 'DOCUMENTS' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('DOCUMENTS')}
          className={
            activeTab === 'DOCUMENTS'
              ? 'bg-amber-400 text-[#0B1B3D] font-bold'
              : 'text-gray-400 hover:text-white'
          }
        >
          {TRANSPARENCY_TEXTS.ADMIN.TAB_DOCS} ({documents.length})
        </Button>
        <Button
          variant={activeTab === 'MEMBERS' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('MEMBERS')}
          className={
            activeTab === 'MEMBERS'
              ? 'bg-amber-400 text-[#0B1B3D] font-bold'
              : 'text-gray-400 hover:text-white'
          }
        >
          {TRANSPARENCY_TEXTS.ADMIN.TAB_BOARD} ({members.length})
        </Button>
      </LayoutContainer>

      {/* Conteúdo */}
      {isLoading ? (
        <LayoutContainer className="flex flex-col items-center justify-center py-20 gap-3">
          <Spinner size={32} className="text-amber-400" />
          <Text className="text-sm text-gray-400">Carregando registros...</Text>
        </LayoutContainer>
      ) : activeTab === 'DOCUMENTS' ? (
        <LayoutContainer className="rounded-xl border border-gray-800 bg-[#0B1B3D]/30 overflow-hidden">
          <Table>
            <thead>
              <tr className="border-b border-gray-800 bg-[#071126]/60 text-left text-xs uppercase text-gray-400">
                <th className="p-4">{TRANSPARENCY_TEXTS.ADMIN.TABLE_TITLE}</th>
                <th className="p-4">{TRANSPARENCY_TEXTS.ADMIN.TABLE_CATEGORY}</th>
                <th className="p-4">{TRANSPARENCY_TEXTS.ADMIN.TABLE_YEAR}</th>
                <th className="p-4">{TRANSPARENCY_TEXTS.ADMIN.TABLE_STATUS}</th>
                <th className="p-4 text-right">{TRANSPARENCY_TEXTS.ADMIN.TABLE_ACTIONS}</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Nenhum documento cadastrado.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 text-sm">
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      <FileText size={16} className="text-amber-400 flex-shrink-0" />
                      <span>{doc.title}</span>
                    </td>
                    <td className="p-4 text-gray-300">
                      <Badge className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs">
                        {doc.category}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300 font-bold">{doc.year}</td>
                    <td className="p-4">
                      {doc.published ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
                          {TRANSPARENCY_TEXTS.ADMIN.STATUS_PUBLISHED}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
                          {TRANSPARENCY_TEXTS.ADMIN.STATUS_DRAFT}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <LayoutContainer className="inline-flex items-center gap-2">
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                          <IconButton
                            icon={<Download size={16} />}
                            variant="ghost"
                            size="sm"
                            aria-label="Download"
                            className="text-gray-400 hover:text-amber-400"
                          />
                        </a>
                        <IconButton
                          icon={<Edit2 size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDocDrawer(doc)}
                          aria-label="Editar"
                          className="text-gray-400 hover:text-white"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget({ type: 'DOC', id: doc.id, name: doc.title })}
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
      ) : (
        <LayoutContainer className="rounded-xl border border-gray-800 bg-[#0B1B3D]/30 overflow-hidden">
          <Table>
            <thead>
              <tr className="border-b border-gray-800 bg-[#071126]/60 text-left text-xs uppercase text-gray-400">
                <th className="p-4">Membro</th>
                <th className="p-4">Cargo / Função</th>
                <th className="p-4">Conselho</th>
                <th className="p-4">Mandato</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Nenhum membro cadastrado.
                  </td>
                </tr>
              ) : (
                members.map((m) => (
                  <tr key={m.id} className="border-b border-gray-800/50 hover:bg-gray-800/20 text-sm">
                    <td className="p-4 font-medium text-white flex items-center gap-3">
                      <LayoutContainer className="h-9 w-9 rounded-full overflow-hidden bg-[#071126] border border-amber-400/30 flex items-center justify-center flex-shrink-0">
                        {m.photoUrl ? (
                          <SafeImage src={m.photoUrl} alt={m.name} width={36} height={36} className="h-full w-full object-cover" />
                        ) : (
                          <User size={18} className="text-amber-400" />
                        )}
                      </LayoutContainer>
                      <span>{m.name}</span>
                    </td>
                    <td className="p-4 text-amber-400 font-semibold">{m.roleTitle}</td>
                    <td className="p-4 text-gray-300">
                      <Badge className="bg-gray-800 text-gray-300 text-xs">
                        {m.boardType}
                      </Badge>
                    </td>
                    <td className="p-4 text-gray-300">{m.termPeriod || '-'}</td>
                    <td className="p-4">
                      {m.active ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                          {TRANSPARENCY_TEXTS.ADMIN.STATUS_ACTIVE}
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-700 text-gray-300 text-xs">
                          {TRANSPARENCY_TEXTS.ADMIN.STATUS_INACTIVE}
                        </Badge>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <LayoutContainer className="inline-flex items-center gap-2">
                        <IconButton
                          icon={<Edit2 size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenMemberDrawer(m)}
                          aria-label="Editar"
                          className="text-gray-400 hover:text-white"
                        />
                        <IconButton
                          icon={<Trash2 size={16} />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget({ type: 'MEMBER', id: m.id, name: m.name })}
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

      {/* Drawers */}
      <AdminTransparencyDocumentDrawer
        document={editingDoc}
        isOpen={isDocDrawerOpen}
        onSuccess={refetch}
        onClose={handleCloseDocDrawer}
      />

      <AdminTransparencyMemberDrawer
        member={editingMember}
        isOpen={isMemberDrawerOpen}
        onSuccess={refetch}
        onClose={handleCloseMemberDrawer}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Esta ação removerá o registro permanentemente.`}
        confirmText="Excluir Registro"
        cancelText="Cancelar"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </LayoutContainer>
  );
}

