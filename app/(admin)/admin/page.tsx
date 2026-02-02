// ============================================
// Dashboard Admin - Connecté à l'API
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
  AlertCircle,
  ChevronRight,
  UserCheck,
  FileText,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { adminService } from '@/lib/api';

interface AdminStats {
  totalUsers: number;
  totalContents: number;
  totalPurchases: number;
  totalRevenue: number;
  pendingRoleRequests: number;
  pendingContents: number;
  newUsersThisMonth: number;
  newContentsThisMonth: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Erreur chargement stats:', err);
      setError('Impossible de charger les statistiques.');
      // Fallback avec des stats vides
      setStats({
        totalUsers: 0,
        totalContents: 0,
        totalPurchases: 0,
        totalRevenue: 0,
        pendingRoleRequests: 0,
        pendingContents: 0,
        newUsersThisMonth: 0,
        newContentsThisMonth: 0,
      });
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
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de La Bibliothèque des Rois
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Utilisateurs</p>
                <p className="text-3xl font-bold">{stats?.totalUsers.toLocaleString()}</p>
                {stats?.newUsersThisMonth !== undefined && stats.newUsersThisMonth > 0 && (
                  <p className="text-xs text-green-500 mt-1">
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
                <p className="text-3xl font-bold">{stats?.totalContents.toLocaleString()}</p>
                {stats?.newContentsThisMonth !== undefined && stats.newContentsThisMonth > 0 && (
                  <p className="text-xs text-green-500 mt-1">
                    +{stats.newContentsThisMonth} ce mois
                  </p>
                )}
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
                <p className="text-3xl font-bold">{stats?.totalPurchases.toLocaleString()}</p>
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
                <p className="text-3xl font-bold">
                  {(stats?.totalRevenue || 0).toLocaleString()} XAF
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {stats?.pendingRoleRequests || 0} en attente
                  </p>
                </div>
                {(stats?.pendingRoleRequests || 0) > 0 && (
                  <Badge variant="destructive">{stats?.pendingRoleRequests}</Badge>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
                    {stats?.pendingContents || 0} en attente
                  </p>
                </div>
                {(stats?.pendingContents || 0) > 0 && (
                  <Badge variant="destructive">{stats?.pendingContents}</Badge>
                )}
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
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
                  <h3 className="font-semibold">Gestion utilisateurs</h3>
                  <p className="text-sm text-muted-foreground">
                    Voir tous les utilisateurs
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
            <CardDescription>Accédez rapidement aux fonctionnalités admin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Gérer les utilisateurs
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/contents">
                <BookOpen className="h-4 w-4 mr-2" />
                Gérer les contenus
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/role-requests">
                <UserCheck className="h-4 w-4 mr-2" />
                Demandes de rôle
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/categories">
                <TrendingUp className="h-4 w-4 mr-2" />
                Gérer les catégories
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
            <CardDescription>Performance de la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Taux de conversion</span>
                <span className="font-semibold">
                  {stats?.totalUsers && stats?.totalPurchases 
                    ? ((stats.totalPurchases / stats.totalUsers) * 100).toFixed(1) 
                    : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Revenu moyen/vente</span>
                <span className="font-semibold">
                  {stats?.totalRevenue && stats?.totalPurchases 
                    ? Math.round(stats.totalRevenue / stats.totalPurchases).toLocaleString() 
                    : 0} XAF
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Contenus/créateur</span>
                <span className="font-semibold">
                  {stats?.totalUsers && stats?.totalContents 
                    ? (stats.totalContents / Math.max(1, stats.totalUsers / 10)).toFixed(1) 
                    : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
