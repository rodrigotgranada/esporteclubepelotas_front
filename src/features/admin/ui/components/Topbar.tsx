import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutContainer, Text, IconButton } from '@/shared/ui/components';
import Image from 'next/image';
import { ThemeToggle } from '@/shared/ui/components/molecules/ThemeToggle';
import { TOPBAR_TEXTS } from './Topbar.constants';
import { USER_ROLE_MAP } from '../../constants/admin.constants';

export const Topbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const { user } = useAuthStore();

  const roleData = user?.role as any;
  const roleObj = typeof roleData === 'object' ? roleData : null;
  const roleName = roleObj?.name || (typeof roleData === 'string' ? roleData : '');
  const displayRole = roleObj?.label || (roleName ? (USER_ROLE_MAP[roleName as string] || roleName) : '');

  return (
    <LayoutContainer as="header" className="h-16 bg-header/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
      <LayoutContainer className="flex items-center gap-4">
        {onMenuClick && (
          <button className="lg:hidden text-text-primary focus:outline-none" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
        )}
        <Text className="text-text-secondary font-medium hidden sm:block">{TOPBAR_TEXTS.TITLE}</Text>
      </LayoutContainer>

      <LayoutContainer className="flex items-center gap-6">
        <ThemeToggle />
        
        <LayoutContainer className="relative">
          <IconButton icon={<Bell size={20} />} variant="ghost" className="text-text-secondary hover:text-primary" />
          <LayoutContainer className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
        </LayoutContainer>

        <LayoutContainer className="flex items-center gap-3 pl-6 border-l border-border">
          <LayoutContainer className="text-right hidden sm:block">
            <Text className="text-sm font-bold text-text-primary">{user?.firstName} {user?.lastName}</Text>
            <Text className="text-xs text-primary font-medium uppercase tracking-wider">
              {displayRole}
            </Text>
          </LayoutContainer>
          <LayoutContainer className="w-10 h-10 rounded-full bg-surface border-2 border-primary overflow-hidden relative">
            {user?.avatarUrl ? (
              <Image src={user.avatarUrl} alt="Avatar" fill sizes="40px" className="object-cover" />
            ) : (
              <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold">
                {user?.firstName?.[0]}
              </LayoutContainer>
            )}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
