"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

const CountdownTimer = ({ createdAt, onExpire }: { createdAt: string, onExpire: () => void }) => {
  const [timeLeft, setTimeLeft] = React.useState<number>(0);

  React.useEffect(() => {
    const calculateTime = () => {
      const created = new Date(createdAt).getTime();
      const expires = created + (10 * 60 * 1000); // 10 Minutos
      const now = new Date().getTime();
      return Math.max(0, Math.floor((expires - now) / 1000));
    };

    const initialTime = calculateTime();
    setTimeLeft(initialTime);

    if (initialTime <= 0) {
      onExpire();
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateTime();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [createdAt, onExpire]);

  if (timeLeft <= 0) return null;

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="flex items-center gap-1.5 text-[9px] font-black text-primary/70 animate-pulse mb-1.5 justify-center tracking-tighter">
      <span className="material-symbols-outlined text-[10px]">timer</span>
      <span>{mins}:{secs < 10 ? `0${secs}` : secs}</span>
    </div>
  );
};

const StatCard = ({ label, value, sub, trend, icon, color = "primary" }: any) => {
  // Parsing value to ensure it's a number for COP calculation
  const numericVal = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
  const copVal = (numericVal || 0) * 3650;
  
  return (
    <div className="bg-[#191b23]/60 backdrop-blur-3xl p-6 rounded-[2.5rem] flex flex-col justify-between h-auto min-h-[160px] relative overflow-hidden group hover:bg-[#1e202f]/80 transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 ring-1 ring-white/5">
      <div className="flex justify-between items-start z-10 w-full mb-4">
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{label}</span>
          <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-none drop-shadow-sm">{sub}</span>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner group-hover:border-primary/20 transition-colors">
          <span className="material-symbols-outlined text-[20px] text-primary/60 group-hover:text-primary transition-all duration-500 group-hover:scale-110 drop-shadow-[0_0_12px_rgba(242,185,47,0.3)]">{icon}</span>
        </div>
      </div>
      
      <div className="z-10 mt-auto flex flex-col gap-1">
         <div className="flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-display text-white tracking-tight drop-shadow-lg">
              {Number(numericVal || 0).toLocaleString()}
            </span>
            <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">USDT</span>
         </div>
         
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-1.5 md:gap-0 mt-0.5">
            <span className="text-[13px] font-display text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)] flex items-center gap-1.5">
              ${Number(copVal).toLocaleString()} <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">COP</span>
            </span>
            
            {trend && (
              <div className={`flex items-center self-start md:self-auto px-2 py-0.5 md:py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-tighter ${trend.includes('+') ? 'text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]' : 'text-red-400'}`}>
                <span className="material-symbols-outlined text-[12px] mr-1">
                  {trend.includes('+') ? 'trending_up' : 'trending_down'}
                </span> 
                {trend}
              </div>
            )}
         </div>
      </div>
      
      {/* Dynamic Background Aura */}
      <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-[80px] opacity-10 transition-all duration-700 group-hover:opacity-20 ${color === 'error' ? 'bg-red-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-primary'}`}></div>
    </div>
  );
};

export default function AdminFinancesPage() {
  const { t } = useLanguage();

  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalCost: 0,
    totalProfit: 0,
    todaySales: 0,
    completedOrders: 0,
    totalUsers: 0,
    incomeTrend: "+0.0%",
    profitTrend: "+0.0%",
    dailyTrend: "+0.0%",
    monthlyChartData: [] as { month: string, amount: number, profit: number }[]
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Traer Órdenes
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*, product:products(name, cost_price, sale_price), profiles(email, full_name)')
          .order('created_at', { ascending: false });

        // 2. Traer Perfiles
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email');

        // 3. Traer Inversión en Inventario (Códigos disponibles)
        const { data: inventoryCodes, error: inventoryError } = await supabase
          .from('inventory_codes')
          .select('id, product:products(cost_price)')
          .eq('status', 'available');

        if (ordersError) console.error("Error fetching orders:", ordersError);
        if (profilesError) console.error("Error fetching profiles:", profilesError);
        if (inventoryError) console.error("Error fetching inventory codes:", inventoryError);

        // --- Procesar Perfiles ---
        const profileMap = (profilesData || []).reduce((acc: any, curr: any) => {
          acc[curr.id] = curr.email;
          return acc;
        }, {});

        // --- Calcular Métricas de Órdenes ---
        let total = 0;
        let totalCostOfSales = 0;
        let todayTotal = 0;
        let completedCount = 0;
        const today = new Date().toISOString().split('T')[0];
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const monthlySummary: { [key: string]: { amount: number, profit: number } } = {};

        const formattedOrders = (ordersData || []).map((o: any) => {
          const amt = Number(o.amount) || 0;
          const isCompleted = o.status?.toLowerCase() === 'completed';
          
          if (isCompleted) {
            total += amt;
            totalCostOfSales += Number(o.product?.cost_price || 0);
            completedCount++;

            const date = new Date(o.created_at);
            const monthKey = monthNames[date.getMonth()];
            if (!monthlySummary[monthKey]) monthlySummary[monthKey] = { amount: 0, profit: 0 };
            monthlySummary[monthKey].amount += amt;
            monthlySummary[monthKey].profit += (amt - Number(o.product?.cost_price || 0));
          }
          
          if (o.created_at.startsWith(today) && isCompleted) todayTotal += amt;

          return {
            email: o.profiles?.email || "N/A",
            name: o.profiles?.full_name || "Usuario Desconocido",
            id: `#ORD-${o.id.substring(0, 6).toUpperCase()}`,
            amount: amt.toFixed(2),
            status: o.status,
            realId: o.id,
            createdAt: o.created_at,
            hash: o.id.substring(0, 8),
            active: o.status === 'pending' || o.status === 'payment_pending'
          }
        });
        // --- Calcular Tendencias Mensuales ---
        const currentMonthIdx = new Date().getMonth();
        const prevMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1;
        
        const currentMonthKey = monthNames[currentMonthIdx];
        const prevMonthKey = monthNames[prevMonthIdx];

        const calcTrendStr = (current: number, prev: number) => {
          if (prev <= 0) return current > 0 ? "+100%" : "+0.0%";
          const diff = ((current - prev) / prev) * 100;
          return `${diff >= 0 ? '+' : ''}${diff.toFixed(1)}%`;
        };

        const incomeTrend = calcTrendStr(monthlySummary[currentMonthKey]?.amount || 0, monthlySummary[prevMonthKey]?.amount || 0);
        const profitTrend = calcTrendStr(monthlySummary[currentMonthKey]?.profit || 0, monthlySummary[prevMonthKey]?.profit || 0);

        // --- Calcular Tendencia Diaria (Ventas Hoy vs Ayer) ---
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        const yesterdayTotal = (ordersData || []).reduce((acc: number, o: any) => {
          if (o.created_at.startsWith(yesterdayStr) && o.status?.toLowerCase() === 'completed') {
            return acc + Number(o.amount || 0);
          }
          return acc;
        }, 0);

        const dailyTrendStr = calcTrendStr(todayTotal, yesterdayTotal);
        // --- Calcular Inversión en Stock ---
        const currentInventoryInvestment = (inventoryCodes || []).reduce((acc: number, code: any) => 
          acc + Number(code.product?.cost_price || 0), 0);

        // --- Generar Data para el Gráfico ---
        const historyData = monthNames.map(m => ({
          month: m,
          amount: monthlySummary[m]?.amount || 0,
          profit: monthlySummary[m]?.profit || 0
        }));

        setMetrics({
          totalIncome: total,
          totalCost: currentInventoryInvestment,
          totalProfit: (total - totalCostOfSales),
          todaySales: todayTotal,
          completedOrders: completedCount,
          totalUsers: profilesData?.length || 0,
          incomeTrend,
          profitTrend,
          dailyTrend: dailyTrendStr,
          monthlyChartData: historyData
        });
        
        setOrders(formattedOrders);
      } catch (err) {
        console.error("Error in diagnostics:", err);
      } finally {
        setLoading(false);
      }
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
    <div className="space-y-8 overflow-x-hidden">
        {/* Metrics Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2 md:px-0">
          <StatCard label="INGRESOS TOTALES" value={metrics.totalIncome} trend={metrics.incomeTrend} icon="payments" color="primary" sub="VENTAS BRUTAS" />
          <StatCard label="GANANCIA NETA" value={metrics.totalProfit} trend={metrics.profitTrend} icon="trending_up" color="emerald" sub="MARGEN DE BENEFICIO" />
          <StatCard label="COSTO TOTAL" value={metrics.totalCost} icon="money_off" color="error" sub="INVERSIÓN EN STOCK" />
          <StatCard label="VENTAS DE HOY" value={metrics.todaySales} trend={metrics.dailyTrend} icon="point_of_sale" color="primary" sub="RENDIMIENTO DIARIO" />
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

           <div className="h-64 w-full relative mt-4 flex items-end justify-between gap-1 md:gap-4 px-1 pb-8">
              {metrics.monthlyChartData.map((d, i) => {
                const maxVal = Math.max(...metrics.monthlyChartData.map(x => x.amount)) || 1;
                const heightPercentage = Math.min((d.amount / maxVal) * 100, 100);
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                    {/* Tooltip on hover */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: -5 }}
                      className="absolute -top-12 z-20 bg-white/10 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl pointer-events-none shadow-2xl"
                    >
                      <p className="text-[10px] font-black text-primary leading-none uppercase mb-1">{d.month}</p>
                      <p className="text-xs font-bold text-white leading-none whitespace-nowrap">{d.amount.toLocaleString()} USDT</p>
                    </motion.div>

                    {/* The Glass Bar */}
                    <div className="w-full max-w-[40px] relative h-full flex flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPercentage}%` }}
                        transition={{ type: "spring", damping: 15, stiffness: 100, delay: i * 0.05 }}
                        className="w-full rounded-t-xl relative overflow-hidden bg-gradient-to-t from-primary/20 via-primary/5 to-transparent border-t border-x border-white/10 backdrop-blur-sm group-hover:from-primary/40 group-hover:border-primary/40 transition-all duration-300"
                      >
                         {/* Shine Effect */}
                         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                         
                         {/* Top cap glow */}
                         <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary shadow-[0_0_15px_rgba(247,190,52,0.8)] opacity-50 group-hover:opacity-100"></div>
                      </motion.div>
                    </div>

                    {/* Bottom Label */}
                    <span className="absolute -bottom-6 text-[9px] font-black text-white/20 uppercase tracking-tighter transition-colors group-hover:text-primary">
                      {d.month}
                    </span>
                  </div>
                );
              })}
              
              {/* Background horizontal grid lines */}
              <div className="absolute inset-x-0 inset-y-0 -z-10 flex flex-col justify-between pointer-events-none opacity-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-[1px] bg-white"></div>
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
                                     {(order.name || order.email).substring(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex flex-col">
                                     <span className="font-bold text-white/90">{order.name}</span>
                                     <span className="text-[10px] text-white/30 lowercase">{order.email}</span>
                                     <span className="text-[9px] font-black text-primary/40 uppercase tracking-tighter mt-0.5">{order.id}</span>
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
                               <span className={`inline-flex px-3 py-1 rounded-full text-label-sm font-black uppercase tracking-widest ${
                                 order.status === 'completed' ? 'bg-green-500/10 text-green-400' : 
                                 order.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                 'bg-primary/10 text-primary'}`}>
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
    </div>
  );
}
