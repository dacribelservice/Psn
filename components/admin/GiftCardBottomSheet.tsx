"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { type Category } from "@/services/inventory";

interface GiftCardBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const GiftCardBottomSheet = ({ isOpen, onClose, onSuccess }: GiftCardBottomSheetProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [codesText, setCodesText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(4000); // Tasa por defecto
  const [selectedRegion, setSelectedRegion] = useState("Global");
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const regions = [
    { name: "Global", code: "un", flag: "https://flagcdn.com/w40/un.png" },
    { name: "USA", code: "us", flag: "https://flagcdn.com/w40/us.png" },
    { name: "Colombia", code: "co", flag: "https://flagcdn.com/w40/co.png" },
    { name: "Brazil", code: "br", flag: "https://flagcdn.com/w40/br.png" },
    { name: "Argentina", code: "ar", flag: "https://flagcdn.com/w40/ar.png" },
    { name: "Turkia", code: "tr", flag: "https://flagcdn.com/w40/tr.png" },
    { name: "India", code: "in", flag: "https://flagcdn.com/w40/in.png" },
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories for giftcard:", err);
      }
    };
    if (isOpen) fetchCats();
  }, [isOpen]);

  const handleCreate = async () => {
    if (!selectedCategory || !value || !codesText.trim()) {
      alert("Por favor completa todos los campos");
      return;
    }
    
    setLoading(true);
    try {
      const productName = `${selectedCategory.name} $${value}`;
      
      // 1. Get or Create Product
      let { data: product, error: pError } = await supabase
        .from('products')
        .select('*')
        .eq('name', productName)
        .eq('category_id', selectedCategory.id)
        .single();

      if (pError && pError.code === 'PGRST116') {
        const { data: newProd, error: iError } = await supabase
          .from('products')
          .insert([{ 
            name: productName, 
            price: value, 
            category_id: selectedCategory.id,
            description: description || `Gift Card de ${selectedCategory.name} por $${value}`
          }])
          .select()
          .single();
        if (iError) throw iError;
        product = newProd;
      } else if (pError) throw pError;

      // 2. Insert Codes
      const codes = codesText.split("\n").filter(c => c.trim() !== "");
      const { error: cError } = await supabase
        .from('inventory_codes')
        .insert(codes.map(code => ({
          product_id: product?.id,
          code: code.trim(),
          status: 'available',
          face_value: value,
          usd_rate: exchangeRate,
          region: selectedRegion
        })));

      if (cError) throw cError;

      onSuccess?.();
      onClose();
      // Reset
      setValue(0);
      setDescription("");
      setCodesText("");
      setSelectedCategory(null);
    } catch (err) {
      console.error("Error creating gift card codes:", err);
      alert("Error al cargar los códigos");
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[110] p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[360px] bg-gray-100 dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl pointer-events-auto border border-black/5 dark:border-white/5 max-h-[85vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/5 shrink-0">
                <div className="w-8" />
                <h2 className="text-[11px] font-black text-gray-900 dark:text-white uppercase tracking-widest text-center flex-1">
                  NUEVA GIFT CARD
                </h2>
                <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-gray-500">
                   <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                {/* Platform Selector */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">PLATAFORMA</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full flex items-center justify-between bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 outline-none text-gray-900 dark:text-white font-bold text-sm shadow-sm hover:border-primary/30 transition-all border-dashed"
                    >
                      <span className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary text-xl opacity-60">category</span>
                        {selectedCategory ? selectedCategory.name : "Seleccionar plataforma..."}
                      </span>
                      <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isCategoryOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`}>expand_more</span>
                    </button>
                    
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          className="absolute z-[150] left-0 right-0 mt-2 bg-white dark:bg-[#252833] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/5 dark:border-white/10 overflow-hidden"
                        >
                          <div className="max-h-48 overflow-y-auto no-scrollbar py-2">
                            {categories.length > 0 ? (
                              categories.map((cat) => (
                                <button 
                                  key={cat.id}
                                  onClick={() => { setSelectedCategory(cat); setIsCategoryOpen(false); }}
                                  className="w-full text-left px-5 py-3.5 hover:bg-primary/10 text-gray-900 dark:text-white font-black text-[11px] uppercase transition-colors flex items-center gap-3 group"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary/20 group-hover:bg-primary transition-colors" />
                                  {cat.name}
                                </button>
                              ))
                            ) : (
                              <div className="px-5 py-8 text-center text-balance">
                                <span className="material-symbols-outlined text-gray-300 dark:text-white/10 text-3xl mb-2">error</span>
                                <p className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase italic">No hay categorías disponibles</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">VALOR USD</label>
                  <input
                    type="number"
                    value={value || ""}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-black text-xl shadow-inner outline-none focus:ring-1 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="25"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">TASA DE CAMBIO (1 USDT A COP)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-primary text-[20px]">currency_exchange</span>
                    </div>
                    <input
                      type="number"
                      value={exchangeRate || ""}
                      onChange={(e) => setExchangeRate(Number(e.target.value))}
                      className="w-full bg-white dark:bg-[#2a2d3a] border border-black/5 dark:border-white/5 rounded-2xl py-4 pl-14 pr-5 text-gray-900 dark:text-[#f2b92f] font-black text-lg shadow-inner outline-none focus:ring-1 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="4000"
                    />
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-white/40 ml-1 italic">
                    Costo estimado: <span className="text-gray-900 dark:text-white/80">{(value * exchangeRate).toLocaleString()} COP</span>
                  </p>
                </div>

                {/* Region Selector */}
                <div className="space-y-2 relative">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">REGIÓN DEL CODIGO</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsRegionOpen(!isRegionOpen)}
                      className="w-full flex items-center justify-between bg-white dark:bg-[#2a2d3a] border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 outline-none text-gray-900 dark:text-[#f2b92f] font-bold text-sm shadow-sm hover:border-primary/30 transition-all border-dashed"
                    >
                      <span className="flex items-center gap-3">
                        <img 
                          src={regions.find(r => r.name === selectedRegion)?.flag} 
                          className="w-5 h-3.5 object-cover rounded-sm shadow-sm" 
                          alt={selectedRegion} 
                        />
                        {selectedRegion}
                      </span>
                      <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${isRegionOpen ? 'rotate-180 text-primary' : 'text-gray-400'}`}>expand_more</span>
                    </button>
                    
                    <AnimatePresence>
                      {isRegionOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          className="absolute z-[160] left-0 right-0 mt-2 bg-white dark:bg-[#252833] rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-black/5 dark:border-white/10 overflow-hidden"
                        >
                          <div className="max-h-48 overflow-y-auto no-scrollbar py-2">
                            {regions.map((region) => (
                              <button 
                                key={region.code}
                                onClick={() => { setSelectedRegion(region.name); setIsRegionOpen(false); }}
                                className="w-full text-left px-5 py-3 hover:bg-primary/10 text-gray-900 dark:text-white font-black text-[11px] uppercase transition-colors flex items-center gap-3 group"
                              >
                                <img src={region.flag} className="w-6 h-4 object-cover rounded-sm shadow-sm grayscale-[0.5] group-hover:grayscale-0 transition-all" alt={region.name} />
                                {region.name}
                                {selectedRegion === region.name && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">CODIGOS (UNO POR LÍNEA)</label>
                  <textarea
                    value={codesText}
                    onChange={(e) => setCodesText(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-mono text-sm shadow-inner outline-none resize-none focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="C4F5-G67T-H99L..."
                  />
                </div>
              </div>

              <div className="p-5 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/[0.02] shrink-0">
                <button 
                  onClick={handleCreate}
                  disabled={loading}
                  className="w-full bg-[#f2b92f] text-black font-black py-4 rounded-xl shadow-[0_10px_20px_rgba(242,185,47,0.2)] hover:brightness-110 active:scale-95 transition-all transform uppercase text-[11px] disabled:opacity-50"
                >
                  {loading ? "CARGANDO..." : "CARGAR INVENTARIO"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
