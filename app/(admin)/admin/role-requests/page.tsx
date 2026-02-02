// ============================================
// Admin - Demandes de changement de rôle - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter,
  Check,
  X,
  AlertCircle,
  UserCheck,
  Clock,
  FileText,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import { roleUpgradesService } from '@/lib/api';
import { RoleUpgradeRequest } from '@/types';
import { userRoles, formatRelativeDate } from '@/config/theme';
import { toast } from 'sonner';

const requestStatuses = {
  PENDING: { label: 'En attente', color: '#F59E0B' },
  APPROVED: { label: 'Approuvé', color: '#10B981' },
  REJECTED: { label: 'Rejeté', color: '#EF4444' },
};

export default function AdminRoleRequestsPage() {
  const [requests, setRequests] = useState<RoleUpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<RoleUpgradeRequest | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);

  const loadRequests = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await roleUpgradesService.getAll(currentPage, 20, statusFilter !== 'all' ? statusFilter : undefined);
      
      if (reset) {
        setRequests(response.content);
        setPage(0);
      } else {
        setRequests(prev => [...prev, ...response.content]);
      }
      setTotal(response.totalElements);
      setHasMore(response.hasNext);
    } catch (err) {
      console.error('Erreur chargement demandes:', err);
      setError('Impossible de charger les demandes.');
    } finally {
      setIsLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    loadRequests(true);
  }, [statusFilter]);

  const handleApprove = async (request: RoleUpgradeRequest) => {
    try {
      await roleUpgradesService.approve(request.id);
      setRequests(prev => prev.map(r => 
        r.id === request.id ? { ...r, status: 'APPROVED' } : r
      ));
      toast.success('Demande approuvée');
      setDetailsOpen(false);
    } catch (err) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;

    try {
      await roleUpgradesService.reject(selectedRequest.id, rejectReason);
      setRequests(prev => prev.map(r => 
        r.id === selectedRequest.id ? { ...r, status: 'REJECTED', rejectReason } : r
      ));
      toast.success('Demande rejetée');
      setRejectDialogOpen(false);
      setDetailsOpen(false);
      setRejectReason('');
    } catch (err) {
      toast.error('Erreur lors du rejet');
    }
  };

  if (error && requests.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Demandes de rôle</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadRequests(true)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Demandes de rôle</h1>
        <p className="text-muted-foreground">
          {total} demande{total > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(requestStatuses).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {isLoading && requests.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : requests.length > 0 ? (
        <>
          <div className="space-y-4">
            {requests.map((request, index) => {
              const statusInfo = requestStatuses[request.status as keyof typeof requestStatuses] || requestStatuses.PENDING;
              const targetRole = userRoles[request.requestedRole as keyof typeof userRoles] || userRoles.CREATEUR;
              const currentRole = request.user?.role 
                ? userRoles[request.user.role as keyof typeof userRoles] || userRoles.APPRENANT
                : userRoles.APPRENANT;

              return (
                <Card 
                  key={request.id}
                  className="hover:border-primary/30 transition-colors animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* User info */}
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={request.user?.profilePictureUrl || undefined} />
                          <AvatarFallback style={{ backgroundColor: currentRole.color + '20', color: currentRole.color }}>
                            {(request.user?.fullName || request.user?.username || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{request.user?.fullName || request.user?.username}</p>
                          <p className="text-sm text-muted-foreground">@{request.user?.username}</p>
                        </div>
                      </div>

                      {/* Role change */}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" style={{ borderColor: currentRole.color, color: currentRole.color }}>
                          {currentRole.label}
                        </Badge>
                        <span className="text-muted-foreground">→</span>
                        <Badge style={{ backgroundColor: targetRole.color, color: 'white' }}>
                          {targetRole.label}
                        </Badge>
                      </div>

                      {/* Status */}
                      <Badge 
                        variant="outline"
                        style={{ borderColor: statusInfo.color, color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </Badge>

                      {/* Date */}
                      <span className="text-sm text-muted-foreground">
                        {formatRelativeDate(request.createdAt)}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedRequest(request);
                            setDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Détails
                        </Button>
                        {request.status === 'PENDING' && (
                          <>
                            <Button 
                              size="sm" 
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(request)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => {
                                setSelectedRequest(request);
                                setRejectDialogOpen(true);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
                onClick={() => { setPage(p => p + 1); loadRequests(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <UserCheck className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucune demande</h3>
          <p className="text-muted-foreground">
            {statusFilter === 'PENDING' 
              ? 'Aucune demande en attente'
              : 'Aucune demande trouvée avec ce filtre'
            }
          </p>
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Détails de la demande</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* User */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={selectedRequest.user?.profilePictureUrl || undefined} />
                  <AvatarFallback>
                    {(selectedRequest.user?.fullName || selectedRequest.user?.username || 'U').charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedRequest.user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">@{selectedRequest.user?.username}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.user?.email}</p>
                </div>
              </div>

              {/* Request details */}
              <div>
                <p className="text-sm font-medium mb-1">Rôle demandé</p>
                <Badge style={{ 
                  backgroundColor: userRoles[selectedRequest.requestedRole as keyof typeof userRoles]?.color || '#666',
                  color: 'white'
                }}>
                  {userRoles[selectedRequest.requestedRole as keyof typeof userRoles]?.label || selectedRequest.requestedRole}
                </Badge>
              </div>

              {/* Motivation */}
              {selectedRequest.motivation && (
                <div>
                  <p className="text-sm font-medium mb-1">Motivation</p>
                  <p className="text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedRequest.motivation}
                  </p>
                </div>
              )}

              {/* Documents */}
              {selectedRequest.documentUrl && (
                <div>
                  <p className="text-sm font-medium mb-1">Documents joints</p>
                  <Button variant="outline" asChild>
                    <a href={selectedRequest.documentUrl} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Voir le document
                    </a>
                  </Button>
                </div>
              )}

              {/* Reject reason if rejected */}
              {selectedRequest.status === 'REJECTED' && selectedRequest.rejectReason && (
                <div>
                  <p className="text-sm font-medium mb-1 text-red-500">Raison du rejet</p>
                  <p className="text-muted-foreground bg-red-50 dark:bg-red-950 p-3 rounded-lg">
                    {selectedRequest.rejectReason}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            {selectedRequest?.status === 'PENDING' && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setRejectDialogOpen(true);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Rejeter
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedRequest)}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approuver
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
            <DialogDescription>
              Indiquez la raison du rejet. Cette information sera envoyée à l'utilisateur.
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            placeholder="Raison du rejet..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={4}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
