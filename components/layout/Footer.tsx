import React from 'react';
import { Mail, Send, ShieldCheck, Lock } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import packageInfo from '../../package.json';

const Footer = () => {
  const { language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const appVersion = packageInfo.version;

  const content = {
    es: {
      philosophyTitle: "Nuestra Visión",
      philosophyBody: "Dacribel es una plataforma digital segura, rápida y eficiente para adquirir tarjetas de regalo de PlayStation, entre otras, a nivel global. Trabajamos constantemente para mejorar nuestro servicio y brindar la mejor experiencia.",
      contactTitle: "Atención al Cliente",
      statusTitle: "Estado del Sistema",
      operational: "Servidores Operativos",
      securePayments: "Pagos 100% Seguros",
      delivery: "Entrega instantánea 24/7 vía USDT (BEP20).",
      rights: "TODOS LOS DERECHOS RESERVADOS."
    },
    en: {
      philosophyTitle: "Our Vision",
      philosophyBody: "Dacribel is a secure, fast, and efficient digital platform for purchasing PlayStation gift cards, among others, worldwide. We constantly work to improve our service and provide the best experience.",
      contactTitle: "Customer Support",
      statusTitle: "System Status",
      operational: "Servers Operational",
      securePayments: "100% Secure Payments",
      delivery: "Instant 24/7 delivery via USDT (BEP20).",
      rights: "ALL RIGHTS RESERVED."
    }
  };

  const t = content[language === 'es' ? 'es' : 'en'];

  return (
    <footer className="w-full bg-[#0a0b10] border-t border-white/5 pt-8 pb-12 lg:pb-8 px-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
        
        {/* Columna 1: Filosofía */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[#f7be34]/80" size={20} />
            <span className="text-lg font-black text-white/70 tracking-widest uppercase">DACRIBEL</span>
          </div>
          <p className="text-[#5b5d71] text-xs leading-relaxed max-w-sm font-medium">
            {t.philosophyBody}
          </p>
        </div>

        {/* Columna 2: Contacto Directo */}
        <div className="space-y-4">
          <h4 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">{t.contactTitle}</h4>
          <ul className="space-y-2">
            <li>
              <a 
                href="mailto:info@dacribel.shop" 
                className="flex items-center gap-3 text-[#5b5d71] hover:text-[#f7be34] transition-colors group text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#f7be34]/10">
                  <Mail size={14} />
                </div>
                info@dacribel.shop
              </a>
            </li>
            <li>
              <a 
                href="https://t.me/Dacribel" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[#5b5d71] hover:text-[#f7be34] transition-colors group text-xs"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#f7be34]/10">
                  <Send size={14} />
                </div>
                @Dacribel (Telegram)
              </a>
            </li>
          </ul>
        </div>

        {/* Columna 3: Información de Seguridad y Estado */}
        <div className="space-y-4">
          <h4 className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">{t.statusTitle}</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-500/80 uppercase tracking-tighter">{t.operational}</span>
            </div>
            
            <div className="flex items-center gap-2 py-2 px-3 bg-[#f7be34]/5 border border-[#f7be34]/10 rounded-xl w-fit">
              <Lock className="text-[#f7be34]" size={12} />
              <span className="text-[#f7be34] text-[10px] font-black uppercase tracking-widest">{t.securePayments}</span>
            </div>

            <p className="text-[#454759] text-[10px] leading-tight font-bold italic">
              {t.delivery}
            </p>
          </div>
        </div>
      </div>

      {/* Barra Inferior: Derechos y Versión */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#3c3e4f] text-[9px] font-black uppercase tracking-[0.3em]">
          © {currentYear} DACRIBEL ASSETS. {t.rights}
        </p>
        
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-[#3c3e4f] uppercase tracking-[0.3em] font-bold">
            Version:
          </span>
          <span className="bg-white/5 text-[#f7be34]/60 px-2 py-0.5 rounded text-[9px] font-black border border-white/5">
            {appVersion}
          </span>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
