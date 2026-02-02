// ============================================
// Carte créateur réutilisable
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Users, 
  BookOpen,
  UserPlus,
  Check
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { UserPublicProfile } from '@/types';
import { userRoles } from '@/config/theme';

interface CreatorCardProps {
  creator: UserPublicProfile;
  className?: string;
}

export function CreatorCard({ creator, className }: CreatorCardProps) {
  const [isFollowing, setIsFollowing] = useState(creator.isFollowing || false);
  const roleInfo = userRoles[creator.role];

  return (
    <Card className={cn(
      'group overflow-hidden border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300',
      className
    )}>
      <CardContent className="p-6">
        {/* Avatar & Info */}
        <div className="flex flex-col items-center text-center">
          <Link href={`/creators/${creator.id}`}>
            <Avatar className="h-20 w-20 border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
              <AvatarImage src={creator.profilePictureUrl} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {creator.username.charAt(0).toUpperCase()}
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
            <p className="text-lg font-bold">{creator.followersCount}</p>
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
            isFollowing ? 'bg-muted hover:bg-muted/80' : 'gradient-gold text-background'
          )}
          onClick={() => setIsFollowing(!isFollowing)}
        >
          {isFollowing ? (
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
}

export default CreatorCard;
