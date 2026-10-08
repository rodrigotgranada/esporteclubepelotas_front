'use client';

import React from 'react';
import { LayoutContainer, Title, Text, Button, Table, TableHeader, TableRow, TableHead, TableBody, TableCell, Badge, Spinner } from '@/shared/ui/components';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { ModuleMobileCard } from '../../components/modules/ModuleMobileCard';
import { useSystemModulesList } from '../../../hooks/useSystemModulesList';
import { SYSTEM_MODULES_FEATURE_TEXTS } from './SystemModulesFeature.constants';

export const SystemModulesFeature = () => {
  const { modules, isLoading, handleToggleStatus } = useSystemModulesList();
  return (
    <LayoutContainer className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LayoutContainer>
        <Title level="h1" className="text-3xl font-black text-text-primary">{SYSTEM_MODULES_FEATURE_TEXTS.TITLE}</Title>
        <Text className="text-text-secondary mt-1">{SYSTEM_MODULES_FEATURE_TEXTS.SUBTITLE}</Text>
      </LayoutContainer>

      <LayoutContainer className="mt-6 flex flex-col gap-4 w-full min-w-0">
        {/* Mobile/Tablet View */}
        <LayoutContainer className="flex flex-col gap-4 xl:hidden">
          {modules.map((mod, index) => {
            let uniqueKey = mod.slug || mod.key || mod.name || `module-${index}`;
            if (typeof mod._id === 'string') uniqueKey = mod._id;
            else if (mod._id && typeof mod._id.toString === 'function' && mod._id.toString() !== '[object Object]') uniqueKey = mod._id.toString();
            return <ModuleMobileCard key={uniqueKey} mod={mod} onToggleStatus={handleToggleStatus} />;
          })}
          {isLoading ? (
            <Spinner text="Carregando módulos..." className="bg-surface border border-border rounded-xl" />
          ) : modules.length === 0 && (
            <LayoutContainer className="bg-surface border border-border rounded-xl p-8 text-center text-text-secondary">
              {SYSTEM_MODULES_FEATURE_TEXTS.EMPTY_STATE}
            </LayoutContainer>
          )}
        </LayoutContainer>

        {/* Desktop View */}
        <LayoutContainer className="hidden xl:block w-full min-w-0 bg-surface border border-border rounded-2xl overflow-hidden">
          <LayoutContainer className="overflow-x-auto w-full">
          <Table className="min-w-[800px] w-full">
            <TableHeader>
              <TableRow>
                <TableHead>{SYSTEM_MODULES_FEATURE_TEXTS.TABLE_HEADERS.MODULE}</TableHead>
                <TableHead>{SYSTEM_MODULES_FEATURE_TEXTS.TABLE_HEADERS.DESCRIPTION}</TableHead>
                <TableHead>{SYSTEM_MODULES_FEATURE_TEXTS.TABLE_HEADERS.KEY}</TableHead>
                <TableHead>{SYSTEM_MODULES_FEATURE_TEXTS.TABLE_HEADERS.STATUS}</TableHead>
                <TableHead className="text-right">{SYSTEM_MODULES_FEATURE_TEXTS.TABLE_HEADERS.ACTIONS}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modules.map((mod, index) => {
                let uniqueKey = mod.slug || mod.key || mod.name || `module-${index}`;
                if (typeof mod._id === 'string') uniqueKey = mod._id;
                else if (mod._id && typeof mod._id.toString === 'function' && mod._id.toString() !== '[object Object]') uniqueKey = mod._id.toString();

                const moduleIdentifier = mod.slug || mod.key || uniqueKey;
                return (
                  <TableRow key={uniqueKey}>
                    <TableCell>
                      <Text className="text-sm font-bold text-text-primary">{mod.name}</Text>
                    </TableCell>
                    <TableCell className="text-sm text-text-secondary">{mod.description}</TableCell>
                    <TableCell>
                      <Badge variant="default" size="sm">{moduleIdentifier}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={mod.isActive ? 'success' : 'default'} size="md">
                        {mod.isActive ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
                        {mod.isActive ? SYSTEM_MODULES_FEATURE_TEXTS.STATUS.ACTIVE : SYSTEM_MODULES_FEATURE_TEXTS.STATUS.INACTIVE}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleToggleStatus(mod)}
                        className={`text-xs px-3 py-1.5 ${mod.isActive ? 'text-error hover:text-text-primary' : 'text-success hover:text-text-primary'}`}
                      >
                        {mod.isActive ? SYSTEM_MODULES_FEATURE_TEXTS.ACTIONS.DEACTIVATE : SYSTEM_MODULES_FEATURE_TEXTS.ACTIONS.ACTIVATE}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12">
                    <Spinner text="Carregando módulos..." />
                  </TableCell>
                </TableRow>
              ) : modules.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-text-secondary py-12">{SYSTEM_MODULES_FEATURE_TEXTS.EMPTY_STATE}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </LayoutContainer>
      </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
