// ============================================
// Layout du Dashboard utilisateur
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Crown,
  LayoutDashboard,
  BookOpen,
  Heart,
  ShoppingBag,
  CreditCard,
  Bell,
  Settings,
  User,
  ChevronLeft,
  Menu,
  Plus,
  TrendingUp,
  Award,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useNotifications } from '@/hooks/use-notifications';

const sidebarLinks = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/my-contents', label: 'Mes contenus', icon: BookOpen, creatorOnly: true },
  { href: '/favorites', label: 'Favoris', icon: Heart },
  { href: '/purchases', label: 'Mes achats', icon: ShoppingBag },
  { href: '/subscriptions', label: 'Abonnement', icon: CreditCard },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/profile', label: 'Mon profil', icon: User },
  { href: '/settings', label: 'Paramètres', icon: Settings },
];

function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { unreadCount } = useNotifications();
  
  const isCreator = ['CREATEUR', 'ENTREPRENEUR', 'HYBRIDE', 'COACH', 'ADMIN'].includes(user?.role || '');
  const isAdmin = user?.role === 'ADMIN';
  
  const filteredLinks = sidebarLinks.filter(link => !link.creatorOnly || isCreator);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <Crown className="h-8 w-8 text-primary" />
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-gradient-gold leading-none">La Bibliothèque</h1>
            <p className="text-xs text-muted-foreground">des Rois</p>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-primary/30">
            <AvatarImage src={user?.profilePictureUrl} />
            <AvatarFallback className="bg-primary/20 text-primary">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block flex-1 min-w-0">
            <p className="font-medium truncate">{user?.username || 'Utilisateur'}</p>
            <Badge variant="outline" className="text-xs mt-0.5">
              {user?.roleDisplayName || 'Apprenant'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
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
              <span className="hidden lg:block">{link.label}</span>
              {link.href === '/notifications' && unreadCount > 0 && (
                <Badge className="ml-auto hidden lg:flex h-5 w-5 p-0 items-center justify-center text-xs">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Creator CTA */}
      {isCreator && (
        <div className="p-4 border-t border-border">
          <Button className="w-full gradient-gold text-background" asChild>
            <Link href="/my-contents/new">
              <Plus className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Nouveau contenu</span>
            </Link>
          </Button>
        </div>
      )}

      {/* Admin CTA */}
      {isAdmin && (
        <div className="p-4 border-t border-border">
          <Button className="w-full gradient-gold text-background" asChild>
            <Link href="/admin">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">Panel Admin</span>
              <span className="lg:hidden">Admin</span>
            </Link>
          </Button>
        </div>
      )}

      {/* Upgrade CTA */}
      {!isCreator && (
        <div className="p-4 border-t border-border">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="font-semibold text-sm hidden lg:block">Devenir Créateur</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 hidden lg:block">
              Partagez vos connaissances et gagnez de l&apos;argent.
            </p>
            <Button size="sm" className="w-full" variant="outline" asChild>
              <Link href="/become-creator">
                <TrendingUp className="h-4 w-4 lg:mr-2" />
                <span className="hidden lg:inline">En savoir plus</span>
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-20 lg:w-64 fixed left-0 top-0 bottom-0 border-r border-border bg-card/50">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center justify-between h-full px-4">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-7 w-7 text-primary" />
            <span className="font-bold text-gradient-gold">LBR</span>
          </Link>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="md:ml-20 lg:ml-64 min-h-screen">
        {/* Back to site button */}
        <div className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Retour au site
              </Link>
            </Button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
