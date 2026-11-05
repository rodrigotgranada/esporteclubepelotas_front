'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ruler,
  Weight,
  Footprints,
  Trophy,
  Star,
  Shield,
} from 'lucide-react';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Button,
  Spinner,
  SafeImage,
  DEFAULT_IDOL_COVER,
} from '@/shared/ui/components';
import { FOOTBALL_CONSTANTS } from '../../constants/football.constants';
import { AthleteData, footballService } from '../../services/football.service';

export const AthleteDetailFeature: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAthlete() {
      if (!slug) return;
      try {
        setIsLoading(true);
        const data = await footballService.getAthleteBySlug(slug);
        if (isMounted) {
          setAthlete(data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.response?.data?.message || 'Atleta não encontrado.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAthlete();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <LayoutContainer className="min-h-screen flex flex-col items-center justify-center py-24 gap-3">
        <Spinner size={36} />
        <Text as="p" className="text-sm font-semibold text-text-muted">
          Carregando perfil do atleta...
        </Text>
      </LayoutContainer>
    );
  }

  if (error || !athlete) {
    return (
      <LayoutContainer className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-4">
        <Title level="h2" className="text-2xl font-black text-text-primary">
          Atleta Não Encontrado
        </Title>
        <Text as="p" className="text-sm text-text-secondary">
          {error || 'Não encontramos as informações deste atleta.'}
        </Text>
        <Link href="/elenco">
          <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            {FOOTBALL_CONSTANTS.ATHLETE_DETAIL.BACK_TO_SQUAD}
          </Button>
        </Link>
      </LayoutContainer>
    );
  }

  const footLabel = athlete?.preferredFoot ? ((FOOTBALL_CONSTANTS.FEET as Record<string, string>)[athlete.preferredFoot] || athlete.preferredFoot) : "-";

  return (
    <LayoutContainer className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Botão Voltar */}
      <LayoutContainer className="mb-6">
        <Link href="/elenco">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />} className="font-bold text-xs text-text-muted hover:text-text-primary">
            {FOOTBALL_CONSTANTS.ATHLETE_DETAIL.BACK_TO_SQUAD}
          </Button>
        </Link>
      </LayoutContainer>

      {/* Grid Principal do Perfil */}
      <LayoutContainer className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Coluna Esquerda: Foto Oficial */}
        <LayoutContainer className="lg:col-span-5 flex flex-col gap-4">
          <LayoutContainer className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-surface border border-border shadow-md">
            <SafeImage
              src={athlete.photoUrl}
              fallbackSrc={DEFAULT_IDOL_COVER}
              alt={athlete.nickname || athlete.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            <LayoutContainer className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <LayoutContainer className="absolute bottom-4 left-4 right-4">
              <Badge variant="primary" size="md" className="font-extrabold uppercase text-xs tracking-wider shadow-sm">
                {athlete.athleteType === 'STAFF' ? (athlete.staffRole || 'Comissão Técnica') : athlete.primaryPosition}
              </Badge>
            </LayoutContainer>
          </LayoutContainer>

          {/* Instagram Link Pill */}
          {athlete.instagram && (
            <a
              href={`https://instagram.com/${athlete.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 p-3 rounded-2xl bg-surface border border-border hover:border-primary/50 text-text-primary text-xs font-bold transition-all shadow-xs"
            >
              <InstagramIcon className="w-4 h-4 text-primary" />
              <span>@{athlete.instagram.replace('@', '')}</span>
            </a>
          )}
        </LayoutContainer>

        {/* Coluna Direita: Dados Técnicos, Biografia e Temporadas */}
        <LayoutContainer className="lg:col-span-7 flex flex-col gap-8">
          {/* Cabeçalho */}
          <LayoutContainer className="flex flex-col gap-1.5 pb-6 border-b border-border">
            <Title level="h1" className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight leading-tight">
              {athlete.nickname || athlete.name}
            </Title>
            {athlete.nickname && (
              <Text as="p" className="text-base font-semibold text-text-muted">
                {athlete.name}
              </Text>
            )}
          </LayoutContainer>

          {/* Cards de Métricas Físicas e Técnicas */}
          {athlete.athleteType === 'STAFF' ? (
            <LayoutContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>Cargo / Função</span>
                </LayoutContainer>
                <Text as="span" className="text-base sm:text-lg font-black text-text-primary">
                  {athlete.staffRole || 'Comissão Técnica'}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{FOOTBALL_CONSTANTS.ATHLETE_DETAIL.AGE}</span>
                </LayoutContainer>
                <Text as="span" className="text-base sm:text-lg font-black text-text-primary">
                  {athlete.age ? `${athlete.age} anos` : '-'}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Naturalidade</span>
                </LayoutContainer>
                <Text as="span" className="text-base sm:text-lg font-black text-text-primary">
                  {athlete.birthPlace || 'Brasil'}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          ) : (
            <LayoutContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-primary" />
                  <span>{FOOTBALL_CONSTANTS.ATHLETE_DETAIL.AGE}</span>
                </LayoutContainer>
                <Text as="span" className="text-lg font-black text-text-primary">
                  {athlete.age ? `${athlete.age} anos` : '-'}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <Ruler className="w-3.5 h-3.5 text-primary" />
                  <span>{FOOTBALL_CONSTANTS.ATHLETE_DETAIL.HEIGHT}</span>
                </LayoutContainer>
                <Text as="span" className="text-lg font-black text-text-primary">
                  {athlete.height ? `${athlete.height} cm` : '-'}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <Weight className="w-3.5 h-3.5 text-primary" />
                  <span>{FOOTBALL_CONSTANTS.ATHLETE_DETAIL.WEIGHT}</span>
                </LayoutContainer>
                <Text as="span" className="text-lg font-black text-text-primary">
                  {athlete.weight ? `${athlete.weight} kg` : '-'}
                </Text>
              </LayoutContainer>

              <LayoutContainer className="p-4 rounded-2xl bg-surface border border-border flex flex-col gap-1">
                <LayoutContainer className="flex items-center gap-1.5 text-text-muted text-xs font-semibold">
                  <Footprints className="w-3.5 h-3.5 text-primary" />
                  <span>Pé</span>
                </LayoutContainer>
                <Text as="span" className="text-lg font-black text-text-primary">
                  {footLabel}
                </Text>
              </LayoutContainer>
            </LayoutContainer>
          )}

          {/* Naturalidade & Posições Secundárias */}
          <LayoutContainer className="flex flex-wrap items-center gap-4 text-xs text-text-secondary">
            {athlete.birthPlace && (
              <LayoutContainer className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold">{athlete.birthPlace}</span>
              </LayoutContainer>
            )}

            {athlete.secondaryPositions && athlete.secondaryPositions.length > 0 && (
              <LayoutContainer className="flex items-center gap-1.5">
                <span className="font-bold text-text-muted">Outras Posições:</span>
                <span className="font-semibold text-text-primary">
                  {athlete.secondaryPositions.join(', ')}
                </span>
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* Biografia / Resumo */}
          {athlete.biography && (
            <LayoutContainer className="flex flex-col gap-2">
              <Title level="h3" className="text-lg font-bold text-text-primary">
                {FOOTBALL_CONSTANTS.ATHLETE_DETAIL.BIOGRAPHY_TITLE}
              </Title>
              <Text as="p" className="text-sm text-text-secondary leading-relaxed">
                {athlete.biography}
              </Text>
            </LayoutContainer>
          )}

          {/* Clubes Anteriores */}
          <LayoutContainer className="flex flex-col gap-2.5">
            <Title level="h3" className="text-lg font-bold text-text-primary">
              {FOOTBALL_CONSTANTS.ATHLETE_DETAIL.PAST_CLUBS}
            </Title>
            {athlete.pastClubs && athlete.pastClubs.length > 0 ? (
              <LayoutContainer className="flex flex-wrap gap-2">
                {athlete.pastClubs.map((club, idx) => (
                  <Badge
                    key={idx}
                    variant="default"
                    size="sm"
                    className="font-semibold text-xs py-1 px-3 bg-surface border border-border"
                  >
                    {club}
                  </Badge>
                ))}
              </LayoutContainer>
            ) : (
              <Text as="p" className="text-xs text-text-muted italic">
                {FOOTBALL_CONSTANTS.ATHLETE_DETAIL.NO_PAST_CLUBS}
              </Text>
            )}
          </LayoutContainer>

          {/* Linha do Tempo de Temporadas no Pelotas */}
          {athlete.seasons && athlete.seasons.length > 0 && (
            <LayoutContainer className="flex flex-col gap-3 pt-4 border-t border-border">
              <Title level="h3" className="text-lg font-bold text-text-primary flex items-center gap-2">
                <Trophy className="w-4 h-4 text-primary" />
                <span>{FOOTBALL_CONSTANTS.ATHLETE_DETAIL.SEASONS_TITLE}</span>
              </Title>

              <LayoutContainer className="flex flex-col gap-2">
                {athlete.seasons.map((season, idx) => (
                  <LayoutContainer
                    key={idx}
                    className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between text-xs"
                  >
                    <LayoutContainer className="flex items-center gap-3">
                      <Badge variant="primary" size="sm" className="font-black text-xs px-2.5">
                        {season.sector === 'STAFF' || !season.jerseyNumber ? 'STAFF' : '#' + season.jerseyNumber}
                      </Badge>
                      <LayoutContainer className="flex flex-col">
                        <Text as="span" className="font-bold text-text-primary">
                          {season.seasonName} ({season.year})
                        </Text>
                        <Text as="span" className="text-[11px] text-text-muted">
                          {season.sector ? (FOOTBALL_CONSTANTS.SECTORS as any)[season.sector] || season.sector : ''}
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>

                    {season.role === 'CAPTAIN' && (
                      <Badge variant="warning" size="sm" className="font-extrabold text-[10px] uppercase">
                        Capitão
                      </Badge>
                    )}
                  </LayoutContainer>
                ))}
              </LayoutContainer>
            </LayoutContainer>
          )}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
