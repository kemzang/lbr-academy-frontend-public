// ============================================
// Page des créateurs - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Star, 
  Users, 
  BookOpen,
  UserPlus,
  Check,
  Filter,
  Award,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { usersService, followsService } from '@/lib/api';
import { UserPublicProfile } from '@/types';
import { userRoles } from '@/config/theme';
import { useAuthStore } from '@/stores/auth-store';
import { toast } from 'sonner';

export default function CreatorsPage() {
  const { isAuthenticated } = useAuthStore();
  const [creators, setCreators] = useState<UserPublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const loadCreators = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await usersService.getCreators(currentPage, 12);
      
      if (reset) {
        setCreators(response.content);
        setPage(0);
      } else {
        setCreators(prev => [...prev, ...response.content]);
      }
      setHasMore(response.hasNext);
    } catch (err: unknown) {
      console.error('Erreur chargement créateurs:', err);
      setError('Impossible de charger les créateurs.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadCreators(true);
  }, []);

  const handleFollow = async (creatorId: number, isCurrentlyFollowing: boolean) => {
    if (!isAuthenticated) {
      toast.error('Connectez-vous pour suivre ce créateur');
      return;
    }

    try {
      if (isCurrentlyFollowing) {
        await followsService.unfollow(creatorId);
      } else {
        await followsService.follow(creatorId);
      }
      
      setCreators(prev => prev.map(c => 
        c.id === creatorId 
          ? { ...c, isFollowing: !isCurrentlyFollowing, followersCount: c.followersCount + (isCurrentlyFollowing ? -1 : 1) } 
          : c
      ));
      
      toast.success(isCurrentlyFollowing ? 'Désabonné' : 'Abonné avec succès');
    } catch (err) {
      toast.error('Une erreur est survenue');
    }
  };

  const filteredCreators = creators.filter(c =>
    c.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error && creators.length === 0) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={() => loadCreators(true)}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 gradient-gold text-background">
            <Award className="h-3 w-3 mr-1" />
            Créateurs
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos <span className="text-gradient-gold">créateurs</span> de talent
          </h1>
          <p className="text-lg text-muted-foreground">
            Découvrez les esprits brillants qui partagent leurs connaissances 
            et suivez-les pour ne rien manquer.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un créateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Loading */}
        {isLoading && creators.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72" />
            ))}
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6 text-center">
              {filteredCreators.length} créateur{filteredCreators.length > 1 ? 's' : ''}
            </p>

            {/* Creators Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator, index) => {
                const roleInfo = userRoles[creator.role] || userRoles.APPRENANT;
                return (
                  <Card 
                    key={creator.id}
                    className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6">
                      {/* Avatar & Info */}
                      <div className="flex flex-col items-center text-center">
                        <Link href={`/creators/${creator.id}`}>
                          <Avatar className="h-20 w-20 border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
                            <AvatarImage src={creator.profilePictureUrl || undefined} />
                            <AvatarFallback 
                              className="text-2xl"
                              style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}
                            >
                              {(creator.fullName || creator.username).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        
                        <Link href={`/creators/${creator.id}`} className="mt-4">
                          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                            {creator.fullName || creator.username}
                          </h3>
                        </Link>
                        
                        <p className="text-sm text-muted-foreground">@{creator.username}</p>
                        
                        <Badge 
                          variant="outline" 
                          className="mt-2"
                          style={{ borderColor: roleInfo.color, color: roleInfo.color }}
                        >
                          {creator.roleDisplayName}
                        </Badge>

                        {creator.bio && (
                          <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                            {creator.bio}
                          </p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-border">
                        <div className="text-center">
                          <p className="text-lg font-bold">{creator.followersCount?.toLocaleString() || 0}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            Abonnés
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold">{creator.contentsCount || 0}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            Contenus
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold flex items-center gap-1">
                            <Star className="h-4 w-4 text-primary fill-primary" />
                            {(creator.averageRating || 0).toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">Note</p>
                        </div>
                      </div>

                      {/* Follow button */}
                      <Button
                        className={cn(
                          'w-full mt-4',
                          creator.isFollowing ? 'bg-muted hover:bg-muted/80' : 'gradient-gold text-background'
                        )}
                        onClick={() => handleFollow(creator.id, creator.isFollowing || false)}
                      >
                        {creator.isFollowing ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Abonné
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            S&apos;abonner
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <Button 
                  variant="outline" 
                  onClick={() => { setPage(p => p + 1); loadCreators(); }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Chargement...' : 'Voir plus'}
                </Button>
              </div>
            )}

            {/* Empty state */}
            {filteredCreators.length === 0 && !isLoading && (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun créateur trouvé</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Essayez de modifier votre recherche' : 'Les créateurs seront bientôt disponibles'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
