'use client';

import React from 'react';
import {
  Sparkles,
  Star,
  Save,
  RotateCcw,
  GripVertical,
  Search,
  X,
  Plus,
  ArrowRight,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  IconButton,
  Input,
  SafeImage,
  Spinner,
} from '@/shared/ui/components';
import { ADMIN_NEWS_TEXTS } from '../../../constants/admin-news.constants';
import { useAdminShowcase } from '../../../hooks/news/useAdminShowcase';
import { NewsArticleData } from '../../../services/admin-news.service';

export const AdminShowcaseTab: React.FC = () => {
  const {
    mainSlot,
    secSlot1,
    secSlot2,
    availableArticles,
    rawAvailableCount,
    search,
    setSearch,
    isLoading,
    isSaving,
    hasUnsavedChanges,
    dragOverSlot,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSetMain,
    handleSetSec1,
    handleSetSec2,
    handleClearMain,
    handleClearSec1,
    handleClearSec2,
    handleSave,
    refresh,
  } = useAdminShowcase();

  const texts = ADMIN_NEWS_TEXTS.SHOWCASE;

  const getCategoryName = (cat: any) => {
    if (!cat) return 'Geral';
    if (typeof cat === 'string') return cat;
    return cat.name || 'Geral';
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-20 bg-surface rounded-2xl border border-border shadow-xs">
        <Spinner className="w-8 h-8 text-primary mb-3" />
        <Text as="p" className="text-text-secondary font-medium">
          Carregando vitrine da capa...
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="flex flex-col gap-6">
      {/* Top Header & Save Action Bar */}
      <LayoutContainer className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface p-5 rounded-2xl border border-border shadow-xs">
        <LayoutContainer className="flex flex-col gap-1">
          <LayoutContainer className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-lg font-black text-text-primary tracking-tight">
              {texts.PAGE_TITLE}
            </Title>
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm" className="font-bold text-[10px] animate-pulse">
                Alterações Não Salvas
              </Badge>
            )}
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary max-w-2xl">
            {texts.PAGE_SUBTITLE}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {hasUnsavedChanges && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refresh()}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="text-xs font-semibold"
            >
              Descartar
            </Button>
          )}

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!hasUnsavedChanges || isSaving}
            leftIcon={<Save className="w-4 h-4" />}
            className="text-xs font-bold shadow-md"
          >
            {isSaving ? texts.SAVING_BUTTON : texts.SAVE_BUTTON}
          </Button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Dica de arrastar */}
      <LayoutContainer className="px-1">
        <Text as="p" className="text-xs text-text-secondary font-medium">
          {texts.DRAG_HINT}
        </Text>
      </LayoutContainer>

      {/* ═══════════════════════════════════════════════════════════════
          BENTO GRID INTERATIVO (Slot 1 + Slot 2 + Slot 3)
         ═══════════════════════════════════════════════════════════════ */}
      <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* SLOT 1: MANCHETÃO PRINCIPAL (Col 1-7) */}
        <LayoutContainer
          onDragOver={(e) => handleDragOver(e, 'main')}
          onDragLeave={() => handleDragLeave('main')}
          onDrop={() => handleDrop('main')}
          className={`lg:col-span-7 xl:col-span-8 flex flex-col rounded-3xl transition-all duration-200 ${
            dragOverSlot === 'main'
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.01]'
              : ''
          }`}
        >
          {mainSlot ? (
            <LayoutContainer
              draggable
              onDragStart={() => handleDragStart(mainSlot, 'main')}
              onDragEnd={handleDragEnd}
              className="group relative w-full h-full min-h-[420px] rounded-3xl overflow-hidden bg-drawer border-2 border-primary/40 shadow-md flex flex-col justify-end p-6 sm:p-8 cursor-grab active:cursor-grabbing transition-all hover:border-primary"
            >
              <SafeImage
                src={mainSlot.coverImage}
                alt={mainSlot.title}
                fill
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/25 pointer-events-none" />

              {/* Botão de Remover no Topo */}
              <LayoutContainer className="absolute top-4 right-4 z-20 flex items-center gap-2">
                <Button
                  type="button"
                  variant="custom"
                  size="none"
                  onClick={handleClearMain}
                  className="px-3 py-1.5 rounded-full bg-background/80 hover:bg-error/20 text-text-secondary hover:text-error border border-border/80 text-xs font-bold backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5"
                  title={texts.BTN_REMOVE_SLOT_TOOLTIP}
                >
                  <X className="w-3.5 h-3.5" />
                  {texts.BTN_REMOVE_SLOT}
                </Button>
              </LayoutContainer>

              {/* Conteúdo do Card */}
              <LayoutContainer className="relative z-10 flex flex-col gap-2.5 max-w-2xl">
                <LayoutContainer className="flex items-center gap-2">
                  <Badge variant="primary" size="sm" className="font-extrabold shadow-xs">
                    <Star className="w-3 h-3 fill-background" />
                    {texts.SLOT_MAIN_BADGE}
                  </Badge>
                  <Badge variant="default" size="sm" className="bg-white/20 text-white border-white/30 backdrop-blur-xs font-semibold">
                    {getCategoryName(mainSlot.category)}
                  </Badge>
                </LayoutContainer>

                <Title level="h3" className="text-xl sm:text-2xl font-black text-white leading-snug line-clamp-3">
                  {mainSlot.title}
                </Title>

                {mainSlot.subtitle && (
                  <Text as="p" className="text-xs sm:text-sm text-white/80 line-clamp-2 font-normal">
                    {mainSlot.subtitle}
                  </Text>
                )}

                <LayoutContainer className="flex items-center gap-2 text-[11px] text-white/60 pt-1">
                  <GripVertical className="w-3.5 h-3.5 text-primary" />
                  <Text as="span">{texts.DRAG_CARD_SWAP_HINT}</Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          ) : (
            /* Slot 1 Vazio (Dropzone) */
            <LayoutContainer className="w-full h-full min-h-[420px] rounded-3xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center p-8 text-center gap-3">
              <LayoutContainer className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                <Star className="w-7 h-7 fill-primary/20" />
              </LayoutContainer>
              <LayoutContainer className="flex flex-col gap-1 max-w-md">
                <Title level="h3" className="text-base font-bold text-text-primary">
                  {texts.SLOT_MAIN_TITLE}
                </Title>
                <Text as="p" className="text-xs text-text-secondary">
                  {texts.SLOT_MAIN_EMPTY}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* SLOTS SECUNDÁRIOS: Slot 2 & Slot 3 (Col 8-12) */}
        <LayoutContainer className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          {/* SLOT 2: Destaque Secundário A */}
          <LayoutContainer
            onDragOver={(e) => handleDragOver(e, 'sec1')}
            onDragLeave={() => handleDragLeave('sec1')}
            onDrop={() => handleDrop('sec1')}
            className={`flex-1 flex flex-col rounded-2xl transition-all duration-200 ${
              dragOverSlot === 'sec1'
                ? 'ring-2 ring-warning ring-offset-2 ring-offset-background scale-[1.01]'
                : ''
            }`}
          >
            {secSlot1 ? (
              <LayoutContainer
                draggable
                onDragStart={() => handleDragStart(secSlot1, 'sec1')}
                onDragEnd={handleDragEnd}
                className="group relative w-full h-full min-h-[200px] rounded-2xl overflow-hidden bg-drawer border border-warning/40 shadow-xs flex flex-col justify-end p-5 cursor-grab active:cursor-grabbing transition-all hover:border-warning"
              >
                <SafeImage
                  src={secSlot1.coverImage}
                  alt={secSlot1.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

                <LayoutContainer className="absolute top-3 right-3 z-20">
                  <Button
                    type="button"
                    variant="custom"
                    size="none"
                    onClick={handleClearSec1}
                    className="p-1.5 rounded-full bg-background/80 hover:bg-error/20 text-text-secondary hover:text-error border border-border/80 text-xs backdrop-blur-md transition-colors cursor-pointer"
                    title={texts.BTN_REMOVE_SLOT_TOOLTIP}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </LayoutContainer>

                <LayoutContainer className="relative z-10 flex flex-col gap-1.5">
                  <LayoutContainer className="flex items-center gap-1.5">
                    <Badge variant="warning" size="sm" className="font-bold text-[10px] px-2 py-0">
                      {texts.SLOT_SECONDARY_1_TITLE}
                    </Badge>
                  </LayoutContainer>
                  <Title level="h4" className="text-sm font-bold text-white leading-snug line-clamp-2">
                    {secSlot1.title}
                  </Title>
                  <Text as="span" className="text-[10px] text-white/60">
                    {formatDate(secSlot1.publishedAt || secSlot1.createdAt)}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            ) : (
              <LayoutContainer className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-warning/40 bg-warning/5 flex flex-col items-center justify-center p-5 text-center gap-2">
                <Sparkles className="w-5 h-5 text-warning" />
                <Text as="p" className="text-xs font-bold text-text-primary">
                  {texts.SLOT_SECONDARY_1_TITLE}
                </Text>
                <Text as="p" className="text-[11px] text-text-secondary max-w-xs">
                  {texts.SLOT_SECONDARY_EMPTY}
                </Text>
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* SLOT 3: Destaque Secundário B */}
          <LayoutContainer
            onDragOver={(e) => handleDragOver(e, 'sec2')}
            onDragLeave={() => handleDragLeave('sec2')}
            onDrop={() => handleDrop('sec2')}
            className={`flex-1 flex flex-col rounded-2xl transition-all duration-200 ${
              dragOverSlot === 'sec2'
                ? 'ring-2 ring-warning ring-offset-2 ring-offset-background scale-[1.01]'
                : ''
            }`}
          >
            {secSlot2 ? (
              <LayoutContainer
                draggable
                onDragStart={() => handleDragStart(secSlot2, 'sec2')}
                onDragEnd={handleDragEnd}
                className="group relative w-full h-full min-h-[200px] rounded-2xl overflow-hidden bg-drawer border border-warning/40 shadow-xs flex flex-col justify-end p-5 cursor-grab active:cursor-grabbing transition-all hover:border-warning"
              >
                <SafeImage
                  src={secSlot2.coverImage}
                  alt={secSlot2.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

                <LayoutContainer className="absolute top-3 right-3 z-20">
                  <Button
                    type="button"
                    variant="custom"
                    size="none"
                    onClick={handleClearSec2}
                    className="p-1.5 rounded-full bg-background/80 hover:bg-error/20 text-text-secondary hover:text-error border border-border/80 text-xs backdrop-blur-md transition-colors cursor-pointer"
                    title={texts.BTN_REMOVE_SLOT_TOOLTIP}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </LayoutContainer>

                <LayoutContainer className="relative z-10 flex flex-col gap-1.5">
                  <LayoutContainer className="flex items-center gap-1.5">
                    <Badge variant="warning" size="sm" className="font-bold text-[10px] px-2 py-0">
                      {texts.SLOT_SECONDARY_2_TITLE}
                    </Badge>
                  </LayoutContainer>
                  <Title level="h4" className="text-sm font-bold text-white leading-snug line-clamp-2">
                    {secSlot2.title}
                  </Title>
                  <Text as="span" className="text-[10px] text-white/60">
                    {formatDate(secSlot2.publishedAt || secSlot2.createdAt)}
                  </Text>
                </LayoutContainer>
              </LayoutContainer>
            ) : (
              <LayoutContainer className="w-full h-full min-h-[200px] rounded-2xl border-2 border-dashed border-warning/40 bg-warning/5 flex flex-col items-center justify-center p-5 text-center gap-2">
                <Sparkles className="w-5 h-5 text-warning" />
                <Text as="p" className="text-xs font-bold text-text-primary">
                  {texts.SLOT_SECONDARY_2_TITLE}
                </Text>
                <Text as="p" className="text-[11px] text-text-secondary max-w-xs">
                  {texts.SLOT_SECONDARY_EMPTY}
                </Text>
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>

      {/* ═══════════════════════════════════════════════════════════════
          BANCO DE MATÉRIAS PUBLICADAS DISPONÍVEIS (POOL)
         ═══════════════════════════════════════════════════════════════ */}
      <LayoutContainer
        onDragOver={(e) => handleDragOver(e, 'pool')}
        onDragLeave={() => handleDragLeave('pool')}
        onDrop={() => handleDrop('pool')}
        className={`flex flex-col gap-4 bg-surface p-6 rounded-2xl border border-border shadow-xs transition-all ${
          dragOverSlot === 'pool' ? 'ring-2 ring-primary bg-primary/5' : ''
        }`}
      >
        <LayoutContainer className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <LayoutContainer className="flex flex-col gap-0.5">
            <LayoutContainer className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" />
              <Title level="h3" className="text-sm sm:text-base font-bold text-text-primary">
                {texts.POOL_TITLE} ({rawAvailableCount})
              </Title>
            </LayoutContainer>
            <Text as="p" className="text-xs text-text-secondary">
              {texts.POOL_SUBTITLE}
            </Text>
          </LayoutContainer>

          {/* Input de Busca no Pool */}
          <LayoutContainer className="relative w-full sm:w-72">
            <LayoutContainer className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary z-10">
              <Search className="w-3.5 h-3.5" />
            </LayoutContainer>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={texts.POOL_SEARCH_PLACEHOLDER}
              className="pl-8 text-xs h-9 rounded-lg"
            />
          </LayoutContainer>
        </LayoutContainer>

        {/* Lista de Matérias Disponíveis */}
        {availableArticles.length === 0 ? (
          <LayoutContainer className="p-10 rounded-xl bg-background/50 border border-border text-center">
            <Text as="p" className="text-xs text-text-secondary">
              {texts.POOL_EMPTY}
            </Text>
          </LayoutContainer>
        ) : (
          <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {availableArticles.map((article) => {
              const articleId = article._id || article.id || '';
              return (
                <LayoutContainer
                  key={articleId}
                  draggable
                  onDragStart={() => handleDragStart(article, 'pool')}
                  onDragEnd={handleDragEnd}
                  className="group relative flex items-center gap-3 p-3 rounded-xl bg-drawer border border-border hover:border-primary/50 transition-all shadow-2xs cursor-grab active:cursor-grabbing hover:-translate-y-0.5"
                >
                  <GripVertical className="w-4 h-4 text-text-secondary shrink-0 group-hover:text-primary transition-colors" />

                  {/* Capa Thumbnail */}
                  <LayoutContainer className="relative w-16 h-12 rounded-lg overflow-hidden bg-background border border-border shrink-0">
                    <SafeImage
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </LayoutContainer>

                  {/* Informações */}
                  <LayoutContainer className="flex flex-col flex-1 min-w-0 pr-1">
                    <Text as="span" className="text-[10px] font-semibold text-primary">
                      {getCategoryName(article.category)}
                    </Text>
                    <Title level="h4" className="text-xs font-bold text-text-primary leading-tight line-clamp-2">
                      {article.title}
                    </Title>
                    <Text as="span" className="text-[10px] text-text-secondary mt-0.5">
                      {formatDate(article.publishedAt || article.createdAt)}
                    </Text>
                  </LayoutContainer>

                  {/* Ações Rápidas de Atribuição */}
                  <LayoutContainer className="flex flex-col gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="custom"
                      size="none"
                      onClick={() => handleSetMain(article)}
                      className="px-2 py-1 rounded-md bg-primary/10 hover:bg-primary text-primary hover:text-background text-[10px] font-bold border border-primary/20 transition-all cursor-pointer whitespace-nowrap"
                      title="Definir como Manchetão"
                    >
                      {texts.BTN_ADD_MAIN}
                    </Button>
                    <Button
                      type="button"
                      variant="custom"
                      size="none"
                      onClick={() => (!secSlot1 ? handleSetSec1(article) : handleSetSec2(article))}
                      className="px-2 py-1 rounded-md bg-warning/10 hover:bg-warning text-warning hover:text-background text-[10px] font-bold border border-warning/20 transition-all cursor-pointer whitespace-nowrap"
                      title="Definir como Destaque Secundário"
                    >
                      {texts.BTN_ADD_SECONDARY_1}
                    </Button>
                  </LayoutContainer>
                </LayoutContainer>
              );
            })}
          </LayoutContainer>
        )}
      </LayoutContainer>
    </LayoutContainer>
  );
};

