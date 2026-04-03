"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { UserTermsBottomSheet } from "@/components/ui/UserTermsBottomSheet";

export default function UpdatePasswordPage() {
  const { language, setLanguage } = useLanguage();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/forgot-password?error=Enlace expirado");
      }
    };
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage(language === "es" ? "Las contraseñas no coinciden" : "Passwords do not match");
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setErrorMessage(language === "es" ? "Mínimo 6 caracteres" : "Minimum 6 characters");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await updatePassword(password);
    } catch (err: any) {
      console.error("Update Error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Error al actualizar la contraseña");
    }
  };

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen flex items-center justify-center p-4 text-center">
      <main className="w-full max-w-md mx-auto">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <img 
            alt="DACRIBEL Logo" 
            className="h-auto object-contain w-[220px]" 
            src="/Logos/dacribel.png" 
          />
        </div>

        {/* Glassmorphism Container */}
        <div className="glass-vault rounded-[2.5rem] p-8 md:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/5">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* Contextual Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-headline font-extrabold tracking-tight text-white mb-2">
                {language === "es" ? "Nueva contraseña" : "New password"}
              </h2>
              <p className="text-secondary/50 text-xs">
                {language === "es" 
                  ? "Crea una clave segura para tu cuenta." 
                  : "Create a secure password for your account."}
              </p>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                    {language === "es" ? "NUEVA CLAVE" : "NEW PASSWORD"}
                  </label>
                  <div className="relative group input-glow rounded-xl overflow-hidden transition-all border border-white/5 bg-surface-container-low/30 focus-within:border-[#f2b92f]/50">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-secondary/40 text-lg">lock</span>
                    </div>
                    <input 
                      className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-on-surface placeholder:text-secondary/30 focus:ring-0 text-sm outline-none" 
                      placeholder="••••••••" 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={status === "loading"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                    {language === "es" ? "CONFIRMAR CLAVE" : "CONFIRM PASSWORD"}
                  </label>
                  <div className="relative group input-glow rounded-xl overflow-hidden transition-all border border-white/5 bg-surface-container-low/30 focus-within:border-[#f2b92f]/50">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-secondary/40 text-lg">check_circle</span>
                    </div>
                    <input 
                      className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-on-surface placeholder:text-secondary/30 focus:ring-0 text-sm outline-none" 
                      placeholder="••••••••" 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={status === "loading"}
                    />
                  </div>
                </div>
              </div>

              {status === "error" && (
                <p className="text-red-400 text-[10px] uppercase font-black tracking-widest bg-red-400/10 py-2 rounded-lg border border-red-400/20 px-2">
                  {errorMessage}
                </p>
              )}

              <button 
                disabled={status === "loading"}
                className="w-full bg-gradient-to-b from-[#f2b92f] to-[#d49e1a] hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:grayscale transition-all duration-200 text-[#402d00] font-headline font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(242,185,47,0.2)] mt-4 flex items-center justify-center gap-2" 
                type="submit"
              >
                {status === "loading" ? (
                  <div className="w-5 h-5 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin" />
                ) : (
                  <>
                    {language === "es" ? "Guardar nueva clave" : "Save new password"}
                    <span className="material-symbols-outlined text-lg">key</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>

          <footer className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
             <div className="flex items-center gap-2 p-1 bg-surface-container-low/50 rounded-full border border-secondary/10">
              <button 
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  language === "en" 
                    ? "bg-[#f2b92f] text-[#402d00] shadow-[0_2px_10px_rgba(242,185,47,0.2)]" 
                    : "text-secondary hover:text-on-surface bg-transparent"
                }`}
              >
                <img alt="USA" className="rounded-sm opacity-80" src="https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/app-assets/flags/usa_1775110111294.png" width="20" />
                EN
              </button>
              <button 
                onClick={() => setLanguage("es")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  language === "es" 
                    ? "bg-[#f2b92f] text-[#402d00] shadow-[0_2px_10px_rgba(242,185,47,0.2)]" 
                    : "text-secondary hover:text-on-surface bg-transparent"
                }`}
              >
                <img alt="Spain" className="rounded-sm opacity-80" src="https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/app-assets/flags/espana_1775110789759.png" width="20" />
                ES
              </button>
            </div>

             <button 
                onClick={() => setIsTermsOpen(true)}
                className="text-[10px] font-bold uppercase tracking-widest hover:text-[#f2b92f] transition-all cursor-pointer opacity-50 hover:opacity-100"
              >
                {language === "es" ? "Términos y condiciones" : "Terms & Conditions"}
              </button>
          </footer>

          {/* Decorative Accents */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary-container/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/5 blur-[80px] rounded-full pointer-events-none"></div>
        </div>
      </main>

      <UserTermsBottomSheet 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      <style jsx>{`
        .glass-vault {
          background: rgba(30, 32, 47, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .input-glow:focus-within {
          box-shadow: 0 0 20px rgba(242, 185, 47, 0.1);
        }
      `}</style>
    </div>
  );
}
