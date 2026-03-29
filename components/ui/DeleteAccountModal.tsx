"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteAccountModal = ({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-[#1a1c2e] rounded-[2.5rem] border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden pointer-events-auto flex flex-col items-center p-8 text-center relative"
            >
              {/* Decorative Glow */}
              <div className="absolute top-0 inset-x-0 h-32 bg-red-500/10 blur-[60px] rounded-full" />

              {/* Icon / Logo */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-[2rem] bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                  <span className="material-symbols-outlined text-red-500 text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    delete_forever
                  </span>
                </div>
                {/* Floating particles animation placeholder */}
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full blur-[4px] opacity-20 animate-pulse" />
              </div>

              {/* Text Content */}
              <h3 className="text-2xl font-display font-black text-white mb-3 tracking-tight">
                {language === 'es' ? '¿ELIMINAR CUENTA?' : 'DELETE ACCOUNT?'}
              </h3>
              
              <div className="space-y-4 mb-8">
                <p className="text-on-surface-variant/60 text-sm leading-relaxed">
                  {language === 'es' 
                    ? 'Esta acción es permanente. Perderás el acceso a tus compras, historial y saldo de forma inmediata.' 
                    : 'This action is permanent. You will immediately lose access to your purchases, history, and balance.'}
                </p>
                
                <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-400 text-sm">info</span>
                  <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest text-left">
                    {language === 'es' 
                      ? 'No hay vuelta atrás una vez confirmada la eliminación.' 
                      : 'There is no going back once the deletion is confirmed.'}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full space-y-3">
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="w-full py-4 bg-red-500 text-white font-black rounded-2xl text-xs uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(239,68,68,0.2)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="animate-spin material-symbols-outlined text-sm">progress_activity</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      {language === 'es' ? 'SÍ, ELIMINAR AHORA' : 'YES, DELETE NOW'}
                    </>
                  )}
                </button>

                <button
                  onClick={onClose}
                  disabled={loading}
                  className="w-full py-4 bg-white/5 text-white/40 font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                  {language === 'es' ? 'CANCELAR' : 'CANCEL'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
