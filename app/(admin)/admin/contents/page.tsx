// ============================================
// Page Admin - Gestion des contenus
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  BookOpen,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { contentStatuses, contentTypes } from '@/config/theme';
import { toast } from 'sonner';

// Mock data
const mockContents = [
  { id: 1, title: "L'Art de la Discipline", author: "coach_mbarga", type: "BOOK", status: "PENDING_REVIEW", price: 5000, createdAt: "2026-02-01" },
  { id: 2, title: "Formation Marketing Digital", author: "entrepreneur_paul", type: "FORMATION", status: "PENDING_REVIEW", price: 15000, createdAt: "2026-01-30" },
  { id: 3, title: "Guide du Leadership", author: "coach_mbarga", type: "BOOK", status: "APPROVED", price: 7500, createdAt: "2026-01-28", isFeatured: true },
  { id: 4, title: "Article: Les habitudes", author: "lecteur_royal", type: "ARTICLE", status: "APPROVED", price: 0, createdAt: "2026-01-25" },
  { id: 5, title: "Podcast Motivation", author: "coach_success", type: "AUDIO", status: "REJECTED", price: 3000, createdAt: "2026-01-20" },
];

export default function AdminContentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [contents, setContents] = useState(mockContents);

  const pendingCount = contents.filter(c => c.status === 'PENDING_REVIEW').length;

  const handleApprove = (id: number) => {
    setContents(prev => prev.map(c => c.id === id ? { ...c, status: 'APPROVED' } : c));
    toast.success('Contenu approuvé');
  };

  const handleReject = (id: number) => {
    setContents(prev => prev.map(c => c.id === id ? { ...c, status: 'REJECTED' } : c));
    toast.success('Contenu rejeté');
  };

  const handleFeature = (id: number) => {
    setContents(prev => prev.map(c => c.id === id ? { ...c, isFeatured: !c.isFeatured } : c));
    toast.success('Mise en avant mise à jour');
  };

  const filteredContents = contents.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold">Gestion des contenus</h1>
        <p className="text-muted-foreground">
          Validez et gérez les contenus de la plateforme
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{contents.length}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card className="border-yellow-500/50">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-500">{contents.filter(c => c.status === 'APPROVED').length}</p>
            <p className="text-sm text-muted-foreground">Approuvés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-destructive">{contents.filter(c => c.status === 'REJECTED').length}</p>
            <p className="text-sm text-muted-foreground">Rejetés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-primary">{contents.filter(c => c.isFeatured).length}</p>
            <p className="text-sm text-muted-foreground">En vedette</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <TabsList>
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              En attente
              {pendingCount > 0 && (
                <Badge className="ml-2 bg-destructive">{pendingCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approuvés</TabsTrigger>
            <TabsTrigger value="rejected">Rejetés</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[200px]"
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          <ContentTable 
            contents={filteredContents} 
            onApprove={handleApprove}
            onReject={handleReject}
            onFeature={handleFeature}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-6">
          <ContentTable 
            contents={filteredContents.filter(c => c.status === 'PENDING_REVIEW')} 
            onApprove={handleApprove}
            onReject={handleReject}
            onFeature={handleFeature}
          />
        </TabsContent>
        <TabsContent value="approved" className="mt-6">
          <ContentTable 
            contents={filteredContents.filter(c => c.status === 'APPROVED')} 
            onApprove={handleApprove}
            onReject={handleReject}
            onFeature={handleFeature}
          />
        </TabsContent>
        <TabsContent value="rejected" className="mt-6">
          <ContentTable 
            contents={filteredContents.filter(c => c.status === 'REJECTED')} 
            onApprove={handleApprove}
            onReject={handleReject}
            onFeature={handleFeature}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentTable({ 
  contents, 
  onApprove, 
  onReject,
  onFeature 
}: { 
  contents: typeof mockContents; 
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onFeature: (id: number) => void;
}) {
  if (contents.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">Aucun contenu</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contenu</TableHead>
              <TableHead>Auteur</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contents.map((content) => {
              const statusInfo = contentStatuses[content.status as keyof typeof contentStatuses];
              const typeInfo = contentTypes[content.type as keyof typeof contentTypes];
              
              return (
                <TableRow key={content.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {content.isFeatured && <Star className="h-4 w-4 text-primary fill-primary" />}
                      <span className="font-medium">{content.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>{content.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline" style={{ color: typeInfo.color, borderColor: typeInfo.color }}>
                      {typeInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {content.price === 0 ? 'Gratuit' : `${content.price.toLocaleString()} XAF`}
                  </TableCell>
                  <TableCell>
                    <Badge style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}>
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(content.createdAt).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Voir le contenu
                        </DropdownMenuItem>
                        {content.status === 'PENDING_REVIEW' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onApprove(content.id)} className="text-green-500">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onReject(content.id)} className="text-destructive">
                              <XCircle className="h-4 w-4 mr-2" />
                              Rejeter
                            </DropdownMenuItem>
                          </>
                        )}
                        {content.status === 'APPROVED' && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onFeature(content.id)}>
                              <Star className="h-4 w-4 mr-2" />
                              {content.isFeatured ? 'Retirer de la vedette' : 'Mettre en vedette'}
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
      </CardContent>
    </Card>
  );
}
