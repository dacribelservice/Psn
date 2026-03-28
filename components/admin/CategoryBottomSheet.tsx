"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface CategoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CategoryBottomSheet = ({ isOpen, onClose, onSuccess }: CategoryBottomSheetProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    setLoading(true);
    try {
      const slug = name.toLowerCase().trim().replace(/\s+/g, '-');
      const { error } = await supabase
        .from('categories')
        .insert([{ name, slug }]);

      if (error) throw error;
      
      onSuccess?.();
      onClose();
      setName("");
    } catch (err) {
      console.error("Error creating category:", err);
      alert("Error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[110] p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-[#e9e9e9] dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden pointer-events-auto border border-white/5 max-h-[85vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5 shrink-0">
                <div className="w-8" />
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase text-center flex-1 tracking-widest">
                  AGREGAR CATEGORIA
                </h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-white transition-colors hover:bg-gray-300 dark:hover:bg-white/10"
                >
                   <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="p-6 flex flex-col space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    NOMBRE DE LA CATEGORIA
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. PlayStation Network"
                    className="w-full bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-4 px-5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all outline-none font-bold text-sm shadow-inner"
                  />
                </div>
              </div>

              <div className="p-6 pt-2 pb-8">
                <button 
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-[#f2b92f] text-black font-black py-4 rounded-xl shadow-2xl hover:brightness-110 active:scale-95 transition-all uppercase text-[11px] disabled:opacity-50"
                >
                  {loading ? "CREANDO..." : "CREAR CATEGORIA"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
