'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Calendar, ArrowRight, AlertCircle } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Input,
  SafeImage,
  Spinner,
  MembershipCtaCard,
} from '@/shared/ui/components';
import { newsService } from '@/features/news/services/news.service';
import { NewsArticleData } from '@/features/admin/services/admin-news.service';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { useRealtimeEvents } from '@/shared/hooks/useRealtimeEvents';

export const YouthArticlesFeature: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticleData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const texts = YOUTH_CONSTANTS.PAGE_NEWS;

  const loadArticles = useCallback(async (options?: { silent?: boolean }) => {
    try {
      if (!options?.silent) {
        setIsLoading(true);
      }
      const res = await newsService.getNews({ isYouth: true, limit: 30 });
      const rawList = res.data || [];

      const filtered = rawList.filter((art) => {
        const catName =
          typeof art.category === 'object' && art.category
            ? art.category.name?.toLowerCase() || ''
            : '';
        const hasBaseCategory = catName.includes('base') || catName.includes('formação');
        const hasBaseTag = (art.tags || []).some((t) => t.toLowerCase().includes('base'));
        return art.isYouth || hasBaseCategory || hasBaseTag;
      });

      setArticles(filtered.length > 0 ? filtered : rawList);
    } catch (err) {
      console.warn('Erro ao carregar matérias da base:', err);
      if (!options?.silent) {
        setArticles([]);
      }
    } finally {
      if (!options?.silent) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useRealtimeEvents('news', () => {
    loadArticles({ silent: true });
  });

  const displayedArticles = articles.filter((a) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const titleMatch = a.title?.toLowerCase().includes(term);
    const summaryMatch = a.summary?.toLowerCase().includes(term);
    return titleMatch || summaryMatch;
  });

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botão Voltar para o Hub da Base */}
      <LayoutContainer className="mb-6">
        <Link href="/base" className="inline-block">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="text-xs font-bold text-text-secondary hover:text-primary transition-colors"
          >
            {texts.BACK}
          </Button>
        </Link>
      </LayoutContainer>

      {/* Header da Página */}
      <LayoutContainer className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-surface-secondary border border-border p-6 sm:p-10 mb-8 shadow-sm">
        <LayoutContainer className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <LayoutContainer className="flex flex-col gap-2 max-w-2xl">
            <LayoutContainer className="inline-flex items-center gap-2">
              <Badge variant="primary" className="px-3 py-1 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <Newspaper className="w-3.5 h-3.5" />
                <Text as="span">Cobertura Oficial</Text>
              </Badge>
            </LayoutContainer>

            <Title level="h1" className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
              {texts.TITLE}
            </Title>
            <Text as="p" className="text-sm sm:text-base text-text-secondary leading-relaxed">
              {texts.SUBTITLE}
            </Text>
          </LayoutContainer>

          {/* Campo de Busca Rápida */}
          <LayoutContainer className="w-full md:w-72">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={texts.SEARCH_PLACEHOLDER}
              className="w-full text-xs"
            />
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* Grid de Matérias */}
      {isLoading ? (
        <LayoutContainer className="py-20 flex flex-col items-center justify-center gap-3">
          <Spinner size={32} />
          <Text as="span" className="text-xs text-text-muted">
            Carregando matérias das Crias da Boca...
          </Text>
        </LayoutContainer>
      ) : displayedArticles.length === 0 ? (
        <LayoutContainer className="p-12 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-3 my-8 shadow-xs">
          <AlertCircle className="w-10 h-10 text-text-muted" />
          <Title level="h3" className="text-lg font-bold text-text-primary">
            Nenhuma matéria encontrada
          </Title>
          <Text as="p" className="text-sm text-text-secondary max-w-md">
            {search
              ? 'Nenhuma matéria corresponde ao termo pesquisado. Tente outra palavra-chave.'
              : 'As matérias das categorias de formação serão publicadas em breve pela assessoria.'}
          </Text>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedArticles.map((item) => {
            const dateStr = item.publishedAt
              ? new Date(item.publishedAt).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
              : '';

            return (
              <Link
                key={item._id || item.id}
                href={`/noticias/${item.slug}`}
                className="group flex flex-col rounded-3xl bg-surface border border-border/80 hover:border-primary/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 focus:outline-none"
              >
                {/* Imagem de Capa */}
                <LayoutContainer className="relative h-48 w-full bg-surface-secondary overflow-hidden">
                  <SafeImage
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <LayoutContainer className="absolute top-3 left-3">
                    <Badge variant="primary" className="text-xs font-bold py-1 px-2.5 shadow-xs">
                      Base
                    </Badge>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Conteúdo */}
                <LayoutContainer className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <LayoutContainer className="flex flex-col gap-2">
                    <LayoutContainer className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5" />
                      <Text as="span">{dateStr}</Text>
                    </LayoutContainer>

                    <Title
                      level="h3"
                      className="text-base font-bold text-text-primary group-hover:text-primary transition-colors line-clamp-2"
                    >
                      {item.title}
                    </Title>

                    {item.summary && (
                      <Text as="p" className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                        {item.summary}
                      </Text>
                    )}
                  </LayoutContainer>

                  <LayoutContainer className="flex items-center text-xs font-bold text-primary pt-2 border-t border-border/40">
                    <Text as="span">Ler matéria completa</Text>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </LayoutContainer>
                </LayoutContainer>
              </Link>
            );
          })}
        </LayoutContainer>
      )}

      {/* Convite para o Quadro Social */}
      <MembershipCtaCard
        title="Fortaleça o Futuro do Pelotas"
        description="Seja sócio do Lobo e ajude a formar novos campeões com estrutura de primeiro nível na Boca do Lobo."
        buttonText="Faça Parte da Família Áureo-Cerúlea"
        className="mt-16"
      />
    </LayoutContainer>
  );
};
