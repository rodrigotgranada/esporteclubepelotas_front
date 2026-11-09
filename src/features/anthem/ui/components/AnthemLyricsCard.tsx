import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, Check, FileText } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Button,
} from '@/shared/ui/components';
import { ANTHEM_TEXTS } from '../../constants/anthem.constants';

export interface AnthemLyricsCardProps {
  lyrics: string;
}

export const AnthemLyricsCard: React.FC<AnthemLyricsCardProps> = ({ lyrics }) => {
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

  // Separa as estrofes por quebra de linha dupla
  const stanzas = lyrics
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <LayoutContainer className="relative rounded-3xl border border-border/80 bg-surface/70 backdrop-blur-xs p-6 sm:p-10 shadow-lg">
      {/* Cabeçalho do Card */}
      <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/60">
        <LayoutContainer className="flex items-center gap-3">
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

      {/* Grid de Estrofes */}
      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
        {stanzas.map((stanza, idx) => (
          <LayoutContainer
            key={idx}
            className="p-6 rounded-2xl bg-background/50 border border-border/50 hover:border-primary/40 transition-colors flex flex-col justify-center relative overflow-hidden group"
          >
            {/* Linha Áureo-Cerúlea no Início da Estrofe */}
            <LayoutContainer className="absolute top-0 left-0 w-1.5 h-full bg-primary/40 group-hover:bg-primary transition-colors" />

            <LayoutContainer className="pl-3">
              <Text className="text-[11px] font-black uppercase tracking-widest text-primary/80 mb-2">
                {`Estrofe ${idx + 1}`}
              </Text>
              <Text
                as="p"
                className="text-base sm:text-lg font-serif italic text-text-primary leading-relaxed whitespace-pre-line"
              >
                {stanza}
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        ))}
      </LayoutContainer>
    </LayoutContainer>
  );
};

