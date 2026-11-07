'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  LayoutContainer,
  Title,
  Text,
} from '@/shared/ui/components';
import { UpdateStadiumFormData } from '@/features/stadium/schemas/stadium.schema';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { stadiumService } from '@/features/stadium/services/stadium.service';
import { NewsBlockEditor } from '../news/NewsBlockEditor';
import { Sparkles, Info } from 'lucide-react';

interface StadiumStoryEditorProps {
  form: UseFormReturn<UpdateStadiumFormData>;
}

export const StadiumStoryEditor: React.FC<StadiumStoryEditorProps> = ({ form }) => {
  const { watch, setValue } = form;
  const contentHtml = watch('contentHtml') || '';

  const handleEditorChange = (json: Record<string, any>) => {
    setValue('contentHtml', JSON.stringify(json), { shouldDirty: true });
  };

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
      {/* Cabeçalho do Editor de Blocos */}
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {ADMIN_STADIUM_TEXTS.FORM.STORY_HTML_LABEL}
          </Title>
          <Text className="text-xs text-text-secondary mt-1">
            {ADMIN_STADIUM_TEXTS.FORM.STORY_HTML_HINT}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Dica de usabilidade dos blocos ricos */}
      <LayoutContainer className="p-3.5 rounded-xl bg-primary/10 border border-primary/20 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <Text className="text-xs text-text-primary leading-relaxed">
          Passe o mouse sobre os blocos para reordenar, transformar em títulos (H1, H2, H3), citações ou adicionar novas fotografias históricas. Ao inserir fotos, você pode escolher a proporção no CropModal oficial, remover fundo e ajustar o tamanho (25%, 50%, 75% ou 100%) e o alinhamento da imagem no texto.
        </Text>
      </LayoutContainer>

      {/* Editor Tiptap de Blocos Ricos */}
      <LayoutContainer className="min-h-[480px]">
        <NewsBlockEditor
          content={contentHtml}
          onChange={handleEditorChange}
          onUploadImage={stadiumService.uploadGalleryImage}
          placeholder={ADMIN_STADIUM_TEXTS.FORM.STORY_EDITOR_PLACEHOLDER}
          className="border-border/80 focus-within:border-primary shadow-inner"
        />
      </LayoutContainer>
    </LayoutContainer>
  );
};
