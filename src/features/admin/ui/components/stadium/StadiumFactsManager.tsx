'use client';

import React, { useState } from 'react';
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
import { History, Plus, Trash2, Edit3, Check, X, AlertTriangle } from 'lucide-react';

interface StadiumFactsManagerProps {
  facts: StadiumFact[];
  onAddFact: (fact: StadiumFact) => void;
  onUpdateFact: (index: number, updatedFact: StadiumFact) => void;
  onRemoveFact: (index: number) => void;
}

export const StadiumFactsManager: React.FC<StadiumFactsManagerProps> = ({
  facts,
  onAddFact,
  onUpdateFact,
  onRemoveFact,
}) => {
  // Estado para criação de novo marco
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Estado para edição in-place de marco existente
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editYear, setEditYear] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Estado para exclusão com confirmação
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    if (!year.trim() || !title.trim() || !description.trim()) return;
    onAddFact({
      year: year.trim(),
      title: title.trim(),
      description: description.trim(),
    });
    setYear('');
    setTitle('');
    setDescription('');
  };

  const handleStartEdit = (index: number) => {
    const fact = facts[index];
    if (!fact) return;
    setEditingIndex(index);
    setEditYear(fact.year);
    setEditTitle(fact.title);
    setEditDescription(fact.description);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditYear('');
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    if (!editYear.trim() || !editTitle.trim() || !editDescription.trim()) return;
    onUpdateFact(editingIndex, {
      year: editYear.trim(),
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    handleCancelEdit();
  };

  const handleConfirmDelete = () => {
    if (deletingIndex === null) return;
    onRemoveFact(deletingIndex);
    setDeletingIndex(null);
  };

  const factToDelete = deletingIndex !== null ? facts[deletingIndex] : null;

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
              disabled={!year.trim() || !title.trim() || !description.trim()}
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer h-10"
            >
              <Plus className="w-4 h-4" />
              <Text as="span">{ADMIN_STADIUM_TEXTS.FACTS.ADD_FACT_BUTTON}</Text>
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
                        disabled={!editYear.trim() || !editTitle.trim() || !editDescription.trim()}
                        onClick={handleSaveEdit}
                        className="w-full flex items-center justify-center gap-1.5 font-bold cursor-pointer h-10 shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <Text as="span">{ADMIN_STADIUM_TEXTS.FACTS.SAVE_EDIT_BUTTON}</Text>
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

                <LayoutContainer className="flex items-center gap-1.5 shrink-0">
                  {/* Botão de Editar */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStartEdit(index)}
                    className="w-8 h-8 p-0 rounded-lg hover:bg-surface text-text-secondary hover:text-primary flex items-center justify-center transition-colors cursor-pointer"
                    title={ADMIN_STADIUM_TEXTS.FACTS.EDIT_FACT_TOOLTIP}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>

                  {/* Botão de Excluir */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingIndex(index)}
                    className="w-8 h-8 p-0 rounded-lg hover:bg-[#ea580c] hover:text-white text-text-secondary flex items-center justify-center transition-colors cursor-pointer"
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
        onClose={() => setDeletingIndex(null)}
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
              onClick={() => setDeletingIndex(null)}
              className="cursor-pointer"
            >
              <Text as="span">{ADMIN_STADIUM_TEXTS.GALLERY.CANCEL_BUTTON}</Text>
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold cursor-pointer transition-colors shadow-sm"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <Text as="span">{ADMIN_STADIUM_TEXTS.FACTS.CONFIRM_DELETE_BUTTON}</Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </Modal>
    </LayoutContainer>
  );
};
