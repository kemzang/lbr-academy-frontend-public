// ============================================
// Page Mes contenus (pour créateurs)
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  Star,
  BookOpen,
  FileText,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { contentStatuses, contentTypes } from '@/config/theme';
import { cn } from '@/lib/utils';

// Mock data
const mockContents = [
  {
    id: 1,
    title: "L'Art de la Discipline Personnelle",
    slug: "art-discipline-personnelle",
    type: "BOOK",
    status: "APPROVED",
    price: 5000,
    isFree: false,
    viewCount: 1250,
    averageRating: 4.8,
    ratingCount: 89,
    createdAt: "2026-01-15",
    publishedAt: "2026-01-16",
  },
  {
    id: 2,
    title: "Méditations Stoïciennes",
    slug: "meditations-stoiciennes",
    type: "AUDIO",
    status: "APPROVED",
    price: 3000,
    isFree: false,
    viewCount: 567,
    averageRating: 4.6,
    ratingCount: 43,
    createdAt: "2026-01-20",
    publishedAt: "2026-01-21",
  },
  {
    id: 3,
    title: "Guide du Leadership",
    slug: "guide-leadership",
    type: "BOOK",
    status: "PENDING_REVIEW",
    price: 7500,
    isFree: false,
    viewCount: 0,
    averageRating: 0,
    ratingCount: 0,
    createdAt: "2026-01-28",
    publishedAt: null,
  },
  {
    id: 4,
    title: "Article: Les 5 habitudes du matin",
    slug: "5-habitudes-matin",
    type: "ARTICLE",
    status: "DRAFT",
    price: 0,
    isFree: true,
    viewCount: 0,
    averageRating: 0,
    ratingCount: 0,
    createdAt: "2026-02-01",
    publishedAt: null,
  },
];

const typeIcons = {
  BOOK: BookOpen,
  ARTICLE: FileText,
  FORMATION: GraduationCap,
  AUDIO: BookOpen,
  VIDEO: BookOpen,
  SERIES: BookOpen,
};

export default function MyContentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredContents = mockContents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const stats = {
    total: mockContents.length,
    published: mockContents.filter(c => c.status === 'APPROVED').length,
    pending: mockContents.filter(c => c.status === 'PENDING_REVIEW').length,
    draft: mockContents.filter(c => c.status === 'DRAFT').length,
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mes contenus</h1>
          <p className="text-muted-foreground">
            Gérez vos publications et suivez leurs performances
          </p>
        </div>
        <Button className="gradient-gold text-background" asChild>
          <Link href="/my-contents/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau contenu
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{stats.published}</p>
            <p className="text-sm text-muted-foreground">Publiés</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
            <p className="text-sm text-muted-foreground">Brouillons</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(contentStatuses).map(([key, value]) => (
              <SelectItem key={key} value={key}>{value.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {Object.entries(contentTypes).map(([key, value]) => (
              <SelectItem key={key} value={key}>{value.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contenu</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Vues</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContents.map((content) => {
                const statusInfo = contentStatuses[content.status as keyof typeof contentStatuses];
                const typeInfo = contentTypes[content.type as keyof typeof contentTypes];
                const TypeIcon = typeIcons[content.type as keyof typeof typeIcons] || BookOpen;
                
                return (
                  <TableRow key={content.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-10 w-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: typeInfo.color + '20' }}
                        >
                          <TypeIcon className="h-5 w-5" style={{ color: typeInfo.color }} />
                        </div>
                        <div>
                          <p className="font-medium">{content.title}</p>
                          <p className="text-xs text-muted-foreground">{typeInfo.label}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        style={{ color: statusInfo.color, borderColor: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {content.isFree ? (
                        <span className="text-green-500">Gratuit</span>
                      ) : (
                        <span>{content.price.toLocaleString()} XAF</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        {content.viewCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      {content.ratingCount > 0 ? (
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-primary fill-primary" />
                          {content.averageRating.toFixed(1)}
                          <span className="text-xs text-muted-foreground">({content.ratingCount})</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(content.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
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
                          {content.status === 'DRAFT' && (
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Soumettre
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
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

      {filteredContents.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun contenu</h3>
            <p className="text-muted-foreground mb-4">
              Créez votre premier contenu pour commencer
            </p>
            <Button asChild>
              <Link href="/my-contents/new">
                <Plus className="h-4 w-4 mr-2" />
                Nouveau contenu
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
