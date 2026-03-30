"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Product } from "@/services/inventory";

interface ProductBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed?: (amount: number, productId: string) => void;
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
  const [quantity, setQuantity] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  
  const allRegions = [
    { name: "Global", code: "un", flag: "https://flagcdn.com/w40/un.png" },
    { name: "USA", code: "us", flag: "https://flagcdn.com/w40/us.png" },
    { name: "Colombia", code: "co", flag: "https://flagcdn.com/w40/co.png" },
    { name: "Brazil", code: "br", flag: "https://flagcdn.com/w40/br.png" },
    { name: "Argentina", code: "ar", flag: "https://flagcdn.com/w40/ar.png" },
    { name: "Turkia", code: "tr", flag: "https://flagcdn.com/w40/tr.png" },
    { name: "India", code: "in", flag: "https://flagcdn.com/w40/in.png" },
  ];

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
       setQuantity(selectedProduct.stock > 0 ? 1 : 0);
    }
  }, [selectedProduct?.id]);

  if (selectedProduct && quantity > (selectedProduct.stock || 0)) {
    setQuantity(selectedProduct?.stock || 0);
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
                   <span className="block text-[9px] font-black text-black/20 uppercase tracking-[0.3em] mb-0.5">Categoría</span>
                   <h2 className="text-lg font-black text-[#11131b] uppercase tracking-tighter">Seleccionar Producto</h2>
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
                          src={availableRegions.find(r => r.name === selectedRegion)?.flag || allRegions.find(r => r.name === "Global")?.flag} 
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
                            {availableRegions.map((r) => (
                              <button 
                                key={r.code}
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
                  <div className="flex justify-between items-center mb-3 pr-2">
                    <span className="block text-[11px] font-black text-black/30 uppercase tracking-[0.25em] ml-1">Denominación</span>
                    {selectedProduct && (
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border transition-all duration-300 ${
                         ((selectedProduct?.stock || 0) - quantity) > 0 
                         ? 'text-emerald-600 bg-emerald-100/50 border-emerald-200' 
                         : 'text-red-600 bg-red-100/50 border-red-200'
                      }`}>
                        {Math.max(0, (selectedProduct?.stock || 0) - quantity)} EN STOCK
                      </span>
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
                            className={`min-w-[50px] px-4 h-11 rounded-full font-black text-[13px] transition-all flex-shrink-0 flex items-center justify-center relative ${
                              selectedProduct?.id === prod.id
                              ? 'bg-[#f7be34] text-[#402d00] shadow-[0_10px_20px_rgba(247,190,52,0.25)] scale-110 border-2 border-white/50' 
                              : 'bg-black/5 text-black/40 hover:bg-black/10'
                            }`}
                          >
                            {label}
                          </button>
                        );
                     }) : (
                        <div className="w-full py-4 text-center bg-black/5 rounded-2xl border border-dashed border-black/10">
                           <span className="text-[10px] font-black text-black/30 uppercase">No hay stock disponible</span>
                        </div>
                     )}
                  </div>
               </div>

               {/* Quantity & Unit Cost */}
               <div className="flex items-center justify-between px-2">
                  <div>
                     <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-0.5">Costo unitario</p>
                     <p className="text-2xl font-black text-[#11131b] tracking-tighter">${unitPrice.toFixed(2)} <span className="text-[11px] text-[#f7be34] uppercase font-black">USDT</span></p>
                  </div>
                  
                  <div className="flex items-center justify-between bg-black/5 p-1 rounded-full w-32 border border-black/[0.03]">
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
                   <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-1">Detalles del vault</p>
                   <p className="text-black/60 text-sm leading-relaxed font-bold bg-black/5 p-4 rounded-2xl border border-black/[0.02]">
                     {selectedProduct?.description || `Tarjeta digital disponible para ${category.name} ${selectedRegion}. Entrega inmediata y segura.`}
                   </p>
                </div>
            </div>

            {/* Total & Action */}
            <div className="mt-4 p-6 bg-white/50 backdrop-blur-xl flex items-center justify-between shrink-0">
               <div>
                  <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-0.5">Total a pagar</p>
                  <p className="text-2xl font-black text-[#11131b] tracking-tighter">${(unitPrice * quantity).toFixed(2)} <span className="text-[11px] text-[#f7be34] uppercase font-black">USDT</span></p>
               </div>
                <button 
                  onClick={() => {
                    if ((selectedProduct?.stock || 0) <= 0) return;
                    onProceed?.(unitPrice * quantity, selectedProduct?.id || '');
                  }}
                  disabled={(selectedProduct?.stock || 0) <= 0}
                  className={`font-black py-4 px-8 rounded-xl transition-all uppercase tracking-[0.05em] text-[11px] ${
                    (selectedProduct?.stock || 0) <= 0
                    ? 'bg-black/10 text-black/20 cursor-not-allowed shadow-none'
                    : 'bg-[#f7be34] text-[#402d00] shadow-[0_15px_30px_rgba(247,190,52,0.25)] hover:scale-105 active:scale-95'
                  }`}
                >
                  {(selectedProduct?.stock || 0) <= 0 ? 'Agotado' : 'Pagar ahora'}
                </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
