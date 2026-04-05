"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { sanitizeHTML } from "@/lib/sanitizer";
import { termsSchema } from "@/lib/schemas/settings";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";

interface AdminTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminTermsModal = ({ isOpen, onClose }: AdminTermsModalProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [termsEs, setTermsEs] = useState("");
  const [termsEn, setTermsEn] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTerms = async () => {
      if (isOpen) {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "terms_conditions")
          .maybeSingle();
        
        if (data?.value) {
          setTermsEs(data.value.content || "");
          setTermsEn(data.value.content_en || "");
        }
      }
    };
    fetchTerms();
  }, [isOpen]);

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    
    try {
      const finalTermsEs = sanitizeHTML(termsEs);
      const finalTermsEn = sanitizeHTML(termsEn);

      // --- VALIDACIÓN CON ZOD ---
      const validation = termsSchema.safeParse({
        content: finalTermsEs,
        content_en: finalTermsEn
      });

      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || "Error de validación";
        alert(errorMsg);
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from("settings")
        .upsert({ 
          key: "terms_conditions", 
          value: { content: finalTermsEs, content_en: finalTermsEn },
          updated_by: user.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      onClose();
    } catch (err) {
      console.error("Error saving terms:", err);
      alert("Error al guardar los términos");
    } finally {
      setIsSaving(false);
    }
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
            className="relative z-10 w-full max-w-4xl bg-[#191b23]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <header className="flex justify-between items-center px-6 h-16 w-full sticky top-0 z-50 bg-[#1d1f27]/60 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-[22px]">description</span>
                <h1 className="text-primary font-headline font-bold text-lg tracking-tight uppercase">
                  Editor de Términos Bilingüe
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
                    ADMINISTRACIÓN DE POLÍTICAS INTERNACIONALES
                  </span>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Spanish Section */}
                  <div className="space-y-4 bg-[#12141c] p-6 rounded-2xl border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="https://flagcdn.com/w20/es.png" className="w-4 h-3 object-cover rounded-[1px]" alt="ES" />
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black">
                        CONTENIDO ESPAÑOL (ES)
                      </label>
                    </div>
                    <textarea 
                      className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-4 placeholder:text-white/10 text-sm transition-all outline-none min-h-[400px] resize-none font-sans leading-relaxed" 
                      placeholder="Escribe aquí los términos en español..."
                      value={termsEs}
                      onChange={(e) => setTermsEs(e.target.value)}
                    />
                  </div>

                  {/* English Section */}
                  <div className="space-y-4 bg-[#12141c] p-6 rounded-2xl border border-white/5 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <img src="https://flagcdn.com/w20/us.png" className="w-4 h-3 object-cover rounded-[1px]" alt="EN" />
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black">
                        ENGLISH CONTENT (EN)
                      </label>
                    </div>
                    <textarea 
                      className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-4 placeholder:text-white/10 text-sm transition-all outline-none min-h-[400px] resize-none font-sans leading-relaxed" 
                      placeholder="Write the terms in English here..."
                      value={termsEn}
                      onChange={(e) => setTermsEn(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
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
                        Guardar Términos Bilingües
                      </>
                    )}
                  </button>
                  
                  <p className="text-[10px] text-center text-white/20 font-bold uppercase tracking-widest">
                    Los cambios se aplicarán automáticamente según el idioma de cada usuario.
                  </p>
                </div>
              </section>
            </main>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
