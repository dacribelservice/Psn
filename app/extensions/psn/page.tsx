'use client';

import React from 'react';
import { Gamepad2, Globe, TrendingDown, ChevronRight, Info } from 'lucide-react';
import { Footer } from '@/components/layout/Footer';
import { motion } from 'framer-motion';

export default function PSNTrackerPage() {
  return (
    <div className="min-h-screen bg-[#0a0b10] text-[#c3c4e2]">
      <main className="pt-24 px-4 md:px-6 max-w-7xl mx-auto lg:ml-64 lg:px-12 pb-32">
        {/* Header Hero */}
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#11131b] to-[#0a0b10] border border-white/5 p-8 md:p-12 mb-12">
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-3 text-[#f7be34] mb-4">
              <Gamepad2 size={24} />
              <span className="uppercase tracking-[0.3em] font-black text-xs">Módulo Alpha</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              PSN <span className="text-[#f7be34]">Tracker</span>
            </h1>
            <p className="text-[#5b5d71] text-lg font-medium leading-relaxed mb-8">
              Bienvenido a la Estrategia "Flor de Mariposa". Aquí monitorearemos los precios 
              globales de PlayStation Store para encontrar las mejores oportunidades de ahorro.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <Globe size={14} className="text-[#f7be34]" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Multi-Región</span>
              </div>
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                <TrendingDown size={14} className="text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Alertas de Oferta</span>
              </div>
            </div>
          </div>

          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#f7be34]/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        </section>

        {/* Phase Info Card */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6 flex items-start gap-4 mb-12">
          <Info className="text-blue-500 shrink-0" size={20} />
          <div>
            <h4 className="text-blue-400 font-bold mb-1">Fase Actual: Conceptualización Alpha</h4>
            <p className="text-blue-400/60 text-xs">
              Estamos configurando los cimientos de este módulo. Próximamente verás aquí el comparador 
              de precios impulsado por Gemini AI.
            </p>
          </div>
        </div>

        {/* Placeholder for Price Wall */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-40 grayscale pointer-events-none">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-6 h-64 border-dashed animate-pulse flex flex-col justify-end">
              <div className="w-full h-8 bg-white/5 rounded-lg mb-4" />
              <div className="w-1/2 h-4 bg-white/5 rounded-lg" />
            </div>
          ))}
        </div>

        <Footer />
      </main>
    </div>
  );
}
