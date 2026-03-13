// ============================================
// Hook pour les notifications
// ============================================

import { useState, useEffect } from 'react';
import { notificationsService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export function useNotifications() {
  const { isAuthenticated, lastLoginTime } = useAuthStore();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const loadCount = async () => {
      try {
        const response = await notificationsService.getCount();
        setUnreadCount(response.unreadCount || 0);
      } catch (err) {
        setUnreadCount(0);
        const msg = err && typeof err === 'object' && 'message' in err ? String((err as { message?: unknown }).message) : null;
        if (msg && msg !== '[object Object]' && !msg?.includes('Token expiré')) {
          console.warn('Compteur notifications:', msg);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Si on vient de se connecter (moins de 15 secondes), attendre avant de charger
    const timeSinceLogin = lastLoginTime ? Date.now() - lastLoginTime : Infinity;
    if (timeSinceLogin < 15000) {
      console.log('Connexion récente, attente avant de charger les notifications...');
      setIsLoading(false);
      // Attendre avant de charger
      const timeout = setTimeout(() => {
        loadCount();
      }, 15000 - timeSinceLogin);
      return () => clearTimeout(timeout);
    }

    loadCount();

    // Rafraîchir toutes les 60 secondes (réduit la fréquence)
    const interval = setInterval(loadCount, 60000);

    return () => clearInterval(interval);
  }, [isAuthenticated, lastLoginTime]);

  return { unreadCount, isLoading };
}
