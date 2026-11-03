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
    settings?.googleMapsEmbedUrl || PUBLIC_FOOTER_TEXTS.DEFAULT_MAPS_EMBED_URL;
  const mapsDirectUrl = PUBLIC_FOOTER_TEXTS.DEFAULT_MAPS_DIRECT_URL;

  const socialLinks = settings?.socialLinks || [];
  const contactPhones = settings?.contactPhones || [];
  const contactEmails = settings?.contactEmails || [];

  // Opening Hours: use store or fallback
  const openingHours =
    settings?.openingHours && settings.openingHours.length > 0
      ? settings.openingHours
      : PUBLIC_FOOTER_TEXTS.DEFAULT_OPENING_HOURS;

  // Navigation Links: use store or fallback, filtering out invisible links
  const rawNavLinks =
    settings?.footerNavigationLinks && settings.footerNavigationLinks.length > 0
      ? settings.footerNavigationLinks
      : PUBLIC_FOOTER_TEXTS.DEFAULT_NAV_LINKS;

  const visibleNavLinks = rawNavLinks.filter((item) => item.isVisible !== false);

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
                <Title
                  level="h3"
                  className="text-xl font-black text-text-primary tracking-tight leading-tight group-hover:text-primary transition-colors"
                >
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

          {/* Column 2: Sitemap & Configurable Navigation (lg:col-span-2) */}
          <LayoutContainer className="lg:col-span-2 flex flex-col gap-4">
            <Title level="h4" className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {PUBLIC_FOOTER_TEXTS.SECTION_SITEMAP_TITLE}
            </Title>

            <LayoutContainer className="flex flex-col gap-2.5 text-sm">
              {visibleNavLinks.length === 0 ? (
                <Text className="text-xs text-text-secondary">
                  {PUBLIC_FOOTER_TEXTS.NO_NAV_LINKS}
                </Text>
              ) : (
                visibleNavLinks.map((item, idx) =>
                  item.isExternal ? (
                    <a
                      key={idx}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item.label}</span>
                    </a>
                  ) : (
                    <Link
                      key={idx}
                      href={item.url}
                      className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary transition-colors font-medium"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                )
              )}
            </LayoutContainer>
          </LayoutContainer>

          {/* Column 3: Contacts & Operating Hours (lg:col-span-3) */}
          <LayoutContainer className="lg:col-span-3 flex flex-col gap-4">
            <Title level="h4" className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {PUBLIC_FOOTER_TEXTS.SECTION_CONTACTS_TITLE}
            </Title>

            {/* Operating Hours per Department */}
            <LayoutContainer className="flex flex-col gap-2 bg-background/60 border border-border/80 rounded-xl p-3">
              <LayoutContainer className="flex items-center gap-1.5 text-xs text-primary font-bold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{PUBLIC_FOOTER_TEXTS.SECTION_HOURS_TITLE}</span>
              </LayoutContainer>

              <LayoutContainer className="flex flex-col gap-1.5 divide-y divide-border/40">
                {openingHours.map((item, idx) => (
                  <LayoutContainer key={idx} className="pt-1.5 first:pt-0 flex flex-col">
                    <span className="font-bold text-text-primary text-[11px] leading-tight">
                      {item.department}
                    </span>
                    <span className="text-text-secondary text-[11px] leading-snug">
                      {item.schedule}
                    </span>
                  </LayoutContainer>
                ))}
              </LayoutContainer>
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

          {/* Column 4: Stadium Location & Clickable Google Map (lg:col-span-3) */}
          <LayoutContainer className="lg:col-span-3 flex flex-col gap-3">
            <LayoutContainer className="flex items-center justify-between">
              <Title level="h4" className="text-sm font-bold text-text-primary uppercase tracking-wider">
                {stadiumName}
              </Title>
              <a
                href={mapsDirectUrl}
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

            {/* Google Maps Thumbnail with direct stadium link overlay */}
            <a
              href={mapsDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-36 rounded-xl overflow-hidden border border-border bg-background shadow-xs relative mt-1 group cursor-pointer transition-all hover:border-primary/50"
              title={`${stadiumName} - ${PUBLIC_FOOTER_TEXTS.CLICK_TO_OPEN_MAPS}`}
            >
              <iframe
                title={stadiumName}
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: 'none' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
              />

              {/* Hover overlay hint */}
              <LayoutContainer className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-surface/95 backdrop-blur-xs text-text-primary px-3 py-1.5 rounded-lg text-xs font-bold shadow-md border border-border flex items-center gap-1.5 transform translate-y-1 group-hover:translate-y-0">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  {PUBLIC_FOOTER_TEXTS.OPEN_IN_GOOGLE_MAPS}
                </span>
              </LayoutContainer>
            </a>

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
