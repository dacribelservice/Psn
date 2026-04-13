import React from 'react';
import { Mail, Send, ShieldCheck } from 'lucide-react';
import packageInfo from '../../package.json';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const appVersion = packageInfo.version;

  return (
    <footer className="w-full bg-[#0a0b10] border-t border-white/5 pt-12 pb-24 lg:pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        
        {/* Columna 1: Filosofía */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#f7be34]" size={24} />
            <span className="text-xl font-bold text-white tracking-widest">DACRIBEL</span>
          </div>
          <p className="text-[#c3c4e2] text-sm leading-relaxed max-w-sm">
            Nuestra misión es simple: conectar tus mundos favoritos con la mayor rapidez del mercado, 
            garantizando seguridad de bóveda y el precio más competitivo. En Dacribel, la confianza 
            es nuestro activo más valioso.
          </p>
        </div>

        {/* Columna 2: Contacto Directo */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Atención al Cliente</h4>
          <ul className="space-y-3">
            <li>
              <a 
                href="mailto:info@dacribel.shop" 
                className="flex items-center gap-3 text-[#c3c4e2] hover:text-[#f7be34] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#f7be34]/10">
                  <Mail size={16} />
                </div>
                info@dacribel.shop
              </a>
            </li>
            <li>
              <a 
                href="https://t.me/Dacribel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#c3c4e2] hover:text-[#f7be34] transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#f7be34]/10">
                  <Send size={16} />
                </div>
                @Dacribel (Telegram)
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información de Red */}
        <div className="space-y-4">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm">Estado del Sistema</h4>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-500 font-medium">Servidores Operativos</span>
          </div>
          <p className="text-[#535353] text-xs">
            Entrega instantánea habilitada 24/7. 
            Confirmaciones vía blockchain USDT (BEP20).
          </p>
        </div>
      </div>

      {/* Barra Inferior: Derechos y Versión */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#535353] text-[10px] uppercase tracking-[0.2em]">
          © {currentYear} DACRIBEL ASSETS. TODOS LOS DERECHOS RESERVADOS.
        </p>
        
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#535353] uppercase tracking-[0.2em]">
            App Version:
          </span>
          <span className="bg-white/5 text-[#f7be34] px-2 py-1 rounded text-[10px] font-bold border border-white/5">
            v{appVersion}
          </span>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
