"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface BannersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BannersModal = ({ isOpen, onClose }: BannersModalProps) => {
  const [banners, setBanners] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  
  // Form states
  const [imageUrl, setImageUrl] = React.useState("");
  const [titleEs, setTitleEs] = React.useState("");
  const [titleEn, setTitleEn] = React.useState("");
  const [subtitleEs, setSubtitleEs] = React.useState("");
  const [subtitleEn, setSubtitleEn] = React.useState("");
  const [redirectUrl, setRedirectUrl] = React.useState("");

  const fetchBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error) setBanners(data || []);
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (!error) setCategories(data || []);
  };

  React.useEffect(() => {
    if (isOpen) {
      fetchBanners();
      fetchCategories();
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!imageUrl) {
      alert("Por favor ingresa la URL de la imagen");
      return;
    }
    setLoading(true);
    try {
      const bannerData = {
        image_url: imageUrl,
        title_es: titleEs,
        title_en: titleEn,
        subtitle_es: subtitleEs,
        subtitle_en: subtitleEn,
        redirect_url: redirectUrl,
      };

      if (editingId) {
        const { error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('banners')
          .insert([bannerData]);
        if (error) throw error;
      }

      // Reset
      setImageUrl("");
      setTitleEs("");
      setTitleEn("");
      setSubtitleEs("");
      setSubtitleEn("");
      setRedirectUrl("");
      setEditingId(null);
      fetchBanners();
    } catch (err) {
      console.error("Error saving banner:", err);
      alert("Error al guardar el banner");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingId(banner.id);
    setImageUrl(banner.image_url);
    setTitleEs(banner.title_es || "");
    setTitleEn(banner.title_en || "");
    setSubtitleEs(banner.subtitle_es || "");
    setSubtitleEn(banner.subtitle_en || "");
    setRedirectUrl(banner.redirect_url || "");
    // Scroll to top of section
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este banner?")) return;
    const { error } = await supabase.from('banners').delete().eq('id', id);
    if (!error) fetchBanners();
    else alert("Error al eliminar");
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
            className="relative z-10 w-full max-w-2xl bg-[#191b23]/80 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <header className="flex justify-between items-center px-6 h-16 w-full sticky top-0 z-50 bg-[#1d1f27]/60 backdrop-blur-xl border-b border-white/5">
              <div className="flex items-center gap-3">
                <h1 className="text-primary font-headline font-bold text-lg tracking-tight">Banners</h1>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-primary text-[20px]">close</span>
              </button>
            </header>

            <main className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              {/* Section: Create/Edit Banner */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-[10px] uppercase tracking-widest text-[#c3c4e2] font-black">
                    CREAR / EDITAR BANNER
                  </span>
                </div>
                
                <div className="space-y-6 bg-[#191b23] p-6 rounded-2xl border border-white/5 shadow-inner">
                  {/* URL image Input */}
                  <div className="space-y-2.5">
                    <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                      URL DE LA IMAGEN
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg transition-colors group-focus-within:text-primary">
                        image
                      </span>
                      <input 
                        className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl pl-12 pr-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none" 
                        placeholder="https://example.com/banner.jpg" 
                        type="text" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* ES Labels */}
                  <div className="pt-2 border-t border-white/5 mx-2" />
                  <div className="flex items-center gap-2 px-2">
                    <img src="https://flagcdn.com/w40/es.png" className="w-4 h-3 rounded-sm opacity-50" />
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">Contenido Español</span>
                  </div>

                  {/* Text Inputs ES */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                        TEXTO SUPERIOR ES
                      </label>
                      <input 
                        className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none" 
                        placeholder="OFERTA DESTACADA" 
                        type="text" 
                        value={subtitleEs}
                        onChange={(e) => setSubtitleEs(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                        TEXTO PRINCIPAL ES
                      </label>
                      <input 
                        className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none" 
                        placeholder="TÍTULO EN ESPAÑOL" 
                        type="text" 
                        value={titleEs}
                        onChange={(e) => setTitleEs(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* EN Labels */}
                  <div className="pt-2 border-t border-white/5 mx-2" />
                  <div className="flex items-center gap-2 px-2">
                    <img src="https://flagcdn.com/w40/us.png" className="w-4 h-3 rounded-sm opacity-50" />
                    <span className="text-[9px] font-black uppercase text-white/20 tracking-widest">English Content</span>
                  </div>

                  {/* Text Inputs EN */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2.5">
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                        SUBTITLE EN
                      </label>
                      <input 
                        className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none" 
                        placeholder="FEATURED OFFER" 
                        type="text" 
                        value={subtitleEn}
                        onChange={(e) => setSubtitleEn(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2.5">
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                        MAIN TITLE EN
                      </label>
                      <input 
                        className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl px-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none" 
                        placeholder="BANNER TITLE IN ENGLISH" 
                        type="text" 
                        value={titleEn}
                        onChange={(e) => setTitleEn(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-5">
                    <div className="space-y-2.5">
                      <label className="font-headline text-[9px] uppercase tracking-widest text-white/40 font-black ml-1">
                        VINCULAR A CATEGORÍA (ACCIONAR COMPRA)
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg transition-colors group-focus-within:text-primary pointer-events-none">
                          category
                        </span>
                        <select 
                          className="w-full bg-[#0c0e15] text-white border-none ring-1 ring-white/5 focus:ring-2 focus:ring-primary/50 rounded-xl pl-12 pr-4 py-3.5 placeholder:text-white/10 text-sm transition-all outline-none appearance-none cursor-pointer" 
                          value={redirectUrl}
                          onChange={(e) => setRedirectUrl(e.target.value)}
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-lg pointer-events-none">
                          expand_more
                        </span>
                      </div>
                    </div>
                                        <button 
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full bg-primary text-[#402d00] font-black py-4 rounded-xl shadow-lg shadow-primary/10 active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase text-[11px] tracking-widest"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {editingId ? 'edit' : 'check_circle'}
                          </span>
                          {editingId ? 'Actualizar Banner' : 'Guardar Banner'}
                        </>
                      )}
                    </button>
                    {editingId && (
                      <button 
                        onClick={() => {
                          setEditingId(null);
                          setImageUrl("");
                          setTitleEs("");
                          setTitleEn("");
                          setSubtitleEs("");
                          setSubtitleEn("");
                          setRedirectUrl("");
                        }}
                        className="w-full bg-white/5 text-white/40 font-black py-3 rounded-xl hover:bg-white/10 transition-all uppercase text-[10px] tracking-widest"
                      >
                        Cancelar Edición
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* Section: Active Banners */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-headline text-[10px] uppercase tracking-widest text-[#c3c4e2] font-black">
                    BANNERS ACTIVOS
                  </span>
                  <span className="text-[9px] font-black text-white/40 bg-white/5 px-2.5 py-1 rounded-full uppercase tracking-widest">
                    {banners.length} Total
                  </span>
                </div>

                 <div className="space-y-3">
                  {banners.length === 0 && (
                    <div className="text-center py-10 bg-black/5 rounded-2xl border border-dashed border-white/5">
                      <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">No hay banners activos</p>
                    </div>
                  )}
                  {banners.map((banner) => (
                    <div 
                      key={banner.id}
                      className="group flex items-center gap-4 bg-[#191b23] p-3.5 rounded-2xl hover:bg-white/[0.03] transition-all border border-white/5 hover:border-white/10 shadow-sm"
                    >
                      <div className="w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black/40 ring-1 ring-white/5">
                        <img 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                          src={banner.image_url} 
                          alt={banner.title} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black truncate text-white uppercase tracking-tight">{banner.title_es || "Sin título"}</h4>
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          <span className="material-symbols-outlined text-[10px] text-primary">link</span>
                          <span className="text-[10px] text-white/30 truncate font-bold">
                            {categories.find(c => c.id === banner.redirect_url)?.name || "Categoría no encontrada"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 pr-1">
                        <button 
                          onClick={() => handleEdit(banner)}
                          className="p-2 hover:bg-primary/10 rounded-xl text-white/30 hover:text-primary transition-all"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(banner.id)}
                          className="p-2 hover:bg-red-500/10 rounded-xl text-white/30 hover:text-red-400 transition-all">
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
