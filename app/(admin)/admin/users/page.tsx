// ============================================
// Admin - Gestion des utilisateurs - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter,
  MoreVertical,
  Shield,
  ShieldOff,
  Trash2,
  Eye,
  UserCog,
  AlertCircle,
  Mail,
  Check,
  X
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { adminService } from '@/lib/api';
import { User } from '@/types';
import { userRoles, formatRelativeDate } from '@/config/theme';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [newRole, setNewRole] = useState<string>('');

  const loadUsers = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      setError(null);
      const currentPage = reset ? 0 : page;
      const response = await adminService.getUsers(currentPage, 20, roleFilter !== 'all' ? roleFilter : undefined);
      
      if (reset) {
        setUsers(response.content);
        setPage(0);
      } else {
        setUsers(prev => [...prev, ...response.content]);
      }
      setTotal(response.totalElements);
      setHasMore(response.hasNext);
    } catch (err) {
      console.error('Erreur chargement utilisateurs:', err);
      setError('Impossible de charger les utilisateurs.');
    } finally {
      setIsLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    loadUsers(true);
  }, [roleFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(true);
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      await adminService.updateUserRole(selectedUser.id, newRole);
      setUsers(prev => prev.map(u => 
        u.id === selectedUser.id ? { ...u, role: newRole } : u
      ));
      toast.success('Rôle mis à jour');
      setRoleDialogOpen(false);
      setSelectedUser(null);
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      await adminService.toggleUserStatus(user.id);
      setUsers(prev => prev.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      ));
      toast.success(user.isActive ? 'Utilisateur désactivé' : 'Utilisateur activé');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.fullName && u.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (error && users.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={() => loadUsers(true)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
        <p className="text-muted-foreground">
          {total} utilisateur{total > 1 ? 's' : ''} enregistré{total > 1 ? 's' : ''}
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher par nom, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les rôles</SelectItem>
            {Object.entries(userRoles).map(([key, info]) => (
              <SelectItem key={key} value={key}>{info.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading && users.length === 0 ? (
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
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Inscrit le</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => {
                  const roleInfo = userRoles[user.role as keyof typeof userRoles] || userRoles.APPRENANT;
                  
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.profilePictureUrl || undefined} />
                            <AvatarFallback style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}>
                              {(user.fullName || user.username).charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullName || user.username}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge style={{ backgroundColor: roleInfo.color, color: 'white' }}>
                          {roleInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isActive !== false ? (
                          <Badge variant="outline" className="border-green-500 text-green-500">
                            <Check className="h-3 w-3 mr-1" />
                            Actif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-red-500 text-red-500">
                            <X className="h-3 w-3 mr-1" />
                            Inactif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt ? formatRelativeDate(user.createdAt) : '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Voir le profil
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(user);
                              setNewRole(user.role);
                              setRoleDialogOpen(true);
                            }}>
                              <UserCog className="h-4 w-4 mr-2" />
                              Changer le rôle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleToggleActive(user)}>
                              {user.isActive !== false ? (
                                <>
                                  <ShieldOff className="h-4 w-4 mr-2" />
                                  Désactiver
                                </>
                              ) : (
                                <>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Activer
                                </>
                              )}
                            </DropdownMenuItem>
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
                onClick={() => { setPage(p => p + 1); loadUsers(); }}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Charger plus'}
              </Button>
            </div>
          )}

          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </div>
          )}
        </>
      )}

      {/* Change Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Changer le rôle</DialogTitle>
            <DialogDescription>
              Modifier le rôle de {selectedUser?.fullName || selectedUser?.username}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(userRoles).map(([key, info]) => (
                  <SelectItem key={key} value={key}>{info.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleChangeRole}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
