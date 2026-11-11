'use client';

import React from 'react';
import {
  LayoutContainer,
  Title,
  Text,
  Badge,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/shared/ui/components';
import { Check, X, AlertCircle, Shield, User, Award, Users } from 'lucide-react';
import {
  ROLES_PERMISSIONS_DATA,
  ROLE_USE_CASES,
  ROLES_MATRIX_TEXTS,
} from './RolesMatrixSection.constants';

export const RolesMatrixSection: React.FC = () => {
  const renderAccessBadge = (level: 'FULL' | 'PARTIAL' | 'NONE') => {
    switch (level) {
      case 'FULL':
        return (
          <Badge variant="success" size="sm" className="font-bold text-[10px] py-0.5 px-2 flex items-center gap-1 inline-flex">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>{ROLES_MATRIX_TEXTS.STATUS_FULL}</span>
          </Badge>
        );
      case 'PARTIAL':
        return (
          <Badge variant="warning" size="sm" className="font-bold text-[10px] py-0.5 px-2 flex items-center gap-1 inline-flex bg-amber-500/10 text-amber-400 border-amber-500/30">
            <AlertCircle className="w-3 h-3" />
            <span>{ROLES_MATRIX_TEXTS.STATUS_PARTIAL}</span>
          </Badge>
        );
      case 'NONE':
      default:
        return (
          <Badge variant="default" size="sm" className="font-semibold text-[10px] py-0.5 px-2 flex items-center gap-1 inline-flex opacity-50">
            <X className="w-3 h-3" />
            <span>{ROLES_MATRIX_TEXTS.STATUS_NONE}</span>
          </Badge>
        );
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Shield className="w-5 h-5 text-primary" />;
      case 'ADMIN':
        return <Award className="w-5 h-5 text-primary" />;
      case 'EDITOR':
        return <Users className="w-5 h-5 text-accent" />;
      case 'SOCIO':
        return <Shield className="w-5 h-5 text-emerald-400" />;
      case 'USER':
      default:
        return <User className="w-5 h-5 text-text-secondary" />;
    }
  };

  return (
    <LayoutContainer className="flex flex-col gap-8">
      {/* Header explicativo */}
      <LayoutContainer className="flex flex-col gap-1.5 p-5 rounded-2xl bg-surface border border-border">
        <Title level="h2" className="text-xl sm:text-2xl font-black text-text-primary">
          {ROLES_MATRIX_TEXTS.TITLE}
        </Title>
        <Text className="text-xs sm:text-sm text-text-secondary leading-relaxed">
          {ROLES_MATRIX_TEXTS.SUBTITLE}
        </Text>
      </LayoutContainer>

      {/* Cards de Casos de Uso */}
      <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ROLE_USE_CASES.map((uc) => (
          <LayoutContainer
            key={uc.role}
            className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col gap-3.5 hover:border-primary/50 transition-all"
          >
            <LayoutContainer className="flex items-center justify-between">
              <LayoutContainer className="flex items-center gap-2.5">
                <LayoutContainer className="w-10 h-10 rounded-xl bg-surface-hover border border-border flex items-center justify-center">
                  {getRoleIcon(uc.role)}
                </LayoutContainer>
                <LayoutContainer className="flex flex-col">
                  <Text className="text-xs font-mono font-bold text-primary">{uc.role}</Text>
                  <Text className="text-sm font-black text-text-primary">{uc.title}</Text>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            <Text className="text-xs text-text-secondary leading-relaxed">
              {uc.description}
            </Text>

            <LayoutContainer className="flex flex-col gap-1.5 pt-2 border-t border-border/60">
              <Text className="text-[11px] font-extrabold uppercase tracking-wider text-text-primary">
                Casos de Uso Práticos:
              </Text>
              <ul className="flex flex-col gap-1">
                {uc.examples.map((ex, i) => (
                  <li key={i} className="text-xs text-text-secondary flex items-start gap-1.5">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </LayoutContainer>
          </LayoutContainer>
        ))}
      </LayoutContainer>

      {/* Matriz Comparativa em Tabela */}
      <LayoutContainer className="flex flex-col gap-3">
        <Title level="h3" className="text-lg font-black text-text-primary px-1">
          Tabela Comparativa de Permissões por Funcionalidade
        </Title>

        <LayoutContainer className="bg-surface rounded-2xl border border-border shadow-xs overflow-hidden">
          <Table className="min-w-[700px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{ROLES_MATRIX_TEXTS.COL_RESOURCE}</TableHead>
                <TableHead className="text-center">{ROLES_MATRIX_TEXTS.COL_OWNER}</TableHead>
                <TableHead className="text-center">{ROLES_MATRIX_TEXTS.COL_ADMIN}</TableHead>
                <TableHead className="text-center">{ROLES_MATRIX_TEXTS.COL_EDITOR}</TableHead>
                <TableHead className="text-center">{ROLES_MATRIX_TEXTS.COL_SOCIO}</TableHead>
                <TableHead className="text-center">{ROLES_MATRIX_TEXTS.COL_USER}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ROLES_PERMISSIONS_DATA.map((row, idx) => (
                <TableRow key={idx} className="hover:bg-surface-hover/40 transition-colors">
                  <TableCell className="max-w-[280px]">
                    <LayoutContainer className="flex flex-col">
                      <Text className="text-xs font-bold text-text-primary">{row.resource}</Text>
                      {row.notes && (
                        <Text className="text-[11px] text-text-secondary mt-0.5 leading-snug">
                          {row.notes}
                        </Text>
                      )}
                    </LayoutContainer>
                  </TableCell>
                  <TableCell className="text-center">{renderAccessBadge(row.owner)}</TableCell>
                  <TableCell className="text-center">{renderAccessBadge(row.admin)}</TableCell>
                  <TableCell className="text-center">{renderAccessBadge(row.editor)}</TableCell>
                  <TableCell className="text-center">{renderAccessBadge(row.socio)}</TableCell>
                  <TableCell className="text-center">{renderAccessBadge(row.user)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};

