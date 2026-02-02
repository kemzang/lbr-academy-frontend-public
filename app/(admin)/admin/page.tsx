// ============================================
// Dashboard Admin
// ============================================

'use client';

import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  UserPlus,
  FileCheck,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

// Mock data
const stats = [
  { 
    label: 'Utilisateurs', 
    value: '1,547', 
    change: '+12%', 
    trend: 'up',
    icon: Users, 
    color: '#3B82F6' 
  },
  { 
    label: 'Contenus publiés', 
    value: '234', 
    change: '+8%', 
    trend: 'up',
    icon: BookOpen, 
    color: '#10B981' 
  },
  { 
    label: 'Revenus (mois)', 
    value: '2.5M XAF', 
    change: '+23%', 
    trend: 'up',
    icon: DollarSign, 
    color: '#F59E0B' 
  },
  { 
    label: 'Abonnements actifs', 
    value: '328', 
    change: '-3%', 
    trend: 'down',
    icon: TrendingUp, 
    color: '#8B5CF6' 
  },
];

const pendingActions = [
  { type: 'content', label: 'Contenus en attente', count: 15, href: '/admin/contents?status=pending' },
  { type: 'role', label: 'Demandes de rôle', count: 8, href: '/admin/role-requests' },
  { type: 'report', label: 'Signalements', count: 3, href: '/admin/reports' },
];

const recentUsers = [
  { id: 1, username: 'marie_kouam', email: 'marie@example.com', role: 'APPRENANT', createdAt: 'Il y a 2h' },
  { id: 2, username: 'paul_ngono', email: 'paul@example.com', role: 'CREATEUR', createdAt: 'Il y a 5h' },
  { id: 3, username: 'jules_entrepreneur', email: 'jules@example.com', role: 'ENTREPRENEUR', createdAt: 'Il y a 1j' },
];

const recentContents = [
  { id: 1, title: 'Nouveau guide marketing', author: 'coach_mbarga', status: 'PENDING_REVIEW', type: 'BOOK' },
  { id: 2, title: 'Formation investissement', author: 'entrepreneur_paul', status: 'PENDING_REVIEW', type: 'FORMATION' },
  { id: 3, title: 'Article leadership', author: 'lecteur_royal', status: 'APPROVED', type: 'ARTICLE' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de La Bibliothèque des Rois
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="h-12 w-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: stat.color + '20' }}
                >
                  <stat.icon className="h-6 w-6" style={{ color: stat.color }} />
                </div>
                <Badge 
                  variant={stat.trend === 'up' ? 'default' : 'destructive'}
                  className={stat.trend === 'up' ? 'bg-green-500/20 text-green-500' : ''}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Actions */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Actions en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            {pendingActions.map((action) => (
              <Link 
                key={action.type}
                href={action.href}
                className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
              >
                <div>
                  <p className="font-medium">{action.label}</p>
                  <p className="text-sm text-muted-foreground">À traiter</p>
                </div>
                <Badge variant="destructive" className="text-lg px-3 py-1">
                  {action.count}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Nouveaux utilisateurs
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline">{user.role}</Badge>
                  <p className="text-xs text-muted-foreground mt-1">{user.createdAt}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Contents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Contenus récents
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/contents">Voir tout</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentContents.map((content) => (
              <div key={content.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <p className="text-sm text-muted-foreground">par {content.author}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={content.status === 'APPROVED' ? 'default' : 'secondary'}
                    className={content.status === 'APPROVED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}
                  >
                    {content.status === 'APPROVED' ? 'Publié' : 'En attente'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{content.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus - 30 derniers jours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
            <p>Graphique des revenus (à intégrer avec une lib de charts)</p>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-gradient-gold">2.5M</p>
              <p className="text-sm text-muted-foreground">Revenus totaux</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold">1,234</p>
              <p className="text-sm text-muted-foreground">Transactions</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold">2,025</p>
              <p className="text-sm text-muted-foreground">Panier moyen</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <p className="text-2xl font-bold text-green-500">+23%</p>
              <p className="text-sm text-muted-foreground">vs mois dernier</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
