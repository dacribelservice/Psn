"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export const Sidebar = () => {
  const { t } = useLanguage();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:h-full z-40 bg-[#11131b] border-r border-white/5 shadow-2xl">
      <div className="p-8">
        <h1 className="text-[#f7be34] font-black text-3xl tracking-tighter drop-shadow-lg">DACRIBEL</h1>
      </div>
      <nav className="flex-1 px-4 space-y-4 pt-4">
        <div className="flex items-center space-x-4 p-4 rounded-2xl bg-[#191b23] text-[#f7be34] border-r-4 border-[#f7be34] shadow-md transition-all cursor-pointer">
          <span className="material-symbols-outlined text-2xl">storefront</span>
          <span className="font-bold text-sm tracking-wide">{t("store")}</span>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-2xl text-[#c3c4e2] hover:bg-[#282a32] hover:text-white transition-all cursor-pointer group">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">receipt_long</span>
          <span className="font-semibold text-sm tracking-wide">{t("orders")}</span>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-2xl text-[#c3c4e2] hover:bg-[#282a32] hover:text-white transition-all cursor-pointer group">
          <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">shield</span>
          <span className="font-semibold text-sm tracking-wide">{t("security")}</span>
        </div>
        <div className="flex items-center space-x-4 p-4 rounded-2xl text-[#c3c4e2] hover:bg-[#282a32] hover:text-white transition-all cursor-pointer group">
          <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">settings</span>
          <span className="font-semibold text-sm tracking-wide">{t("settings")}</span>
        </div>
      </nav>
      <div className="p-6 mt-auto">
        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#191b23] border border-white/5 active:scale-95 transition-all cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all">
            <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person</span>
          </div>
          <div>
            <p className="text-xs font-black text-on-surface uppercase tracking-tight">{t("vault_access")}</p>
            <p className="text-[10px] text-secondary font-medium">{t("verified_member")}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
