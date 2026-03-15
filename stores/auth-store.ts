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
  
  // Actions
  setUser: (user: UserSummary | null) => void;
  updateUser: (data: Partial<UserSummary>) => void;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  register: (data: { username: string; email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
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
        console.log('🔐 Login appelé');
        const response = await authService.login({ emailOrUsername, password });
        const now = Date.now();
        console.log('✅ Login réussi, sauvegarde état:', {
          user: response.user,
          isAuthenticated: true,
          lastLoginTime: now
        });
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
        // Redirection via Next.js router, pas de hard reload
        if (typeof window !== 'undefined') {
          window.location.replace('/login');
        }
      },
      
      checkAuth: async () => {
        const currentState = get();
        console.log('🔍 checkAuth - État actuel:', {
          isAuthenticated: currentState.isAuthenticated,
          hasUser: !!currentState.user,
          userRole: currentState.user?.role,
          lastLoginTime: currentState.lastLoginTime,
          timeSinceLogin: currentState.lastLoginTime ? Date.now() - currentState.lastLoginTime : null
        });
        
        // Si on vient de se connecter (moins de 20 secondes), ne RIEN faire
        const lastLogin = currentState.lastLoginTime;
        if (lastLogin && Date.now() - lastLogin < 20000) {
          console.log('⏭️ Connexion récente, skip checkAuth');
          set({ isLoading: false });
          return;
        }
        
        // Si on est déjà authentifié avec un user, ne RIEN faire
        if (currentState.isAuthenticated && currentState.user) {
          console.log('✅ Déjà authentifié, skip checkAuth');
          set({ isLoading: false });
          return;
        }
        
        console.log('🔄 Vérification authentification...');
        set({ isLoading: true });
        
        try {
          if (authService.isAuthenticated()) {
            console.log('📞 Appel API /auth/me...');
            const user = await authService.getMe();
            console.log('✅ Profil récupéré:', user);
            set({ user: user as unknown as UserSummary, isAuthenticated: true, isLoading: false });
          } else {
            console.log('❌ Pas de token');
            set({ user: null, isAuthenticated: false, isLoading: false });
          }
        } catch (err) {
          console.error('❌ Erreur checkAuth:', err);
          const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : '');
          
          // SEULEMENT déconnecter si token vraiment expiré
          if (msg.includes('Token expiré') || msg.includes('AUTH_TOKEN_EXPIRED')) {
            console.warn('⚠️ Token expiré, déconnexion');
            apiClient.clearTokens();
            set({ user: null, isAuthenticated: false, isLoading: false, lastLoginTime: null });
          } else {
            // Sinon, garder l'état actuel (ne PAS déconnecter)
            console.warn('⚠️ Erreur non-auth, on garde l\'état');
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
