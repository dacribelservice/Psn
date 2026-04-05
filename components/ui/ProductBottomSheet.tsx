"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Product } from "@/services/inventory";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

interface ProductBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: (amount: number, productId: string, quantity: number) => void;
  category: Category | null;
  allProducts: Product[];
}

export const ProductBottomSheet = ({
  isOpen,
  onClose,
  onProceed,
  category,
  allProducts,
}: ProductBottomSheetProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [showMinAmountAlert, setShowMinAmountAlert] = useState(false);
  
  const [allRegions, setAllRegions] = useState<any[]>([]);

  // Fetch regions from Supabase on mount
  React.useEffect(() => {
    const fetchRegions = async () => {
      try {
        const { data } = await supabase.from('regions').select('*').order('name');
        if (data) {
          setAllRegions(data.map(r => ({
            name: r.name,
            flag: r.flag_url,
            // We use name as code for compatibility if needed, but the UI uses r.name
            code: r.name.toLowerCase()
          })));
        }
      } catch (err) {
        console.error("Error fetching regions:", err);
      }
    };
    fetchRegions();
  }, []);

  // 1. Filter regions that HAVE stock for this category
  const availableRegions = React.useMemo(() => {
    if (!category) return [];
    const regionsInStock = new Set(
      allProducts
        .filter(p => p.category_id === category.id && (p.stock || 0) > 0)
        .map(p => (p as any).region)
    );
    return allRegions.filter(r => regionsInStock.has(r.name));
  }, [category, allProducts]);

  // 2. Filter products for the selected category AND region that HAVE stock
  const categoryProducts = React.useMemo(() => {
    if (!category || !selectedRegion) return [];
    return allProducts.filter(p => 
      p.category_id === category.id && 
      (p as any).region === selectedRegion &&
      (p.stock || 0) > 0
    );
  }, [category, selectedRegion, allProducts]);

  // 3. Auto-select management
  React.useEffect(() => {
    if (availableRegions.length > 0) {
      // If current region is not valid or empty, pick first
      if (!selectedRegion || !availableRegions.find(r => r.name === selectedRegion)) {
        setSelectedRegion(availableRegions[0].name);
      }
    } else {
      setSelectedRegion("");
    }
  }, [availableRegions, selectedRegion]);

  React.useEffect(() => {
    if (categoryProducts.length > 0) {
      if (!selectedProduct || !categoryProducts.find(p => p.id === selectedProduct.id)) {
        setSelectedProduct(categoryProducts[0]);
        setQuantity(1);
      }
    } else {
      setSelectedProduct(null);
      setQuantity(0);
    }
  }, [categoryProducts, selectedProduct]);

  // Handle selectedProduct change specifically to reset quantity
  React.useEffect(() => {
    if (selectedProduct) {
      setQuantity((selectedProduct.stock || 0) > 0 ? 1 : 0);
    }
  }, [selectedProduct?.id]);

  if (selectedProduct && quantity > (selectedProduct.stock || 0)) {
    setQuantity(selectedProduct.stock || 0);
  }

  if (!category) return null;

  const unitPrice = selectedProduct?.sale_price || selectedProduct?.price || 0;

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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 sm:left-1/2 sm:-translate-x-1/2 sm:bottom-8 sm:max-w-[400px] w-full bg-[#e9e9e9] sm:rounded-[2rem] rounded-t-[2.5rem] flex flex-col max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-[101] font-display"
          >
            {/* Handle for mobile */}
            <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mt-3 mb-1 shrink-0 md:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 shrink-0">
               <div className="w-8 h-8" /> {/* Spacer */}
                <div className="text-center">
                   <span className="block text-[9px] font-black text-black/20 uppercase tracking-[0.3em] mb-0.5">{t("category_label")}</span>
                   <h2 className="text-lg font-black text-[#11131b] uppercase tracking-tighter">{t("select_product")}</h2>
                </div>
               <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-black/40 hover:bg-black/10 hover:text-black transition-colors"
               >
                 <span className="material-symbols-outlined text-[18px]">close</span>
               </button>
            </div>

            <div className="px-6 py-2 overflow-y-auto flex-1 no-scrollbar space-y-6">
               {/* Platform & Region */}
               <div className="flex items-center justify-between px-2 pt-0">
                  <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/[0.03] overflow-hidden">
                         {category.image_url ? (
                           <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
                         ) : (
                           <span className="material-symbols-outlined text-xl text-black/60">
                             {category.slug.includes('gift') ? 'card_giftcard' : 'sports_esports'}
                           </span>
                         )}
                      </div>
                     <span className="font-black text-[#11131b] text-base tracking-tight">{category.name}</span>
                  </div>
                  
                   <div className="relative">
                    {availableRegions.length > 0 ? (
                      <button 
                        onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                        className="flex items-center space-x-2 px-2.5 py-1.5 bg-white rounded-full hover:bg-black/5 transition-all shadow-sm active:scale-95 group border border-black/[0.03]"
                      >
                        <img 
                          alt={selectedRegion} 
                          className="w-3.5 h-2.5 rounded-sm object-cover" 
                          src={allRegions.find(r => r.name === selectedRegion)?.flag || "/Logos/dacribel.png"} 
                        />
                        <span className="text-[11px] font-black text-[#11131b]">{selectedRegion || "Sin Stock"}</span>
                        {availableRegions.length > 1 && (
                          <span className={`material-symbols-outlined text-[14px] text-black/20 group-hover:text-[#f7be34] transition-transform duration-300 ${isRegionDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 px-2.5 py-1.5 bg-black/5 rounded-full opacity-50">
                        <span className="text-[10px] font-black text-black/40 uppercase">No disp.</span>
                      </div>
                    )}

                    <AnimatePresence>
                      {isRegionDropdownOpen && availableRegions.length > 1 && (
                        <motion.div 
                          initial={{ opacity: 0, y: 5, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-black/5 z-[150] overflow-hidden"
                        >
                          <div className="max-h-48 overflow-y-auto no-scrollbar py-1">
                            {availableRegions.map((r, idx) => (
                              <button 
                                key={r.name + idx}
                                onClick={() => { setSelectedRegion(r.name); setIsRegionDropdownOpen(false); }}
                                className="w-full flex items-center space-x-2 px-3 py-2.5 hover:bg-black/5 transition-colors text-left"
                              >
                                <img src={r.flag} className="w-4 h-3 object-cover rounded-sm" alt={r.name} />
                                <span className="text-[10px] font-black text-black/60 uppercase">{r.name}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
               </div>

                <div>
                  <div className="flex items-center justify-between px-2">
                   <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em]">{t("denomination")}</p>
                   {selectedProduct && (
                     <div className={`px-4 py-1.5 rounded-full border shadow-sm animate-in fade-in zoom-in duration-300 transition-colors ${
                        ((selectedProduct?.stock || 0) - quantity) > 0 
                        ? 'bg-[#e7f9f4] border-teal-500/10' 
                        : 'bg-red-500/10 border-red-500/10'
                     }`}>
                        <p className={`text-[9px] font-black uppercase tracking-[0.1em] flex items-center gap-1.5 ${
                          ((selectedProduct?.stock || 0) - quantity) > 0 ? 'text-[#00a676]' : 'text-red-500'
                        }`}>
                           <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                             ((selectedProduct?.stock || 0) - quantity) > 0 ? 'bg-[#00a676]' : 'bg-red-500'
                           }`}></span>
                           {Math.max(0, (selectedProduct?.stock || 0) - quantity)} {t("in_stock")}
                        </p>
                     </div>
                   )}
                </div>
                  <div className="flex space-x-3 overflow-x-auto py-2 pb-4 custom-scrollbar-light scroll-smooth">
                     {categoryProducts.length > 0 ? categoryProducts.map((prod) => {
                        const amountMatch = prod.name.match(/\$(\d+)/);
                        const label = amountMatch ? `$${amountMatch[1]}` : prod.name;
                        
                        return (
                          <button 
                            key={prod.id}
                            onClick={() => setSelectedProduct(prod)}
                            className={`min-w-[45px] px-3 h-9 rounded-full font-black text-[11px] transition-all flex-shrink-0 flex items-center justify-center relative ${
                              selectedProduct?.id === prod.id
                              ? 'bg-[#f7be34] text-[#402d00]' 
                              : 'bg-black/5 text-black/40 hover:bg-black/10'
                            }`}
                          >
                            {label}
                          </button>
                        );
                     }) : (
                        <div className="w-full py-4 text-center bg-black/5 rounded-2xl border border-dashed border-black/10">
                           <span className="text-[10px] font-black text-black/30 uppercase">{t("no_stock")}</span>
                        </div>
                     )}
                  </div>
               </div>

                <div className="flex items-center justify-between px-1">
                   <div>
                      <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-1">{t("unit_cost")}</p>
                      <p className="text-3xl font-black text-[#11131b] tracking-tighter">${unitPrice.toFixed(2)} <span className="text-[11px] text-[#f7be34] uppercase font-black">USDT</span></p>
                   </div>
                      
                   <div className="flex items-center bg-white/40 p-1.5 rounded-full border border-black/[0.03] shadow-inner gap-4">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          disabled={quantity <= 1 || (selectedProduct?.stock || 0) === 0}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-black/5 transition-colors text-black/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                           <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="text-[#11131b] font-black text-base">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(Math.min(selectedProduct?.stock || 0, quantity + 1))}
                          disabled={!selectedProduct || quantity >= (selectedProduct?.stock || 0)}
                          className={`w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-black/5 transition-all text-black/40 active:scale-90 disabled:opacity-0 disabled:pointer-events-none`}
                        >
                           <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                  </div>
               </div>

                {/* Description */}
                <div className="px-1">
                   <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-1">{t("product_details")}</p>
                   <p className="text-black/60 text-sm leading-relaxed font-bold bg-black/5 p-4 rounded-2xl border border-black/[0.02]">
                     {selectedProduct?.description || `Tarjeta digital disponible para ${category.name} ${selectedRegion}. Entrega inmediata y segura.`}
                   </p>
                </div>
            </div>

            <div className="mt-4 p-6 pb-28 md:pb-6 bg-white/50 backdrop-blur-xl flex items-center justify-between shrink-0">
               <div className="flex flex-col">
                  <p className="text-[9px] font-black text-black uppercase tracking-[0.2em] mb-0.5">{t("total_to_pay") || "Total a pagar"}</p>
                  <div className="flex flex-col leading-none">
                    <span className="text-[11px] font-black text-black/30 tracking-tight opacity-50">${(unitPrice * quantity).toFixed(2)} USDT</span>
                    <p className="text-2xl font-black text-[#11131b] tracking-tighter shadow-sm">
                      ${((unitPrice * quantity) + 0.01).toFixed(2)} 
                      <span className="text-[10px] text-[#f7be34] uppercase font-black ml-1">USDT</span>
                    </p>
                    <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-widest mt-1">Incluye comisión BEP-20 (0.01)</span>
                  </div>
               </div>
                <button 
                  onClick={() => {
                    const totalWithCommission = (unitPrice * quantity) + 0.01;
                    
                    if (totalWithCommission < 6.5) {
                      setShowMinAmountAlert(true);
                      return;
                    }

                    if (!user) {
                      router.push("/login");
                      onClose();
                      return;
                    }
                    if ((selectedProduct?.stock || 0) <= 0) return;
                    onProceed?.(totalWithCommission, selectedProduct?.id || '', quantity);
                  }}
                  disabled={(selectedProduct?.stock || 0) <= 0}
                  className={`font-black py-4 px-8 rounded-xl transition-all uppercase tracking-[0.05em] text-[11px] ${
                    (selectedProduct?.stock || 0) <= 0
                    ? 'bg-black/10 text-black/20 cursor-not-allowed shadow-none'
                    : 'bg-[#f7be34] text-[#402d00] shadow-[0_15px_30px_rgba(247,190,52,0.25)] hover:scale-105 active:scale-95'
                  }`}
                >
                  {(selectedProduct?.stock || 0) <= 0 ? (t("out_of_stock") || 'Agotado') : (t("pay_now") || 'Pagar ahora')}
                </button>
            </div>
          </motion.div>

          {/* Min Amount Alert */}
          <AnimatePresence>
            {showMinAmountAlert && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center z-[200] p-6"
              >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMinAmountAlert(false)} />
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  className="bg-[#11131b] border border-white/10 p-8 rounded-[2rem] w-full max-w-xs relative shadow-2xl text-center"
                >
                  <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
                  </div>
                  <h3 className="text-white font-black text-xl mb-3 tracking-tight">Monto Insuficiente</h3>
                  <p className="text-white/60 text-sm font-bold leading-relaxed mb-8">
                    El monto mínimo requerido es de <span className="text-[#f7be34]">6.50 USDT</span>. La red BEP-20 (Binance Smart Chain) no permite procesar pagos inferiores a este valor.
                  </p>
                  <button 
                    onClick={() => setShowMinAmountAlert(false)}
                    className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl active:scale-95 transition-all shadow-lg"
                  >
                    Entendido
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
};
