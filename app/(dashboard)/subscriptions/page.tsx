// ============================================
// Page abonnement utilisateur
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, 
  Star, 
  Check, 
  Calendar,
  CreditCard,
  RefreshCw,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

// Mock data
const currentSubscription = {
  id: 1,
  plan: {
    name: 'Royal',
    price: 5000,
    currency: 'XAF',
  },
  status: 'ACTIVE',
  startDate: '2026-01-15',
  endDate: '2026-02-15',
  autoRenew: true,
  daysRemaining: 13,
};

const plans = [
  {
    id: 1,
    name: 'Gratuit',
    price: 0,
    currency: 'XAF',
    features: ['Accès aux contenus gratuits', 'Créer un compte', 'Acheter à l\'unité'],
    current: false,
  },
  {
    id: 2,
    name: 'Royal',
    price: 5000,
    currency: 'XAF',
    features: ['100+ contenus premium', 'Téléchargement hors-ligne', 'Support prioritaire', 'Accès anticipé'],
    current: true,
    popular: true,
  },
  {
    id: 3,
    name: 'Élite',
    price: 15000,
    currency: 'XAF',
    features: ['Accès illimité', 'Coaching mensuel', 'Masterclasses exclusives', 'Certificats', 'Communauté VIP'],
    current: false,
  },
];

const history = [
  { id: 1, plan: 'Royal', amount: 5000, date: '2026-01-15', status: 'Payé' },
  { id: 2, plan: 'Royal', amount: 5000, date: '2025-12-15', status: 'Payé' },
  { id: 3, plan: 'Royal', amount: 5000, date: '2025-11-15', status: 'Payé' },
];

export default function SubscriptionsPage() {
  const [autoRenew, setAutoRenew] = useState(currentSubscription.autoRenew);
  const progressPercent = ((30 - currentSubscription.daysRemaining) / 30) * 100;

  return (
    <div className="space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mon abonnement</h1>
        <p className="text-muted-foreground">
          Gérez votre abonnement et consultez votre historique
        </p>
      </div>

      {/* Current subscription */}
      <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl gradient-gold flex items-center justify-center">
                <Crown className="h-6 w-6 text-background" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Plan {currentSubscription.plan.name}
                  <Badge className="bg-green-500/20 text-green-500">Actif</Badge>
                </CardTitle>
                <CardDescription>
                  {currentSubscription.plan.price.toLocaleString()} {currentSubscription.plan.currency}/mois
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Période en cours</span>
              <span>{currentSubscription.daysRemaining} jours restants</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{new Date(currentSubscription.startDate).toLocaleDateString('fr-FR')}</span>
              <span>{new Date(currentSubscription.endDate).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Prochain renouvellement</p>
                <p className="font-medium">{new Date(currentSubscription.endDate).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Méthode de paiement</p>
                <p className="font-medium">Mobile Money</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/pricing">
                <Star className="h-4 w-4 mr-2" />
                Changer de plan
              </Link>
            </Button>
            
            {autoRenew ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Désactiver le renouvellement
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Désactiver le renouvellement automatique ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Votre abonnement restera actif jusqu&apos;au {new Date(currentSubscription.endDate).toLocaleDateString('fr-FR')}, 
                      mais ne sera pas renouvelé automatiquement.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => setAutoRenew(false)}>
                      Confirmer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button variant="outline" className="flex-1" onClick={() => setAutoRenew(true)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Activer le renouvellement
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plans comparison */}
      <div>
        <h2 className="text-xl font-bold mb-4">Changer de plan</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                'relative',
                plan.current && 'border-primary',
                plan.popular && !plan.current && 'border-primary/50'
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-gold text-background">
                  Populaire
                </Badge>
              )}
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <p className="text-2xl font-bold mb-4">
                  {plan.price === 0 ? 'Gratuit' : `${plan.price.toLocaleString()} XAF`}
                  {plan.price > 0 && <span className="text-sm font-normal text-muted-foreground">/mois</span>}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <Button disabled className="w-full">Plan actuel</Button>
                ) : (
                  <Button 
                    variant={plan.popular ? 'default' : 'outline'} 
                    className={cn('w-full', plan.popular && 'gradient-gold text-background')}
                  >
                    {plan.price > currentSubscription.plan.price ? 'Passer à ' : 'Changer pour '}{plan.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">Plan {payment.plan}</p>
                  <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{payment.amount.toLocaleString()} XAF</p>
                  <Badge variant="outline" className="text-green-500 border-green-500">{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
