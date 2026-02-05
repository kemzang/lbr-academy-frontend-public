// ============================================
// Composant ContentCard - Carte de contenu réutilisable
// ============================================

'use client';

import { useState } from 'react';
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
  Lock,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ContentSummary } from '@/types';
import { contentTypes, formatPrice } from '@/config/theme';
import { favoritesService } from '@/lib/api';
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

interface ContentCardProps {
  content: ContentSummary;
  variant?: 'default' | 'horizontal' | 'compact';
  showAuthor?: boolean;
}

export function ContentCard({ 
  content, 
  variant = 'default',
  showAuthor = true 
}: ContentCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(content.isFavorite ?? false);
  const [isLoading, setIsLoading] = useState(false);

  const TypeIcon = typeIcons[content.type] || BookOpen;
  const typeInfo = contentTypes[content.type] || contentTypes.ARTICLE;

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Connectez-vous pour ajouter aux favoris');
      return;
    }

    try {
      setIsLoading(true);
      if (isFavorite) {
        await favoritesService.remove(content.id);
      } else {
        await favoritesService.add(content.id);
      }
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris');
    } catch (err) {
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === 'horizontal') {
    return (
      <Link href={`/contents/${content.slug}`}>
        <Card className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300">
          <CardContent className="p-0 flex gap-4">
            {/* Image */}
            <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
              {content.coverUrl ? (
                <img 
                  src={content.coverUrl} 
                  alt={content.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: typeInfo.color + '20' }}
                >
                  <TypeIcon className="h-10 w-10" style={{ color: typeInfo.color }} />
                </div>
              )}
              
              {/* Type badge */}
              <div 
                className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white"
                style={{ backgroundColor: typeInfo.color }}
              >
                {typeInfo.label}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 py-3 pr-4">
              <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {content.title}
              </h3>
              
              {content.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {content.summary}
                </p>
              )}
              
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                {content.averageRating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-primary fill-primary" />
                    {content.averageRating.toFixed(1)}
                  </span>
                )}
                {(content.viewCount || content.viewsCount) && (
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {(content.viewCount || content.viewsCount || 0).toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-primary">
                  {content.isFree ? 'Gratuit' : formatPrice(content.price)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link href={`/contents/${content.slug}`}>
        <div className="group flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors">
          <div 
            className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: typeInfo.color + '20' }}
          >
            <TypeIcon className="h-5 w-5" style={{ color: typeInfo.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
              {content.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {typeInfo.label} • {content.isFree ? 'Gratuit' : formatPrice(content.price)}
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant (carte compacte)
  return (
    <Link href={`/contents/${content.slug}`}>
      <Card className="group h-full overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {content.coverUrl ? (
            <img 
              src={content.coverUrl} 
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div 
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: typeInfo.color + '10' }}
            >
              <TypeIcon className="h-10 w-10" style={{ color: typeInfo.color }} />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Type badge */}
          <div 
            className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium text-white"
            style={{ backgroundColor: typeInfo.color }}
          >
            {typeInfo.label}
          </div>

          {/* Favorite button */}
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              'absolute top-2 right-2 h-7 w-7 rounded-full bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-all',
              isFavorite && 'opacity-100'
            )}
            onClick={handleToggleFavorite}
            disabled={isLoading}
          >
            <Heart className={cn('h-3.5 w-3.5', isFavorite && 'fill-red-500 text-red-500')} />
          </Button>
          
          {/* Price */}
          <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {!content.isFree && (
              <Badge className="bg-primary text-background font-bold">
                {formatPrice(content.price)}
              </Badge>
            )}
            {content.isFree && (
              <Badge className="bg-green-500 text-white font-bold">
                Gratuit
              </Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-3">
          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
            {content.title}
          </h3>
          
          {/* Author */}
          {showAuthor && content.author && (
            <div className="flex items-center gap-1.5 mb-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={content.author.profilePictureUrl || undefined} />
                <AvatarFallback className="text-[10px]">
                  {(content.author.fullName ?? content.author.username).charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                {content.author.fullName ?? content.author.username}
              </span>
            </div>
          )}
          
          {/* Stats */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-3">
              {content.averageRating !== undefined && content.averageRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-primary fill-primary" />
                  {content.averageRating.toFixed(1)}
                </span>
              )}
              {(content.viewCount ?? content.viewsCount ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {(content.viewCount ?? content.viewsCount ?? 0).toLocaleString()}
                </span>
              )}
            </div>
            
            {content.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {content.readTime} min
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
