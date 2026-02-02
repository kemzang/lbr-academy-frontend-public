// ============================================
// Admin - Gestion des abonnements - Connecté à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { 
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Crown,
  AlertCircle,
  Check,
  Star,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { subscriptionsService } from '@/lib/api';
import { SubscriptionPlan } from '@/types';
import { formatPrice } from '@/config/theme';
import { toast } from 'sonner';

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'XAF',
    durationDays: '30',
    features: '',
    isPopular: false,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await subscriptionsService.getPlans();
      setPlans(data);
    } catch (err) {
      console.error('Erreur chargement plans:', err);
      setError('Impossible de charger les plans.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (plan?: SubscriptionPlan) => {
    if (plan) {
      setSelectedPlan(plan);
      setFormData({
        name: plan.name,
        description: plan.description,
        price: plan.price.toString(),
        currency: plan.currency,
        durationDays: plan.durationDays.toString(),
        features: plan.features?.join('\n') || '',
        isPopular: plan.isPopular,
      });
    } else {
      setSelectedPlan(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        currency: 'XAF',
        durationDays: '30',
        features: '',
        isPopular: false,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.price) {
      toast.error('Nom et prix requis');
      return;
    }

    try {
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        currency: formData.currency,
        durationDays: parseInt(formData.durationDays),
        features: formData.features.split('\n').filter(f => f.trim()),
        isPopular: formData.isPopular,
      };

      if (selectedPlan) {
        await subscriptionsService.updatePlan(selectedPlan.id, data);
        toast.success('Plan mis à jour');
      } else {
        await subscriptionsService.createPlan(data);
        toast.success('Plan créé');
      }
      setDialogOpen(false);
      loadPlans();
    } catch (err) {
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleToggle = async (plan: SubscriptionPlan) => {
    try {
      await subscriptionsService.togglePlan(plan.id);
      setPlans(prev => prev.map(p => 
        p.id === plan.id ? { ...p, isActive: !p.isActive } : p
      ));
      toast.success(plan.isActive ? 'Plan désactivé' : 'Plan activé');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  if (error && plans.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Gestion des abonnements</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadPlans}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestion des abonnements</h1>
          <p className="text-muted-foreground">
            {plans.length} plan{plans.length > 1 ? 's' : ''} d'abonnement
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau plan
        </Button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      ) : plans.length > 0 ? (
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${!plan.isActive ? 'opacity-60' : ''} ${plan.isPopular ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-primary text-background text-xs font-bold px-3 py-1 rounded-bl-lg">
                  <Star className="h-3 w-3 inline mr-1" />
                  Populaire
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Crown className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.durationDays} jours</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDialog(plan)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggle(plan)}>
                        {plan.isActive ? 'Désactiver' : 'Activer'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center">
                  <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                </div>

                <p className="text-sm text-muted-foreground">{plan.description}</p>

                {plan.features && plan.features.length > 0 && (
                  <ul className="space-y-2">
                    {plan.features.slice(0, 4).map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-sm text-muted-foreground">
                        +{plan.features.length - 4} autres avantages
                      </li>
                    )}
                  </ul>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <span className="text-sm text-muted-foreground">Actif</span>
                  <Switch
                    checked={plan.isActive}
                    onCheckedChange={() => handleToggle(plan)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Crown className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Aucun plan d'abonnement</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre premier plan d'abonnement
          </p>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un plan
          </Button>
        </div>
      )}

      {/* Edit/Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? 'Modifier le plan' : 'Nouveau plan d\'abonnement'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Premium"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du plan"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (jours)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.durationDays}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationDays: e.target.value }))}
                  placeholder="30"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="features">Avantages (un par ligne)</Label>
              <Textarea
                id="features"
                value={formData.features}
                onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
                placeholder="Accès illimité&#10;Support prioritaire&#10;..."
                rows={5}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isPopular">Marquer comme populaire</Label>
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPopular: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPlan ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
