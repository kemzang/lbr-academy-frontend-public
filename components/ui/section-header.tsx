// ============================================
// Composant SectionHeader - En-tête de section réutilisable
// ============================================

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkText?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkText = 'Voir tout',
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div 
      className={cn(
        'flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8',
        align === 'center' && 'items-center text-center md:flex-col',
        className
      )}
    >
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-xl">
            {subtitle}
          </p>
        )}
      </div>
      
      {href && (
        <Button variant="ghost" className="group" asChild>
          <Link href={href}>
            {linkText}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      )}
    </div>
  );
}
