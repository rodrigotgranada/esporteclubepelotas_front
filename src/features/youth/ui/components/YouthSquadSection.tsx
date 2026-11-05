'use client';

import React from 'react';
import { Users, User, Shield, AlertCircle } from 'lucide-react';
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
  isLoading: boolean;
  organizedSectors: {
    goalkeepers: SquadMemberData[];
    defenders: SquadMemberData[];
    midfielders: SquadMemberData[];
    forwards: SquadMemberData[];
  };
}

export const YouthSquadSection: React.FC<YouthSquadSectionProps> = ({
  squad,
  isLoading,
  organizedSectors,
}) => {
  const texts = YOUTH_CONSTANTS.SQUADS;

  if (isLoading) {
    return (
      <LayoutContainer className="py-16 flex flex-col items-center justify-center gap-3">
        <Spinner size={32} />
        <Text as="span" className="text-xs text-text-muted">
          Carregando elenco da base...
        </Text>
      </LayoutContainer>
    );
  }

  if (!squad || (!squad.members || squad.members.length === 0)) {
    return (
      <LayoutContainer className="p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center flex flex-col items-center gap-3 my-4 shadow-xs">
        <LayoutContainer className="p-4 rounded-2xl bg-surface-secondary text-text-muted">
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

  return (
    <LayoutContainer className="flex flex-col gap-8 my-6">
      {/* Informações da Temporada e Comissão da Categoria */}
      <LayoutContainer className="p-5 sm:p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <LayoutContainer className="flex flex-col gap-1">
          <Title level="h3" className="text-lg sm:text-xl font-black text-text-primary">
            {squad.seasonName || `Temporada ${squad.year}`}
          </Title>
          <LayoutContainer className="flex items-center gap-2 text-xs text-text-secondary">
            <Text as="span" className="font-bold text-text-primary">
              {texts.COACH_LABEL}
            </Text>
            <Text as="span">{squad.coachName || texts.NOT_INFORMED}</Text>
          </LayoutContainer>
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3">
          <Badge variant="default" className="text-xs font-bold px-3 py-1 bg-surface-secondary border-border flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <Text as="span">
              {squad.members.length} {texts.ATHLETES_COUNT}
            </Text>
          </Badge>
        </LayoutContainer>
      </LayoutContainer>

      {/* Grid de Atletas por Setores Táticos */}
      {sectorGroups.map((group) => {
        if (group.members.length === 0) return null;

        return (
          <LayoutContainer key={group.title} className="flex flex-col gap-4">
            <LayoutContainer className="flex items-center gap-2 border-b border-border/60 pb-2">
              <Shield className="w-4 h-4 text-primary" />
              <Title level="h4" className="text-sm font-extrabold text-text-primary uppercase tracking-wider">
                {group.title} ({group.members.length})
              </Title>
            </LayoutContainer>

            <LayoutContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {group.members.map((member) => {
                const athlete = member.athlete;
                const photo = athlete?.photoUrl || DEFAULT_IDOL_COVER;
                const athleteName = athlete?.nickname || athlete?.name || 'Atleta da Base';

                return (
                  <LayoutContainer
                    key={member.athleteId}
                    className="group relative flex flex-col rounded-2xl bg-surface border border-border/80 overflow-hidden hover:border-primary/50 transition-all shadow-2xs hover:shadow-sm"
                  >
                    {/* Imagem do Atleta Proporção 3:4 */}
                    <LayoutContainer className="relative aspect-[3/4] w-full overflow-hidden bg-surface-secondary">
                      <SafeImage
                        src={photo}
                        alt={athleteName}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        fallbackSrc={DEFAULT_IDOL_COVER}
                      />
                      {/* Número da Camisa */}
                      <LayoutContainer className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-surface/90 backdrop-blur-xs border border-border font-black text-xs text-text-primary shadow-xs">
                        #{member.jerseyNumber}
                      </LayoutContainer>
                    </LayoutContainer>

                    {/* Dados Básicos */}
                    <LayoutContainer className="p-3 flex flex-col gap-1">
                      <Text as="span" className="font-black text-xs sm:text-sm text-text-primary truncate">
                        {athleteName}
                      </Text>
                      <Text as="span" className="text-[11px] text-text-muted truncate">
                        {athlete?.primaryPosition || 'Atleta'}
                      </Text>

                      {athlete?.entryYear && (
                        <Text as="span" className="text-[10px] text-primary font-bold">
                          {texts.YEAR_OF_ENTRY} {athlete.entryYear}
                        </Text>
                      )}
                    </LayoutContainer>
                  </LayoutContainer>
                );
              })}
            </LayoutContainer>
          </LayoutContainer>
        );
      })}

      {/* Comissão Técnica Completa se houver */}
      {squad.staff && squad.staff.length > 0 && (
        <LayoutContainer className="p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3 mt-4">
          <Title level="h4" className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-primary" />
            <Text as="span">Comissão Técnica da Categoria</Text>
          </Title>
          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {squad.staff.map((st, i) => (
              <LayoutContainer key={i} className="p-2.5 rounded-xl bg-surface-secondary border border-border flex flex-col">
                <Text as="span" className="text-[11px] text-text-muted font-bold uppercase">
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
