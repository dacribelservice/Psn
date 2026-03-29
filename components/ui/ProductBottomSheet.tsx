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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const categoryProducts = allProducts.filter(p => p.category_id === category?.id);

  React.useEffect(() => {
    if (categoryProducts.length > 0 && !selectedProduct) {
      setSelectedProduct(categoryProducts[0]);
    }
  }, [categoryProducts, selectedProduct]);

  if (!category) return null;

  const unitPrice = selectedProduct?.price || 0;

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
                  <span className="block text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-0.5">Categoría</span>
                  <h2 className="text-2xl font-black text-[#11131b] uppercase tracking-tighter">Seleccionar Producto</h2>
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
                     <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-black/[0.03]">
                        <span className="material-symbols-outlined text-2xl text-black/60">
                          {category.slug.includes('gift') ? 'card_giftcard' : 'sports_esports'}
                        </span>
                     </div>
                     <span className="font-black text-[#11131b] text-base tracking-tight">{category.name}</span>
                  </div>
                  
                  <button className="flex items-center space-x-2 px-2.5 py-1.5 bg-white rounded-full hover:bg-[#f7be34]/10 transition-all shadow-sm active:scale-95 group border border-black/[0.03]">
                     <img 
                      alt="USA Flag" 
                      className="w-3.5 h-2.5 rounded-sm object-cover" 
                      src="https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg" 
                     />
                     <span className="text-[11px] font-black text-[#11131b]">USA</span>
                     <span className="material-symbols-outlined text-[14px] text-black/20 group-hover:text-[#f7be34] transition-colors">expand_more</span>
                  </button>
               </div>

               {/* Denominations */}
               <div>
                  <span className="block text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-3 ml-1">Denominación</span>
                  <div className="flex space-x-3 overflow-x-auto py-2 pb-4 custom-scrollbar-light scroll-smooth">
                     {categoryProducts.map((prod) => {
                        const amountMatch = prod.name.match(/\$(\d+)/);
                        const label = amountMatch ? `$${amountMatch[1]}` : prod.name;
                        const isOutOfStock = (prod.stock || 0) <= 0;
                        
                        return (
                          <button 
                            key={prod.id}
                            onClick={() => !isOutOfStock && setSelectedProduct(prod)}
                            className={`min-w-[50px] px-4 h-11 rounded-full font-black text-[13px] transition-all flex-shrink-0 flex items-center justify-center relative ${
                              selectedProduct?.id === prod.id
                              ? 'bg-[#f7be34] text-[#402d00] shadow-[0_10px_20px_rgba(247,190,52,0.2)] scale-110 border-2 border-white/50' 
                              : isOutOfStock 
                                ? 'bg-black/5 text-black/20 cursor-not-allowed opacity-50'
                                : 'bg-black/5 text-black/40 hover:bg-black/10'
                            }`}
                          >
                            {label}
                            {isOutOfStock && (
                              <span className="absolute -top-1 -right-1 text-[6px] bg-red-500 text-white px-1 rounded-full font-black">SOLDOUT</span>
                            )}
                          </button>
                        );
                     })}
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
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-black/5 transition-colors text-black/40 active:scale-90"
                        >
                           <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="text-[#11131b] font-black text-base">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:bg-black/5 transition-colors text-black/40 active:scale-90"
                        >
                           <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                  </div>
               </div>

               {/* Description */}
               <div className="px-1">
                  <p className="text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-1">Detalles del vault</p>
                  <p className="text-black/60 text-sm leading-relaxed font-medium">
                    {selectedProduct?.description || `Tarjeta digital original para ${category.name} USA. Entrega inmediata y segura.`}
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
