// ============================================
// Page de détail d'un contenu
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  BookOpen, 
  Star, 
  Eye, 
  Clock, 
  Globe, 
  Heart,
  Share2,
  ShoppingCart,
  Play,
  ChevronLeft,
  MessageCircle,
  ThumbsUp,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { contentTypes } from '@/config/theme';
import { cn } from '@/lib/utils';

// Mock data
const mockContent = {
  id: 1,
  title: "L'Art de la Discipline Personnelle",
  slug: "art-discipline-personnelle",
  description: `
    <p>Dans un monde où les distractions sont omniprésentes, la discipline personnelle est devenue la compétence la plus précieuse que vous puissiez développer.</p>
    
    <p>Ce livre vous guidera à travers les principes fondamentaux utilisés par les grands leaders, entrepreneurs et athlètes pour atteindre l'excellence.</p>
    
    <h3>Ce que vous apprendrez :</h3>
    <ul>
      <li>Les 7 piliers de la discipline personnelle</li>
      <li>Comment créer des habitudes durables</li>
      <li>Techniques pour vaincre la procrastination</li>
      <li>Stratégies de gestion du temps des performeurs</li>
      <li>Comment maintenir la motivation sur le long terme</li>
    </ul>
    
    <p>Que vous soyez entrepreneur, étudiant ou professionnel, ce guide pratique transformera votre approche du travail et de la vie.</p>
  `,
  summary: "Découvrez les secrets des grands leaders pour développer une discipline de fer et atteindre vos objectifs.",
  type: "BOOK" as const,
  coverUrl: null,
  isFree: false,
  price: 5000,
  currency: "XAF",
  status: "APPROVED" as const,
  viewCount: 1250,
  averageRating: 4.8,
  ratingCount: 89,
  author: { 
    id: 1, 
    username: "coach_mbarga", 
    fullName: "Jean-Pierre Mbarga",
    email: "", 
    role: "COACH" as const, 
    roleDisplayName: "Coach Certifié",
    bio: "Coach en développement personnel avec 15 ans d'expérience. Auteur de 5 best-sellers.",
    followersCount: 2340,
    contentsCount: 12,
  },
  category: { id: 1, name: "Développement Personnel", slug: "developpement-personnel" },
  createdAt: "2026-01-15",
  publishedAt: "2026-01-16",
  language: "fr",
  pageCount: 245,
  tags: "discipline,productivité,habitudes,succès",
  freePreview: "Le premier chapitre est disponible gratuitement pour vous donner un aperçu de ce qui vous attend...",
  isFeatured: true,
};

const mockComments = [
  {
    id: 1,
    text: "Excellent livre ! J'ai complètement changé mes habitudes depuis que je l'ai lu. Merci Coach Mbarga !",
    user: { id: 4, username: "marie_k", profilePictureUrl: null },
    likesCount: 24,
    isLiked: false,
    createdAt: "2026-01-20",
    replies: [
      {
        id: 2,
        text: "Pareil pour moi ! Ça a vraiment fait la différence.",
        user: { id: 5, username: "paul_e", profilePictureUrl: null },
        likesCount: 8,
        isLiked: false,
        createdAt: "2026-01-21",
      }
    ]
  },
  {
    id: 3,
    text: "Contenu très dense et pratique. Je recommande à tous ceux qui veulent progresser.",
    user: { id: 6, username: "entrepreneur_jules", profilePictureUrl: null },
    likesCount: 15,
    isLiked: true,
    createdAt: "2026-01-22",
    replies: []
  },
];

const ratingDistribution = [
  { stars: 5, count: 65 },
  { stars: 4, count: 18 },
  { stars: 3, count: 4 },
  { stars: 2, count: 1 },
  { stars: 1, count: 1 },
];

