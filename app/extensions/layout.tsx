import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dacribel | Extensions Sandbox',
  description: 'Módulos experimentales y adicionales de la plataforma Dacribel.',
};

/**
 * 🛡️ EXTENSIONS LAYOUT (EL BÚNKER DE MÓDULOS)
 * 
 * Este layout envuelve a todos los módulos enchufables.
 * Su objetivo es aislar el entorno de renderizado de las extensiones
 * del core de la tienda y el admin.
 */
export default function ExtensionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#11131b] text-white">
      {/* 
          Aquí podríamos incluir una navegación específica para extensiones 
          o simplemente dejar que cada extensión maneje su UI.
      */}
      <main className="relative z-10">
        {children}
      </main>
      
      {/* Efectos visuales de fondo compartidos para mantener la estética Vault */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f7be34]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#c3c4e2]/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
