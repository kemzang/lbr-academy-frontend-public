// ============================================
// Dashboard utilisateur - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  ShoppingBag, 
  Bell, 
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  FileText,
  AlertCircle,
  Crown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContentCard } from '@/components/ui/content-card';
import { useAuthStore } from '@/stores/auth-store';
import { contentsService, favoritesService, purchasesService, notificationsService, subscriptionsService } from '@/lib/api';
import { ContentSummary, Notification, UserSubscription } from '@/types';
import { formatPrice, formatRelativeDate } from '@/config/theme';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    favorites: 0,
    purchases: 0,
    unreadNotifications: 0,
  });
  const [recentPurchases, setRecentPurchases] = useState<ContentSummary[]>([]);
  const [favorites, setFavorites] = useState<ContentSummary[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Charger en parallèle
      const [favsData, purchasesData, notifsData, subData] = await Promise.all([
        favoritesService.getMyFavorites(0, 4).catch(() => ({ content: [], totalElements: 0 })),
        purchasesService.getMyPurchases(0, 4).catch(() => ({ content: [], totalElements: 0 })),
        notificationsService.getAll(0, 5).catch(() => ({ content: [], unreadCount: 0 })),
        subscriptionsService.getMySubscription().catch(() => null),
      ]);
      
      // Filtrer les favoris et achats valides (avec contenu)
      setFavorites(
        favsData.content
          .map((f: { content?: ContentSummary }) => f.content)
          .filter((content): content is ContentSummary => content !== undefined && content !== null)
      );
      setRecentPurchases(
        purchasesData.content
          .map((p: { content?: ContentSummary }) => p.content)
          .filter((content): content is ContentSummary => content !== undefined && content !== null)
      );
      setNotifications(notifsData.content);
      setSubscription(subData);
      
      setStats({
        favorites: favsData.totalElements,
        purchases: purchasesData.totalElements,
        unreadNotifications: notifsData.unreadCount || 0,
      });
    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Bienvenue, {user?.fullName || user?.username} 👋
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre activité sur La Bibliothèque des Rois.
        </p>
      </div>

      {/* Subscription Status */}
      {subscription ? (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                <Crown className="h-6 w-6 text-background" />
              </div>
              <div>
                <p className="font-semibold">Abonnement {subscription.plan?.name}</p>
                <p className="text-sm text-muted-foreground">
                  Valide jusqu'au {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link href="/subscriptions">Gérer</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Crown className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold">Aucun abonnement actif</p>
                <p className="text-sm text-muted-foreground">
                  Débloquez tous les contenus premium
                </p>
              </div>
            </div>
            <Button className="gradient-gold text-background" asChild>
              <Link href="/pricing">S'abonner</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/favorites">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Favoris</p>
                  <p className="text-2xl font-bold">{stats.favorites}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/purchases">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Achats</p>
                  <p className="text-2xl font-bold">{stats.purchases}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/notifications">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notifications</p>
                  <p className="text-2xl font-bold">{stats.unreadNotifications}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/explorer">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Explorer</p>
                  <p className="text-2xl font-bold">500+</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Purchases */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Achats récents</CardTitle>
              <CardDescription>Vos derniers contenus achetés</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/purchases">
                Voir tout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentPurchases.length > 0 ? (
              <div className="space-y-3">
                {recentPurchases
                  .filter(content => content && content.id)
                  .map(content => (
                    <ContentCard key={content.id} content={content} variant="compact" />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun achat pour le moment</p>
                <Button variant="link" asChild>
                  <Link href="/explorer">Explorer les contenus</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Favorites */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Vos favoris</CardTitle>
              <CardDescription>Contenus sauvegardés pour plus tard</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/favorites">
                Voir tout
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {favorites.length > 0 ? (
              <div className="space-y-3">
                {favorites
                  .filter(content => content && content.id)
                  .map(content => (
                    <ContentCard key={content.id} content={content} variant="compact" />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucun favori pour le moment</p>
                <Button variant="link" asChild>
                  <Link href="/explorer">Découvrir les contenus</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Notifications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Notifications récentes</CardTitle>
            <CardDescription>Restez informé des dernières actualités</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/notifications">
              Voir tout
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.slice(0, 5).map(notif => (
                <div 
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    !notif.isRead ? 'bg-primary/5' : 'hover:bg-muted'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    !notif.isRead ? 'bg-primary' : 'bg-muted'
                  }`} />
                  <div className="flex-1">
                    <p className={!notif.isRead ? 'font-medium' : ''}>{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatRelativeDate(notif.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucune notification</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
