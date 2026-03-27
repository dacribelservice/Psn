"use client";

import React, { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#11131b]/80 backdrop-blur-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 border-b border-white/5 flex items-center justify-between px-4 lg:px-12 lg:ml-64">
        <div className="flex items-center gap-3">
          <button className="text-primary hover:bg-[#282a32] transition-colors p-2 rounded-lg active:scale-95 duration-200 md:hidden">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-xl font-bold text-primary tracking-tighter font-['Inter'] md:hidden">Dacribel</h1>
        </div>

        <div className="flex items-center gap-6">
          {/* User Account with Trigger */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all active:scale-90 shadow-lg"
          >
            <img
              alt="User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"
            />
          </button>
        </div>
      </header>
      
      {/* Popups */}
      <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};
