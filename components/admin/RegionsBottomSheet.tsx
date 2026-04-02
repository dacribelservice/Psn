"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface RegionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RegionsBottomSheet = ({ isOpen, onClose, onSuccess }: RegionsBottomSheetProps) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadRegions();
    }
  }, [isOpen]);

  const loadRegions = async () => {
    try {
      const { data } = await supabase.from('regions').select('*').order('name');
      setRegions(data || []);
    } catch (err) {
      console.error("Error loading regions:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setStatusMessage("PROCESANDO...");
    
    try {
      let finalFlagUrl = previewUrl;

      // 1. Subir bandera si hay archivo nuevo
      if (file) {
        setStatusMessage("SUBIENDO BANDERA...");
        const fileExt = file.name.split('.').pop();
        // Sanitización profunda: elimina 'ñ', acentos y caracteres especiales
        const sanitizedName = name.toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ñ/g, "n")
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-");
          
        const fileName = `${sanitizedName}_${Date.now()}.${fileExt}`;
        const filePath = `flags/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('app-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('app-assets')
          .getPublicUrl(filePath);
        
        finalFlagUrl = publicUrl;
      }

      setStatusMessage("GUARDANDO...");

      if (editingId) {
        const { error } = await supabase
          .from('regions')
          .update({ name: name.toUpperCase(), flag_url: finalFlagUrl })
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('regions')
          .insert([{ name: name.toUpperCase(), flag_url: finalFlagUrl }]);
        if (error) throw error;
      }

      onSuccess?.();
      await loadRegions();
      resetForm();
    } catch (err: any) {
      console.error("Save Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
      setStatusMessage(null);
    }
  };

  const handleEdit = (reg: any) => {
    setEditingId(reg.id);
    setName(reg.name);
    setPreviewUrl(reg.flag_url);
    setFile(null);
    document.querySelector('.regions-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este país?")) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('regions').delete().eq('id', id);
      if (error) throw error;
      await loadRegions();
      onSuccess?.();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setFile(null);
    setPreviewUrl(null);
    setEditingId(null);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[110] p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-sm bg-gray-100 dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl pointer-events-auto border border-black/5 dark:border-white/5 max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5 shrink-0">
                <div className="w-8" />
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest flex-1 text-center">
                  GESTIONAR REGIONES
                </h2>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-gray-500">
                   <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto regions-scroll p-6 space-y-6 no-scrollbar">
                {/* Form */}
                <div className="bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-xl space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest ml-1">NOMBRE DEL PAÍS</label>
                    <input 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ej. USA, Colombia..."
                      className="w-full bg-gray-50 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-black text-sm outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-widest ml-1">BANDERA (OPCIONAL)</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full aspect-[2/1] rounded-2xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden transition-all ${previewUrl ? 'border-primary/50' : 'border-black/5 dark:border-white/5 bg-gray-50 dark:bg-black/10'}`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Flag preview" />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400 dark:text-white/20">
                           <span className="material-symbols-outlined text-3xl">add_photo_alternate</span>
                           <span className="text-[9px] font-black uppercase tracking-tighter">Subir Bandera</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-primary text-black font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all text-[11px] uppercase tracking-widest"
                  >
                    {statusMessage || (editingId ? "Actualizar Región" : "Crear Región")}
                  </button>
                  {editingId && (
                    <button onClick={resetForm} className="w-full text-[10px] font-black text-gray-400 uppercase tracking-widest">Cancelar</button>
                  )}
                </div>

                {/* List */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2">REGIONES ACTIVAS</h3>
                  {regions.map(reg => (
                    <div key={reg.id} className="flex items-center justify-between bg-white dark:bg-white/5 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-sm group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 rounded-sm overflow-hidden bg-gray-100 dark:bg-black/40 ring-1 ring-black/5">
                          {reg.flag_url ? <img src={reg.flag_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-bold text-gray-300">?</div>}
                        </div>
                        <span className="text-xs font-black dark:text-white uppercase">{reg.name}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEdit(reg)} className="p-2 hover:bg-primary/10 rounded-lg text-gray-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button onClick={() => handleDelete(reg.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
