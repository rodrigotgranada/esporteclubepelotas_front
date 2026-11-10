import React from 'react';
import { LayoutContainer, Title, Text } from '@/shared/ui/components/atoms';
import { Championship } from '../../types/matches.types';
import { MATCHES_CONSTANTS } from '../../constants/matches.constants';

export interface MatchesOfficialLinksProps {
  championship: Championship | null;
}

export const MatchesOfficialLinks: React.FC<MatchesOfficialLinksProps> = ({ championship }) => {
  if (!championship) return null;

  const { OFFICIAL_LINKS } = MATCHES_CONSTANTS.PUBLIC;
  const hasRegulations = championship.regulations && championship.regulations.length > 0;
  const hasTableUrl = Boolean(championship.tableUrl);

  if (!hasTableUrl && !hasRegulations) {
    return null;
  }

  return (
    <LayoutContainer className="rounded-2xl bg-surface-card border border-primary/20 p-6 md:p-8 mt-12 shadow-md">
      <LayoutContainer className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/50">
        <LayoutContainer className="space-y-1">
          <Title level="h2" className="text-xl md:text-2xl font-bold text-text-primary">
            {OFFICIAL_LINKS.SECTION_TITLE}
          </Title>
          <Text className="text-xs md:text-sm text-text-muted">
            {OFFICIAL_LINKS.TABLE_DESCRIPTION}
          </Text>
        </LayoutContainer>

        {hasTableUrl && (
          <a
            href={championship.tableUrl!}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-secondary text-primary hover:bg-secondary-hover font-bold px-6 py-3 rounded-xl shadow-md shrink-0 transition-colors cursor-pointer"
          >
            📊 {OFFICIAL_LINKS.VIEW_TABLE_BUTTON}
          </a>
        )}
      </LayoutContainer>

      {/* Regulamentos e Diretrizes */}
      {hasRegulations && (
        <LayoutContainer className="pt-6 space-y-4">
          <Text className="text-xs md:text-sm font-semibold uppercase tracking-wider text-secondary">
            {OFFICIAL_LINKS.REGULATIONS_TITLE}
          </Text>

          <LayoutContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {championship.regulations!.map((reg, index) => (
              <a
                key={index}
                href={reg.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-4 rounded-xl border border-border/60 hover:border-primary/50 hover:bg-surface-hover group transition-all text-left bg-surface/40"
              >
                <LayoutContainer className="w-8 h-8 rounded-lg bg-primary/20 text-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  📄
                </LayoutContainer>
                <LayoutContainer className="flex-1 min-w-0">
                  <Text className="text-xs md:text-sm font-semibold text-text-primary group-hover:text-secondary truncate block">
                    {reg.title}
                  </Text>
                  <Text className="text-[11px] text-text-muted block">
                    Abrir documento oficial ↗
                  </Text>
                </LayoutContainer>
              </a>
            ))}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
