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
            src="https://lh3.googleusercontent.com/aida/ADBb0uj5p-4GtknURpd5gNSxR4Z4lAt9udSnfL-1yy-Jq7duIjogDvqP6tClCfHjJMotirByytz1cgkkgCAthcl6r3RcODgBzuPLZ6umjCoo7SZz3BkaseBNpq9wVzfH6CLN-49trldqBRfLNPB0zfS_Z8xHVr-CsUu3q2GZuMdzshMhhapC1Dx8TbgxyZHGM7S1mT4OWSSIE1cXZOr1lG0Ud2lpuD2mjuZLtDpR6OAp8ptfShtxCfSZZHm394TBIsoGxfUTo6xSbXoDfDs"
          />
        </div>

        <nav className="flex-1 space-y-2 pr-0">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg transition-all group ${
                item.active 
                  ? "bg-[#282a32] text-primary shadow-lg shadow-black/20" 
                  : "text-[#c3c4e2] opacity-70 hover:bg-[#282a32] hover:text-white"
              }`}
            >
              <span className={`material-symbols-outlined mr-3 text-[22px] ${item.active ? "text-primary" : "group-hover:text-primary transition-colors"}`}>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Removed user profile section as per request */}
      </div>
    </aside>
  );
};
