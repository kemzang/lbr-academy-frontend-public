// ============================================
// En-tête de section réutilisable
// ============================================

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ 
  title, 
  subtitle, 
  href, 
  linkLabel = 'Voir tout',
  className,
  align = 'left'
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8',
      align === 'center' && 'sm:flex-col sm:items-center text-center',
      className
    )}>
      <div>
        <h2 className="text-2xl md:text-3xl font-bold mb-1">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      
      {href && (
        <Button variant="ghost" asChild className="group self-start sm:self-auto">
          <Link href={href} className="flex items-center gap-2">
            {linkLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default SectionHeader;
