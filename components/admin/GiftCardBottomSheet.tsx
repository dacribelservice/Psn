"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface GiftCardBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newData: any) => void;
}

export const GiftCardBottomSheet = ({ isOpen, onClose, onCreate }: GiftCardBottomSheetProps) => {
  const [platform, setPlatform] = useState("Seleccione una plataforma...");
  const [value, setValue] = useState(0);
  const [rate, setRate] = useState(3650);
  const [region, setRegion] = useState("USA");
  const [codesText, setCodesText] = useState("");
  const [stockAlert, setStockAlert] = useState(1);
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const platforms = [
    { id: "PS", name: "PlayStation", icon: "videogame_asset" },
    { id: "XB", name: "Xbox", icon: "sports_esports" },
    { id: "NT", name: "Nintendo", icon: "joystick" },
    { id: "ST", name: "Steam", icon: "laptop_chromebook" },
  ];

  const regions = [
    { id: "USA", name: "USA", flag: "🇺🇸" },
    { id: "COL", name: "Colombia", flag: "🇨🇴" },
    { id: "MEX", name: "Mexico", flag: "🇲🇽" },
  ];

  const handleCreate = () => {
    const codesArray = codesText.split("\n").filter(c => c.trim() !== "");
    const totalUSDT = value * codesArray.length;
    const totalCOP = totalUSDT * rate;

    const newGiftCard = {
      platform: platform === "Seleccione una plataforma..." ? "PS" : platform,
      name: platforms.find(p => p.name === platform)?.name || "PlayStation",
      value,
      rate,
      region,
      codes: codesArray,
      stock: codesArray.length,
      stockAlert,
      totalUSDT,
      totalCOP,
      active: true
    };

    onCreate(newGiftCard);
    onClose();
    // Reset form
    setPlatform("Seleccione una plataforma...");
    setValue(0);
    setCodesText("");
  };

  const estimatedCOP = (value * rate).toLocaleString("es-CO");
  const totalUSDT = (value * codesText.split("\n").filter(c => c.trim() !== "").length).toLocaleString("en-US");
  const totalCOP = (value * codesText.split("\n").filter(c => c.trim() !== "").length * rate).toLocaleString("es-CO");

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <div className="fixed inset-0 flex items-end sm:items-center justify-center pointer-events-none z-[110] p-0 sm:p-4">
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-sm bg-[#e9e9e9] dark:bg-[#1e1e1e] rounded-t-[2.5rem] sm:rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden pointer-events-auto border border-white/5 max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-white/5 shrink-0">
                <div className="w-8" />
                <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] text-center flex-1">
                  NUEVA GIFT CARD
                </h2>
                <button 
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 text-gray-500 dark:text-white"
                >
                   <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col space-y-5 overflow-y-auto no-scrollbar custom-scrollbar">
                
                {/* Platform Selector */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    PLATAFORMA
                  </label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsPlatformOpen(!isPlatformOpen)}
                      className="w-full flex items-center justify-between bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-5 focus:ring-1 focus:ring-primary transition-all outline-none text-gray-900 dark:text-gray-100 font-bold shadow-inner text-xs"
                    >
                      <span>{platform}</span>
                      <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isPlatformOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    
                    <AnimatePresence>
                      {isPlatformOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#30334a] rounded-xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
                        >
                          <ul className="py-1">
                            {platforms.map((p) => (
                              <li key={p.id}>
                                <button 
                                  onClick={() => { setPlatform(p.name); setIsPlatformOpen(false); }}
                                  className="w-full text-left px-5 py-2.5 text-gray-700 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 font-bold text-xs"
                                >
                                  <span className="material-symbols-outlined text-[16px] opacity-40">{p.icon}</span>
                                  {p.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Value Input */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    VALOR NOMINAL
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-5 text-gray-400 dark:text-white/20 material-symbols-outlined text-lg">attach_money</span>
                    <input
                      type="number"
                      value={value || ""}
                      onChange={(e) => setValue(Number(e.target.value))}
                      placeholder="0"
                      className="w-full bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-3 pl-12 pr-5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-black text-sm outline-none shadow-inner"
                    />
                  </div>
                </div>

                {/* Exchange Rate */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    Tasa de Cambio (1 USDT a COP)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-5 text-gray-400 dark:text-white/20 material-symbols-outlined text-lg">currency_exchange</span>
                    <input
                      type="number"
                      value={rate || ""}
                      onChange={(e) => setRate(Number(e.target.value))}
                      placeholder="3.650"
                      className="w-full bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-3 pl-12 pr-5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-white font-black text-sm outline-none shadow-inner"
                    />
                  </div>
                  <p className="px-1 text-[9px] font-bold text-gray-400 dark:text-white/20 italic">
                    Costo estimado: <span className="text-gray-900 dark:text-white">{estimatedCOP} COP</span>
                  </p>
                </div>

                {/* Region Selector */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    REGIÓN DEL CODIGO
                  </label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsRegionOpen(!isRegionOpen)}
                      className="w-full flex items-center justify-between bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-5 focus:ring-1 focus:ring-primary transition-all outline-none text-gray-900 dark:text-gray-100 font-bold shadow-inner text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span>{regions.find(r => r.id === region)?.flag}</span>
                        <span>{regions.find(r => r.id === region)?.name}</span>
                      </div>
                      <span className={`material-symbols-outlined text-sm transition-transform duration-300 ${isRegionOpen ? 'rotate-180' : ''}`}>expand_more</span>
                    </button>
                    
                    <AnimatePresence>
                      {isRegionOpen && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute z-50 left-0 right-0 mt-2 bg-white dark:bg-[#30334a] rounded-xl shadow-2xl border border-gray-100 dark:border-white/5 overflow-hidden"
                        >
                          <ul className="py-1">
                            {regions.map((r) => (
                              <li key={r.id}>
                                <button 
                                  onClick={() => { setRegion(r.id); setIsRegionOpen(false); }}
                                  className="w-full text-left px-5 py-2.5 text-gray-700 dark:text-white hover:bg-primary/10 hover:text-primary transition-colors flex items-center gap-3 font-bold text-xs"
                                >
                                  <span className="text-base">{r.flag}</span>
                                  {r.name}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Codes Textarea */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    CARGAR CÓDIGOS
                  </label>
                  <textarea
                    value={codesText}
                    onChange={(e) => setCodesText(e.target.value)}
                    rows={3}
                    placeholder="Ingrese los códigos aquí..."
                    className="w-full bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-3 px-5 focus:ring-1 focus:ring-primary text-gray-900 dark:text-gray-100 font-mono text-xs outline-none shadow-inner resize-none"
                  />
                  
                  <div className="p-4 rounded-xl bg-gray-100 dark:bg-black/20 border border-black/5 dark:border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-500 dark:text-white/20 uppercase tracking-widest">
                      <span>Total Códigos</span>
                      <span className="text-xs text-gray-900 dark:text-white font-bold">{codesText.split("\n").filter(c => c.trim() !== "").length}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] font-black text-gray-500 dark:text-white/20 uppercase tracking-widest pt-2 border-t border-black/5 dark:border-white/5">
                      <span>Inversión (USDT)</span>
                      <span className="text-xs text-gray-900 dark:text-white font-bold">{totalUSDT}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Alert */}
                <div className="space-y-2">
                  <label className="block text-[9px] font-black text-gray-500 dark:text-white/30 uppercase tracking-[0.2em]">
                    ALERTA DE STOCK BAJO
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center w-20">
                      <input
                        type="number"
                        value={stockAlert}
                        onChange={(e) => setStockAlert(Number(e.target.value))}
                        className="w-full bg-gray-300/50 dark:bg-[#30334a] border border-black/5 dark:border-white/5 rounded-xl py-2.5 px-4 text-center text-gray-900 dark:text-white font-black text-xs outline-none shadow-inner"
                      />
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-white/20 uppercase">Avisar</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 pt-2 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-transparent pb-8 flex gap-3">
                <button 
                  onClick={onClose}
                  className="flex-1 border border-gray-300 dark:border-white/10 text-gray-400 dark:text-white/30 font-black py-3 px-4 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all uppercase tracking-widest text-[10px]"
                >
                  CANCELAR
                </button>
                <button 
                  onClick={handleCreate}
                  className="flex-1 bg-[#f2b92f] text-black font-black py-3 px-4 rounded-xl shadow-[0_10px_20px_rgba(242,185,47,0.2)] hover:brightness-110 active:scale-95 transition-all transform uppercase tracking-widest text-[10px]"
                >
                  CREAR
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
