import React from 'react';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getActiveExtensions } from '@/config/extensions';

/**
 * 🛰️ EXTENSIONS DASHBOARD
 * 
 * Esta página lista todos los módulos activos. 
 * Actúa como el centro de control para el usuario o admin.
 */
export default function ExtensionsPage() {
  const extensions = getActiveExtensions();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <LayoutGrid className="text-[#f7be34]" />
            Módulos Dacribel
          </h1>
          <p className="text-[#c3c4e2]">Explora las funcionalidades adicionales de la plataforma.</p>
        </div>
        
        <Link 
          href="/"
          className="flex items-center gap-2 text-[#f7be34] hover:underline"
        >
          <ArrowLeft size={20} />
          Volver a la Tienda
        </Link>
      </div>

      {extensions.length === 0 ? (
        <div className="bg-[#191b23] border border-white/5 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid className="text-white/20 w-10 h-10" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No hay módulos activos</h2>
          <p className="text-[#c3c4e2]">Próximamente estaremos añadiendo nuevas funcionalidades experimentales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {extensions.map((ext) => (
            <Link 
              key={ext.id}
              href={ext.route}
              className="group bg-[#191b23] border border-white/5 hover:border-[#f7be34]/40 rounded-2xl p-6 transition-all hover:translate-y-[-4px] relative overflow-hidden"
            >
              {/* Badge de estado si es beta */}
              {ext.status === 'beta' && (
                <span className="absolute top-4 right-4 bg-[#f7be34]/10 text-[#f7be34] text-[10px] font-bold px-2 py-1 rounded border border-[#f7be34]/20 uppercase tracking-widest">
                  BETA
                </span>
              )}

              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-[#f7be34] group-hover:bg-[#f7be34]/10 transition-colors">
                <LayoutGrid size={24} /> 
                {/* Aquí idealmente usaríamos el icono del registro, pero necesitamos un mapeo de componentes */}
              </div>

              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#f7be34] transition-colors">
                {ext.name}
              </h3>
              <p className="text-sm text-[#c3c4e2]">
                {ext.description}
              </p>
              
              <div className="mt-8 flex items-center text-[#f7be34] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                INGRESAR AL MÓDULO →
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
