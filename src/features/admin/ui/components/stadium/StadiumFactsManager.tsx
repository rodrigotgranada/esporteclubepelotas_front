'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  FormField,
  Input,
  Badge,
  Modal,
} from '@/shared/ui/components';
import { StadiumFact } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { History, Plus, Trash2, Edit3, Check, X, AlertTriangle, Loader2 } from 'lucide-react';
import { useStadiumFactsManager } from '../../../hooks/stadium/useStadiumFactsManager';

interface StadiumFactsManagerProps {
  facts: StadiumFact[];
  onAddFact: (fact: StadiumFact) => Promise<void> | void;
  onUpdateFact: (index: number, updatedFact: StadiumFact) => Promise<void> | void;
  onRemoveFact: (index: number) => Promise<void> | void;
}

export const StadiumFactsManager: React.FC<StadiumFactsManagerProps> = (props) => {
  const { facts } = props;
  const {
    year,
    setYear,
    title,
    setTitle,
    description,
    setDescription,
    isAdding,
    editingIndex,
    editYear,
    setEditYear,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    isSavingEdit,
    deletingIndex,
    setDeletingIndex,
    isDeleting,
    factToDelete,
    handleAdd,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleConfirmDelete,
  } = useStadiumFactsManager(props);

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
      {/* Cabeçalho da Seção */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.FACTS.TITLE}
          </Title>
          <Text className="text-xs text-text-secondary">
            {ADMIN_STADIUM_TEXTS.FACTS.SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Formulário de Novo Marco */}
      <LayoutContainer className="p-5 rounded-2xl bg-background border border-border flex flex-col gap-4">
        <Title level="h4" className="text-sm font-bold text-text-primary flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          {ADMIN_STADIUM_TEXTS.FACTS.ADD_FACT_BUTTON}
        </Title>

        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <LayoutContainer className="sm:col-span-2">
            <FormField label={ADMIN_STADIUM_TEXTS.FACTS.YEAR_LABEL}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.FACTS.YEAR_PLACEHOLDER}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-4">
            <FormField label={ADMIN_STADIUM_TEXTS.FACTS.TITLE_LABEL}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.FACTS.TITLE_PLACEHOLDER}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-4">
            <FormField label={ADMIN_STADIUM_TEXTS.FACTS.DESC_LABEL}>
              <Input
                placeholder={ADMIN_STADIUM_TEXTS.FACTS.DESC_PLACEHOLDER}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormField>
          </LayoutContainer>

          <LayoutContainer className="sm:col-span-2">
            <Button
              type="button"
              variant="primary"
              disabled={isAdding || !year.trim() || !title.trim() || !description.trim()}
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer h-10"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <Text as="span">
                {isAdding ? 'Adicionando...' : ADMIN_STADIUM_TEXTS.FACTS.ADD_FACT_BUTTON}
              </Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Lista de Marcos Cadastrados com Edição e Exclusão */}
      {facts.length === 0 ? (
        <LayoutContainer className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
          <History className="w-8 h-8 text-text-secondary mb-2" />
          <Text className="text-sm text-text-secondary">
            {ADMIN_STADIUM_TEXTS.FACTS.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-3">
          {facts.map((fact, index) => {
            const isEditing = editingIndex === index;

            if (isEditing) {
              return (
                <LayoutContainer
                  key={index}
                  className="p-5 rounded-xl bg-background border-2 border-primary/60 shadow-md flex flex-col gap-4 animate-in fade-in duration-150"
                >
                  <LayoutContainer className="flex items-center justify-between border-b border-border/80 pb-2">
                    <Title level="h4" className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
                      <Edit3 className="w-3.5 h-3.5" />
                      {ADMIN_STADIUM_TEXTS.FACTS.EDIT_FACT_TITLE}: {fact.year}
                    </Title>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="text-xs text-text-secondary hover:text-text-primary h-7 px-2"
                    >
                      <X className="w-3.5 h-3.5 mr-1" />
                      {ADMIN_STADIUM_TEXTS.FACTS.CANCEL_EDIT_BUTTON}
                    </Button>
                  </LayoutContainer>

                  <LayoutContainer className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                    <LayoutContainer className="sm:col-span-2">
                      <FormField label={ADMIN_STADIUM_TEXTS.FACTS.YEAR_LABEL}>
                        <Input
                          value={editYear}
                          onChange={(e) => setEditYear(e.target.value)}
                        />
                      </FormField>
                    </LayoutContainer>

                    <LayoutContainer className="sm:col-span-4">
                      <FormField label={ADMIN_STADIUM_TEXTS.FACTS.TITLE_LABEL}>
                        <Input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </FormField>
                    </LayoutContainer>

                    <LayoutContainer className="sm:col-span-4">
                      <FormField label={ADMIN_STADIUM_TEXTS.FACTS.DESC_LABEL}>
                        <Input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                        />
                      </FormField>
                    </LayoutContainer>

                    <LayoutContainer className="sm:col-span-2 flex items-center gap-2">
                      <Button
                        type="button"
                        variant="primary"
                        disabled={isSavingEdit || !editYear.trim() || !editTitle.trim() || !editDescription.trim()}
                        onClick={handleSaveEdit}
                        className="w-full flex items-center justify-center gap-1.5 font-bold cursor-pointer h-10 shadow-xs"
                      >
                        {isSavingEdit ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                        <Text as="span">
                          {isSavingEdit ? 'Salvando...' : ADMIN_STADIUM_TEXTS.FACTS.SAVE_EDIT_BUTTON}
                        </Text>
                      </Button>
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>
              );
            }

            return (
              <LayoutContainer
                key={index}
                className="p-4 rounded-xl bg-background border border-border flex items-center justify-between gap-4 group hover:border-primary/40 transition-colors"
              >
                <LayoutContainer className="flex items-center gap-3">
                  <Badge
                    variant="default"
                    size="sm"
                    className="font-mono font-bold bg-primary/20 text-primary border border-primary/40 text-xs px-2.5 py-1"
                  >
                    {fact.year}
                  </Badge>
                  <LayoutContainer className="flex flex-col">
                    <Text className="text-sm font-bold text-text-primary">
                      {fact.title}
                    </Text>
                    <Text className="text-xs text-text-secondary mt-0.5">
                      {fact.description}
                    </Text>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="flex items-center gap-2 shrink-0">
                  {/* Botão de Editar */}
                  <Button
                    type="button"
                    size="none"
                    variant="custom"
                    onClick={() => handleStartEdit(index)}
                    className="h-9 px-3 rounded-xl bg-surface hover:bg-primary text-text-primary hover:text-black border border-border/80 shadow-xs flex items-center gap-1.5 transition-all cursor-pointer font-bold text-xs"
                    title={ADMIN_STADIUM_TEXTS.FACTS.EDIT_FACT_TOOLTIP}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <Text as="span">{ADMIN_STADIUM_TEXTS.FACTS.EDIT_BUTTON_LABEL}</Text>
                  </Button>

                  {/* Botão de Excluir */}
                  <Button
                    type="button"
                    size="none"
                    variant="custom"
                    onClick={() => setDeletingIndex(index)}
                    className="h-9 w-9 rounded-xl bg-surface hover:bg-[#ea580c] text-text-secondary hover:text-white border border-border/80 shadow-xs flex items-center justify-center transition-all cursor-pointer"
                    title={ADMIN_STADIUM_TEXTS.FACTS.DELETE_FACT_TOOLTIP}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            );
          })}
        </LayoutContainer>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={deletingIndex !== null}
        onClose={() => !isDeleting && setDeletingIndex(null)}
        size="md"
      >
        <LayoutContainer className="flex flex-col gap-5 p-2">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.FACTS.DELETE_CONFIRM_TITLE}
          </Title>
          <LayoutContainer className="flex items-start gap-3">
            <LayoutContainer className="w-10 h-10 rounded-full bg-[#ea580c]/10 text-[#ea580c] flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </LayoutContainer>
            <LayoutContainer className="flex flex-col gap-1">
              <Text className="text-sm text-text-primary font-medium">
                {ADMIN_STADIUM_TEXTS.FACTS.DELETE_CONFIRM_DESC}
              </Text>
              {factToDelete && (
                <Text className="text-xs text-text-secondary font-mono mt-1">
                  &quot;{factToDelete.year} - {factToDelete.title}&quot;
                </Text>
              )}
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              disabled={isDeleting}
              onClick={() => setDeletingIndex(null)}
              className="cursor-pointer"
            >
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CANCEL_BUTTON}</Text>
            </Button>
            <Button
              type="button"
              disabled={isDeleting}
              onClick={handleConfirmDelete}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold cursor-pointer transition-colors shadow-sm disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-1.5" />
              )}
              <Text as="span">
                {isDeleting ? 'Excluindo...' : ADMIN_STADIUM_TEXTS.FACTS.CONFIRM_DELETE_BUTTON}
              </Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </Modal>
    </LayoutContainer>
  );
};
