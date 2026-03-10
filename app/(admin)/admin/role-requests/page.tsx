// ============================================
// Admin - Demandes de changement de rôle - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  UserCheck,
  Check,
  X,
  Eye,
  Clock,
  AlertCircle,
  FileText,
  MoreVertical,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { roleUpgradesService } from '@/lib/api';
import { RoleUpgradeRequest, PaginatedResponse } from '@/types';
import { userRoles, formatRelativeDate } from '@/config/theme';
import { toast } from 'sonner';

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'En attente', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  UNDER_REVIEW: { label: 'En cours', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  APPROVED: { label: 'Approuvé', color: 'text-green-600 bg-green-50 border-green-200' },
  REJECTED: { label: 'Rejeté', color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleUpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(20);
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  
  // Dialogs
  const [selectedRequest, setSelectedRequest] = useState<RoleUpgradeRequest | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let data: { content: RoleUpgradeRequest[]; totalElements: number };
      if (statusFilter === 'PENDING') {
        data = await roleUpgradesService.getPending(currentPage, pageSize);
      } else {
        const status = statusFilter === 'all' ? undefined : (statusFilter as 'PENDING' | 'APPROVED' | 'REJECTED');
        data = await roleUpgradesService.getAll(currentPage, pageSize, status);
      }

      setRequests(data.content);
      setTotalElements(data.totalElements);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Erreur chargement demandes:', message);
      setError('Impossible de charger les demandes.');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, statusFilter]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleApprove = async () => {
    if (!selectedRequest) return;

    try {
      await roleUpgradesService.approve(selectedRequest.id);
      toast.success(`Demande de ${selectedRequest.user?.username} approuvée`);
      setApproveDialogOpen(false);
      setSelectedRequest(null);
      loadRequests();
    } catch (err) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectReason.trim()) {
      toast.error('Veuillez indiquer une raison');
      return;
    }

    try {
      await roleUpgradesService.reject(selectedRequest.id, rejectReason);
      toast.success(`Demande de ${selectedRequest.user?.username} rejetée`);
      setRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectReason('');
      loadRequests();
    } catch (err) {
      toast.error('Erreur lors du rejet');
    }
  };

  const handleMarkAsReviewing = async (request: RoleUpgradeRequest) => {
    try {
      await roleUpgradesService.markAsReviewing(request.id);
      toast.success('Demande marquée comme en cours de revue');
      loadRequests();
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const getStatusBadge = (status: string) => {
    const info = statusLabels[status] || statusLabels.PENDING;
    return (
      <Badge variant="outline" className={info.color}>
        {info.label}
      </Badge>
    );
  };

  const totalPages = Math.ceil(totalElements / pageSize);

  if (error && requests.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Demandes de changement de rôle</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadRequests}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Demandes de rôle</h1>
          <p className="text-muted-foreground">
            {totalElements} demande{totalElements > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(0); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="PENDING">En attente</SelectItem>
            <SelectItem value="UNDER_REVIEW">En cours de revue</SelectItem>
            <SelectItem value="APPROVED">Approuvées</SelectItem>
            <SelectItem value="REJECTED">Rejetées</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={request.user?.profilePictureUrl} />
                    <AvatarFallback>
                      {request.user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">
                        {request.user?.fullName || request.user?.username}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      @{request.user?.username} · {request.user?.email}
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {userRoles[request.currentRole as keyof typeof userRoles]?.label || request.currentRole}
                      </Badge>
                      <span className="text-muted-foreground">→</span>
                      <Badge variant="secondary">
                        {userRoles[request.requestedRole as keyof typeof userRoles]?.label || request.requestedRole}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {request.motivation}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatRelativeDate(request.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {request.status === 'PENDING' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setApproveDialogOpen(true);
                          }}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-destructive"
                          onClick={() => {
                            setSelectedRequest(request);
                            setRejectDialogOpen(true);
                          }}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedRequest(request);
                          setDetailsDialogOpen(true);
                        }}>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir les détails
                        </DropdownMenuItem>
                        {request.status === 'PENDING' && (
                          <DropdownMenuItem onClick={() => handleMarkAsReviewing(request)}>
                            <Clock className="h-4 w-4 mr-2" />
                            Marquer en cours
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <UserCheck className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
          <p className="text-muted-foreground">
            {statusFilter === 'PENDING' 
              ? 'Aucune demande en attente'
              : 'Aucune demande trouvée pour ce filtre'
            }
          </p>
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

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedRequest.user?.profilePictureUrl} />
                  <AvatarFallback>
                    {selectedRequest.user?.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedRequest.user?.fullName}</h3>
                  <p className="text-sm text-muted-foreground">
                    @{selectedRequest.user?.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.user?.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Rôle actuel</Label>
                  <p className="font-medium">
                    {userRoles[selectedRequest.currentRole as keyof typeof userRoles]?.label}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Rôle demandé</Label>
                  <p className="font-medium">
                    {userRoles[selectedRequest.requestedRole as keyof typeof userRoles]?.label}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Motivation</Label>
                <p className="mt-1 p-3 bg-muted rounded-lg text-sm">
                  {selectedRequest.motivation}
                </p>
              </div>

              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Documents joints</Label>
                  <div className="mt-2 space-y-2">
                    {selectedRequest.documents.map((doc, i) => (
                      <a 
                        key={i}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2 bg-muted rounded hover:bg-muted/80 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="text-sm">Document {i + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedRequest.rejectionReason && (
                <div>
                  <Label className="text-muted-foreground">Raison du rejet</Label>
                  <p className="mt-1 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    {selectedRequest.rejectionReason}
                  </p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Demande créée le {new Date(selectedRequest.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
              Fermer
            </Button>
            {selectedRequest?.status === 'PENDING' && (
              <>
                <Button 
                  variant="outline"
                  className="text-destructive"
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    setRejectDialogOpen(true);
                  }}
                >
                  Rejeter
                </Button>
                <Button onClick={() => {
                  setDetailsDialogOpen(false);
                  setApproveDialogOpen(true);
                }}>
                  Approuver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approuver cette demande ?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedRequest?.user?.username} deviendra {' '}
              {userRoles[selectedRequest?.requestedRole as keyof typeof userRoles]?.label}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleApprove}>
              Approuver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Expliquez la raison du rejet à {selectedRequest?.user?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Raison du rejet</Label>
            <Textarea
              id="reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Documents manquants, profil incomplet..."
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
    </div>
  );
}
