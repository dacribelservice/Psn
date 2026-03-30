"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { CategoryBottomSheet } from "@/components/admin/CategoryBottomSheet";
import { GiftCardBottomSheet } from "@/components/admin/GiftCardBottomSheet";
import { inventoryService } from "@/services/inventory";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function AdminInventoryPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isGiftCardSheetOpen, setIsGiftCardSheetOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const adminProducts = await inventoryService.getAdminInventory();
      setProducts(adminProducts);

      const { data: realCodes } = await supabase
        .from('inventory_codes')
        .select('*, product:products(name, price, category_id)')
        .order('created_at', { ascending: false });
      
      setCodes(realCodes || []);
    } catch (err) {
      console.error("Error fetching admin inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este código?")) return;
    try {
      const { error } = await supabase.from('inventory_codes').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error("Error deleting code:", err);
      alert("Error al eliminar el código");
    }
  };

  React.useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // Derived Metrics (Active Inventory Investment)
  const activeCodes = codes.filter(c => c.status === 'available');
  const totalInvertedUSDT = activeCodes.reduce((acc, item) => acc + (item.face_value || item.product?.price || 0), 0);
  const totalInvertedCOP = activeCodes.reduce((acc, item) => acc + ((item.face_value || item.product?.price || 0) * (item.usd_rate || 4000)), 0);
  const criticalItems = products.filter(item => (item.stock || 0) <= (item.stock_alert_threshold || 5)).map(item => ({ name: item.name, stock: item.stock || 0 }));
  const activeCodesCount = activeCodes.length;

  const metrics = [
    { label: t("total_invested"), value: totalInvertedUSDT.toLocaleString(), sub: `$${totalInvertedCOP.toLocaleString()} COP`, unit: "USDT", icon: "payments", color: "primary" },
    { label: t("daily_sales"), value: "0", sub: "$0 COP", unit: "USDT", icon: "point_of_sale", color: "primary" },
    { label: t("critical_inventory"), alerts: criticalItems.slice(0, 2), icon: "warning", color: criticalItems.length > 0 ? "red" : "primary" },
    { label: t("active_codes"), value: activeCodesCount.toString(), sub: "Actualizado", icon: "sync", color: "primary" },
  ];

  return (
    <div className="flex min-h-screen bg-[#11131b] text-on-surface font-sans antialiased">
      <AdminSidebar />
      <AdminHeader />

      <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-8 space-y-8 overflow-x-hidden">
        {/* Metrics Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((item, idx) => (
            <div key={idx} className={`bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-none`}>
               <div className="flex justify-between items-start z-10 w-full">
                  <span className={`text-label-sm uppercase ${item.color === 'red' ? 'text-red-400' : 'text-white/30'}`}>{item.label}</span>
                  <span className={`material-symbols-outlined text-[18px] opacity-20 group-hover:opacity-40 transition-opacity`}>{item.icon}</span>
               </div>
               
               <div className="z-10 mt-auto">
                 {item.alerts ? (
                    <div className="space-y-1.5">
                      {item.alerts.length > 0 ? item.alerts.map((alert, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-xl">
                          <span className="text-label-sm text-white/40 truncate mr-2">{alert.name}</span>
                          <span className="text-label-sm text-red-400 whitespace-nowrap">STOCK: {alert.stock}</span>
                        </div>
                      )) : (
                        <div className="text-label-sm text-green-400 uppercase">Sin alertas</div>
                      )}
                    </div>
                 ) : (
                   <>
                    <div className="text-label-sm text-white/20 uppercase mb-1">{item.sub}</div>
                    <div className="text-xl md:text-2xl font-display text-white flex items-baseline gap-1.5 leading-none">
                      {item.value} <span className="text-[14px] font-black text-primary uppercase">{item.unit || ""}</span>
                    </div>
                   </>
                 )}
               </div>
               <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[80px] opacity-10 ${item.color === 'red' ? 'bg-red-500' : 'bg-primary'}`}></div>
            </div>
          ))}
        </section>

        {/* Stock Summary */}
        <section className="bg-[#191b23] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-none">
          <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h4 className="text-label-sm text-white/40 uppercase">{t("stock_summary")}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-white/5 md:divide-y-0">
             {products.map((item, idx) => {
                const platform = item.name.toLowerCase().includes('playstation') ? 'PS' : item.name.toLowerCase().includes('xbox') ? 'XB' : 'NT';
                return (
                  <div key={idx} className="flex items-center justify-between px-8 py-6 hover:bg-white/5 transition-colors group">
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-none text-label-sm ${platform === 'PS' ? 'bg-primary/20 text-primary' : platform === 'XB' ? 'bg-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/20 text-green-400'}`}>
                          {platform}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">{item.name}</span>
                          <span className="text-label-sm text-primary">${item.price}us</span>
                        </div>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-label-sm text-white/20 uppercase leading-none">STOCK</span>
                        <span className={`text-xl md:text-2xl font-display ${(item.stock || 0) <= 5 ? 'text-red-400' : 'text-white'}`}>{item.stock || 0}</span>
                     </div>
                  </div>
                );
             })}
          </div>
        </section>

        {/* Detailed Codes Table */}
        <section className="space-y-6 pt-4">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-6">
                 <h1 className="text-xl md:text-2xl font-display text-white uppercase">{t("inventory")}</h1>
                 <div className="flex items-center gap-3">
                    <button onClick={() => setIsCategorySheetOpen(true)} className="w-12 h-12 rounded-full bg-[#f2b92f] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl">
                       <span className="material-symbols-outlined font-black">folder</span>
                    </button>
                    <button onClick={() => setIsGiftCardSheetOpen(true)} className="w-12 h-12 rounded-full bg-[#f2b92f] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-2xl">
                       <span className="material-symbols-outlined font-black text-2xl">add</span>
                    </button>
                 </div>
              </div>
           </div>

            {/* Mobile Adaptive Cards - Intelligently adapted for small screens */}
            <div className="lg:hidden space-y-4 px-2">
               {codes.map((item, idx) => (
                  <div key={idx} className="bg-[#191b23] p-5 rounded-[2rem] border border-white/5 shadow-xl relative overflow-hidden group">
                     {/* Flag & Region floating */}
                     <div className="absolute top-5 right-5 flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
                        <img 
                           src={`https://flagcdn.com/w40/${
                              item.region === 'USA' ? 'us' : 
                              item.region === 'Colombia' ? 'co' : 
                              item.region === 'Brazil' ? 'br' : 
                              item.region === 'Argentina' ? 'ar' : 
                              item.region === 'Turkia' ? 'tr' : 
                              item.region === 'India' ? 'in' : 'un'
                           }.png`} 
                           className="w-4 h-2.5 object-cover rounded-sm" 
                           alt={item.region} 
                        />
                        <span className="text-[9px] font-black text-white/60 uppercase">{item.region || 'Global'}</span>
                     </div>

                     <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                           <span className="text-label-sm text-white/30 uppercase mb-1">Producto</span>
                           <h4 className="text-sm font-black text-white leading-none uppercase">{item.product?.name}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="flex flex-col">
                              <span className="text-label-sm text-white/30 uppercase mb-1">Estado</span>
                              <span className={`w-fit px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${item.status === 'available' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                 {item.status}
                              </span>
                           </div>
                           <div className="flex flex-col">
                              <span className="text-label-sm text-white/30 uppercase mb-1">Precio</span>
                              <span className="text-base font-black text-primary">${item.product?.price}us</span>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/5">
                           <div className="flex flex-col">
                              <span className="text-label-sm text-white/30 uppercase mb-1">Código</span>
                              <code className="text-[11px] font-mono text-primary font-bold">{item.code}</code>
                           </div>
                           <button 
                              onClick={() => handleDeleteCode(item.id)}
                              className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 active:scale-90 transition-all shadow-lg"
                           >
                              <span className="material-symbols-outlined text-[18px]">delete</span>
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
               {codes.length === 0 && (
                  <div className="py-20 text-center bg-[#191b23] rounded-[2rem] border border-dashed border-white/5">
                     <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">Sin inventario actual</p>
                  </div>
               )}
            </div>

           <div className="hidden lg:block bg-[#191b23] rounded-[2.5rem] overflow-hidden shadow-2xl">
              <table className="w-full border-separate border-spacing-0">
                 <thead>
                    <tr className="bg-white/5">
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Producto</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Precio</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Estado</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Región</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Código</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-right">Acciones</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {codes.map((item, idx) => (
                       <tr key={idx} className="group hover:bg-white/5 transition-all">
                          <td className="px-8 py-6 font-bold text-white text-sm">
                             {item.product?.name}
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-lg font-black text-primary">${item.product?.price}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${item.status === 'available' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-500'}`}>
                                {item.status}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2">
                                <img 
                                   src={`https://flagcdn.com/w40/${
                                      item.region === 'USA' ? 'us' : 
                                      item.region === 'Colombia' ? 'co' : 
                                      item.region === 'Brazil' ? 'br' : 
                                      item.region === 'Argentina' ? 'ar' : 
                                      item.region === 'Turkia' ? 'tr' : 
                                      item.region === 'India' ? 'in' : 'un'
                                   }.png`} 
                                   className="w-5 h-3.5 object-cover rounded-sm border border-white/10" 
                                   alt={item.region} 
                                />
                                <span className="text-[10px] font-black text-white/60 uppercase">{item.region || 'Global'}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <code className="text-xs font-mono text-white/40 group-hover:text-primary transition-colors">{item.code}</code>
                          </td>
                          <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => handleDeleteCode(item.id)}
                                className="p-2 hover:bg-red-500/10 rounded-xl text-white/20 hover:text-red-400 transition-all active:scale-90"
                              >
                                 <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                           </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </section>
      </main>

      <CategoryBottomSheet 
        isOpen={isCategorySheetOpen} 
        onClose={() => setIsCategorySheetOpen(false)} 
        onSuccess={fetchData}
      />
      <GiftCardBottomSheet 
        isOpen={isGiftCardSheetOpen} 
        onClose={() => setIsGiftCardSheetOpen(false)} 
        onSuccess={fetchData} 
      />
    </div>
  );
}
