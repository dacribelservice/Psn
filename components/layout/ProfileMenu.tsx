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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
          />

          {/* Menu Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-20 right-6 z-[70] w-full max-w-[340px] bg-[#30334a] text-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col font-headline"
          >
            {/* Header Section: Profile */}
            <div className="px-6 pt-8 pb-4 flex flex-col items-start gap-1">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 bg-[#191b23] border-2 border-primary/20">
                <img
                  alt="User Profile Picture"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"
                />
              </div>
              <h2 className="text-xl font-black tracking-tight leading-tight">Ereogan Aysel</h2>
              <p className="text-sm font-medium text-white/70">cangel2800@gmail.com</p>
              <div className="mt-2 px-2 py-0.5 bg-primary text-on-primary rounded text-[10px] font-bold uppercase tracking-wider">
                {t("admin")}
              </div>
            </div>

            {/* Menu Items List */}
            <nav className="flex flex-col px-2 py-4">
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">person</span>
                <span className="text-sm">{t("my_profile")}</span>
              </a>
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">admin_panel_settings</span>
                <span className="text-sm">{t("admin")}</span>
              </a>
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">payments</span>
                <span className="text-sm">{t("affiliate_program")}</span>
              </a>
              <a href="https://t.me/Dacribel" target="_blank" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">send</span>
                <span className="text-sm">Telegram: @Dacribel</span>
              </a>
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">description</span>
                <span className="text-sm">{t("terms_conditions")}</span>
              </a>
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-semibold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">info</span>
                <span className="text-sm">{t("about_us")}</span>
              </a>
              
              <div className="h-[1px] bg-[#191b23] my-2 mx-4 opacity-50" />
              
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-red-400 font-bold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-red-500 group-hover:scale-110 transition-transform">delete_forever</span>
                <span className="text-sm">{t("delete_account")}</span>
              </a>
              <a href="#" className="flex items-center gap-4 py-3 px-4 rounded-xl text-white font-bold hover:bg-[#191b23] transition-all active:scale-95 group">
                <span className="material-symbols-outlined text-primary group-hover:rotate-12 transition-transform">logout</span>
                <span className="text-sm">{t("logout")}</span>
              </a>
            </nav>

            {/* Footer Section: Language Selector */}
            <div className="px-6 py-6 mt-2 border-t border-[#191b23] flex flex-col gap-3 bg-[#191b23]/30">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">{t("language")}</span>
              <div className="relative flex w-full h-11 bg-[#191b23] rounded-full p-1 cursor-pointer select-none items-center overflow-hidden border border-white/5">
                {/* Highlight slider */}
                <motion.div
                  className="absolute h-9 bg-primary rounded-full z-0"
                  animate={{
                    x: language === "en" ? 0 : "100%",
                    width: "50%",
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  style={{ left: 4 }}
                />

                {/* English Option */}
                <button
                  onClick={() => setLanguage("en")}
                  className={`relative flex-1 flex items-center justify-center z-10 h-full transition-colors duration-300 font-bold text-xs outline-none ${
                    language === "en" ? "text-[#402d00]" : "text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <span>{t("english")}</span>
                  </div>
                </button>

                {/* Spanish Option */}
                <button
                  onClick={() => setLanguage("es")}
                  className={`relative flex-1 flex items-center justify-center z-10 h-full transition-colors duration-300 font-bold text-xs outline-none ${
                    language === "es" ? "text-[#402d00]" : "text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🇪🇸</span>
                    <span>{t("spanish")}</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
