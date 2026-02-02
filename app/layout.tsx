import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "La Bibliothèque des Rois | Savoir, Héritage, Pouvoir",
  description: "Plateforme communautaire intellectuelle et créative. Découvrez des livres, formations, articles et contenus de qualité créés par des experts.",
  keywords: "bibliothèque, livres, formations, articles, apprentissage, créateurs, Afrique",
  authors: [{ name: "La Bibliothèque des Rois" }],
  openGraph: {
    title: "La Bibliothèque des Rois",
    description: "Plateforme communautaire intellectuelle et créative",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
