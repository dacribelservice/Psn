"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const { language, setLanguage } = useLanguage();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await resetPassword(email);
      setStatus("success");
    } catch (err: any) {
      console.error("Recovery Error:", err);
      setStatus("error");
      setErrorMessage(err.message || "Error al enviar el correo de recuperación");
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
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <span className="material-symbols-outlined text-green-400 text-4xl">mark_email_read</span>
                </div>
                <h2 className="text-2xl font-headline font-extrabold text-white">
                  {language === "es" ? "¡Correo enviado!" : "Email sent!"}
                </h2>
                <p className="text-secondary/70 text-sm leading-relaxed px-4">
                  {language === "es" 
                    ? `Hemos enviado un enlace de recuperación a ${email}. Revisa tu bandeja de entrada (y spam).` 
                    : `We've sent a recovery link to ${email}. Check your inbox (and spam).`}
                </p>
                <Link 
                  href="/login"
                  className="block w-full bg-surface-container-highest text-white font-headline font-extrabold py-4 rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                >
                  {language === "es" ? "Volver al Login" : "Back to Login"}
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {/* Contextual Header */}
                <div className="mb-8">
                  <h2 className="text-3xl font-headline font-extrabold tracking-tight text-white mb-2">
                    {language === "es" ? "Recuperar cuenta" : "Recover account"}
                  </h2>
                  <p className="text-secondary/50 text-xs">
                    {language === "es" 
                      ? "Ingresa tu correo para recibir instrucciones." 
                      : "Enter your email to receive instructions."}
                  </p>
                </div>

                {/* Credentials Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2 text-left">
                    <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                      {language === "es" ? "CORREO ELECTRÓNICO" : "EMAIL ADDRESS"}
                    </label>
                    <div className="relative group input-glow rounded-xl overflow-hidden transition-all border border-white/5 bg-surface-container-low/30 focus-within:border-[#f2b92f]/50">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-secondary/40 text-lg">mail</span>
                      </div>
                      <input 
                        className="w-full bg-transparent border-none py-4 pl-12 pr-4 text-on-surface placeholder:text-secondary/30 focus:ring-0 text-sm outline-none" 
                        placeholder="name@vault.com" 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={status === "loading"}
                      />
                    </div>
                  </div>

                  {status === "error" && (
                    <p className="text-red-400 text-[10px] uppercase font-black tracking-widest bg-red-400/10 py-2 rounded-lg border border-red-400/20">
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
                        {language === "es" ? "Enviar instrucciones" : "Send instructions"}
                        <span className="material-symbols-outlined text-lg">send</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 flex flex-col gap-3">
                  <p className="text-[11px] text-secondary/60">
                    <Link 
                      className="text-secondary/40 hover:text-[#f2b92f] transition-all cursor-pointer uppercase font-bold tracking-widest flex items-center justify-center gap-1" 
                      href="/login"
                    >
                      <span className="material-symbols-outlined text-sm">arrow_back</span>
                      {language === "es" ? "Volver al inicio de sesión" : "Back to login"}
                    </Link>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 p-1 bg-surface-container-low/50 rounded-full border border-secondary/10">
              <button 
                onClick={() => setLanguage("en")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  language === "en" 
                    ? "bg-[#f2b92f] text-[#402d00] shadow-[0_2px_10px_rgba(242,185,47,0.2)]" 
                    : "text-secondary hover:text-on-surface bg-transparent"
                }`}
              >
                <img alt="USA" className="rounded-sm opacity-80" src="https://flagcdn.com/w40/us.png" width="20" />
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
                <img alt="Spain" className="rounded-sm opacity-80" src="https://flagcdn.com/w40/es.png" width="20" />
                ES
              </button>
            </div>
          </div>

          {/* Decorative Accents */}
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary-container/10 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-secondary/5 blur-[80px] rounded-full pointer-events-none"></div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
          <Link className="text-[10px] font-bold uppercase tracking-widest hover:text-primary-container" href="/terms">
            {language === "es" ? "Términos y condiciones" : "Terms & Conditions"}
          </Link>
        </div>
      </main>

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
