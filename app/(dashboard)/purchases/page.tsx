// ============================================
// Page des achats - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Download,
  AlertCircle,
  Filter,
  Calendar,
  BookOpen,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { purchasesService } from '@/lib/api';
import { Purchase } from '@/types';
import { formatPrice, formatRelativeDate, contentTypes } from '@/config/theme';

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const loadPurchases = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await purchasesService.getMyPurchases(currentPage, 12);
      
      if (reset) {
        setPurchases(response.content);
        setPage(0);
        // Calculer le total dépensé
        const spent = response.content.reduce((acc: number, p: Purchase) => acc + (p.amount || 0), 0);
        setTotalSpent(spent);
      } else {
        setPurchases(prev => [...prev, ...response.content]);
      }
      setTotal(response.totalElements);
      setHasMore(response.hasNext);
    } catch (err) {
      console.error('Erreur chargement achats:', err);
      setError('Impossible de charger vos achats.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadPurchases(true);
  }, []);

  const filteredPurchases = purchases.filter(p =>
    p.content?.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedPurchases = [...filteredPurchases].sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime();
      case 'price-desc':
        return (b.amount || 0) - (a.amount || 0);
      case 'price-asc':
        return (a.amount || 0) - (b.amount || 0);
      default: // date-desc
        return new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime();
    }
  });

  if (error && purchases.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Achats</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadPurchases(true)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Achats</h1>
          <p className="text-muted-foreground">
            {total} contenu{total > 1 ? 's' : ''} acheté{total > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Total: {formatPrice(totalSpent)}
          </Badge>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos achats..."
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
            <SelectItem value="price-desc">Prix décroissant</SelectItem>
            <SelectItem value="price-asc">Prix croissant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && purchases.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : sortedPurchases.length > 0 ? (
        <>
          <div className="space-y-4">
            {sortedPurchases.map((purchase, index) => {
              const content = purchase.content;
              if (!content) return null;
              
              const typeInfo = contentTypes[content.type] || contentTypes.ARTICLE;
              
              return (
                <Card 
                  key={purchase.id}
                  className="hover:border-primary/30 transition-colors animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Cover */}
                      <div 
                        className="w-full sm:w-24 h-32 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: typeInfo.color + '20' }}
                      >
                        {content.coverUrl ? (
                          <img 
                            src={content.coverUrl} 
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8" style={{ color: typeInfo.color }} />
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Badge 
                              className="mb-2 text-white"
                              style={{ backgroundColor: typeInfo.color }}
                            >
                              {typeInfo.label}
                            </Badge>
                            <h3 className="font-semibold text-lg line-clamp-1">
                              <Link 
                                href={`/contents/${content.slug}`}
                                className="hover:text-primary transition-colors"
                              >
                                {content.title}
                              </Link>
                            </h3>
                            {content.author && (
                              <p className="text-sm text-muted-foreground">
                                Par {content.author.fullName || content.author.username}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-lg">{formatPrice(purchase.amount)}</p>
                            <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatRelativeDate(purchase.purchaseDate)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-4">
                          <Button size="sm" asChild>
                            <Link href={`/contents/${content.slug}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Lire
                            </Link>
                          </Button>
                          {purchase.invoiceUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={purchase.invoiceUrl} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4 mr-2" />
                                Facture
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => { setPage(p => p + 1); loadPurchases(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Voir plus'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun achat</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'Aucun achat ne correspond à votre recherche'
              : 'Vous n\'avez pas encore acheté de contenu'
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
