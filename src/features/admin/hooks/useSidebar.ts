'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useSystemModulesStore } from '@/store/useSystemModulesStore';
import { startTransition, useEffect } from 'react';
import { Home, Users, Settings, Layers, Shield, Newspaper, Trophy, Shirt, Sprout, History, Landmark, Handshake, UserCheck, Music, Sparkles } from 'lucide-react';
import { SIDEBAR_TEXTS } from '../ui/components/Sidebar.constants';

export const useSidebar = () => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { fetchModules } = useSystemModulesStore();
  const router = useRouter();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const handleLogout = () => {
    startTransition(() => {
      router.push('/');
    });
    setTimeout(() => {
      logout();
    }, 100);
  };

  const userRole = (user?.role?.name || user?.role || '').toString().toUpperCase();
  const isOwner = userRole === 'OWNER';
  const isAdmin = userRole === 'ADMIN' || isOwner;

  // No painel de controle administrativo, todas as áreas de gestão devem estar acessíveis para o admin/owner
  const navItems = [
    { label: SIDEBAR_TEXTS.NAV.DASHBOARD, href: '/gestao', icon: Home, show: true },
    { label: SIDEBAR_TEXTS.NAV.NEWS, href: '/gestao/news', icon: Newspaper, show: true },
    { label: SIDEBAR_TEXTS.NAV.FOOTBALL, href: '/gestao/football', icon: Shirt, show: true },
    { label: SIDEBAR_TEXTS.NAV.YOUTH, href: '/gestao/base', icon: Sprout, show: true },
    { label: SIDEBAR_TEXTS.NAV.IDOLS, href: '/gestao/idols', icon: Trophy, show: true },
    { label: SIDEBAR_TEXTS.NAV.TIMELINE, href: '/gestao/timeline', icon: History, show: true },
    { label: SIDEBAR_TEXTS.NAV.ANTHEM, href: '/gestao/hino', icon: Music, show: true },
    { label: SIDEBAR_TEXTS.NAV.SYMBOLS, href: '/gestao/simbolos', icon: Sparkles, show: true },
    { label: SIDEBAR_TEXTS.NAV.STADIUM, href: '/gestao/stadium', icon: Landmark, show: true },
    { label: SIDEBAR_TEXTS.NAV.SPONSORS, href: '/gestao/sponsors', icon: Handshake, show: true },
    { label: SIDEBAR_TEXTS.NAV.MEMBERSHIP, href: '/gestao/membership', icon: UserCheck, show: true },
    { label: SIDEBAR_TEXTS.NAV.USERS, href: '/gestao/users', icon: Users, show: isAdmin },
    { label: SIDEBAR_TEXTS.NAV.MODULES, href: '/gestao/modules', icon: Layers, show: isOwner },
    { label: SIDEBAR_TEXTS.NAV.ROLES, href: '/gestao/roles', icon: Shield, show: isOwner },
    { label: SIDEBAR_TEXTS.NAV.SETTINGS, href: '/gestao/settings', icon: Settings, show: isAdmin },
  ];

  const checkIsActive = (href: string) => {
    const isActive = pathname === href || pathname.startsWith(`${href}/`);
    return href === '/gestao' ? pathname === '/gestao' : isActive;
  };

  return {
    navItems: navItems.filter((item) => item.show),
    handleLogout,
    checkIsActive,
  };
};
