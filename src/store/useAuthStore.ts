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
  role: { _id: string; name: string; label?: string; permissions: string[] };
  avatarUrl?: string;
  cpf: string;
  status: 'ACTIVE' | 'PENDING' | 'BANNED' | string;
  isActive: boolean;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
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
    code: string;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingVerificationEmail: null,
      setAuth: (token, user) => {
        Cookies.set('ecp_access_token', token, { expires: 7, path: '/' });
        set({ token, user, pendingVerificationEmail: null });
      },
      setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),
      updateUser: (updates) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updates } : null 
      })),
      logout: () => {
        Cookies.remove('ecp_access_token', { path: '/' });
        set({ token: null, user: null, pendingVerificationEmail: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Sync token to cookie on initial load (rehydration) and any other changes
useAuthStore.subscribe((state) => {
  if (state.token) {
    Cookies.set('ecp_access_token', state.token, { expires: 7, path: '/' });
  } else {
    Cookies.remove('ecp_access_token', { path: '/' });
  }
});
