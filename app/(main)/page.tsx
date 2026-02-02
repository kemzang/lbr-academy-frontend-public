// ============================================
// Page d'accueil - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  ArrowRight,
  Play,
  Star,
  Users,
  TrendingUp,
  Zap,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { SectionHeader } from '@/components/ui/section-header';
import { ContentCard } from '@/components/ui/content-card';
import { contentsService, categoriesService } from '@/lib/api';
import { ContentSummary, Category } from '@/types';

const stats = [
  { label: 'Contenus', value: '500+', icon: BookOpen },
  { label: 'Créateurs', value: '150+', icon: Users },
  { label: 'Apprenants', value: '10K+', icon: GraduationCap },
  { label: 'Note moyenne', value: '4.8', icon: Star },
];

export default function HomePage() {
  const [featuredContents, setFeaturedContents] = useState<ContentSummary[]>([]);
  const [latestContents, setLatestContents] = useState<ContentSummary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Charger en parallèle
      const [featured, latest, cats] = await Promise.all([
        contentsService.getFeatured(6).catch(() => []),
        contentsService.getLatest(6).catch(() => []),
        categoriesService.getAll().catch(() => []),
      ]);
      
      setFeaturedContents(featured);
      setLatestContents(latest);
      setCategories(cats.slice(0, 4)); // Prendre les 4 premières
    } catch (err) {
      console.error('Erreur chargement page accueil:', err);
      setError('Certaines données n\'ont pas pu être chargées.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-up">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Bienvenue dans la Bibliothèque des Rois</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up stagger-1">
              <span className="text-gradient-gold">Savoir.</span>{' '}
              <span className="text-foreground">Héritage.</span>{' '}
              <span className="text-secondary">Pouvoir.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up stagger-2">
              Accédez à une collection exclusive de livres, formations et articles créés par les esprits les plus brillants d&apos;Afrique et du monde.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up stagger-3">
              <Button size="lg" className="gradient-gold text-background font-semibold text-lg px-8 h-14 glow-gold hover:glow-gold-lg transition-all" asChild>
                <Link href="/explorer">
                  Explorer la Bibliothèque
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-primary/30 hover:bg-primary/10" asChild>
                <Link href="/register">
                  <Play className="mr-2 h-5 w-5" />
                  Rejoindre gratuitement
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-up stagger-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-3">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gradient-gold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Contents */}
      <section className="py-20 bg-gradient-to-b from-background to-card/30">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Contenus en Vedette"
            subtitle="Découvrez les contenus les plus appréciés par notre communauté"
            href="/explorer?featured=true"
          />
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : featuredContents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredContents.map((content, index) => (
                <div 
                  key={content.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ContentCard content={content} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Les contenus en vedette arrivent bientôt</p>
            </div>
          )}
          
          <div className="text-center mt-10">
            <Button size="lg" variant="outline" className="border-primary/30" asChild>
              <Link href="/explorer">
                Voir tous les contenus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Contents */}
      {latestContents.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <SectionHeader 
              title="Dernières Publications"
              subtitle="Les contenus les plus récents de nos créateurs"
              href="/explorer?sortBy=date&sortDir=desc"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestContents.map((content, index) => (
                <div 
                  key={content.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ContentCard content={content} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <SectionHeader 
              title="Explorer par Catégorie"
              subtitle="Trouvez le contenu qui correspond à vos centres d'intérêt"
              href="/categories"
              align="center"
            />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
              {categories.map((category, index) => (
                <Link 
                  key={category.id}
                  href={`/explorer?categoryId=${category.id}`}
                  className="group"
                >
                  <Card 
                    className="h-full border-border/50 bg-card/30 hover:bg-card hover:border-primary/30 transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 bg-primary/20">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.contentCount || 0} contenus
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 gradient-royal opacity-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Crown className="h-16 w-16 text-primary mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Prêt à rejoindre la <span className="text-gradient-gold">royauté intellectuelle</span> ?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Créez votre compte gratuitement et accédez à une bibliothèque de connaissances sans limite.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="gradient-gold text-background font-semibold text-lg px-8 h-14" asChild>
                <Link href="/register">
                  Commencer maintenant
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <Link href="/pricing">
                  Voir les abonnements
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
