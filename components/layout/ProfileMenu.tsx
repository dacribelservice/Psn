"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onBannersClick?: () => void;
  onProfileClick?: () => void;
  onTermsClick?: () => void;
}

export const ProfileMenu = ({ isOpen, onClose, onBannersClick, onProfileClick, onTermsClick }: ProfileMenuProps) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, signOut, deleteAccount, loading } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    onClose();
    await signOut();
  };

  const menuItems = [
    { 
      label: t("my_profile") || "Mi perfil", 
      icon: "person", 
      onClick: () => { onClose(); onProfileClick?.(); },
      show: !!user 
    },
    { 
      label: "Telegram: @Dacribel", 
      icon: "send", 
      onClick: () => window.open("https://t.me/Dacribel", "_blank"),
      show: true 
    },
    { 
      label: "Banners", 
      icon: "view_carousel", 
      onClick: () => { onClose(); onBannersClick?.(); },
      show: role === "admin" 
    },
    { 
      label: language === 'es' ? "Términos y condiciones" : "Terms and conditions", 
      icon: "description", 
      onClick: () => { onClose(); onTermsClick?.(); },
      show: true 
    },
    { 
      label: t("about_us") || "Sobre nosotros", 
      icon: "info", 
      onClick: onClose,
      show: true 
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="absolute bottom-24 right-4 md:bottom-auto md:top-20 md:right-8 w-72 bg-[#191b23] border border-white/5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
      >
        <div className="p-6 bg-gradient-to-br from-[#191b23] to-[#11131b]">
          <div className="flex items-center gap-4 mb-6">
            {/* Avatar Container */}
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 p-0.5 relative flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-white/5 flex items-center justify-center shadow-inner text-white/10">
                {user?.avatar_url ? (
                  <img 
                    src={user.avatar_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="material-symbols-outlined text-white/30 text-2xl">account_circle</span>
                )}
              </div>
              
              {/* Badge Verificado VIP - Estrella Negra */}
              {user && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-primary rounded-full border-2 border-[#191b23] flex items-center justify-center z-30 shadow-lg select-none">
                  <span className="material-symbols-outlined text-[13px] text-[#000000] font-black fill-current">star</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-primary/60 mb-0.5 lowercase tracking-tight truncate">
                {user?.email || (loading ? "Verificando..." : "Modo Invitado")}
              </span>
              <h2 className="text-sm font-black tracking-tight leading-none text-on-surface uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] truncate">
                {user?.full_name || user?.email?.split('@')[0] || (loading ? "Cargando..." : "Invitado")}
              </h2>
            </div>
          </div>

          <nav className="flex flex-col space-y-1">
            {menuItems.filter(item => item.show).map((item, idx) => (
              <button
                key={idx}
                onClick={item.onClick}
                className="flex items-center space-x-3 px-3 py-2.5 text-on-surface hover:bg-white/5 rounded-xl transition-all group"
              >
                <span className="material-symbols-outlined text-[20px] text-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-xs font-bold tracking-tight text-on-surface/80 group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </button>
            ))}

            {!user && (
               <button 
                onClick={() => { onClose(); router.push('/login'); }}
                className="mt-4 w-full bg-primary text-background font-black py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all text-[10px] uppercase tracking-widest"
              >
                Iniciar Sesión
              </button>
            )}

            {user && (
              <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                {role !== "admin" && (
                  <button 
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-500/70 hover:text-red-500 hover:bg-red-500/5 rounded-xl transition-all group"
                  >
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">delete</span>
                    <span className="text-[10px] font-black uppercase text-xs">Eliminar Cuenta</span>
                  </button>
                )}

                <button 
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-primary/70 hover:text-primary hover:bg-primary/5 rounded-xl transition-all group"
                >
                  <span className="material-symbols-outlined text-[20px] text-primary group-hover:-translate-x-1 transition-transform">logout</span>
                  <span className="text-[10px] font-black uppercase tracking-tight text-xs">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </nav>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.25em] mb-4 text-center italic">Select Language</p>
            <div className="flex items-center justify-center gap-2 p-1 bg-surface-container-low/50 rounded-full border border-secondary/10">
              <button 
                onClick={() => setLanguage("en")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  language === "en" 
                    ? "bg-[#f2b92f] text-[#402d00] shadow-[0_2px_10px_rgba(242,185,47,0.3)] scale-[1.02]" 
                    : "text-secondary/60 hover:text-on-surface bg-transparent"
                }`}
              >
                <img alt="USA" className="rounded-sm opacity-80" src="https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/app-assets/flags/usa_1775110111294.png" width="18" />
                English
              </button>
              <button 
                onClick={() => setLanguage("es")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  language === "es" 
                    ? "bg-[#f2b92f] text-[#402d00] shadow-[0_2px_10px_rgba(242,185,47,0.3)] scale-[1.02]" 
                    : "text-secondary/60 hover:text-on-surface bg-transparent"
                }`}
              >
                <img alt="Spain" className="rounded-sm opacity-80" src="https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/app-assets/flags/espana_1775110789759.png" width="18" />
                Español
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Account Modal - Modern */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-[#191b23] border border-red-500/20 p-8 rounded-[2rem] w-full max-sm shadow-2xl"
            >
              <div className="text-center">
                <span className="material-symbols-outlined text-red-500 text-5xl mb-4">warning</span>
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">¿Estás seguro?</h3>
                <p className="text-white/50 text-xs mb-8 font-bold">
                  Esta acción es irreversible y perderás tu saldo.
                </p>
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={async () => {
                      setIsDeleteModalOpen(false);
                      await deleteAccount();
                      onClose();
                    }}
                    className="w-full bg-red-600 text-white font-black py-4 rounded-xl shadow-lg hover:bg-red-700 transition-all text-[10px] uppercase"
                  >
                    Sí, eliminar para siempre
                  </button>
                  <button 
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="w-full bg-white/5 text-white/50 font-black py-4 rounded-xl hover:bg-white/10 transition-all text-[10px] uppercase"
                  >
                    Me arrepentí
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
