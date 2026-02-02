// ============================================
// Admin - Gestion des contenus - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  MoreVertical,
  Eye,
  Check,
  X,
  AlertCircle,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { adminService } from '@/lib/api';
import { Content } from '@/types';
import { contentTypes, contentStatuses, formatPrice, formatRelativeDate } from '@/config/theme';
import { toast } from 'sonner';

const statusIcons = {
  DRAFT: Clock,
  PENDING_REVIEW: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  ARCHIVED: Archive,
};

export default function AdminContentsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';
  
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadContents = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await adminService.getContents(
        currentPage, 
        20, 
        statusFilter !== 'all' ? statusFilter : undefined,
        typeFilter !== 'all' ? typeFilter : undefined
      );
      
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
      setError('Impossible de charger les contenus.');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter, typeFilter]);

  useEffect(() => {
    loadContents(true);
  }, [statusFilter, typeFilter]);

  const handleApprove = async (contentId: number) => {
    try {
      await adminService.approveContent(contentId);
      setContents(prev => prev.map(c => 
        c.id === contentId ? { ...c, status: 'APPROVED' } : c
      ));
      toast.success('Contenu approuvé');
    } catch (err) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (contentId: number) => {
    try {
      await adminService.rejectContent(contentId);
      setContents(prev => prev.map(c => 
        c.id === contentId ? { ...c, status: 'REJECTED' } : c
      ));
      toast.success('Contenu rejeté');
    } catch (err) {
      toast.error('Erreur lors du rejet');
    }
  };

  const filteredContents = contents.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error && contents.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestion des contenus</h1>
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
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des contenus</h1>
        <p className="text-muted-foreground">
          {total} contenu{total > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(contentStatuses).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {Object.entries(contentTypes).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading && contents.length === 0 ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contenu</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.map((content) => {
                  const typeInfo = contentTypes[content.type] || contentTypes.ARTICLE;
                  const statusInfo = contentStatuses[content.status] || contentStatuses.DRAFT;
                  const StatusIcon = statusIcons[content.status] || Clock;
                  
                  return (
                    <TableRow key={content.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-12 h-12 rounded flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: typeInfo.color + '20' }}
                          >
                            {content.coverUrl ? (
                              <img 
                                src={content.coverUrl} 
                                alt=""
                                className="w-full h-full object-cover rounded"
                              />
                            ) : (
                              <BookOpen className="h-5 w-5" style={{ color: typeInfo.color }} />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium line-clamp-1">{content.title}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {content.summary}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {content.author && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={content.author.profilePictureUrl || undefined} />
                              <AvatarFallback className="text-xs">
                                {(content.author.fullName || content.author.username).charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {content.author.fullName || content.author.username}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: typeInfo.color, color: 'white' }}>
                          {typeInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          style={{ borderColor: statusInfo.color, color: statusInfo.color }}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {content.isFree ? (
                          <span className="text-green-500">Gratuit</span>
                        ) : (
                          formatPrice(content.price)
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatRelativeDate(content.createdAt)}
                      </TableCell>
                      <TableCell>
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
                            {content.status === 'PENDING_REVIEW' && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-green-600"
                                  onClick={() => handleApprove(content.id)}
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approuver
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => handleReject(content.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Rejeter
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={() => { setPage(p => p + 1); loadContents(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}

          {filteredContents.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun contenu trouvé</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
