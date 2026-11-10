'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Crown, Users } from 'lucide-react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Spinner,
  SafeImage,
  DEFAULT_IDOL_COVER,
} from '@/shared/ui/components';
import { FEMALE_CONSTANTS } from '../../constants/female.constants';
import { SquadData, SquadMemberData } from '@/features/football/services/football.service';

export interface FemaleSquadDetailProps {
  squad: SquadData | null;
  hasAnyChampionship: boolean;
  isLoading: boolean;
  hasActiveSearch?: boolean;
  organizedSectors: {
    goalkeepers: SquadMemberData[];
    defenders: SquadMemberData[];
    midfielders: SquadMemberData[];
    forwards: SquadMemberData[];
  };
  staff?: Array<{ role: string; name: string }>;
}

export const FemaleSquadDetail: React.FC<FemaleSquadDetailProps> = ({
  squad,
  hasAnyChampionship,
  isLoading,
  hasActiveSearch = false,
  organizedSectors,
  staff = [],
}) => {
  const texts = FEMALE_CONSTANTS.SQUADS;

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
  ];

  const totalAthletes =
    organizedSectors.goalkeepers.length +
    organizedSectors.defenders.length +
    organizedSectors.midfielders.length +
    organizedSectors.forwards.length;

  return (
    <LayoutContainer className="flex flex-col gap-8 my-6">
      {/* Header do Elenco Selecionado */}
      <LayoutContainer className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <LayoutContainer className="flex flex-col gap-1">
          <LayoutContainer className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <Title level="h2" className="text-lg sm:text-xl font-bold text-text-primary">
              {squad.seasonName || `Temporada ${squad.year}`}
            </Title>
            {squad.isCurrent && (
              <Badge variant="primary" size="sm" className="font-extrabold uppercase text-[10px]">
                Em Disputa
              </Badge>
            )}
          </LayoutContainer>
          <Text as="p" className="text-xs text-text-secondary">
            {squad.coachName ? `${texts.COACH_LABEL} ${squad.coachName}` : ''}
          </Text>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-2">
          <Badge variant="default" size="sm" className="font-semibold text-xs">
            <Users className="w-3.5 h-3.5 mr-1 text-primary" />
            <Text as="span">{totalAthletes} {texts.ATHLETES_COUNT}</Text>
          </Badge>
        </LayoutContainer>
      </LayoutContainer>

      {/* Setores de Atletas */}
      {sectorGroups.map((group) => {
        if (group.members.length === 0) return null;

        return (
          <LayoutContainer key={group.title} className="flex flex-col gap-4">
            <LayoutContainer className="flex items-center gap-2 border-b border-border/60 pb-2">
              <Title level="h3" className="text-base sm:text-lg font-bold text-text-primary">
                {group.title}
              </Title>
              <Badge variant="default" size="sm" className="text-[11px]">
                {group.members.length}
              </Badge>
            </LayoutContainer>

            <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.members.map((member) => {
                const athlete = member.athlete;
                if (!athlete) return null;

                return (
                  <Link
                    key={`${athlete._id || athlete.id || member.athleteId}-${member.jerseyNumber ?? ''}`}
                    href={`/elenco/${athlete.slug}`}
                    className="group flex flex-col rounded-2xl bg-surface border border-border/80 hover:border-primary/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 focus:outline-none"
                  >
                    <LayoutContainer className="relative aspect-[3/4] w-full bg-surface-secondary overflow-hidden">
                      <SafeImage
                        src={athlete.photoUrl || DEFAULT_IDOL_COVER}
                        alt={athlete.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {member.jerseyNumber && (
                        <LayoutContainer className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-xs border border-border flex items-center justify-center font-black text-sm text-primary shadow-xs">
                          {member.jerseyNumber}
                        </LayoutContainer>
                      )}
                    </LayoutContainer>

                    <LayoutContainer className="p-3 flex flex-col gap-0.5">
                      <Title level="h4" className="text-xs sm:text-sm font-bold text-text-primary truncate group-hover:text-primary transition-colors">
                        {athlete.nickname || athlete.name}
                      </Title>
                      <Text as="span" className="text-[11px] text-text-secondary truncate">
                        {athlete.primaryPosition || group.title}
                      </Text>
                    </LayoutContainer>
                  </Link>
                );
              })}
            </LayoutContainer>
          </LayoutContainer>
        );
      })}

      {/* Comissão Técnica */}
      {staff && staff.length > 0 && (
        <LayoutContainer className="flex flex-col gap-4 mt-4">
          <LayoutContainer className="border-b border-border/60 pb-2">
            <Title level="h3" className="text-base sm:text-lg font-bold text-text-primary">
              {texts.STAFF_SECTION_TITLE}
            </Title>
          </LayoutContainer>
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {staff.map((st, idx) => (
              <LayoutContainer key={idx} className="p-4 rounded-xl bg-surface border border-border flex flex-col gap-1">
                <Text as="span" className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
                  {st.role}
                </Text>
                <Title level="h4" className="text-sm font-bold text-text-primary">
                  {st.name}
                </Title>
              </LayoutContainer>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
