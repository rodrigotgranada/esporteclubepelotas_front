'use client';

import React, { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
  Textarea,
  Input,
  FormField,
  SafeImage,
} from '@/shared/ui/components';
import { UpdateStadiumFormData } from '@/features/stadium/schemas/stadium.schema';
import { ADMIN_STADIUM_TEXTS } from '../../../constants/admin-stadium.constants';
import { stadiumService } from '@/features/stadium/services/stadium.service';
import {
  Heading2,
  Quote,
  Eye,
  Edit3,
  Type,
  Info,
  Image as ImageIcon,
  Upload,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface StadiumStoryEditorProps {
  form: UseFormReturn<UpdateStadiumFormData>;
}

export const StadiumStoryEditor: React.FC<StadiumStoryEditorProps> = ({ form }) => {
  const [isPreview, setIsPreview] = useState(false);
  const [showImageInserter, setShowImageInserter] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageCaption, setImageCaption] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, watch, setValue, formState: { errors } } = form;
  const contentHtml = watch('contentHtml') || '';

  const insertSnippet = (snippet: string) => {
    setValue('contentHtml', contentHtml + '\n\n' + snippet, { shouldDirty: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUploadAndInsertImage = async () => {
    if (!imageFile) {
      toast.error('Selecione uma imagem para inserir');
      return;
    }
    try {
      setIsUploadingImage(true);
      const res = await stadiumService.uploadGalleryImage(imageFile);
      const caption = imageCaption.trim() || 'Foto histórica do Estádio Boca do Lobo';
      const snippet = `<figure class="stadium-story-image my-8">
  <img src="${res.url}" alt="${caption}" />
  <figcaption>${caption}</figcaption>
</figure>`;

      insertSnippet(snippet);
      toast.success('Foto inserida com sucesso no meio do texto!');

      // Limpa formulário do inseridor
      setImageFile(null);
      setImagePreview('');
      setImageCaption('');
      setShowImageInserter(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Erro ao subir foto para o texto:', err);
      toast.error('Erro ao realizar upload da imagem');
    } finally {
      setIsUploadingImage(false);
    }
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
        <LayoutContainer className="flex flex-col gap-3">
          <LayoutContainer className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-background border border-border">
            <Text as="span" className="text-xs font-bold text-text-secondary mr-2">
              Inserir no Texto:
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
              onClick={() =>
                insertSnippet(
                  '<blockquote class="stadium-quote">"Frase histórica de impacto da torcida..."</blockquote>'
                )
              }
              className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5 text-primary" />
              <Text as="span">Citação Destacada</Text>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                insertSnippet(
                  '<p>Novo parágrafo contando detalhes da história e memórias da Boca do Lobo...</p>'
                )
              }
              className="flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-primary" />
              <Text as="span">Parágrafo</Text>
            </Button>

            <Button
              type="button"
              variant={showImageInserter ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setShowImageInserter(!showImageInserter)}
              className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <Text as="span">Foto no Meio do Texto</Text>
            </Button>
          </LayoutContainer>

          {/* Box Expansível para Upload e Inserção de Foto */}
          {showImageInserter && (
            <LayoutContainer className="p-4 rounded-xl bg-background border-2 border-primary/40 shadow-sm flex flex-col gap-4 animate-in fade-in duration-200">
              <LayoutContainer className="flex items-center justify-between border-b border-border/80 pb-2">
                <Text className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  Inserir Foto com Legenda no Texto
                </Text>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageInserter(false)}
                  className="p-1 h-auto cursor-pointer"
                >
                  <X className="w-4 h-4 text-text-secondary" />
                </Button>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                {/* File picker */}
                <LayoutContainer className="md:col-span-5">
                  <LayoutContainer
                    onClick={() => fileInputRef.current?.click()}
                    className="h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 bg-surface flex flex-col items-center justify-center cursor-pointer overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <SafeImage
                        src={imagePreview}
                        alt="Preview"
                        fill
                        sizes="250px"
                        className="object-cover"
                      />
                    ) : (
                      <LayoutContainer className="flex flex-col items-center gap-1 p-2 text-center">
                        <Upload className="w-4 h-4 text-primary" />
                        <Text className="text-xs font-bold text-text-primary">
                          Escolher Foto do Computador
                        </Text>
                        <Text className="text-[10px] text-text-secondary">
                          PNG, JPG ou WEBP
                        </Text>
                      </LayoutContainer>
                    )}
                  </LayoutContainer>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </LayoutContainer>

                {/* Legenda */}
                <LayoutContainer className="md:col-span-4">
                  <FormField label="Legenda da Foto (exibida abaixo da imagem)">
                    <Input
                      placeholder="Ex: Arquibancada lotada na final de 1930..."
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                    />
                  </FormField>
                </LayoutContainer>

                {/* Botão de Inserir */}
                <LayoutContainer className="md:col-span-3">
                  <Button
                    type="button"
                    variant="primary"
                    disabled={!imageFile || isUploadingImage}
                    onClick={handleUploadAndInsertImage}
                    className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer h-10"
                  >
                    {isUploadingImage ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <Text as="span">
                      {isUploadingImage ? 'Enviando...' : 'Inserir Foto no Texto'}
                    </Text>
                  </Button>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>
      )}

      {/* Editor Área ou Pré-visualização */}
      {isPreview ? (
        <LayoutContainer className="p-6 rounded-2xl bg-background border border-border min-h-[400px]">
          <LayoutContainer
            as="article"
            className="stadium-article-preview max-w-none 
              [&>h2]:text-2xl [&>h2]:font-extrabold [&>h2]:text-text-primary [&>h2]:mt-8 [&>h2]:mb-3 [&>h2]:border-b [&>h2]:border-border/60 [&>h2]:pb-2
              [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-text-primary [&>h3]:mt-6 [&>h3]:mb-3
              [&>p]:text-text-secondary [&>p]:text-base [&>p]:leading-relaxed [&>p]:mb-4
              [&>blockquote]:p-5 [&>blockquote]:rounded-xl [&>blockquote]:bg-surface [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:text-text-primary [&>blockquote]:italic [&>blockquote]:my-6
              [&>figure]:my-8 [&>figure]:rounded-2xl [&>figure]:overflow-hidden [&>figure]:border [&>figure]:border-border/80 [&>figure]:bg-surface/50 [&>figure]:p-2.5 [&>figure]:shadow-md
              [&>figure>img]:w-full [&>figure>img]:max-h-[500px] [&>figure>img]:object-cover [&>figure>img]:rounded-xl
              [&>figure>figcaption]:text-xs [&>figure>figcaption]:text-text-secondary [&>figure>figcaption]:text-center [&>figure>figcaption]:italic [&>figure>figcaption]:mt-2
              [&>img]:w-full [&>img]:max-h-[500px] [&>img]:object-cover [&>img]:rounded-2xl [&>img]:my-6 [&>img]:shadow-md
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
              Dica: O texto aceita tags HTML como &lt;h2&gt;, &lt;p&gt;, &lt;blockquote&gt; e &lt;figure&gt; com &lt;img&gt; para fotos no meio dos capítulos. Use os botões acima para inserir com 1 clique!
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
