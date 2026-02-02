// ============================================
// Page d'édition de contenu - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  FileUp,
  Loader2,
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  Headphones,
  Play,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { contentsService, categoriesService } from '@/lib/api';
import { Category, Content, UpdateContentRequest } from '@/types';
import { contentTypes, contentStatuses } from '@/config/theme';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const typeOptions = [
  { value: 'BOOK', label: 'Livre', icon: BookOpen },
  { value: 'ARTICLE', label: 'Article', icon: FileText },
  { value: 'FORMATION', label: 'Formation', icon: GraduationCap },
  { value: 'SERIES', label: 'Série', icon: Library },
  { value: 'AUDIO', label: 'Audio', icon: Headphones },
  { value: 'VIDEO', label: 'Vidéo', icon: Play },
];

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = parseInt(params.id as string);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<Content | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [contentFile, setContentFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    description: '',
    type: '',
    categoryId: '',
    isFree: true,
    price: '',
    currency: 'XAF',
    tags: '',
    language: 'fr',
    pageCount: '',
    duration: '',
    freePreview: '',
  });

  useEffect(() => {
    loadData();
  }, [contentId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [contentData, categoriesData] = await Promise.all([
        contentsService.getById(contentId),
        categoriesService.getAll(),
      ]);

      setContent(contentData);
      setCategories(categoriesData);
      setCoverPreview(contentData.coverUrl || null);

      // Pré-remplir le formulaire
      setFormData({
        title: contentData.title || '',
        summary: contentData.summary || '',
        description: contentData.description || '',
        type: contentData.type || '',
        categoryId: contentData.category?.id?.toString() || '',
        isFree: contentData.isFree ?? true,
        price: contentData.price?.toString() || '',
        currency: contentData.currency || 'XAF',
        tags: contentData.tags || '',
        language: contentData.language || 'fr',
        pageCount: contentData.pageCount?.toString() || '',
        duration: contentData.duration?.toString() || '',
        freePreview: contentData.freePreview || '',
      });
    } catch (err) {
      console.error('Erreur chargement contenu:', err);
      setError('Impossible de charger le contenu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setContentFile(file);
    }
  };

  const handleSubmit = async (submitForReview = false) => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Le titre est requis');
      return;
    }
    if (!formData.type) {
      toast.error('Le type de contenu est requis');
      return;
    }
    if (!formData.categoryId) {
      toast.error('La catégorie est requise');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('La description est requise');
      return;
    }
    if (!formData.isFree && (!formData.price || parseFloat(formData.price) <= 0)) {
      toast.error('Le prix est requis pour un contenu payant');
      return;
    }

    try {
      setIsSaving(true);

      // Mettre à jour le contenu
      const updateData: UpdateContentRequest = {
        title: formData.title.trim(),
        summary: formData.summary.trim() || undefined,
        description: formData.description.trim(),
        type: formData.type as any,
        categoryId: parseInt(formData.categoryId),
        isFree: formData.isFree,
        price: formData.isFree ? undefined : parseFloat(formData.price),
        currency: formData.currency,
        tags: formData.tags.trim() || undefined,
        language: formData.language,
        pageCount: formData.pageCount ? parseInt(formData.pageCount) : undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        freePreview: formData.freePreview.trim() || undefined,
      };

      await contentsService.update(contentId, updateData);

      // Upload la couverture si changée
      if (coverFile) {
        try {
          await contentsService.uploadCover(contentId, coverFile);
        } catch (err) {
          console.error('Erreur upload couverture:', err);
        }
      }

      // Upload le fichier si changé
      if (contentFile) {
        try {
          await contentsService.uploadFile(contentId, contentFile);
        } catch (err) {
          console.error('Erreur upload fichier:', err);
        }
      }

      // Soumettre pour validation si demandé
      if (submitForReview && content?.status === 'DRAFT') {
        try {
          await contentsService.submit(contentId);
          toast.success('Contenu mis à jour et soumis pour validation !');
        } catch (err) {
          toast.success('Contenu mis à jour');
        }
      } else {
        toast.success('Contenu mis à jour avec succès');
      }

      router.push('/my-contents');
    } catch (err: any) {
      console.error('Erreur mise à jour contenu:', err);
      toast.error(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Contenu introuvable'}</AlertDescription>
        </Alert>
        <Button asChild>
          <Link href="/my-contents">Retour à mes contenus</Link>
        </Button>
      </div>
    );
  }

  const statusInfo = contentStatuses[content.status] || contentStatuses.DRAFT;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/my-contents">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Modifier le contenu</h1>
            <p className="text-muted-foreground">
              {content.title}
            </p>
          </div>
        </div>
        <Badge style={{ backgroundColor: statusInfo.color, color: 'white' }}>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Warning if not draft */}
      {content.status !== 'DRAFT' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Ce contenu a déjà été soumis pour validation. Les modifications peuvent nécessiter une nouvelle validation.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-8">
        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Type (lecture seule après création) */}
            <div className="space-y-2">
              <Label>Type de contenu</Label>
              <div className="flex items-center gap-2">
                {(() => {
                  const type = typeOptions.find(t => t.value === formData.type);
                  const typeInfo = contentTypes[formData.type as keyof typeof contentTypes];
                  if (!type || !typeInfo) return null;
                  return (
                    <Badge style={{ backgroundColor: typeInfo.color, color: 'white' }}>
                      <type.icon className="h-3 w-3 mr-1" />
                      {type.label}
                    </Badge>
                  );
                })()}
                <span className="text-sm text-muted-foreground">(non modifiable)</span>
              </div>
            </div>

            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Le titre de votre contenu"
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
              />
            </div>

            {/* Résumé */}
            <div className="space-y-2">
              <Label htmlFor="summary">Résumé</Label>
              <Textarea
                id="summary"
                name="summary"
                placeholder="Un court résumé"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                maxLength={500}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description complète *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Description détaillée"
                value={formData.description}
                onChange={handleChange}
                rows={6}
              />
            </div>

            {/* Catégorie */}
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="Tags séparés par des virgules"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Médias */}
        <Card>
          <CardHeader>
            <CardTitle>Médias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Couverture */}
            <div className="space-y-2">
              <Label>Image de couverture</Label>
              <div className="flex items-start gap-4">
                {coverPreview ? (
                  <div className="relative w-32 aspect-[3/4] rounded-lg overflow-hidden border">
                    <img 
                      src={coverPreview} 
                      alt="Couverture" 
                      className="w-full h-full object-cover"
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                      <span className="text-white text-sm">Changer</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                      />
                    </label>
                  </div>
                ) : (
                  <label className="w-32 aspect-[3/4] rounded-lg border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <span className="text-xs text-muted-foreground">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleCoverChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Fichier de contenu */}
            <div className="space-y-2">
              <Label>Fichier du contenu</Label>
              <div className="flex items-center gap-4">
                <label className="flex-1 p-4 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1">
                    {contentFile ? (
                      <div>
                        <p className="font-medium">{contentFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(contentFile.size / 1024 / 1024).toFixed(2)} Mo
                        </p>
                      </div>
                    ) : content.fileUrl ? (
                      <div>
                        <p className="font-medium">Fichier actuel</p>
                        <p className="text-sm text-muted-foreground">
                          Cliquez pour remplacer
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Cliquez pour uploader</p>
                        <p className="text-sm text-muted-foreground">
                          PDF, EPUB, MP3, MP4, etc.
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleContentFileChange}
                  />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardHeader>
            <CardTitle>Tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Contenu gratuit</p>
                <p className="text-sm text-muted-foreground">
                  Les contenus gratuits sont accessibles à tous
                </p>
              </div>
              <Switch
                checked={formData.isFree}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFree: checked }))}
              />
            </div>

            {!formData.isFree && (
              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="100"
                    placeholder="5000"
                    value={formData.price}
                    onChange={handleChange}
                    className="flex-1"
                  />
                  <Select 
                    value={formData.currency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                  >
                    <SelectTrigger className="w-24">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XAF">XAF</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between gap-4 pt-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/my-contents">Annuler</Link>
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => handleSubmit(false)}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Enregistrer
            </Button>
            {content.status === 'DRAFT' && (
              <Button 
                type="button"
                className="gradient-gold text-background"
                onClick={() => handleSubmit(true)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Soumettre pour validation
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
