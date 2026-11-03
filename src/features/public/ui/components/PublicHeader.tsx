'use client';

import React, { useState, startTransition, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutContainer, Text, Button, ShieldPlaceholder } from '@/shared/ui/components';
import { Menu, User, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/shared/ui/components/molecules/ThemeToggle';
import { useSettingsStore } from '@/store/useSettingsStore';
import { PUBLIC_HEADER_TEXTS } from './PublicHeader.constants';
import { PublicNavigationDrawer } from './PublicNavigationDrawer';

export const PublicHeader = () => {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <LayoutContainer
      as="header"
      className="sticky top-0 z-40 w-full bg-header/95 backdrop-blur-md border-b border-header-border transition-colors duration-200"
    >
      <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none shrink-0">
          {settings?.clubLogoUrl ? (
            <Image
              src={settings.clubLogoUrl}
              alt={settings?.clubName || PUBLIC_HEADER_TEXTS.LOGO_FULL}
              width={44}
              height={44}
              className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
            />
          ) : (
            <ShieldPlaceholder size={44} />
          )}
          <LayoutContainer className="flex flex-col">
            <Text className="text-lg sm:text-xl font-black text-header-text tracking-tight group-hover:opacity-90 transition-opacity leading-tight">
              {settings?.clubName || PUBLIC_HEADER_TEXTS.LOGO_FULL}
            </Text>
            <Text className="hidden sm:block text-[11px] font-bold text-header-text-muted uppercase tracking-wider">
              {PUBLIC_HEADER_TEXTS.LOGO_SLOGAN}
            </Text>
          </LayoutContainer>
        </Link>

        {/* Actions & Navigation Controls */}
        <LayoutContainer className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Golden "Seja Sócio" CTA Button */}
          <Link href="/socio" className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              className="font-extrabold uppercase tracking-wide shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5"
            >
              {PUBLIC_HEADER_TEXTS.NAV_MEMBERSHIP}
            </Button>
          </Link>

          {/* Theme Mode Toggle */}
          <LayoutContainer className="shrink-0">
            <ThemeToggle />
          </LayoutContainer>

          {/* User Session Quick Profile / Login */}
          {user ? (
            <LayoutContainer className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-header-text/10 transition-colors focus:outline-none cursor-pointer"
                aria-label={PUBLIC_HEADER_TEXTS.MENU_PROFILE}
              >
                <LayoutContainer className="w-9 h-9 rounded-full bg-surface border-2 border-primary overflow-hidden relative shadow-sm">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="Avatar"
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  ) : (
                    <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                      {user.firstName[0]}
                    </LayoutContainer>
                  )}
                </LayoutContainer>
              </button>

              {/* User Dropdown */}
              {isDropdownOpen && (
                <LayoutContainer className="absolute top-12 right-0 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                    <LayoutContainer className="px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors">
                      <User size={16} /> {PUBLIC_HEADER_TEXTS.MENU_PROFILE}
                    </LayoutContainer>
                  </Link>
                  {((user.role?.name || user.role) === 'ADMIN' ||
                    (user.role?.name || user.role) === 'OWNER') && (
                    <Link href="/gestao" onClick={() => setIsDropdownOpen(false)}>
                      <LayoutContainer className="px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors">
                        <Settings size={16} /> {PUBLIC_HEADER_TEXTS.MENU_ADMIN}
                      </LayoutContainer>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-error hover:text-error/80 transition-colors border-t border-border cursor-pointer"
                  >
                    <LogOut size={16} /> {PUBLIC_HEADER_TEXTS.MENU_LOGOUT}
                  </button>
                </LayoutContainer>
              )}
            </LayoutContainer>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex">
              <Button
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm font-bold border-header-border text-header-text hover:bg-header-text/10"
              >
                {PUBLIC_HEADER_TEXTS.BUTTON_LOGIN}
              </Button>
            </Link>
          )}

          {/* Mega Drawer "Explorar" Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-header-text/10 hover:bg-header-text/15 text-header-text border border-header-border transition-all duration-200 font-bold text-xs sm:text-sm shadow-xs focus:outline-none cursor-pointer"
            aria-label={PUBLIC_HEADER_TEXTS.ARIA_OPEN_MENU}
            title={PUBLIC_HEADER_TEXTS.NAV_EXPLORE}
          >
            <Menu className="w-5 h-5 shrink-0" />
            <span className="hidden sm:inline">{PUBLIC_HEADER_TEXTS.NAV_EXPLORE}</span>
          </button>
        </LayoutContainer>
      </LayoutContainer>

      {/* Unified Mobile & Desktop Mega Navigation Drawer */}
      <PublicNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </LayoutContainer>
  );
};
