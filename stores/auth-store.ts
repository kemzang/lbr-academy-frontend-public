// ============================================
// Store d'authentification - Zustand
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSummary } from '@/types';
import { authService } from '@/lib/api/auth';

interface AuthState {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: UserSummary | null) => void;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: async (emailOrUsername, password) => {
        const response = await authService.login({ emailOrUsername, password });
        set({ user: response.user, isAuthenticated: true });
      },
      
      register: async (data) => {
        const response = await authService.register(data);
        set({ user: response.user, isAuthenticated: true });
      },
      
      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false });
      },
      
      checkAuth: async () => {
        set({ isLoading: true });
        try {
          if (authService.isAuthenticated()) {
            const user = await authService.getMe();
            set({ user: user as unknown as UserSummary, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'lbr-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
