// ============================================
// Page des catégories
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  TrendingUp, 
  Crown, 
  Zap,
  Heart,
  Brain,
  Briefcase,
  BookOpen,
  Palette,
  Globe,
  Users,
  Target
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

// Mock data - sera remplacé par l'API
const mockCategories = [
  { 
    id: 1, 
    name: 'Développement Personnel', 
    slug: 'developpement-personnel',
    description: 'Améliorer sa vie personnelle, sa productivité et son bien-être.',
    icon: Sparkles, 
    contentCount: 145, 
    color: '#F59E0B',
    featured: true
  },
  { 
    id: 2, 
    name: 'Business & Entrepreneuriat', 
    slug: 'business-entrepreneuriat',
    description: 'Créer, développer et gérer une entreprise prospère.',
    icon: TrendingUp, 
    contentCount: 89, 
    color: '#10B981',
    featured: true
  },
  { 
    id: 3, 
    name: 'Leadership', 
    slug: 'leadership',
    description: 'Devenir un leader inspirant et efficace.',
    icon: Crown, 
    contentCount: 67, 
    color: '#3B82F6',
    featured: true
  },
  { 
    id: 4, 
    name: 'Finance & Investissement', 
    slug: 'finance-investissement',
    description: 'Gérer son argent et faire fructifier son patrimoine.',
    icon: Zap, 
    contentCount: 54, 
    color: '#8B5CF6',
    featured: true
  },
  { 
    id: 5, 
    name: 'Relations & Communication', 
    slug: 'relations-communication',
    description: 'Améliorer ses relations et sa communication.',
    icon: Heart, 
    contentCount: 42, 
    color: '#EF4444',
    featured: false
  },
  { 
    id: 6, 
    name: 'Psychologie & Mindset', 
    slug: 'psychologie-mindset',
    description: 'Comprendre l\'esprit humain et développer un état d\'esprit gagnant.',
    icon: Brain, 
    contentCount: 38, 
    color: '#EC4899',
    featured: false
  },
  { 
    id: 7, 
    name: 'Carrière & Emploi', 
    slug: 'carriere-emploi',
    description: 'Réussir sa carrière professionnelle.',
    icon: Briefcase, 
    contentCount: 35, 
    color: '#06B6D4',
    featured: false
  },
  { 
    id: 8, 
    name: 'Éducation & Apprentissage', 
    slug: 'education-apprentissage',
    description: 'Techniques d\'apprentissage et de mémorisation.',
    icon: BookOpen, 
    contentCount: 28, 
    color: '#84CC16',
    featured: false
  },
  { 
    id: 9, 
    name: 'Art & Créativité', 
    slug: 'art-creativite',
    description: 'Développer sa créativité et son expression artistique.',
    icon: Palette, 
    contentCount: 24, 
    color: '#F97316',
    featured: false
  },
  { 
    id: 10, 
    name: 'Culture & Histoire', 
    slug: 'culture-histoire',
    description: 'Explorer l\'histoire et les cultures du monde.',
    icon: Globe, 
    contentCount: 31, 
    color: '#14B8A6',
    featured: false
  },
  { 
    id: 11, 
    name: 'Spiritualité', 
    slug: 'spiritualite',
    description: 'Développement spirituel et quête de sens.',
    icon: Target, 
    contentCount: 19, 
    color: '#A855F7',
    featured: false
  },
  { 
    id: 12, 
    name: 'Famille & Parentalité', 
    slug: 'famille-parentalite',
    description: 'Éducation des enfants et vie de famille.',
    icon: Users, 
    contentCount: 22, 
    color: '#F43F5E',
    featured: false
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(mockCategories);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement depuis l'API
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  const featuredCategories = categories.filter(c => c.featured);
  const otherCategories = categories.filter(c => !c.featured);

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

        {/* Featured Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Catégories populaires</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => (
              <Link 
                key={category.id}
                href={`/explorer?categoryId=${category.id}`}
                className="group"
              >
                <Card 
                  className={cn(
                    'h-full border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 overflow-hidden animate-fade-up',
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 relative">
                    {/* Background glow */}
                    <div 
                      className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"
                      style={{ backgroundColor: category.color }}
                    />
                    
                    <div 
                      className="relative w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <category.icon className="h-8 w-8" style={{ color: category.color }} />
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <Badge variant="secondary">
                      {category.contentCount} contenus
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* All Categories */}
        <section>
          <h2 className="text-2xl font-bold mb-8">Toutes les catégories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {otherCategories.map((category, index) => (
              <Link 
                key={category.id}
                href={`/explorer?categoryId=${category.id}`}
                className="group"
              >
                <Card 
                  className="border-border/50 bg-card/30 hover:bg-card hover:border-primary/30 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <category.icon className="h-6 w-6" style={{ color: category.color }} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.contentCount} contenus
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
