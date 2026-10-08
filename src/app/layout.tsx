import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { ThemeProvider } from '@/shared/ui/providers/ThemeProvider';
import { SettingsProvider } from '@/shared/ui/providers/SettingsProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998';
  try {
    const res = await fetch(`${apiUrl}/settings`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      return {
        title: data.clubName || "Esporte Clube Pelotas",
        description: "Portal Oficial do Clube",
        icons: {
          icon: data.clubLogoUrl || "/favicon.ico",
          shortcut: data.clubLogoUrl || "/favicon.ico",
          apple: data.clubLogoUrl || "/favicon.ico",
        }
      };
    }
  } catch (error) {
    console.error("Failed to fetch metadata settings", error);
  }
  
  return {
    title: "Esporte Clube Pelotas",
    description: "Portal Oficial do Clube",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary">
        <ThemeProvider>
          <SettingsProvider>
            {children}
            <Toaster position="top-right" />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
