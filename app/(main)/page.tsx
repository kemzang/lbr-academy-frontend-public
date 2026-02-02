// ============================================
// Page d'accueil - La Bibliothèque des Rois
// ============================================

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
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

// Mock data pour la démo
const featuredContents = [
  {
    id: 1,
    title: "L'Art de la Discipline Personnelle",
    slug: "art-discipline-personnelle",
    summary: "Découvrez les secrets des grands leaders pour développer une discipline de fer.",
    type: "BOOK" as const,
    coverUrl: "/api/placeholder/300/400",
    isFree: false,
    price: 5000,
    currency: "XAF",
    status: "APPROVED" as const,
    viewCount: 1250,
    averageRating: 4.8,
    ratingCount: 89,
    author: { id: 1, username: "coach_mbarga", email: "", role: "COACH" as const, roleDisplayName: "Coach Certifié" },
    createdAt: "2026-01-15",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Entrepreneuriat en Afrique: Guide Complet",
    slug: "entrepreneuriat-afrique-guide",
    summary: "Un guide pratique pour lancer et développer votre business en Afrique.",
    type: "FORMATION" as const,
    coverUrl: "/api/placeholder/300/400",
    isFree: false,
    price: 15000,
    currency: "XAF",
    status: "APPROVED" as const,
    viewCount: 890,
    averageRating: 4.9,
    ratingCount: 56,
    author: { id: 2, username: "entrepreneur_paul", email: "", role: "ENTREPRENEUR" as const, roleDisplayName: "Entrepreneur" },
    createdAt: "2026-01-20",
    isFeatured: true,
  },
  {
    id: 3,
    title: "Les 48 Lois du Pouvoir - Résumé",
    slug: "48-lois-pouvoir-resume",
    summary: "Résumé et analyse des 48 lois du pouvoir de Robert Greene.",
    type: "ARTICLE" as const,
    coverUrl: "/api/placeholder/300/400",
    isFree: true,
    currency: "XAF",
    status: "APPROVED" as const,
    viewCount: 3400,
    averageRating: 4.7,
    ratingCount: 234,
    author: { id: 3, username: "lecteur_royal", email: "", role: "CREATEUR" as const, roleDisplayName: "Créateur" },
    createdAt: "2026-01-22",
    isFeatured: true,
  },
];

const categories = [
  { name: 'Développement Personnel', icon: Sparkles, count: 145, color: '#F59E0B' },
  { name: 'Business & Entrepreneuriat', icon: TrendingUp, count: 89, color: '#10B981' },
  { name: 'Leadership', icon: Crown, count: 67, color: '#3B82F6' },
  { name: 'Finance & Investissement', icon: Zap, count: 54, color: '#8B5CF6' },
];

const stats = [
  { label: 'Contenus', value: '500+', icon: BookOpen },
  { label: 'Créateurs', value: '150+', icon: Users },
  { label: 'Apprenants', value: '10K+', icon: GraduationCap },
  { label: 'Note moyenne', value: '4.8', icon: Star },
];

export default function HomePage() {
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
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContents.map((content, index) => (
              <Card 
                key={content.id}
                className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-500 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Cover */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary/30" />
                  </div>
                  
                  {/* Type badge */}
                  <Badge className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm">
                    {content.type === 'BOOK' && <BookOpen className="h-3 w-3 mr-1" />}
                    {content.type === 'FORMATION' && <GraduationCap className="h-3 w-3 mr-1" />}
                    {content.type === 'ARTICLE' && <Sparkles className="h-3 w-3 mr-1" />}
                    {content.type}
                  </Badge>
                  
                  {content.isFeatured && (
                    <Badge className="absolute top-3 right-3 gradient-gold text-background">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Vedette
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-5">
                  <Link href={`/contents/${content.slug}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {content.title}
                    </h3>
                  </Link>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {content.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {content.author.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{content.author.username}</p>
                        <p className="text-xs text-muted-foreground">{content.author.roleDisplayName}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={content.isFree ? 'text-green-500 font-bold' : 'text-primary font-bold'}>
                        {content.isFree ? 'Gratuit' : `${content.price?.toLocaleString()} ${content.currency}`}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Star className="h-3 w-3 text-primary fill-primary" />
                        {content.averageRating}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
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

      {/* Categories */}
      <section className="py-20">
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
                key={category.name}
                href={`/categories/${category.name.toLowerCase().replace(/ /g, '-')}`}
                className="group"
              >
                <Card 
                  className="h-full border-border/50 bg-card/30 hover:bg-card hover:border-primary/30 transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      <category.icon className="h-8 w-8" style={{ color: category.color }} />
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count} contenus
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                <Link href="/about">
                  En savoir plus
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
