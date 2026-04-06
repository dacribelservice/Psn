import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DACRIBEL | Ethereal Vault",
  description: "Dacribel - Digital Gift Cards Store",
  icons: {
    icon: "/icon.png",
  },
  openGraph: {
    title: "DACRIBEL | Ethereal Vault",
    description: "Tienda digital de Gift Cards premium.",
    url: "https://dacribel.shop",
    siteName: "Dacribel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "es_CO",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-background text-on-surface min-h-screen pb-32 antialiased`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
