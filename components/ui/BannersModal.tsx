"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BannersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BannersModal = ({ isOpen, onClose }: BannersModalProps) => {
  const activeBanners = [
    {
      id: 1,
      title: "Spring Crypto Rewards",
      url: "/promo/rewards-2024",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA7d7-VKP-FzwMe9pVZSPJh3Nf0YIqhphU4mmmdClUeCb0GiQm2Lu6jzl_FTKPOW0ihXvkf3QFg_7YPY3GQyABIwXrzF0UpG8VL5vqJqTGWKb36i476NLlKo69QdnPfg15FdmP3-qEbtbFNImYy4eiM4_-xQK6haY9CuTgSjhdxQKEQXaNJTtVkxwXXOmZem5kHPHsRu3SI1r2Q9xTTCZuS-yGMV1ZFwf4zgzDBUEqreNT09Hx8dGmo9jaiSKzktiud65mPh5pgJ6s"
    },
    {
      id: 2,
      title: "New Gift Card Arrival",
      url: "/store/new-arrivals",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfjfwqWNT5SmG4thbVe-dnBpbJhxsEFYfboN8q4p4MJ1KjKe2KDk-mPrZ3VNBPinikU_qZcQ33Vnc3E3mETrFCMYnYm1J7g12SFgSv6oNOePuuxrS4EDagKqJM9ZBWaCxIfBEMqCpR2cX833dqRPI2hNf0qQJIAFuirBaZp3IbB-P_yBinBoPZim26qsP9R6MMsQpkedG4YnUreXl_82vkrImlQyFth-gwkMhbPxXP0jhy68H0Wz6LQVLcZhf_llc3Vn3UH9N4Ijur"
    },
    {
      id: 3,
      title: "USDT Flash Sale",
      url: "/sale/flash-usdt",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDN6gGyTRHaw0dbqNWHh4L7_nIL3YcZbn8uTp38jaHgLxat6B1O7qh54tuxrryrpEZHhiVzJs0nWS9OQtVAAMBdJW-v-1AZr_NQ3RO0_lPVXPlDuEsG8-t0VXawwH7fHFHsQZKr26HeNDj_3-V1unygZkVd-pre3Cn5LbbjBU9WSvNYjv7F3FmpyAHd-XaMx4TjGZOEApALMul83LjXcDqmg-xK4Y1-m8IBsUXyl0O5Y0I9KC_IR0B-8akVINSUL4xTT2PcZl3AEOz_"
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0c0e15]/80 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative z-10 w-full max-w-2xl bg-[#191b23]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <header className="flex justify-between items-center px-6 h-16 w-full sticky top-0 z-50 bg-[#1d1f27]/60 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-3">
                <h1 className="text-primary font-headline font-bold text-lg tracking-tight">Banners</h1>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">close</span>
              </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Section: Create/Edit Banner */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-[10px] uppercase tracking-widest text-[#c3c4e2] font-black">
                    CREAR / EDITAR BANNER
                  </span>
                </div>
                
                <div className="space-y-6 bg-[#191b23] p-6 rounded-2xl border border-white/5 shadow-inner">
                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center group hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(242,185,47,0.1)]">
                      <span className="material-symbols-outlined text-primary text-3xl">upload_file</span>
                    </div>
                    <p className="text-white/60 text-sm font-bold tracking-tight">Arrastra una imagen o haz clic para subir</p>
                    <p className="text-white/20 text-[10px] mt-1 font-bold uppercase tracking-widest">Recomendado: 1200 × 400px (PNG, JPG)</p>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                        ENLACE DE REDIRECCIÓN
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg transition-colors group-focus-within:text-primary">
                          link
                        </span>
                        <input 
                          className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl pl-12 pr-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none" 
                          placeholder="https://store.crypto/promo/spring-sale" 
                          type="text" 
                        />
                      </div>
                    </div>
                    
                    <button className="w-full bg-primary text-[#402d00] font-black py-4 rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      Guardar Banner
                    </button>
                  </div>
                </div>
              </section>

              {/* Section: Active Banners */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-[10px] uppercase tracking-widest text-[#c3c4e2] font-black">
                    BANNERS ACTIVOS
                  </span>
                  <span className="text-[9px] font-black text-white/40 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {activeBanners.length} Total
                  </span>
                </div>

                <div className="space-y-3">
                  {activeBanners.map((banner) => (
                    <div 
                      key={banner.id}
                      className="group flex items-center gap-4 bg-[#191b23] p-3.5 rounded-2xl hover:bg-white/[0.03] transition-all border border-white/5 hover:border-white/10 shadow-sm"
                    >
                      <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 ring-1 ring-white/5">
                        <img 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                          src={banner.image} 
                          alt={banner.title} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black truncate text-white uppercase tracking-tight">{banner.title}</h4>
                        <p className="text-[10px] text-white/30 truncate font-bold">{banner.url}</p>
                      </div>
                      <div className="flex items-center gap-1.5 pr-1">
                        <button className="p-2 hover:bg-primary/10 rounded-xl text-white/30 hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="p-2 hover:bg-red-500/10 rounded-xl text-white/30 hover:text-red-400 transition-all">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
