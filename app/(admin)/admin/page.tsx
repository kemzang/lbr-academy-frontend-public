// ============================================
// Dashboard Admin - Connecté à l'API Backend
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  BookOpen, 
  ShoppingBag, 
  Crown,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ChevronRight,
  UserCheck,
  FileText,
  DollarSign,
  Eye,
  CreditCard,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { adminService, DashboardStats, RecentActivity } from '@/lib/api/admin';
import { formatPrice } from '@/config/theme';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  // Debug: afficher l'état de l'authentification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('lbr_access_token');
      console.log('Admin Dashboard - Token présent:', !!token);
      console.log('Admin Dashboard - Token preview:', token ? token.substring(0, 20) + '...' : 'none');
    }
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Charger les stats et l'activité récente en parallèle
      const [statsData, activityData] = await Promise.all([
        adminService.getStats(),
        adminService.getRecentActivity(5).catch(() => [])
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : 'Erreur inconnue');
      
      // Vérifier si c'est une erreur d'authentification
      if (msg.includes('Token expiré') || msg.includes('invalide') || msg.includes('AUTH_TOKEN_EXPIRED') || msg.includes('Veuillez vous reconnecter')) {
        console.warn('Session expirée, redirection vers login...');
        setError('Votre session a expiré. Redirection...');
        // Nettoyer les tokens et rediriger
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lbr_access_token');
          localStorage.removeItem('lbr_refresh_token');
          localStorage.removeItem('lbr_user');
          setTimeout(() => {
            window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
          }, 1000);
        }
        return;
      }
      
      if (msg !== '{}' && msg !== '[object Object]') {
        console.error('Erreur chargement stats:', msg);
      }
      setError('Impossible de charger les statistiques.');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PURCHASE': return <ShoppingBag className="h-4 w-4 text-green-500" />;
      case 'REGISTER': return <Users className="h-4 w-4 text-blue-500" />;
      case 'CONTENT_PUBLISHED': return <BookOpen className="h-4 w-4 text-purple-500" />;
      default: return <Eye className="h-4 w-4 text-muted-foreground" />;
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble de La Bibliothèque des Rois
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics détaillés
          </Link>
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            {error.includes('session a expiré') && (
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={() => window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname)}
              >
                Se reconnecter
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Utilisateurs</p>
                <p className="text-3xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</p>
                {stats?.newUsersThisMonth && stats.newUsersThisMonth > 0 && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{stats.newUsersThisMonth} ce mois
                  </p>
                )}
              </div>
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contenus</p>
                <p className="text-3xl font-bold">{stats?.totalContents?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.publishedContents || 0} publiés
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                <BookOpen className="h-7 w-7 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Ventes</p>
                <p className="text-3xl font-bold">{stats?.totalPurchases?.toLocaleString() || 0}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats?.activeSubscriptions || 0} abonnés actifs
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <ShoppingBag className="h-7 w-7 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revenus</p>
                <p className="text-3xl font-bold">{formatPrice(stats?.totalRevenue)}</p>
                {stats?.revenueThisMonth && stats.revenueThisMonth > 0 && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +{formatPrice(stats.revenueThisMonth)} ce mois
                  </p>
                )}
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions with badges */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Role Requests */}
        <Link href="/admin/role-requests">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Demandes de rôle</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.pendingRoleUpgrades || 0} en attente
                  </p>
                </div>
                {(stats?.pendingRoleUpgrades || 0) > 0 && (
                  <Badge variant="destructive">{stats?.pendingRoleUpgrades}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Pending Contents */}
        <Link href="/admin/contents?status=PENDING_REVIEW">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Contenus à valider</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.pendingContentApprovals || 0} en attente
                  </p>
                </div>
                {(stats?.pendingContentApprovals || 0) > 0 && (
                  <Badge variant="destructive">{stats?.pendingContentApprovals}</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Users Management */}
        <Link href="/admin/users">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Utilisateurs</h3>
                  <p className="text-sm text-muted-foreground">
                    {stats?.activeCreators || 0} créateurs actifs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Subscriptions */}
        <Link href="/admin/subscriptions">
          <Card className="hover:border-primary/30 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Abonnements</h3>
                  <p className="text-sm text-muted-foreground">
                    +{stats?.newSubscriptionsThisMonth || 0} ce mois
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Two columns: Recent Activity + Quick Links */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
            <CardDescription>Les dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activity.userAvatar} />
                      <AvatarFallback className="text-xs">
                        {activity.userName?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.userName}</span>{' '}
                        <span className="text-muted-foreground">{activity.action}</span>{' '}
                        {activity.targetName && (
                          <span className="font-medium">{activity.targetName}</span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {getActivityIcon(activity.type)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Aucune activité récente
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accès aux fonctionnalités admin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/users">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Gérer les utilisateurs
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/contents">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Gérer les contenus
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/categories">
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Gérer les catégories
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/subscriptions">
                <span className="flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Plans d'abonnement
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/analytics">
                <span className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics complets
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/admin/settings">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Paramètres
                </span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
