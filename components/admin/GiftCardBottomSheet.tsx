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
  const [value, setValue] = useState(0); // Face Value (Denomination)
  const [costPrice, setCostPrice] = useState(0); // What it costs me
  const [salePrice, setSalePrice] = useState(0); // What client pays
  const [description, setDescription] = useState("");
  const [codesText, setCodesText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(3650); // Tasa por defecto
  const [selectedRegion, setSelectedRegion] = useState("GLOBAL");
  const [dbRegions, setDbRegions] = useState<any[]>([]);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [lowStockAlert, setLowStockAlert] = useState(5);
  const totalCodes = codesText.split("\n").filter(c => c.trim() !== "").length;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: cats } = await supabase.from('categories').select('*').order('name');
        setCategories(cats || []);

        const { data: regs } = await supabase.from('regions').select('*').order('name');
        setDbRegions(regs || []);
      } catch (err) {
        console.error("Error fetching data for giftcard:", err);
      }
    };
    if (isOpen) fetchData();
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
        .eq('region', selectedRegion)
        .single();

      const productDescription = description || `Tarjeta digital original para ${selectedCategory.name} ${selectedRegion}. Entrega inmediata y segura.`;

      if (pError && pError.code === 'PGRST116') {
        const { data: newProd, error: iError } = await supabase
          .from('products')
          .insert([{ 
            name: productName, 
            price: value, // Backward compatibility
            face_value: value,
            cost_price: costPrice,
            sale_price: salePrice,
            category_id: selectedCategory.id,
            region: selectedRegion,
            description: productDescription,
            stock_alert_threshold: lowStockAlert
          }])
          .select()
          .single();
        if (iError) throw iError;
        product = newProd;
      } else if (pError) {
        throw pError;
      } else {
        // Update prices if they changed
        await supabase
          .from('products')
          .update({ 
            face_value: value,
            cost_price: costPrice,
            sale_price: salePrice,
            description, 
            stock_alert_threshold: lowStockAlert 
          })
          .eq('id', product.id);
      }

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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">VALOR (DENOM.)</label>
                    <input
                      type="number"
                      value={value || ""}
                      onChange={(e) => setValue(Number(e.target.value))}
                      className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-black text-lg shadow-inner outline-none focus:ring-1 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1 text-primary">PRECIO CLIENTE</label>
                    <input
                      type="number"
                      value={salePrice || ""}
                      onChange={(e) => setSalePrice(Number(e.target.value))}
                      className="w-full bg-white dark:bg-black/20 border border-primary/20 dark:border-primary/5 rounded-2xl py-4 px-5 text-primary font-black text-lg shadow-inner outline-none focus:ring-1 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="96"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">COSTO GIFT CARD (USDT)</label>
                  <input
                    type="number"
                    value={costPrice || ""}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-black text-lg shadow-inner outline-none focus:ring-1 focus:ring-primary/30 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="91"
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
                    Costo en COP: <span className="text-gray-900 dark:text-white/80">{(costPrice * exchangeRate).toLocaleString()} COP</span>
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
                        {dbRegions.find(r => r.name === selectedRegion)?.flag_url ? (
                          <img 
                            src={dbRegions.find(r => r.name === selectedRegion)?.flag_url} 
                            className="w-5 h-3.5 object-cover rounded-sm shadow-sm" 
                            alt={selectedRegion} 
                          />
                        ) : (
                          <span className="material-symbols-outlined text-sm opacity-40">public</span>
                        )}
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
                            {dbRegions.map((region) => (
                              <button 
                                key={region.id}
                                onClick={() => { setSelectedRegion(region.name); setIsRegionOpen(false); }}
                                className="w-full text-left px-5 py-3 hover:bg-primary/10 text-gray-900 dark:text-white font-black text-[11px] uppercase transition-colors flex items-center gap-3 group"
                              >
                                {region.flag_url ? (
                                  <img src={region.flag_url} className="w-6 h-4 object-cover rounded-sm shadow-sm grayscale-[0.5] group-hover:grayscale-0 transition-all" alt={region.name} />
                                ) : (
                                  <div className="w-6 h-4 bg-black/20 rounded-sm flex items-center justify-center text-[8px] font-bold">?</div>
                                )}
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
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">DETALLE</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-medium text-xs shadow-inner outline-none resize-none focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-gray-300 dark:placeholder:text-white/10"
                    placeholder="Información adicional del producto..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">CODIGOS (UNO POR LÍNEA)</label>
                  <textarea
                    value={codesText}
                    onChange={(e) => setCodesText(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-black/20 border border-black/5 dark:border-white/5 rounded-2xl py-4 px-5 text-gray-900 dark:text-white font-mono text-xs shadow-inner outline-none resize-none focus:ring-1 focus:ring-primary/30 transition-all"
                    placeholder="C4F5-G67T-H99L..."
                  />
                </div>

                {/* Summary Card */}
                <div className="bg-[#2a2d3a] rounded-2xl p-5 shadow-inner border border-white/5 space-y-3">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">TOTAL CÓDIGOS</span>
                      <span className="text-sm font-black text-[#f2b92f]">{totalCodes}</span>
                   </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">TOTAL INVERSIÓN</span>
                       <span className="text-sm font-black text-[#f2b92f]">{(totalCodes * costPrice).toFixed(1)} USDT</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/5 pt-3">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">VENTA ESTIMADA</span>
                       <span className="text-sm font-black text-[#f2b92f]">{(totalCodes * salePrice).toFixed(1)} USDT</span>
                    </div>
                    <div className="flex justify-between items-start border-t border-white/5 pt-3">
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">GANANCIA ESTIMADA</span>
                       <div className="flex flex-col items-end">
                          <span className={`text-sm font-black ${((salePrice - costPrice) * totalCodes) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                             {((salePrice - costPrice) * totalCodes).toFixed(1)} USDT
                          </span>
                          <span className={`text-[10px] font-bold italic ${((salePrice - costPrice) * totalCodes) >= 0 ? 'text-emerald-400/60' : 'text-red-400/60'}`}>
                             ≈ {(((salePrice - costPrice) * totalCodes) * exchangeRate).toLocaleString()} COP
                          </span>
                       </div>
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="space-y-3 pt-2">
                   <label className="text-[10px] font-black text-gray-400 dark:text-white/20 uppercase tracking-[0.2em] ml-1">ALERTA DE STOCK BAJO</label>
                   <div className="flex items-center gap-4">
                      <div className="w-20 bg-[#2a2d3a] rounded-xl overflow-hidden border border-white/5 shadow-inner">
                         <input 
                            type="number"
                            value={lowStockAlert}
                            onChange={(e) => setLowStockAlert(Number(e.target.value))}
                            className="w-full bg-transparent py-3 px-2 text-center text-primary font-black outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                         />
                      </div>
                      <span className="text-[11px] font-bold text-gray-400 dark:text-white/40 italic">Avisar</span>
                   </div>
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
