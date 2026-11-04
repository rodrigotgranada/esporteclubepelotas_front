'use client';

import React, { useState } from 'react';
import { Search, Globe, Sparkles } from 'lucide-react';
import { FaXTwitter, FaWhatsapp } from 'react-icons/fa6';
import { LayoutContainer, Text, Title, Badge, SafeImage, Button } from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';

export interface NewsSocialPreviewProps {
  title: string;
  summary?: string;
  subtitle?: string;
  slug?: string;
  coverImage?: string | null;
  publishedAt?: string;
}

export const NewsSocialPreview: React.FC<NewsSocialPreviewProps> = ({
  title,
  summary,
  subtitle,
  slug,
  coverImage,
  publishedAt,
}) => {
  const { DRAWER: texts } = ADMIN_NEWS_TEXTS;
  const [activePlatform, setActivePlatform] = useState<'google' | 'whatsapp' | 'twitter'>('google');

  const displayTitle = title || 'Título da matéria no portal oficial';
  const displayDesc =
    summary ||
    subtitle ||
    'Confira todos os detalhes, fotos e informações completas sobre o Esporte Clube Pelotas em nosso portal oficial.';
  const displaySlug = slug || 'materia-do-pelotas';
  const domain = 'ecpelotas.com.br';
  const fullUrl = `https://${domain}/noticias/${displaySlug}`;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  return (
    <LayoutContainer className="flex flex-col gap-6 max-w-2xl mx-auto w-full py-4">
      {/* Header com Descrição e Seletor de Plataforma */}
      <LayoutContainer className="flex flex-col gap-3">
        <LayoutContainer className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <Text as="span" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            {texts.PREVIEW_TAB_SOCIAL}
          </Text>
        </LayoutContainer>
        <Text as="p" className="text-xs text-text-secondary">
          {texts.SOCIAL_PREVIEW_HINT}
        </Text>

        {/* Botões de Plataforma */}
        <LayoutContainer className="flex flex-wrap items-center gap-2 pt-2">
          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => setActivePlatform('google')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'google'
                ? 'bg-primary text-background shadow-sm'
                : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <Text as="span">{texts.SOCIAL_GOOGLE_TAB}</Text>
          </Button>

          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => setActivePlatform('whatsapp')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'whatsapp'
                ? 'bg-primary text-background shadow-sm'
                : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border'
            }`}
          >
            <FaWhatsapp className="w-3.5 h-3.5 text-[#25D366]" />
            <Text as="span">{texts.SOCIAL_WHATSAPP_TAB}</Text>
          </Button>

          <Button
            type="button"
            variant="custom"
            size="none"
            onClick={() => setActivePlatform('twitter')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activePlatform === 'twitter'
                ? 'bg-primary text-background shadow-sm'
                : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface-hover border border-border'
            }`}
          >
            <FaXTwitter className="w-3.5 h-3.5" />
            <Text as="span">{texts.SOCIAL_TWITTER_TAB}</Text>
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Plataforma 1: Google Search / Discover */}
      {activePlatform === 'google' && (
        <LayoutContainer className="flex flex-col gap-3 p-6 rounded-2xl border border-border bg-[#1f1f1f] text-neutral-100 shadow-lg">
          <LayoutContainer className="flex items-center gap-2.5">
            <LayoutContainer className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[11px] font-black text-primary">
              ECP
            </LayoutContainer>
            <LayoutContainer className="flex flex-col">
              <Text as="span" className="text-xs font-medium text-neutral-300">
                Esporte Clube Pelotas
              </Text>
              <Text as="span" className="text-[11px] text-neutral-400 truncate max-w-sm">
                https://{domain} › noticias › {displaySlug}
              </Text>
            </LayoutContainer>
          </LayoutContainer>

          <Title level="h3" className="text-lg font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
            {displayTitle} | E.C. Pelotas
          </Title>

          <LayoutContainer className="flex gap-4">
            <LayoutContainer className="flex-1 flex flex-col gap-1 text-xs text-neutral-300 leading-relaxed">
              <Text as="span" className="text-neutral-400 mr-1.5 font-medium">
                {formattedDate} —
              </Text>
              <Text as="span" className="line-clamp-2">
                {displayDesc}
              </Text>
            </LayoutContainer>
            {coverImage && (
              <LayoutContainer className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-neutral-800 border border-neutral-700">
                <SafeImage src={coverImage} alt={displayTitle} fill sizes="80px" className="object-cover" />
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Plataforma 2: WhatsApp / Mensageiro */}
      {activePlatform === 'whatsapp' && (
        <LayoutContainer className="flex justify-start">
          <LayoutContainer className="max-w-md w-full rounded-2xl overflow-hidden bg-[#005c4b]/30 border border-[#005c4b]/50 p-2 shadow-md">
            <LayoutContainer className="rounded-xl overflow-hidden bg-[#1f2c34] border border-neutral-800 flex flex-col">
              {coverImage && (
                <LayoutContainer className="relative w-full aspect-video bg-neutral-900">
                  <SafeImage src={coverImage} alt={displayTitle} fill sizes="400px" className="object-cover" />
                </LayoutContainer>
              )}
              <LayoutContainer className="p-3.5 flex flex-col gap-1">
                <Text as="span" className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                  {domain}
                </Text>
                <Title level="h4" className="text-sm font-bold text-neutral-100 line-clamp-2 leading-snug">
                  {displayTitle}
                </Title>
                <Text as="p" className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
                  {displayDesc}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
            <LayoutContainer className="flex justify-end pt-1 pr-1">
              <Text as="span" className="text-[10px] text-neutral-400">
                12:45
              </Text>
            </LayoutContainer>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Plataforma 3: Twitter / X Large Summary Card */}
      {activePlatform === 'twitter' && (
        <LayoutContainer className="max-w-lg w-full rounded-2xl overflow-hidden border border-neutral-800 bg-black shadow-lg">
          {coverImage ? (
            <LayoutContainer className="relative w-full aspect-video bg-neutral-900 border-b border-neutral-800">
              <SafeImage src={coverImage} alt={displayTitle} fill sizes="500px" className="object-cover" />
              <LayoutContainer className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-bold text-white">
                {domain}
              </LayoutContainer>
            </LayoutContainer>
          ) : (
            <LayoutContainer className="p-4 border-b border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <Globe className="w-4 h-4 text-primary" />
              <Text as="span">{domain}</Text>
            </LayoutContainer>
          )}

          <LayoutContainer className="p-4 flex flex-col gap-1.5">
            <Text as="span" className="text-[11px] text-neutral-400">
              De {domain}
            </Text>
            <Title level="h4" className="text-sm font-bold text-white line-clamp-2 leading-snug">
              {displayTitle}
            </Title>
            <Text as="p" className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
              {displayDesc}
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
