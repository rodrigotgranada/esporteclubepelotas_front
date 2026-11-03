'use client';

import React, { useEffect, startTransition } from 'react';
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
  Ticket,
  Trophy,
  Users,
  MapPin,
  Clock,
  Phone,
  Mail,
  Sparkles,
  User as UserIcon,
  Settings as SettingsIcon,
  LogOut,
  Calendar,
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
  { icon: React.ElementType; color: string }
> = {
  instagram: { icon: FaInstagram, color: '#E1306C' },
  facebook: { icon: FaFacebookF, color: '#1877F2' },
  x: { icon: FaXTwitter, color: 'currentColor' },
  threads: { icon: FaThreads, color: 'currentColor' },
  youtube: { icon: FaYoutube, color: '#ea580c' },
  tiktok: { icon: FaTiktok, color: '#00f2fe' },
  linkedin: { icon: FaLinkedinIn, color: '#0A66C2' },
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

  if (!isOpen) return null;

  const clubName = settings?.clubName || 'Esporte Clube Pelotas';
  const socialLinks = settings?.socialLinks || [];
  const contactPhones = settings?.contactPhones || [];
  const contactEmails = settings?.contactEmails || [];
  const openingHours = settings?.openingHours || [];

  return (
    <LayoutContainer className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <LayoutContainer
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <LayoutContainer className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <LayoutContainer className="w-screen max-w-md bg-drawer border-l border-border shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          {/* Top Header of Drawer */}
          <LayoutContainer className="p-6 pb-4 border-b border-border flex items-center justify-between sticky top-0 bg-drawer/95 backdrop-blur-md z-20">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 group focus:outline-none"
            >
              {settings?.clubLogoUrl ? (
                <Image
                  src={settings.clubLogoUrl}
                  alt={clubName}
                  width={44}
                  height={44}
                  className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                />
              ) : (
                <ShieldPlaceholder size={44} />
              )}
              <LayoutContainer className="flex flex-col">
                <Title
                  level="h3"
                  className="text-base font-black text-text-primary tracking-tight leading-tight group-hover:text-primary transition-colors"
                >
                  {clubName}
                </Title>
                <Text className="text-[11px] font-bold text-primary uppercase tracking-wider">
                  {PUBLIC_DRAWER_TEXTS.TITLE}
                </Text>
              </LayoutContainer>
            </Link>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-background transition-colors focus:outline-none"
              title={PUBLIC_DRAWER_TEXTS.CLOSE}
            >
              <X className="w-5 h-5" />
            </button>
          </LayoutContainer>

          {/* Drawer Scrollable Content */}
          <LayoutContainer className="flex-1 p-6 flex flex-col gap-6">
            {/* Membership Highlight Card */}
            <LayoutContainer className="rounded-2xl p-5 bg-gradient-to-br from-primary/20 via-surface to-background border-2 border-primary/30 shadow-md flex flex-col gap-3 relative overflow-hidden group">
              <LayoutContainer className="flex items-center gap-2">
                <Badge variant="primary" size="sm" className="font-extrabold uppercase">
                  <Sparkles className="w-3 h-3" />
                  Sócio Lobo
                </Badge>
              </LayoutContainer>

              <Title level="h4" className="text-base font-black text-text-primary leading-tight">
                {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_TITLE}
              </Title>

              <Text className="text-xs text-text-secondary leading-relaxed">
                {PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_DESC}
              </Text>

              <Link href="/socio" onClick={onClose} className="pt-1">
                <Button variant="primary" size="sm" className="w-full font-bold justify-between">
                  <span>{PUBLIC_DRAWER_TEXTS.MEMBERSHIP_CARD_BTN}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </LayoutContainer>

            {/* Navigation Section 1: Notícias & Comunicação */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                {PUBLIC_DRAWER_TEXTS.SECTION_NEWS}
              </Text>

              <LayoutContainer className="flex flex-col gap-1.5">
                <Link
                  href="/noticias"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/60 hover:bg-surface border border-border/60 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                  <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>

                <Link
                  href="/ingressos"
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/60 hover:bg-surface border border-border/60 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-8 h-8 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
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
                  <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </Link>
              </LayoutContainer>
            </LayoutContainer>

            {/* Navigation Section 2: Futebol & Temporada */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                {PUBLIC_DRAWER_TEXTS.SECTION_FOOTBALL}
              </Text>

              <LayoutContainer className="grid grid-cols-2 gap-2">
                <LayoutContainer className="p-3 rounded-xl bg-surface/40 border border-border/50 flex flex-col gap-1.5 opacity-80">
                  <LayoutContainer className="flex items-center justify-between">
                    <Trophy className="w-4 h-4 text-primary" />
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5">
                      {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                    </Badge>
                  </LayoutContainer>
                  <span className="text-xs font-bold text-text-primary">
                    {PUBLIC_DRAWER_TEXTS.LINK_SQUAD}
                  </span>
                </LayoutContainer>

                <LayoutContainer className="p-3 rounded-xl bg-surface/40 border border-border/50 flex flex-col gap-1.5 opacity-80">
                  <LayoutContainer className="flex items-center justify-between">
                    <Users className="w-4 h-4 text-primary" />
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1.5">
                      {PUBLIC_DRAWER_TEXTS.BADGE_COMING_SOON}
                    </Badge>
                  </LayoutContainer>
                  <span className="text-xs font-bold text-text-primary">
                    {PUBLIC_DRAWER_TEXTS.LINK_YOUTH}
                  </span>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Navigation Section 3: O Clube & Boca do Lobo */}
            <LayoutContainer className="flex flex-col gap-2">
              <Text className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                {PUBLIC_DRAWER_TEXTS.SECTION_CLUB}
              </Text>

              <LayoutContainer className="flex flex-col gap-1.5">
                <a
                  href="https://maps.google.com/?q=Est%C3%A1dio+Boca+do+Lobo+Pelotas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-surface/60 hover:bg-surface border border-border/60 hover:border-primary/50 transition-all group"
                >
                  <LayoutContainer className="flex items-center gap-3">
                    <LayoutContainer className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4" />
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                        {PUBLIC_DRAWER_TEXTS.LINK_STADIUM}
                      </span>
                      <span className="text-[11px] text-text-secondary">
                        {PUBLIC_DRAWER_TEXTS.LINK_STADIUM_DESC}
                      </span>
                    </LayoutContainer>
                  </LayoutContainer>
                  <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </a>

                <LayoutContainer className="grid grid-cols-2 gap-2 pt-0.5">
                  <LayoutContainer className="p-2.5 rounded-xl bg-surface/40 border border-border/50 flex items-center justify-between opacity-80">
                    <span className="text-xs font-semibold text-text-secondary">
                      {PUBLIC_DRAWER_TEXTS.LINK_IDOLS}
                    </span>
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1">
                      Em breve
                    </Badge>
                  </LayoutContainer>

                  <LayoutContainer className="p-2.5 rounded-xl bg-surface/40 border border-border/50 flex items-center justify-between opacity-80">
                    <span className="text-xs font-semibold text-text-secondary">
                      {PUBLIC_DRAWER_TEXTS.LINK_HISTORY}
                    </span>
                    <Badge variant="default" size="sm" className="text-[9px] py-0 px-1">
                      Em breve
                    </Badge>
                  </LayoutContainer>
                </LayoutContainer>
              </LayoutContainer>
            </LayoutContainer>

            {/* Navigation Section 4: Atendimento & Horários Rápidos */}
            <LayoutContainer className="flex flex-col gap-2 pt-2 border-t border-border/60">
              <Text className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                {PUBLIC_DRAWER_TEXTS.SECTION_CONTACTS}
              </Text>

              {/* Operating Hours Summary */}
              {openingHours.length > 0 && (
                <LayoutContainer className="bg-background/80 border border-border rounded-xl p-3 flex flex-col gap-1.5 text-xs">
                  <LayoutContainer className="flex items-center gap-1.5 text-primary font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Horários de Atendimento</span>
                  </LayoutContainer>
                  {openingHours.map((h, i) => (
                    <LayoutContainer key={i} className="flex flex-col text-[11px] text-text-secondary">
                      <span className="font-bold text-text-primary">{h.department}:</span>
                      <span>{h.schedule}</span>
                    </LayoutContainer>
                  ))}
                </LayoutContainer>
              )}

              {/* Quick Contacts */}
              <LayoutContainer className="flex flex-wrap gap-2 pt-1">
                {contactPhones.slice(0, 2).map((phone, idx) => (
                  <a
                    key={idx}
                    href={formatPhoneLink(phone.number, phone.isWhatsapp)}
                    target={phone.isWhatsapp ? '_blank' : undefined}
                    rel={phone.isWhatsapp ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-bold text-text-primary hover:text-primary hover:border-primary/40 transition-colors"
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

            {/* Official Social Media Channels */}
            {socialLinks.length > 0 && (
              <LayoutContainer className="flex flex-col gap-2 pt-2 border-t border-border/60">
                <Text className="text-[11px] font-extrabold text-primary uppercase tracking-wider">
                  {PUBLIC_DRAWER_TEXTS.SECTION_SOCIAL}
                </Text>
                <LayoutContainer className="flex flex-wrap gap-2">
                  {socialLinks.map((s, idx) => {
                    const cfg = PLATFORM_ICONS[s.platform] || PLATFORM_ICONS.instagram;
                    const IconComp = cfg.icon;
                    return (
                      <a
                        key={idx}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-surface/70 text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors"
                        title={s.label}
                      >
                        <IconComp className="w-3 h-3" style={{ color: cfg.color === 'currentColor' ? undefined : cfg.color }} />
                        <span className="truncate max-w-[100px]">{s.label || s.platform}</span>
                      </a>
                    );
                  })}
                </LayoutContainer>
              </LayoutContainer>
            )}
          </LayoutContainer>

          {/* Bottom Footer of Drawer (User Session + Theme + Exit) */}
          <LayoutContainer className="p-6 border-t border-border bg-surface/80 flex flex-col gap-4 sticky bottom-0 z-20">
            {user ? (
              <LayoutContainer className="flex flex-col gap-3">
                <LayoutContainer className="flex items-center gap-3">
                  <LayoutContainer className="w-10 h-10 rounded-full bg-background border-2 border-primary overflow-hidden relative shrink-0">
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
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold" leftIcon={<UserIcon className="w-3.5 h-3.5" />}>
                      {PUBLIC_DRAWER_TEXTS.BTN_PROFILE}
                    </Button>
                  </Link>
                  {((user.role?.name || user.role) === 'ADMIN' || (user.role?.name || user.role) === 'OWNER') && (
                    <Link href="/gestao" onClick={onClose}>
                      <Button variant="outline" size="sm" className="w-full text-xs font-bold" leftIcon={<SettingsIcon className="w-3.5 h-3.5" />}>
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
                  <Button variant="primary" size="md" className="w-full font-bold">
                    {PUBLIC_DRAWER_TEXTS.BTN_LOGIN}
                  </Button>
                </Link>
                <Link href="/register" onClick={onClose}>
                  <Button variant="outline" size="md" className="w-full font-bold">
                    {PUBLIC_DRAWER_TEXTS.BTN_REGISTER}
                  </Button>
                </Link>
              </LayoutContainer>
            )}

            {/* Theme Toggle Bar */}
            <LayoutContainer className="pt-2 border-t border-border flex items-center justify-between text-xs text-text-secondary">
              <span className="font-semibold">{PUBLIC_DRAWER_TEXTS.THEME_TITLE}</span>
              <ThemeToggle />
            </LayoutContainer>

            <Text className="text-[10px] text-text-secondary text-center">
              {PUBLIC_DRAWER_TEXTS.COPYRIGHT}
            </Text>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
