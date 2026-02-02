// ============================================
// Page des achats
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Download,
  Play,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

// Mock data
const mockPurchases = [
  {
    id: 1,
    content: {
      id: 1,
      title: "L'Art de la Discipline Personnelle",
      slug: "art-discipline-personnelle",
      type: "BOOK",
      author: { username: "coach_mbarga" },
    },
    amount: 5000,
    currency: "XAF",
    status: "COMPLETED",
    paymentMethod: "Mobile Money",
    purchasedAt: "2026-01-20T10:30:00",
    progress: 65,
  },
  {
    id: 2,
    content: {
      id: 2,
      title: "Entrepreneuriat en Afrique: Guide Complet",
      slug: "entrepreneuriat-afrique",
      type: "FORMATION",
      author: { username: "entrepreneur_paul" },
    },
    amount: 15000,
    currency: "XAF",
    status: "COMPLETED",
    paymentMethod: "Mobile Money",
    purchasedAt: "2026-01-15T14:20:00",
    progress: 30,
  },
  {
    id: 3,
    content: {
      id: 3,
      title: "Méditations Stoïciennes",
      slug: "meditations-stoiciennes",
      type: "AUDIO",
      author: { username: "coach_mbarga" },
    },
    amount: 3000,
    currency: "XAF",
    status: "COMPLETED",
    paymentMethod: "Carte bancaire",
    purchasedAt: "2026-01-10T09:15:00",
    progress: 100,
  },
];

const statusConfig = {
  COMPLETED: { label: "Complété", color: "text-green-500", icon: CheckCircle },
  PENDING: { label: "En attente", color: "text-yellow-500", icon: Clock },
  FAILED: { label: "Échoué", color: "text-destructive", icon: Clock },
};

export default function PurchasesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPurchases = mockPurchases.filter(p =>
    p.content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSpent = mockPurchases
    .filter(p => p.status === 'COMPLETED')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mes achats</h1>
        <p className="text-muted-foreground">
          Retrouvez tous les contenus que vous avez achetés
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{mockPurchases.length}</p>
            <p className="text-sm text-muted-foreground">Contenus achetés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalSpent.toLocaleString()} XAF</p>
            <p className="text-sm text-muted-foreground">Total dépensé</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {mockPurchases.filter(p => p.progress === 100).length}
            </p>
            <p className="text-sm text-muted-foreground">Terminés</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher dans mes achats..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Purchases list */}
      {filteredPurchases.length > 0 ? (
        <div className="space-y-4">
          {filteredPurchases.map((purchase) => {
            const status = statusConfig[purchase.status as keyof typeof statusConfig];
            return (
              <Card key={purchase.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Cover */}
                    <div className="h-24 w-18 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-10 w-10 text-primary/50" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {purchase.content.type}
                        </Badge>
                        <Badge variant="secondary" className={cn("text-xs", status.color)}>
                          <status.icon className="h-3 w-3 mr-1" />
                          {status.label}
                        </Badge>
                      </div>
                      
                      <Link href={`/contents/${purchase.content.slug}`}>
                        <h3 className="font-semibold truncate hover:text-primary transition-colors">
                          {purchase.content.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-muted-foreground">
                        par {purchase.content.author.username}
                      </p>

                      {/* Progress */}
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={purchase.progress} className="h-1.5 flex-1 max-w-[200px]" />
                        <span className="text-xs text-muted-foreground">{purchase.progress}%</span>
                      </div>

                      {/* Purchase info */}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(purchase.purchasedAt).toLocaleDateString('fr-FR')}
                        </span>
                        <span>{purchase.paymentMethod}</span>
                        <span className="font-medium text-foreground">
                          {purchase.amount.toLocaleString()} {purchase.currency}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button size="sm" className="gradient-gold text-background" asChild>
                        <Link href={`/contents/${purchase.content.slug}`}>
                          <Play className="h-4 w-4 mr-1" />
                          {purchase.progress === 100 ? 'Relire' : 'Continuer'}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Télécharger
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
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun achat</h3>
            <p className="text-muted-foreground mb-4">
              Vous n&apos;avez pas encore acheté de contenu
            </p>
            <Button asChild>
              <Link href="/explorer">Explorer les contenus</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
