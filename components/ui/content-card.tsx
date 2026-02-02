// ============================================
// Carte de contenu réutilisable
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ShoppingCart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ContentSummary } from '@/types';
import { contentTypes } from '@/config/theme';

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
  variant?: 'default' | 'horizontal' | 'featured';
  className?: string;
}

export function ContentCard({ content, variant = 'default', className }: ContentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const TypeIcon = typeIcons[content.type];
  const typeInfo = contentTypes[content.type];
  
  const formatPrice = (price?: number, currency = 'XAF') => {
    if (!price) return 'Gratuit';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (variant === 'horizontal') {
    return (
      <Card 
        className={cn(
          'group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300',
          className
        )}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-32 sm:w-48 flex-shrink-0">
            <div className="aspect-[3/4] relative">
              {content.coverUrl ? (
                <Image
                  src={content.coverUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <TypeIcon className="h-12 w-12 text-primary/50" />
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <CardContent className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  variant="outline" 
                  className="text-xs"
                  style={{ borderColor: typeInfo.color, color: typeInfo.color }}
                >
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {typeInfo.label}
                </Badge>
                {content.isFeatured && (
                  <Badge className="bg-primary/20 text-primary text-xs">
                    En vedette
                  </Badge>
                )}
              </div>
              
              <Link href={`/contents/${content.slug}`}>
                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                  {content.title}
                </h3>
              </Link>
              
              {content.summary && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {content.summary}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-3">
              <Link href={`/creators/${content.author.id}`} className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={content.author.profilePictureUrl} />
                  <AvatarFallback className="text-xs">
                    {content.author.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{content.author.username}</span>
              </Link>
              
              <span className={cn(
                'font-bold',
                content.isFree ? 'text-green-500' : 'text-primary'
              )}>
                {content.isFree ? 'Gratuit' : formatPrice(content.price, content.currency)}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card 
        className={cn(
          'group relative overflow-hidden border-primary/30 bg-card/80',
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background image */}
        <div className="absolute inset-0">
          {content.coverUrl ? (
            <Image
              src={content.coverUrl}
              alt={content.title}
              fill
              className="object-cover opacity-20"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <CardContent className="relative p-6 h-full flex flex-col">
          {/* Badge featured */}
          <div className="flex items-center justify-between mb-4">
            <Badge className="gradient-gold text-background">
              <Star className="h-3 w-3 mr-1 fill-current" />
              En vedette
            </Badge>
            <Badge 
              variant="outline"
              style={{ borderColor: typeInfo.color, color: typeInfo.color }}
            >
              <TypeIcon className="h-3 w-3 mr-1" />
              {typeInfo.label}
            </Badge>
          </div>

          <div className="flex-1">
            <Link href={`/contents/${content.slug}`}>
              <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                {content.title}
              </h3>
            </Link>
            
            {content.summary && (
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {content.summary}
              </p>
            )}
          </div>

          {/* Author & Stats */}
          <div className="flex items-center justify-between">
            <Link href={`/creators/${content.author.id}`} className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/30">
                <AvatarImage src={content.author.profilePictureUrl} />
                <AvatarFallback className="bg-primary/20">
                  {content.author.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{content.author.username}</p>
                <p className="text-xs text-muted-foreground">{content.author.roleDisplayName}</p>
              </div>
            </Link>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 text-primary fill-primary" />
                {content.averageRating.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {content.viewCount}
              </span>
            </div>
          </div>

          {/* Price & Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <span className={cn(
              'text-xl font-bold',
              content.isFree ? 'text-green-500' : 'text-primary'
            )}>
              {content.isFree ? 'Gratuit' : formatPrice(content.price, content.currency)}
            </span>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(isFavorite && 'text-destructive')}
              >
                <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
              </Button>
              <Button asChild className="gradient-gold text-background">
                <Link href={`/contents/${content.slug}`}>
                  {content.isFree ? 'Lire' : 'Acheter'}
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default card
  return (
    <Card 
      className={cn(
        'group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {content.coverUrl ? (
          <Image
            src={content.coverUrl}
            alt={content.title}
            fill
            className={cn(
              'object-cover transition-transform duration-500',
              isHovered && 'scale-110'
            )}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <TypeIcon className="h-16 w-16 text-primary/50" />
          </div>
        )}
        
        {/* Overlay */}
        <div className={cn(
          'absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-0 transition-opacity duration-300',
          isHovered && 'opacity-100'
        )} />

        {/* Type badge */}
        <Badge 
          className="absolute top-3 left-3 text-xs"
          style={{ backgroundColor: typeInfo.color + '20', color: typeInfo.color, borderColor: typeInfo.color }}
          variant="outline"
        >
          <TypeIcon className="h-3 w-3 mr-1" />
          {typeInfo.label}
        </Badge>

        {/* Featured badge */}
        {content.isFeatured && (
          <Badge className="absolute top-3 right-3 gradient-gold text-background text-xs">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Vedette
          </Badge>
        )}

        {/* Quick actions */}
        <div className={cn(
          'absolute bottom-3 left-3 right-3 flex items-center gap-2 transition-all duration-300',
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1 bg-background/90 backdrop-blur-sm"
            asChild
          >
            <Link href={`/contents/${content.slug}`}>
              {content.isFree ? 'Lire' : <><ShoppingCart className="h-4 w-4 mr-1" /> Acheter</>}
            </Link>
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/90 backdrop-blur-sm"
            onClick={() => setIsFavorite(!isFavorite)}
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-destructive text-destructive')} />
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <Link href={`/contents/${content.slug}`}>
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors mb-2">
            {content.title}
          </h3>
        </Link>

        {/* Author */}
        <Link href={`/creators/${content.author.id}`} className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={content.author.profilePictureUrl} />
            <AvatarFallback className="text-xs bg-muted">
              {content.author.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground truncate">{content.author.username}</span>
        </Link>

        {/* Stats & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              {content.averageRating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {content.viewCount}
            </span>
          </div>
          
          <span className={cn(
            'font-bold',
            content.isFree ? 'text-green-500' : 'text-primary'
          )}>
            {content.isFree ? 'Gratuit' : formatPrice(content.price, content.currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default ContentCard;
