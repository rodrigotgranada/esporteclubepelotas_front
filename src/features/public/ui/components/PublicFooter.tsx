'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutContainer,
  Text,
  Title,
  Badge,
  ShieldPlaceholder,
} from '@/shared/ui/components';
import { useSettingsStore, SocialPlatform } from '@/store/useSettingsStore';
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
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Clock,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { PUBLIC_FOOTER_TEXTS } from './PublicFooter.constants';

const PLATFORM_ICONS: Record<
  SocialPlatform,
  { icon: React.ElementType; color: string; defaultBg: string }
> = {
  instagram: {
    icon: FaInstagram,
    color: '#E1306C',
    defaultBg: 'hover:border-[#E1306C]/50 hover:bg-[#E1306C]/10',
  },
  facebook: {
    icon: FaFacebookF,
    color: '#1877F2',
    defaultBg: 'hover:border-[#1877F2]/50 hover:bg-[#1877F2]/10',
  },
  x: {
    icon: FaXTwitter,
    color: 'currentColor',
    defaultBg: 'hover:border-primary/50 hover:bg-primary/10',
  },
  threads: {
    icon: FaThreads,
    color: 'currentColor',
    defaultBg: 'hover:border-primary/50 hover:bg-primary/10',
  },
  youtube: {
    icon: FaYoutube,
    color: '#ea580c',
    defaultBg: 'hover:border-[#ea580c]/50 hover:bg-[#ea580c]/10',
  },
  tiktok: {
    icon: FaTiktok,
    color: '#00f2fe',
    defaultBg: 'hover:border-[#00f2fe]/50 hover:bg-[#00f2fe]/10',
  },
  linkedin: {
    icon: FaLinkedinIn,
    color: '#0A66C2',
    defaultBg: 'hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10',
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

export const PublicFooter = () => {
  const { settings } = useSettingsStore();

  const clubName = settings?.clubName || PUBLIC_FOOTER_TEXTS.CLUB_NAME;
  const stadiumName = settings?.stadiumName || PUBLIC_FOOTER_TEXTS.STADIUM_NAME_DEFAULT;
  const stadiumAddress =
    settings?.stadiumAddress || PUBLIC_FOOTER_TEXTS.STADIUM_ADDRESS_DEFAULT;
  const copyrightText =
    settings?.copyrightText || PUBLIC_FOOTER_TEXTS.COPYRIGHT_FALLBACK;
  const mapsEmbedUrl =
    settings?.googleMapsEmbedUrl ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3393.2081577457755!2d-52.338274023616654!3d-31.76483561175654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9511b594bce376b5%3A0xeae06c624641dbef!2sEst%C3%A1dio%20Boca%20do%20Lobo%20-%20Pelotas!5e0!3m2!1spt-BR!2sbr!4v1714000000000!5m2!1spt-BR!2sbr';

  const socialLinks = settings?.socialLinks || [];
  const contactPhones = settings?.contactPhones || [];
  const contactEmails = settings?.contactEmails || [];

  return (
    <LayoutContainer
      as="footer"
      className="w-full bg-surface border-t border-border mt-auto pt-16 pb-8 transition-colors"
    >
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <LayoutContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-border">
          {/* Column 1: Club Identity & Heritage (lg:col-span-4) */}
          <LayoutContainer className="lg:col-span-4 flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {settings?.clubLogoUrl ? (
                <Image
                  src={settings.clubLogoUrl}
                  alt={clubName}
                  width={52}
                  height={52}
                  className="object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
                />
              ) : (
                <ShieldPlaceholder size={52} />
              )}
              <LayoutContainer className="flex flex-col">
                <Title level="h3" className="text-xl font-black text-text-primary tracking-tight leading-tight group-hover:text-primary transition-colors">
                  {clubName}
                </Title>
                <Text className="text-xs font-semibold text-primary uppercase tracking-widest">
                  {PUBLIC_FOOTER_TEXTS.CLUB_TAGLINE}
                </Text>
              </LayoutContainer>
            </Link>

            <Text className="text-sm text-text-secondary leading-relaxed">
              {PUBLIC_FOOTER_TEXTS.CLUB_DESCRIPTION}
            </Text>

            <LayoutContainer className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="default" size="sm" className="font-semibold text-xs py-1">
                <Shield className="w-3.5 h-3.5 text-primary mr-1" />
                {PUBLIC_FOOTER_TEXTS.CLUB_FOUNDATION}
              </Badge>
              <Badge variant="default" size="sm" className="font-semibold text-xs py-1">
                {PUBLIC_FOOTER_TEXTS.CLUB_LOCATION}
              </Badge>
            </LayoutContainer>

            {/* Social Media Link Pills */}
            <LayoutContainer className="pt-2 flex flex-col gap-2.5">
              <Text className="text-xs font-bold text-text-primary uppercase tracking-wider">
                {PUBLIC_FOOTER_TEXTS.SECTION_SOCIAL_TITLE}
              </Text>

              {socialLinks.length === 0 ? (
                <Text className="text-xs text-text-secondary">
                  {PUBLIC_FOOTER_TEXTS.NO_SOCIAL}
                </Text>
              ) : (
                <LayoutContainer className="flex flex-wrap gap-2">
                  {socialLinks.map((item, idx) => {
                    const cfg = PLATFORM_ICONS[item.platform] || PLATFORM_ICONS.instagram;
                    const IconComponent = cfg.icon;

                    return (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-background/60 text-text-primary hover:text-primary text-xs font-semibold transition-all ${cfg.defaultBg}`}
                        title={`${item.label} (${item.url})`}
                      >
                        <IconComponent
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: cfg.color === 'currentColor' ? undefined : cfg.color }}
                        />
                        <span className="truncate max-w-[130px]">{item.label || item.platform}</span>
                      </a>
                    );
                  })}
                </LayoutContainer>
              )}
            </LayoutContainer>
          </LayoutContainer>

          {/* Column 2: Sitemap & Quick Navigation (lg:col-span-2) */}
          <LayoutContainer className="lg:col-span-2 flex flex-col gap-4">
            <Title level="h4" className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {PUBLIC_FOOTER_TEXTS.SECTION_SITEMAP_TITLE}
            </Title>

            <LayoutContainer className="flex flex-col gap-2.5 text-sm">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                {PUBLIC_FOOTER_TEXTS.NAV_HOME}
              </Link>
              <Link
                href="/noticias"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                {PUBLIC_FOOTER_TEXTS.NAV_NEWS}
              </Link>
              <Link
                href="/socio"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                {PUBLIC_FOOTER_TEXTS.NAV_MEMBERSHIP}
              </Link>
              <Link
                href="/ingressos"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                {PUBLIC_FOOTER_TEXTS.NAV_TICKETS}
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                {PUBLIC_FOOTER_TEXTS.NAV_PROFILE}
              </Link>
              <Link
                href="/gestao"
                className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
              >
                <ChevronRight className="w-3.5 h-3.5 text-primary" />
                {PUBLIC_FOOTER_TEXTS.NAV_ADMIN}
              </Link>
            </LayoutContainer>
          </LayoutContainer>

          {/* Column 3: Contacts & Support (lg:col-span-3) */}
          <LayoutContainer className="lg:col-span-3 flex flex-col gap-4">
            <Title level="h4" className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {PUBLIC_FOOTER_TEXTS.SECTION_CONTACTS_TITLE}
            </Title>

            <LayoutContainer className="flex items-center gap-2 text-xs text-text-secondary">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              <span>{PUBLIC_FOOTER_TEXTS.SECTION_CONTACTS_HOURS}</span>
            </LayoutContainer>

            {/* Phones List */}
            <LayoutContainer className="flex flex-col gap-2 pt-1">
              {contactPhones.length === 0 ? (
                <Text className="text-xs text-text-secondary">
                  {PUBLIC_FOOTER_TEXTS.NO_CONTACTS}
                </Text>
              ) : (
                contactPhones.map((phone, idx) => (
                  <a
                    key={idx}
                    href={formatPhoneLink(phone.number, phone.isWhatsapp)}
                    target={phone.isWhatsapp ? '_blank' : undefined}
                    rel={phone.isWhatsapp ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-2.5 text-xs text-text-secondary hover:text-primary transition-colors group"
                  >
                    <LayoutContainer className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                      {phone.isWhatsapp ? (
                        <FaWhatsapp className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Phone className="w-3.5 h-3.5 text-primary" />
                      )}
                    </LayoutContainer>
                    <LayoutContainer className="flex flex-col">
                      <span className="font-bold text-text-primary text-xs">{phone.label}</span>
                      <span className="font-mono text-[11px]">{phone.number}</span>
                    </LayoutContainer>
                  </a>
                ))
              )}
            </LayoutContainer>

            {/* Emails List */}
            <LayoutContainer className="flex flex-col gap-2 pt-2 border-t border-border">
              {contactEmails.map((emailItem, idx) => (
                <a
                  key={idx}
                  href={`mailto:${emailItem.email}`}
                  className="inline-flex items-center gap-2.5 text-xs text-text-secondary hover:text-primary transition-colors group"
                >
                  <LayoutContainer className="w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                  </LayoutContainer>
                  <LayoutContainer className="flex flex-col truncate">
                    <span className="font-bold text-text-primary text-xs">{emailItem.label}</span>
                    <span className="truncate text-[11px]">{emailItem.email}</span>
                  </LayoutContainer>
                </a>
              ))}
            </LayoutContainer>
          </LayoutContainer>

          {/* Column 4: Stadium Location & Interactive Google Map (lg:col-span-3) */}
          <LayoutContainer className="lg:col-span-3 flex flex-col gap-3">
            <LayoutContainer className="flex items-center justify-between">
              <Title level="h4" className="text-sm font-bold text-text-primary uppercase tracking-wider">
                {stadiumName}
              </Title>
              <a
                href="https://maps.google.com/?q=Est%C3%A1dio+Boca+do+Lobo+Pelotas"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
              >
                <span>{PUBLIC_FOOTER_TEXTS.OPEN_IN_GOOGLE_MAPS}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </LayoutContainer>

            <LayoutContainer className="flex items-start gap-2 text-xs text-text-secondary leading-snug">
              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>{stadiumAddress}</span>
            </LayoutContainer>

            {/* Google Maps Interactive Iframe */}
            <LayoutContainer className="w-full h-36 rounded-xl overflow-hidden border border-border bg-background shadow-xs relative mt-1">
              <iframe
                title={stadiumName}
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
              />
            </LayoutContainer>

            <Text className="text-[11px] text-text-secondary font-medium">
              {PUBLIC_FOOTER_TEXTS.STADIUM_CAPACITY}
            </Text>
          </LayoutContainer>
        </LayoutContainer>

        {/* Bottom Bar: Copyright, CNPJ & Credits */}
        <LayoutContainer className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <Text className="text-center sm:text-left font-medium">
            {copyrightText}
          </Text>

          <LayoutContainer className="flex items-center gap-4 text-center sm:text-right">
            <span>{PUBLIC_FOOTER_TEXTS.CNPJ}</span>
            <span>•</span>
            <span className="font-semibold text-text-primary">
              {PUBLIC_FOOTER_TEXTS.DEVELOPED_BY}
            </span>
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
