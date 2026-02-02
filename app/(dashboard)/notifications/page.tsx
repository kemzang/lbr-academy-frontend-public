// ============================================
// Page des notifications - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Trash2,
  AlertCircle,
  Info,
  Star,
  Heart,
  ShoppingBag,
  MessageSquare,
  Crown,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { notificationsService } from '@/lib/api';
import { Notification } from '@/types';
import { formatRelativeDate } from '@/config/theme';
import { toast } from 'sonner';

const notificationIcons: { [key: string]: typeof Bell } = {
  INFO: Info,
  RATING: Star,
  FAVORITE: Heart,
  PURCHASE: ShoppingBag,
  COMMENT: MessageSquare,
  SUBSCRIPTION: Crown,
  FOLLOW: UserPlus,
  DEFAULT: Bell,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await notificationsService.getAll(currentPage, 20);
      
      if (reset) {
        setNotifications(response.content);
        setPage(0);
      } else {
        setNotifications(prev => [...prev, ...response.content]);
      }
      setUnreadCount(response.unreadCount || 0);
      setHasMore(response.hasNext);
    } catch (err) {
      console.error('Erreur chargement notifications:', err);
      setError('Impossible de charger vos notifications.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadNotifications(true);
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsService.markAsRead(id);
      setNotifications(prev => prev.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('Toutes les notifications marquées comme lues');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await notificationsService.delete(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification supprimée');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getNotificationIcon = (type?: string) => {
    return notificationIcons[type || 'DEFAULT'] || Bell;
  };

  if (error && notifications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadNotifications(true)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 
              ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
              : 'Toutes vos notifications sont lues'
            }
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Tout marquer comme lu
          </Button>
        )}
      </div>

      {/* Loading */}
      {isLoading && notifications.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <>
          <Card>
            <CardContent className="p-0 divide-y divide-border">
              {notifications.map((notif, index) => {
                const Icon = getNotificationIcon(notif.type);
                return (
                  <div 
                    key={notif.id}
                    className={`flex items-start gap-4 p-4 transition-colors hover:bg-muted/50 animate-fade-up ${
                      !notif.isRead ? 'bg-primary/5' : ''
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      !notif.isRead ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${!notif.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={!notif.isRead ? 'font-medium' : ''}>
                        {notif.message}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatRelativeDate(notif.createdAt)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!notif.isRead && (
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notif.id)}
                          title="Marquer comme lu"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(notif.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Load more */}
          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => { setPage(p => p + 1); loadNotifications(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Bell className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
          <p className="text-muted-foreground">
            Vous n'avez pas encore reçu de notification
          </p>
        </div>
      )}
    </div>
  );
}
