// ============================================
// Page de création de contenu - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { contentsService, categoriesService } from '@/lib/api';
import { Category, CreateContentRequest } from '@/types';
import { contentTypes } from '@/config/theme';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const typeOptions = [
  { value: 'BOOK', label: 'Livre', icon: BookOpen, description: 'eBook, PDF, document écrit' },
  { value: 'ARTICLE', label: 'Article', icon: FileText, description: 'Article de blog, tutoriel' },
  { value: 'FORMATION', label: 'Formation', icon: GraduationCap, description: 'Cours complet, modules' },
  { value: 'SERIES', label: 'Série', icon: Library, description: 'Collection de contenus' },
  { value: 'AUDIO', label: 'Audio', icon: Headphones, description: 'Podcast, audiobook' },
  { value: 'VIDEO', label: 'Vidéo', icon: Play, description: 'Vidéo, tutoriel filmé' },
];

export default function NewContentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
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
    if ((formData.type === 'AUDIO' || formData.type === 'VIDEO') && !contentFile) {
      toast.error(`Le fichier ${formData.type === 'AUDIO' ? 'audio' : 'vidéo'} est requis`);
      return;
    }
    if ((formData.type === 'AUDIO' || formData.type === 'VIDEO') && !formData.duration) {
      toast.error('La durée est requise pour les contenus audio/vidéo');
      return;
    }
    if (!formData.isFree && (!formData.price || parseFloat(formData.price) <= 0)) {
      toast.error('Le prix est requis pour un contenu payant');
      return;
    }

    try {
      setIsSaving(true);

      // Créer le contenu
      const contentData: CreateContentRequest = {
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
        duration: formData.duration ? parseInt(formData.duration) * 60 : undefined, // Convertir minutes en secondes
        freePreview: formData.freePreview.trim() || undefined,
      };

      const content = await contentsService.create(contentData);

      // Upload la couverture si présente
      if (coverFile) {
        try {
          await contentsService.uploadCover(content.id, coverFile);
        } catch (err) {
          console.error('Erreur upload couverture:', err);
        }
      }

      // Upload le fichier si présent
      if (contentFile) {
        try {
          await contentsService.uploadFile(content.id, contentFile);
        } catch (err) {
          console.error('Erreur upload fichier:', err);
        }
      }

      // Soumettre pour validation si demandé
      if (submitForReview) {
        try {
          await contentsService.submit(content.id);
          toast.success('Contenu créé et soumis pour validation !');
        } catch (err) {
          toast.success('Contenu créé en brouillon');
        }
      } else {
        toast.success('Contenu enregistré en brouillon');
      }

      router.push('/my-contents');
    } catch (err: any) {
      console.error('Erreur création contenu:', err);
      toast.error(err.message || 'Erreur lors de la création');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/my-contents">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Nouveau contenu</h1>
          <p className="text-muted-foreground">
            Créez et partagez votre savoir avec la communauté
          </p>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }} className="space-y-8">
        {/* Type de contenu */}
        <Card>
          <CardHeader>
            <CardTitle>Type de contenu</CardTitle>
            <CardDescription>
              Choisissez le format qui correspond à votre contenu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {typeOptions.map(type => {
                const typeInfo = contentTypes[type.value as keyof typeof contentTypes];
                const isSelected = formData.type === type.value;
                
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                    className={cn(
                      'p-4 rounded-lg border-2 text-left transition-all',
                      isSelected 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <type.icon 
                      className="h-8 w-8 mb-2" 
                      style={{ color: typeInfo.color }}
                    />
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Informations de base */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de base</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <p className="text-xs text-muted-foreground text-right">
                {formData.title.length}/200
              </p>
            </div>

            {/* Résumé */}
            <div className="space-y-2">
              <Label htmlFor="summary">Résumé</Label>
              <Textarea
                id="summary"
                name="summary"
                placeholder="Un court résumé pour attirer les lecteurs (affiché dans les listes)"
                value={formData.summary}
                onChange={handleChange}
                rows={2}
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.summary.length}/500
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description complète *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={
                  formData.type === 'AUDIO' 
                    ? "Décrivez votre podcast ou audiobook. Quel est le sujet ? Quelle est la durée ? À qui s'adresse-t-il ?"
                    : formData.type === 'VIDEO'
                    ? "Décrivez votre vidéo. Quel est le contenu ? Quelle est la durée ? À qui s'adresse-t-elle ?"
                    : formData.type === 'BOOK'
                    ? "Décrivez votre livre. Quel est le sujet ? Combien de pages ? À qui s'adresse-t-il ?"
                    : formData.type === 'ARTICLE'
                    ? "Décrivez votre article. Quel est le sujet ? À qui s'adresse-t-il ?"
                    : formData.type === 'FORMATION'
                    ? "Décrivez votre formation. Quels sont les modules ? Quelle est la durée ? À qui s'adresse-t-elle ?"
                    : "Décrivez votre contenu en détail. Qu'est-ce que le lecteur va apprendre ? À qui s'adresse-t-il ?"
                }
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
                placeholder="développement, business, mindset (séparés par des virgules)"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            {/* Langue */}
            <div className="space-y-2">
              <Label htmlFor="language">Langue</Label>
              <Select 
                value={formData.language} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Médias */}
        <Card>
          <CardHeader>
            <CardTitle>Médias</CardTitle>
            <CardDescription>
              {formData.type === 'AUDIO' || formData.type === 'VIDEO'
                ? 'Ajoutez votre fichier média et une image de couverture (optionnel)'
                : formData.type === 'BOOK' || formData.type === 'ARTICLE'
                ? 'Ajoutez votre document et une image de couverture'
                : 'Ajoutez une couverture et votre fichier de contenu'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Fichier de contenu - Prioritaire pour AUDIO/VIDEO */}
            {(formData.type === 'AUDIO' || formData.type === 'VIDEO') && (
              <div className="space-y-2">
                <Label>
                  Fichier {formData.type === 'AUDIO' ? 'audio' : 'vidéo'} *
                  <span className="text-destructive ml-1">(requis)</span>
                </Label>
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
                      ) : (
                        <div>
                          <p className="font-medium">Cliquez pour uploader</p>
                          <p className="text-sm text-muted-foreground">
                            {formData.type === 'AUDIO' 
                              ? 'MP3, WAV, M4A (audio)' 
                              : 'MP4, WebM (vidéo)'}
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept={
                        formData.type === 'AUDIO'
                          ? 'audio/*,.mp3,.m4a,.wav'
                          : 'video/*,.mp4,.webm'
                      }
                      onChange={handleContentFileChange}
                    />
                  </label>
                  {contentFile && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setContentFile(null)}
                      aria-label="Supprimer le fichier"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {formData.type === 'AUDIO' 
                    ? 'Formats acceptés : MP3, M4A, WAV (max 50 Mo). Le fichier audio est obligatoire.'
                    : 'Formats acceptés : MP4, WebM (max 50 Mo). Le fichier vidéo est obligatoire.'}
                </p>
              </div>
            )}

            {/* Couverture - Optionnelle pour AUDIO/VIDEO */}
            <div className="space-y-2">
              <Label>
                Image de couverture
                {(formData.type === 'AUDIO' || formData.type === 'VIDEO') && (
                  <span className="text-muted-foreground ml-1 text-xs">(optionnel)</span>
                )}
              </Label>
              <div className="flex items-start gap-4">
                {coverPreview ? (
                  <div className="relative w-32 aspect-[3/4] rounded-lg overflow-hidden border">
                    <img 
                      src={coverPreview} 
                      alt="Couverture" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => { setCoverPreview(null); setCoverFile(null); }}
                      className="absolute top-1 right-1 p-1 bg-background/80 rounded-full hover:bg-background"
                      aria-label="Supprimer l'image de couverture"
                      title="Supprimer l'image de couverture"
                    >
                      <X className="h-4 w-4" />
                    </button>
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
                <div className="text-sm text-muted-foreground">
                  <p>Format recommandé : {formData.type === 'AUDIO' || formData.type === 'VIDEO' ? '1200×1200 pixels (carré)' : '600×800 pixels'}</p>
                  <p>Formats acceptés : JPG, PNG, WebP</p>
                  <p>Taille max : 5 Mo</p>
                  {(formData.type === 'AUDIO' || formData.type === 'VIDEO') && (
                    <p className="text-xs mt-1">L'image sera utilisée comme miniature dans les lecteurs</p>
                  )}
                </div>
              </div>
            </div>

            {/* Fichier de contenu - Pour les autres types */}
            {formData.type !== 'AUDIO' && formData.type !== 'VIDEO' && (
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
                      ) : (
                        <div>
                          <p className="font-medium">Cliquez pour uploader</p>
                          <p className="text-sm text-muted-foreground">
                            PDF, EPUB, TXT (documents)
                          </p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.epub,.txt"
                      onChange={handleContentFileChange}
                    />
                  </label>
                  {contentFile && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setContentFile(null)}
                      aria-label="Supprimer le fichier"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Formats acceptés : PDF, EPUB, TXT (max 50 Mo)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tarification */}
        <Card>
          <CardHeader>
            <CardTitle>Tarification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Gratuit/Payant */}
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

            {/* Prix */}
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
                    placeholder={
                      formData.type === 'AUDIO' || formData.type === 'VIDEO'
                        ? "2000"
                        : formData.type === 'BOOK'
                        ? "5000"
                        : "3000"
                    }
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
                <p className="text-xs text-muted-foreground">
                  {formData.type === 'AUDIO' && 'Prix suggéré : 1000-5000 XAF pour un podcast/audiobook'}
                  {formData.type === 'VIDEO' && 'Prix suggéré : 2000-8000 XAF pour une vidéo'}
                  {formData.type === 'BOOK' && 'Prix suggéré : 3000-10000 XAF pour un livre'}
                  {formData.type === 'ARTICLE' && 'Prix suggéré : 500-2000 XAF pour un article'}
                  {formData.type === 'FORMATION' && 'Prix suggéré : 5000-20000 XAF pour une formation'}
                  {formData.type === 'SERIES' && 'Prix suggéré : 10000-50000 XAF pour une série'}
                </p>
              </div>
            )}

            {/* Extrait gratuit */}
            <div className="space-y-2">
              <Label htmlFor="freePreview">Extrait gratuit</Label>
              <Textarea
                id="freePreview"
                name="freePreview"
                placeholder="Un extrait gratuit pour donner envie aux lecteurs (optionnel)"
                value={formData.freePreview}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Métadonnées */}
        {(formData.type === 'BOOK' || formData.type === 'ARTICLE' || formData.type === 'VIDEO' || formData.type === 'AUDIO' || formData.type === 'FORMATION') && (
          <Card>
            <CardHeader>
              <CardTitle>Informations supplémentaires</CardTitle>
              <CardDescription>
                {formData.type === 'BOOK' || formData.type === 'ARTICLE'
                  ? 'Aidez les lecteurs à mieux comprendre votre contenu'
                  : 'Informations sur la durée de votre contenu'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Nombre de pages */}
                {(formData.type === 'BOOK' || formData.type === 'ARTICLE') && (
                  <div className="space-y-2">
                    <Label htmlFor="pageCount">Nombre de pages</Label>
                    <Input
                      id="pageCount"
                      name="pageCount"
                      type="number"
                      min="1"
                      placeholder={formData.type === 'BOOK' ? "Ex: 150" : "Ex: 10"}
                      value={formData.pageCount}
                      onChange={handleChange}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.type === 'BOOK' 
                        ? 'Nombre approximatif de pages de votre livre'
                        : 'Nombre approximatif de pages de votre article'}
                    </p>
                  </div>
                )}

                {/* Durée */}
                {(formData.type === 'VIDEO' || formData.type === 'AUDIO' || formData.type === 'FORMATION') && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (en minutes) *</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      min="1"
                      placeholder={
                        formData.type === 'AUDIO'
                          ? "Ex: 30 (podcast)"
                          : formData.type === 'VIDEO'
                          ? "Ex: 15 (tutoriel)"
                          : "Ex: 120 (formation complète)"
                      }
                      value={formData.duration}
                      onChange={handleChange}
                      required={formData.type === 'AUDIO' || formData.type === 'VIDEO'}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.duration 
                        ? `${formData.duration} min = ${parseInt(formData.duration || '0') * 60} secondes`
                        : formData.type === 'AUDIO' || formData.type === 'VIDEO'
                        ? 'La durée est requise et sera convertie en secondes'
                        : 'La durée sera convertie en secondes pour le backend'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
              Enregistrer en brouillon
            </Button>
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
          </div>
        </div>
      </form>
    </div>
  );
}
