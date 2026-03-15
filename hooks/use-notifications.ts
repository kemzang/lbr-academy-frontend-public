// ============================================
// Hook pour les notifications
// ============================================

import { useState, useEffect } from 'react';
import { notificationsService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export function useNotifications() {
  const { isAuthenticated, lastLoginTime } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadCount = async () => {
      // Vérifier que le token existe ET est un vrai JWT AVANT de faire l'appel
      const token = typeof window !== 'undefined' ? localStorage.getItem('lbr_access_token') : null;
      if (!token || token === 'undefined' || token === 'null' || token.split('.').length !== 3) {
        setUnreadCount(0);
        setIsLoading(false);
        return;
      }

      try {
        const response = await notificationsService.getCount();
        setUnreadCount(response.unreadCount || 0);
      } catch {
        // Ignorer TOUTES les erreurs silencieusement
        // Ne JAMAIS déclencher de déconnexion depuis les notifications
        setUnreadCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    // Si on vient de se connecter (moins de 10 secondes), attendre
    const timeSinceLogin = lastLoginTime ? Date.now() - lastLoginTime : Infinity;
    if (timeSinceLogin < 10000) {
      setIsLoading(false);
      const timeout = setTimeout(loadCount, 10000 - timeSinceLogin);
      return () => clearTimeout(timeout);
    }

    loadCount();

    // Rafraîchir toutes les 60 secondes
    const interval = setInterval(loadCount, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastLoginTime]);

  return { unreadCount, isLoading };
}
