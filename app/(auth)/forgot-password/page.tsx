"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const { language, setLanguage } = useLanguage();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password recovery attempt for:", email);
    // TODO: Implement password recovery logic with Supabase later
    alert(language === "es" 
      ? "Si el correo existe, recibirás instrucciones para restablecer tu contraseña." 
      : "If the email exists, you will receive instructions to reset your password.");
  };

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen flex items-center justify-center p-4 text-center">
      <main className="w-full max-w-md mx-auto">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <img 
            alt="DACRIBEL Logo" 
            className="h-auto object-contain w-[240px]" 
            src="https://lh3.googleusercontent.com/aida/ADBb0uhlAiU1opdlk2irfPaVF4hn1ccgOW-zSG0zP-2VTSS0fHxdfiqO4EyZfLPQfAIghU3jK3VBdglySg_zUWuuqBhyBqZtRwTrWVEtpiVcb3ZOxeu3LpeA5lludD6HiDNrnVZld2JC8Haxv9hlfXbqLvS9R7DVYv1dv-pIfchKI3gmBr0x8_kP5CCIbm1-h1b7ecV1aSikLgV4M6D191M1gUNOzNgztX0DuUdxU4kLvLYhpr3Fj6wRA-RQv1NIpHxIpRlNM0VDeQ6yLTA" 
          />
        </div>

        {/* Glassmorphism Container */}
        <div className="glass-vault rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Contextual Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
              {language === "es" ? "Recuperar tu contraseña" : "Recover your password"}
            </h2>
          </div>

          {/* Credentials Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                {language === "es" ? "CORREO ELECTRÓNICO" : "EMAIL ADDRESS"}
              </label>
              <div className="relative group input-glow rounded-xl overflow-hidden transition-all">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-secondary/40 text-lg">mail</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low/50 border-none py-4 pl-12 pr-4 text-on-surface placeholder:text-secondary/30 focus:ring-0 text-sm outline-none" 
                  placeholder="name@vault.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              className="w-full bg-gradient-to-b from-[#f2b92f] to-[#d49e1a] hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-[#402d00] font-headline font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(242,185,47,0.2)] mt-4" 
              type="submit"
            >
              {language === "es" ? "Recuperar" : "Recover"}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-secondary/60">
              {language === "es" ? "¿No tienes una cuenta?" : "Don't have an account?"}
              <Link 
                className="text-[#f2b92f] font-bold hover:brightness-110 transition-colors ml-1 underline decoration-[#f2b92f]/30 underline-offset-4 cursor-pointer" 
                href="/register"
              >
                {language === "es" ? "Crear cuenta" : "Create account"}
              </Link>
            </p>
            <p className="text-sm text-secondary/60 mt-3">
              <Link 
                className="text-secondary/40 hover:text-secondary transition-colors cursor-pointer text-xs uppercase font-bold tracking-widest" 
                href="/login"
              >
                {language === "es" ? "Volver al inicio de sesión" : "Back to login"}
              </Link>
            </p>
          </div>

          <div className="mt-8 flex flex-col items-center gap-4">
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
                English
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
                Español
              </button>
            </div>
          </div>

          {/* Tonal Accent (Subtle Glow) */}
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
    </div>
  );
}
