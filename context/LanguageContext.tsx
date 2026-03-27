"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'es' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Dictionaries
const translations = {
  es: {
    store: 'Tienda',
    orders: 'Mis Pedidos',
    security: 'Seguridad',
    settings: 'Ajustes',
    vault_access: 'Acceso a la Bóveda',
    verified_member: 'Miembro Verificado',
    featured_offer: 'Oferta Destacada',
    unleash_power: 'LIBERA EL PODER DEL JUEGO',
    get_credits: 'Obtener Créditos',
    search_placeholder: 'Buscar tarjetas, juegos, suscripciones...',
    best_sellers: 'Más Vendidos',
    view_all: 'Ver Todos',
    my_profile: 'Mi perfil',
    admin: 'Admin',
    affiliate_program: 'Programa de afiliados',
    terms_conditions: 'Términos y condiciones',
    about_us: 'Sobre nosotros',
    delete_account: 'Eliminar Cuenta',
    logout: 'Cerrar Sesión',
    language: 'Idioma',
    english: 'Inglés',
    spanish: 'Español'
  },
  en: {
    store: 'Store',
    orders: 'Orders',
    security: 'Security',
    settings: 'Settings',
    vault_access: 'Vault Access',
    verified_member: 'Verified Member',
    featured_offer: 'Featured Offer',
    unleash_power: 'UNLEASH THE POWER OF PLAY',
    get_credits: 'Get Credits',
    search_placeholder: 'Search gift cards, games, subscriptions...',
    best_sellers: 'Best Sellers',
    view_all: 'See All',
    my_profile: 'My profile',
    admin: 'Admin',
    affiliate_program: 'Affiliate program',
    terms_conditions: 'Terms and conditions',
    about_us: 'About us',
    delete_account: 'Delete Account',
    logout: 'Logout',
    language: 'Language',
    english: 'English',
    spanish: 'Spanish'
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    const savedLang = localStorage.getItem('dacribel_lang') as Language;
    if (savedLang) setLanguageState(savedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('dacribel_lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['es']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
