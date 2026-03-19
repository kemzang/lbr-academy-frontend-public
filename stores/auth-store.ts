// ============================================
// Store d'authentification - Zustand
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserSummary } from '@/types';
import { authService } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';

interface AuthState {
  user: UserSummary | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  lastLoginTime: number | null;
  
  setUser: (user: UserSummary | null) => void;
  updateUser: (data: Partial<UserSummary>) => void;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      lastLoginTime: null,
      
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      updateUser: (data) => set((state) => ({
        user: state.user ? { ...state.user, ...data } : null
      })),
      
      login: async (emailOrUsername, password) => {
        const response = await authService.login({ emailOrUsername, password });
        const now = Date.now();
        set({ 
          user: response.user, 
          isAuthenticated: true,
          isLoading: false,
          lastLoginTime: now
        });
      },
      
      register: async (data) => {
        const response = await authService.register(data);
        const now = Date.now();
        set({ 
          user: response.user, 
          isAuthenticated: true,
          isLoading: false,
          lastLoginTime: now
        });
      },

      
      logout: () => {
        apiClient.clearTokens();
        set({ user: null, isAuthenticated: false, lastLoginTime: null });
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
      },
      
      checkAuth: async () => {
        const currentState = get();
        
        // Si on vient de se connecter (moins de 20 secondes), ne rien faire
        const lastLogin = currentState.lastLoginTime;
        if (lastLogin && Date.now() - lastLogin < 20000) {
          set({ isLoading: false });
          return;
        }
        
        // Si on est déjà authentifié avec un user, ne rien faire
        if (currentState.isAuthenticated && currentState.user) {
          set({ isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        
        try {
          if (authService.isAuthenticated()) {
            const user = await authService.getMe();
            set({ user: user as unknown as UserSummary, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (err) {
          const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '');
          
          if (msg.includes('Token expiré') || msg.includes('AUTH_TOKEN_EXPIRED')) {
            apiClient.clearTokens();
            set({ user: null, isAuthenticated: false, isLoading: false, lastLoginTime: null });
          } else {
            // Erreur non-auth: garder l'état actuel
            set((state) => ({ ...state, isLoading: false }));
          }
        }
      },
    }),
    {
      name: 'lbr-auth',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        lastLoginTime: state.lastLoginTime
      }),
    }
  )
);