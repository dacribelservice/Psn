"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  type = "danger",
}: ConfirmationModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200]"
          />

          <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[210] p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[340px] bg-white dark:bg-[#1e1e1e] rounded-[2.5rem] flex flex-col shadow-2xl pointer-events-auto border border-black/5 dark:border-white/5 overflow-hidden"
            >
              <div className="p-8 text-center space-y-4">
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                  type === 'danger' ? 'bg-red-500/10 text-red-500' : 
                  type === 'warning' ? 'bg-amber-500/10 text-amber-500' : 
                  'bg-primary/10 text-primary'
                }`}>
                  <span className="material-symbols-outlined text-3xl font-black">
                    {type === 'danger' ? 'delete_forever' : type === 'warning' ? 'warning' : 'info'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                    {title}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 dark:text-white/40 leading-relaxed px-2">
                    {message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 p-6 pt-0">
                <button
                  onClick={onClose}
                  className="flex-1 py-4 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 font-black text-[11px] uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-white/10 transition-all active:scale-95"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
                    type === 'danger' ? 'bg-red-500 text-white shadow-red-500/20' : 
                    type === 'warning' ? 'bg-amber-500 text-white shadow-amber-500/20' : 
                    'bg-primary text-black shadow-primary/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
