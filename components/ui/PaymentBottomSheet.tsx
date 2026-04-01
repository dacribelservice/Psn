"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (method: 'trc20' | 'bep20') => void;
}

export const PaymentBottomSheet: React.FC<PaymentBottomSheetProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [method, setMethod] = useState<'trc20' | 'bep20'>('bep20');

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#e9e9e9] rounded-t-[2.5rem] z-[70] max-w-md mx-auto shadow-[0_-20px_50px_rgba(0,0,0,0.3)] flex flex-col font-sans overflow-hidden"
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mt-3 mb-1 shrink-0 md:hidden" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 shrink-0">
               <div className="w-8 h-8" />
               <div className="text-center">
                  <span className="block text-[11px] font-black text-black/30 uppercase tracking-[0.25em] mb-0.5">Checkout</span>
                  <h2 className="text-xl font-black text-[#11131b] uppercase tracking-tighter">Canal de Pago</h2>
               </div>
               <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 text-black/40 hover:bg-black/10 transition-colors"
               >
                 <span className="material-symbols-outlined text-[18px]">close</span>
               </button>
            </div>

            <div className="p-6 flex flex-col space-y-6">
               <div className="space-y-4">
                  <label className="block text-[11px] font-black text-black/30 uppercase tracking-[0.25em] ml-1">
                     Red de Pago
                  </label>
                  
                  <div className="relative flex p-1.5 bg-[#11131b] rounded-2xl border border-black/5 shadow-inner">
                     {/* Indicator */}
                     <motion.div 
                        animate={{ x: method === 'trc20' ? 0 : '100%' }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-1.5 left-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] bg-[#f7be34] rounded-xl shadow-lg z-0" 
                     />
                     
                     <button 
                        onClick={() => setMethod('trc20')}
                        className={`relative z-10 flex-1 py-4 text-xs font-black transition-all uppercase tracking-widest ${
                           method === 'trc20' ? 'text-[#402d00]' : 'text-white/40 hover:text-white'
                        }`}
                     >
                        TRC20-USDT
                     </button>
                     <button 
                        onClick={() => setMethod('bep20')}
                        className={`relative z-10 flex-1 py-4 text-xs font-black transition-all uppercase tracking-widest ${
                           method === 'bep20' ? 'text-[#402d00]' : 'text-white/40 hover:text-white'
                        }`}
                     >
                        BEP20-USDT
                     </button>
                  </div>
                  
                  <p className="text-[11px] text-black/40 italic text-center px-4 leading-relaxed font-medium">
                     * Cada canal de pago incurre en una comisión de red que es asumida por el usuario al realizar la transferencia.
                  </p>
               </div>
            </div>

            {/* Action */}
            <div className="p-4 bg-white/50 backdrop-blur-xl border-t border-black/[0.03] pb-28 md:pb-8">
               <button 
                  onClick={() => onConfirm(method)}
                  className="w-full bg-[#f7be34] text-[#402d00] font-black py-3 rounded-full shadow-[0_10px_20px_rgba(247,190,52,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.1em] text-[10px]"
               >
                  Confirmar Pago
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
