// ============================================
// Layout d'authentification
// ============================================

import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/30 via-background to-background" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <Link href="/" className="flex items-center gap-3 mb-12">
            <Crown className="h-12 w-12 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-gradient-gold">La Bibliothèque</h1>
              <p className="text-sm text-muted-foreground">des Rois</p>
            </div>
          </Link>
          
          <div className="max-w-md text-center">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-gradient-gold">Savoir.</span>{' '}
              <span className="text-foreground">Héritage.</span>{' '}
              <span className="text-secondary">Pouvoir.</span>
            </h2>
            <p className="text-muted-foreground">
              Rejoignez une communauté d&apos;esprits brillants et accédez à une collection 
              exclusive de connaissances qui transformeront votre vie.
            </p>
          </div>
          
          {/* Testimonial */}
          <div className="mt-12 p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 max-w-md">
            <p className="text-sm italic text-muted-foreground mb-4">
              &quot;La Bibliothèque des Rois a complètement changé ma façon d&apos;apprendre. 
              Les contenus sont d&apos;une qualité exceptionnelle.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                M
              </div>
              <div>
                <p className="text-sm font-medium">Marie Kouam</p>
                <p className="text-xs text-muted-foreground">Entrepreneure, Douala</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Crown className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-lg font-bold text-gradient-gold">La Bibliothèque</h1>
              <p className="text-xs text-muted-foreground">des Rois</p>
            </div>
          </Link>
          
          {children}
        </div>
      </div>
    </div>
  );
}
