// ============================================
// Admin - Gestion des contenus - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Search,
  MoreVertical,
  Check,
  X,
  Star,
  Eye,
  ShoppingCart,
  Trash2,
  AlertCircle,
  BookOpen,
  FileText,
  Video,
  Headphones,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { adminService } from '@/lib/api/admin';
import { Content } from '@/types';
import { contentTypes, contentStatuses, formatPrice } from '@/config/theme';
import { toast } from 'sonner';

const contentTypesList = ['BOOK', 'EBOOK', 'AUDIOBOOK', 'FORMATION', 'ARTICLE', 'PODCAST', 'VIDEO', 'SERIES'];
const statusList = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED'];

export default function AdminContentsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || '';
  
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatus);
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  // Dialogs
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const loadContents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await adminService.getContents(currentPage, pageSize, {
        status: statusFilter || undefined,
        type: typeFilter || undefined,
        search: searchQuery || undefined,
      });
      
      setContents(data.content);
      setTotalElements(data.totalElements);
    } catch (err) {
      const msg = err instanceof Error ? err.message : (err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : 'Erreur inconnue');
      console.error('Erreur chargement contenus:', msg);
      setError('Impossible de charger les contenus.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 0) {
        loadContents();
      } else {
        setCurrentPage(0);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleApprove = async (content: Content) => {
    try {
      await adminService.approveContent(content.id);
      toast.success(`"${content.title}" a été approuvé`);
      loadContents();
    } catch (err) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    if (!selectedContent || !rejectReason.trim()) {
      toast.error('Veuillez indiquer une raison');
      return;
    }

    try {
      await adminService.rejectContent(selectedContent.id, rejectReason);
      toast.success(`"${selectedContent.title}" a été rejeté`);
      setRejectDialogOpen(false);
      setSelectedContent(null);
      setRejectReason('');
      loadContents();
    } catch (err) {
      toast.error('Erreur lors du rejet');
    }
  };

  const handleToggleFeature = async (content: Content) => {
    try {
      await adminService.toggleFeatureContent(content.id);
      toast.success(content.isFeatured 
        ? `"${content.title}" n'est plus mis en avant`
        : `"${content.title}" est maintenant mis en avant`
      );
      loadContents();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const handleDelete = async () => {
    if (!selectedContent) return;

    try {
      await adminService.deleteContent(selectedContent.id);
      toast.success(`"${selectedContent.title}" a été supprimé`);
      setDeleteDialogOpen(false);
      setSelectedContent(null);
      loadContents();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = contentStatuses[status as keyof typeof contentStatuses];
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      DRAFT: 'secondary',
      PENDING_REVIEW: 'outline',
      APPROVED: 'default',
      REJECTED: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'outline'} style={{ borderColor: statusInfo?.color }}>
        {statusInfo?.label || status}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      BOOK: BookOpen,
      EBOOK: BookOpen,
      ARTICLE: FileText,
      VIDEO: Video,
      AUDIOBOOK: Headphones,
      PODCAST: Headphones,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const totalPages = Math.ceil(totalElements / pageSize);

  if (error && contents.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestion des contenus</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadContents}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des contenus</h1>
          <p className="text-muted-foreground">
            {totalElements} contenu{totalElements > 1 ? 's' : ''} au total
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un contenu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' ? '' : v); setCurrentPage(0); }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tous les statuts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {statusList.map(status => (
              <SelectItem key={status} value={status}>
                {contentStatuses[status as keyof typeof contentStatuses]?.label || status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v === 'all' ? '' : v); setCurrentPage(0); }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            {contentTypesList.map(type => (
              <SelectItem key={type} value={type}>
                {contentTypes[type as keyof typeof contentTypes]?.label || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contenu</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((content) => (
                <TableRow key={content.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {content.coverUrl ? (
                          <img 
                            src={content.coverUrl} 
                            alt="" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            {getTypeIcon(content.type)}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link 
                          href={`/contents/${content.slug}`}
                          className="font-medium hover:text-primary line-clamp-1"
                        >
                          {content.title}
                        </Link>
                        {content.isFeatured && (
                          <Badge variant="secondary" className="mt-1">
                            <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
                            En vedette
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{content.author?.fullName || content.author?.username}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {contentTypes[content.type as keyof typeof contentTypes]?.label || content.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(content.status)}
                  </TableCell>
                  <TableCell>
                    {content.isFree ? (
                      <span className="text-green-600 font-medium">Gratuit</span>
                    ) : (
                      formatPrice(content.price)
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.viewCount || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3" />
                        {(content as unknown as Record<string, unknown>).purchaseCount as number || 0}
                      </span>
                      {content.averageRating > 0 && (
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {content.averageRating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {content.status === 'PENDING_REVIEW' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(content)}>
                              <Check className="h-4 w-4 mr-2 text-green-600" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedContent(content);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4 mr-2 text-red-600" />
                              Rejeter
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handleToggleFeature(content)}>
                          <Star className="h-4 w-4 mr-2" />
                          {content.isFeatured ? 'Retirer de la une' : 'Mettre en avant'}
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/contents/${content.slug}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le contenu
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedContent(content);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {contents.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun contenu trouvé</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage + 1} sur {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le contenu</DialogTitle>
            <DialogDescription>
              Expliquez la raison du rejet à l'auteur
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Raison du rejet</Label>
            <Textarea
              id="reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Qualité insuffisante, contenu incomplet..."
              rows={4}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!rejectReason.trim()}>
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le contenu ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Le contenu "{selectedContent?.title}" sera supprimé définitivement.
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
