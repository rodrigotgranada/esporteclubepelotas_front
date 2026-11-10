'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Text,
  Badge,
  Button,
  Input,
  Select,
  Option,
} from '@/shared/ui/components/atoms';
import { Radio } from 'lucide-react';
import { SafeImage } from '@/shared/ui/components/molecules/SafeImage';
import { Championship, Match } from '../../../types/matches.types';
import { MATCHES_CONSTANTS, DEFAULT_OPPONENT_BADGE } from '../../../constants/matches.constants';

export interface AdminMatchesTableProps {
  matches: Match[];
  championships: Championship[];
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  championshipFilter: string;
  onChampionshipFilterChange: (value: string) => void;
  onOpenCreate: () => void;
  onEdit: (match: Match) => void;
  onDelete: (match: Match) => void;
}

export const AdminMatchesTable: React.FC<AdminMatchesTableProps> = ({
  matches,
  championships,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  championshipFilter,
  onChampionshipFilterChange,
  onOpenCreate,
  onEdit,
  onDelete,
}) => {
  const { MATCHES_TABLE } = MATCHES_CONSTANTS.ADMIN;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PROGRESS':
        return <Badge variant="default" className="bg-secondary text-primary font-bold animate-pulse">Ao Vivo</Badge>;
      case 'FINISHED':
        return <Badge variant="default" className="border-border text-text-muted">Encerrado</Badge>;
      case 'SCHEDULED':
        return <Badge variant="default" className="border-secondary/50 text-secondary">Agendado</Badge>;
      case 'POSTPONED':
        return <Badge variant="default" className="bg-amber-600/20 text-amber-500 border border-amber-500/30">Adiado</Badge>;
      case 'CANCELLED':
        return <Badge variant="default" className="bg-orange-600/20 text-orange-500 border border-orange-500/30">Cancelado</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <LayoutContainer className="space-y-4">
      {/* Barra de Filtros e Ação */}
      <LayoutContainer className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <LayoutContainer className="flex flex-wrap items-center gap-3 flex-1">
          <Input
            placeholder={MATCHES_TABLE.SEARCH_PLACEHOLDER}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-64"
          />

          <Select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full sm:w-44"
          >
            <Option value="ALL">{MATCHES_TABLE.STATUS_FILTER_ALL}</Option>
            <Option value="SCHEDULED">Agendado</Option>
            <Option value="IN_PROGRESS">Ao Vivo</Option>
            <Option value="FINISHED">Encerrado</Option>
            <Option value="POSTPONED">Adiado</Option>
            <Option value="CANCELLED">Cancelado</Option>
          </Select>

          <Select
            value={championshipFilter}
            onChange={(e) => onChampionshipFilterChange(e.target.value)}
            className="w-full sm:w-52"
          >
            <Option value="ALL">Todos os Campeonatos</Option>
            {championships.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.name} {c.seasonYear}
              </Option>
            ))}
          </Select>
        </LayoutContainer>

        <Button
          onClick={onOpenCreate}
          variant="primary"
          className="bg-secondary text-primary hover:bg-secondary-hover font-bold px-5 py-2 rounded-xl shadow-md shrink-0"
        >
          + {MATCHES_TABLE.ADD_MATCH_BUTTON}
        </Button>
      </LayoutContainer>

      {/* Tabela de Dados */}
      <LayoutContainer className="rounded-2xl border border-border/60 bg-surface-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{MATCHES_TABLE.OPPONENT}</TableHead>
              <TableHead>{MATCHES_TABLE.CHAMPIONSHIP}</TableHead>
              <TableHead>{MATCHES_TABLE.DATE_TIME}</TableHead>
              <TableHead>{MATCHES_TABLE.STADIUM}</TableHead>
              <TableHead>{MATCHES_TABLE.STATUS}</TableHead>
              <TableHead>{MATCHES_TABLE.SCORE}</TableHead>
              <TableHead className="text-right">{MATCHES_TABLE.ACTIONS}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-text-muted text-sm">
                  {MATCHES_TABLE.EMPTY_STATE}
                </TableCell>
              </TableRow>
            ) : (
              matches.map((match) => (
                <TableRow key={match.id} className="hover:bg-surface-hover/50">
                  <TableCell>
                    <LayoutContainer className="flex items-center space-x-3">
                      <LayoutContainer className="w-8 h-8 rounded-lg bg-surface-hover border border-border/50 flex items-center justify-center p-1">
                        <SafeImage
                          src={match.opponentLogoUrl || DEFAULT_OPPONENT_BADGE}
                          alt={match.opponentName}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </LayoutContainer>
                      <LayoutContainer>
                        <Text className="text-sm font-bold text-text-primary block">
                          {match.opponentName}
                        </Text>
                        <Text className="text-[11px] text-text-muted block">
                          {match.homeAway === 'HOME' ? 'Casa (Mandante)' : 'Fora (Visitante)'}
                        </Text>
                      </LayoutContainer>
                    </LayoutContainer>
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs font-semibold text-text-primary block">
                      {match.championshipName || '-'}
                    </Text>
                    <Text className="text-[11px] text-text-muted block">{match.roundName}</Text>
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs text-text-primary">{formatDate(match.matchDate)}</Text>
                  </TableCell>

                  <TableCell>
                    <Text className="text-xs text-text-primary block">{match.stadiumName}</Text>
                    {match.city && (
                      <Text className="text-[11px] text-text-muted block">{match.city}</Text>
                    )}
                  </TableCell>

                  <TableCell>{getStatusBadge(match.status)}</TableCell>

                  <TableCell>
                    {match.status === 'FINISHED' || match.status === 'IN_PROGRESS' ? (
                      <Text className="text-sm font-bold text-text-primary">
                        {match.homeAway === 'HOME'
                          ? `${match.pelotasScore ?? 0} x ${match.opponentScore ?? 0}`
                          : `${match.opponentScore ?? 0} x ${match.pelotasScore ?? 0}`}
                      </Text>
                    ) : (
                      <Text className="text-xs text-text-muted">-</Text>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <LayoutContainer className="flex items-center justify-end space-x-2">
                      {match.hasLiveCoverage && (
                        <Link href={`/gestao/jogos/${match.id}/narrador`}>
                          <Button
                            type="button"
                            variant="custom"
                            size="none"
                            className="text-xs font-bold bg-secondary/15 text-secondary hover:bg-secondary/25 border border-secondary/40 px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1 shadow-2xs"
                            title="Abrir Painel do Narrador (Minuto a Minuto Ao Vivo)"
                          >
                            <Radio size={12} className={match.status === 'IN_PROGRESS' ? 'animate-pulse text-secondary' : ''} />
                            Narrador
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="ghost"
                        onClick={() => onEdit(match)}
                        className="text-xs text-secondary hover:text-secondary-hover px-2 py-1 h-auto"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => onDelete(match)}
                        className="text-xs text-orange-500 hover:text-orange-400 px-2 py-1 h-auto"
                      >
                        Excluir
                      </Button>
                    </LayoutContainer>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </LayoutContainer>
    </LayoutContainer>
  );
};
