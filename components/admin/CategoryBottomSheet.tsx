"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryBottomSheet = ({ isOpen, onClose }: CategoryBottomSheetProps) => {
  const [platform, setPlatform] = useState("");

  const handleCreate = () => {
    console.log("Creando categoría:", platform);
    // Aquí iría la lógica de guardado en el futuro
    onClose();
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Bottom Sheet Container */}
          <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[110] p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-[#e9e9e9] dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden pointer-events-auto border border-white/5"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5">
                <div className="w-8" /> {/* Spacer */}
                <h2 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-widest text-center flex-1">
                  AGREGAR CATEGORIAS
                </h2>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-white hover:bg-gray-300 dark:hover:bg-white/10 transition-colors"
                >
                   <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Content Area */}
              <div className="p-8 pb-10 flex flex-col space-y-8">
                {/* Platform Input */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-[0.2em]" htmlFor="platform">
                    PLATAFORMA
                  </label>
                  <input
                    id="platform"
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="Ingrese el nombre de la plataforma..."
                    className="w-full bg-gray-100 dark:bg-[#30334a] border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all outline-none font-bold text-sm"
                  />
                </div>

                {/* Image Upload Area */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-[0.2em]">
                    ELEGIR IMAGEN
                  </label>
                  <div className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl bg-gray-100 dark:bg-[#30334a] hover:border-primary transition-all cursor-pointer group shadow-inner">
                    <input accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
                    <div className="flex flex-col items-center space-y-3">
                      <span className="material-symbols-outlined text-gray-400 dark:text-white/20 group-hover:text-primary transition-colors text-4xl">
                        upload_file
                      </span>
                      <span className="text-[11px] font-bold text-gray-500 dark:text-white/40 uppercase tracking-tighter group-hover:text-primary/60">
                        Haz clic para subir imagen
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer / Create Button */}
              <div className="p-6 pt-0 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-transparent pb-10 sm:pb-8">
                <button 
                  onClick={handleCreate}
                  className="w-full bg-primary text-[#402d00] font-black py-4 px-6 rounded-2xl shadow-[0_15px_30px_rgba(242,185,47,0.3)] hover:scale-[1.02] active:scale-95 transition-all transform uppercase tracking-widest text-sm"
                >
                  CREAR
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
