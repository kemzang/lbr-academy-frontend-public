// ============================================
// Layout Admin
// ============================================

'use client';

import { useState } from 'react';
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

const adminLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Utilisateurs', icon: Users },
  { href: '/admin/contents', label: 'Contenus', icon: BookOpen, badge: 15 },
  { href: '/admin/categories', label: 'Catégories', icon: FolderTree },
  { href: '/admin/subscriptions', label: 'Abonnements', icon: CreditCard },
  { href: '/admin/role-requests', label: 'Demandes de rôle', icon: UserCog, badge: 8 },
  { href: '/admin/analytics', label: 'Statistiques', icon: BarChart3 },
  { href: '/admin/settings', label: 'Paramètres', icon: Settings },
];

function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

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
              {link.badge && (
                <Badge className="ml-auto h-5 min-w-[20px] flex items-center justify-center text-xs bg-destructive">
                  {link.badge}
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
