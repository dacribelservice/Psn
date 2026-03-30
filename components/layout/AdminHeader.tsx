"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationsPopup } from "./NotificationsPopup";
import { BannersModal } from "../ui/BannersModal";
import { EditProfileModal } from "../ui/EditProfileModal";
import { AdminTermsModal } from "../admin/AdminTermsModal";
import { useAuth } from "@/context/AuthContext";

export const AdminHeader = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBannersOpen, setIsBannersOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAdminTermsOpen, setIsAdminTermsOpen] = useState(false);
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.includes("/admin/inventory")) return t("inventory");
    if (pathname.includes("/admin/finances")) return t("finances");
    return t("inventory");
  };

  return (
    <>
      <header className="fixed top-0 w-full z-[100] lg:w-[calc(100%-16rem)] flex items-center justify-between px-6 h-16 bg-[#11131b]/80 backdrop-blur-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-b border-white/5 lg:ml-64">
        <div className="flex items-center gap-4">
          <div className="lg:hidden flex items-center justify-center">
            <img
              alt="Dacribel Logo"
              className="h-8 w-8 object-contain"
              src="/Logos/D.png"
            />
          </div>
          <h2 className="font-headline font-black text-[10px] text-[#c3c4e2] uppercase tracking-[0.25em] leading-none">
            {getTitle()}
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
              setIsBannersOpen(false);
              setIsEditProfileOpen(false);
              setIsAdminTermsOpen(false);
            }}
            className="relative w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-all active:scale-95 group"
          >
            <span className="material-symbols-outlined text-[#c3c4e2]/60 group-hover:text-primary transition-colors text-[22px]">notifications</span>
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-[#11131b] animate-pulse shadow-[0_0_10px_rgba(242,185,47,0.5)]"></span>
          </button>

          <button 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
              setIsBannersOpen(false);
              setIsEditProfileOpen(false);
              setIsAdminTermsOpen(false);
            }}
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all active:scale-90 shadow-lg"
          >
            <img
              alt="Admin Avatar"
              className="w-full h-full object-cover"
              src={user?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"}
            />
          </button>
        </div>
      </header>

      {/* Popups */}
      <ProfileMenu 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onBannersClick={() => setIsBannersOpen(true)}
        onProfileClick={() => setIsEditProfileOpen(true)}
        onTermsClick={() => setIsAdminTermsOpen(true)}
      />
      <NotificationsPopup isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <BannersModal isOpen={isBannersOpen} onClose={() => setIsBannersOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      <AdminTermsModal isOpen={isAdminTermsOpen} onClose={() => setIsAdminTermsOpen(false)} />
    </>
  );
};
