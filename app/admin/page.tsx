"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { CategoryBottomSheet } from "@/components/admin/CategoryBottomSheet";

export default function AdminInventoryPage() {
  const { t } = useLanguage();
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);

  const metrics = [
    { label: t("total_invested"), value: "24,500", sub: "$89.425.000 COP", unit: "USDT", icon: "payments", trend: "+12.5%", color: "primary" },
    { label: t("daily_sales"), value: "4,250", sub: "$2.456.834 COP", unit: "USDT", icon: "point_of_sale", trend: "+12.5%", color: "primary" },
    { label: t("critical_inventory"), alerts: [{ name: "PS $10", stock: 3 }, { name: "XBOX $5", stock: 1 }], icon: "warning", color: "red" },
    { label: t("active_codes"), value: "12", sub: "Action Required", icon: "sync", color: "primary" },
  ];

  const codes = [
    { platform: "PS", name: "PlayStation", value: 10, region: "USA", price: 9.30, status: t("active"), code: "BDCQ-D2RN-APMN", active: true },
    { platform: "XB", name: "Xbox", value: 5, region: "COL", price: 20.00, status: t("active"), code: "8865-NH3H-NBCA", active: true },
    { platform: "NT", name: "Nintendo", value: 100, region: "USA", price: 0.85, status: t("sold"), code: "6T7H-TH9F-QCMJ", active: false },
  ];

  const stockSummary = [
    { platform: "PS", name: "PlayStation $10us", stock: 34 },
    { platform: "PS", name: "PlayStation $4us", stock: 12 },
    { platform: "PS", name: "PlayStation $25us", stock: 3 },
    { platform: "XB", name: "XBOX $10us", stock: 4 },
    { platform: "NT", name: "Nintendo $10us", stock: 8 },
  ];

  return (
    <div className="flex min-h-screen bg-background text-on-surface font-body">
      <AdminSidebar />
      <AdminHeader />

      <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-8 space-y-8 overflow-x-hidden">
        {/* Metrics Section */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {metrics.map((item, idx) => (
            <div key={idx} className={`bg-surface-container-low p-5 rounded-3xl flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:bg-surface-container-high transition-all border border-white/5 ${item.color === 'red' ? 'border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''}`}>
               <div className="flex justify-between items-start z-10">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${item.color === 'red' ? 'text-red-400' : 'text-secondary/60'}`}>{item.label}</span>
                  <span className={`material-symbols-outlined text-[20px] ${item.color === 'red' ? 'text-red-500/50 animate-pulse' : 'text-primary/40'}`}>{item.icon}</span>
               </div>
               
               <div className="z-10 mt-2">
                 {item.alerts ? (
                    <div className="space-y-2 mt-1">
                      {item.alerts.map((alert, i) => (
                        <div key={i} className="flex justify-between items-center bg-red-500/5 px-2 py-1 rounded-lg">
                          <span className="text-[10px] font-bold text-white/50">{alert.name}</span>
                          <span className="text-[10px] font-black text-red-400 uppercase tracking-tighter">Stock: {alert.stock}</span>
                        </div>
                      ))}
                    </div>
                 ) : (
                   <>
                    <div className="text-[9px] font-bold text-white/30 tracking-tight leading-none mb-1">{item.sub}</div>
                    <div className="text-xl md:text-3xl font-black text-white flex items-baseline gap-1.5 leading-none">
                      {item.value} <span className="text-[10px] font-bold text-primary uppercase">{item.unit || ""}</span>
                    </div>
                    {item.trend && (
                      <div className="flex items-center text-[9px] text-green-400 mt-1 font-black">
                        <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span> {item.trend}
                      </div>
                    )}
                   </>
                 )}
               </div>
               <div className={`absolute -right-4 -bottom-4 w-20 h-20 rounded-full blur-3xl opacity-10 ${item.color === 'red' ? 'bg-red-500' : 'bg-primary'}`}></div>
            </div>
          ))}
        </section>

        {/* Stock Summary Table */}
        <section className="bg-[#30334a]/40 backdrop-blur-md border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">{t("stock_summary")}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-white/5 md:divide-y-0">
             {stockSummary.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors group">
                   <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border font-black text-[10px] ${item.platform === 'PS' ? 'bg-primary/10 border-primary/20 text-primary' : item.platform === 'XB' ? 'bg-[#c3c4e2]/10 border-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/10 border-green-400/20 text-green-400'}`}>
                        {item.platform}
                      </div>
                      <span className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors tracking-tight">{item.name}</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">STOCK:</span>
                      <span className={`text-xl font-black ${item.stock <= 5 ? 'text-red-400' : 'text-primary'}`}>{item.stock}</span>
                   </div>
                </div>
             ))}
          </div>
        </section>

        {/* Detailed Codes Table */}
        <section className="space-y-6">
           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-2">
              <div className="flex items-center gap-5">
                 <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{t("inventory")}</h3>
                 <div className="flex items-center gap-2.5">
                    <button 
                      onClick={() => setIsCategorySheetOpen(true)}
                      className="w-11 h-11 rounded-full bg-primary text-[#402d00] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_8px_20px_rgba(242,185,47,0.3)]"
                    >
                       <span className="material-symbols-outlined text-[20px] font-black">folder</span>
                    </button>
                    <button className="w-11 h-11 rounded-full bg-primary text-[#402d00] flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_8px_20px_rgba(242,185,47,0.3)]">
                       <span className="material-symbols-outlined text-[22px] font-black">add</span>
                    </button>
                 </div>
              </div>

              <div className="flex flex-1 flex-col md:flex-row items-center gap-4 justify-end">
                 <div className="relative group w-full md:max-w-md">
                    <input 
                       className="w-full bg-[#191b23] border border-white/5 rounded-2xl py-3.5 px-6 text-xs text-white/90 placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all text-center shadow-inner"
                       placeholder="Buscar por correo o ID..."
                    />
                 </div>
                 <div className="flex items-center gap-3 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-[#1e202f] border border-white/5 text-primary font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#25283d] transition-all group shadow-lg">
                      {t("all")?.toUpperCase() || "TODOS"} <span className="material-symbols-outlined text-[16px] text-primary/50 group-hover:text-primary transition-colors">expand_more</span>
                    </button>
                    <button className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-[#1e202f] border border-white/5 text-primary font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#25283d] transition-all group shadow-lg">
                      {t("platform")?.toUpperCase() || "PLATAFORMA"} <span className="material-symbols-outlined text-[16px] text-primary/50 group-hover:text-primary transition-colors">expand_more</span>
                    </button>
                 </div>
              </div>
           </div>

           {/* Table (Desktop) */}
           <div className="hidden lg:block bg-[#191b23] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
              <table className="w-full border-separate border-spacing-0">
                 <thead>
                    <tr className="bg-white/5">
                       <th className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-left">{t("platform")}</th>
                       <th className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-left">{t("value")}</th>
                       <th className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-left">{t("price")}</th>
                       <th className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-left">{t("status")}</th>
                       <th className="px-6 py-5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] text-left">{t("code")}</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {codes.map((item, idx) => (
                       <tr key={idx} className={`group hover:bg-white/5 transition-all cursor-default ${item.active ? 'bg-green-500/5' : 'bg-red-500/5 opacity-70'}`}>
                          <td className="px-6 py-6 font-bold text-white text-sm">
                             <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border text-[11px] font-black ${item.platform === 'PS' ? 'bg-primary/10 border-primary/20 text-primary' : item.platform === 'XB' ? 'bg-[#c3c4e2]/10 border-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/10 border-green-400/20 text-green-400'}`}>
                                   {item.platform}
                                </div>
                                {item.name}
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex flex-col">
                                <span className="text-base font-black text-white leading-none">{item.value}</span>
                                <span className="text-[9px] font-black text-primary uppercase tracking-tighter mt-1">{item.region}</span>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <span className="text-base font-black text-primary tracking-tighter">{item.price} <span className="text-[9px] opacity-60">USDT</span></span>
                          </td>
                          <td className="px-6 py-6">
                             <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                                {item.status}
                             </span>
                          </td>
                          <td className="px-6 py-6">
                             <code className="text-[12px] font-mono font-bold text-white/50 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10 group-hover:text-primary transition-colors select-all">
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
                 <div key={idx} className={`bg-surface-container-low border rounded-3xl p-6 shadow-xl space-y-5 relative overflow-hidden ${item.active ? 'border-green-500/10' : 'border-red-500/10 opacity-70'}`}>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border font-black text-sm shadow-inner ${item.platform === 'PS' ? 'bg-primary/10 border-primary/20 text-primary' : item.platform === 'XB' ? 'bg-[#c3c4e2]/10 border-[#c3c4e2]/20 text-[#c3c4e2]' : 'bg-green-400/10 border-green-400/20 text-green-400'}`}>
                             {item.platform}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">PLATAFORMA</span>
                             <span className="text-lg font-black text-white tracking-tight">{item.name}</span>
                          </div>
                       </div>
                       <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                          {item.status}
                       </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">VALOR</span>
                          <div className="flex items-baseline gap-1">
                             <span className="text-xl font-black text-white">{item.value}</span>
                             <span className="text-[9px] font-black text-primary">{item.region}</span>
                          </div>
                       </div>
                       <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                          <span className="text-[8px] font-black text-white/20 uppercase tracking-widest block mb-1">PRECIO</span>
                          <div className="flex items-baseline gap-1">
                             <span className="text-xl font-black text-primary">{item.price}</span>
                             <span className="text-[9px] font-black text-white/30">USDT</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-black/40 rounded-2xl p-4 border border-white/10 text-center shadow-inner">
                       <code className="text-sm font-mono font-bold text-white/80 break-all select-all tracking-widest uppercase">{item.code}</code>
                    </div>
                 </div>
              ))}
           </div>
        </section>
      </main>
      
      {/* Mobile Floating Action Button */}
      <button className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full shadow-[0_10px_30px_rgba(242,185,47,0.4)] flex items-center justify-center text-background z-50 active:scale-90 transition-transform">
        <span className="material-symbols-outlined font-black text-2xl">add</span>
      </button>

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden h-16 bg-[#191b23]/90 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-4">
        {[
          { label: "Dash", icon: "grid_view", active: true },
          { label: "Stats", icon: "analytics" },
          { label: "TXs", icon: "history" },
          { label: "Self", icon: "person" },
        ].map((item, idx) => (
          <button key={idx} className={`flex flex-col items-center justify-center py-2 transition-all ${item.active ? 'text-primary' : 'text-white/30'}`}>
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      <CategoryBottomSheet 
        isOpen={isCategorySheetOpen} 
        onClose={() => setIsCategorySheetOpen(false)} 
      />
    </div>
  );
}
