'use client';

import React, { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { LayoutContainer } from '@/shared/ui/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, notFound } from 'next/navigation';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!user || ((user.role?.name || user.role) !== 'ADMIN' && (user.role?.name || user.role) !== 'OWNER')) {
      // Disguise the route by throwing a 404 instead of redirecting
      notFound();
    } else if (user.status === 'PENDING') {
      router.push('/verify-email');
    }
  }, [user, router, isMounted]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isMounted || !user || user.status === 'PENDING' || ((user.role?.name || user.role) !== 'ADMIN' && (user.role?.name || user.role) !== 'OWNER')) {
    return null; // Prevent flicker and wait for auth checks
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
        <LayoutContainer as="main" className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </LayoutContainer>
      </LayoutContainer>
    </LayoutContainer>
  );
};
