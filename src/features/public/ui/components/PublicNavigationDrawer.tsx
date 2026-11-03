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
  Ticket,
  Trophy,
  History,
  MapPin,
  Clock,
  Phone,
  Sparkles,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  ExternalLink,
} from 'lucide-react';
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaThreads,
  FaYoutube,
  FaTiktok,
  FaLinkedinIn,
  FaWhatsapp,
} from 'react-icons/fa6';
import { ThemeToggle } from '@/shared/ui/components/molecules/ThemeToggle';
import { useAuthStore } from '@/store/useAuthStore';
import { useSettingsStore, SocialPlatform } from '@/store/useSettingsStore';
import { PUBLIC_DRAWER_TEXTS } from './PublicNavigationDrawer.constants';

const PLATFORM_ICONS: Record<
  SocialPlatform,
  { icon: React.ElementType; color: string; hoverBg: string }
> = {
  instagram: {
    icon: FaInstagram,
    color: '#E1306C',
    hoverBg: 'hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10',
  },
  facebook: {
    icon: FaFacebookF,
    color: '#1877F2',
    hoverBg: 'hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
  },
  x: {
    icon: FaXTwitter,
    color: 'currentColor',
    hoverBg: 'hover:border-primary/50 hover:bg-primary/10',
  },
  threads: {
    icon: FaThreads,
    color: 'currentColor',
    hoverBg: 'hover:border-primary/50 hover:bg-primary/10',
  },
  youtube: {
    icon: FaYoutube,
    color: '#ea580c',
    hoverBg: 'hover:border-[#ea580c]/50 hover:bg-[#ea580c]/10',
  },
  tiktok: {
    icon: FaTiktok,
    color: '#00f2fe',
    hoverBg: 'hover:border-[#00f2fe]/50 hover:bg-[#00f2fe]/10',
  },
  linkedin: {
    icon: FaLinkedinIn,
    color: '#0A66C2',
    hoverBg: 'hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10',
  },
};

