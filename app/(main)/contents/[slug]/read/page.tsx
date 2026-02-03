// ============================================
// Page de lecture d'un contenu - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BookOpen,
  ArrowLeft,
  Download,
  Share2,
  Heart,
  Star,
  Eye,
  Clock,
  User,
  Lock,
  AlertCircle,
  FileText,
  Play,
  Headphones,
  GraduationCap,
  Library
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { Content } from '@/types';
import { contentTypes, userRoles, formatPrice, formatRelativeDate } from '@/config/theme';
import { contentsService, favoritesService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

const typeIcons = {
  BOOK: BookOpen,
  EBOOK: BookOpen,
  ARTICLE: FileText,
  FORMATION: GraduationCap,
  SERIES: Library,
  AUDIO: Headphones,
  AUDIOBOOK: Headphones,
  PODCAST: Headphones,
  VIDEO: Play,
};

export default function ContentReadPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const slug = params.slug as string;

  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

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

      // Vérifier l'accès
      const isFreeContent = data.isFree || data.price === 0 || data.price === null;
      const canAccess = isFreeContent || data.isPurchased;

      if (!canAccess) {
        setError('Vous devez acheter ce contenu pour y accéder.');
        router.push(`/contents/${slug}`);
        return;
      }
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

  const handleShare = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Lien copié !');
      } else {
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
  };

  const handleDownload = async () => {
    if (!content) {
      toast.error('Contenu non disponible');
      return;
    }
    
    try {
      const blob = await contentsService.download(content.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${content.slug || content.title}.${content.fileUrl?.split('.').pop() || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Téléchargement démarré');
    } catch (err) {
      console.error('Erreur téléchargement:', err);
      toast.error('Erreur lors du téléchargement');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
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

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push(`/contents/${slug}`)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au contenu
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeInfo.label}
                </Badge>
                {content.isFeatured && (
                  <Badge variant="secondary">
                    <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                    En vedette
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{content.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={content.author?.profilePictureUrl} />
                    <AvatarFallback className="text-xs">
                      {content.author?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-foreground">
                    {content.author?.fullName || content.author?.username}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {authorRole.label}
                  </Badge>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {content.viewCount?.toLocaleString() || 0} vues
                </div>
                {content.averageRating > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      {content.averageRating.toFixed(1)}
                    </div>
                  </>
                )}
                {content.readTime && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {content.readTime} min
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {content.fileUrl && (
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              )}
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              {isAuthenticated && (
                <Button variant="outline" onClick={handleToggleFavorite}>
                  <Heart className={cn('h-4 w-4 mr-2', isFavorite && 'fill-red-500 text-red-500')} />
                  {isFavorite ? 'Favori' : 'Favoris'}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Cover Image */}
            {content.coverUrl && (
              <div className="mb-8">
                <img 
                  src={content.coverUrl} 
                  alt={content.title}
                  className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Description */}
            {content.description && (
              <div className="mb-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {content.description}
                </p>
              </div>
            )}

            {/* Audio/Video Player */}
            {content.type === 'VIDEO' && content.fileUrl && (
              <div className="mb-8">
                <video 
                  controls 
                  src={content.fileUrl} 
                  className="w-full rounded-lg shadow-lg"
                  poster={content.coverUrl}
                >
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
            )}

            {content.type === 'AUDIO' && content.fileUrl && (
              <div className="mb-8">
                <div className="bg-muted/50 rounded-lg p-6">
                  {content.coverUrl && (
                    <div className="mb-4 text-center">
                      <img 
                        src={content.coverUrl} 
                        alt={content.title}
                        className="w-48 h-48 mx-auto rounded-lg object-cover"
                      />
                    </div>
                  )}
                  <audio 
                    controls 
                    src={content.fileUrl} 
                    className="w-full"
                  >
                    Votre navigateur ne supporte pas la lecture audio.
                  </audio>
                </div>
              </div>
            )}

            {/* Body Content */}
            {content.body ? (
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: content.body }}
              />
            ) : content.type !== 'VIDEO' && content.type !== 'AUDIO' ? (
              <div className="text-center py-16">
                <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Contenu en cours de chargement...</p>
              </div>
            ) : null}

            {/* File Download Section */}
            {content.fileUrl && (
              <div className="mt-8 pt-8 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1">Fichier disponible</h3>
                    <p className="text-sm text-muted-foreground">
                      Téléchargez ce contenu pour le consulter hors ligne
                    </p>
                  </div>
                  <Button onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="mt-8 pt-8 border-t">
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Informations</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Type: {typeInfo.label}</p>
                    {content.category && (
                      <p>Catégorie: {content.category.name}</p>
                    )}
                    <p>Publié le: {new Date(content.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Statistiques</h4>
                  <div className="space-y-1 text-muted-foreground">
                    <p>Vues: {content.viewCount?.toLocaleString() || 0}</p>
                    {content.averageRating > 0 && (
                      <p>Note moyenne: {content.averageRating.toFixed(1)} / 5 ({content.ratingCount || 0} avis)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Card */}
        {content.author && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={content.author.profilePictureUrl} />
                  <AvatarFallback>
                    {content.author.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">
                      {content.author.fullName || content.author.username}
                    </h3>
                    <Badge variant="outline">
                      {authorRole.label}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" asChild className="mt-3">
                    <Link href={`/creators/${content.author.id}`}>
                      Voir le profil
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
