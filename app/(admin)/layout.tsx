// ============================================
// Layout Admin
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Crown,
  LayoutDashboard,
  Users,
  BookOpen,
  FolderTree,
  CreditCard,
  UserCog,
  Shield,
  ChevronLeft,
  Menu,
  Settings,
  BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/stores/auth-store';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { adminService } from '@/lib/api/admin';

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/contents', label: 'Contenus', icon: BookOpen, badgeKey: 'pendingContents' },
  { href: '/admin/categories', label: 'Catégories', icon: FolderTree },
  { href: '/admin/subscriptions', label: 'Abonnements', icon: CreditCard },
  { href: '/admin/role-requests', label: 'Demandes de rôle', icon: UserCog, badgeKey: 'pendingRoleUpgrades' },
  { href: '/admin/analytics', label: 'Statistiques', icon: BarChart3 },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [badges, setBadges] = useState<{ pendingContents?: number; pendingRoleUpgrades?: number }>({});

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const stats = await adminService.getStats();
        setBadges({
          pendingContents: stats.pendingContentApprovals || 0,
          pendingRoleUpgrades: stats.pendingRoleUpgrades || 0,
        });
      } catch (err) {
        // Ignorer silencieusement les erreurs de chargement des badges
        // La gestion de l'authentification est faite au niveau du layout
        console.debug('Impossible de charger les badges:', err);
      }
    };
    loadBadges();
    // Rafraîchir toutes les 60 secondes (réduit la fréquence)
    const interval = setInterval(loadBadges, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn('flex flex-col h-full bg-card', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl gradient-gold flex items-center justify-center">
            <Shield className="h-5 w-5 text-background" />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-bold leading-none">LBR Admin</h1>
            <p className="text-xs text-muted-foreground">Panel d&apos;administration</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <link.icon className="h-5 w-5 flex-shrink-0" />
              <span className="hidden lg:block flex-1">{link.label}</span>
              {link.badgeKey && badges[link.badgeKey as keyof typeof badges] && badges[link.badgeKey as keyof typeof badges]! > 0 && (
                <Badge className="ml-auto h-5 min-w-[20px] flex items-center justify-center text-xs bg-destructive">
                  {badges[link.badgeKey as keyof typeof badges]}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">
            <Crown className="h-4 w-4 mr-2" />
            <span className="hidden lg:inline">Retour au site</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Attendre que le composant soit monté
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    console.log('🔍 Admin Layout - Vérification:', {
      isAuthenticated,
      hasUser: !!user,
      userRole: user?.role
    });

    // Vérifier le localStorage directement - valider que c'est un vrai JWT
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('lbr_access_token') : null;
    const hasToken = storedToken && storedToken !== 'undefined' && storedToken !== 'null' && storedToken.split('.').length === 3;
    
    if (!hasToken) {
      console.log('❌ Pas de token valide, redirection login');
      // Nettoyer le token invalide s'il existe
      if (storedToken) localStorage.removeItem('lbr_access_token');
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    // Si on a un user et qu'il n'est pas admin
    if (user && user.role !== 'ADMIN') {
      console.log('❌ Pas admin, redirection dashboard');
      router.push('/dashboard');
    }
  }, [isReady, isAuthenticated, user, router]);

  // Pendant le chargement initial
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  // Vérifier le token - valider que c'est un vrai JWT
  const storedTokenRender = typeof window !== 'undefined' ? localStorage.getItem('lbr_access_token') : null;
  const hasTokenRender = storedTokenRender && storedTokenRender !== 'undefined' && storedTokenRender !== 'null' && storedTokenRender.split('.').length === 3;
  if (!hasTokenRender) {
    return null;
  }

  // Si on a un user et qu'il n'est pas admin
  if (user && user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-20 lg:w-64 fixed left-0 top-0 bottom-0 border-r border-border">
        <AdminSidebar />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-gold flex items-center justify-center">
              <Shield className="h-4 w-4 text-background" />
            </div>
            <span className="font-bold">Admin</span>
          </Link>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <AdminSidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-20 lg:ml-64 min-h-screen pt-16 md:pt-0">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
