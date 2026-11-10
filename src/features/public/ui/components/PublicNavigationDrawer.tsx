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
  isUnoptimizedImageUrl,
} from '@/shared/ui/components';
import {
  X,
  ChevronRight,
  Newspaper,
  Shield,
  Crown,
  Trophy,
  Users,
  History,
  Sparkles,
  Music,
  Shirt,
  CalendarDays,
  ShoppingBag,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { useMembershipLink } from '@/features/membership/hooks/useMembershipLink';
import { PUBLIC_DRAWER_TEXTS } from './PublicNavigationDrawer.constants';
import { PublicDrawerFooter } from './PublicDrawerFooter';

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
  const { isLoaded: isModulesLoaded, isModuleActive } = useSystemModulesStore();
  const membershipLink = useMembershipLink();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const idolsActive = isModulesLoaded ? isModuleActive('idols') : true;
  const footballActive = isModulesLoaded ? isModuleActive('football') : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
                  unoptimized={isUnoptimizedImageUrl(settings.clubLogoUrl)}
                />
              ) : (
                <ShieldPlaceholder size={42} />
              )}
              <LayoutContainer className="flex flex-col">
                <Title level="h2" className="text-sm font-black tracking-tight text-text-primary group-hover:text-primary transition-colors uppercase">
                  {PUBLIC_DRAWER_TEXTS.TITLE}
                </Title>
                <Text className="text-[11px] text-text-secondary leading-tight line-clamp-1">
                  {PUBLIC_DRAWER_TEXTS.SUBTITLE}
                </Text>
              </LayoutContainer>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface transition-all focus:outline-none"
              aria-label={PUBLIC_DRAWER_TEXTS.CLOSE}
            >
              <X className="w-5 h-5" />
            </button>
          </LayoutContainer>

          {/* Drawer Body Links & Sections */}
          <LayoutContainer className="p-5 sm:p-6 flex flex-col gap-6 flex-1">
            {/* 1. Highlight Membership Banner */}
            <LayoutContainer className="rounded-2xl bg-gradient-to-br from-primary/15 via-surface to-surface border border-primary/30 p-4.5 flex flex-col gap-3 relative overflow-hidden shadow-xs">
              <LayoutContainer className="flex items-center justify-between gap-2">
                <Badge variant="primary" size="sm" className="font-extrabold text-[10px] tracking-wider uppercase">
                  {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_BADGE}
                </Badge>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1">
                <Title level="h3" className="text-base font-black text-text-primary">
                  {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_TITLE}
                </Title>
                <Text className="text-xs text-text-secondary leading-relaxed">
                  {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_DESC}
                </Text>
              </LayoutContainer>

              <Link
                href={membershipLink.url}
                target={membershipLink.target}
                rel={membershipLink.rel}
                onClick={onClose}
                className="pt-1"
              >
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
                {footballActive ? (
                  <Link
                    href="/elenco"
                    onClick={onClose}
                    className="p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex flex-col gap-2 transition-all group"
                  >
                    <LayoutContainer className="flex items-center justify-between">
                      <Trophy className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </LayoutContainer>
                    <Text as="span" className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      {PUBLIC_DRAWER_TEXTS.LINK_SQUAD}
                    </Text>
                  </Link>
                ) : (
                  <LayoutContainer className="p-3.5 rounded-xl bg-surface/50 border border-border/70 flex flex-col gap-2 opacity-85 hover:opacity-100 transition-opacity">
                    <LayoutContainer className="flex items-center justify-between">
                      <Trophy className="w-4 h-4 text-primary" />
                      <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                        {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                      </Badge>
                    </LayoutContainer>
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {PUBLIC_DRAWER_TEXTS.LINK_SQUAD}
                    </Text>
                  </LayoutContainer>
                )}

                <Link
                  href="/jogos"
                  onClick={onClose}
                  className="p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex flex-col gap-2 transition-all group"
                >
                  <LayoutContainer className="flex items-center justify-between">
                    <CalendarDays className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </LayoutContainer>
                  <Text as="span" className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                    {PUBLIC_DRAWER_TEXTS.LINK_MATCHES}
                  </Text>
                </Link>
              </LayoutContainer>
            </LayoutContainer>

            {/* 4. Navigation Section: Base */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_YOUTH}
              </Text>

              <LayoutContainer className="grid grid-cols-2 gap-2">
                {footballActive ? (
                  <Link
                    href="/base"
                    onClick={onClose}
                    className="p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex flex-col gap-2 transition-all group"
                  >
                    <LayoutContainer className="flex items-center justify-between">
                      <Shield className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </LayoutContainer>
                    <Text as="span" className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      {PUBLIC_DRAWER_TEXTS.LINK_YOUTH}
                    </Text>
                  </Link>
                ) : (
                  <LayoutContainer className="p-3.5 rounded-xl bg-surface/50 border border-border/70 flex flex-col gap-2 opacity-85 hover:opacity-100 transition-opacity">
                    <LayoutContainer className="flex items-center justify-between">
                      <Shield className="w-4 h-4 text-primary" />
                      <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                        {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                      </Badge>
                    </LayoutContainer>
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {PUBLIC_DRAWER_TEXTS.LINK_YOUTH}
                    </Text>
                  </LayoutContainer>
                )}

                {footballActive ? (
                  <Link
                    href="/base/elencos"
                    onClick={onClose}
                    className="p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex flex-col gap-2 transition-all group"
                  >
                    <LayoutContainer className="flex items-center justify-between">
                      <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                      <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </LayoutContainer>
                    <Text as="span" className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                      {PUBLIC_DRAWER_TEXTS.LINK_YOUTH_SQUADS}
                    </Text>
                  </Link>
                ) : (
                  <LayoutContainer className="p-3.5 rounded-xl bg-surface/50 border border-border/70 flex flex-col gap-2 opacity-85 hover:opacity-100 transition-opacity">
                    <LayoutContainer className="flex items-center justify-between">
                      <Users className="w-4 h-4 text-primary" />
                      <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5 font-medium">
                        {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                      </Badge>
                    </LayoutContainer>
                    <Text as="span" className="text-xs font-bold text-text-primary">
                      {PUBLIC_DRAWER_TEXTS.LINK_YOUTH_SQUADS}
                    </Text>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            </LayoutContainer>

            {/* 5. Navigation Section: Futebol Feminino (As Lobas) */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_FEMALE}
              </Text>

              <LayoutContainer className="grid grid-cols-2 gap-2">
                <Link
                  href="/feminino"
                  onClick={onClose}
                  className="p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex flex-col gap-2 transition-all group"
                >
                  <LayoutContainer className="flex items-center justify-between">
                    <Crown className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </LayoutContainer>
                  <Text as="span" className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                    {PUBLIC_DRAWER_TEXTS.LINK_FEMALE}
                  </Text>
                </Link>

                <Link
                  href="/feminino/elencos"
                  onClick={onClose}
                  className="p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex flex-col gap-2 transition-all group"
                >
                  <LayoutContainer className="flex items-center justify-between">
                    <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </LayoutContainer>
                  <Text as="span" className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                    {PUBLIC_DRAWER_TEXTS.LINK_FEMALE_SQUADS}
                  </Text>
                </Link>
              </LayoutContainer>
            </LayoutContainer>

            {/* 6. Navigation Section: O Clube & Memória */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_CLUB}
              </Text>

              <LayoutContainer className="flex flex-col gap-2">
                {/* Boca do Lobo Patrimônio */}
                <Link
                  href="/estadio"
                  onClick={onClose}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface/70 hover:bg-surface border border-border/70 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-black transition-all">
                      <Shield className="w-5 h-5" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <LayoutContainer className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
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
                  <ChevronRight className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                {/* Ídolos, Linha do Tempo, Hino, Símbolos, Mantos e Loja Grid */}
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

                  <Link
                    href="/historia"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex items-center justify-between transition-all group"
                  >
                    <LayoutContainer className="flex items-center gap-2">
                      <History className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_HISTORY}
                      </span>
                    </LayoutContainer>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/hino"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex items-center justify-between transition-all group"
                  >
                    <LayoutContainer className="flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_ANTHEM}
                      </span>
                    </LayoutContainer>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/simbolos"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex items-center justify-between transition-all group"
                  >
                    <LayoutContainer className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_SYMBOLS}
                      </span>
                    </LayoutContainer>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/uniformes"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex items-center justify-between transition-all group"
                  >
                    <LayoutContainer className="flex items-center gap-2">
                      <Shirt className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_KITS}
                      </span>
                    </LayoutContainer>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>

                  <Link
                    href="/loja"
                    onClick={onClose}
                    className="p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/80 hover:border-primary/50 flex items-center justify-between transition-all group"
                  >
                    <LayoutContainer className="flex items-center gap-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_STORE}
                      </span>
                    </LayoutContainer>
                    <ChevronRight className="w-3.5 h-3.5 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>
          </LayoutContainer>

          {/* Bottom Footer of Drawer (User Session / Auth + Dark Theme Indicator) */}
          <PublicDrawerFooter
            user={user}
            onClose={onClose}
            onLogout={handleLogout}
          />
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>,
    document.body
  );
};
