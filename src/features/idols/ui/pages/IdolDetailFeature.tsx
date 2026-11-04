'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Trophy,
  Shield,
  Star,
  Calendar,
  MapPin,
  Quote,
  Sparkles,
  UserCheck,
  Heart,
  Award,
  Maximize2,
} from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
  SafeImage,
  DEFAULT_IDOL_COVER,
  DEFAULT_NEWS_COVER,
  ImageLightboxModal,
} from '@/shared/ui/components';
import { IDOLS_CONSTANTS } from '../../constants/idols.constants';
import { useIdolDetail } from '../../hooks/useIdolDetail';
import { IdolCategory, IdolData } from '../../services/idols.service';
import { IdolPrevNextNav } from '../components/IdolPrevNextNav';

export interface IdolDetailFeatureProps {
  slug: string;
}

export const IdolDetailFeature: React.FC<IdolDetailFeatureProps> = ({ slug }) => {
  const texts = IDOLS_CONSTANTS.DETAIL;
  const { idol, isLoading, notFound } = useIdolDetail(slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const getCategoryBadge = (category: IdolCategory) => {
    switch (category) {
      case 'PLAYER':
        return (
          <Badge variant="primary" size="md" className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Trophy className="w-3.5 h-3.5" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.PLAYER}
          </Badge>
        );
      case 'COACH':
        return (
          <Badge variant="warning" size="md" className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.COACH}
          </Badge>
        );
      case 'STAFF':
        return (
          <Badge variant="default" size="md" className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-border">
            <UserCheck className="w-3.5 h-3.5 text-primary" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.STAFF}
          </Badge>
        );
      case 'FAN':
        return (
          <Badge variant="default" size="md" className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-primary/40 text-primary">
            <Heart className="w-3.5 h-3.5 text-primary" />
            {IDOLS_CONSTANTS.CATEGORY_BADGES.FAN}
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatPeriod = (idolData: IdolData) => {
    if (idolData.periods && idolData.periods.length > 0) {
      return idolData.periods
        .map((p) =>
          p.endYear && p.endYear !== p.startYear
            ? `${p.startYear} a ${p.endYear}`
            : `${p.startYear}`,
        )
        .join(' • ');
    }
    if (idolData.isActiveInClub) {
      return `Desde ${idolData.startYear} • Em atividade no clube`;
    }
    if (idolData.endYear && idolData.endYear !== idolData.startYear) {
      return `${idolData.startYear} a ${idolData.endYear}`;
    }
    return `${idolData.startYear}`;
  };

  const formatDateString = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  };

  if (isLoading) {
    return (
      <LayoutContainer className="max-w-5xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center justify-center">
        <Spinner className="w-10 h-10 text-primary mb-3" />
        <Text as="p" className="text-text-secondary font-medium">
          Buscando história da lenda...
        </Text>
      </LayoutContainer>
    );
  }

  if (notFound || !idol) {
    return (
      <LayoutContainer className="max-w-xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center gap-4">
        <LayoutContainer className="p-4 rounded-3xl bg-surface border border-border text-text-muted mb-2">
          <Trophy className="w-12 h-12 opacity-50" />
        </LayoutContainer>
        <Title level="h2" className="text-2xl font-black text-text-primary">
          Ídolo não encontrado
        </Title>
        <Text as="p" className="text-text-secondary text-sm">
          A página do ídolo que você procura não foi encontrada no Memorial da Boca do Lobo.
        </Text>
        <Link href="/idolos" className="mt-4">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />} className="font-bold">
            {texts.BTN_BACK}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* Back Button */}
      <LayoutContainer className="flex items-center">
        <Link href="/idolos">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            className="font-bold text-xs text-text-secondary hover:text-text-primary pl-0"
          >
            {texts.BTN_BACK}
          </Button>
        </Link>
      </LayoutContainer>

      {/* Hero Header Card */}
      <LayoutContainer className="flex flex-col lg:flex-row items-center lg:items-start gap-8 p-6 sm:p-10 rounded-3xl bg-surface border border-border shadow-xs relative overflow-hidden">
        {/* Glow behind photo */}
        <LayoutContainer className="absolute -top-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Photo Container 3:4 */}
        <LayoutContainer className="relative w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden bg-background border border-border shrink-0 shadow-lg">
          <SafeImage
            src={idol.photoUrl}
            fallbackSrc={DEFAULT_IDOL_COVER}
            alt={idol.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 256px, 288px"
            priority
          />

          {idol.deathDate && (
            <LayoutContainer className="absolute bottom-3 left-3 right-3 text-center py-1 px-2 rounded-lg bg-background/90 backdrop-blur-md border border-border text-[11px] font-black text-text-muted">
              {texts.IN_MEMORIAM_BADGE}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Hero Details */}
        <LayoutContainer className="flex flex-col gap-4 flex-1 min-w-0 text-center lg:text-left">
          <LayoutContainer className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
            {getCategoryBadge(idol.category)}
            {idol.isFeatured && (
              <Badge variant="warning" size="md" className="font-bold text-xs flex items-center gap-1 shadow-xs">
                <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                Destaque do Memorial
              </Badge>
            )}
          </LayoutContainer>

          <LayoutContainer className="flex flex-col gap-1">
            <Title
              level="h1"
              className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-none"
            >
              {idol.nickname || idol.name}
            </Title>
            {idol.nickname && (
              <Text as="p" className="text-base sm:text-lg font-bold text-text-secondary">
                {idol.name}
              </Text>
            )}
          </LayoutContainer>

          {/* Meta Info Pills */}
          <LayoutContainer className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-text-muted pt-1">
            <LayoutContainer className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-primary" />
              <Text as="span">{texts.PERIOD} <strong className="text-text-primary">{formatPeriod(idol)}</strong></Text>
            </LayoutContainer>

            {idol.birthPlace && (
              <LayoutContainer className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" />
                <Text as="span">{texts.BORN_IN} <strong className="text-text-primary">{idol.birthPlace}</strong></Text>
              </LayoutContainer>
            )}

            {idol.birthDate && (
              <Text as="span">
                {texts.BORN_ON} <strong className="text-text-primary">{formatDateString(idol.birthDate)}</strong>
              </Text>
            )}

            {idol.deathDate && (
              <Text as="span">
                {texts.DIED_ON} <strong className="text-text-primary">{formatDateString(idol.deathDate)}</strong>
              </Text>
            )}
          </LayoutContainer>

          {/* Quote Block */}
          {idol.quote && (
            <LayoutContainer className="mt-2 p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3 text-left">
              <Quote className="w-6 h-6 text-primary shrink-0 opacity-80" />
              <Text as="p" className="text-sm font-semibold text-text-primary italic leading-relaxed">
                &quot;{idol.quote}&quot;
              </Text>
            </LayoutContainer>
          )}
        </LayoutContainer>
      </LayoutContainer>

      {/* Metrics Cards Grid */}
      {idol.category === 'PLAYER' && idol.playerStats && (
        <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {idol.playerStats.matchesCount ? (
            <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
              <Text as="span" className="text-2xl sm:text-4xl font-black text-primary">
                {idol.playerStats.matchesCount}
              </Text>
              <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
                Jogos pelo Pelotas
              </Text>
            </LayoutContainer>
          ) : null}

          {idol.playerStats.goalsCount ? (
            <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
              <Text as="span" className="text-2xl sm:text-4xl font-black text-primary">
                {idol.playerStats.goalsCount}
              </Text>
              <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
                Gols Marcados
              </Text>
            </LayoutContainer>
          ) : null}

          {idol.playerStats.historicJerseyNumber ? (
            <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
              <Text as="span" className="text-2xl sm:text-4xl font-black text-text-primary">
                #{idol.playerStats.historicJerseyNumber}
              </Text>
              <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
                Camisa Histórica
              </Text>
            </LayoutContainer>
          ) : null}

          {idol.playerStats.position ? (
            <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
              <Text as="span" className="text-lg sm:text-2xl font-black text-text-primary">
                {idol.playerStats.position}
              </Text>
              <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
                {idol.playerStats.preferredFoot || 'Posição'}
              </Text>
            </LayoutContainer>
          ) : null}
        </LayoutContainer>
      )}

      {idol.category === 'COACH' && idol.coachStats && (
        <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
            <Text as="span" className="text-2xl sm:text-4xl font-black text-primary">
              {idol.coachStats.matchesCount || 0}
            </Text>
            <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
              Jogos no Comando
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
            <Text as="span" className="text-2xl sm:text-4xl font-black text-text-primary">
              {idol.coachStats.winsCount || 0}
            </Text>
            <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
              Vitórias
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
            <Text as="span" className="text-2xl sm:text-4xl font-black text-text-primary">
              {idol.coachStats.drawsCount || 0}
            </Text>
            <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
              Empates
            </Text>
          </LayoutContainer>

          <LayoutContainer className="flex flex-col items-center justify-center p-5 rounded-2xl bg-surface border border-border text-center shadow-xs">
            <Text as="span" className="text-2xl sm:text-4xl font-black text-text-muted">
              {idol.coachStats.lossesCount || 0}
            </Text>
            <Text as="span" className="text-xs font-bold text-text-secondary uppercase tracking-wider mt-1">
              Derrotas
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Titles Block */}
      {((idol.playerStats?.titles && idol.playerStats.titles.length > 0) ||
        (idol.coachStats?.titles && idol.coachStats.titles.length > 0)) && (
        <LayoutContainer className="flex flex-col gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs">
          <LayoutContainer className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-xl font-black text-text-primary tracking-tight">
              {texts.TITLES_TITLE}
            </Title>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(idol.playerStats?.titles || idol.coachStats?.titles || []).map((title, idx) => (
              <LayoutContainer
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-background border border-primary/20 shadow-xs"
              >
                <Award className="w-5 h-5 text-primary shrink-0" />
                <Text as="span" className="font-extrabold text-sm text-text-primary">
                  {title}
                </Text>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Memorable Match or Special Story */}
      {idol.playerStats?.memorableMatch && (
        <LayoutContainer className="flex flex-col gap-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-surface via-surface to-primary/10 border border-border shadow-xs">
          <Text as="span" className="text-xs font-extrabold text-primary uppercase tracking-wider">
            {texts.MEMORABLE_MATCH_TITLE}
          </Text>
          <Text as="p" className="text-base font-bold text-text-primary leading-relaxed">
            {idol.playerStats.memorableMatch}
          </Text>
        </LayoutContainer>
      )}

      {idol.staffStats?.backstageStory && (
        <LayoutContainer className="flex flex-col gap-2 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs">
          <Text as="span" className="text-xs font-extrabold text-primary uppercase tracking-wider">
            {texts.BACKSTAGE_STORY_TITLE}
          </Text>
          <Text as="p" className="text-sm font-medium text-text-secondary leading-relaxed">
            {idol.staffStats.backstageStory}
          </Text>
        </LayoutContainer>
      )}

      {idol.fanStats?.trademark && (
        <LayoutContainer className="flex flex-col gap-2 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs">
          <Text as="span" className="text-xs font-extrabold text-primary uppercase tracking-wider">
            {texts.TRADEMARK_TITLE}
          </Text>
          <Text as="p" className="text-sm font-medium text-text-secondary leading-relaxed">
            {idol.fanStats.trademark}
          </Text>
        </LayoutContainer>
      )}

      {/* Full Biography */}
      <LayoutContainer className="flex flex-col gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs">
        <Title level="h2" className="text-xl font-black text-text-primary tracking-tight">
          {texts.BIOGRAPHY_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-3">
          {idol.biography}
        </Text>
      </LayoutContainer>

      {/* Historical Gallery with Captions and Lightbox */}
      {((idol.galleryItems && idol.galleryItems.length > 0) || (idol.gallery && idol.gallery.length > 0)) && (() => {
        const items =
          idol.galleryItems && idol.galleryItems.length > 0
            ? idol.galleryItems
            : (idol.gallery || []).map((url) => ({ url, caption: '' }));
        const imageUrls = items.map((i) => i.url);

        return (
          <LayoutContainer className="flex flex-col gap-4 p-6 sm:p-8 rounded-3xl bg-surface border border-border shadow-xs">
            <LayoutContainer className="flex items-center justify-between">
              <Title level="h2" className="text-xl font-black text-text-primary tracking-tight">
                {texts.GALLERY_TITLE}
              </Title>
              <Text as="span" className="text-xs font-semibold text-text-muted hidden sm:inline">
                {IDOLS_CONSTANTS.LIGHTBOX.HINT}
              </Text>
            </LayoutContainer>

            <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <Button
                  key={idx}
                  type="button"
                  variant="ghost"
                  onClick={() => setLightboxIndex(idx)}
                  className="relative aspect-video rounded-2xl overflow-hidden p-0 border border-border hover:border-primary/50 transition-all group text-left cursor-pointer focus:ring-2 focus:ring-primary/40 h-auto"
                  title={item.caption || `${idol.name} foto ${idx + 1}`}
                >
                  <SafeImage
                    src={item.url}
                    fallbackSrc={DEFAULT_NEWS_COVER}
                    alt={item.caption || `${idol.name} foto histórica ${idx + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />

                  {/* Hover icon */}
                  <LayoutContainer className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </LayoutContainer>

                  {/* Caption Bar */}
                  {item.caption && (
                    <LayoutContainer className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-center">
                      <Text as="span" className="text-[11px] font-medium text-white line-clamp-1 leading-tight">
                        {item.caption}
                      </Text>
                    </LayoutContainer>
                  )}
                </Button>
              ))}
            </LayoutContainer>

            {/* Lightbox Modal */}
            <ImageLightboxModal
              isOpen={lightboxIndex !== null}
              onClose={() => setLightboxIndex(null)}
              images={imageUrls}
              initialIndex={lightboxIndex ?? 0}
              title={`${idol.name} • ${texts.GALLERY_TITLE}`}
            />
          </LayoutContainer>
        );
      })()}

      {/* Prev / Next Navigation in Footer */}
      <IdolPrevNextNav currentSlug={slug} />
    </LayoutContainer>
  );
};
