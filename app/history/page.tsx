"use client";

import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useLanguage } from "@/context/LanguageContext";
import { useState } from "react";

export default function HistoryPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");

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
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#c3c4e2] block mb-2">
                {language === 'es' ? 'Transacciones' : 'Transactions'}
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface">
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
          </div>

          {/* Stats Bar (Bento Style Redesign from HTML) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Stat 1: Última Compra */}
            <div className="bg-[#30334a]/25 backdrop-blur-[20px] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-[#c3c4e2] uppercase tracking-[0.1em] font-bold">
                  {language === 'es' ? 'Última Compra' : 'Last Purchase'}
                </p>
                <span className="material-symbols-outlined text-[#f2b92f]/70 text-3xl" style={{ filter: 'drop-shadow(0 0 8px #f2b92f)' }}>account_balance_wallet</span>
              </div>
              <div className="flex flex-col">
                <p className="text-xl font-black text-on-surface tracking-tight truncate">Netflix Gift Card</p>
                <p className="text-[0.625rem] text-secondary-fixed-dim mt-1">12 Oct 2023</p>
              </div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
            </div>

            {/* Stat 2: Completados */}
            <div className="bg-[#30334a]/25 backdrop-blur-[20px] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-[#c3c4e2] uppercase tracking-[0.1em] font-bold">
                  {language === 'es' ? 'Completados' : 'Completed'}
                </p>
                <span className="material-symbols-outlined text-[#f2b92f]/70 text-3xl" style={{ filter: 'drop-shadow(0 0 8px #f2b92f)' }}>check_circle</span>
              </div>
              <p className="text-2xl font-black text-on-surface tracking-tight">24</p>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
            </div>

            {/* Stat 3: Pendientes */}
            <div className="bg-[#30334a]/25 backdrop-blur-[20px] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-[#c3c4e2] uppercase tracking-[0.1em] font-bold">
                  {language === 'es' ? 'Pendientes' : 'Pending'}
                </p>
                <span className="material-symbols-outlined text-[#f2b92f]/70 text-3xl" style={{ filter: 'drop-shadow(0 0 8px #f2b92f)' }}>schedule</span>
              </div>
              <p className="text-2xl font-black text-on-surface tracking-tight">02</p>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all"></div>
            </div>

            {/* Stat 4: Códigos Cancelados */}
            <div className="bg-[#30334a]/25 backdrop-blur-[20px] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <p className="text-[0.6875rem] text-[#c3c4e2] uppercase tracking-[0.1em] font-bold">
                  {language === 'es' ? 'Códigos' : 'Codes'}
                </p>
                <span className="material-symbols-outlined text-[#f2b92f]/70 text-3xl" style={{ filter: 'drop-shadow(0 0 8px #f2b92f)' }}>confirmation_number</span>
              </div>
              <p className="text-2xl font-black text-on-surface tracking-tight">840</p>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all"></div>
            </div>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden flex flex-col gap-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-[#30334a]/40 backdrop-blur-[12px] border border-white/5 rounded-2xl p-5 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-[0.625rem] text-secondary-fixed-dim font-bold uppercase tracking-widest mb-1">
                      {language === 'es' ? 'Pedido' : 'Order'} #{tx.id}
                    </p>
                    <h3 className="text-lg font-bold text-on-surface">{tx.product}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[0.625rem] font-bold uppercase tracking-tighter ${
                    tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#f2b92f]/10 text-[#f2b92f]'
                  }`}>
                    {tx.status}
                  </span>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[0.625rem] text-secondary-fixed-dim mb-1">{tx.date}</p>
                    <p className="text-xl font-black text-[#f2b92f]">{tx.amount}</p>
                  </div>
                  <button className={`${
                    tx.status === 'Completed' 
                      ? 'bg-[#f7be34] text-[#402d00] active:scale-95' 
                      : 'bg-surface-container-highest text-on-surface opacity-50 cursor-not-allowed'
                  } text-xs font-bold px-4 py-2 rounded-lg transition-transform uppercase tracking-tighter`}>
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
                        <button className="text-[#f7be34] text-xs font-bold hover:underline transition-all">
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
    </div>
  );
}
