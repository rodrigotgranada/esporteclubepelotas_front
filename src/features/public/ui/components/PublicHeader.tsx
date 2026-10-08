'use client';

import React, { useState, startTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutContainer, Text, Button } from '@/shared/ui/components';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/shared/ui/components/molecules/ThemeToggle';
import { PUBLIC_HEADER_TEXTS } from './PublicHeader.constants';

import { useSettingsStore } from '@/store/useSettingsStore';
import { ShieldPlaceholder } from '@/shared/ui/components';

export const PublicHeader = () => {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  return (
    <LayoutContainer as="header" className="sticky top-0 z-50 w-full bg-header/90 backdrop-blur-md border-b border-border">
      <LayoutContainer className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {settings?.clubLogoUrl ? (
            <Image src={settings.clubLogoUrl} alt="Logo" width={40} height={40} className="object-contain" />
          ) : (
            <ShieldPlaceholder size={40} />
          )}
          <Text className="hidden sm:block text-xl font-black text-text-primary tracking-tight">
            {settings?.clubName || PUBLIC_HEADER_TEXTS.LOGO_FULL}
          </Text>
        </Link>

        {/* Desktop Navigation */}
        <LayoutContainer className="hidden md:flex flex-1 justify-center gap-8">
          <Link href="/" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">{PUBLIC_HEADER_TEXTS.NAV_HOME}</Link>
          <Link href="/socio" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">{PUBLIC_HEADER_TEXTS.NAV_MEMBERSHIP}</Link>
          <Link href="/ingressos" className="text-sm font-bold text-text-secondary hover:text-primary transition-colors">{PUBLIC_HEADER_TEXTS.NAV_TICKETS}</Link>
        </LayoutContainer>

        {/* User Actions */}
        <LayoutContainer className="hidden md:flex items-center gap-4 relative">
          <ThemeToggle />
          
          {user ? (
            <>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1 rounded-full hover:bg-background transition-colors focus:outline-none"
              >
                <LayoutContainer className="text-right">
                  <Text className="text-sm font-bold text-text-primary">{user.firstName}</Text>
                </LayoutContainer>
                <LayoutContainer className="w-10 h-10 rounded-full bg-surface border-2 border-primary overflow-hidden relative">
                  {user.avatarUrl ? (
                    <Image src={user.avatarUrl} alt="Avatar" fill sizes="40px" className="object-cover" />
                  ) : (
                    <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold">
                      {user.firstName[0]}
                    </LayoutContainer>
                  )}
                </LayoutContainer>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <LayoutContainer className="absolute top-14 right-0 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                    <LayoutContainer className="px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors">
                      <User size={16} /> {PUBLIC_HEADER_TEXTS.MENU_PROFILE}
                    </LayoutContainer>
                  </Link>
                  {((user.role?.name || user.role) === 'ADMIN' || (user.role?.name || user.role) === 'OWNER') && (
                    <Link href="/gestao" onClick={() => setIsDropdownOpen(false)}>
                      <LayoutContainer className="px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors">
                        <Settings size={16} /> {PUBLIC_HEADER_TEXTS.MENU_ADMIN}
                      </LayoutContainer>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-error hover:text-error/80 transition-colors border-t border-border">
                    <LogOut size={16} /> {PUBLIC_HEADER_TEXTS.MENU_LOGOUT}
                  </button>
                </LayoutContainer>
              )}
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary" className="px-6">{PUBLIC_HEADER_TEXTS.BUTTON_LOGIN}</Button>
            </Link>
          )}
        </LayoutContainer>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-text-primary p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </LayoutContainer>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <LayoutContainer className="md:hidden absolute top-20 left-0 w-full bg-surface border-b border-border shadow-2xl px-6 py-6 space-y-6 animate-in slide-in-from-top-2 duration-200 z-40">
          <LayoutContainer className="space-y-4">
            <Link href="/" className="block text-lg font-bold text-text-secondary hover:text-primary" onClick={() => setIsMenuOpen(false)}>{PUBLIC_HEADER_TEXTS.NAV_HOME}</Link>
            <Link href="/socio" className="block text-lg font-bold text-text-secondary hover:text-primary" onClick={() => setIsMenuOpen(false)}>{PUBLIC_HEADER_TEXTS.NAV_MEMBERSHIP}</Link>
            <Link href="/ingressos" className="block text-lg font-bold text-text-secondary hover:text-primary" onClick={() => setIsMenuOpen(false)}>{PUBLIC_HEADER_TEXTS.NAV_TICKETS}</Link>
          </LayoutContainer>
          
          <LayoutContainer className="pt-6 border-t border-border flex flex-col gap-3">
            <Text className="text-text-secondary font-bold text-sm uppercase tracking-wider">Aparência</Text>
            <ThemeToggle variant="expanded" />
          </LayoutContainer>

          <LayoutContainer className="pt-6 border-t border-border">
            {user ? (
              <LayoutContainer className="space-y-6">
                <LayoutContainer className="flex items-center gap-4">
                  <LayoutContainer className="w-12 h-12 rounded-full bg-background border-2 border-primary overflow-hidden relative">
                    {user.avatarUrl ? (
                      <Image src={user.avatarUrl} alt="Avatar" fill sizes="48px" className="object-cover" />
                    ) : (
                      <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold text-lg">
                        {user.firstName[0]}
                      </LayoutContainer>
                    )}
                  </LayoutContainer>
                  <LayoutContainer>
                    <Text className="font-bold text-text-primary text-lg leading-tight">{user.firstName} {user.lastName}</Text>
                    <Text className="text-text-secondary text-sm">{user.email}</Text>
                  </LayoutContainer>
                </LayoutContainer>

                <LayoutContainer className="space-y-4">
                  <Link href="/profile" className="flex items-center gap-3 text-lg font-bold text-text-secondary hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                    <User size={20} /> {PUBLIC_HEADER_TEXTS.MENU_PROFILE}
                  </Link>
                  {((user.role?.name || user.role) === 'ADMIN' || (user.role?.name || user.role) === 'OWNER') && (
                    <Link href="/gestao" className="flex items-center gap-3 text-lg font-bold text-text-secondary hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                      <Settings size={20} /> {PUBLIC_HEADER_TEXTS.MENU_ADMIN}
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-3 text-lg font-bold text-error hover:text-error/80 w-full text-left pt-2">
                    <LogOut size={20} /> {PUBLIC_HEADER_TEXTS.MENU_LOGOUT}
                  </button>
                </LayoutContainer>
              </LayoutContainer>
            ) : (
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full">{PUBLIC_HEADER_TEXTS.BUTTON_LOGIN}</Button>
              </Link>
            )}
          </LayoutContainer>
        </LayoutContainer>
      )}
    </LayoutContainer>
  );
};
