// ============================================
// Page des favoris - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Search, 
  Trash2,
  AlertCircle,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContentCard } from '@/components/ui/content-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { favoritesService } from '@/lib/api';
import { Favorite } from '@/types';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadFavorites = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await favoritesService.getMyFavorites(currentPage, 12);
      
      if (reset) {
        setFavorites(response.content);
        setPage(0);
      } else {
        setFavorites(prev => [...prev, ...response.content]);
      }
      setTotal(response.totalElements);
      setHasMore(response.hasNext);
    } catch (err) {
      console.error('Erreur chargement favoris:', err);
      setError('Impossible de charger vos favoris.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadFavorites(true);
  }, []);

  const handleRemove = async (contentId: number) => {
    try {
      await favoritesService.remove(contentId);
      setFavorites(prev => prev.filter(f => f.content?.id !== contentId));
      setTotal(prev => Math.max(0, prev - 1));
      toast.success('Retiré des favoris');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Filtrer les favoris valides (avec contenu) et appliquer la recherche
  const filteredFavorites = favorites.filter(f => {
    // Vérifier que le contenu existe
    if (!f.content || !f.content.title) return false;
    // Appliquer le filtre de recherche
    if (searchQuery.trim()) {
      return f.content.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    // Vérifications de sécurité supplémentaires
    if (!a.content || !b.content) return 0;
    
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'title-asc':
        return (a.content.title || '').localeCompare(b.content.title || '');
      case 'title-desc':
        return (b.content.title || '').localeCompare(a.content.title || '');
      default: // date-desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (error && favorites.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadFavorites(true)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Favoris</h1>
          <p className="text-muted-foreground">
            {total} contenu{total > 1 ? 's' : ''} sauvegardé{total > 1 ? 's' : ''}
          </p>
        </div>
        <Badge variant="outline" className="self-start">
          <Heart className="h-3 w-3 mr-1 fill-red-500 text-red-500" />
          {total}
        </Badge>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos favoris..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-desc">Plus récents</SelectItem>
            <SelectItem value="date-asc">Plus anciens</SelectItem>
            <SelectItem value="title-asc">Titre A-Z</SelectItem>
            <SelectItem value="title-desc">Titre Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && favorites.length === 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4]" />
          ))}
        </div>
      ) : sortedFavorites.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFavorites.map((fav, index) => {
              // Vérifier que le contenu existe
              if (!fav.content) return null;
              
              return (
                <div 
                  key={fav.id}
                  className="relative group animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ContentCard content={fav.content} />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(fav.content!.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => { setPage(p => p + 1); loadFavorites(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Voir plus'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Aucun favori ne correspond à votre recherche'
              : 'Ajoutez des contenus à vos favoris pour les retrouver ici'
            }
          </p>
          {!searchQuery && (
            <Button asChild>
              <a href="/explorer">Explorer les contenus</a>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
