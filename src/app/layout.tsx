import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { ThemeProvider } from '@/shared/ui/providers/ThemeProvider';
import { SettingsProvider } from '@/shared/ui/providers/SettingsProvider';
import { EnvironmentBadge } from '@/shared/ui/components';
import { PwaInstallPrompt } from '@/features/pwa';
import { CookieConsentBanner } from '@/features/privacy';
import { fetchPublicServerJson } from '@/shared/utils/seo-fetch';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchPublicServerJson<{ clubLogoUrl?: string; clubName?: string }>('/settings', 60, 3000);
  if (data) {
    const logoUrl = typeof data.clubLogoUrl === 'string' && data.clubLogoUrl.trim() ? data.clubLogoUrl.trim() : null;
    const icons = logoUrl
      ? logoUrl.startsWith('data:')
        ? { icon: logoUrl }
        : { icon: logoUrl, shortcut: logoUrl, apple: logoUrl }
      : { icon: "/favicon.ico", shortcut: "/favicon.ico", apple: "/favicon.ico" };

    return {
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://esporteclubepelotas.com.br'),
      title: data.clubName || "Esporte Clube Pelotas",
      description: "Portal Oficial do Clube",
      manifest: "/manifest.json",
      icons,
    };
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://esporteclubepelotas.com.br'),
    title: "Esporte Clube Pelotas",
    description: "Portal Oficial do Clube",
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <ThemeProvider>
          <SettingsProvider>
            {children}
            <EnvironmentBadge />
            <CookieConsentBanner />
            <PwaInstallPrompt />
            <Toaster position="top-right" />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
