"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { sanitizePlainText, sanitizeURL } from "@/lib/sanitizer";
import { categorySchema } from "@/lib/schemas/categories";
import { z } from "zod";

interface CategoryBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CategoryBottomSheet = ({ isOpen, onClose, onSuccess }: CategoryBottomSheetProps) => {
  const [name, setName] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  const loadCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('*').order('name');
      setCategories(data || []);
    } catch (err) {
      console.error("Error loading categories:", err);
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
    setLoading(true);
    setStatusMessage("VALIDANDO...");
    
    try {
      const cleanName = sanitizePlainText(name);
      let finalImageUrl = sanitizeURL(imageUrlInput);
      
      const slug = cleanName.toLowerCase().trim()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      // --- VALIDACIÓN CON ZOD ---
      const validation = categorySchema.safeParse({
        name: cleanName,
        slug: slug,
        image_url: finalImageUrl || null,
        display_order: 0
      });

      if (!validation.success) {
        const errorMsg = validation.error.issues[0]?.message || "Error de validación";
        alert(errorMsg);
        setLoading(false);
        setStatusMessage(null);
        return;
      }

      // 1. Si hay un archivo nuevo, subirlo a storage
      if (file) {
        setStatusMessage("SUBIENDO LOGO...");
        const fileExt = file.name.split('.').pop();
        // Sanitización profunda de nombre de archivo
        const sanitizedFileName = slug
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ñ/g, "n")
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-");
          
        const fileName = `${sanitizedFileName}_${Date.now()}.${fileExt}`;
        const filePath = `categories/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('app-assets')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('app-assets')
          .getPublicUrl(filePath);
        
        finalImageUrl = publicUrl;
      }

      setStatusMessage("GUARDANDO EN DB...");

      if (editingId) {
        const { error } = await supabase
          .from('categories')
          .update({ name: cleanName, slug, image_url: finalImageUrl })
          .eq('id', editingId)
          .select();
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([{ name: cleanName, slug, image_url: finalImageUrl }])
          .select();
        if (error) throw error;
      }

      setStatusMessage("SINCRONIZANDO...");
      onSuccess?.();
      await loadCategories();
      resetForm();
      setStatusMessage(null);
    } catch (err: any) {
      console.error("Save Error:", err);
      alert(`Error: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setName(cat.name);
    setImageUrlInput(cat.image_url || "");
    setPreviewUrl(cat.image_url || null);
    setFile(null);
    setStatusMessage(null);
    document.querySelector('.content-scroll')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoading(true);
    setStatusMessage("ELIMINANDO...");
    try {
      const { error } = await supabase.from('categories').delete().eq('id', itemToDelete.id);
      if (error) throw error;
      await loadCategories();
      onSuccess?.();
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setStatusMessage(null);
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (cat: any) => {
    setItemToDelete(cat);
    setDeleteModalOpen(true);
  };

  const resetForm = () => {
    setName("");
    setImageUrlInput("");
    setPreviewUrl(null);
    setEditingId(null);
    setStatusMessage(null);
  };

  return (
    <>
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
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="relative w-full max-w-sm bg-gray-100 dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden pointer-events-auto border border-black/5 dark:border-white/5 max-h-[90vh]"
              >
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5 shrink-0">
                  <div className="w-8" />
                  <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase text-center flex-1 tracking-widest">
                    {editingId ? "EDITAR CATEGORIA" : "ADMINISTRAR CATEGORIAS"}
                  </h2>
                  <button 
                    onClick={onClose}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-white transition-colors hover:bg-gray-300 dark:hover:bg-white/10"
                  >
                     <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto content-scroll pb-10">
                  <div className="p-6 flex flex-col space-y-6">
                    {/* Form Component */}
                    <div className="space-y-6 bg-white dark:bg-white/5 p-5 rounded-[2rem] border border-black/5 dark:border-white/5 shadow-xl">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                          NOMBRE DE LA CATEGORIA
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ej. PlayStation Network"
                          className="w-full bg-gray-100 dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 transition-all outline-none font-bold text-sm shadow-inner"
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-[10px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                            IMAGEN / LOGO DE CATEGORIA
                          </label>
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="relative group cursor-pointer"
                          >
                            <input 
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                            
                            <div className={`w-full aspect-video rounded-[2rem] border-2 border-dashed transition-all flex flex-center items-center justify-center overflow-hidden ${previewUrl ? 'border-primary/50' : 'border-black/5 dark:border-white/5 bg-gray-50 dark:bg-black/20'}`}>
                              {previewUrl ? (
                                <div className="relative w-full h-full group/preview">
                                  <img src={previewUrl} className="w-full h-full object-contain p-4" alt="Preview" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Cambiar Logo</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-white/20 group-hover:text-primary transition-colors">
                                  <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
                                  <span className="text-[10px] font-black uppercase tracking-widest">Subir Imagen de Consola</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-3">
                        <button 
                          onClick={handleSave}
                          disabled={loading}
                          className="flex-1 bg-primary text-black font-black py-5 rounded-2xl shadow-[0_20px_40px_rgba(242,185,47,0.3)] hover:brightness-110 active:scale-95 transition-all uppercase text-[11px] disabled:opacity-50"
                        >
                          {statusMessage || (editingId ? "GUARDAR CAMBIOS" : "CREAR CATEGORIA")}
                        </button>
                        {editingId && (
                          <button 
                            onClick={resetForm}
                            className="px-6 bg-gray-200 dark:bg-white/5 text-gray-700 dark:text-white/40 font-black py-5 rounded-2xl hover:bg-gray-300 dark:hover:bg-white/10 transition-all uppercase text-[11px]"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>

                    {/* List Section */}
                    <div className="space-y-4 pt-4">
                      <div className="flex justify-between items-center px-4">
                        <h3 className="text-[10px] font-black text-gray-500 dark:text-white/40 uppercase tracking-[0.3em]">CATEGORÍAS EXISTENTES</h3>
                        <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">{categories.length}</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        {categories.map((cat) => (
                          <div key={cat.id} className="flex items-center justify-between bg-white dark:bg-white/5 p-4 rounded-3xl border border-black/5 dark:border-white/5 hover:border-primary/20 dark:hover:border-white/10 transition-all group shadow-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-black/40 flex items-center justify-center overflow-hidden ring-1 ring-black/5 dark:ring-white/5 shadow-inner">
                                {cat.image_url ? (
                                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="material-symbols-outlined text-xl text-black/10 dark:text-white/10">category</span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-black text-gray-900 dark:text-white tracking-tight">{cat.name}</span>
                                <span className="text-[10px] text-gray-400 dark:text-white/20 uppercase font-bold tracking-widest leading-none mt-1">/{cat.slug}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleEdit(cat)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-white/40 hover:bg-primary hover:text-black transition-all group/btn"
                              >
                                <span className="material-symbols-outlined text-[20px] group-hover/btn:scale-110 transition-transform">edit</span>
                              </button>
                              <button 
                                onClick={() => openDeleteModal(cat)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-white/5 text-red-500/40 hover:bg-red-500 hover:text-white transition-all group/btn"
                              >
                                <span className="material-symbols-outlined text-[20px] group-hover/btn:scale-110 transition-transform">delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal (Premium) */}
      <AnimatePresence>
        {deleteModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200]"
            />
            <div className="fixed inset-0 flex items-center justify-center p-6 z-[210] pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="w-full max-w-sm bg-white dark:bg-[#252833] rounded-[2.5rem] p-8 pointer-events-auto border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col items-center text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-red-500 text-4xl animate-pulse">warning</span>
                </div>
                
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase mb-3 tracking-tighter">¿Eliminar Categoría?</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 font-bold mb-8 leading-relaxed">
                  Estás a punto de eliminar <span className="text-red-500">"{itemToDelete?.name}"</span>. Esta acción no se puede deshacer y afectará a los productos asignados.
                </p>

                <div className="w-full space-y-3">
                  <button 
                    onClick={confirmDelete}
                    disabled={loading}
                    className="w-full bg-red-500 text-white font-black py-4 rounded-2xl shadow-[0_20px_40px_rgba(239,68,68,0.3)] hover:brightness-110 transition-all uppercase text-[11px]"
                  >
                    {statusMessage || "SÍ, ELIMINAR AHORA"}
                  </button>
                  <button 
                    onClick={() => setDeleteModalOpen(false)}
                    className="w-full bg-transparent text-gray-400 dark:text-white/20 font-black py-4 rounded-2xl hover:text-gray-900 dark:hover:text-white transition-all uppercase text-[10px]"
                  >
                    CANCELAR Y VOLVER
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
