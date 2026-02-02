// ============================================
// Page mes contenus (créateur) - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  BookOpen,
  FileText,
  GraduationCap,
  AlertCircle,
  Filter,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { contentsService } from '@/lib/api';
import { Content } from '@/types';
import { formatPrice, formatRelativeDate, contentTypes, contentStatuses } from '@/config/theme';
import { toast } from 'sonner';

const statusIcons = {
  DRAFT: Clock,
  PENDING_REVIEW: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  ARCHIVED: Archive,
};

export default function MyContentsPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);

  const loadContents = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await contentsService.getMyContents(currentPage, 12);
      
      if (reset) {
        setContents(response.content);
        setPage(0);
      } else {
        setContents(prev => [...prev, ...response.content]);
      }
      setTotal(response.totalElements);
      setHasMore(response.hasNext);
    } catch (err) {
      console.error('Erreur chargement contenus:', err);
      setError('Impossible de charger vos contenus.');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadContents(true);
  }, []);

  const handleDelete = async () => {
    if (!contentToDelete) return;

    try {
      await contentsService.delete(contentToDelete.id);
      setContents(prev => prev.filter(c => c.id !== contentToDelete.id));
      setTotal(prev => prev - 1);
      toast.success('Contenu supprimé');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  const filteredContents = contents.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (error && contents.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mes Contenus</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadContents(true)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes Contenus</h1>
          <p className="text-muted-foreground">
            {total} contenu{total > 1 ? 's' : ''} créé{total > 1 ? 's' : ''}
          </p>
        </div>
        <Button className="gradient-gold text-background" asChild>
          <Link href="/my-contents/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contenu
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans vos contenus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(contentStatuses).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading && contents.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : filteredContents.length > 0 ? (
        <>
          <div className="space-y-4">
            {filteredContents.map((content, index) => {
              const typeInfo = contentTypes[content.type] || contentTypes.ARTICLE;
              const statusInfo = contentStatuses[content.status] || contentStatuses.DRAFT;
              const StatusIcon = statusIcons[content.status] || Clock;
              
              return (
                <Card 
                  key={content.id}
                  className="hover:border-primary/30 transition-colors animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Cover */}
                      <div 
                        className="w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: typeInfo.color + '20' }}
                      >
                        {content.coverUrl ? (
                          <img 
                            src={content.coverUrl} 
                            alt={content.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="h-8 w-8" style={{ color: typeInfo.color }} />
                          </div>
                        )}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge 
                                className="text-white text-xs"
                                style={{ backgroundColor: typeInfo.color }}
                              >
                                {typeInfo.label}
                              </Badge>
                              <Badge 
                                variant="outline"
                                style={{ borderColor: statusInfo.color, color: statusInfo.color }}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg line-clamp-1">{content.title}</h3>
                            {content.summary && (
                              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                {content.summary}
                              </p>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/contents/${content.slug}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/my-contents/${content.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Modifier
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={() => {
                                  setContentToDelete(content);
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {(content.viewsCount || 0).toLocaleString()}
                          </span>
                          {content.averageRating !== undefined && content.averageRating > 0 && (
                            <span className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-primary fill-primary" />
                              {content.averageRating.toFixed(1)}
                            </span>
                          )}
                          <span>{formatPrice(content.price)}</span>
                          <span>{formatRelativeDate(content.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => { setPage(p => p + 1); loadContents(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Voir plus'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun contenu</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'Aucun contenu ne correspond à vos filtres'
              : 'Vous n\'avez pas encore créé de contenu'
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button className="gradient-gold text-background" asChild>
              <Link href="/my-contents/new">
                <Plus className="h-4 w-4 mr-2" />
                Créer mon premier contenu
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce contenu ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contenu "{contentToDelete?.title}" sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
