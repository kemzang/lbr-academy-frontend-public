// ============================================
// Hook d'authentification
// ============================================

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function useAuth(requireAuth = false) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, checkAuth, logout } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, requireAuth, isAuthenticated, router]);
  
  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isCreator: ['CREATEUR', 'ENTREPRENEUR', 'HYBRIDE', 'COACH', 'ADMIN'].includes(user?.role || ''),
  };
}

export default useAuth;
