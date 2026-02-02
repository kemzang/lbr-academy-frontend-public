// ============================================
// Page des favoris
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  FolderOpen, 
  Plus,
  Trash2,
  BookOpen,
  Star,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

// Mock data
const mockFavorites = [
  {
    id: 1,
    content: {
      id: 1,
      title: "L'Art de la Discipline Personnelle",
      slug: "art-discipline-personnelle",
      type: "BOOK",
      author: { username: "coach_mbarga" },
      price: 5000,
      isFree: false,
      averageRating: 4.8,
    },
    collection: "À lire",
    createdAt: "2026-01-20",
  },
  {
    id: 2,
    content: {
      id: 2,
      title: "Entrepreneuriat en Afrique",
      slug: "entrepreneuriat-afrique",
      type: "FORMATION",
      author: { username: "entrepreneur_paul" },
      price: 15000,
      isFree: false,
      averageRating: 4.9,
    },
    collection: "À lire",
    createdAt: "2026-01-18",
  },
  {
    id: 3,
    content: {
      id: 3,
      title: "Les 48 Lois du Pouvoir",
      slug: "48-lois-pouvoir",
      type: "ARTICLE",
      author: { username: "lecteur_royal" },
      isFree: true,
      averageRating: 4.7,
    },
    collection: "Favoris",
    createdAt: "2026-01-15",
  },
];

const mockCollections = [
  { name: "Tous", count: 3 },
  { name: "À lire", count: 2 },
  { name: "Favoris", count: 1 },
];

export default function FavoritesPage() {
  const [activeCollection, setActiveCollection] = useState("Tous");
  const [favorites, setFavorites] = useState(mockFavorites);

  const filteredFavorites = activeCollection === "Tous" 
    ? favorites 
    : favorites.filter(f => f.collection === activeCollection);

  const removeFavorite = (id: number) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes favoris</h1>
          <p className="text-muted-foreground">
            Retrouvez tous les contenus que vous avez sauvegardés
          </p>
        </div>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle collection
        </Button>
      </div>

      {/* Collections tabs */}
      <Tabs value={activeCollection} onValueChange={setActiveCollection}>
        <TabsList>
          {mockCollections.map(collection => (
            <TabsTrigger key={collection.name} value={collection.name} className="gap-2">
              {collection.name === "Tous" ? (
                <Heart className="h-4 w-4" />
              ) : (
                <FolderOpen className="h-4 w-4" />
              )}
              {collection.name}
              <Badge variant="secondary" className="ml-1">
                {collection.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCollection} className="mt-6">
          {filteredFavorites.length > 0 ? (
            <div className="space-y-4">
              {filteredFavorites.map((favorite) => (
                <Card key={favorite.id} className="group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Cover placeholder */}
                      <div className="h-20 w-16 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-8 w-8 text-primary/50" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {favorite.content.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            dans {favorite.collection}
                          </span>
                        </div>
                        
                        <Link href={`/contents/${favorite.content.slug}`}>
                          <h3 className="font-semibold truncate hover:text-primary transition-colors">
                            {favorite.content.title}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-muted-foreground">
                          par {favorite.content.author.username}
                        </p>

                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                            {favorite.content.averageRating}
                          </span>
                          <span className={cn(
                            "text-sm font-medium",
                            favorite.content.isFree ? "text-green-500" : "text-primary"
                          )}>
                            {favorite.content.isFree ? "Gratuit" : `${favorite.content.price?.toLocaleString()} XAF`}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/contents/${favorite.content.slug}`}>
                            Voir
                          </Link>
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <FolderOpen className="h-4 w-4 mr-2" />
                              Changer de collection
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => removeFavorite(favorite.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Retirer des favoris
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Heart className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
                <p className="text-muted-foreground mb-4">
                  Ajoutez des contenus à vos favoris pour les retrouver ici
                </p>
                <Button asChild>
                  <Link href="/explorer">Explorer les contenus</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
