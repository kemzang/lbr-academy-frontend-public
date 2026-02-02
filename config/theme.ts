// ============================================
// LA BIBLIOTHÈQUE DES ROIS - Configuration du Thème
// ============================================
// Ce fichier centralise toutes les couleurs et variables de style
// Pour modifier l'apparence de l'application, modifiez uniquement ce fichier

export const theme = {
  // Couleurs principales de la marque
  colors: {
    // Or royal - Couleur principale d'accent
    gold: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Principal
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    // Bleu royal profond
    royal: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A', // Principal
      950: '#172554',
    },
    // Couleurs sombres pour le fond
    dark: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A', // Background principal
      950: '#020617',
    },
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    royal: 'linear-gradient(135deg, #1E3A8A 0%, #1D4ED8 100%)',
    dark: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
    goldShine: 'linear-gradient(90deg, #FCD34D 0%, #F59E0B 50%, #FCD34D 100%)',
    heroOverlay: 'linear-gradient(180deg, rgba(15,23,42,0.8) 0%, rgba(15,23,42,0.95) 100%)',
  },
  
  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    gold: '0 0 30px rgba(245, 158, 11, 0.3)',
    goldHover: '0 0 40px rgba(245, 158, 11, 0.5)',
  },
  
  // Border radius
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Typographie
  fonts: {
    heading: '"Playfair Display", Georgia, serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  
  // Animations
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// Types de contenu avec leurs icônes et couleurs
export const contentTypes = {
  BOOK: { label: 'Livre', icon: 'BookOpen', color: '#F59E0B' },
  ARTICLE: { label: 'Article', icon: 'FileText', color: '#3B82F6' },
  FORMATION: { label: 'Formation', icon: 'GraduationCap', color: '#10B981' },
  SERIES: { label: 'Série', icon: 'Library', color: '#8B5CF6' },
  AUDIO: { label: 'Audio', icon: 'Headphones', color: '#EC4899' },
  VIDEO: { label: 'Vidéo', icon: 'Play', color: '#EF4444' },
} as const;

// Rôles utilisateur avec leurs badges
export const userRoles = {
  APPRENANT: { label: 'Apprenant', color: '#64748B', icon: 'User' },
  CREATEUR: { label: 'Créateur', color: '#F59E0B', icon: 'Palette' },
  ENTREPRENEUR: { label: 'Entrepreneur', color: '#10B981', icon: 'Briefcase' },
  HYBRIDE: { label: 'Hybride', color: '#8B5CF6', icon: 'Sparkles' },
  COACH: { label: 'Coach', color: '#3B82F6', icon: 'Award' },
  ADMIN: { label: 'Admin', color: '#EF4444', icon: 'Shield' },
} as const;

// Statuts de contenu
export const contentStatuses = {
  DRAFT: { label: 'Brouillon', color: '#64748B' },
  PENDING_REVIEW: { label: 'En attente', color: '#F59E0B' },
  APPROVED: { label: 'Publié', color: '#10B981' },
  REJECTED: { label: 'Refusé', color: '#EF4444' },
  ARCHIVED: { label: 'Archivé', color: '#6B7280' },
} as const;

export type ContentType = keyof typeof contentTypes;
export type UserRole = keyof typeof userRoles;
export type ContentStatus = keyof typeof contentStatuses;
