"use client";

import React, { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationsPopup } from "./NotificationsPopup";

export const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-2xl z-50 border-b border-white/5 flex items-center justify-between px-6 lg:px-12 lg:ml-64">
      <div className="flex items-center gap-4">
        {/* Mobile menu trigger could go here */}
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications Icon with Badge */}
        <button 
          onClick={() => {
            setIsNotificationsOpen(!isNotificationsOpen);
            setIsProfileOpen(false);
          }}
          className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 group"
        >
          <span className="material-symbols-outlined text-[#c3c4e2]/60 group-hover:text-primary transition-colors text-[22px]">notifications</span>
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background animate-pulse shadow-[0_0_10px_rgba(242,185,47,0.5)]"></span>
        </button>

        {/* User Account with Trigger */}
        <button 
          onClick={() => {
            setIsProfileOpen(!isProfileOpen);
            setIsNotificationsOpen(false);
          }}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all active:scale-90 shadow-lg"
        >
          <img
            alt="User Profile"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"
          />
        </button>
      </div>

      {/* Popups */}
      <ProfileMenu isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
      <NotificationsPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </header>
  );
};
