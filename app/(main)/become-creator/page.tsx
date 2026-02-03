// ============================================
// Page Devenir Créateur - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Crown, 
  TrendingUp, 
  Award, 
  BookOpen, 
  Users, 
  DollarSign,
  Check,
  ArrowRight,
  AlertCircle,
  Loader2,
  FileText,
  GraduationCap,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/stores/auth-store';
import { roleUpgradesService } from '@/lib/api';
import { CreateRoleUpgradeRequest } from '@/types';
import { UserRole } from '@/config/theme';
import { toast } from 'sonner';

const roleOptions: { value: UserRole; label: string; icon: typeof BookOpen; description: string }[] = [
  { 
    value: 'CREATEUR', 
    label: 'Créateur', 
    icon: BookOpen, 
    description: 'Auteur, artiste, ou créateur de contenu' 
  },
  { 
    value: 'ENTREPRENEUR', 
    label: 'Entrepreneur', 
    icon: Briefcase, 
    description: 'Créateur de contenu business et entrepreneurial' 
  },
  { 
    value: 'HYBRIDE', 
    label: 'Hybride', 
    icon: Sparkles, 
    description: 'Créateur + Entrepreneur' 
  },
  { 
    value: 'COACH', 
    label: 'Coach Certifié', 
    icon: GraduationCap, 
    description: 'Formateur certifié avec expertise reconnue' 
  },
];

const benefits = [
  {
    icon: DollarSign,
    title: 'Gagnez de l\'argent',
    description: 'Monétisez vos connaissances et recevez des revenus sur chaque vente',
  },
  {
    icon: Users,
    title: 'Construisez votre audience',
    description: 'Développez votre communauté et établissez votre réputation',
  },
  {
    icon: Award,
    title: 'Reconnaissance',
    description: 'Obtenez la certification et la visibilité sur la plateforme',
  },
  {
    icon: BookOpen,
    title: 'Partagez vos connaissances',
    description: 'Transmettez votre expertise à des milliers d\'apprenants',
  },
];

export default function BecomeCreatorPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [formData, setFormData] = useState<CreateRoleUpgradeRequest>({
    requestedRole: 'CREATEUR',
    motivation: '',
    bio: '',
    portfolioUrl: '',
    linkedinUrl: '',
    specialization: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/become-creator');
      return;
    }

    // Vérifier si l'utilisateur est déjà créateur
    const isCreator = ['CREATEUR', 'ENTREPRENEUR', 'HYBRIDE', 'COACH', 'ADMIN'].includes(user?.role || '');
    if (isCreator) {
      router.push('/dashboard');
      return;
    }

    // Vérifier s'il y a une demande en attente
    checkPendingRequest();
  }, [isAuthenticated, user]);

  const checkPendingRequest = async () => {
    try {
      const requests = await roleUpgradesService.getMyRequests();
      const pending = requests.find(r => r.status === 'PENDING');
      if (pending) {
        setHasPendingRequest(true);
      }
    } catch (err) {
      console.error('Erreur vérification demandes:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, requestedRole: value as UserRole }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.motivation.trim()) {
      toast.error('La motivation est requise');
      return;
    }

    if (formData.motivation.trim().length < 50) {
      toast.error('La motivation doit contenir au moins 50 caractères');
      return;
    }

    try {
      setIsLoading(true);
      await roleUpgradesService.create(formData);
      toast.success('Demande envoyée avec succès ! Elle sera examinée par notre équipe.');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Erreur soumission demande:', err);
      toast.error(err.message || 'Erreur lors de l\'envoi de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const isCreator = ['CREATEUR', 'ENTREPRENEUR', 'HYBRIDE', 'COACH', 'ADMIN'].includes(user?.role || '');
  if (isCreator) {
    return null;
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge className="mb-4 gradient-gold text-background">
            <Crown className="h-3 w-3 mr-1" />
            Devenir Créateur
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Rejoignez les <span className="text-gradient-gold">créateurs</span> de talent
          </h1>
          <p className="text-lg text-muted-foreground">
            Partagez vos connaissances, monétisez votre expertise et construisez votre audience
            sur La Bibliothèque des Rois.
          </p>
        </div>

        {/* Pending Request Alert */}
        {hasPendingRequest && (
          <Alert className="max-w-2xl mx-auto mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Vous avez déjà une demande en attente de validation. Vous serez notifié une fois qu'elle sera traitée.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Benefits */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Avantages
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm mb-1">{benefit.title}</h3>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  Processus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">1.</span>
                    <span>Remplissez le formulaire ci-contre</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">2.</span>
                    <span>Notre équipe examine votre demande</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">3.</span>
                    <span>Vous recevez une réponse sous 48h</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">4.</span>
                    <span>Commencez à publier vos contenus !</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Formulaire de demande</CardTitle>
                <CardDescription>
                  Remplissez ce formulaire pour demander à devenir créateur sur la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Role Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="requestedRole">Type de créateur *</Label>
                    <Select value={formData.requestedRole} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-muted-foreground">{option.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Motivation */}
                  <div className="space-y-2">
                    <Label htmlFor="motivation">
                      Motivation * <span className="text-muted-foreground">(min. 50 caractères)</span>
                    </Label>
                    <Textarea
                      id="motivation"
                      name="motivation"
                      value={formData.motivation}
                      onChange={handleChange}
                      placeholder="Expliquez pourquoi vous souhaitez devenir créateur, votre expérience, vos objectifs..."
                      rows={6}
                      required
                      minLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.motivation.length}/50 caractères minimum
                    </p>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Présentez-vous brièvement, votre parcours, vos compétences..."
                      rows={4}
                    />
                  </div>

                  {/* Specialization */}
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Spécialisation</Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Ex: Développement personnel, Business, Technologie..."
                    />
                  </div>

                  {/* Portfolio URL */}
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio / Site web</Label>
                    <Input
                      id="portfolioUrl"
                      name="portfolioUrl"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={handleChange}
                      placeholder="https://votre-portfolio.com"
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input
                      id="linkedinUrl"
                      name="linkedinUrl"
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/votre-profil"
                    />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={isLoading || hasPendingRequest}
                      className="flex-1 gradient-gold text-background"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          Envoyer la demande
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={isLoading}
                    >
                      Annuler
                    </Button>
                  </div>

                  {hasPendingRequest && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Vous ne pouvez pas soumettre une nouvelle demande tant que votre demande précédente est en attente.
                      </AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