const formatPhoneLink = (rawNumber: string, isWhatsapp?: boolean) => {
  const digits = rawNumber.replace(/\D/g, '');
  if (isWhatsapp) {
    const fullNumber = digits.startsWith('55') ? digits : `55${digits}`;
    return `https://wa.me/${fullNumber}`;
  }
  return `tel:${digits}`;
};

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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const socialLinks = settings?.socialLinks || [];
  const contactPhones = settings?.contactPhones || [];
  const openingHours = settings?.openingHours || [];

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
            {/* Membership Highlight Card (Styled like an official Member Card) */}
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
                <Button variant="primary" size="sm" className="w-full font-extrabold uppercase tracking-wide justify-between text-xs py-2 shadow-xs">
                  <span>{PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_BTN}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </LayoutContainer>

            {/* Navigation Section 1: Notícias & Ingressos */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_NEWS}
              </Text>

              <LayoutContainer className="flex flex-col gap-2">
                <Link
                  href="/noticias"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/70 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-black transition-all">
                      <Newspaper className="w-4 h-4" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_NEWS}
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {PUBLIC_DRAWER_TEXTS.LINK_NEWS_DESC}
                      </span>
                    </LayoutContainer>
                  </LayoutContainer>
                  <ChevronRight className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                  href="/ingressos"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/70 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-9 h-9 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-secondary group-hover:text-white transition-all">
                      <Ticket className="w-4 h-4" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_TICKETS}
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {PUBLIC_DRAWER_TEXTS.LINK_TICKETS_DESC}
                      </span>
                    </LayoutContainer>
                  </LayoutContainer>
                  <ChevronRight className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </LayoutContainer>
            </LayoutContainer>

            {/* Navigation Section 2: O Clube & Estádio Boca do Lobo */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_CLUB}
              </Text>

              <LayoutContainer className="flex flex-col gap-2">
                {/* Boca do Lobo Featured Link */}
                <a
                  href="https://maps.google.com/?q=Est%C3%A1dio+Boca+do+Lobo+Pelotas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/70 hover:bg-surface border border-border/70 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-black transition-all">
                      <MapPin className="w-4 h-4" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <LayoutContainer className="flex items-center gap-2">
                        <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                          {PUBLIC_DRAWER_TEXTS.LINK_STADIUM}
                        </span>
                        <Badge variant="default" size="sm" className="text-[9px] py-0 px-1 font-semibold">
                          {PUBLIC_DRAWER_TEXTS.STADIUM_BADGE}
                        </Badge>
                      </LayoutContainer>
                      <span className="text-[11px] text-text-secondary">
                        {PUBLIC_DRAWER_TEXTS.LINK_STADIUM_DESC}
                      </span>
                    </LayoutContainer>
                  </LayoutContainer>
                  <ExternalLink className="w-4 h-4 text-text-secondary/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </a>

                {/* Ídolos e Linha do Tempo Grid */}
                <LayoutContainer className="grid grid-cols-2 gap-2 pt-0.5">
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

            {/* Navigation Section 3: Central de Atendimento & Horários */}
            <LayoutContainer className="flex flex-col gap-2.5 pt-2 border-t border-border/60">
              <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                {PUBLIC_DRAWER_TEXTS.SECTION_CONTACTS}
              </Text>

              {/* Operating Hours Card */}
              {openingHours.length > 0 && (
                <LayoutContainer className="bg-surface/60 border border-border/80 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
                  <LayoutContainer className="flex items-center gap-1.5 text-primary font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-extrabold uppercase tracking-wide">
                      {PUBLIC_DRAWER_TEXTS.HOURS_TITLE}
                    </span>
                  </LayoutContainer>
                  <LayoutContainer className="flex flex-col gap-1.5 pt-0.5">
                    {openingHours.map((h, i) => (
                      <LayoutContainer key={i} className="flex flex-col text-[11px]">
                        <span className="font-bold text-text-primary">{h.department}</span>
                        <span className="text-text-secondary">{h.schedule}</span>
                      </LayoutContainer>
                    ))}
                  </LayoutContainer>
                </LayoutContainer>
              )}

              {/* Quick Contact Buttons */}
              <LayoutContainer className="flex flex-wrap gap-2">
                {contactPhones.slice(0, 2).map((phone, idx) => (
                  <a
                    key={idx}
                    href={formatPhoneLink(phone.number, phone.isWhatsapp)}
                    target={phone.isWhatsapp ? '_blank' : undefined}
                    rel={phone.isWhatsapp ? 'noopener noreferrer' : undefined}
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                      phone.isWhatsapp
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                        : 'border-border bg-surface text-text-primary hover:text-primary hover:border-primary/40'
                    }`}
                  >
                    {phone.isWhatsapp ? (
                      <FaWhatsapp className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Phone className="w-3.5 h-3.5 text-primary" />
                    )}
                    <span>{phone.label}</span>
                  </a>
                ))}
              </LayoutContainer>
            </LayoutContainer>

            {/* Official Social Media Channels (Modern Icon Row) */}
            {socialLinks.length > 0 && (
              <LayoutContainer className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <Text className="text-[11px] font-extrabold text-text-secondary uppercase tracking-wider px-1">
                  {PUBLIC_DRAWER_TEXTS.SECTION_SOCIAL}
                </Text>
                <LayoutContainer className="flex flex-wrap items-center gap-2">
                  {socialLinks.map((s, idx) => {
                    const cfg = PLATFORM_ICONS[s.platform] || PLATFORM_ICONS.instagram;
                    const IconComp = cfg.icon;
                    return (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-9 h-9 rounded-xl border border-border/80 bg-surface flex items-center justify-center text-text-secondary hover:scale-105 hover:shadow-xs transition-all ${cfg.hoverBg}`}
                        title={s.label || s.platform}
                      >
                        <IconComp
                          className="w-4 h-4"
                          style={{ color: cfg.color === 'currentColor' ? undefined : cfg.color }}
                        />
                      </a>
                    );
                  })}
                </LayoutContainer>
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* Bottom Footer of Drawer (User Session / Auth + Theme) */}
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
              <LayoutContainer className="flex flex-col gap-2.5">
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

            {/* Theme Toggle Bar */}
            <LayoutContainer className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <span className="font-bold text-text-primary text-xs uppercase tracking-wider">
                {PUBLIC_DRAWER_TEXTS.THEME_TITLE}
              </span>
              <ThemeToggle />
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
