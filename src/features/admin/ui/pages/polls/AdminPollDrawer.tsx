'use client';

import React from 'react';
import {
  Drawer,
  LayoutContainer,
  Input,
  Textarea,
  Button,
  FormField,
  Switch,
  Spinner,
  IconButton,
} from '@/shared/ui/components';
import { Plus, Trash2 } from 'lucide-react';
import { Poll } from '@/features/poll/types/poll.types';
import { POLL_TEXTS } from '@/features/poll/constants/poll.constants';
import { useAdminPollDrawer } from '@/features/admin/hooks/useAdminPollDrawer';

interface AdminPollDrawerProps {
  poll: Poll | null;
  isOpen: boolean;
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminPollDrawer({
  poll,
  isOpen,
  onSuccess,
  onClose,
}: AdminPollDrawerProps) {
  const {
    title,
    setTitle,
    description,
    setDescription,
    onlyMembers,
    setOnlyMembers,
    active,
    setActive,
    options,
    handleAddOption,
    handleRemoveOption,
    handleOptionChange,
    isSaving,
    handleSubmit,
  } = useAdminPollDrawer({
    poll,
    isOpen,
    onSuccess,
    onClose,
  });

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        poll
          ? POLL_TEXTS.ADMIN.DRAWER_EDIT_TITLE
          : POLL_TEXTS.ADMIN.DRAWER_CREATE_TITLE
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
        <FormField label={POLL_TEXTS.ADMIN.LABEL_TITLE} required>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Quem foi o melhor jogador da partida contra o Grêmio?"
            disabled={isSaving}
          />
        </FormField>

        <FormField label={POLL_TEXTS.ADMIN.LABEL_DESCRIPTION}>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explicação ou regras da votação..."
            rows={3}
            disabled={isSaving}
          />
        </FormField>

        {/* Opções de Voto (Apenas na Criação) */}
        {!poll ? (
          <FormField label={POLL_TEXTS.ADMIN.LABEL_OPTIONS} required>
            <LayoutContainer className="flex flex-col gap-2">
              {options.map((opt, idx) => (
                <LayoutContainer key={idx} className="flex items-center gap-2">
                  <Input
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`${POLL_TEXTS.ADMIN.OPTION_PLACEHOLDER} ${idx + 1}`}
                    disabled={isSaving}
                  />
                  {options.length > 2 && (
                    <IconButton
                      type="button"
                      icon={<Trash2 size={16} />}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(idx)}
                      aria-label="Remover Opção"
                      className="text-gray-400 hover:text-orange-500"
                    />
                  )}
                </LayoutContainer>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="mt-1 flex items-center gap-1.5 border-dashed border-gray-700 text-amber-400 hover:border-amber-400 text-xs"
              >
                <Plus size={14} />
                <span>{POLL_TEXTS.ADMIN.ADD_OPTION}</span>
              </Button>
            </LayoutContainer>
          </FormField>
        ) : (
          <LayoutContainer className="p-4 rounded-xl border border-gray-800 bg-[#071126]/50">
            <span className="text-xs text-gray-400 font-medium mb-2 block">
              Opções Cadastradas (Votos):
            </span>
            <LayoutContainer className="flex flex-col gap-1.5">
              {poll.options.map((o) => (
                <LayoutContainer key={o.id} className="flex items-center justify-between text-xs text-gray-300">
                  <span>• {o.title}</span>
                  <span className="font-bold text-amber-400">{o.votesCount} votos ({o.percentage}%)</span>
                </LayoutContainer>
              ))}
            </LayoutContainer>
          </LayoutContainer>
        )}

        <LayoutContainer className="flex items-center justify-between border-t border-gray-800 pt-4">
          <LayoutContainer className="flex flex-col">
            <span className="text-sm font-medium text-gray-200">
              {POLL_TEXTS.ADMIN.LABEL_ONLY_MEMBERS}
            </span>
            <span className="text-xs text-gray-400">
              Apenas sócios adimplentes com plano ativo poderão votar
            </span>
          </LayoutContainer>
          <Switch
            checked={onlyMembers}
            onChange={setOnlyMembers}
            disabled={isSaving}
          />
        </LayoutContainer>

        <LayoutContainer className="flex items-center justify-between border-t border-gray-800 pt-4">
          <span className="text-sm font-medium text-gray-200">
            {POLL_TEXTS.ADMIN.LABEL_ACTIVE}
          </span>
          <Switch
            checked={active}
            onChange={setActive}
            disabled={isSaving}
          />
        </LayoutContainer>

        <LayoutContainer className="flex justify-end gap-3 pt-6 border-t border-gray-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-amber-400 font-bold text-[#0B1B3D] hover:bg-amber-300"
          >
            {isSaving ? <Spinner size={16} /> : 'Salvar Enquete'}
          </Button>
        </LayoutContainer>
      </form>
    </Drawer>
  );
}

