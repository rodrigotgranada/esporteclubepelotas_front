'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Textarea,
} from '@/shared/ui/components';
import { UpdateStadiumFormData } from '@/features/stadium/schemas/stadium.schema';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { Heading2, Quote, Eye, Edit3, Type, Info } from 'lucide-react';

interface StadiumStoryEditorProps {
  form: UseFormReturn<UpdateStadiumFormData>;
}

export const StadiumStoryEditor: React.FC<StadiumStoryEditorProps> = ({ form }) => {
  const [isPreview, setIsPreview] = useState(false);
  const { register, watch, setValue, formState: { errors } } = form;
  const contentHtml = watch('contentHtml') || '';

  const insertSnippet = (snippet: string) => {
    setValue('contentHtml', contentHtml + '\n' + snippet, { shouldDirty: true });
  };

  return (
    <LayoutContainer className="p-6 rounded-2xl bg-surface border border-border shadow-sm flex flex-col gap-6">
      <LayoutContainer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/80 pb-4">
        <LayoutContainer className="flex flex-col">
          <Title level="h3" className="text-lg font-bold text-text-primary">
            {ADMIN_STADIUM_TEXTS.FORM.STORY_HTML_LABEL}
          </Title>
          <Text className="text-xs text-text-secondary">
            {ADMIN_STADIUM_TEXTS.FORM.STORY_HTML_HINT}
          </Text>
        </LayoutContainer>

        {/* Toolbar de Ações & Alternância de Modo */}
        <LayoutContainer className="flex items-center gap-2">
          <Button
            type="button"
            variant={isPreview ? 'outline' : 'primary'}
            size="sm"
            onClick={() => setIsPreview(false)}
            className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <Text as="span">Editor</Text>
          </Button>

          <Button
            type="button"
            variant={isPreview ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setIsPreview(true)}
            className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <Text as="span">Pré-visualizar</Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Barra de Ferramentas Rápidas */}
      {!isPreview && (
        <LayoutContainer className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-background border border-border">
          <Text as="span" className="text-xs font-bold text-text-secondary mr-2">
            Inserir:
          </Text>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertSnippet('<h2>Título do Capítulo</h2>')}
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Heading2 className="w-3.5 h-3.5 text-primary" />
            <Text as="span">Subtítulo (H2)</Text>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertSnippet('<blockquote class="stadium-quote">"Frase histórica de impacto da torcida..."</blockquote>')}
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Quote className="w-3.5 h-3.5 text-primary" />
            <Text as="span">Citação Destacada</Text>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => insertSnippet('<p>Novo parágrafo contando detalhes da história...</p>')}
            className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
          >
            <Type className="w-3.5 h-3.5 text-primary" />
            <Text as="span">Parágrafo</Text>
          </Button>
        </LayoutContainer>
      )}

      {/* Editor Área ou Pré-visualização */}
      {isPreview ? (
        <LayoutContainer className="p-6 rounded-2xl bg-background border border-border min-h-[400px]">
          <LayoutContainer
            as="article"
            className="stadium-article-preview max-w-none 
              [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:text-text-primary [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:border-b [&>h2]:border-border/60 [&>h2]:pb-2
              [&>p]:text-text-secondary [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-4
              [&>blockquote]:p-5 [&>blockquote]:rounded-xl [&>blockquote]:bg-surface [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:text-text-primary [&>blockquote]:italic [&>blockquote]:my-6
              [&>strong]:text-text-primary [&>strong]:font-bold"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-2">
          <Textarea
            rows={18}
            className="font-mono text-sm leading-relaxed resize-y"
            placeholder="Digite aqui os capítulos e parágrafos da matéria..."
            error={errors.contentHtml?.message}
            {...register('contentHtml')}
          />

          <LayoutContainer className="flex items-center gap-2 p-3 rounded-xl bg-primary/5 border border-primary/20 text-text-secondary text-xs">
            <Info className="w-4 h-4 text-primary shrink-0" />
            <Text as="span">
              Dica: O texto aceita tags HTML padrão como &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt; e &lt;blockquote&gt; para formatação como uma matéria especial.
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
