// ============================================
// Page Explorer - Recherche et liste des contenus
// ============================================

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Search, 
  SlidersHorizontal, 
  Grid3X3,
  List,
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  Headphones,
  Play,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ContentCard } from '@/components/ui/content-card';
import { cn } from '@/lib/utils';
import { ContentSummary } from '@/types';
import { contentTypes } from '@/config/theme';

const typeFilters = [
  { value: 'BOOK', label: 'Livres', icon: BookOpen },
  { value: 'ARTICLE', label: 'Articles', icon: FileText },
  { value: 'FORMATION', label: 'Formations', icon: GraduationCap },
  { value: 'SERIES', label: 'Séries', icon: Library },
  { value: 'AUDIO', label: 'Audio', icon: Headphones },
  { value: 'VIDEO', label: 'Vidéo', icon: Play },
];

const sortOptions = [
  { value: 'date-desc', label: 'Plus récents' },
  { value: 'date-asc', label: 'Plus anciens' },
  { value: 'rating-desc', label: 'Mieux notés' },
  { value: 'views-desc', label: 'Plus populaires' },
  { value: 'price-asc', label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

// Mock data
const mockContents: ContentSummary[] = [
  {
    id: 1,
    title: "L'Art de la Discipline Personnelle",
    slug: "art-discipline-personnelle",
    summary: "Découvrez les secrets des grands leaders pour développer une discipline de fer.",
    type: "BOOK",
    isFree: false,
    price: 5000,
    currency: "XAF",
    status: "APPROVED",
    viewCount: 1250,
    averageRating: 4.8,
    ratingCount: 89,
    author: { id: 1, username: "coach_mbarga", email: "", role: "COACH", roleDisplayName: "Coach Certifié" },
    createdAt: "2026-01-15",
    isFeatured: true,
  },
  {
    id: 2,
    title: "Entrepreneuriat en Afrique: Guide Complet",
    slug: "entrepreneuriat-afrique-guide",
    summary: "Un guide pratique pour lancer et développer votre business en Afrique.",
    type: "FORMATION",
    isFree: false,
    price: 15000,
    currency: "XAF",
    status: "APPROVED",
    viewCount: 890,
    averageRating: 4.9,
    ratingCount: 56,
    author: { id: 2, username: "entrepreneur_paul", email: "", role: "ENTREPRENEUR", roleDisplayName: "Entrepreneur" },
    createdAt: "2026-01-20",
    isFeatured: true,
  },
  {
    id: 3,
    title: "Les 48 Lois du Pouvoir - Résumé",
    slug: "48-lois-pouvoir-resume",
    summary: "Résumé et analyse des 48 lois du pouvoir de Robert Greene.",
    type: "ARTICLE",
    isFree: true,
    currency: "XAF",
    status: "APPROVED",
    viewCount: 3400,
    averageRating: 4.7,
    ratingCount: 234,
    author: { id: 3, username: "lecteur_royal", email: "", role: "CREATEUR", roleDisplayName: "Créateur" },
    createdAt: "2026-01-22",
    isFeatured: false,
  },
  {
    id: 4,
    title: "Méditations Stoïciennes",
    slug: "meditations-stoiciennes",
    summary: "Collection audio de méditations inspirées par Marc Aurèle et les stoïciens.",
    type: "AUDIO",
    isFree: false,
    price: 3000,
    currency: "XAF",
    status: "APPROVED",
    viewCount: 567,
    averageRating: 4.6,
    ratingCount: 43,
    author: { id: 1, username: "coach_mbarga", email: "", role: "COACH", roleDisplayName: "Coach Certifié" },
    createdAt: "2026-01-25",
    isFeatured: false,
  },
  {
    id: 5,
    title: "Masterclass: Investissement Immobilier",
    slug: "masterclass-investissement-immobilier",
    summary: "Apprenez à investir dans l'immobilier au Cameroun et en Afrique.",
    type: "VIDEO",
    isFree: false,
    price: 25000,
    currency: "XAF",
    status: "APPROVED",
    viewCount: 234,
    averageRating: 4.9,
    ratingCount: 28,
    author: { id: 2, username: "entrepreneur_paul", email: "", role: "ENTREPRENEUR", roleDisplayName: "Entrepreneur" },
    createdAt: "2026-01-28",
    isFeatured: true,
  },
  {
    id: 6,
    title: "Collection: Philosophie Africaine",
    slug: "collection-philosophie-africaine",
    summary: "Une série de textes fondamentaux de la pensée africaine.",
    type: "SERIES",
    isFree: false,
    price: 10000,
    currency: "XAF",
    status: "APPROVED",
    viewCount: 456,
    averageRating: 4.8,
    ratingCount: 67,
    author: { id: 3, username: "lecteur_royal", email: "", role: "CREATEUR", roleDisplayName: "Créateur" },
    createdAt: "2026-01-30",
    isFeatured: false,
  },
];

function ExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('query') || '');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<ContentSummary[]>([]);

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      let filtered = [...mockContents];
      
      // Filter by search
      if (searchQuery) {
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.summary?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by type
      if (selectedTypes.length > 0) {
        filtered = filtered.filter(c => selectedTypes.includes(c.type));
      }
      
      // Filter by free
      if (isFreeOnly) {
        filtered = filtered.filter(c => c.isFree);
      }
      
      // Sort
      const [field, direction] = sortBy.split('-');
      filtered.sort((a, b) => {
        let comparison = 0;
        switch (field) {
          case 'date':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            break;
          case 'rating':
            comparison = a.averageRating - b.averageRating;
            break;
          case 'views':
            comparison = a.viewCount - b.viewCount;
            break;
          case 'price':
            comparison = (a.price || 0) - (b.price || 0);
            break;
        }
        return direction === 'desc' ? -comparison : comparison;
      });
      
      setContents(filtered);
      setIsLoading(false);
    }, 500);
  }, [searchQuery, selectedTypes, isFreeOnly, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('query', searchQuery);
    } else {
      params.delete('query');
    }
    router.push(`/explorer?${params.toString()}`);
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSelectedTypes([]);
    setIsFreeOnly(false);
    setSortBy('date-desc');
    setSearchQuery('');
  };

  const hasFilters = selectedTypes.length > 0 || isFreeOnly || searchQuery;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Explorer</h1>
          <p className="text-muted-foreground">
            Découvrez notre collection de contenus de qualité
          </p>
        </div>

        {/* Search & Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un contenu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
          </form>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View mode */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden h-12 w-12">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtres</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Type filters */}
                  <div>
                    <h3 className="font-medium mb-3">Type de contenu</h3>
                    <div className="space-y-2">
                      {typeFilters.map(type => (
                        <div key={type.value} className="flex items-center gap-2">
                          <Checkbox
                            id={`mobile-${type.value}`}
                            checked={selectedTypes.includes(type.value)}
                            onCheckedChange={() => toggleType(type.value)}
                          />
                          <Label htmlFor={`mobile-${type.value}`} className="flex items-center gap-2 cursor-pointer">
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Price filter */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="mobile-free"
                      checked={isFreeOnly}
                      onCheckedChange={(checked) => setIsFreeOnly(checked as boolean)}
                    />
                    <Label htmlFor="mobile-free" className="cursor-pointer">
                      Contenus gratuits uniquement
                    </Label>
                  </div>
                  
                  {hasFilters && (
                    <Button variant="outline" onClick={clearFilters} className="w-full">
                      Effacer les filtres
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Type de contenu</h3>
                <div className="space-y-2">
                  {typeFilters.map(type => {
                    const typeInfo = contentTypes[type.value as keyof typeof contentTypes];
                    return (
                      <button
                        key={type.value}
                        onClick={() => toggleType(type.value)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          selectedTypes.includes(type.value)
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-muted'
                        )}
                      >
                        <type.icon className="h-4 w-4" style={{ color: typeInfo.color }} />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="free"
                  checked={isFreeOnly}
                  onCheckedChange={(checked) => setIsFreeOnly(checked as boolean)}
                />
                <Label htmlFor="free" className="cursor-pointer text-sm">
                  Contenus gratuits uniquement
                </Label>
              </div>
              
              {hasFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  <X className="h-4 w-4 mr-2" />
                  Effacer les filtres
                </Button>
              )}
            </div>
          </aside>

          {/* Content Grid */}
          <main className="flex-1">
            {/* Active filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filtres actifs:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Recherche: {searchQuery}
                    <button onClick={() => setSearchQuery('')}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedTypes.map(type => {
                  const typeInfo = typeFilters.find(t => t.value === type);
                  return (
                    <Badge key={type} variant="secondary" className="gap-1">
                      {typeInfo?.label}
                      <button onClick={() => toggleType(type)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {isFreeOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Gratuit
                    <button onClick={() => setIsFreeOnly(false)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">
              {contents.length} résultat{contents.length > 1 ? 's' : ''}
            </p>

            {isLoading ? (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <Skeleton className={viewMode === 'grid' ? 'aspect-[3/4]' : 'h-32'} />
                    <div className="p-4 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : contents.length > 0 ? (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {contents.map((content, index) => (
                  <div 
                    key={content.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ContentCard 
                      content={content} 
                      variant={viewMode === 'list' ? 'horizontal' : 'default'} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos filtres ou votre recherche
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ExplorerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-48" /></div>}>
      <ExplorerContent />
    </Suspense>
  );
}
