"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { OrderDetailsView } from "@/components/ui/OrderDetailsView";
import { AnimatePresence } from "framer-motion";
import React from "react";

export default function HistoryPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all regions once
  const fetchRegions = async () => {
    const { data } = await supabase.from('regions').select('name, flag_url');
    if (data) setRegions(data);
  };

  const fetchOrders = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        id,
        amount,
        payment_method,
        created_at,
        status,
        quantity,
        products(name, image_url, region),
        inventory_codes!order_id(id, code)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("DEBUG - Error completo de Supabase:", error);
    } else if (data) {
      const formatted = data.map((o: any) => ({
        id: o.id.slice(0, 8),
        product: o.products?.name || "Producto Digital",
        amount: `${Number(o.amount).toFixed(2)} USDT`,
        method: o.payment_method || "N/A",
        date: new Date(o.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        fullDate: new Date(o.created_at).toLocaleString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: o.status === 'completed' ? 'Completado' : (o.status === 'cancelled' ? 'Cancelado' : 'Pendiente'),
        product_image: o.products?.image_url,
        codesCount: o.quantity || (Array.isArray(o.inventory_codes) ? o.inventory_codes.length : 0),
        code: Array.isArray(o.inventory_codes) && o.inventory_codes.length > 0
          ? o.inventory_codes.map((c: any) => c.code).join('\n')
          : "PENDIENTE",
        region: o.products?.region || "Global",
      }));
      setTransactions(formatted);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRegions();
    fetchOrders();

    const channel = supabase
      .channel('user-orders-all-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const completedCount = transactions.filter(t => t.status === 'Completado').length;
  const pendingCount = transactions.filter(t => t.status === 'Pendiente').length;
  const totalCodesInOrders = transactions.reduce((acc, t) => acc + t.codesCount, 0);

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tx.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar />
      <Header />

      <main className="pt-24 pb-32 md:pb-12 px-4 md:ml-64 lg:px-12 transition-all">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <span className="text-label-sm text-white/30 block uppercase">
                {language === 'es' ? 'Transacciones' : 'Transactions'}
              </span>
              <h2 className="text-2xl md:text-4xl font-display font-black text-white tracking-tight">
                {language === 'es' ? 'Historial de Órdenes' : 'Order History'}
              </h2>
            </div>
            
            <div className="relative group w-full md:w-80">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
              <input
                className="w-full bg-surface-container-high border-none rounded-xl py-3.5 pl-12 pr-4 text-sm text-on-surface focus:ring-2 focus:ring-primary/40 placeholder:text-on-surface-variant/50 transition-all outline-none shadow-inner"
                placeholder={language === 'es' ? 'Buscar por número o producto...' : 'Search by order # or product...'}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <span className="text-label-sm text-white/30 block uppercase font-black">{language === 'es' ? 'Última Compra' : 'Last Purchase'}</span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
                </div>
              </div>
              <div className="flex flex-col z-10">
                <p className="text-xl font-headline font-black text-white tracking-tight leading-none mb-2">
                  {transactions.length > 0 ? transactions[0].product : (language === 'es' ? 'Ninguna' : 'None')}
                </p>
                <p className="text-[10px] text-white/20 uppercase tracking-widest leading-none font-black">
                  {transactions.length > 0 ? transactions[0].date : '---'}
                </p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all"></div>
            </div>

            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <p className="text-label-sm text-white/30 uppercase font-black">{language === 'es' ? 'Completados' : 'Completed'}</p>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
                </div>
              </div>
              <p className="text-2xl md:text-4xl font-display font-black text-white z-10">{completedCount.toString().padStart(2, '0')}</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
            </div>

            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <p className="text-label-sm text-white/30 uppercase font-black">{language === 'es' ? 'Pendientes' : 'Pending'}</p>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
                </div>
              </div>
              <p className="text-2xl md:text-4xl font-display font-black text-white z-10">{pendingCount.toString().padStart(2, '0')}</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all"></div>
            </div>

            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <p className="text-label-sm text-white/30 uppercase font-black">{language === 'es' ? 'Códigos' : 'Codes'}</p>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-white/40 text-[20px]">confirmation_number</span>
                </div>
              </div>
              <p className="text-2xl md:text-4xl font-display font-black text-white z-10">{totalCodesInOrders.toString().padStart(2, '0')}</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all"></div>
            </div>
          </div>

          {/* Mobile & Tablet Card List */}
          <div className="md:hidden space-y-6">
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full mx-auto mb-4"></div>
                <p className="text-white/40 font-bold tracking-widest text-[10px] uppercase">{language === 'es' ? 'Cargando...' : 'Loading...'}</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-[#191b23] rounded-[2rem] p-10 text-center border border-white/5 shadow-2xl">
                <span className="material-symbols-outlined text-white/10 text-6xl mb-4">receipt_long</span>
                <p className="text-white/30 font-bold">{language === 'es' ? 'No se encontraron órdenes.' : 'No orders found.'}</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="bg-[#191b23] rounded-[2.5rem] p-6 border border-white/5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative group">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-primary/20 shadow-lg shrink-0 overflow-hidden">
                        {tx.product_image ? (
                          <img src={tx.product_image} alt={tx.product} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-primary text-xl">sports_esports</span>
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">#{tx.id}</p>
                        <div className="flex items-center gap-2">
                           <h3 className="text-lg font-headline font-black text-white tracking-tight leading-none">{tx.product}</h3>
                           <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                             <img 
                               src={regions.find(r => r.name.toLowerCase() === tx.region.toLowerCase())?.flag_url || "/Logos/dacribel.png"} 
                               alt={tx.region}
                               className="w-4 h-2.5 rounded-[2px] object-cover shadow-sm"
                             />
                             <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">{tx.region}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      tx.status === 'Completado' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : tx.status === 'Cancelado'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {tx.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8 pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">MONTO</p>
                      <p className="text-xl font-headline font-black text-primary tracking-tight">{tx.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">CANTIDAD</p>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-lg font-headline font-black text-white">{tx.codesCount.toString().padStart(2, '0')}</span>
                        <span className="material-symbols-outlined text-white/20 text-sm">confirmation_number</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">FECHA</p>
                      <p className="text-[11px] font-bold text-white/60 uppercase">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">MÉTODO</p>
                      <p className="text-[11px] font-bold text-white/60 uppercase">{tx.method}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => tx.status === 'Completado' && setSelectedOrder(tx)}
                    className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${
                      tx.status === 'Completado'
                        ? 'bg-primary text-black font-black shadow-[0_10px_25px_-5px_rgba(247,190,52,0.4)]'
                        : 'bg-white/5 text-white/20 font-bold border border-white/5 cursor-not-allowed'
                    }`}
                  >
                    {tx.status === 'Completado' ? (
                      <>
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <span className="text-[11px] uppercase tracking-widest">{language === 'es' ? 'VER MIS CÓDIGOS' : 'VIEW MY CODES'}</span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-ping"></div>
                          <span className="text-[11px] uppercase tracking-widest font-black">
                            {language === 'es' ? 'PROCESANDO PAGO' : 'PROCESSING PAYMENT'}
                          </span>
                        </div>
                        <span className="text-[9px] opacity-40 font-bold uppercase tracking-tighter">
                          {language === 'es' ? 'Tu pedido aparecerá aquí en segundos' : 'Your order will appear here in seconds'}
                        </span>
                      </div>
                    )}
                  </button>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl opacity-50"></div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-surface-container-low rounded-3xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline-variant/5">
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">Order #</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Producto' : 'Product'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Región' : 'Region'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Cant' : 'Qty'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Monto' : 'Amount'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Método' : 'Method'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Fecha' : 'Date'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Estado' : 'Status'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em] text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-20">
                    <div className="animate-spin w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full mx-auto"></div>
                  </td></tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-20 opacity-30 font-bold uppercase tracking-widest text-xs">No se encontraron órdenes.</td></tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                      <td className="px-6 py-6 text-sm font-mono text-on-surface-variant">#{tx.id}</td>
                      <td className="px-6 py-6 font-bold text-white">{tx.product}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3 group/flag transition-transform hover:translate-x-1">
                          <div className="w-10 h-7 rounded-lg overflow-hidden bg-[#0c0e15] border border-white/5 flex items-center justify-center p-0.5 shadow-2xl">
                             <img 
                               src={regions.find(r => r.name.toLowerCase() === tx.region.toLowerCase())?.flag_url || "/Logos/dacribel.png"} 
                               alt={tx.region}
                               className="w-full h-full object-cover rounded-sm opacity-80 group-hover/flag:opacity-100 transition-opacity"
                             />
                          </div>
                          <span className="text-[10px] font-black text-white/20 uppercase tracking-widest group-hover/flag:text-white/60 transition-colors leading-none">
                            {tx.region}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[11px] font-black text-primary border border-white/5">
                          {tx.codesCount.toString().padStart(2, '0')}
                        </div>
                      </td>
                      <td className="px-6 py-6 font-black text-primary">{tx.amount}</td>
                      <td className="px-6 py-6 text-xs text-white/40">{tx.method}</td>
                      <td className="px-6 py-6 text-xs text-white/40">{tx.date}</td>
                      <td className="px-6 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest border ${
                          tx.status === 'Completado' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : tx.status === 'Cancelado'
                              ? 'bg-red-500/20 text-red-500 border-red-500/30'
                              : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
                        }`}>
                          {tx.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {tx.status === 'Completado' ? (
                          <button 
                            onClick={() => setSelectedOrder(tx)}
                            className="bg-primary/20 px-3 py-1.5 rounded-lg border border-primary/30 hover:bg-primary/30 transition-all flex items-center gap-2 group ml-auto shadow-[0_0_15px_rgba(247,190,52,0.1)] active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[14px] text-primary">visibility</span>
                            <span className="text-[10px] text-primary font-black tracking-widest">VER CÓDIGOS</span>
                          </button>
                        ) : (
                          <span className="text-[9px] text-white/20 font-black tracking-widest animate-pulse uppercase">
                            {language === 'es' ? 'Procesando...' : 'Processing...'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <BottomNav />

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailsView 
            orderData={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
            showConfetti={true} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
