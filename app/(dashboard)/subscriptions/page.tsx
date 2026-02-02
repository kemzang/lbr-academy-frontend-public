// ============================================
// Page des abonnements utilisateur - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Calendar,
  AlertCircle,
  Check,
  Clock,
  CreditCard,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { subscriptionsService } from '@/lib/api';
import { UserSubscription, SubscriptionPlan } from '@/types';
import { formatPrice, formatRelativeDate } from '@/config/theme';
import { toast } from 'sonner';

export default function SubscriptionsPage() {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [subData, plansData] = await Promise.all([
        subscriptionsService.getMySubscription().catch(() => null),
        subscriptionsService.getPlans().catch(() => []),
      ]);
      
      setSubscription(subData);
      setPlans(plansData);
    } catch (err) {
      console.error('Erreur chargement abonnements:', err);
      setError('Impossible de charger les informations d\'abonnement.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!subscription) return;
    
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;

    try {
      await subscriptionsService.cancel();
      toast.success('Abonnement annulé');
      loadData();
    } catch (err) {
      toast.error('Erreur lors de l\'annulation');
    }
  };

  const handleSubscribe = async (planId: number) => {
    try {
      await subscriptionsService.subscribe(planId);
      toast.success('Abonnement activé avec succès !');
      loadData();
    } catch (err) {
      toast.error('Erreur lors de l\'abonnement');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-48" />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mon Abonnement</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={loadData}>Réessayer</Button>
      </div>
    );
  }

  // Calculer les jours restants
  const daysRemaining = subscription 
    ? Math.max(0, Math.ceil((new Date(subscription.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;
  const totalDays = subscription?.plan?.durationDays || 30;
  const progress = subscription ? ((totalDays - daysRemaining) / totalDays) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Mon Abonnement</h1>
        <p className="text-muted-foreground">
          Gérez votre abonnement et découvrez nos offres
        </p>
      </div>

      {/* Current Subscription */}
      {subscription && subscription.status === 'ACTIVE' ? (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full gradient-gold flex items-center justify-center">
                  <Crown className="h-7 w-7 text-background" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{subscription.plan?.name}</CardTitle>
                  <CardDescription>Abonnement actif</CardDescription>
                </div>
              </div>
              <Badge className="gradient-gold text-background">Actif</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Période en cours</span>
                <span className="font-medium">{daysRemaining} jours restants</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Details */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">
                    {new Date(subscription.startDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">
                    {new Date(subscription.endDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Montant</p>
                  <p className="font-medium">{formatPrice(subscription.plan?.price)}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {subscription.plan?.features && (
              <div>
                <p className="font-medium mb-3">Avantages inclus</p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {subscription.plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleCancel}>
                Annuler l'abonnement
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Crown className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun abonnement actif</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Choisissez un abonnement ci-dessous pour accéder à tous les contenus premium 
              de La Bibliothèque des Rois.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {subscription ? 'Changer d\'abonnement' : 'Nos offres'}
        </h2>
        
        {plans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, index) => {
              const isCurrentPlan = subscription?.plan?.id === plan.id;
              const isFeatured = index === 1; // Le plan du milieu est mis en avant
              
              return (
                <Card 
                  key={plan.id}
                  className={`relative overflow-hidden transition-all hover:scale-105 ${
                    isCurrentPlan ? 'border-primary ring-2 ring-primary' : ''
                  } ${isFeatured && !isCurrentPlan ? 'border-primary/50' : ''}`}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-primary text-background text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Plan actuel
                    </div>
                  )}
                  {isFeatured && !isCurrentPlan && (
                    <div className="absolute top-0 right-0 gradient-gold text-background text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Populaire
                    </div>
                  )}

                  <CardHeader className="text-center pb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isFeatured ? 'gradient-gold' : 'bg-muted'
                    }`}>
                      {index === 0 && <Sparkles className={`h-6 w-6 ${isFeatured ? 'text-background' : ''}`} />}
                      {index === 1 && <Crown className={`h-6 w-6 ${isFeatured ? 'text-background' : ''}`} />}
                      {index === 2 && <Crown className={`h-6 w-6 ${isFeatured ? 'text-background' : ''}`} />}
                    </div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-muted-foreground">/{plan.durationDays} jours</span>
                    </div>

                    {plan.features && (
                      <ul className="space-y-2">
                        {plan.features.slice(0, 5).map((feature, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button 
                      className={`w-full ${isFeatured && !isCurrentPlan ? 'gradient-gold text-background' : ''}`}
                      variant={isCurrentPlan ? 'secondary' : (isFeatured ? 'default' : 'outline')}
                      disabled={isCurrentPlan}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isCurrentPlan ? 'Plan actuel' : 'Choisir ce plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun plan disponible pour le moment</p>
          </div>
        )}
      </div>

      {/* Link to pricing page for more info */}
      <div className="text-center">
        <Button variant="link" asChild>
          <Link href="/pricing">
            Voir tous les détails des offres
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
