"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AdminSidebar = () => {
  const { t } = useLanguage();
  const pathname = usePathname();

  const menuItems = [
    { label: t("home"), icon: "home", href: "/" },
    { label: t("finances"), icon: "account_balance", href: "/admin/finances" },
    { label: t("inventory"), icon: "inventory_2", href: "/admin/inventory" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 h-full w-64 hidden lg:flex flex-col bg-[#191b23] border-r border-white/5">
      <div className="p-6 flex flex-col h-full">
        <div className="mb-10">
          <img
            alt="Dacribel Logo"
            className="h-12 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/ADBb0uj5p-4GtknURpd5gNSxR4Z4lAt9udSnfL-1yy-Jq7duIjogDvqP6tClCfHjJMotirByytz1cgkkgCAthcl6r3RcODgBzuPLZ6umjCoo7SZz3BkaseBNpq9wVzfH6CLN-49trldqBRfLNPB0zfS_Z8xHVr-CsUu3q2GZuMdzshMhhapC1Dx8TbgxyZHGM7S1mT4OWSSIE1cXZOr1lG0Ud2lpuD2mjuZLtDpR6OAp8ptfShtxCfSZZHm394TBIsoGxfUTo6xSbXoDfDs"
          />
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all group ${
                isActive(item.href) 
                  ? "bg-[#282a32] text-primary shadow-lg shadow-black/20" 
                  : "text-[#c3c4e2] opacity-70 hover:bg-[#282a32] hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined mr-3 text-[22px] ${isActive(item.href) ? "text-primary" : "group-hover:text-white"}`}>
                {item.icon}
              </span>
              <span className="font-body font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <button className="w-full flex items-center px-4 py-3 text-red-500/80 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition-all group">
              <span className="material-symbols-outlined mr-3 text-[22px]">logout</span>
              <span className="font-bold text-sm tracking-tight">{t("logout")}</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
};
