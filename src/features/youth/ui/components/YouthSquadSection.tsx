'use client';

import React from 'react';
import Link from 'next/link';
import { Users, AlertCircle, Search } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Spinner,
  SafeImage,
  DEFAULT_IDOL_COVER,
} from '@/shared/ui/components';
import { YOUTH_CONSTANTS } from '../../constants/youth.constants';
import { SquadData, SquadMemberData } from '@/features/football/services/football.service';

export interface YouthSquadSectionProps {
  squad: SquadData | null;
  hasAnyChampionship: boolean;
  isLoading: boolean;
  hasActiveSearch?: boolean;
  organizedSectors: {
    goalkeepers: SquadMemberData[];
    defenders: SquadMemberData[];
    midfielders: SquadMemberData[];
    forwards: SquadMemberData[];
    staff?: SquadMemberData[];
  };
}

export const YouthSquadSection: React.FC<YouthSquadSectionProps> = ({
  squad,
  hasAnyChampionship,
  isLoading,
  hasActiveSearch = false,
  organizedSectors,
}) => {
  const texts = YOUTH_CONSTANTS.SQUADS;
  const catLabels = YOUTH_CONSTANTS.CATEGORIES;

  if (isLoading) {
    return (
      <LayoutContainer className="py-20 flex flex-col items-center justify-center gap-3">
        <Spinner size={32} />
        <Text as="span" className="text-xs font-semibold text-text-secondary">
          {texts.LOADING}
        </Text>
      </LayoutContainer>
    );
  }

  if (!hasAnyChampionship) {
    return (
      <LayoutContainer className="p-8 sm:p-14 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-3 my-4 shadow-xs">
        <LayoutContainer className="p-4 rounded-2xl bg-background border border-border text-primary">
          <AlertCircle className="w-8 h-8 text-primary" />
        </LayoutContainer>
        <Title level="h3" className="text-base sm:text-lg font-bold text-text-primary">
          {texts.EMPTY_CHAMPIONSHIPS_TITLE}
        </Title>
        <Text as="p" className="text-xs sm:text-sm text-text-secondary max-w-md">
          {texts.EMPTY_CHAMPIONSHIPS_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  if (!squad || !squad.members || squad.members.length === 0) {
    return (
      <LayoutContainer className="p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-3 my-4 shadow-xs">
        <LayoutContainer className="p-4 rounded-2xl bg-background border border-border text-primary">
          <AlertCircle className="w-8 h-8 text-primary" />
        </LayoutContainer>
        <Title level="h3" className="text-base font-bold text-text-primary">
          {texts.EMPTY_TITLE}
        </Title>
        <Text as="p" className="text-xs text-text-secondary max-w-md">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  const sectorGroups = [
    { title: texts.SECTORS.GOALKEEPER, members: organizedSectors.goalkeepers },
    { title: texts.SECTORS.DEFENDER, members: organizedSectors.defenders },
    { title: texts.SECTORS.MIDFIELDER, members: organizedSectors.midfielders },
    { title: texts.SECTORS.FORWARD, members: organizedSectors.forwards },
    { title: texts.SECTORS.STAFF, members: organizedSectors.staff || [] },
  ];

  const totalFilteredCount = sectorGroups.reduce((acc, g) => acc + g.members.length, 0);
  const categoryLabel =
    catLabels[squad.category as keyof typeof catLabels] || squad.category;

  return (
    <LayoutContainer className="flex flex-col gap-8 my-6">
      {/* Informações do Campeonato, Categoria e Comissão */}
      <LayoutContainer className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <LayoutContainer className="flex flex-col gap-1.5">
          <LayoutContainer className="flex items-center gap-2 flex-wrap">
            <Title level="h3" className="text-lg sm:text-xl font-black text-text-primary">
              {squad.seasonName}
            </Title>
            <Badge variant="primary" size="sm" className="text-[10px] font-extrabold uppercase">
              {categoryLabel}
            </Badge>
          </LayoutContainer>
          {squad.coachName && (
            <LayoutContainer className="flex items-center gap-2 text-xs text-text-secondary">
              <Text as="span" className="font-bold text-text-primary">
                {texts.COACH_LABEL}
              </Text>
              <Text as="span">{squad.coachName}</Text>
            </LayoutContainer>
          )}
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          <Badge variant="default" className="text-xs font-bold px-3 py-1 bg-background border-border flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <Text as="span">
              {squad.members.length} {texts.ATHLETES_COUNT}
            </Text>
          </Badge>
        </LayoutContainer>
      </LayoutContainer>

      {/* Vazio na busca */}
      {hasActiveSearch && totalFilteredCount === 0 ? (
        <LayoutContainer className="p-10 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-2">
          <Search className="w-7 h-7 text-primary opacity-70" />
          <Title level="h4" className="text-sm font-bold text-text-primary">
            {texts.EMPTY_SEARCH_TITLE}
          </Title>
          <Text as="p" className="text-xs text-text-secondary">
            {texts.EMPTY_SEARCH_DESC}
          </Text>
        </LayoutContainer>
      ) : (
        /* Grid de Atletas por Setores Táticos */
        sectorGroups.map((group) => {
          if (group.members.length === 0) return null;

          return (
            <LayoutContainer key={group.title} className="flex flex-col gap-4">
              <LayoutContainer className="flex items-center justify-between border-b border-border/60 pb-2">
                <Title level="h4" className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                  {group.title}
                </Title>
                <Badge variant="default" size="sm" className="font-extrabold text-xs">
                  {group.members.length}
                </Badge>
              </LayoutContainer>

              <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {group.members.map((member) => {
                  const athlete = member.athlete;
                  const photo = athlete?.photoUrl;
                  const isStaffMember =
                    athlete?.athleteType === 'STAFF' || member.sector === 'STAFF';
                  const athleteName = athlete?.nickname || athlete?.name || categoryLabel;
                  const positionLabel = isStaffMember
                    ? athlete?.staffRole || athlete?.primaryPosition || texts.SECTORS.STAFF
                    : athlete?.primaryPosition || categoryLabel;

                  const cardContent = (
                    <LayoutContainer className="group relative flex flex-col h-full rounded-2xl bg-surface border border-border/80 overflow-hidden hover:border-primary/50 transition-all shadow-2xs hover:shadow-sm">
                      <LayoutContainer className="relative aspect-[3/4] w-full overflow-hidden bg-background">
                        <SafeImage
                          src={photo}
                          alt={athleteName}
                          fill
                          className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                          fallbackSrc={DEFAULT_IDOL_COVER}
                        />
                        {member.jerseyNumber != null && (
                          <LayoutContainer className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-surface/90 backdrop-blur-xs border border-border font-black text-xs text-text-primary shadow-xs">
                            #{member.jerseyNumber}
                          </LayoutContainer>
                        )}
                      </LayoutContainer>

                      <LayoutContainer className="p-3 flex flex-col gap-1">
                        <Text as="span" className="font-black text-xs sm:text-sm text-text-primary group-hover:text-primary transition-colors truncate">
                          {athleteName}
                        </Text>
                        <Text as="span" className="text-[11px] text-text-secondary truncate">
                          {positionLabel}
                        </Text>

                        {athlete?.entryYear && (
                          <Text as="span" className="text-[10px] text-primary font-bold">
                            {texts.YEAR_OF_ENTRY} {athlete.entryYear}
                          </Text>
                        )}
                      </LayoutContainer>
                    </LayoutContainer>
                  );

                  if (athlete?.slug) {
                    return (
                      <Link key={member.athleteId} href={`/elenco/${athlete.slug}`} className="block h-full">
                        {cardContent}
                      </Link>
                    );
                  }

                  return (
                    <LayoutContainer key={member.athleteId} className="h-full">
                      {cardContent}
                    </LayoutContainer>
                  );
                })}
              </LayoutContainer>
            </LayoutContainer>
          );
        })
      )}

      {/* Comissão Técnica adicional cadastrada no texto do elenco */}
      {squad.staff && squad.staff.length > 0 && (
        <LayoutContainer className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3 mt-2">
          <Title level="h4" className="text-xs font-bold text-text-primary uppercase tracking-wider">
            <Text as="span">{texts.STAFF_SECTION_TITLE}</Text>
          </Title>
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {squad.staff.map((st, i) => (
              <LayoutContainer key={i} className="p-2.5 rounded-xl bg-background border border-border flex flex-col">
                <Text as="span" className="text-[11px] text-text-secondary font-bold uppercase">
                  {st.role}
                </Text>
                <Text as="span" className="text-xs font-semibold text-text-primary">
                  {st.name}
                </Text>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
