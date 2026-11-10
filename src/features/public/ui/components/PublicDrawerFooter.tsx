'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutContainer,
  Text,
  Button,
  isUnoptimizedImageUrl,
} from '@/shared/ui/components';
import {
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  Moon,
} from 'lucide-react';
import { PUBLIC_DRAWER_TEXTS } from './PublicNavigationDrawer.constants';

interface PublicDrawerFooterProps {
  user: any;
  onClose: () => void;
  onLogout: () => void;
}

export const PublicDrawerFooter: React.FC<PublicDrawerFooterProps> = ({
  user,
  onClose,
  onLogout,
}) => {
  return (
    <LayoutContainer className="p-5 sm:p-6 border-t border-border/80 bg-surface/40 flex flex-col gap-4 mt-auto shrink-0 pb-8">
      {user ? (
        <LayoutContainer className="flex flex-col gap-3">
          <LayoutContainer className="flex items-center gap-3">
            <LayoutContainer className="w-10 h-10 rounded-full bg-background border-2 border-primary overflow-hidden relative shrink-0 shadow-xs">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt="Avatar"
                  fill
                  sizes="40px"
                  unoptimized={isUnoptimizedImageUrl(user.avatarUrl)}
                  className="object-cover"
                />
              ) : (
                <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold">
                  {user.firstName?.[0] || 'U'}
                </LayoutContainer>
              )}
            </LayoutContainer>
            <LayoutContainer className="flex flex-col overflow-hidden">
              <Text className="font-bold text-text-primary text-sm truncate">
                {user.firstName} {user.lastName}
              </Text>
              <Text className="text-text-secondary text-xs truncate">{user.email}</Text>
            </LayoutContainer>
          </LayoutContainer>

          <LayoutContainer className="grid grid-cols-2 gap-2 pt-1">
            <Link href="/profile" onClick={onClose}>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs font-bold justify-center cursor-pointer"
                leftIcon={<UserIcon className="w-3.5 h-3.5" />}
              >
                {PUBLIC_DRAWER_TEXTS.BTN_PROFILE}
              </Button>
            </Link>
            {((user.role?.name || user.role) === 'ADMIN' ||
              (user.role?.name || user.role) === 'OWNER') && (
              <Link href="/gestao" onClick={onClose}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold justify-center cursor-pointer"
                  leftIcon={<SettingsIcon className="w-3.5 h-3.5" />}
                >
                  {PUBLIC_DRAWER_TEXTS.BTN_ADMIN}
                </Button>
              </Link>
            )}
          </LayoutContainer>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-orange-500 hover:bg-orange-500/10 w-full justify-center text-xs font-bold cursor-pointer"
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
          >
            {PUBLIC_DRAWER_TEXTS.BTN_LOGOUT}
          </Button>
        </LayoutContainer>
      ) : (
        <LayoutContainer className="flex flex-col gap-2">
          <Link href="/login" onClick={onClose}>
            <Button
              variant="primary"
              size="md"
              className="w-full font-extrabold uppercase tracking-wide text-xs sm:text-sm py-2.5 shadow-md hover:shadow-lg justify-center cursor-pointer"
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              {PUBLIC_DRAWER_TEXTS.BTN_LOGIN}
            </Button>
          </Link>
          <LayoutContainer className="flex items-center justify-center gap-1.5 text-xs text-text-secondary">
            <span>{PUBLIC_DRAWER_TEXTS.NO_ACCOUNT_PROMPT}</span>
            <Link
              href="/register"
              onClick={onClose}
              className="font-bold text-secondary hover:underline cursor-pointer"
            >
              {PUBLIC_DRAWER_TEXTS.REGISTER_LINK}
            </Link>
          </LayoutContainer>
        </LayoutContainer>
      )}

      {/* Indicador do Modo Noturno Oficial do Clube */}
      <LayoutContainer className="pt-2 border-t border-border flex items-center justify-between p-2.5 rounded-xl bg-surface/70 border border-border/80">
        <LayoutContainer className="flex items-center gap-2.5">
          <LayoutContainer className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
            <Moon className="w-4 h-4" />
          </LayoutContainer>
          <Text className="text-xs font-bold text-text-primary">
            {PUBLIC_DRAWER_TEXTS.THEME_DARK}
          </Text>
        </LayoutContainer>

        <span className="text-[10px] uppercase font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20">
          Ativo
        </span>
      </LayoutContainer>

      <Text className="text-[10px] text-text-secondary text-center">
        {PUBLIC_DRAWER_TEXTS.COPYRIGHT}
      </Text>
    </LayoutContainer>
  );
};
