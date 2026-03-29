"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

interface UserTermsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserTermsBottomSheet = ({ isOpen, onClose }: UserTermsBottomSheetProps) => {
  const { t } = useLanguage();
  const [terms, setTerms] = useState("");

  useEffect(() => {
    const fetchTerms = async () => {
      if (isOpen) {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "terms_conditions")
          .maybeSingle();
        
        if (data?.value) {
          setTerms(data.value.content || "");
        } else {
          setTerms(t("terms_not_configured") || "Aún no se han configurado los términos y condiciones.");
        }
      }
    };
    fetchTerms();
  }, [isOpen, t]);

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
            className="relative z-10 w-full max-w-2xl bg-[#191b23]/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[70vh]"
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

            <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-[#c3c4e2]/90 text-sm leading-relaxed font-sans tracking-wide">
                  {terms}
                </div>
              </div>
            </main>

            {/* Footer with reassurance */}
            <footer className="px-6 py-4 bg-[#11131b]/60 border-t border-white/5 flex items-center justify-center">
              <div className="flex items-center gap-2 opacity-30">
                <span className="material-symbols-outlined text-sm">verified_user</span>
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">{t("about_us")} - Dacribel</span>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
