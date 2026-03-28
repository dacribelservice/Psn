"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export const BottomNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { label: t("store"), icon: "home", href: "/", active: pathname === "/" },
    { label: t("orders"), icon: "history", href: "/history", active: pathname === "/history" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 px-6 pb-6 bg-[#11131b]/80 backdrop-blur-[12px] z-50 rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
      {navItems.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className={`flex flex-col items-center justify-center transition-all duration-300 active:translate-y-1 ${
            item.active 
              ? "text-primary bg-primary/10 rounded-xl px-4 py-2" 
              : "text-[#c3c4e2] opacity-60 hover:text-primary"
          }`}
        >
          <span className="material-symbols-outlined mb-1" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>
            {item.icon}
          </span>
          <span className={`text-[10px] font-label font-black uppercase tracking-widest leading-none ${item.active ? 'text-primary' : 'text-white/20'}`}>
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
};
