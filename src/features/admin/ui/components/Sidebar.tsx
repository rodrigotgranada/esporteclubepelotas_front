import React from 'react';
import Link from 'next/link';
import { LogOut, LucideIcon, X } from 'lucide-react';
import { LayoutContainer, Text, Button, ShieldPlaceholder } from '@/shared/ui/components';
import { useSidebar } from '../../hooks/useSidebar';
import { SIDEBAR_TEXTS } from './Sidebar.constants';
import { useSettingsStore } from '@/store/useSettingsStore';
import Image from 'next/image';

export const Sidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }: { isMobileMenuOpen?: boolean, setIsMobileMenuOpen?: (v: boolean) => void }) => {
  const { navItems, handleLogout, checkIsActive } = useSidebar();
  const { settings } = useSettingsStore();

  return (
    <LayoutContainer 
      as="nav" 
      className={`w-64 h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-50 transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <LayoutContainer className="h-16 flex items-center justify-between px-6 border-b border-border">
        <LayoutContainer className="flex items-center gap-2">
          {settings?.clubLogoUrl ? (
            <Image src={settings.clubLogoUrl} alt="Logo" width={32} height={32} className="object-contain" />
          ) : (
            <ShieldPlaceholder size={32} />
          )}
          <Text as="span" className="text-xl font-black text-primary tracking-tighter truncate max-w-[120px]">
            {settings?.clubName || SIDEBAR_TEXTS.LOGO_TEXT}
          </Text>
        </LayoutContainer>
        {setIsMobileMenuOpen && (
          <button className="lg:hidden text-text-secondary" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        )}
      </LayoutContainer>

      <LayoutContainer className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        {navItems.map((item: { label: string; href: string; icon: LucideIcon }) => {
          const Icon = item.icon;
          const isReallyActive = checkIsActive(item.href);

          return (
            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}>
              <LayoutContainer
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isReallyActive
                    ? 'bg-primary text-background font-bold'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background'
                }`}
              >
                <Icon size={20} />
                <Text as="span" className="text-sm">{item.label}</Text>
              </LayoutContainer>
            </Link>
          );
        })}
      </LayoutContainer>

      <LayoutContainer className="p-4 border-t border-border">
        <Button 
          onClick={() => {
            handleLogout();
            if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
          variant="ghost"
          className="w-full flex items-center justify-center gap-2 border-border text-text-secondary hover:text-text-primary"
        >
          <LogOut size={18} />
          {SIDEBAR_TEXTS.LOGOUT_BUTTON}
        </Button>
      </LayoutContainer>
    </LayoutContainer>
  );
};
