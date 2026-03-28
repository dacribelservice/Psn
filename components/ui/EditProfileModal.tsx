"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export const EditProfileModal = ({ isOpen, onClose, currentUser }: EditProfileModalProps) => {
  const [name, setName] = useState(currentUser?.name || "Ereogan Aysel");

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
            className="relative z-10 w-full max-w-lg bg-[#30334a]/70 backdrop-blur-[20px] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 flex items-center justify-between border-b border-white/5">
              <h1 className="font-headline text-xl font-bold tracking-tight text-[#e1e1ed]">Editar Perfil</h1>
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-[#d3c5ad]">close</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="px-8 py-8 space-y-8">
              {/* Avatar Section */}
              <div className="relative flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden shadow-2xl bg-[#33343d] flex items-center justify-center">
                    {currentUser?.avatar ? (
                      <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-[#d3c5ad] !text-[64px]">person</span>
                    )}
                  </div>
                  <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#f2b92f] text-[#261900] rounded-full flex items-center justify-center shadow-lg border-4 border-[#30334a] hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined !text-[20px]">photo_camera</span>
                  </button>
                </div>
                <div className="text-center mt-3">
                  <p className="font-headline text-lg font-semibold text-white">{name}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="space-y-2.5">
                  <label className="font-headline text-[10px] uppercase tracking-[2px] text-white/40 font-black px-1">
                    Nombre de Usuario
                  </label>
                  <div className="relative group">
                    <input 
                      className="w-full h-14 bg-[#282a32]/50 rounded-xl border-0 ring-1 ring-white/5 focus:ring-2 focus:ring-[#f2b92f] text-white placeholder:text-white/10 px-5 transition-all outline-none" 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-8 py-8 flex gap-4 items-center justify-center bg-black/10">
              <button 
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold bg-[#33343d] text-white hover:bg-[#42455d] transition-colors text-sm uppercase tracking-widest active:scale-95"
              >
                Cancelar
              </button>
              <button 
                className="bg-gradient-to-b from-[#ffd98d] to-[#f2b92f] px-8 py-3 rounded-xl font-headline font-black text-[#402d00] shadow-[0_8px_20px_-6px_rgba(242,185,47,0.4)] hover:brightness-110 active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
