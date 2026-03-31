"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserTermsBottomSheet } from "@/components/ui/UserTermsBottomSheet";

export default function LoginPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, signIn, signInWithGoogle, loading, role } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    console.log("LoginPage: Effect triggered", { hasUser: !!user, loading, role });
    if (user && !loading) {
      // MASTER OVERRIDE: Owner is ALWAYS redirected to admin (with case-insensitiy)
      const masterEmails = ["cangel@gmail.com", "cangelgames@gmail.com"];
      const userEmail = user?.email?.toLowerCase().trim();
      const isMasterAdmin = masterEmails.includes(userEmail || "");
      const target = (role === "admin" || isMasterAdmin) ? "/admin/inventory" : "/";
      
      console.log("MASTER REDIRECT: Going to", target, { role, isMasterAdmin });
      
      // We use window.location.href instead of router.push for the FIRST login
      // to force a full cookie sync with the middleware
      window.location.href = target;
    }
  }, [user, loading, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (password.length < 6) {
      setError(language === "es" ? "La contraseña debe tener al menos 6 caracteres." : "Password should be at least 6 characters.");
      return;
    }

    try {
      await signIn(email, password);
    } catch (error: any) {
      console.error("Login failed:", error);
      setError(error.message || (language === "es" ? "Error al iniciar sesión." : "Login failed."));
    }
  };

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen flex items-center justify-center p-4">
      <main className="w-full max-w-md mx-auto">
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <img 
            alt="DACRIBEL Logo" 
            className="h-auto object-contain w-[240px]" 
            src="/Logos/dacribel.png" 
          />
        </div>

        {/* Glassmorphism Login Container */}
        <div className="glass-vault rounded-[2rem] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Contextual Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2 text-center">
              {language === "es" ? "Bienvenido de nuevo" : "Welcome Back"}
            </h2>
            <p className="text-secondary text-sm opacity-70 text-center">
              {language === "es" 
                ? "Accede a tu bóveda de activos digitales y tarjetas de regalo." 
                : "Access your digital assets vault and gift cards."}
            </p>
          </div>

          {/* SSO Integration */}
          <button 
            type="button"
            onClick={signInWithGoogle}
            className="w-full bg-surface-container-highest hover:bg-surface-bright transition-all duration-300 rounded-xl py-4 px-6 flex items-center justify-center gap-3 group mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span className="text-on-surface font-semibold text-sm tracking-wide">
              {language === "es" ? "Continuar con Google" : "Continue with Google"}
            </span>
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-[1px] flex-1 bg-secondary/10"></div>
            <span className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest">
              {language === "es" ? "O INICIA SESIÓN CON EMAIL" : "OR LOGIN WITH EMAIL"}
            </span>
            <div className="h-[1px] flex-1 bg-secondary/10"></div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                  <p className="text-red-500 text-xs font-bold uppercase tracking-wider text-left flex-1">
                    {error}
                  </p>
                  <button onClick={() => setError(null)} className="text-red-500/40 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credentials Form */}
          <div className="relative z-[100]">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                  {language === "es" ? "CORREO ELECTRÓNICO" : "EMAIL ADDRESS"}
                </label>
                <div className="relative group input-glow rounded-xl overflow-hidden transition-all text-left">
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

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">
                    {language === "es" ? "CONTRASEÑA" : "PASSWORD"}
                  </label>
                  <Link 
                    className="text-[10px] font-bold text-primary-container hover:text-primary transition-colors uppercase tracking-[0.1em] relative z-[110]" 
                    href="/forgot-password"
                  >
                    {language === "es" ? "¿OLVIDASTE?" : "FORGOT?"}
                  </Link>
                </div>
                <div className="relative group input-glow rounded-xl overflow-hidden transition-all text-left">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-secondary/40 text-lg">lock</span>
                  </div>
                  <input 
                    className="w-full bg-surface-container-low/50 border-none py-4 pl-12 pr-12 text-on-surface placeholder:text-secondary/30 focus:ring-0 text-sm outline-none" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary transition-colors z-[110]"
                  >
                    <span className="material-symbols-outlined text-secondary/40 text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button 
                className="w-full bg-gradient-to-b from-[#f2b92f] to-[#d49e1a] hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-[#402d00] font-headline font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(242,185,47,0.2)] mt-4 disabled:opacity-50 flex items-center justify-center gap-2 relative z-[110]" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin" />
                ) : (
                  language === "es" ? "Iniciar Sesión" : "Login Now"
                )}
              </button>
            </form>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-secondary/60">
              {language === "es" ? "¿No tienes una cuenta?" : "Don't have an account?"}
              <Link 
                className="relative z-[100] cursor-pointer text-[#f2b92f] font-bold hover:brightness-110 transition-colors ml-1 underline decoration-[#f2b92f]/30 underline-offset-4" 
                href="/register"
              >
                {language === "es" ? "Crear cuenta" : "Create account"}
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
        <div className="mt-8 flex justify-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <button 
            onClick={() => setIsTermsOpen(true)}
            className="text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-all cursor-pointer"
          >
            {language === "es" ? "Términos y condiciones" : "Terms & Conditions"}
          </button>
        </div>
      </main>

      <UserTermsBottomSheet 
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />
    </div>
  );
}
