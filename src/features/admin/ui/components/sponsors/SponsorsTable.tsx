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
}

export const SponsorsTable: React.FC<SponsorsTableProps> = ({
  sponsors,
  isLoading,
  page,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
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

  if (isLoading) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-16 rounded-2xl bg-surface border border-border">
        <Spinner size={36} />
        <Text as="p" className="text-text-secondary font-medium mt-4">
          Carregando patrocinadores...
        </Text>
      </LayoutContainer>
    );
  }

  if (sponsors.length === 0) {
    return (
      <LayoutContainer className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-surface border border-border">
        <LayoutContainer className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </LayoutContainer>
        <Title level="h3" className="text-lg font-bold text-text-primary">
          {texts.EMPTY_TITLE}
        </Title>
        <Text as="p" className="text-sm text-text-secondary max-w-sm mt-1">
          {texts.EMPTY_DESC}
        </Text>
      </LayoutContainer>
    );
  }

  return (
    <LayoutContainer className="flex flex-col gap-4">
      {/* Tabela Desktop & Tablet */}
      <LayoutContainer className="overflow-x-auto rounded-2xl bg-surface border border-border shadow-xs">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="border-b border-border bg-surface/50">
              <TableHead className="py-3 px-4 font-bold text-xs uppercase text-text-secondary">
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
            {sponsors.map((sponsor) => (
              <TableRow
                key={sponsor.id}
                className="border-b border-border/50 hover:bg-background/50 transition-colors"
              >
                {/* Logo */}
                <TableCell className="py-3 px-4">
                  <LayoutContainer className="relative w-12 h-10 rounded-lg bg-surface/80 border border-border/60 p-1 flex items-center justify-center overflow-hidden">
                    <SafeImage
                      src={sponsor.logoUrl}
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

                {/* Ordem Manual */}
                <TableCell className="py-3 px-4 text-center">
                  <Text as="span" className="text-xs font-mono font-bold text-text-secondary">
                    #{sponsor.displayOrder ?? 0}
                  </Text>
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
