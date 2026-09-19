import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  pendingVerificationEmail: string | null;
  setAuth: (token: string, user: User) => void;
  setPendingVerificationEmail: (email: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      pendingVerificationEmail: null,
      setAuth: (token, user) => set({ token, user, pendingVerificationEmail: null }),
      setPendingVerificationEmail: (email) => set({ pendingVerificationEmail: email }),
      logout: () => set({ token: null, user: null, pendingVerificationEmail: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
