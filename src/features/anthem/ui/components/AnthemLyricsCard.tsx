import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, FileText, Music, Quote } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';

export interface AnthemLyricsCardProps {
  lyrics: string;
  authorLyrics?: string | null;
  authorMusic?: string | null;
  compositionYear?: number | null;
}

export const AnthemLyricsCard: React.FC<AnthemLyricsCardProps> = ({
  lyrics,
  authorLyrics,
  authorMusic,
  compositionYear,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lyrics);
      setCopied(true);
      toast.success(ANTHEM_TEXTS.TOAST_LYRICS_COPIED);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error(ANTHEM_TEXTS.TOAST_GENERIC_ERROR);
    }
  };

  const authorName =
    authorLyrics && authorMusic && authorLyrics === authorMusic
      ? authorLyrics
      : authorLyrics || authorMusic || ANTHEM_TEXTS.HISTORY_DEFAULT_AUTHOR;

  return (
    <LayoutContainer className="relative rounded-3xl border border-border/80 bg-surface/70 backdrop-blur-xs p-6 sm:p-10 shadow-lg">
      {/* Cabeçalho do Card */}
      <LayoutContainer className="flex items-center gap-3 pb-6 mb-8 border-b border-border/60">
        <LayoutContainer className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </LayoutContainer>
        <LayoutContainer className="flex flex-col">
          <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary">
            {ANTHEM_TEXTS.LYRICS_TITLE}
          </Title>
          <Text className="text-xs sm:text-sm text-text-secondary">
            {ANTHEM_TEXTS.LYRICS_SUBTITLE}
          </Text>
        </LayoutContainer>
      </LayoutContainer>

      {/* Letra como Texto Único Monumental */}
      <LayoutContainer className="relative max-w-2xl mx-auto my-2 p-6 sm:p-8 rounded-2xl bg-background/40 border border-border/50 text-center">
        <Quote className="w-8 h-8 text-primary/30 mx-auto mb-4" />
        <Text
          as="p"
          className="text-base sm:text-xl font-serif italic text-text-primary leading-loose sm:leading-loose whitespace-pre-line tracking-wide"
        >
          {lyrics.trim()}
        </Text>
      </LayoutContainer>

      {/* Rodapé Direto: Autor, Ano e Ação de Cópia */}
      <LayoutContainer className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <LayoutContainer className="flex items-center gap-2 text-xs sm:text-sm">
          <Music className="w-4 h-4 text-primary shrink-0" />
          <Text as="span" className="text-text-secondary">
            Autor:
          </Text>
          <Text as="span" className="text-text-primary font-bold">
            {authorName}
          </Text>
          {compositionYear && (
            <Text as="span" className="text-text-secondary">
              • Ano {compositionYear}
            </Text>
          )}
        </LayoutContainer>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
          className="font-bold text-xs"
        >
          {copied ? 'Copiado!' : ANTHEM_TEXTS.BTN_COPY_LYRICS}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
