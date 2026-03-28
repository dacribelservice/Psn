"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import confetti from "canvas-confetti";

interface OrderDetailsViewProps {
  orderData: any;
  onClose: () => void;
  showConfetti?: boolean;
}

export const OrderDetailsView = ({ orderData, onClose, showConfetti = true }: OrderDetailsViewProps) => {
  const { t, language } = useLanguage();

  useEffect(() => {
    if (showConfetti) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.4 },
        colors: ["#22c55e", "#f2b92f", "#ffffff"],
      });
    }
  }, [showConfetti]);

  const handleCopy = () => {
    const textarea = document.getElementById("codes-textarea") as HTMLTextAreaElement;
    if (textarea) {
      navigator.clipboard.writeText(textarea.value);
      const toast = document.getElementById("copy-toast");
      if (toast) {
        toast.classList.add("opacity-100");
        setTimeout(() => toast.classList.remove("opacity-100"), 2000);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: "100%" }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-[100] bg-surface-container-low flex flex-col items-center overflow-y-auto scrollbar-hide pb-20"
    >
      {/* Header */}
      <header className="fixed top-0 w-full z-[110] bg-[#11131b]/80 backdrop-blur-[12px] flex items-center px-4 h-16 border-b border-white/5">
        <div className="flex items-center gap-4 max-w-md mx-auto w-full">
          <button 
            onClick={onClose}
            className="material-symbols-outlined text-[#f7be34] cursor-pointer active:scale-95 duration-200"
          >
            arrow_back
          </button>
          <h1 className="font-headline text-lg tracking-tight text-[#f7be34] font-bold">
            {language === "es" ? "Detalle de Orden" : "Order Details"}
          </h1>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md px-6 pt-24 flex flex-col items-center">
        {/* Success State Visualization */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="relative mb-10"
        >
          {/* Brillo exterior */}
          <div className="absolute inset-0 blur-[40px] rounded-full bg-emerald-500/20 scale-125"></div>
          
          {/* Círculo Principal (Reducido 6 veces) */}
          <div className="relative w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-white/10">
            {/* El "Check" Blanco proporcionado al nuevo tamaño */}
            <motion.span 
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="material-symbols-outlined text-white font-black"
              style={{ 
                fontSize: "40px", 
                lineHeight: "1",
                fontVariationSettings: "'FILL' 1, 'wght' 900" 
              }}
            >
              check
            </motion.span>
          </div>
        </motion.div>

        <h2 className="font-headline font-bold text-3xl mb-2 text-on-surface">
          {language === "es" ? "¡Pago Exitoso!" : "Payment Successful!"}
        </h2>
        <p className="text-white/40 text-sm leading-relaxed mb-8 px-4 text-center">
          {language === "es" 
            ? "Ya puedes disfrutar de tu producto. Gracias por la compra." 
            : "You can now enjoy your product. Thank you for your purchase."}
        </p>

        {/* Transaction Details Card */}
        <div className="bg-[#30334a]/40 backdrop-blur-xl w-full rounded-2xl p-6 mb-10 text-left border border-white/5 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/20 flex items-center justify-center border border-white/5">
                <img 
                  alt="Product Logo" 
                  className="w-8 h-8" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwlSvNIjLatXyidNG5Am2bK-rHDiFxAMcuySaC_ZKPSngTVHUJjr5X_C8Wwr_p3vEraMQzCF6NmuHJcDAcmNMN4lsVu3ZD5d07VY3qMpLJg-Dd3EuZGJmLASst63jvG1wyfTLx7r5nL3hx4F16mLYw9dzTojusBENzAfGk8qwC0COP3ig3PDYd8nJXlH8tgzgSysihJDdD4UcdEjOCLuplWz_QN7d7UOA15acWjmwsa8bsO8oZWezeL68unib-PZ7BPNYlpxubE4aK"
                />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{orderData.product}</h3>
                <p className="text-xs text-white/40">Gift Card Digital</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-wider text-white/40 font-medium mb-0.5">Total</span>
              <span className="text-[#f2b92f] font-bold text-lg leading-tight">{orderData.amount}</span>
            </div>
          </div>

          <div className="space-y-3 border-t border-white/5 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-white/30 font-medium">Transacción</span>
              <span className="text-sm font-mono text-white/60">#TXN-{orderData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-white/30 font-medium">{language === "es" ? "Fecha" : "Date"}</span>
              <span className="text-sm text-white/60">{orderData.fullDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-white/30 font-medium">{language === "es" ? "Método" : "Method"}</span>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#f2b92f]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                <span className="text-sm text-white/60">{orderData.method}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs uppercase tracking-wider text-white/30 font-medium">{language === "es" ? "Cantidad" : "Quantity"}</span>
              <span className="text-sm text-white/60">1</span>
            </div>
          </div>
        </div>

        {/* Action Area */}
        <div className="w-full space-y-4">
          <div className="text-left mb-2">
            <label className="text-xs uppercase tracking-wider text-white/30 font-medium block mb-2">
              {language === "es" ? "Tus Códigos" : "Your Codes"}
            </label>
            <textarea 
              id="codes-textarea"
              className="w-full bg-[#282a32]/80 border-none rounded-xl p-4 text-[#f2b92f] font-mono text-sm resize-none focus:ring-1 focus:ring-primary/20 cursor-text shadow-inner" 
              readOnly 
              rows={3}
              value={orderData.code}
            ></textarea>
          </div>
          
          <button 
            onClick={handleCopy}
            className="w-full py-4 bg-[#f2b92f] text-black font-bold rounded-xl shadow-[0_4px_20px_rgba(242,185,47,0.2)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">content_copy</span>
            {language === "es" ? "Copiar" : "Copy"}
          </button>
          
          <div id="copy-toast" className="text-emerald-500 text-xs font-medium text-center h-4 opacity-0 transition-opacity duration-300">
            {language === "es" ? "Código copiado" : "Code copied"}
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-transparent border-2 border-[#f2b92f]/30 text-[#f2b92f] font-bold rounded-xl hover:bg-[#f2b92f]/5 active:scale-95 transition-all"
          >
            {language === "es" ? "Volver al Inicio" : "Back to Home"}
          </button>
        </div>
      </main>
    </motion.div>
  );
};
