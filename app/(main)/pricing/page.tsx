// ============================================
// Page des tarifs/abonnements - Connectée à l'API
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Crown, 
  Check, 
  Sparkles,
  Zap,
  Star,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { SubscriptionPlan } from '@/types';
import { subscriptionsService } from '@/lib/api';
import { useAuthStore } from '@/stores/auth-store';
import { formatPrice } from '@/config/theme';
import { toast } from 'sonner';

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      setError('Impossible de charger les abonnements.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async (planId: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      await subscriptionsService.subscribe(planId);
      toast.success('Abonnement activé avec succès !');
      router.push('/dashboard');
    } catch (err) {
      toast.error('Erreur lors de l\'abonnement');
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('premium') || name.includes('roi')) return Crown;
    if (name.includes('pro') || name.includes('avancé')) return Zap;
    return Star;
  };

  const getPlanColor = (index: number) => {
    const colors = [
      { bg: 'bg-muted', border: 'border-border', text: 'text-foreground' },
      { bg: 'bg-primary/10', border: 'border-primary', text: 'text-primary', featured: true },
      { bg: 'bg-secondary/10', border: 'border-secondary', text: 'text-secondary' },
    ];
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <Alert variant="destructive" className="max-w-xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="text-center mt-4">
            <Button onClick={loadPlans}>Réessayer</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 gradient-gold text-background">
            <Sparkles className="h-3 w-3 mr-1" />
            Abonnements
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Investissez dans votre <span className="text-gradient-gold">savoir</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Choisissez l'abonnement qui correspond à vos ambitions et accédez 
            à des contenus exclusifs créés par les meilleurs experts.
          </p>
        </div>

        {/* Plans */}
        {plans.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => {
              const PlanIcon = getPlanIcon(plan.name);
              const colors = getPlanColor(index);
              const isFeatured = colors.featured;

              return (
                <Card 
                  key={plan.id}
                  className={cn(
                    'relative overflow-hidden transition-all duration-300 hover:scale-105',
                    colors.border,
                    isFeatured && 'ring-2 ring-primary shadow-lg'
                  )}
                >
                  {isFeatured && (
                    <div className="absolute top-0 right-0 gradient-gold text-background text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Populaire
                    </div>
                  )}

                  <CardHeader className={cn('text-center', colors.bg)}>
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4',
                      isFeatured ? 'gradient-gold' : 'bg-muted'
                    )}>
                      <PlanIcon className={cn('h-8 w-8', isFeatured ? 'text-background' : 'text-foreground')} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-muted-foreground">/{plan.durationDays} jours</span>
                    </div>

                    {plan.features && (
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    <Button 
                      className={cn(
                        'w-full',
                        isFeatured ? 'gradient-gold text-background' : ''
                      )}
                      variant={isFeatured ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan.id)}
                    >
                      {isFeatured ? 'Commencer maintenant' : 'Choisir ce plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <Crown className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun abonnement disponible</h3>
            <p className="text-muted-foreground">
              Les abonnements seront bientôt disponibles.
            </p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Puis-je annuler mon abonnement à tout moment ?',
                a: 'Oui, vous pouvez annuler votre abonnement quand vous le souhaitez. Vous conserverez l\'accès jusqu\'à la fin de votre période payée.',
              },
              {
                q: 'Les contenus achetés restent-ils accessibles après l\'abonnement ?',
                a: 'Oui, tous les contenus que vous achetez individuellement restent accessibles à vie, même sans abonnement actif.',
              },
              {
                q: 'Comment fonctionne le paiement ?',
                a: 'Nous acceptons les paiements par Mobile Money et carte bancaire. Tous les paiements sont sécurisés.',
              },
            ].map((faq, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{faq.q}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
