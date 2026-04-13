'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

/**
 * 🛡️ ESCUDO TÉRMICO (ERROR BOUNDARY)
 * 
 * Este componente captura fallos críticos en CUALQUIER extensión
 * y evita que la App completa colapse.
 */
export default function ExtensionError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Loguear el error para auditoría interna
    console.error('⚠️ Error en Extensión:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="text-red-500 w-8 h-8" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-2">Módulo en Mantenimiento</h2>
      <p className="text-[#c3c4e2] max-w-md mb-8">
        Lo sentimos, esta funcionalidad está experimentando dificultades técnicas temporales. 
        El resto de la tienda sigue operando con normalidad.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center justify-center gap-2 bg-[#f7be34] text-black px-6 py-3 rounded-lg font-bold hover:bg-[#f7be34]/90 transition-all"
        >
          <RefreshCcw size={18} />
          Reintentar Carga
        </button>
        
        <Link
          href="/"
          className="flex items-center justify-center gap-2 bg-[#191b23] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#282a32] transition-all"
        >
          <Home size={18} />
          Volver a la Tienda
        </Link>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-black/40 rounded border border-red-500/20 text-left max-w-2xl overflow-auto group">
          <p className="text-xs text-red-400 font-mono">DEBUG INFO:</p>
          <p className="text-xs text-red-300/60 font-mono mt-2">{error.message}</p>
        </div>
      )}
    </div>
  );
}
