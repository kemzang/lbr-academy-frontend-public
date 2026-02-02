// ============================================
// Page Dashboard utilisateur
// ============================================

'use client';

import Link from 'next/link';
import { 
  BookOpen, 
  Heart, 
  ShoppingBag, 
  Eye,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Play
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuthStore } from '@/stores/auth-store';

// Mock data
const stats = [
  { label: 'Contenus achetés', value: 12, icon: ShoppingBag, color: '#F59E0B' },
  { label: 'Favoris', value: 24, icon: Heart, color: '#EF4444' },
  { label: 'Contenus lus', value: 8, icon: BookOpen, color: '#10B981' },
  { label: 'Heures d\'apprentissage', value: 45, icon: Clock, color: '#3B82F6' },
];

const recentPurchases = [
  {
    id: 1,
    title: "L'Art de la Discipline",
    author: "Coach Mbarga",
    type: "BOOK",
    progress: 65,
    coverUrl: null,
  },
  {
    id: 2,
    title: "Entrepreneuriat en Afrique",
    author: "Paul Entrepreneur",
    type: "FORMATION",
    progress: 30,
    coverUrl: null,
  },
  {
    id: 3,
    title: "Méditations Stoïciennes",
    author: "Coach Mbarga",
    type: "AUDIO",
    progress: 100,
    coverUrl: null,
  },
];

const recommendations = [
  {
    id: 4,
    title: "Masterclass Investissement",
    author: "Paul Entrepreneur",
    type: "VIDEO",
    price: 25000,
    rating: 4.9,
  },
  {
    id: 5,
    title: "Collection Philosophie Africaine",
    author: "Lecteur Royal",
    type: "SERIES",
    price: 10000,
    rating: 4.8,
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  
  const isCreator = ['CREATEUR', 'ENTREPRENEUR', 'HYBRIDE', 'COACH', 'ADMIN'].includes(user?.role || '');

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Welcome */}
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Bonjour, <span className="text-gradient-gold">{user?.username || 'Roi'}</span> 👑
        </h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace personnel. Continuez votre apprentissage.
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
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent purchases / In progress */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Continuer l&apos;apprentissage</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/purchases">
                  Voir tout
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPurchases.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="h-16 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-6 w-6 text-primary/50" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.author}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Progress value={item.progress} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{item.progress}%</span>
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    <Play className="h-4 w-4 mr-1" />
                    {item.progress === 100 ? 'Relire' : 'Continuer'}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Creator stats (if creator) */}
          {isCreator && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Mes performances</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/my-contents">
                    Gérer mes contenus
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <p className="text-2xl font-bold text-gradient-gold">12</p>
                    <p className="text-sm text-muted-foreground">Contenus publiés</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <p className="text-2xl font-bold">3,450</p>
                    <p className="text-sm text-muted-foreground">Vues totales</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-muted/30">
                    <p className="text-2xl font-bold text-green-500">125K XAF</p>
                    <p className="text-sm text-muted-foreground">Revenus ce mois</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandé pour vous</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((item) => (
                <Link 
                  key={item.id}
                  href={`/contents/${item.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-12 w-10 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-5 w-5 text-primary/50" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                      <span className="text-xs flex items-center gap-1">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        {item.rating}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {item.price.toLocaleString()} XAF
                  </span>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activité récente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <p className="text-sm">Vous avez acheté <strong>L&apos;Art de la Discipline</strong></p>
                  <p className="text-xs text-muted-foreground">Il y a 2 jours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="text-sm">Vous avez ajouté <strong>Masterclass Investissement</strong> aux favoris</p>
                  <p className="text-xs text-muted-foreground">Il y a 3 jours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm">Vous avez terminé <strong>Méditations Stoïciennes</strong></p>
                  <p className="text-xs text-muted-foreground">Il y a 5 jours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
