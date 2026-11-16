import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface Address {
  _id?: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  isPrimary: boolean;
}

export interface Phone {
  _id?: string;
  number: string;
  isWhatsapp: boolean;
  isPrimary: boolean;
  isVerified?: boolean;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  emailVerified?: boolean;
  mustChangePassword?: boolean;
  role: { _id: string; name: string; label?: string; permissions: string[] };
  avatarUrl?: string;
  cpf: string;
  status: 'ACTIVE' | 'PENDING' | 'BANNED' | string;
  isActive: boolean;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;

  // Quadro Social / ElevenTickets
  isSocio?: boolean;
  eleventicketsId?: string;
  socioPlanName?: string;
  socioStatus?: string;
  socioSyncMode?: string;
  socioSince?: string;

  addresses?: Address[];
  phones?: Phone[];
  preferences?: {
    shirtSize?: string;
    receiveNewsletter: boolean;
    receiveSms: boolean;
  };
  pendingChanges?: Array<{
    type: 'email' | 'phone';
    newValue: string;
    expiresAt: string;
  }>;
}

interface AuthState {
  token: string | null;
  user: User | null;
  pendingVerificationEmail: string | null;
  setAuth: (token: string, user: User) => void;
  setPendingVerificationEmail: (email: string | null) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

function getCookieAttributes(): Cookies.CookieAttributes {
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
  return {
    expires: 7,
    path: '/',
    sameSite: 'lax',
    ...(isHttps ? { secure: true } : {}),
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingVerificationEmail: null,
      setAuth: (token, user) => {
        if (token) {
          Cookies.set('ecp_access_token', token, getCookieAttributes());
        } else {
          Cookies.remove('ecp_access_token', { path: '/' });
        }
        set({ token: token || null, user, pendingVerificationEmail: null });
      },
      setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),
      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
      logout: () => {
        Cookies.remove('ecp_access_token', { path: '/' });
        set({ token: null, user: null, pendingVerificationEmail: null });
        if (typeof window !== 'undefined') {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7998';
          fetch(`${apiUrl}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
            keepalive: true,
          }).catch(() => {});
        }
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);

// Sync token to cookie on initial load (rehydration) and any other changes
useAuthStore.subscribe((state) => {
  if (state.token) {
    Cookies.set('ecp_access_token', state.token, getCookieAttributes());
  } else {
    Cookies.remove('ecp_access_token', { path: '/' });
  }
});
