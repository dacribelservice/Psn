"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";
import { OrderDetailsView } from "@/components/ui/OrderDetailsView";
import { AnimatePresence } from "framer-motion";

export default function HistoryPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const transactions = [
    { id: "88241", product: "Netflix Gift Card", amount: "$50.00", method: "USDT (TRC20)", date: "12 Oct 2023, 14:30", status: "Completed" },
    { id: "88239", product: "Amazon Balance", amount: "$100.00", method: "USDT (TRC20)", date: "11 Oct 2023, 09:15", status: "Pending" },
    { id: "88235", product: "Apple Store Card", amount: "$25.00", method: "LTC", date: "10 Oct 2023, 18:45", status: "Completed" },
    { id: "88230", product: "Steam Wallet", amount: "$10.00", method: "BTC", date: "08 Oct 2023, 21:05", status: "Completed" },
    { id: "88228", product: "PlayStation Plus 12M", amount: "$60.00", method: "USDT (ERC20)", date: "05 Oct 2023, 11:20", status: "Completed" },
  ];

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
              <h2 className="text-4xl md:text-display-lg font-display text-white">
                {language === 'es' ? 'Historial de Órdenes' : 'Order History'}
              </h2>
            </div>
            
            {/* Search Bar */}
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
          </div>          {/* Stats Bar (Bento Style Redesign) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {/* Stat 1: Última Compra */}
            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <span className="text-label-sm text-white/30 block uppercase">
                  {language === 'es' ? 'Última Compra' : 'Last Purchase'}
                </span>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_15px_rgba(247,190,52,0.1)]">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance_wallet</span>
                </div>
              </div>
              <div className="flex flex-col z-10">
                <p className="text-headline-sm text-white tracking-tight leading-none mb-2">Netflix Gift Card</p>
                <p className="text-label-sm text-white/20 uppercase tracking-widest leading-none">12 Oct 2023</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all"></div>
            </div>

            {/* Stat 2: Completados */}
            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <p className="text-label-sm text-white/30 uppercase">
                  {language === 'es' ? 'Completados' : 'Completed'}
                </p>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
              </div>
              <p className="text-3xl md:text-display-lg font-display text-white z-10">24</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all"></div>
            </div>

            {/* Stat 3: Pendientes */}
            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <p className="text-label-sm text-white/30 uppercase">
                  {language === 'es' ? 'Pendientes' : 'Pending'}
                </p>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                </div>
              </div>
              <p className="text-3xl md:text-display-lg font-display text-white z-10">02</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all"></div>
            </div>

            {/* Stat 4: Códigos */}
            <div className="bg-[#191b23] p-6 rounded-[2rem] flex flex-col justify-between h-36 md:h-44 relative overflow-hidden group hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
              <div className="flex items-center justify-between z-10 w-full">
                <p className="text-label-sm text-white/30 uppercase">
                  {language === 'es' ? 'Códigos' : 'Codes'}
                </p>
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                  <span className="material-symbols-outlined text-white/40 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                </div>
              </div>
              <p className="text-3xl md:text-display-lg font-display text-white z-10">840</p>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-[80px] group-hover:bg-white/10 transition-all"></div>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden flex flex-col gap-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#191b23] rounded-[2rem] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-[10px] font-headline font-black text-white/20 uppercase tracking-[0.2em] mb-1">
                      {language === 'es' ? 'Pedido' : 'Order'} #{tx.id}
                    </p>
                    <h3 className="text-xl font-headline font-black text-white tracking-tight leading-none">{tx.product}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    tx.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-primary/10 text-primary'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mb-2">{tx.date}</p>
                    <p className="text-2xl font-headline font-black text-primary leading-none">{tx.amount}</p>
                  </div>
                  <button 
                    onClick={() => tx.status === 'Completed' && setSelectedOrderId(tx.id)}
                    className={`${
                      tx.status === 'Completed' 
                        ? 'bg-primary text-black active:scale-95' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                    } text-[10px] font-black px-5 py-3 rounded-xl transition-all uppercase tracking-widest shadow-lg`}
                  >
                    {tx.status === 'Completed' ? (language === 'es' ? 'VER CÓDIGOS' : 'VIEW CODES') : (language === 'es' ? 'ESPERANDO' : 'PENDING')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-hidden bg-surface-container-low rounded-3xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 border-b border-outline-variant/5">
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">Order #</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Producto' : 'Product'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Monto' : 'Amount'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Método' : 'Method'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Fecha' : 'Date'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em]">{language === 'es' ? 'Estado' : 'Status'}</th>
                  <th className="px-6 py-5 text-[0.6875rem] font-bold text-secondary-fixed-dim uppercase tracking-[0.15em] text-right">{language === 'es' ? 'Acción' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-container-highest/30 transition-colors group">
                    <td className="px-6 py-6 text-sm font-mono text-on-surface-variant">#{tx.id}</td>
                    <td className="px-6 py-6 font-bold text-on-surface">{tx.product}</td>
                    <td className="px-6 py-6 font-black text-primary">{tx.amount}</td>
                    <td className="px-6 py-6 text-xs text-secondary-fixed-dim">{tx.method}</td>
                    <td className="px-6 py-6 text-xs text-secondary-fixed-dim">{tx.date}</td>
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[0.625rem] font-bold uppercase tracking-widest ${
                        tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#f2b92f]/10 text-[#f2b92f]'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-right">
                      {tx.status === 'Completed' ? (
                        <button 
                          onClick={() => setSelectedOrderId(tx.id)}
                          className="text-[#f7be34] text-xs font-bold hover:underline transition-all"
                        >
                          {language === 'es' ? 'VER CÓDIGOS' : 'VIEW CODES'}
                        </button>
                      ) : (
                        <span className="text-on-surface-variant/40 text-[0.625rem] font-bold uppercase">
                          {language === 'es' ? 'Procesando...' : 'Processing...'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-6 py-6 bg-surface-container-high/20 flex justify-between items-center text-on-surface">
              <p className="text-[0.6875rem] text-secondary-fixed-dim">
                {language === 'es' ? 'Mostrando 5 de 26 transacciones' : 'Showing 5 of 26 transactions'}
              </p>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center opacity-50"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                <button className="w-8 h-8 rounded-lg bg-[#f7be34] flex items-center justify-center text-[#402d00] font-bold text-xs">1</button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-xs hover:bg-[#282a32]">2</button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-xs hover:bg-[#282a32]">3</button>
                <button className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center hover:bg-[#282a32]"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Order Details View Overlay */}
      <AnimatePresence>
        {selectedOrderId && (
          <OrderDetailsView 
            orderId={selectedOrderId} 
            onClose={() => setSelectedOrderId(null)} 
            showConfetti={false} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
