"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { CategoryBottomSheet } from "@/components/admin/CategoryBottomSheet";
import { GiftCardBottomSheet } from "@/components/admin/GiftCardBottomSheet";

export default function AdminInventoryPage() {
  const { t } = useLanguage();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isGiftCardSheetOpen, setIsGiftCardSheetOpen] = useState(false);

  const [inventory, setInventory] = useState([
    { platform: "PS", name: "PlayStation", value: 10, region: "USA", price: 9.30, rate: 3650, stock: 34, stockAlert: 5, active: true },
    { platform: "PS", name: "PlayStation", value: 4, region: "USA", price: 3.50, rate: 3650, stock: 12, stockAlert: 2, active: true },
    { platform: "PS", name: "PlayStation", value: 25, region: "USA", price: 23.00, rate: 3650, stock: 3, stockAlert: 5, active: true },
    { platform: "XB", name: "Xbox", value: 10, region: "COL", price: 9.00, rate: 3650, stock: 4, stockAlert: 5, active: true },
    { platform: "NT", name: "Nintendo", value: 10, region: "USA", price: 9.00, rate: 3650, stock: 8, stockAlert: 5, active: true },
  ]);

  const [codes, setCodes] = useState([
    { platform: "PS", name: "PlayStation", value: 10, region: "USA", price: 9.30, status: t("active"), code: "BDCQ-D2RN-APMN", active: true },
    { platform: "XB", name: "Xbox", value: 5, region: "COL", price: 20.00, status: t("active"), code: "8865-NH3H-NBCA", active: true },
    { platform: "NT", name: "Nintendo", value: 100, region: "USA", price: 0.85, status: t("sold"), code: "6T7H-TH9F-QCMJ", active: false },
  ]);

  // Derived Metrics
  const totalInvertedUSDT = inventory.reduce((acc, item) => acc + (item.value * item.stock), 0);
  const totalInvertedCOP = inventory.reduce((acc, item) => acc + (item.value * item.stock * item.rate), 0);
  const criticalItems = inventory.filter(item => item.stock <= item.stockAlert).map(item => ({ name: `${item.platform} $${item.value}`, stock: item.stock }));
  const activeCodesCount = codes.filter(c => c.active).length;

  const metrics = [
    { label: t("total_invested"), value: totalInvertedUSDT.toLocaleString(), sub: `$${totalInvertedCOP.toLocaleString()} COP`, unit: "USDT", icon: "payments", trend: "+12.5%", color: "primary" },
    { label: t("daily_sales"), value: "4,250", sub: "$2.456.834 COP", unit: "USDT", icon: "point_of_sale", trend: "+12.5%", color: "primary" },
    { label: t("critical_inventory"), alerts: criticalItems.slice(0, 2), icon: "warning", color: criticalItems.length > 0 ? "red" : "primary" },
    { label: t("active_codes"), value: activeCodesCount.toString(), sub: "Actualizado", icon: "sync", color: "primary" },
  ];

  const handleCreateGiftCard = (newData: any) => {
    setInventory(prev => [...prev, {
      platform: newData.platform,
      name: newData.name,
      value: newData.value,
      region: newData.region,
      price: newData.value,
      rate: newData.rate,
      stock: newData.stock,
      stockAlert: newData.stockAlert,
      active: true
    }]);

    const newCodes = newData.codes.map((c: string) => ({
      platform: newData.platform,
      name: newData.name,
      value: newData.value,
      region: newData.region,
      price: newData.value,
      status: t("active"),
      code: c,
      active: true
    }));
    setCodes(prev => [...prev, ...newCodes]);
  };

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
                      {item.alerts.map((alert, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 px-2.5 py-1.5 rounded-xl">
                          <span className="text-label-sm text-white/40">{alert.name}</span>
                          <span className="text-label-sm text-red-400">STOCK: {alert.stock}</span>
                        </div>
                      ))}
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

        {/* Stock Summary (Vault Card style) */}
        <section className="bg-[#191b23] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.5)] border-none">
          <div className="px-8 py-5 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h4 className="text-label-sm text-white/40 uppercase">{t("stock_summary")}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-white/5 md:divide-y-0">
             {inventory.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-8 py-6 hover:bg-white/5 transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-none text-label-sm ${item.platform === 'PS' ? 'bg-primary/20 text-primary' : item.platform === 'XB' ? 'bg-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/20 text-green-400'}`}>
                        {item.platform}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">{item.name}</span>
                        <span className="text-label-sm text-primary">${item.value}us</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-label-sm text-white/20 uppercase leading-none">STOCK</span>
                      <span className={`text-xl md:text-2xl font-display ${item.stock <= item.stockAlert ? 'text-red-400' : 'text-white'}`}>{item.stock}</span>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Detailed Inventory Section */}
        <section className="space-y-6 pt-4">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-4">
              <div className="flex items-center gap-6">
                 <h1 className="text-xl md:text-2xl font-display text-white uppercase drop-shadow-[0_0_15px_rgba(247,190,52,0.1)]">{t("inventory")}</h1>
                 <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsCategorySheetOpen(true)}
                      className="w-12 h-12 rounded-full bg-[#f2b92f] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(242,185,47,0.2)]"
                    >
                       <span className="material-symbols-outlined text-[20px] font-black">folder</span>
                    </button>
                    <button 
                      onClick={() => setIsGiftCardSheetOpen(true)}
                      className="w-12 h-12 rounded-full bg-[#f2b92f] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(242,185,47,0.2)]"
                    >
                       <span className="material-symbols-outlined text-[24px] font-black">add</span>
                    </button>
                 </div>
              </div>

              <div className="flex flex-1 flex-col md:flex-row items-center gap-3 justify-end">
                 <div className="relative group w-full md:max-w-xs">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-lg group-focus-within:text-primary transition-colors">search</span>
                    <input 
                       className="w-full bg-[#1e202f]/60 backdrop-blur-md border border-white/5 rounded-xl py-2.5 pl-11 pr-6 text-[11px] font-bold text-white/90 placeholder:text-white/20 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                       placeholder="BUSCAR POR CORREO O ID..."
                    />
                 </div>
                 <div className="flex items-center gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#191b23] border-none text-white/40 text-[10px] font-black uppercase flex items-center justify-center gap-3 hover:bg-[#282a32] hover:text-white transition-all group shadow-2xl">
                       TODOS <span className="material-symbols-outlined text-[14px] text-white/10 group-hover:text-primary transition-colors">expand_more</span>
                    </button>
                    <button className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#191b23] border-none text-white/40 text-[10px] font-black uppercase flex items-center justify-center gap-3 hover:bg-[#282a32] hover:text-white transition-all group shadow-2xl">
                       PLATAFORMA <span className="material-symbols-outlined text-[14px] text-white/10 group-hover:text-primary transition-colors">expand_more</span>
                    </button>
                 </div>
              </div>
           </div>

           {/* Table (Desktop) */}
           <div className="hidden lg:block bg-[#191b23] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              <table className="w-full border-separate border-spacing-0">
                 <thead>
                    <tr className="bg-white/5">
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">{t("platform")}</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">{t("value")}</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">{t("price")}</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">{t("status")}</th>
                       <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">{t("code")}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {codes.map((item, idx) => (
                       <tr key={idx} className={`group hover:bg-white/5 transition-all cursor-default`}>
                          <td className="px-8 py-6 font-bold text-white text-sm">
                             <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-label-sm font-black ${item.platform === 'PS' ? 'bg-primary/20 text-primary' : item.platform === 'XB' ? 'bg-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/20 text-green-400'}`}>
                                   {item.platform}
                                </div>
                                <span className={item.active ? 'text-white/90' : 'text-white/20'}>{item.name}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-baseline gap-1.5">
                                <span className={`text-lg font-black tracking-tighter ${item.active ? 'text-white' : 'text-white/20'}`}>{item.value}</span>
                                <span className="text-label-sm text-primary uppercase">{item.region}</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-baseline gap-1.5">
                                <span className={`text-lg font-black tracking-tighter ${item.active ? 'text-primary' : 'text-white/20'}`}>{item.price}</span>
                                <span className="text-label-sm text-white/20 uppercase">USDT</span>
                             </div>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border border-white/5 ${item.active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}>
                                {item.status}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <code className="text-[9px] font-mono font-bold text-white/40 bg-black/40 px-2 py-1 rounded-xl border border-white/5 group-hover:text-primary transition-colors select-all tracking-wide">
                                {item.code}
                             </code>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           {/* Mobile List (Mobile) */}
           <div className="lg:hidden space-y-4">
              {codes.map((item, idx) => (
                 <div key={idx} className={`bg-[#191b23] rounded-[2rem] p-6 shadow-2xl space-y-6 relative overflow-hidden border-none ${item.active ? '' : 'opacity-40'}`}>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner ${item.platform === 'PS' ? 'bg-primary/20 text-primary' : item.platform === 'XB' ? 'bg-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/20 text-green-400'}`}>
                             {item.platform}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-label-sm text-white/20 uppercase">PLATAFORMA</span>
                             <span className="text-lg font-black text-white tracking-tight">{item.name}</span>
                          </div>
                       </div>
                       <span className={`px-4 py-2 rounded-full text-label-sm font-black uppercase tracking-widest ${item.active ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/20'}`}>
                          {item.status}
                       </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-label-sm text-white/20 uppercase block mb-1">VALOR</span>
                          <div className="flex items-baseline gap-1.5">
                             <span className="text-2xl font-black text-white">{item.value}</span>
                             <span className="text-label-sm text-primary uppercase">{item.region}</span>
                          </div>
                       </div>
                       <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                          <span className="text-label-sm text-white/20 uppercase block mb-1">PRECIO</span>
                          <div className="flex items-baseline gap-1.5">
                             <span className="text-2xl font-black text-primary">{item.price}</span>
                             <span className="text-label-sm text-white/20 uppercase">USDT</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 text-center shadow-inner">
                       <code className="text-label-sm font-mono font-bold text-white/80 break-all select-all tracking-widest uppercase">{item.code}</code>
                    </div>
                 </div>
              ))}
           </div>
        </section>
      </main>
      
      {/* Mobile Floating Action Button */}
      <button 
        onClick={() => setIsGiftCardSheetOpen(true)}
        className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#f2b92f] rounded-full shadow-[0_20px_50px_rgba(242,185,47,0.3)] flex items-center justify-center text-black z-50 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined font-black text-2xl">add</span>
      </button>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden h-16 bg-[#11131b]/90 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-4">
        {[
          { label: "Stats", icon: "analytics", active: true },
          { label: "TXs", icon: "history" },
          { label: "Self", icon: "person" },
        ].map((item, idx) => (
          <button key={idx} className={`flex flex-col items-center justify-center py-2 transition-all ${item.active ? 'text-[#f7be34]' : 'text-white/20'}`}>
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      <CategoryBottomSheet 
        isOpen={isCategorySheetOpen} 
        onClose={() => setIsCategorySheetOpen(false)} 
      />

      <GiftCardBottomSheet
        isOpen={isGiftCardSheetOpen}
        onClose={() => setIsGiftCardSheetOpen(false)}
        onCreate={handleCreateGiftCard}
      />
    </div>
  );
}
