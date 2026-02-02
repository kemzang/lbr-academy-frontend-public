// ============================================
// Page des notifications
// ============================================

'use client';

import { useState } from 'react';
import { 
  Bell, 
  BookOpen, 
  Heart, 
  UserPlus, 
  ShoppingBag,
  Award,
  MessageCircle,
  Check,
  Trash2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Mock data
const mockNotifications = [
  {
    id: 1,
    type: 'NEW_CONTENT',
    title: 'Nouveau contenu',
    message: 'coach_mbarga a publié un nouveau livre: "L\'Art de la Discipline"',
    linkUrl: '/contents/art-discipline-personnelle',
    isRead: false,
    createdAt: '2026-02-02T10:30:00',
  },
  {
    id: 2,
    type: 'FOLLOW',
    title: 'Nouvel abonné',
    message: 'marie_kouam vous suit maintenant',
    linkUrl: '/creators/4',
    isRead: false,
    createdAt: '2026-02-01T15:20:00',
  },
  {
    id: 3,
    type: 'COMMENT',
    title: 'Nouveau commentaire',
    message: 'paul_ngono a commenté sur votre contenu',
    linkUrl: '/contents/mon-contenu',
    isRead: true,
    createdAt: '2026-01-31T09:45:00',
  },
  {
    id: 4,
    type: 'PURCHASE',
    title: 'Achat confirmé',
    message: 'Votre achat de "Entrepreneuriat en Afrique" est confirmé',
    linkUrl: '/purchases',
    isRead: true,
    createdAt: '2026-01-30T14:00:00',
  },
  {
    id: 5,
    type: 'ROLE_UPGRADE',
    title: 'Demande approuvée',
    message: 'Félicitations ! Vous êtes maintenant Créateur',
    linkUrl: '/profile',
    isRead: true,
    createdAt: '2026-01-28T11:30:00',
  },
];

const notificationIcons = {
  NEW_CONTENT: { icon: BookOpen, color: '#F59E0B' },
  FOLLOW: { icon: UserPlus, color: '#3B82F6' },
  COMMENT: { icon: MessageCircle, color: '#10B981' },
  PURCHASE: { icon: ShoppingBag, color: '#8B5CF6' },
  ROLE_UPGRADE: { icon: Award, color: '#EF4444' },
  SYSTEM: { icon: Bell, color: '#64748B' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.isRead);

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAllRead = () => {
    setNotifications(prev => prev.filter(n => !n.isRead));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `Il y a ${minutes} min`;
      }
      return `Il y a ${hours}h`;
    }
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}` : 'Toutes vos notifications sont lues'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">
              Toutes
              <Badge variant="secondary" className="ml-2">{notifications.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread">
              Non lues
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-destructive">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">Lues</TabsTrigger>
          </TabsList>

          {notifications.some(n => n.isRead) && (
            <Button variant="ghost" size="sm" onClick={deleteAllRead} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer les lues
            </Button>
          )}
        </div>

        <TabsContent value={filter} className="mt-6">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => {
                const config = notificationIcons[notification.type as keyof typeof notificationIcons] || notificationIcons.SYSTEM;
                const Icon = config.icon;
                
                return (
                  <Card 
                    key={notification.id}
                    className={cn(
                      'transition-colors',
                      !notification.isRead && 'bg-primary/5 border-primary/20'
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div 
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: config.color + '20' }}
                        >
                          <Icon className="h-5 w-5" style={{ color: config.color }} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{notification.title}</p>
                            {!notification.isRead && (
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {notification.linkUrl && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={notification.linkUrl}>Voir</Link>
                            </Button>
                          )}
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-destructive"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune notification</h3>
                <p className="text-muted-foreground">
                  Vous n&apos;avez pas de notification pour le moment
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
