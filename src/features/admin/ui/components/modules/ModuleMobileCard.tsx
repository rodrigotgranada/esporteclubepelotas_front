import React from 'react';
import { LayoutContainer, Text, Badge, Button } from '@/shared/ui/components';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { SYSTEM_MODULES_FEATURE_TEXTS } from '../../pages/modules/SystemModulesFeature.constants';

interface ModuleMobileCardProps {
  mod: any;
  onToggleStatus: (mod: any) => void;
}

export const ModuleMobileCard = ({ mod, onToggleStatus }: ModuleMobileCardProps) => {
  let uniqueKey = mod.slug || mod.key || mod.name;
  if (typeof mod._id === 'string') uniqueKey = mod._id;
  else if (mod._id && typeof mod._id.toString === 'function' && mod._id.toString() !== '[object Object]') uniqueKey = mod._id.toString();

  const moduleIdentifier = mod.slug || mod.key || uniqueKey;

  return (
    <LayoutContainer className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3">
      <LayoutContainer className="flex justify-between items-start gap-2">
        <LayoutContainer>
          <Text className="text-base font-bold text-text-primary">{mod.name}</Text>
          <Badge variant="default" size="sm" className="mt-1">{moduleIdentifier}</Badge>
        </LayoutContainer>
        <Badge variant={mod.isActive ? 'success' : 'default'} size="sm">
          {mod.isActive ? <CheckCircle size={12} /> : <ShieldAlert size={12} />}
          {mod.isActive ? SYSTEM_MODULES_FEATURE_TEXTS.STATUS.ACTIVE : SYSTEM_MODULES_FEATURE_TEXTS.STATUS.INACTIVE}
        </Badge>
      </LayoutContainer>
      
      <Text className="text-sm text-text-secondary">{mod.description}</Text>

      <LayoutContainer className="flex justify-end pt-2 border-t border-border mt-1">
        <Button 
          variant="ghost" 
          onClick={() => onToggleStatus(mod)}
          className={`text-xs px-3 py-1.5 ${mod.isActive ? 'text-error hover:text-text-primary' : 'text-success hover:text-text-primary'}`}
        >
          {mod.isActive ? SYSTEM_MODULES_FEATURE_TEXTS.ACTIONS.DEACTIVATE : SYSTEM_MODULES_FEATURE_TEXTS.ACTIONS.ACTIVATE}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
