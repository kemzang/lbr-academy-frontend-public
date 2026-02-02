// ============================================
// Page des créateurs
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Star, 
  Users, 
  BookOpen,
  UserPlus,
  Check,
  Filter,
  Award
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { userRoles } from '@/config/theme';

// Mock data
const mockCreators = [
  {
    id: 1,
    username: 'coach_mbarga',
    fullName: 'Jean-Pierre Mbarga',
    bio: 'Coach en développement personnel avec 15 ans d\'expérience. Auteur de 5 best-sellers.',
    role: 'COACH' as const,
    roleDisplayName: 'Coach Certifié',
    profilePictureUrl: null,
    followersCount: 2340,
    followingCount: 45,
    contentsCount: 12,
    averageRating: 4.9,
    isFollowing: false,
  },
  {
    id: 2,
    username: 'entrepreneur_paul',
    fullName: 'Paul Ngono',
    bio: 'Entrepreneur série et investisseur. Fondateur de 3 startups à succès.',
    role: 'ENTREPRENEUR' as const,
    roleDisplayName: 'Entrepreneur',
    profilePictureUrl: null,
    followersCount: 1890,
    followingCount: 120,
    contentsCount: 8,
    averageRating: 4.8,
    isFollowing: true,
  },
  {
    id: 3,
    username: 'lecteur_royal',
    fullName: 'Jules Kamdem',
    bio: 'Passionné de philosophie et d\'histoire africaine. Vulgarisateur de connaissances.',
    role: 'CREATEUR' as const,
    roleDisplayName: 'Créateur',
    profilePictureUrl: null,
    followersCount: 956,
    followingCount: 234,
    contentsCount: 5,
    averageRating: 4.7,
    isFollowing: false,
  },
  {
    id: 4,
    username: 'marie_invest',
    fullName: 'Marie Kouam',
    bio: 'Experte en finance personnelle et investissement immobilier.',
    role: 'HYBRIDE' as const,
    roleDisplayName: 'Hybride',
    profilePictureUrl: null,
    followersCount: 1456,
    followingCount: 89,
    contentsCount: 7,
    averageRating: 4.85,
    isFollowing: false,
  },
  {
    id: 5,
    username: 'coach_success',
    fullName: 'Alain Taptue',
    bio: 'Coach de vie certifié ICF. Spécialiste en leadership et performance.',
    role: 'COACH' as const,
    roleDisplayName: 'Coach Certifié',
    profilePictureUrl: null,
    followersCount: 3200,
    followingCount: 67,
    contentsCount: 15,
    averageRating: 4.95,
    isFollowing: false,
  },
  {
    id: 6,
    username: 'tech_master',
    fullName: 'Eric Fomena',
    bio: 'Développeur et formateur en technologies. Expert Cloud et IA.',
    role: 'CREATEUR' as const,
    roleDisplayName: 'Créateur',
    profilePictureUrl: null,
    followersCount: 780,
    followingCount: 156,
    contentsCount: 4,
    averageRating: 4.6,
    isFollowing: true,
  },
];

export default function CreatorsPage() {
  const [creators, setCreators] = useState(mockCreators);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('followers');

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const filteredCreators = creators
    .filter(c => {
      const matchesSearch = c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           c.username.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || c.role === roleFilter;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'followers': return b.followersCount - a.followersCount;
        case 'rating': return b.averageRating - a.averageRating;
        case 'contents': return b.contentsCount - a.contentsCount;
        default: return 0;
      }
    });

  const toggleFollow = (creatorId: number) => {
    setCreators(prev => prev.map(c => 
      c.id === creatorId ? { ...c, isFollowing: !c.isFollowing } : c
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-96 mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64" />
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un créateur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les rôles</SelectItem>
              <SelectItem value="CREATEUR">Créateurs</SelectItem>
              <SelectItem value="ENTREPRENEUR">Entrepreneurs</SelectItem>
              <SelectItem value="HYBRIDE">Hybrides</SelectItem>
              <SelectItem value="COACH">Coachs</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Plus suivis</SelectItem>
              <SelectItem value="rating">Mieux notés</SelectItem>
              <SelectItem value="contents">Plus de contenus</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredCreators.length} créateur{filteredCreators.length > 1 ? 's' : ''}
        </p>

        {/* Creators Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator, index) => {
            const roleInfo = userRoles[creator.role];
            return (
              <Card 
                key={creator.id}
                className="group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
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
                          {creator.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    
                    <Link href={`/creators/${creator.id}`} className="mt-4">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {creator.fullName}
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
                      <p className="text-lg font-bold">{creator.followersCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Abonnés
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{creator.contentsCount}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        Contenus
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold flex items-center gap-1">
                        <Star className="h-4 w-4 text-primary fill-primary" />
                        {creator.averageRating.toFixed(1)}
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
                    onClick={() => toggleFollow(creator.id)}
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

        {/* Empty state */}
        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun créateur trouvé</h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos filtres
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
