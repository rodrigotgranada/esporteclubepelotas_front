'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { LayoutContainer } from '@/shared/ui/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, notFound } from 'next/navigation';

const ALLOWED_ROLES = new Set(['ADMIN', 'OWNER', 'EDITOR']);

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rawRole = user ? (typeof user.role === 'string' ? user.role : user.role?.name) : '';
  const roleName = rawRole ? rawRole.toUpperCase() : '';
  const hasAccess = Boolean(user && ALLOWED_ROLES.has(roleName));

  useEffect(() => {
    if (!isMounted || !hasAccess || !user) return;

    if (user.status === 'PENDING') {
      router.push('/verify-email');
    } else if (user.mustChangePassword) {
      router.push('/change-temporary-password');
    }
  }, [user, router, isMounted, hasAccess]);

  if (!isMounted) {
    return null;
  }

  if (!hasAccess) {
    notFound();
  }

  if (user?.status === 'PENDING' || user?.mustChangePassword) {
    return null;
  }

  return (
    <LayoutContainer className="min-h-screen bg-background text-text-primary flex">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <LayoutContainer className="flex-1 lg:ml-64 flex flex-col w-full min-w-0 transition-all duration-300">
        <Topbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-6 lg:p-10 w-full min-w-0 overflow-hidden">
          {children}
        </main>
      </LayoutContainer>
    </LayoutContainer>
  );
};
