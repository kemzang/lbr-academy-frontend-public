// ============================================
// Page des abonnements
// ============================================

import { Check, Crown, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const plans = [
  {
    name: 'Gratuit',
    description: 'Pour découvrir la plateforme',
    price: 0,
    currency: 'XAF',
    period: '/mois',
    features: [
      'Accès aux contenus gratuits',
      'Créer un compte et un profil',
      'Commenter les contenus',
      'Ajouter aux favoris',
      'Acheter des contenus à l\'unité',
    ],
    cta: 'Commencer gratuitement',
    popular: false,
  },
  {
    name: 'Royal',
    description: 'Pour les apprenants sérieux',
    price: 5000,
    currency: 'XAF',
    period: '/mois',
    features: [
      'Tout le plan Gratuit',
      'Accès à 100+ contenus premium',
      'Téléchargement hors-ligne',
      'Support prioritaire',
      'Accès anticipé aux nouveautés',
      'Badges et récompenses',
    ],
    cta: 'Devenir Royal',
    popular: true,
    icon: Crown,
  },
  {
    name: 'Élite',
    description: 'Pour les leaders ambitieux',
    price: 15000,
    currency: 'XAF',
    period: '/mois',
    features: [
      'Tout le plan Royal',
      'Accès illimité à tous les contenus',
      'Sessions de coaching mensuelles',
      'Accès aux masterclasses exclusives',
      'Certificats de formation',
      'Communauté privée d\'élite',
      'Invitations aux événements VIP',
    ],
    cta: 'Rejoindre l\'Élite',
    popular: false,
    icon: Star,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 gradient-gold text-background">
            <Zap className="h-3 w-3 mr-1" />
            Abonnements
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Investissez dans votre <span className="text-gradient-gold">savoir</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Choisissez le plan qui correspond à vos ambitions. 
            Annulez à tout moment, sans engagement.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={cn(
                'relative animate-fade-up',
                plan.popular && 'border-primary shadow-lg shadow-primary/20 scale-105'
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-gold text-background px-4 py-1">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Populaire
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                {plan.icon && (
                  <div className="mx-auto mb-4 h-14 w-14 rounded-2xl gradient-gold flex items-center justify-center">
                    <plan.icon className="h-7 w-7 text-background" />
                  </div>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {plan.price === 0 ? 'Gratuit' : plan.price.toLocaleString()}
                  </span>
                  {plan.price > 0 && (
                    <>
                      <span className="text-lg text-muted-foreground ml-1">{plan.currency}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </>
                  )}
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={cn(
                    'w-full',
                    plan.popular ? 'gradient-gold text-background' : ''
                  )}
                  variant={plan.popular ? 'default' : 'outline'}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions fréquentes</h2>
          
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-2">Puis-je changer de plan à tout moment ?</h3>
              <p className="text-muted-foreground">
                Oui, vous pouvez upgrader ou downgrader votre abonnement à tout moment. 
                Le changement prend effet immédiatement et le montant est ajusté au prorata.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-2">Comment fonctionne le paiement ?</h3>
              <p className="text-muted-foreground">
                Nous acceptons Mobile Money (Orange Money, MTN MoMo) et les cartes bancaires. 
                Le paiement est sécurisé et automatiquement renouvelé chaque mois.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-2">Y a-t-il un engagement ?</h3>
              <p className="text-muted-foreground">
                Non, il n&apos;y a aucun engagement. Vous pouvez annuler votre abonnement 
                à tout moment depuis votre espace personnel.
              </p>
            </div>
            
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-2">Que se passe-t-il si j&apos;annule ?</h3>
              <p className="text-muted-foreground">
                Vous conservez l&apos;accès jusqu&apos;à la fin de votre période d&apos;abonnement. 
                Les contenus achetés à l&apos;unité restent accessibles indéfiniment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
