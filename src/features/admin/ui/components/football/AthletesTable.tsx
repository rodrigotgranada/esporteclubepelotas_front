'use client';

import React from 'react';
import Link from 'next/link';
import { Edit2, Trash2, ExternalLink, Calendar, Ruler, User } from 'lucide-react';
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
import { AthleteData } from '@/features/football/services/football.service';
import { ADMIN_FOOTBALL_CONSTANTS } from '../../../constants/admin-football.constants';

export interface AthletesTableProps {
  athletes: AthleteData[];
  isLoading: boolean;
  page?: number;
  totalPages?: number;
  total?: number;
  limit?: number;
  onPageChange?: (newPage: number) => void;
  onEdit: (athlete: AthleteData) => void;
  onDelete: (athlete: AthleteData) => void;
}

export const AthletesTable: React.FC<AthletesTableProps> = ({
  athletes,
  isLoading,
  page = 1,
  totalPages = 1,
  total = 0,
  limit = 15,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const texts = ADMIN_FOOTBALL_CONSTANTS.ATHLETES_TAB;

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center py-20 gap-3">
        <Spinner size={32} />
        <Text as="p" className="text-xs font-semibold text-text-muted">
          Carregando banco de atletas...
        </Text>
      </LayoutContainer>
    );
  }

  if (athletes.length === 0) {
    return (
      <LayoutContainer className="p-12 text-center rounded-3xl bg-surface border border-border flex flex-col items-center justify-center gap-2">
        <LayoutContainer className="p-3 rounded-2xl bg-background border border-border text-primary mb-1">
          <User className="w-8 h-8 opacity-40 text-primary" />
        </LayoutContainer>
        <Title level="h3" className="text-base font-bold text-text-primary">
          {texts.EMPTY_TITLE}
        </Title>
        <Text as="p" className="text-xs text-text-muted max-w-sm">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Desktop Table View */}
      <LayoutContainer className="hidden md:block rounded-2xl border border-border overflow-hidden bg-surface">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-border bg-background/50 text-text-muted uppercase tracking-wider font-extrabold text-[11px]">
              <th className="py-3 px-4">{texts.COLUMN_PHOTO}</th>
              <th className="py-3 px-4">{texts.COLUMN_POSITION}</th>
              <th className="py-3 px-4">{texts.COLUMN_AGE}</th>
              <th className="py-3 px-4">{texts.COLUMN_PHYSICAL}</th>
              <th className="py-3 px-4 text-right">{texts.COLUMN_ACTIONS}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {athletes.map((athlete) => (
              <tr key={athlete.id || athlete._id} className="hover:bg-background/40 transition-colors">
                {/* Atleta Info & Foto */}
                <td className="py-3 px-4">
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="relative w-11 h-14 rounded-xl overflow-hidden bg-background border border-border shrink-0">
                      <SafeImage
                        src={athlete.photoUrl}
                        fallbackSrc={DEFAULT_IDOL_COVER}
                        alt={athlete.nickname || athlete.name}
                        fill
                        className="object-cover object-top"
                      />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <Text as="span" className="font-extrabold text-sm text-text-primary">
                        {athlete.nickname || athlete.name}
                      </Text>
                      {athlete.nickname && (
                        <Text as="span" className="text-[11px] text-text-muted">
                          {athlete.name}
                        </Text>
                      )}
                    </LayoutContainer>
                  </LayoutContainer>
                </td>

                {/* Posição */}
                <td className="py-3 px-4">
                  <LayoutContainer className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="primary" size="sm" className="font-bold text-[10px] uppercase">
                      {athlete.athleteType === 'STAFF' ? (athlete.staffRole || 'Comissão Técnica') : athlete.primaryPosition}
                    </Badge>
                    {athlete.isRetired && (
                      <Badge variant="default" size="sm" className="font-bold text-[10px] uppercase text-text-muted">
                        {texts.BADGE_RETIRED}
                      </Badge>
                    )}
                  </LayoutContainer>
                </td>

                {/* Idade / Nascimento */}
                <td className="py-3 px-4">
                  <LayoutContainer className="flex flex-col">
                    <Text as="span" className="font-bold text-text-primary">
                      {athlete.age ? `${athlete.age} anos` : '-'}
                    </Text>
                    {athlete.birthPlace && (
                      <Text as="span" className="text-[11px] text-text-muted">
                        {athlete.birthPlace}
                      </Text>
                    )}
                  </LayoutContainer>
                </td>

                {/* Físico (Altura / Pé) */}
                <td className="py-3 px-4">
                  <LayoutContainer className="flex flex-col text-text-secondary text-[11px]">
                    <span>{athlete.height ? `${athlete.height} cm` : '-'}</span>
                    <span className="text-text-muted">Pé: {athlete.preferredFoot}</span>
                  </LayoutContainer>
                </td>

                {/* Ações */}
                <td className="py-3 px-4 text-right">
                  <LayoutContainer className="inline-flex items-center gap-1.5 justify-end">
                    <Link href={`/elenco/${athlete.slug}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="p-1.5 text-text-muted hover:text-primary">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(athlete)}
                      className="p-1.5 text-text-muted hover:text-text-primary"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(athlete)}
                      className="p-1.5 text-text-muted hover:text-primary"
                    >
                      <Trash2 className="w-4 h-4 text-[#ea580c]" />
                    </Button>
                  </LayoutContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </LayoutContainer>

      {/* Mobile Cards View */}
      <LayoutContainer className="grid grid-cols-1 gap-3 md:hidden">
        {athletes.map((athlete) => (
          <LayoutContainer
            key={athlete.id || athlete._id}
            className="p-4 rounded-2xl bg-surface border border-border flex items-center justify-between gap-3 shadow-xs"
          >
            <LayoutContainer className="flex items-center gap-3">
              <LayoutContainer className="relative w-12 h-16 rounded-xl overflow-hidden bg-background border border-border shrink-0">
                <SafeImage
                  src={athlete.photoUrl}
                  fallbackSrc={DEFAULT_IDOL_COVER}
                  alt={athlete.nickname || athlete.name}
                  fill
                  className="object-cover object-top"
                />
              </LayoutContainer>
              <LayoutContainer className="flex flex-col gap-0.5">
                <Text as="span" className="font-extrabold text-sm text-text-primary">
                  {athlete.nickname || athlete.name}
                </Text>
                <LayoutContainer className="flex items-center gap-1.5 flex-wrap">
                  <Badge variant="primary" size="sm" className="w-fit text-[9px] uppercase font-bold py-0">
                    {athlete.athleteType === 'STAFF' ? (athlete.staffRole || 'Comissão Técnica') : athlete.primaryPosition}
                  </Badge>
                  {athlete.isRetired && (
                    <Badge variant="default" size="sm" className="w-fit text-[9px] uppercase font-bold py-0 text-text-muted">
                      {texts.BADGE_RETIRED}
                    </Badge>
                  )}
                </LayoutContainer>
                {athlete.age ? (
                  <Text as="span" className="text-[11px] text-text-muted">
                    {athlete.age} anos • {athlete.birthPlace || ''}
                  </Text>
                ) : null}
              </LayoutContainer>
            </LayoutContainer>

            <LayoutContainer className="flex flex-col gap-1 items-end">
              <Link href={`/elenco/${athlete.slug}`} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="p-1.5 text-text-muted hover:text-primary">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </Link>
              <LayoutContainer className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(athlete)}
                  className="p-1.5 text-text-muted"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(athlete)}
                  className="p-1.5 text-text-muted"
                >
                  <Trash2 className="w-4 h-4 text-[#ea580c]" />
                </Button>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>
        ))}
      </LayoutContainer>

      {/* Pagination Footer */}
      {totalPages > 1 && onPageChange && (
        <LayoutContainer className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-surface border border-border">
          <Text as="p" className="text-xs text-text-muted">
            {texts.PAGINATION_SHOWING} {(page - 1) * limit + 1} {texts.PAGINATION_TO}{' '}
            {Math.min(page * limit, total)} {texts.PAGINATION_OF} {total} {texts.PAGINATION_ATHLETES}
          </Text>

          <LayoutContainer className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="text-xs px-3 py-1 font-bold disabled:opacity-40"
            >
              {texts.PAGINATION_PREV}
            </Button>
            <Text as="span" className="text-xs font-bold text-text-primary px-2">
              {texts.PAGINATION_PAGE} {page} {texts.PAGINATION_OF} {totalPages}
            </Text>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="text-xs px-3 py-1 font-bold disabled:opacity-40"
            >
              {texts.PAGINATION_NEXT}
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
