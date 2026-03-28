import type { Metadata } from "next";
import { Lexend, Public_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

const lexend = Lexend({ 
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const publicSans = Public_Sans({ 
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DACRIBEL | Ethereal Vault",
  description: "Dacribel - Digital Gift Cards Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`dark ${lexend.variable} ${publicSans.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`font-body bg-background text-on-surface min-h-screen pb-32`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
