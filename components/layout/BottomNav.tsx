"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export const BottomNav = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { label: t("store"), icon: "home", href: "/" },
    { label: t("orders"), icon: "history", href: "/history" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden z-[50] w-fit">
      <motion.div 
        initial={{ y: 40, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        className="flex items-center gap-1 bg-[#1c1e26]/90 backdrop-blur-3xl p-1.5 rounded-full border border-white/5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] ring-1 ring-white/10"
      >
        {navItems.map((item, idx) => {
          const active = isActive(item.href);
          return (
            <Link 
              key={idx} 
              href={item.href} 
              className="relative px-6 py-3 rounded-full outline-none transition-all active:scale-95 group overflow-hidden"
            >
              {active && (
                <motion.div 
                  layoutId="user-active-pill"
                  className="absolute inset-0 bg-gradient-to-b from-[#f2b92f] to-[#d4a025] shadow-[0_5px_15px_rgba(242,185,47,0.4)]"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              
              <div className="relative flex items-center gap-2.5 z-10">
                <span className={`material-symbols-outlined text-[20px] transition-all duration-500 ${
                  active 
                    ? 'text-[#402d00] font-black scale-110 drop-shadow-sm' 
                    : 'text-white/30 group-hover:text-white/60'
                }`}>
                  {item.icon}
                </span>
                
                {active && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.15em] text-[#402d00] whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
};
