// ============================================
// Page détail d'un contenu - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Library, 
  Headphones, 
  Play,
  Star,
  Eye,
  Heart,
  Share2,
  Clock,
  Calendar,
  User,
  Users,
  ShoppingCart,
  Lock,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Send,
  AlertCircle,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Content, Comment } from '@/types';
import { contentTypes, userRoles, formatPrice, formatRelativeDate } from '@/config/theme';
import { contentsService, commentsService, favoritesService, purchasesService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

const typeIcons = {
  BOOK: BookOpen,
  ARTICLE: FileText,
  FORMATION: GraduationCap,
  SERIES: Library,
  AUDIO: Headphones,
  VIDEO: Play,
};

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const slug = params.slug as string;

  const [content, setContent] = useState<Content | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    if (slug) {
      loadContent();
    }
  }, [slug]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await contentsService.getBySlug(slug);
      setContent(data);
      setIsFavorite(data.isFavorite || false);
      setIsPurchased(data.isPurchased || false);

      // Charger les commentaires
      const commentsData = await commentsService.getByContent(data.id, 0, 20);
      setComments(commentsData.content);
    } catch (err: unknown) {
      console.error('Erreur chargement contenu:', err);
      setError('Contenu introuvable ou une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }
    if (!content) return;

    try {
      if (isFavorite) {
        await favoritesService.remove(content.id);
      } else {
        await favoritesService.add(content.id);
      }
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch (err) {
      toast.error('Une erreur est survenue');
    }
  };

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!content) return;

    // Contenu gratuit - accès direct
    const isFreeContent = content.isFree || content.price === 0 || content.price === null;
    if (isFreeContent) {
      setIsPurchased(true);
      toast.success('Accès accordé !');
      return;
    }

    try {
      await purchasesService.purchase(content.id);
      setIsPurchased(true);
      toast.success('Achat effectué avec succès !');
      loadContent();
    } catch (err: any) {
      // Gérer l'erreur si contenu déjà acheté ou gratuit
      if (err?.response?.status === 400) {
        setIsPurchased(true);
        toast.info('Vous avez déjà accès à ce contenu');
      } else {
        toast.error('Erreur lors de l\'achat');
      }
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour commenter');
      return;
    }
    if (!content || !newComment.trim()) return;

    try {
      setIsSubmitting(true);
      const comment = await commentsService.create(content.id, { text: newComment.trim() });
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast.success('Commentaire ajouté');
    } catch (err) {
      toast.error('Erreur lors de l\'ajout du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRating = async (rating: number) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour noter');
      return;
    }
    if (!content) return;

    try {
      await contentsService.rate(content.id, { rating });
      setUserRating(rating);
      toast.success('Merci pour votre note !');
      loadContent();
    } catch (err) {
      toast.error('Erreur lors de la notation');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-64" />
            </div>
            <div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Contenu introuvable'}</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={() => router.push('/explorer')}>
              Retour à l'explorateur
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const TypeIcon = typeIcons[content.type] || BookOpen;
  const typeInfo = contentTypes[content.type] || contentTypes.ARTICLE;
  const authorRole = content.author?.role ? userRoles[content.author.role as keyof typeof userRoles] : userRoles.CREATEUR;
  
  // Un contenu est gratuit si isFree=true OU si price est 0/null/undefined
  const isFreeContent = content.isFree || content.price === 0 || content.price === null || content.price === undefined;
  // L'utilisateur a accès si le contenu est gratuit OU s'il l'a déjà acheté
  const canAccess = isFreeContent || isPurchased;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/explorer" className="hover:text-foreground transition-colors">Explorer</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate">{content.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Badge style={{ backgroundColor: typeInfo.color }} className="text-white">
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeInfo.label}
                </Badge>
                {content.categories?.map(cat => (
                  <Badge key={cat.id} variant="outline">{cat.name}</Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">{content.title}</h1>

              {content.summary && (
                <p className="text-lg text-muted-foreground mb-6">{content.summary}</p>
              )}

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {content.averageRating !== undefined && content.averageRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-primary fill-primary" />
                    {content.averageRating.toFixed(1)} ({content.ratingsCount || 0} avis)
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {(content.viewsCount || 0).toLocaleString()} vues
                </span>
                {content.readTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {content.readTime} min de lecture
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatRelativeDate(content.createdAt)}
                </span>
              </div>
            </div>

            {/* Cover */}
            {content.coverUrl && (
              <div className="relative aspect-video rounded-xl overflow-hidden">
                <img 
                  src={content.coverUrl} 
                  alt={content.title}
                  className="w-full h-full object-cover"
                />
                {!canAccess && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">Contenu premium</p>
                      <p className="text-muted-foreground">Achetez pour y accéder</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="content" className="flex-1">Contenu</TabsTrigger>
                <TabsTrigger value="comments" className="flex-1">
                  Commentaires ({comments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                {canAccess ? (
                  <div 
                    className="prose prose-lg dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.body || '' }}
                  />
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Lock className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Contenu réservé</h3>
                      <p className="text-muted-foreground text-center max-w-md mb-6">
                        Ce contenu premium nécessite un achat pour y accéder. 
                        Investissez dans votre savoir.
                      </p>
                      <Button onClick={handlePurchase} className="gradient-gold text-background">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Acheter pour {formatPrice(content.price)}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Rating section */}
                {canAccess && isAuthenticated && (
                  <Card className="mt-8">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Noter ce contenu</h3>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(star)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star 
                              className={cn(
                                'h-8 w-8',
                                star <= userRating 
                                  ? 'text-primary fill-primary' 
                                  : 'text-muted-foreground'
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="comments" className="mt-6 space-y-6">
                {/* New comment form */}
                {isAuthenticated && (
                  <Card>
                    <CardContent className="p-4">
                      <Textarea
                        placeholder="Ajouter un commentaire..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <Button 
                          onClick={handleSubmitComment} 
                          disabled={!newComment.trim() || isSubmitting}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {isSubmitting ? 'Envoi...' : 'Publier'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments list */}
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={comment.user?.profilePictureUrl || undefined} />
                              <AvatarFallback>
                                {(comment.user?.fullName || comment.user?.username || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {comment.user?.fullName || comment.user?.username}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatRelativeDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{comment.body}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun commentaire pour l'instant</p>
                    {isAuthenticated && <p className="text-sm">Soyez le premier à commenter !</p>}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <p className="text-3xl font-bold text-gradient-gold">
                    {isFreeContent ? 'Gratuit' : formatPrice(content.price)}
                  </p>
                  {isFreeContent && (
                    <p className="text-sm text-green-500 mt-1">Accès libre</p>
                  )}
                </div>

                {canAccess ? (
                  <div className="space-y-3">
                    <Button className="w-full gradient-gold text-background" asChild>
                      <Link href={`/contents/${slug}/read`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Lire maintenant
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleToggleFavorite}
                    >
                      <Heart className={cn('h-4 w-4 mr-2', isFavorite && 'fill-red-500 text-red-500')} />
                      {isFavorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      className="w-full gradient-gold text-background"
                      onClick={handlePurchase}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Acheter maintenant
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleToggleFavorite}
                    >
                      <Heart className={cn('h-4 w-4 mr-2', isFavorite && 'fill-red-500 text-red-500')} />
                      {isFavorite ? 'Dans vos favoris' : 'Ajouter aux favoris'}
                    </Button>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Author */}
                {content.author && (
                  <div>
                    <p className="text-sm font-medium mb-3">Auteur</p>
                    <Link 
                      href={`/creators/${content.author.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={content.author.profilePictureUrl || undefined} />
                        <AvatarFallback style={{ backgroundColor: authorRole.color + '20', color: authorRole.color }}>
                          {(content.author.fullName || content.author.username).charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{content.author.fullName || content.author.username}</p>
                        <Badge variant="outline" className="mt-1" style={{ borderColor: authorRole.color, color: authorRole.color }}>
                          {authorRole.label}
                        </Badge>
                      </div>
                    </Link>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Share */}
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={async () => {
                    try {
                      if (navigator?.clipboard?.writeText) {
                        await navigator.clipboard.writeText(window.location.href);
                        toast.success('Lien copié !');
                      } else {
                        // Fallback pour les navigateurs sans API clipboard
                        const textArea = document.createElement('textarea');
                        textArea.value = window.location.href;
                        textArea.style.position = 'fixed';
                        textArea.style.opacity = '0';
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        toast.success('Lien copié !');
                      }
                    } catch {
                      toast.error('Impossible de copier le lien');
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
