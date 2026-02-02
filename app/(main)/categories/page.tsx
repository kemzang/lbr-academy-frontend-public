// ============================================
// Page des catégories - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen,
  FolderOpen,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { categoriesService } from '@/lib/api';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err: unknown) {
      console.error('Erreur chargement catégories:', err);
      setError('Impossible de charger les catégories. Vérifiez que le backend est lancé.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={loadCategories}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 gradient-gold text-background">
            <BookOpen className="h-3 w-3 mr-1" />
            Catégories
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Explorez par <span className="text-gradient-gold">thématique</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Découvrez notre collection de contenus organisés par catégorie. 
            Trouvez exactement ce dont vous avez besoin pour progresser.
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link 
                key={category.id}
                href={`/explorer?categoryId=${category.id}`}
                className="group"
              >
                <Card 
                  className="h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6 relative">
                    {/* Background glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity bg-primary" />
                    
                    <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-primary/20">
                      {category.iconUrl ? (
                        <img src={category.iconUrl} alt="" className="h-8 w-8" />
                      ) : (
                        <FolderOpen className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    
                    <Badge variant="secondary">
                      {category.contentCount || 0} contenus
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune catégorie</h3>
            <p className="text-muted-foreground">
              Les catégories seront bientôt disponibles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
