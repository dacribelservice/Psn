"use client";

import React, { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import { useLanguage } from "@/context/LanguageContext";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface-container-low/60 dark:bg-[#11131b]/60 backdrop-blur-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] lg:pl-64 border-b border-white/5">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-[#f7be34] hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <span className="text-2xl font-black text-[#f7be34] tracking-tighter lg:hidden drop-shadow-lg">DACRIBEL</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative text-[#c3c4e2] hover:text-[#f7be34] transition-all cursor-pointer group">
              <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">notifications</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse"></span>
            </div>
            <div 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="group flex items-center gap-2 bg-surface-container-high hover:bg-[#282a32] px-1 py-1 rounded-full border border-white/5 transition-all cursor-pointer hover:border-primary/40 active:scale-95 shadow-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-primary-container overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                <img
                  alt="User Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"
                />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};
