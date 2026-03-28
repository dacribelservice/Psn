"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface AdminTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTermsModal = ({ isOpen, onClose }: AdminTermsModalProps) => {
  const { t } = useLanguage();
  const [terms, setTerms] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const savedTerms = localStorage.getItem("dacribel_terms");
      if (savedTerms) setTerms(savedTerms);
    }
  }, [isOpen]);

  const handleSave = () => {
    setIsSaving(true);
    
    // Persist in localStorage for simulation
    localStorage.setItem("dacribel_terms", terms);

    // Simulate API call delay
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1500);
  };

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
                <span className="material-symbols-outlined text-primary text-[22px]">description</span>
                <h1 className="text-primary font-headline font-bold text-lg tracking-tight uppercase">
                  {t("terms_conditions")}
                </h1>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">close</span>
              </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-[10px] uppercase tracking-widest text-[#c3c4e2] font-black">
                    EDITOR DE TÉRMINOS EXCLUSIVO ADMIN
                  </span>
                </div>
                
                <div className="space-y-6 bg-[#12141c] p-6 rounded-2xl border border-white/5 shadow-inner">
                  <div className="space-y-2.5 text-left">
                    <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                      CONTENIDO DE LOS TÉRMINOS (ES/EN)
                    </label>
                    <div className="relative group">
                      <textarea 
                        className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-4 placeholder:text-white/10 text-sm transition-all outline-none min-h-[300px] resize-none font-sans leading-relaxed" 
                        placeholder="Escribe aquí los términos y condiciones del sitio..."
                        value={terms}
                        onChange={(e) => setTerms(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-primary text-[#402d00] font-black py-4 rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                          Guardar Términos
                        </>
                      )}
                    </button>
                    
                    <p className="text-[10px] text-center text-white/20 font-bold uppercase tracking-widest">
                      Los cambios serán visibles para todos los usuarios inmediatamente.
                    </p>
                  </div>
                </div>
              </section>
            </main>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
