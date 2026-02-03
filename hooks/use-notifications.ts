// ============================================
// Hook pour les notifications
// ============================================

import { useState, useEffect } from 'react';
import { notificationsService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';

export function useNotifications() {
  const { isAuthenticated } = useAuthStore();
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
        console.error('Erreur chargement compteur notifications:', err);
        setUnreadCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadCount();

    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(loadCount, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return { unreadCount, isLoading };
}
