"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  role?: "admin" | "user";
  onBannersClick?: () => void;
  onProfileClick?: () => void;
}

export const ProfileMenu = ({ isOpen, onClose, role = "user", onBannersClick, onProfileClick }: ProfileMenuProps) => {
  const { language, setLanguage, t } = useLanguage();

   const menuItems = [
    { label: t("my_profile"), icon: "person", href: "#", isProfile: true },
    { label: t("admin"), icon: "view_carousel", href: "/admin", isBanners: true },
    { label: "Telegram: @Dacribel", icon: "send", href: "https://t.me/Dacribel" },
    { label: t("terms_conditions"), icon: "description", href: "#" },
    { label: t("about_us"), icon: "info", href: "#" },
  ].filter(item => {
    if (item.href === "/admin") return role === "admin";
    if (item.label.includes("Telegram") && role === "admin") return false;
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/5 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, x: 10, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-14 right-4 z-[70] w-[230px] bg-[#1a1c2e]/95 backdrop-blur-2xl text-white rounded-[1.25rem] shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-headline border border-white/5"
          >
            <div className="px-4 pt-5 pb-2 flex flex-col items-start gap-0.5">
              <div className="w-10 h-10 rounded-full overflow-hidden mb-1.5 bg-[#0a0b14] ring-1 ring-primary/40">
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"
                />
              </div>
              <span className="text-[10px] font-bold text-primary/60 mb-0.5 lowercase">
                {role === "admin" ? "admin@dacribel.com" : "cliente@ejemplo.com"}
              </span>
              <h2 className="text-sm font-black tracking-tight leading-none text-on-surface">Ereogan Aysel</h2>
            </div>

            <nav className="flex flex-col px-1 py-2">
              {menuItems.map((item, idx) => {
                const isAction = item.href === "#" || (item.isBanners && onBannersClick) || (item.isProfile && onProfileClick);
                
                return isAction ? (
                  <button
                    key={idx}
                    onClick={() => {
                      if (item.isBanners && onBannersClick) {
                        onBannersClick();
                      } else if (item.isProfile && onProfileClick) {
                        onProfileClick();
                      }
                      onClose();
                    }}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-white/80 font-bold hover:bg-white/5 hover:text-white transition-all active:scale-95 group w-full text-left"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {item.icon}
                    </span>
                    <span className="text-[11px] tracking-tight">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-white/80 font-bold hover:bg-white/5 hover:text-white transition-all active:scale-95 group"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {item.icon}
                    </span>
                    <span className="text-[11px] tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
              
              <div className="h-[1px] bg-white/5 my-1.5 mx-3" />
              
              {role !== "admin" && (
                <button className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-red-400 font-bold hover:bg-red-500/10 transition-all active:scale-95 group w-full text-left">
                  <span className="material-symbols-outlined text-red-500 text-[18px]">delete_forever</span>
                  <span className="text-[11px] tracking-tight">{t("delete_account")}</span>
                </button>
              )}
              <button className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-white font-bold hover:bg-white/5 transition-all active:scale-95 group w-full text-left">
                <span className="material-symbols-outlined text-primary text-[18px]">logout</span>
                <span className="text-[11px] tracking-tight">{t("logout")}</span>
              </button>
            </nav>

            <div className="px-4 py-4 bg-black/30 border-t border-white/5">
              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-white/30 mb-3 block text-center">{t("language")}</span>
              <div className="relative flex w-full h-10 bg-[#0a0b14] rounded-xl p-1 border border-white/5 shadow-2lx">
                <motion.div
                  className="absolute h-8 bg-primary/10 rounded-lg z-0 border border-primary/20"
                  animate={{
                    x: language === "en" ? 0 : "calc(100% - 2px)",
                    width: "50%",
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 200 }}
                  style={{ left: 1 }}
                />
                
                <button
                  onClick={() => setLanguage("en")}
                  className={`relative flex-1 flex items-center justify-center gap-2 z-10 h-full font-black text-[10px] uppercase tracking-tight transition-all duration-300 ${
                    language === "en" ? "text-primary drop-shadow-[0_0_8px_rgba(242,185,47,0.4)]" : "text-white/30 hover:text-white/50"
                  }`}
                >
                  <img src="https://flagcdn.com/w40/us.png" alt="English" className="w-4 h-3 object-cover rounded-[2px] shadow-sm" />
                  <span>EN</span>
                </button>

                <button
                  onClick={() => setLanguage("es")}
                  className={`relative flex-1 flex items-center justify-center gap-2 z-10 h-full font-black text-[10px] uppercase tracking-tight transition-all duration-300 ${
                    language === "es" ? "text-primary drop-shadow-[0_0_8px_rgba(242,185,47,0.4)]" : "text-white/30 hover:text-white/50"
                  }`}
                >
                  <img src="https://flagcdn.com/w40/es.png" alt="Español" className="w-4 h-3 object-cover rounded-[2px] shadow-sm" />
                  <span>ES</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
