"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationsPopup } from "./NotificationsPopup";
import { BannersModal } from "../ui/BannersModal";
import { EditProfileModal } from "../ui/EditProfileModal";
import { AdminTermsModal } from "../admin/AdminTermsModal";

export const AdminHeader = () => {
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
      <header className="fixed top-0 w-full z-30 lg:w-[calc(100%-16rem)] flex items-center justify-between px-6 h-16 bg-[#11131b]/80 backdrop-blur-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-b border-white/5 lg:ml-64">
        <div className="flex items-center gap-4">
          <div className="lg:hidden flex items-center justify-center">
            <img
              alt="Dacribel Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/ADBb0uj5p-4GtknURpd5gNSxR4Z4lAt9udSnfL-1yy-Jq7duIjogDvqP6tClCfHjJMotirByytz1cgkkgCAthcl6r3RcODgBzuPLZ6umjCoo7SZz3BkaseBNpq9wVzfH6CLN-49trldqBRfLNPB0zfS_Z8xHVr-CsUu3q2GZuMdzshMhhapC1Dx8TbgxyZHGM7S1mT4OWSSIE1cXZOr1lG0Ud2lpuD2mjuZLtDpR6OAp8ptfShtxCfSZZHm394TBIsoGxfUTo6xSbXoDfDs"
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
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZh39ZD51iNoZ1Jt-MXXm4hzMzLzHFq7Lx6p8WuVzeucNwy-dMOvT719lQKnP83e6JsjCBSa5Tiy_SAq_CuhNq1m1p9mSoPgocqzsHSu_Vn3s8N_A5gqG4-wrPlx8W1Qxk20Rss6U083pCeo9GblLCr3kVq6ZOsiKscjS34HDmPz8fAIXT6MzKK80_S4yXVsMmqobApinfoYrrE5fX8FwIQVIFHdspS0-S5OV7AO7XTZiOoh9xPZR_5NKCrbisKieKcU_d4xOFfV6z"
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
