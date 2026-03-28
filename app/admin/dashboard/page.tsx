"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

const StatCard = ({ label, value, sub, unit, trend, icon, color = "primary" }: any) => (
  <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-none">
    <div className="flex justify-between items-start z-10">
      <span className="text-[11px] font-label font-black text-white/30 uppercase tracking-[0.2em]">{label}</span>
      <span className="material-symbols-outlined text-[18px] opacity-20 group-hover:opacity-40 transition-opacity">{icon}</span>
    </div>
    <div className="z-10 mt-auto">
      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{sub}</div>
      <div className="text-xl md:text-2xl font-headline font-black text-white flex items-baseline gap-1.5 leading-none">
        {value} <span className="text-[10px] font-black text-primary uppercase">{unit || ""}</span>
      </div>
      {trend && (
        <div className="flex items-center text-[10px] text-green-400 mt-2 font-black">
          <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span> {trend}
        </div>
      )}
    </div>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[80px] opacity-10 ${color === 'error' ? 'bg-red-500' : 'bg-primary'}`}></div>
  </div>
);

export default function AdminDashboardPage() {
  const { t } = useLanguage();

  const recentOrders = [
    { email: "m.jordan@email.com", id: "#ORD-9921", amount: "450.00", status: "Pending", hash: "0x71c...a3e4", active: true },
    { email: "l.smith@outlook.com", id: "#ORD-9920", amount: "1,200.00", status: "Pending", hash: "0xb42...9f81", active: true },
    { email: "a.khan@gmail.com", id: "#ORD-9919", amount: "85.50", status: "Completed", hash: "0x2a9...11c4", active: false },
  ];

  const criticalInventory = [
    { platform: "Amazon", region: "USA", value: "$50", stock: 3 },
    { platform: "PlayStation", region: "USA", value: "$20", stock: 10 },
    { platform: "Steam", region: "USA", value: "$100", stock: 8 },
  ];

  return (
    <div className="flex min-h-screen bg-[#11131b] text-on-surface font-body antialiased">
      <AdminSidebar />
      <AdminHeader />

      <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-8 space-y-8 overflow-x-hidden">
        {/* Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="TOTAL INVERTIDO" value="14,520" sub="$12.468.234 COP" unit="USDT" trend="+12.5%" icon="payments" />
          <StatCard label="VENTA DEL DÍA" value="4,250" sub="$2.475.936 COP" unit="USDT" trend="+12.5%" icon="point_of_sale" />
          <StatCard label="ORDENES PENDIENTES" value="12" sub="Requieren atención" unit="" icon="pending_actions" />
          <StatCard label="RETIROS SOLICITADOS" value="5" sub="Prioridad urgente" unit="" icon="account_balance" color="error" />
        </section>

        {/* Recent Orders & Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Orders Table */}
          <section className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-4">
               <div className="space-y-1">
                  <h3 className="text-2xl font-headline font-black text-white tracking-widest uppercase drop-shadow-[0_0_15px_rgba(247,190,52,0.1)]">ORDENES RECIENTES</h3>
                  <p className="text-[10px] font-label font-black text-white/20 uppercase tracking-[0.2em]">Gestión de transacciones en tiempo real</p>
               </div>
               <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 flex items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
               </button>
            </div>

            <div className="hidden md:block bg-[#191b23] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
               <table className="w-full border-separate border-spacing-0">
                  <thead>
                     <tr className="bg-white/5">
                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Usuario</th>
                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Monto</th>
                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Estado</th>
                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Hash / TXID</th>
                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] text-left">Acción</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     {recentOrders.map((order, idx) => (
                        <tr key={idx} className="group hover:bg-white/5 transition-all outline-none">
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary">
                                    {order.email.substring(0, 2).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white/90">{order.email}</span>
                                    <span className="text-[10px] font-black text-white/20 uppercase">{order.id}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-baseline gap-1.5">
                                 <span className="text-base font-black text-white">{order.amount}</span>
                                 <span className="text-[9px] font-black text-primary uppercase">USDT</span>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className={`inline-flex px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}`}>
                                 {order.status}
                              </span>
                           </td>
                           <td className="px-8 py-6">
                              <code className="text-[11px] font-mono font-bold text-white/40 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">{order.hash}</code>
                           </td>
                           <td className="px-8 py-6">
                              {order.active ? (
                                <button className="bg-primary text-black px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg">
                                  APROBAR HASH
                                </button>
                              ) : (
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest italic">VALIDADO</span>
                              )}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>

          {/* Sidebar Insights */}
          <aside className="space-y-8">
            {/* Critical Inventory */}
            <section className="bg-[#191b23] rounded-[2.5rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-6 relative overflow-hidden">
               <h4 className="text-[11px] font-headline font-black text-white/40 uppercase tracking-[0.25em]">INVENTARIO CRÍTICO</h4>
               <div className="space-y-4 relative z-10">
                  {criticalInventory.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-5 bg-[#282a32] rounded-3xl border border-white/5 shadow-sm group hover:brightness-110 transition-all">
                       <div className="w-12 h-12 rounded-2xl bg-black/20 border border-primary/10 flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-primary/60 text-2xl">
                             {item.platform === 'Amazon' ? 'shopping_cart' : item.platform === 'PlayStation' ? 'play_circle' : 'videogame_asset'}
                          </span>
                       </div>
                       <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                             <div className="flex flex-col text-[10px] font-black text-white/30 uppercase tracking-widest">{item.platform}</div>
                             <div className="text-[10px] font-black text-white bg-blue-900/40 px-2 py-0.5 rounded border border-white/10 uppercase">{item.region}</div>
                          </div>
                          <div className="flex justify-between items-center pt-1">
                             <span className="text-xs font-black text-primary uppercase">{item.value}</span>
                             <span className="text-xs font-black text-red-400">STOCK: {item.stock}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[150px]">inventory</span>
               </div>
            </section>

            {/* Monthly Earnings Placeholder / Chart logic */}
            <section className="bg-[#191b23] rounded-[2.5rem] p-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-6">
               <div className="flex items-center justify-between">
                  <h4 className="text-[11px] font-headline font-black text-white/40 uppercase tracking-[0.25em]">GANANCIAS</h4>
                  <span className="text-[9px] font-black text-primary bg-primary/10 px-2 py-1 rounded">2026</span>
               </div>
               <div className="h-40 flex items-end gap-1.5 justify-between">
                  {[30, 45, 35, 60, 50, 80, 70, 90, 85, 95, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 group relative">
                       <div 
                         style={{ height: `${h}%` }} 
                         className={`w-full rounded-t-sm transition-all duration-500 ${i === 11 ? 'bg-primary shadow-[0_0_20px_rgba(247,190,52,0.3)]' : 'bg-white/10 group-hover:bg-primary/40'}`}
                       />
                    </div>
                  ))}
               </div>
               <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-tighter">
                  <span>ENE</span><span>MAY</span><span>DIC</span>
               </div>
            </section>
          </aside>
        </div>
      </main>

      {/* Mobile Floating Action & Navbar (already in layout but kept for consistency with provided HTML) */}
      <button className="lg:hidden fixed bottom-24 right-6 w-14 h-14 bg-primary rounded-full shadow-[0_10px_30px_rgba(242,185,47,0.4)] flex items-center justify-center text-black z-50 active:scale-90 transition-transform">
        <span className="material-symbols-outlined font-black text-2xl">add</span>
      </button>

      <nav className="fixed bottom-0 left-0 w-full z-50 lg:hidden h-16 bg-[#11131b]/90 backdrop-blur-3xl border-t border-white/5 flex justify-around items-center px-4">
        {[
          { label: "Dash", icon: "grid_view", active: true },
          { label: "Stats", icon: "analytics" },
          { label: "TXs", icon: "history" },
          { label: "Self", icon: "person" },
        ].map((item, idx) => (
          <button key={idx} className={`flex flex-col items-center justify-center py-2 transition-all ${item.active ? 'text-primary' : 'text-white/20'}`}>
            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