export default function ContentDetailPage() {
  const params = useParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  
  const content = mockContent;
  const typeInfo = contentTypes[content.type];
  
  const formatPrice = (price?: number, currency = 'XAF') => {
    if (!price) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalRatings = ratingDistribution.reduce((acc, r) => acc + r.count, 0);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background py-8 lg:py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link 
            href="/explorer" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Retour à l&apos;exploration
          </Link>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cover */}
            <div className="lg:col-span-1">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-2xl shadow-primary/10">
                <BookOpen className="h-24 w-24 text-primary/30" />
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge 
                  variant="outline"
                  style={{ borderColor: typeInfo.color, color: typeInfo.color }}
                  className="text-sm"
                >
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  {typeInfo.label}
                </Badge>
                {content.isFeatured && (
                  <Badge className="gradient-gold text-background">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    En vedette
                  </Badge>
                )}
                <Badge variant="secondary">
                  <Globe className="h-3 w-3 mr-1" />
                  {content.language === 'fr' ? 'Français' : content.language}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                {content.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {content.summary}
              </p>

              {/* Author */}
              <Link href={`/creators/${content.author.id}`} className="flex items-center gap-4 mb-6">
                <Avatar className="h-14 w-14 border-2 border-primary/30">
                  <AvatarFallback className="text-lg bg-primary/20 text-primary">
                    {content.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{content.author.fullName || content.author.username}</p>
                  <p className="text-sm text-muted-foreground">{content.author.roleDisplayName}</p>
                </div>
              </Link>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={cn(
                          'h-5 w-5',
                          star <= Math.round(content.averageRating)
                            ? 'text-primary fill-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                  <span className="font-semibold">{content.averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({content.ratingCount} avis)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Eye className="h-5 w-5" />
                  {content.viewCount} vues
                </div>
                {content.pageCount && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                    {content.pageCount} pages
                  </div>
                )}
              </div>

              {/* Price & Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="text-3xl font-bold">
                  {content.isFree ? (
                    <span className="text-green-500">Gratuit</span>
                  ) : (
                    <span className="text-gradient-gold">{formatPrice(content.price, content.currency)}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button size="lg" className="gradient-gold text-background font-semibold h-12 px-8">
                    {content.isFree ? (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Lire maintenant
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        Acheter
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={cn('h-5 w-5', isFavorite && 'fill-destructive text-destructive')} />
                  </Button>
                  
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container mx-auto px-4 mt-8">
        <Tabs defaultValue="description" className="space-y-8">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="preview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Aperçu gratuit
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Avis ({content.ratingCount})
            </TabsTrigger>
          </TabsList>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TabsContent value="description" className="mt-0">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: content.description }}
                />
                
                {/* Tags */}
                {content.tags && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-semibold mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.split(',').map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="preview" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Aperçu gratuit</h3>
                    <p className="text-muted-foreground">
                      {content.freePreview}
                    </p>
                    
                    <Separator className="my-6" />
                    
                    <p className="text-center text-muted-foreground">
                      Pour lire la suite, {content.isFree ? 'connectez-vous' : 'achetez ce contenu'}.
                    </p>
                    
                    <div className="flex justify-center mt-4">
                      <Button className="gradient-gold text-background">
                        {content.isFree ? 'Se connecter' : 'Acheter pour continuer'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0 space-y-8">
                {/* Rating summary */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-8">
                      <div className="text-center">
                        <div className="text-5xl font-bold text-gradient-gold mb-2">
                          {content.averageRating.toFixed(1)}
                        </div>
                        <div className="flex justify-center mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={cn(
                                'h-5 w-5',
                                star <= Math.round(content.averageRating)
                                  ? 'text-primary fill-primary'
                                  : 'text-muted-foreground'
                              )}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {content.ratingCount} avis
                        </p>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        {ratingDistribution.map(({ stars, count }) => (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="w-12 text-sm">{stars} étoiles</span>
                            <Progress value={(count / totalRatings) * 100} className="h-2 flex-1" />
                            <span className="w-8 text-sm text-muted-foreground">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Add review */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Donner votre avis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Votre note :</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setUserRating(star)}
                          >
                            <Star 
                              className={cn(
                                'h-6 w-6 transition-colors',
                                star <= (hoverRating || userRating)
                                  ? 'text-primary fill-primary'
                                  : 'text-muted-foreground'
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Textarea
                      placeholder="Partagez votre expérience avec ce contenu..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                    />
                    
                    <Button className="gradient-gold text-background">
                      <Send className="h-4 w-4 mr-2" />
                      Publier l&apos;avis
                    </Button>
                  </CardContent>
                </Card>

                {/* Comments */}
                <div className="space-y-6">
                  {mockComments.map((comment) => (
                    <Card key={comment.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarFallback>
                              {comment.user.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{comment.user.username}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                              </div>
                            </div>
                            
                            <p className="text-muted-foreground mb-4">
                              {comment.text}
                            </p>
                            
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="gap-2">
                                <ThumbsUp className={cn('h-4 w-4', comment.isLiked && 'fill-primary text-primary')} />
                                {comment.likesCount}
                              </Button>
                              <Button variant="ghost" size="sm" className="gap-2">
                                <MessageCircle className="h-4 w-4" />
                                Répondre
                              </Button>
                            </div>
                            
                            {/* Replies */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="mt-4 pl-4 border-l-2 border-border space-y-4">
                                {comment.replies.map((reply) => (
                                  <div key={reply.id} className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarFallback className="text-xs">
                                        {reply.user.username.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{reply.user.username}</p>
                                      <p className="text-sm text-muted-foreground">{reply.text}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Author card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">À propos de l&apos;auteur</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/creators/${content.author.id}`} className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-primary/30">
                      <AvatarFallback className="text-xl bg-primary/20 text-primary">
                        {content.author.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{content.author.fullName || content.author.username}</p>
                      <Badge variant="outline" className="mt-1">{content.author.roleDisplayName}</Badge>
                    </div>
                  </Link>
                  
                  {content.author.bio && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {content.author.bio}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground">Abonnés</span>
                    <span className="font-semibold">{content.author.followersCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="text-muted-foreground">Contenus</span>
                    <span className="font-semibold">{content.author.contentsCount}</span>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    Voir le profil
                  </Button>
                </CardContent>
              </Card>

              {/* Category */}
              {content.category && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Catégorie</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/categories/${content.category.slug}`}>
                      <Badge variant="secondary" className="text-base py-2 px-4">
                        {content.category.name}
                      </Badge>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
