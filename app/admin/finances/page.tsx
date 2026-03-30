"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { supabase } from "@/lib/supabase";

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

  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    todaySales: 0,
    completedOrders: 0,
    totalUsers: 0,
    monthlyChartData: [] as { month: string, amount: number }[]
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchData = async () => {
      // 1. Traer Órdenes
      const { data: ordersData } = await supabase
        .from('orders')
        .select('id, amount, status, created_at, user_id')
        .order('created_at', { ascending: false });

      // 2. Traer Perfiles (para los correos)
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('id, email');

      if (ordersData && profilesData) {
        // Crear un diccionario rápido de perfiles para no hacer loops pesados
        const profileMap = profilesData.reduce((acc: any, curr: any) => {
          acc[curr.id] = curr.email;
          return acc;
        }, {});

        // 3. Calcular las Métricas Reales
        let total = 0;
        let todayTotal = 0;
        let completed = 0;

        const today = new Date().toISOString().split('T')[0];

        const formattedOrders = ordersData.map((o: any) => {
           const amt = Number(o.amount) || 0;
           const isCompleted = o.status?.toLowerCase() === 'completed';
           
           if (isCompleted) {
             total += amt;
             completed++;
           }
           
           if (o.created_at.startsWith(today)) todayTotal += amt;

           return {
             email: profileMap[o.user_id] || "Usuario Desconocido",
             id: `#ORD-${o.id.substring(0, 6).toUpperCase()}`,
             amount: amt.toFixed(2),
             status: o.status,
             hash: o.id.substring(0, 8),
             active: o.status === 'pending'
           }
        });

        // 4. Agrupar Ventas por Mes para el Gráfico
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlySummary: { [key: string]: number } = {};
        
        ordersData.forEach((o: any) => {
          if (o.status?.toLowerCase() === 'completed') {
            const date = new Date(o.created_at);
            const monthKey = monthNames[date.getMonth()];
            monthlySummary[monthKey] = (monthlySummary[monthKey] || 0) + Number(o.amount);
          }
        });

        const historyData = monthNames.map(m => ({
          month: m,
          amount: monthlySummary[m] || 0
        }));

        setMetrics({
          totalIncome: total,
          todaySales: todayTotal,
          completedOrders: completed,
          totalUsers: profilesData.length,
          monthlyChartData: historyData
        });
        
        setOrders(formattedOrders);
      }
      
      setLoading(false);
    };

    fetchData();

    // -- REALTIME: Suscribirse a cambios en 'orders'
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Escuchar TODO (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Realtime Order Change:', payload);
          fetchData(); // Recargar datos
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex min-h-screen bg-[#11131b] text-on-surface font-sans antialiased">
      <AdminSidebar />
      <AdminHeader />

      <main className="flex-1 lg:ml-64 mt-16 p-4 md:p-8 space-y-8 overflow-x-hidden">
        {/* Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="INGRESOS TOTALES" value={`${metrics.totalIncome.toLocaleString()} USDT`} trend="+12.5%" icon="payments" />
          <StatCard label="VENTAS DE HOY" value={`${metrics.todaySales.toLocaleString()} USDT`} trend="+5.2%" icon="point_of_sale" />
          <StatCard label="V. COMPLETADAS" value={`${metrics.completedOrders} EXITOSAS`} icon="check_circle" hasSelector />
          <StatCard label="CLIENTES REGISTRADOS" value={`${metrics.totalUsers} USUARIOS`} icon="group" />
        </section>

        {/* Dynamic Line Chart Section (Step 4.2) */}
        <section className="bg-[#191b23] p-8 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] space-y-6">
           <div className="flex justify-between items-end">
              <div>
                 <h3 className="text-xl font-display text-white uppercase tracking-wider">Flujo de Ventas</h3>
                 <p className="text-label-sm text-white/20 uppercase">Rendimiento Mensual (USDT)</p>
              </div>
              <div className="text-right">
                 <div className="text-2xl font-display text-primary">{metrics.totalIncome.toLocaleString()} USDT</div>
                 <div className="text-[10px] text-green-400 font-black uppercase">Ingresos Totales Confirmados</div>
              </div>
           </div>

           <div className="h-48 w-full relative group mt-4">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
                 <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#f7be34" stopOpacity="0.2" />
                       <stop offset="100%" stopColor="#f7be34" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 
                 {/* Line Path */}
                 <path 
                    d={`M ${metrics.monthlyChartData.map((d, i) => `${(i / 11) * 100}%, ${100 - (Math.min(d.amount / (Math.max(...metrics.monthlyChartData.map(x => x.amount)) || 1), 1) * 80 + 10)}%`).join(' L ')}`}
                    fill="none"
                    stroke="#f7be34"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_10px_rgba(247,190,52,0.5)]"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                 />
                 
                 {/* Area Fill */}
                 <path 
                    d={`M 0,100 L ${metrics.monthlyChartData.map((d, i) => `${(i / 11) * 100}%, ${100 - (Math.min(d.amount / (Math.max(...metrics.monthlyChartData.map(x => x.amount)) || 1), 1) * 80 + 10)}%`).join(' L ')} L 100,100 Z`}
                    fill="url(#chartGradient)"
                    style={{ vectorEffect: 'non-scaling-stroke' }}
                 />

                 {/* Data Points */}
                 {metrics.monthlyChartData.map((d, i) => (
                    <circle 
                       key={i}
                       cx={`${(i / 11) * 100}%`}
                       cy={`${100 - (Math.min(d.amount / (Math.max(...metrics.monthlyChartData.map(x => x.amount)) || 1), 1) * 80 + 10)}%`}
                       r="4"
                       className="fill-[#191b23] stroke-primary stroke-[2px] transition-all hover:r-6 cursor-pointer"
                    />
                 ))}
              </svg>
              
              {/* Labels */}
              <div className="flex justify-between mt-6 px-1">
                 {metrics.monthlyChartData.map((d, i) => (
                    <span key={i} className="text-[9px] font-black text-white/20 uppercase tracking-tighter">{d.month}</span>
                 ))}
              </div>
           </div>
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
                      {currentOrders.map((order, idx) => (
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
                               <span className={`inline-flex px-3 py-1 rounded-full text-label-sm font-black uppercase tracking-widest ${order.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'}`}>
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
           {totalPages > 1 && (
             <div className="flex items-center justify-center gap-4 pt-6">
               <button 
                 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                 disabled={currentPage === 1}
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-primary transition-all disabled:opacity-0"
               >
                  <span className="material-symbols-outlined">chevron_left</span>
               </button>
               <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button 
                      key={p} 
                      onClick={() => setCurrentPage(p)}
                      className={`w-10 h-10 rounded-full font-black text-xs transition-all ${p === currentPage ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-white/20 hover:text-white'}`}
                    >
                       {p}
                    </button>
                  ))}
               </div>
               <button 
                 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                 disabled={currentPage === totalPages}
                 className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-primary transition-all disabled:opacity-0"
               >
                  <span className="material-symbols-outlined">chevron_right</span>
               </button>
             </div>
           )}
           {orders.length === 0 && (
              <div className="py-20 text-center bg-[#191b23] rounded-[2.5rem] border border-dashed border-white/5">
                 <p className="text-white/20 font-black uppercase tracking-widest text-xs">Aún no hay órdenes registradas</p>
              </div>
           )}
        </section>
      </main>
    </div>
  );
}
