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
              className="relative w-full max-w-sm bg-[#e9e9e9] dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden pointer-events-auto border border-white/5 max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5 shrink-0">
                <div className="w-8" /> {/* Spacer */}
                <h2 className="text-headline-md font-display text-gray-900 dark:text-white uppercase text-center flex-1">
                  AGREGAR CATEGORIAS
                </h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-white transition-colors hover:bg-gray-300 dark:hover:bg-white/10"
                >
                   <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col space-y-6 overflow-y-auto no-scrollbar custom-scrollbar font-sans antialiased">
                {/* Platform Input */}
                <div className="space-y-2">
                  <label className="block text-label-sm text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]" htmlFor="platform">
                    PLATAFORMA
                  </label>
                  <input
                    id="platform"
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="Ingrese el nombre de la plataforma..."
                    className="w-full bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-4 px-5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all outline-none font-bold text-body-md shadow-inner"
                  />
                </div>

                {/* Image Upload Area */}
                <div className="space-y-2">
                  <label className="block text-label-sm text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    ELEGIR IMAGEN
                  </label>
                  <div className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl bg-gray-300/30 dark:bg-[#30334a] hover:border-primary transition-all cursor-pointer group shadow-inner">
                    <input accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" type="file" />
                    <div className="flex flex-col items-center space-y-3">
                      <span className="material-symbols-outlined text-gray-400 dark:text-white/20 group-hover:text-primary transition-colors text-3xl">
                        upload_file
                      </span>
                      <span className="text-label-sm text-gray-500 dark:text-white/40 uppercase tracking-widest group-hover:text-primary/60">
                        Haz clic para subir imagen
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer / Create Button */}
              <div className="p-6 pt-2 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-transparent pb-8">
                <button 
                  onClick={handleCreate}
                  className="w-full bg-[#f2b92f] text-black font-display py-3 px-6 rounded-xl shadow-[0_10px_20px_rgba(242,185,47,0.2)] hover:brightness-110 active:scale-95 transition-all transform uppercase text-label-sm"
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
