"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { label: t("store"), icon: "home", href: "/", active: pathname === "/" },
    { label: t("orders"), icon: "receipt_long", href: "/history", active: pathname === "/history" },
  ];

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 h-full w-64 hidden lg:flex flex-col bg-[#191b23] border-r border-white/5 shadow-2xl">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-10">
          <img
            alt="Dacribel Logo"
            className="h-12 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/ADBb0uj5p-4GtknURpd5gNSxR4Z4lAt9udSnfL-1yy-Jq7duIjogDvqP6tClCfHjJMotirByytz1cgkkgCAthcl6r3RcODgBzuPLZ6umjCoo7SZz3BkaseBNpq9wVzfH6CLN-49trldqBRfLNPB0zfS_Z8xHVr-CsUu3q2GZuMdzshMhhapC1Dx8TbgxyZHGM7S1mT4OWSSIE1cXZOr1lG0Ud2lpuD2mjuZLtDpR6OAp8ptS0-S5OV7AO7XTZiOoh9xPZR_5NKCrbisKieKcU_d4xOFfV6z"
          />
        </div>

        <nav className="flex flex-col gap-1 pr-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all duration-300 group ${
                item.active 
                  ? "bg-[#282a32] text-primary rounded-r-full font-bold shadow-lg shadow-black/20" 
                  : "text-[#c3c4e2] hover:text-white hover:bg-[#282a32] hover:pl-8"
              }`}
            >
              <span className={`material-symbols-outlined ${item.active ? "text-primary" : "group-hover:text-primary"}`}>
                {item.icon}
              </span>
              <span className="font-['Inter'] text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#282a32]/50 border border-white/5 active:scale-95 transition-all cursor-pointer group">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-all">
              <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform text-[18px]">person</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-white/80 uppercase tracking-tight leading-none mb-1">{t("vault_access")}</p>
              <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">{t("verified_member")}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
