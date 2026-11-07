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
} from '@/shared/ui/components';
import { StadiumFact } from '@/features/stadium/types/stadium.types';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { History, Plus, Trash2 } from 'lucide-react';

interface StadiumFactsManagerProps {
  facts: StadiumFact[];
  onAddFact: (fact: StadiumFact) => void;
  onRemoveFact: (index: number) => void;
}

export const StadiumFactsManager: React.FC<StadiumFactsManagerProps> = ({
  facts,
  onAddFact,
  onRemoveFact,
}) => {
  const [year, setYear] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
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
              <Text as="span">Adicionar</Text>
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Lista de Marcos Cadastrados */}
      {facts.length === 0 ? (
        <LayoutContainer className="py-12 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border rounded-xl">
          <History className="w-8 h-8 text-text-secondary mb-2" />
          <Text className="text-sm text-text-secondary">
            {ADMIN_STADIUM_TEXTS.FACTS.EMPTY}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-3">
          {facts.map((fact, index) => (
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

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFact(index)}
                className="w-8 h-8 p-0 rounded-lg hover:bg-[#ea580c] hover:text-white text-text-secondary flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title={ADMIN_STADIUM_TEXTS.FACTS.DELETE_FACT_TOOLTIP}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </LayoutContainer>
          ))}
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
