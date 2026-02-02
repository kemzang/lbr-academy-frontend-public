// ============================================
// Footer de l'application
// ============================================

import Link from 'next/link';
import { Crown, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  platform: {
    title: 'Plateforme',
    links: [
      { label: 'Explorer', href: '/explorer' },
      { label: 'Catégories', href: '/categories' },
      { label: 'Créateurs', href: '/creators' },
      { label: 'Abonnements', href: '/pricing' },
    ],
  },
  company: {
    title: 'La Bibliothèque',
    links: [
      { label: 'À propos', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Carrières', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'Centre d\'aide', href: '/help' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Devenir créateur', href: '/become-creator' },
      { label: 'Partenariats', href: '/partnerships' },
    ],
  },
  legal: {
    title: 'Légal',
    links: [
      { label: 'Conditions d\'utilisation', href: '/terms' },
      { label: 'Politique de confidentialité', href: '/privacy' },
      { label: 'Mentions légales', href: '/legal' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Mail, href: 'mailto:contact@lbr.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border">
      {/* Main footer */}
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-bold text-gradient-gold">La Bibliothèque</h3>
                <p className="text-xs text-muted-foreground">des Rois</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              Plateforme communautaire intellectuelle et créative. 
              Savoir, Héritage, Pouvoir.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Bottom bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} La Bibliothèque des Rois. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Fait avec <Heart className="h-4 w-4 text-destructive fill-destructive" /> au Cameroun
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
