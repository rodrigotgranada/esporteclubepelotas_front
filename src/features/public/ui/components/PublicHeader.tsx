'use client';

import React, { useState, startTransition, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { LayoutContainer, Button, IconButton, SafeImage, isUnoptimizedImageUrl } from '@/shared/ui/components';
import { Menu, User, Settings, LogOut, Search } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useHeaderSearch, GlobalSearchInputBar, GlobalSearchResults, GLOBAL_SEARCH_TEXTS } from '@/features/search';
import { PUBLIC_HEADER_TEXTS } from './PublicHeader.constants';
import { PublicNavigationDrawer } from './PublicNavigationDrawer';
import { HeaderReadingProgressBar } from './HeaderReadingProgressBar';

export const PublicHeader = () => {
  const { user, logout } = useAuthStore();
  const { settings } = useSettingsStore();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerSearch = useHeaderSearch();

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
    <>
      <LayoutContainer
        as="header"
        ref={headerSearch.containerRef}
        className="sticky top-0 z-40 w-full bg-header/95 backdrop-blur-md border-b border-header-border transition-colors duration-200 relative"
      >
        <LayoutContainer className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 relative flex items-center justify-between">
          {/* LADO ESQUERDO: Botão de Menu Hamburguer (Mobile, Tablet e Desktop) */}
          <LayoutContainer className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center justify-center p-2 rounded-xl text-header-text hover:bg-header-text/10 transition-colors cursor-pointer focus:outline-none"
              aria-label={PUBLIC_HEADER_TEXTS.ARIA_OPEN_MENU}
              title={PUBLIC_HEADER_TEXTS.NAV_EXPLORE}
            >
              <Menu className="w-6 h-6" />
            </button>
          </LayoutContainer>

          {/* CENTRO: Distintivo do Clube Centralizado com Limites Rígidos de Dimensão */}
          <LayoutContainer className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
            <Link
              href="/"
              className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 max-w-[40px] sm:max-w-[44px] md:max-w-[48px] max-h-[40px] sm:max-h-[44px] md:max-h-[48px] flex items-center justify-center shrink-0 group focus:outline-none overflow-hidden"
              aria-label={settings?.clubName || PUBLIC_HEADER_TEXTS.LOGO_FULL}
            >
              <SafeImage
                src={settings?.clubLogoUrl || '/images/pelotas-logo.png'}
                fallbackSrc="/images/pelotas-logo.png"
                alt={settings?.clubName || PUBLIC_HEADER_TEXTS.LOGO_FULL}
                fill
                sizes="(max-width: 640px) 40px, 48px"
                priority
                className="object-contain drop-shadow-sm group-hover:scale-105 transition-transform"
                unoptimized={isUnoptimizedImageUrl(settings?.clubLogoUrl || '/images/pelotas-logo.png')}
              />
            </Link>
          </LayoutContainer>

          {/* LADO DIREITO: Accordion Horizontal de Busca Global (Desktop) + Sessão do Usuário / Botão Entrar */}
          <LayoutContainer className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LayoutContainer className="hidden md:flex items-center relative">
              <LayoutContainer
                className={`overflow-hidden transition-all duration-300 ease-out flex items-center ${headerSearch.isOpen
                  ? 'w-48 lg:w-72 xl:w-96 opacity-100 mr-2'
                  : 'w-0 opacity-0 pointer-events-none mr-0'
                  }`}
              >
                <GlobalSearchInputBar
                  value={headerSearch.query}
                  onChange={headerSearch.handleChange}
                  onClear={headerSearch.handleClear}
                  inputRef={headerSearch.inputRef}
                  className="w-48 lg:w-72 xl:w-96"
                />
              </LayoutContainer>

              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={headerSearch.handleToggle}
                aria-label={PUBLIC_HEADER_TEXTS.ARIA_OPEN_SEARCH}
                title={GLOBAL_SEARCH_TEXTS.OPEN_SEARCH_TITLE}
                icon={<Search className="w-5 h-5" />}
                className={`rounded-xl w-9 h-9 shrink-0 transition-colors ${headerSearch.isOpen
                  ? 'bg-primary text-black hover:bg-primary hover:text-black'
                  : 'text-header-text hover:bg-header-text/10 hover:text-primary'
                  }`}
              />

              {headerSearch.isOpen && headerSearch.query.trim().length > 0 && (
                <LayoutContainer className="absolute right-0 top-12 w-[420px] lg:w-[480px] bg-surface border border-border rounded-2xl shadow-2xl max-h-[70vh] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  <GlobalSearchResults
                    query={headerSearch.query}
                    results={headerSearch.results}
                    isLoading={headerSearch.isLoading}
                    error={headerSearch.error}
                    hasSearched={headerSearch.hasSearched}
                    onSelectResult={headerSearch.handleClose}
                  />
                </LayoutContainer>
              )}
            </LayoutContainer>

            {/* Sessão do Usuário ou Botão Entrar */}
            {user ? (
              <LayoutContainer className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-header-text/10 transition-colors focus:outline-none cursor-pointer"
                  aria-label={PUBLIC_HEADER_TEXTS.MENU_PROFILE}
                >
                  <LayoutContainer className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-surface border-2 border-primary overflow-hidden relative shadow-sm">
                    {user.avatarUrl ? (
                      <Image
                        src={user.avatarUrl}
                        alt="Avatar"
                        fill
                        sizes="36px"
                        unoptimized={isUnoptimizedImageUrl(user.avatarUrl)}
                        className="object-cover"
                      />
                    ) : (
                      <LayoutContainer className="w-full h-full flex items-center justify-center text-primary font-bold text-xs sm:text-sm">
                        {user.firstName[0]}
                      </LayoutContainer>
                    )}
                  </LayoutContainer>
                </button>

                {/* Dropdown do Usuário */}
                {isDropdownOpen && (
                  <LayoutContainer className="absolute top-12 right-0 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <Link href="/profile" onClick={() => setIsDropdownOpen(false)}>
                      <LayoutContainer className="px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors">
                        <User size={16} /> {PUBLIC_HEADER_TEXTS.MENU_PROFILE}
                      </LayoutContainer>
                    </Link>
                    {['ADMIN', 'OWNER', 'EDITOR'].includes(
                      typeof user.role === 'string' ? user.role : user.role?.name || '',
                    ) && (
                        <Link href="/gestao" onClick={() => setIsDropdownOpen(false)}>
                          <LayoutContainer className="px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors">
                            <Settings size={16} /> {PUBLIC_HEADER_TEXTS.MENU_ADMIN}
                          </LayoutContainer>
                        </Link>
                      )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 hover:bg-background flex items-center gap-3 text-sm text-[#ea580c] hover:bg-[#ea580c]/10 transition-colors border-t border-border cursor-pointer"
                    >
                      <LogOut size={16} /> {PUBLIC_HEADER_TEXTS.MENU_LOGOUT}
                    </button>
                  </LayoutContainer>
                )}
              </LayoutContainer>
            ) : (
              <Link href="/login" className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  className="font-extrabold uppercase tracking-wide text-xs px-3 sm:px-5 py-1.5 sm:py-2 shadow-xs hover:shadow-md transition-transform"
                >
                  {PUBLIC_HEADER_TEXTS.BUTTON_LOGIN}
                </Button>
              </Link>
            )}
          </LayoutContainer>
        </LayoutContainer>

        {/* Barra de Progresso de Leitura Áureo-Cerúlea Fixada Exatamente na Borda Inferior do Header */}
        <HeaderReadingProgressBar />
      </LayoutContainer>

      {/* Unified Mobile & Desktop Mega Navigation Drawer */}
      <PublicNavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};
