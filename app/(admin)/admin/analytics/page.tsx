// ============================================
// Admin - Analytics - Connecté à l'API Backend
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  DollarSign,
  Eye,
  ShoppingCart,
  Star,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Activity,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  adminService, 
  AnalyticsStats, 
  TopContent, 
  TopCreator, 
  RecentActivity,
  UserDistribution,
  RevenueChartData 
} from '@/lib/api/admin';
import { formatPrice } from '@/config/theme';

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('month');
  
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [topContents, setTopContents] = useState<TopContent[]>([]);
  const [topCreators, setTopCreators] = useState<TopCreator[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [userDistribution, setUserDistribution] = useState<UserDistribution[]>([]);
  const [revenueChart, setRevenueChart] = useState<RevenueChartData[]>([]);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Charger toutes les données en parallèle
      const [
        analyticsData,
        topContentsData,
        topCreatorsData,
        activityData,
        distributionData,
        revenueData
      ] = await Promise.all([
        adminService.getAnalytics(),
        adminService.getTopContents(5, period),
        adminService.getTopCreators(5, period),
        adminService.getRecentActivity(10),
        adminService.getUserDistribution(),
        adminService.getRevenueChart(period === 'year' ? '12months' : '6months')
      ]);
      
      setStats(analyticsData);
      setTopContents(topContentsData);
      setTopCreators(topCreatorsData);
      setRecentActivity(activityData);
      setUserDistribution(distributionData.distribution);
      setRevenueChart(revenueData.data);
    } catch (err) {
      console.error('Erreur chargement analytics:', err);
      setError('Impossible de charger les analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
  }: { 
    title: string; 
    value: string | number; 
    change: number; 
    icon: any;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            <div className={`flex items-center mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(change).toFixed(1)}% vs mois dernier
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      'APPRENANT': 'bg-blue-500',
      'CREATEUR': 'bg-amber-500',
      'ENTREPRENEUR': 'bg-green-500',
      'HYBRIDE': 'bg-purple-500',
      'COACH': 'bg-pink-500',
      'ADMIN': 'bg-red-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadData}>Réessayer</Button>
      </div>
    );
  }

  // Calculer le max pour les barres de progression
  const maxRevenue = Math.max(...revenueChart.map(d => d.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Vue d'ensemble des performances de la plateforme
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
            <SelectItem value="year">Cette année</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Utilisateurs"
            value={stats.totalUsers.toLocaleString()}
            change={stats.userGrowth}
            icon={Users}
          />
          <StatCard
            title="Contenus"
            value={stats.totalContents.toLocaleString()}
            change={stats.contentGrowth}
            icon={BookOpen}
          />
          <StatCard
            title="Revenus"
            value={formatPrice(stats.totalRevenue)}
            change={stats.revenueGrowth}
            icon={DollarSign}
          />
          <StatCard
            title="Vues"
            value={stats.totalViews.toLocaleString()}
            change={stats.viewsGrowth}
            icon={Eye}
          />
        </div>
      )}

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </TabsTrigger>
          <TabsTrigger value="contents">
            <BookOpen className="h-4 w-4 mr-2" />
            Contenus
          </TabsTrigger>
          <TabsTrigger value="creators">
            <Users className="h-4 w-4 mr-2" />
            Créateurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Évolution des revenus</CardTitle>
                <CardDescription>Revenus sur les derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueChart.length > 0 ? (
                  <div className="space-y-3">
                    {revenueChart.map((item) => (
                      <div key={item.period} className="flex items-center gap-3">
                        <span className="w-12 text-sm text-muted-foreground">{item.period}</span>
                        <Progress 
                          value={(item.revenue / maxRevenue) * 100} 
                          className="flex-1" 
                        />
                        <span className="w-24 text-sm font-medium text-right">
                          {formatPrice(item.revenue)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition des utilisateurs</CardTitle>
                <CardDescription>Par rôle</CardDescription>
              </CardHeader>
              <CardContent>
                {userDistribution.length > 0 ? (
                  <div className="space-y-4">
                    {userDistribution.map((item) => (
                      <div key={item.role} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getRoleColor(item.role)}`} />
                        <span className="flex-1 text-sm capitalize">
                          {item.role.toLowerCase()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.count.toLocaleString()}
                        </span>
                        <span className="w-12 text-sm font-medium text-right">
                          {item.percentage.toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center">
                    <p className="text-muted-foreground">Aucune donnée disponible</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

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
                    <div key={activity.id} className="flex items-center gap-4 py-2">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'PURCHASE' ? 'bg-green-500' :
                        activity.type === 'REGISTER' ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`} />
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={activity.userAvatar} />
                        <AvatarFallback className="text-xs">
                          {activity.userName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{activity.userName}</span>
                      <span className="text-muted-foreground">{activity.action}</span>
                      {activity.targetName && (
                        <span className="font-medium">{activity.targetName}</span>
                      )}
                      <span className="ml-auto text-sm text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
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
        </TabsContent>

        <TabsContent value="contents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Contenus</CardTitle>
              <CardDescription>Les contenus les plus performants</CardDescription>
            </CardHeader>
            <CardContent>
              {topContents.length > 0 ? (
                <div className="space-y-4">
                  {topContents.map((content, i) => (
                    <div key={content.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                      <span className="text-2xl font-bold text-muted-foreground w-8">#{i + 1}</span>
                      {content.coverImage && (
                        <img 
                          src={content.coverImage} 
                          alt="" 
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{content.title}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {content.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShoppingCart className="h-3 w-3" />
                            {content.purchases}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                            {content.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatPrice(content.revenue)}</p>
                        <p className="text-xs text-muted-foreground">revenus</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun contenu disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Content Stats */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-3xl font-bold">{stats.totalContents}</p>
                    <p className="text-sm text-muted-foreground">Contenus publiés</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold">{stats.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Vues totales</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold">+{stats.newContentsThisMonth}</p>
                    <p className="text-sm text-muted-foreground">Nouveaux ce mois</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="creators" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Créateurs</CardTitle>
              <CardDescription>Les créateurs les plus performants</CardDescription>
            </CardHeader>
            <CardContent>
              {topCreators.length > 0 ? (
                <div className="space-y-4">
                  {topCreators.map((creator, i) => (
                    <div key={creator.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                      <span className="text-2xl font-bold text-muted-foreground w-8">#{i + 1}</span>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatarUrl} />
                        <AvatarFallback className="bg-primary/20 text-primary">
                          {creator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-sm text-muted-foreground">@{creator.username}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{creator.contentsCount} contenus</span>
                          <span>{creator.followersCount.toLocaleString()} abonnés</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{formatPrice(creator.totalRevenue)}</p>
                        <p className="text-xs text-muted-foreground">revenus générés</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Aucun créateur disponible
                </p>
              )}
            </CardContent>
          </Card>

          {/* Creator Stats */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Users className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                    <p className="text-sm text-muted-foreground">Utilisateurs totaux</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="text-3xl font-bold">+{stats.userGrowth.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Croissance ce mois</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="text-3xl font-bold">{formatPrice(stats.revenueThisMonth)}</p>
                    <p className="text-sm text-muted-foreground">Revenus ce mois</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
