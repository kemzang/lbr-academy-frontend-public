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
  lastLoginTime: number | null;
  
  // Actions
  setUser: (user: UserSummary | null) => void;
  updateUser: (data: Partial<UserSummary>) => void;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; fullName: string; phone?: string }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
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
          lastLoginTime: now
        });
      },
      
      register: async (data) => {
        const response = await authService.register(data);
        const now = Date.now();
        set({ 
          user: response.user, 
          isAuthenticated: true,
          lastLoginTime: now
        });
      },
      
      logout: () => {
        authService.logout();
        set({ user: null, isAuthenticated: false, lastLoginTime: null });
      },
      
      checkAuth: async () => {
        set({ isLoading: true });
        
        // Si on vient de se connecter (moins de 10 secondes), ne pas vérifier
        const lastLogin = get().lastLoginTime;
        if (lastLogin && Date.now() - lastLogin < 10000) {
          console.log('Connexion récente (< 10s), skip checkAuth');
          set({ isLoading: false });
          return;
        }
        
        try {
          if (authService.isAuthenticated()) {
            const user = await authService.getMe();
            set({ user: user as unknown as UserSummary, isAuthenticated: true, isLoading: false });
          } else {
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (err) {
          // Si on a un token mais que l'API échoue, garder l'état actuel
          // Ne déconnecter que si c'est une vraie erreur d'authentification
          const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '');
          
          if (msg.includes('Token expiré') || msg.includes('invalide') || msg.includes('AUTH_TOKEN_EXPIRED')) {
            // Token vraiment expiré, déconnecter
            console.warn('Token expiré, déconnexion');
            authService.logout();
            set({ user: null, isAuthenticated: false, isLoading: false, lastLoginTime: null });
          } else {
            // Erreur réseau ou autre, garder l'état actuel
            console.warn('Erreur checkAuth (non-auth):', msg);
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
