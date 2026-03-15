// ============================================
// Providers globaux de l'application
// ============================================

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useAuthStore } from '@/stores/auth-store';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // NE PLUS appeler checkAuth automatiquement
  // const checkAuth = useAuthStore((s) => s.checkAuth);
  // const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  // const [hasChecked, setHasChecked] = useState(false);

  // useEffect(() => {
  //   // Ne vérifier qu'une seule fois au montage initial
  //   if (!hasChecked) {
  //     checkAuth();
  //     setHasChecked(true);
  //   }
  // }, [checkAuth, hasChecked]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </ThemeProvider>
  );
}

export default Providers;
