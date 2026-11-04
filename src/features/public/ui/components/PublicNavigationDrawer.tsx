'use client';

import React, { useEffect, useState, startTransition } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutContainer,
  Text,
  Title,
  Badge,
  Button,
  ShieldPlaceholder,
} from '@/shared/ui/components';
import {
  X,
  ChevronRight,
  Newspaper,
  Shield,
  Trophy,
  History,
  Sparkles,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useThemeStore } from '@/store/useThemeStore';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { PUBLIC_DRAWER_TEXTS } from './PublicNavigationDrawer.constants';

export interface PublicNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublicNavigationDrawer: React.FC<PublicNavigationDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const { mode, setMode } = useThemeStore();
  const { isLoaded: isModulesLoaded, isModuleActive } = useSystemModulesStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const idolsActive = isModulesLoaded ? isModuleActive('idols') : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync dark state for simple binary switch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (mode === 'dark') {
        setIsDark(true);
      } else if (mode === 'light') {
        setIsDark(false);
      } else {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
    }
  }, [mode]);

  const toggleTheme = () => {
    const nextMode = isDark ? 'light' : 'dark';
    setMode(nextMode);
    setIsDark(!isDark);
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogout = () => {
    onClose();
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  if (!isOpen || !mounted) return null;

  const clubName = settings?.clubName || 'Esporte Clube Pelotas';

  return createPortal(
    <LayoutContainer className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <LayoutContainer
        className="absolute inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel Sliding from the LEFT */}
      <LayoutContainer className="absolute inset-y-0 left-0 max-w-full flex">
        <LayoutContainer className="w-screen sm:w-[440px] max-w-[92vw] bg-drawer border-r border-border shadow-2xl flex flex-col justify-between h-full overflow-y-auto animate-in slide-in-from-left duration-300 border-t-2 border-t-primary">
          {/* Top Header of Drawer */}
          <LayoutContainer className="p-5 sm:p-6 pb-4 border-b border-border/80 flex items-center justify-between sticky top-0 bg-drawer/95 backdrop-blur-md z-20">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 group focus:outline-none"
            >
              {settings?.clubLogoUrl ? (
                <Image
                  src={settings.clubLogoUrl}
                  alt={clubName}
                  width={42}
                  height={42}
                  className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              ) : (
                <ShieldPlaceholder size={42} />
              )}
              <LayoutContainer className="flex flex-col">
                <Title
                  level="h3"
                  className="text-base font-black text-text-primary tracking-tight leading-tight group-hover:text-primary transition-colors"
                >
                  {clubName}
                </Title>
                <Text className="text-[10px] font-extrabold text-primary uppercase tracking-widest">
                  {PUBLIC_DRAWER_TEXTS.BADGE_OFFICIAL}
                </Text>
              </LayoutContainer>
            </Link>

            {/* Circular Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-surface border border-border/80 flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-background hover:rotate-90 transition-all duration-200 focus:outline-none cursor-pointer"
              title={PUBLIC_DRAWER_TEXTS.CLOSE}
              aria-label={PUBLIC_DRAWER_TEXTS.CLOSE}
            >
              <X className="w-4 h-4" />
            </button>
          </LayoutContainer>

          {/* Drawer Scrollable Content */}
          <LayoutContainer className="flex-1 p-5 sm:p-6 flex flex-col gap-6">
            {/* 1. Membership Highlight Card */}
            <LayoutContainer className="rounded-2xl p-5 bg-gradient-to-br from-secondary/15 via-surface to-primary/10 border border-primary/40 shadow-xs flex flex-col gap-3 relative overflow-hidden group">
              <LayoutContainer className="flex items-center justify-between">
                <Badge variant="primary" size="sm" className="font-extrabold uppercase text-[10px] tracking-wider px-2 py-0.5 shadow-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_BADGE}
                </Badge>
                <Text className="text-[10px] font-bold text-text-secondary/80 uppercase tracking-widest">
                  1908
                </Text>
              </LayoutContainer>

              <Title level="h4" className="text-base font-black text-text-primary leading-tight">
                {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_TITLE}
              </Title>

              <Text className="text-xs text-text-secondary leading-relaxed">
                {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_DESC}
              </Text>

              <Link href="/socio" onClick={onClose} className="pt-1">
                <Button variant="primary" size="sm" className="w-full font-extrabold uppercase tracking-wide justify-between text-xs py-2.5 shadow-xs">
                  <span>{PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_BTN}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </LayoutContainer>

            {/* 2. Navigation Section: Comunicação & Notícias */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_NEWS}
              </Text>

              <Link
                href="/noticias"
                onClick={onClose}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/70 hover:border-primary/50 transition-all group"
              >
                <LayoutContainer className="flex items-center gap-3">
                  <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-black transition-all">
                    <Newspaper className="w-5 h-5" />
                  </LayoutContainer>
                  <LayoutContainer className="flex flex-col">
                    <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                      {PUBLIC_DRAWER_TEXTS.LINK_NEWS}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {PUBLIC_DRAWER_TEXTS.LINK_NEWS_DESC}
                    </span>
                  </LayoutContainer>
                </LayoutContainer>
                <ChevronRight className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </Link>
            </LayoutContainer>

            {/* 3. Navigation Section: Futebol & Temporada */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_FOOTBALL}
              </Text>

              <LayoutContainer className="grid grid-cols-2 gap-2">
                <LayoutContainer className="p-3.5 rounded-xl bg-surface/50 border border-border/70 flex flex-col gap-2 opacity-85 hover:opacity-100 transition-opacity">
                  <LayoutContainer className="flex items-center justify-between">
                    <Trophy className="w-4 h-4 text-primary" />
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                      {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                    </Badge>
                  </LayoutContainer>
                  <span className="text-xs font-bold text-text-primary">
                    {PUBLIC_DRAWER_TEXTS.LINK_SQUAD}
                  </span>
                </LayoutContainer>

                <LayoutContainer className="p-3.5 rounded-xl bg-surface/50 border border-border/70 flex flex-col gap-2 opacity-85 hover:opacity-100 transition-opacity">
                  <LayoutContainer className="flex items-center justify-between">
                    <Shield className="w-4 h-4 text-primary" />
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                      {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                    </Badge>
                  </LayoutContainer>
                  <span className="text-xs font-bold text-text-primary">
                    {PUBLIC_DRAWER_TEXTS.LINK_YOUTH}
                  </span>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* 4. Navigation Section: O Clube & Memória */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_CLUB}
              </Text>

              <LayoutContainer className="flex flex-col gap-2">
                {/* Boca do Lobo Patrimônio */}
                <LayoutContainer className="flex items-center justify-between p-3.5 rounded-xl bg-surface/70 border border-border/70">
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <LayoutContainer className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary">
                          {PUBLIC_DRAWER_TEXTS.LINK_STADIUM}
                        </span>
                        <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-semibold">
                          {PUBLIC_DRAWER_TEXTS.STADIUM_BADGE}
                        </Badge>
                      </LayoutContainer>
                      <span className="text-xs text-text-secondary">
                        {PUBLIC_DRAWER_TEXTS.LINK_STADIUM_DESC}
                      </span>
                    </LayoutContainer>
                  </LayoutContainer>
                </LayoutContainer>

                {/* Ídolos e Linha do Tempo Grid */}
                <LayoutContainer className="grid grid-cols-2 gap-2">
                  {idolsActive ? (
                    <Link
                      href="/idolos"
                      onClick={onClose}
                      className="p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex items-center justify-between transition-all group"
                    >
                      <LayoutContainer className="flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                          {PUBLIC_DRAWER_TEXTS.LINK_IDOLS}
                        </span>
                      </LayoutContainer>
                      <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ) : (
                    <LayoutContainer className="p-3 rounded-xl bg-surface/50 border border-border/60 flex items-center justify-between opacity-85 hover:opacity-100 transition-opacity">
                      <LayoutContainer className="flex items-center gap-2">
                        <Trophy className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-bold text-text-primary">
                          {PUBLIC_DRAWER_TEXTS.LINK_IDOLS}
                        </span>
                      </LayoutContainer>
                      <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                        {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                      </Badge>
                    </LayoutContainer>
                  )}

                  <LayoutContainer className="p-3 rounded-xl bg-surface/50 border border-border/60 flex items-center justify-between opacity-85 hover:opacity-100 transition-opacity">
                    <LayoutContainer className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-bold text-text-primary">
                        {PUBLIC_DRAWER_TEXTS.LINK_HISTORY}
                      </span>
                    </LayoutContainer>
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                      {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                    </Badge>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Bottom Footer of Drawer (User Session / Auth + Clean Light/Dark Switch) */}
          <LayoutContainer className="p-5 sm:p-6 border-t border-border/80 bg-surface/90 backdrop-blur-md flex flex-col gap-4 sticky bottom-0 z-20">
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
                        className="object-cover"
                      />
                    ) : (
                      <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold">
                        {user.firstName[0]}
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
                      className="w-full text-xs font-bold justify-center"
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
                        className="w-full text-xs font-bold justify-center"
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
                  onClick={handleLogout}
                  className="text-error hover:bg-error/10 w-full justify-center text-xs font-bold"
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
                    className="w-full font-extrabold uppercase tracking-wide text-xs sm:text-sm py-2.5 shadow-md hover:shadow-lg justify-center"
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
                    className="font-bold text-primary hover:underline"
                  >
                    {PUBLIC_DRAWER_TEXTS.REGISTER_LINK}
                  </Link>
                </LayoutContainer>
              </LayoutContainer>
            )}

            {/* Simple Binary Light / Dark Switch */}
            <LayoutContainer className="pt-2 border-t border-border flex items-center justify-between p-2.5 rounded-xl bg-surface/70 border border-border/80">
              <LayoutContainer className="flex items-center gap-2.5">
                <LayoutContainer className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </LayoutContainer>
                <Text className="text-xs font-bold text-text-primary">
                  {isDark ? PUBLIC_DRAWER_TEXTS.THEME_DARK : PUBLIC_DRAWER_TEXTS.THEME_LIGHT}
                </Text>
              </LayoutContainer>

              {/* Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isDark}
                aria-label={PUBLIC_DRAWER_TEXTS.THEME_SWITCH_ARIA}
                onClick={toggleTheme}
                className="relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border border-border bg-background transition-colors duration-200 focus:outline-none"
              >
                <span
                  className={`pointer-events-none flex h-5 w-5 transform items-center justify-center rounded-full bg-primary text-black font-bold shadow-sm transition-transform duration-200 ease-in-out mt-0.5 ml-0.5 ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`}
                >
                  {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                </span>
              </button>
            </LayoutContainer>

            <Text className="text-[10px] text-text-secondary text-center">
              {PUBLIC_DRAWER_TEXTS.COPYRIGHT}
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>,
    document.body
  );
};
