// ============================================
// Page mot de passe oublié
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { authService } from '@/lib/api/auth';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Veuillez entrer votre email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="animate-fade-up text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
          <CheckCircle className="h-8 w-8 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Email envoyé !</h1>
        <p className="text-muted-foreground mb-8">
          Si un compte existe avec l&apos;adresse <strong>{email}</strong>, 
          vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
        </p>
        
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/login">
              Retour à la connexion
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
          >
            Essayer avec une autre adresse
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <Link 
        href="/login" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour à la connexion
      </Link>
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Mot de passe oublié ?</h1>
        <p className="text-muted-foreground">
          Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              disabled={isLoading}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full gradient-gold text-background font-semibold h-12"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            'Envoyer le lien'
          )}
        </Button>
      </form>
    </div>
  );
}
