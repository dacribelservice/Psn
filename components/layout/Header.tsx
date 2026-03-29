"use client";

import React, { useState } from "react";
import { ProfileMenu } from "./ProfileMenu";
import { BannersModal } from "../ui/BannersModal";
import { EditProfileModal } from "../ui/EditProfileModal";
import { UserTermsBottomSheet } from "../ui/UserTermsBottomSheet";
import { AdminTermsModal } from "../admin/AdminTermsModal";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export const Header = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBannersOpen, setIsBannersOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#11131b]/80 backdrop-blur-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 border-b border-white/5 flex items-center justify-between px-4 lg:px-12 lg:ml-64">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-black text-primary tracking-tighter md:hidden">Dacribel</h1>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <Link 
              href="/login"
              className="bg-primary hover:brightness-110 text-black px-6 py-2 rounded-full font-black text-xs uppercase tracking-tight shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              {t("login") || "Iniciar Sesión"}
            </Link>
          ) : (
            <button 
              onClick={() => setIsProfileOpen(true)}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 hover:border-primary/50 transition-all active:scale-90 shadow-lg"
            >
              <img
                alt="User Profile"
                className="w-full h-full object-cover"
                src={user.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuDpvdosY8hXR9RcE-AlZ6LYfaccSRjHhhfArF6dJqIfH3op9RoqWHH6MvnDylbgMGnM9UyUjd-R1tXBQWsA0wx69orgeUqgk9IUjg1tjr1774Yzgn6S5zXzkTRhrlIF9KkBpaezh61xMqIkHQTssjjpqu9_4bQE4FzFkBHoqPKFz_CfORnjqqaddZ9i0aJZY-Lx9e-Vba1A0VowKb2Tkb94Pyqw4bXPhvlWSvF2oletob-NnR06Y1Fc1mKNQGFocI-2IfJz20MT8LK0"}
              />
            </button>
          )}
        </div>
      </header>
      
      {/* Popups */}
      <ProfileMenu 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        onBannersClick={() => setIsBannersOpen(true)}
        onProfileClick={() => setIsEditProfileOpen(true)}
        onTermsClick={() => setIsTermsOpen(true)}
      />
      <BannersModal isOpen={isBannersOpen} onClose={() => setIsBannersOpen(false)} />
      <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
      {user?.role === "admin" ? (
        <AdminTermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      ) : (
        <UserTermsBottomSheet isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      )}
    </>
  );
};
