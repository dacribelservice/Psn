"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileMenu = ({ isOpen, onClose }: ProfileMenuProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/10 backdrop-blur-sm lg:hidden"
          />

          {/* Menu Card - Ultra Compact Version */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10, x: 10, originX: 1, originY: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10, x: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed top-14 right-4 z-[70] w-[230px] bg-[#1a1c2e]/95 backdrop-blur-2xl text-white rounded-[1.25rem] shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-headline border border-white/5"
          >
            {/* ULTRA COMPACT Header Section */}
            <div className="px-4 pt-5 pb-2 flex flex-col items-start gap-0.5">
              <div className="w-10 h-10 rounded-full overflow-hidden mb-1.5 bg-[#0a0b14] ring-1 ring-primary/40">
                <img
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"
                />
              </div>
              <h2 className="text-sm font-black tracking-tight leading-none text-on-surface">Ereogan Aysel</h2>
              <div className="mt-1 px-1 py-0.5 bg-primary/20 border border-primary/30 text-primary rounded text-[8px] font-black uppercase tracking-tighter">
                {t("admin")}
              </div>
            </div>

            {/* ULTRA COMPACT Menu Items List */}
            <nav className="flex flex-col px-1 py-2">
              {[
                { label: t("my_profile"), icon: "person" },
                { label: t("admin"), icon: "admin_panel_settings" },
                { label: "Telegram: @Dacribel", icon: "send", url: "https://t.me/Dacribel" },
                { label: t("terms_conditions"), icon: "description" },
                { label: t("about_us"), icon: "info" },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.url || "#"}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-white/80 font-bold hover:bg-white/5 hover:text-white transition-all active:scale-95 group"
                >
                  <span className="material-symbols-outlined text-primary text-[18px]">
                    {item.icon}
                  </span>
                  <span className="text-[11px] tracking-tight">{item.label}</span>
                </a>
              ))}
              
              <div className="h-[1px] bg-white/5 my-1.5 mx-3" />
              
              <a href="#" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-red-400 font-bold hover:bg-red-500/10 transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-red-500 text-[18px]">delete_forever</span>
                <span className="text-[11px] tracking-tight">{t("delete_account")}</span>
              </a>
              <a href="#" className="flex items-center gap-2.5 py-2 px-3 rounded-lg text-white font-bold hover:bg-white/5 transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary text-[18px]">logout</span>
                <span className="text-[11px] tracking-tight">{t("logout")}</span>
              </a>
            </nav>

            {/* MINI Footer Section: Language */}
            <div className="px-4 py-3 bg-black/30 border-t border-white/5">
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/30 mb-2 block">{t("language")}</span>
              <div className="relative flex w-full h-8 bg-[#0a0b14] rounded-full p-0.5 border border-white/5 shadow-inner">
                <motion.div
                  className="absolute h-7 bg-primary rounded-full z-0"
                  animate={{
                    x: language === "en" ? 0 : "100%",
                    width: "50%",
                  }}
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                  style={{ left: 2 }}
                />
                <button
                  onClick={() => setLanguage("en")}
                  className={`relative flex-1 flex items-center justify-center z-10 h-full font-black text-[9px] uppercase tracking-tighter transition-colors ${
                    language === "en" ? "text-background" : "text-white/30"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("es")}
                  className={`relative flex-1 flex items-center justify-center z-10 h-full font-black text-[9px] uppercase tracking-tighter transition-colors ${
                    language === "es" ? "text-background" : "text-white/30"
                  }`}
                >
                  ES
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
