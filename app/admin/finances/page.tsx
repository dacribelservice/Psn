"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";

const StatCard = ({ label, value, sub, trend, icon, hasSelector, color = "primary" }: any) => (
  <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-none">
    <div className="flex justify-between items-start z-10 w-full">
      <div className="flex flex-col gap-1.5 flex-1">
        <span className="text-label-sm text-white/30 uppercase">{label}</span>
        {hasSelector && (
          <div className="relative w-fit">
            <select className="appearance-none bg-white/5 border border-white/5 rounded-lg px-3 py-1 text-label-sm text-primary hover:bg-white/10 transition-all focus:outline-none pr-8">
              <option>Junio</option>
              <option>Mayo</option>
              <option>Abril</option>
            </select>
            <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-sm text-primary pointer-events-none">keyboard_arrow_down</span>
          </div>
        )}
      </div>
      <span className="material-symbols-outlined text-[18px] opacity-20 group-hover:opacity-40 transition-opacity">{icon}</span>
    </div>
    <div className="z-10 mt-auto">
      {sub && <div className="text-label-sm text-white/20 uppercase mb-1">{sub}</div>}
      <div className="text-xl md:text-2xl font-display text-white flex items-baseline gap-1.5 leading-none">
        {value}
      </div>
      {trend && (
        <div className="flex items-center text-label-sm text-green-400 mt-2 font-black">
          <span className="material-symbols-outlined text-[12px] mr-1">trending_up</span> {trend}
        </div>
      )}
    </div>
    <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-[80px] opacity-10 ${color === 'error' ? 'bg-red-500' : 'bg-primary'}`}></div>
  </div>
);

export default function AdminFinancesPage() {
  const { t } = useLanguage();

  const orders = [
    { email: "m.jordan@email.com", id: "#ORD-9921", amount: "450.00", status: "Pending", hash: "0x71c...a3e4", active: true },
    { email: "l.smith@outlook.com", id: "#ORD-9920", amount: "1,200.00", status: "Pending", hash: "0xb42...9f81", active: true },
    { email: "a.khan@gmail.com", id: "#ORD-9919", amount: "85.50", status: "Completed", hash: "0x2a9...11c4", active: false },
  ];

  return (
    <div className="flex min-h-screen bg-[#11131b] text-on-surface font-sans antialiased">
      <AdminSidebar />
      <AdminHeader />

      <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-8 space-y-8 overflow-x-hidden">
        {/* Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="INVENTARIO TOTAL" value="24,500 USDT" sub="$12.456.834 COP" trend="+12.5%" icon="payments" />
          <StatCard label="VENTA DEL DÍA" value="4,250 USDT" sub="$1.735.048 COP" trend="+12.5%" icon="point_of_sale" />
          <StatCard label="V. COMPLETADAS" value="845 EXITOSAS" trend="+8.4%" icon="check_circle" hasSelector />
          <StatCard label="VENTAS POR MES" value="124,520 USDT" trend="+8.4%" icon="bar_chart" hasSelector />
        </section>

        {/* Orders Table Section */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
             <div className="flex items-center gap-6 flex-1">
                <h3 className="text-xl md:text-2xl font-display text-white uppercase drop-shadow-[0_0_15px_rgba(247,190,52,0.1)]">ORDENES</h3>
                <div className="relative group flex-1 max-w-sm">
                   <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors text-[20px]">search</span>
                   <input 
                      className="w-full bg-[#1e202f] border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-label-sm text-white/90 placeholder:text-white/20 focus:outline-none focus:border-primary/40 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.2)]"
                      placeholder="Buscar por correo o ID..."
                   />
                </div>
             </div>
             <button className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 flex items-center justify-center transition-all ml-auto">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
             </button>
          </div>

          <div className="bg-[#191b23] rounded-[2.5rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
             <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                   <thead>
                      <tr className="bg-white/5">
                         <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Usuario</th>
                         <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Monto</th>
                         <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Estado</th>
                         <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Hash / TXID</th>
                         <th className="px-8 py-6 text-label-sm text-white/20 uppercase text-left">Acción</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-sm">
                      {orders.map((order, idx) => (
                         <tr key={idx} className="group hover:bg-white/5 transition-all cursor-default">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-label-sm text-secondary">
                                     {order.email.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="font-bold text-white/90">{order.email}</span>
                                     <span className="text-label-sm text-white/20 uppercase">{order.id}</span>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-on-surface">
                               <div className="flex flex-col">
                                  <span className="font-black text-white">{order.amount}</span>
                                  <span className="text-label-sm text-primary uppercase">USDT</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <span className={`inline-flex px-3 py-1 rounded-full text-label-sm font-black uppercase tracking-widest ${order.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}`}>
                                  {order.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 font-mono text-[11px] text-white/40">
                               <span className="bg-black/20 px-3 py-1.5 rounded-xl border border-white/5 text-label-sm">{order.hash}</span>
                            </td>
                            <td className="px-8 py-6 text-on-surface">
                               {order.active ? (
                                  <button className="bg-primary text-black px-5 py-2.5 rounded-xl text-label-sm font-black uppercase hover:brightness-110 transition-all active:scale-95 shadow-lg">
                                     Aprobar Hash
                                  </button>
                               ) : (
                                  <span className="text-label-sm text-green-400 uppercase opacity-50">Validado</span>
                               )}
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-primary transition-all">
               <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <div className="flex items-center gap-3">
               {[1, 2, 3].map(p => (
                 <button key={p} className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${p === 1 ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-white/20 hover:text-white'}`}>
                    {p}
                 </button>
               ))}
               <span className="text-white/10 px-2">...</span>
               <button className="w-12 h-12 rounded-2xl bg-white/5 font-black text-xs text-white/20">12</button>
            </div>
            <button className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 hover:text-primary transition-all">
               <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
