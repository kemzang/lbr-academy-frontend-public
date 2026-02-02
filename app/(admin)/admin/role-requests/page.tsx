// ============================================
// Page Admin - Demandes de rôle
// ============================================

'use client';

import { useState } from 'react';
import { 
  UserCog, 
  CheckCircle, 
  XCircle,
  Eye,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { userRoles } from '@/config/theme';

// Mock data
const mockRequests = [
  {
    id: 1,
    user: { id: 10, username: 'aspirant_createur', fullName: 'Pierre Tanga', email: 'pierre@example.com' },
    currentRole: 'APPRENANT',
    requestedRole: 'CREATEUR',
    motivation: 'Je suis auteur de plusieurs articles sur le développement personnel et je souhaite partager mes connaissances sur cette plateforme.',
    bio: 'Passionné d\'écriture depuis 10 ans, j\'ai publié 3 livres sur Amazon.',
    portfolioUrl: 'https://portfolio.example.com',
    linkedinUrl: 'https://linkedin.com/in/pierre',
    specialization: 'Développement personnel',
    status: 'PENDING',
    createdAt: '2026-02-01',
  },
  {
    id: 2,
    user: { id: 11, username: 'future_coach', fullName: 'Alice Ngo', email: 'alice@example.com' },
    currentRole: 'CREATEUR',
    requestedRole: 'COACH',
    motivation: 'Je suis coach certifié ICF et je souhaite proposer des formations certifiantes.',
    bio: 'Coach professionnel avec certification ICF PCC. 5 ans d\'expérience.',
    portfolioUrl: 'https://alicecoaching.com',
    linkedinUrl: 'https://linkedin.com/in/alice',
    specialization: 'Leadership et Management',
    status: 'PENDING',
    createdAt: '2026-01-28',
  },
  {
    id: 3,
    user: { id: 12, username: 'entrepreneur_jean', fullName: 'Jean Fouda', email: 'jean@example.com' },
    currentRole: 'APPRENANT',
    requestedRole: 'ENTREPRENEUR',
    motivation: 'Fondateur de 2 startups, je veux partager mon expérience entrepreneuriale.',
    bio: 'Serial entrepreneur, fondateur de TechCam et AfriPay.',
    portfolioUrl: null,
    linkedinUrl: 'https://linkedin.com/in/jeanfouda',
    specialization: 'Entrepreneuriat Tech',
    status: 'APPROVED',
    createdAt: '2026-01-20',
    processedAt: '2026-01-22',
  },
];

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState(mockRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [dialogAction, setDialogAction] = useState<'approve' | 'reject' | null>(null);

  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  const handleAction = (action: 'approve' | 'reject') => {
    if (!selectedRequest) return;
    
    setRequests(prev => prev.map(r => 
      r.id === selectedRequest.id 
        ? { ...r, status: action === 'approve' ? 'APPROVED' : 'REJECTED', processedAt: new Date().toISOString() }
        : r
    ));
    
    toast.success(action === 'approve' ? 'Demande approuvée' : 'Demande rejetée');
    setSelectedRequest(null);
    setDialogAction(null);
    setAdminNote('');
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold">Demandes de rôle</h1>
        <p className="text-muted-foreground">
          Validez les demandes de changement de rôle
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className={pendingCount > 0 ? 'border-yellow-500/50' : ''}>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">{requests.filter(r => r.status === 'APPROVED').length}</p>
            <p className="text-sm text-muted-foreground">Approuvées</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">{requests.filter(r => r.status === 'REJECTED').length}</p>
            <p className="text-sm text-muted-foreground">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            En attente
            {pendingCount > 0 && <Badge className="ml-2 bg-destructive">{pendingCount}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="processed">Traitées</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {requests.filter(r => r.status === 'PENDING').map((request) => (
            <RequestCard 
              key={request.id} 
              request={request} 
              onView={() => setSelectedRequest(request)}
              onApprove={() => { setSelectedRequest(request); setDialogAction('approve'); }}
              onReject={() => { setSelectedRequest(request); setDialogAction('reject'); }}
            />
          ))}
          {requests.filter(r => r.status === 'PENDING').length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <UserCog className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">Aucune demande en attente</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processed" className="mt-6 space-y-4">
          {requests.filter(r => r.status !== 'PENDING').map((request) => (
            <RequestCard 
              key={request.id} 
              request={request} 
              onView={() => setSelectedRequest(request)}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Detail/Action Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => { setSelectedRequest(null); setDialogAction(null); }}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialogAction === 'approve' ? 'Approuver la demande' : 
                   dialogAction === 'reject' ? 'Rejeter la demande' : 
                   'Détails de la demande'}
                </DialogTitle>
                <DialogDescription>
                  Demande de {selectedRequest.user.fullName} pour devenir {userRoles[selectedRequest.requestedRole as keyof typeof userRoles]?.label}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback>{selectedRequest.user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedRequest.user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{userRoles[selectedRequest.currentRole as keyof typeof userRoles]?.label}</Badge>
                      <span>→</span>
                      <Badge className="gradient-gold text-background">
                        {userRoles[selectedRequest.requestedRole as keyof typeof userRoles]?.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Motivation</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{selectedRequest.motivation}</p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-1">Bio</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Spécialisation</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.specialization}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Liens</p>
                    <div className="flex gap-2">
                      {selectedRequest.portfolioUrl && (
                        <a href={selectedRequest.portfolioUrl} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="gap-1">
                            Portfolio <ExternalLink className="h-3 w-3" />
                          </Badge>
                        </a>
                      )}
                      {selectedRequest.linkedinUrl && (
                        <a href={selectedRequest.linkedinUrl} target="_blank" rel="noopener noreferrer">
                          <Badge variant="outline" className="gap-1">
                            LinkedIn <ExternalLink className="h-3 w-3" />
                          </Badge>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {dialogAction && (
                  <div>
                    <p className="text-sm font-medium mb-1">Note admin (optionnel)</p>
                    <Textarea
                      placeholder="Ajouter une note..."
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <DialogFooter>
                {dialogAction ? (
                  <>
                    <Button variant="outline" onClick={() => setDialogAction(null)}>Annuler</Button>
                    <Button 
                      onClick={() => handleAction(dialogAction)}
                      className={dialogAction === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-destructive'}
                    >
                      {dialogAction === 'approve' ? 'Approuver' : 'Rejeter'}
                    </Button>
                  </>
                ) : selectedRequest.status === 'PENDING' ? (
                  <>
                    <Button variant="outline" onClick={() => setDialogAction('reject')} className="text-destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                    <Button onClick={() => setDialogAction('approve')} className="bg-green-500 hover:bg-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>Fermer</Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function RequestCard({ 
  request, 
  onView,
  onApprove,
  onReject 
}: { 
  request: typeof mockRequests[0];
  onView: () => void;
  onApprove?: () => void;
  onReject?: () => void;
}) {
  const currentRoleInfo = userRoles[request.currentRole as keyof typeof userRoles];
  const requestedRoleInfo = userRoles[request.requestedRole as keyof typeof userRoles];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarFallback style={{ backgroundColor: requestedRoleInfo.color + '20', color: requestedRoleInfo.color }}>
                {request.user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{request.user.fullName}</p>
              <p className="text-sm text-muted-foreground">@{request.user.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{currentRoleInfo.label}</Badge>
                <span className="text-muted-foreground">→</span>
                <Badge style={{ backgroundColor: requestedRoleInfo.color + '20', color: requestedRoleInfo.color }}>
                  {requestedRoleInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              {request.status === 'PENDING' ? (
                <Badge className="bg-yellow-500/20 text-yellow-500">
                  <Clock className="h-3 w-3 mr-1" />
                  En attente
                </Badge>
              ) : request.status === 'APPROVED' ? (
                <Badge className="bg-green-500/20 text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Approuvé
                </Badge>
              ) : (
                <Badge className="bg-destructive/20 text-destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Rejeté
                </Badge>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(request.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onView}>
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              {request.status === 'PENDING' && onApprove && onReject && (
                <>
                  <Button size="sm" onClick={onApprove} className="bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={onReject}>
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
