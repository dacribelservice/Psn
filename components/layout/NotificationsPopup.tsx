"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";

interface NotificationsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsPopup = ({ isOpen, onClose }: NotificationsPopupProps) => {
  const { t, language } = useLanguage();
  const [criticalItems, setCriticalItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!isOpen) return;

    const fetchCriticalInventory = async () => {
      try {
        setLoading(true);
        // Usamos la misma lógica que en el dashboard de inventario
        const { data: products, error } = await supabase
          .from('products')
          .select('name, id');
        
        if (error) throw error;

        // Para cada producto, contar códigos disponibles
        const itemsWithStock = await Promise.all((products || []).map(async (p: any) => {
          const { count } = await supabase
            .from('inventory_codes')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', p.id)
            .eq('status', 'available');
          
          return {
            label: p.name,
            icon: p.name.toLowerCase().includes('xbox') ? "videogame_asset" : "sports_esports",
            count: count || 0
          };
        }));

        // Filtrar solo los que tienen poco stock (<= 5)
        const lowStock = itemsWithStock.filter(item => item.count <= 5);
        setCriticalItems(lowStock);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCriticalInventory();
  }, [isOpen]);

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
            className="fixed inset-0 z-[1000] bg-black/5"
          />

          {/* Compact Inventory Notification Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, x: -10, originX: 0.8, originY: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: -10 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed top-16 right-16 z-[1001] w-full max-w-[260px] bg-[#1a1c2e]/95 backdrop-blur-2xl rounded-[1.25rem] border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden font-headline"
          >
            {/* Modal Header */}
            <div className="px-4 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[18px]">warning</span>
                <div>
                  <p className="text-[6px] uppercase tracking-[0.2em] font-black text-white/40 leading-none mb-1">
                    {t("system_status")}
                  </p>
                  <h2 className="tracking-tight text-white text-[14px] font-black leading-none">
                    {t("inventory")}
                  </h2>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors group"
              >
                <span className="material-symbols-outlined text-white/40 group-hover:text-white text-[18px]">close</span>
              </button>
            </div>

            {/* Modal Content - Compact List */}
            <div className="px-4 py-2 min-h-[100px] flex flex-col justify-center">
              {loading ? (
                <div className="py-8 text-center">
                  <span className="text-[10px] font-black text-white/20 uppercase animate-pulse">Cargando...</span>
                </div>
              ) : criticalItems.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-400/30 text-3xl">check_circle</span>
                  <span className="text-[10px] font-black text-white/20 uppercase">{t("all_good") || (language === 'es' ? 'Todo al día' : 'Everything ok')}</span>
                </div>
              ) : (
                criticalItems.slice(0, 3).map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col">
                    <div className="flex items-center justify-between py-2.5 group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-primary/30 transition-all">
                          <span className="material-symbols-outlined text-primary text-[16px]">
                            {item.icon}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-[11px] mb-0.5 tracking-tight truncate max-w-[100px]">{item.label}</h3>
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(247,190,52,0.4)]"></span>
                            <span className="text-[9px] text-primary/80 font-black uppercase tracking-tighter">
                              {t("low_stock")}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-primary text-base leading-none tracking-tighter">{item.count}</p>
                        <p className="uppercase tracking-widest font-black text-white/20 text-[7px]">
                          {t("units")}
                        </p>
                      </div>
                    </div>
                    {idx < criticalItems.length - 1 && idx < 2 && <div className="h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>}
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-4 pb-5 pt-2">
              <button className="w-full py-2.5 rounded-xl bg-primary text-background font-black text-[10px] uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_20px_rgba(242,185,47,0.2)]">
                {t("review_all")}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
