'use client';

import React from 'react';
import Link from 'next/link';
import {
  Edit3,
  Trash2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MousePointerClick,
  Calendar,
} from 'lucide-react';
import {
  LayoutContainer,
  Text,
  Title,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Badge,
  Button,
  Spinner,
  SafeImage,
} from '@/shared/ui/components';
import { ADMIN_SPONSORS_TEXTS } from '../../../constants/admin-sponsors.constants';
import { Sponsor, SponsorStatus } from '@/features/sponsors/types/sponsors.types';

export interface SponsorsTableProps {
  sponsors: Sponsor[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (sponsor: Sponsor) => void;
  onMoveUp?: (sponsor: Sponsor) => void;
  onMoveDown?: (sponsor: Sponsor) => void;
  isReordering?: boolean;
}

export const SponsorsTable: React.FC<SponsorsTableProps> = ({
  sponsors,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  isReordering = false,
}) => {
  const texts = ADMIN_SPONSORS_TEXTS.TABLE;

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return '';
    try {
      const datePart = dateStr.slice(0, 10);
      const [year, month, day] = datePart.split('-');
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const getContractText = (sponsor: Sponsor): string => {
    const start = formatDate(sponsor.contractStartDate);
    const end = formatDate(sponsor.contractEndDate);
    if (!start && !end) return texts.NO_DATES;
    if (start && end) return `${start} ${texts.UNTIL} ${end}`;
    if (start) return `${texts.FROM} ${start}`;
    return `${texts.UNTIL} ${end}`;
  };

  const getStatusBadge = (status: SponsorStatus) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="success" size="sm" className="font-bold">
            {texts.STATUS_LABELS.ACTIVE}
          </Badge>
        );
      case 'SCHEDULED':
        return (
          <Badge variant="primary" size="sm" className="font-bold">
            {texts.STATUS_LABELS.SCHEDULED}
          </Badge>
        );
      case 'EXPIRED':
        return (
          <Badge variant="warning" size="sm" className="font-bold text-orange-600 bg-orange-500/10 border-orange-500/20">
            {texts.STATUS_LABELS.EXPIRED}
          </Badge>
        );
      case 'INACTIVE':
      default:
        return (
          <Badge variant="default" size="sm" className="font-bold text-text-secondary">
            {texts.STATUS_LABELS.INACTIVE}
          </Badge>
        );
    }
  };

  if (isLoading && sponsors.length === 0) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-16 rounded-2xl bg-surface border border-border">
        <Spinner size={36} />
        <Text as="p" className="text-text-secondary mt-3 text-sm">
          Carregando patrocinadores oficiais...
        </Text>
      </LayoutContainer>
    );
  }

  if (!isLoading && sponsors.length === 0) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-12 sm:p-16 rounded-2xl bg-surface border border-border text-center">
        <Title level="h3" className="text-base sm:text-lg font-bold text-text-primary">
          {texts.EMPTY_TITLE}
        </Title>
        <Text as="p" className="text-text-secondary text-sm max-w-md mt-1">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Container de Tabela com Scroll Horizontal Suave */}
      <LayoutContainer className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
        <Table className="w-full text-left border-collapse">
          <TableHeader className="border-b border-border bg-surface/50">
            <TableRow>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary w-20">
                {texts.COL_LOGO}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary">
                {texts.COL_NAME}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary">
                {texts.COL_CONTRACT}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary text-center">
                {texts.COL_CLICKS}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary text-center">
                {texts.COL_ORDER}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary text-center">
                {texts.COL_FEATURED}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary text-center">
                {texts.COL_STATUS}
              </TableHead>
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary text-right">
                {texts.COL_ACTIONS}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sponsors.map((sponsor, index) => (
              <TableRow
                key={sponsor.id}
                className="border-b border-border/50 hover:bg-background/50 transition-colors"
              >
                {/* Logo */}
                <TableCell className="py-3 px-4">
                  <LayoutContainer className="relative w-12 h-10 rounded-lg bg-surface/80 border border-border/60 p-1 flex items-center justify-center overflow-hidden">
                    <SafeImage
                      src={sponsor.logoUrl || sponsor.logoDarkUrl || '/images/pelotas-logo.png'}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      fallbackSrc="/images/pelotas-logo.png"
                    />
                  </LayoutContainer>
                </TableCell>

                {/* Nome & Website */}
                <TableCell className="py-3 px-4">
                  <LayoutContainer className="flex flex-col">
                    <Text as="span" className="font-bold text-sm text-text-primary">
                      {sponsor.name}
                    </Text>
                    {sponsor.websiteUrl && (
                      <Link
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                      >
                        <Text as="span" className="line-clamp-1 max-w-[200px]">
                          {sponsor.websiteUrl.replace(/^https?:\/\//, '')}
                        </Text>
                        <ExternalLink size={10} className="shrink-0" />
                      </Link>
                    )}
                  </LayoutContainer>
                </TableCell>

                {/* Vigência Contratual */}
                <TableCell className="py-3 px-4">
                  <LayoutContainer className="flex items-center gap-1.5 text-xs text-text-secondary">
                    <Calendar size={13} className="shrink-0 text-text-secondary/70" />
                    <Text as="span">{getContractText(sponsor)}</Text>
                  </LayoutContainer>
                </TableCell>

                {/* Contagem de Cliques */}
                <TableCell className="py-3 px-4 text-center">
                  <LayoutContainer className="inline-flex items-center gap-1 text-xs font-bold text-text-secondary bg-surface px-2.5 py-1 rounded-full border border-border">
                    <MousePointerClick size={12} className="text-primary" />
                    <Text as="span">{sponsor.clicksCount || 0}</Text>
                  </LayoutContainer>
                </TableCell>

                {/* Ordem Manual com Botões Rápidos de Subir / Descer */}
                <TableCell className="py-3 px-4 text-center">
                  <LayoutContainer className="inline-flex items-center gap-1.5 justify-center">
                    <Text as="span" className="text-xs font-mono font-bold text-text-secondary min-w-[20px]">
                      #{sponsor.displayOrder ?? 0}
                    </Text>
                    {onMoveUp && onMoveDown && (
                      <LayoutContainer className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          onClick={() => onMoveUp(sponsor)}
                          disabled={index === 0 || isReordering}
                          className="p-0.5 rounded hover:bg-primary/20 text-text-secondary hover:text-primary disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                          title={texts.TOOLTIP_MOVE_UP}
                          aria-label={texts.TOOLTIP_MOVE_UP}
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMoveDown(sponsor)}
                          disabled={index === sponsors.length - 1 || isReordering}
                          className="p-0.5 rounded hover:bg-primary/20 text-text-secondary hover:text-primary disabled:opacity-20 disabled:pointer-events-none cursor-pointer transition-colors"
                          title={texts.TOOLTIP_MOVE_DOWN}
                          aria-label={texts.TOOLTIP_MOVE_DOWN}
                        >
                          <ChevronDown size={13} />
                        </button>
                      </LayoutContainer>
                    )}
                  </LayoutContainer>
                </TableCell>

                {/* Destaque Ticker (Somente Leitura / Consulta) */}
                <TableCell className="py-3 px-4 text-center">
                  {(sponsor.isFeatured ?? (sponsor as any).featured) ? (
                    <Badge variant="primary" size="sm" className="font-bold inline-flex items-center gap-1">
                      <Sparkles size={11} />
                      {texts.FEATURED_LABEL}
                    </Badge>
                  ) : (
                    <Badge variant="default" size="sm" className="text-text-secondary font-medium">
                      Comum
                    </Badge>
                  )}
                </TableCell>

                {/* Status Contratual (Somente Leitura / Consulta) */}
                <TableCell className="py-3 px-4 text-center">
                  <LayoutContainer className="inline-flex justify-center">
                    {getStatusBadge(sponsor.status)}
                  </LayoutContainer>
                </TableCell>

                {/* Ações */}
                <TableCell className="py-3 px-4 text-right">
                  <LayoutContainer className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(sponsor)}
                      className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-background rounded-lg"
                      title={texts.TOOLTIP_EDIT}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(sponsor)}
                      className="p-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-500/10 rounded-lg"
                      title={texts.TOOLTIP_DELETE}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </LayoutContainer>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LayoutContainer>

      {/* Paginação */}
      {totalPages > 1 && (
        <LayoutContainer className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-border">
          <Text as="span" className="text-xs text-text-secondary">
            Página {page} de {totalPages}
          </Text>
          <LayoutContainer className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Próxima
            </Button>
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
