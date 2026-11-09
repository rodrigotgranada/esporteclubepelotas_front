import { KitType } from '../types/kits.types';
import { KITS_TEXTS } from '../constants/kits.constants';
import { BadgeVariant } from '@/shared/ui/components';

export const getKitTypeLabel = (type: KitType): string => {
  switch (type) {
    case 'HOME':
      return KITS_TEXTS.TYPE_HOME;
    case 'AWAY':
      return KITS_TEXTS.TYPE_AWAY;
    case 'THIRD':
      return KITS_TEXTS.TYPE_THIRD;
    case 'GOALKEEPER':
      return KITS_TEXTS.TYPE_GOALKEEPER;
    case 'SPECIAL':
      return KITS_TEXTS.TYPE_SPECIAL;
    default:
      return type;
  }
};

export const getKitTypeBadgeVariant = (type: KitType): BadgeVariant => {
  switch (type) {
    case 'HOME':
      return 'primary';
    case 'SPECIAL':
      return 'warning';
    default:
      return 'default';
  }
};
