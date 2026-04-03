"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserTermsBottomSheet } from "@/components/ui/UserTermsBottomSheet";

export default function RegisterPage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { user, signUp, signInWithGoogle, loading, role } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Redirect if already logged in and verified
  React.useEffect(() => {
    if (user && !loading) {
      router.push(role === 'admin' ? "/admin" : "/");
    }
  }, [user, loading, router, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError(language === "es" ? "La contraseña debe tener al menos 6 caracteres." : "Password should be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError(language === "es" ? "Las contraseñas no coinciden." : "Passwords do not match.");
      return;
    }

    const translateError = (msg: string) => {
      if (msg.includes("Confirmation email")) return language === "es" ? "Error al enviar el correo de confirmación" : "Error sending confirmation email";
      if (msg.includes("Signup error")) return language === "es" ? "Error al registrarse. Prueba de nuevo." : "Sign up error. Please try again.";
      return msg;
    };

    try {
      const data = await signUp(email, password);
      
      // Si Supabase devuelve un usuario pero no hay sesión (session: null),
      // significa que requiere confirmación por correo.
      if (data?.user && !data?.session) {
        setIsEmailSent(true);
      }
    } catch (error: any) {
      setError(translateError(error.message || (language === "es" ? "Error al registrarse. Prueba de nuevo." : "Sign up error. Please try again.")));
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;
    
    setIsResending(true);
    setResendSuccess(false);
    try {
      const { resendVerification } = useAuth() as any;
      await resendVerification(email);
      setResendSuccess(true);
      setResendCooldown(60);
      
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (error: any) {
      const msg = error.message || "";
      let translated = language === "es" ? "Error al reenviar. Espera un momento." : "Resend error. Wait a moment.";
      if (msg.includes("Confirmation email")) {
        translated = language === "es" ? "Error al enviar el correo de confirmación" : "Error sending confirmation email";
      }
      setError(translated);
    } finally {
      setIsResending(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="bg-surface-dim text-on-surface min-h-screen flex items-center justify-center p-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md glass-vault rounded-[2.5rem] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-primary/20 relative overflow-hidden"
        >
          <div className="flex flex-col items-center">
            {/* Animated Verification Icon */}
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8 relative">
              <span className="material-symbols-outlined text-primary text-5xl animate-pulse">mark_email_unread</span>
              <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-ping"></div>
            </div>

            <h2 className="text-3xl font-headline font-black text-white mb-4 tracking-tight">
              {language === "es" ? "¡Revisa tu búnker!" : "Check your bunker!"}
            </h2>
            <p className="text-secondary/70 text-sm leading-relaxed mb-8 max-w-[280px]">
              {language === "es" 
                ? `Hemos enviado un enlace de acceso seguro a ${email}. Por favor, confírmalo para activar tu cuenta.` 
                : `We've sent a secure access link to ${email}. Please confirm it to activate your account.`}
            </p>

            <div className="space-y-4 w-full">
              <a 
                href={`mailto:${email}`}
                className="w-full bg-primary text-black font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-xl"
              >
                <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                {language === "es" ? "IR A MI CORREO" : "GO TO MY EMAIL"}
              </a>
              
              <Link 
                href="/login"
                className="w-full bg-white/5 text-white/40 font-bold py-4 rounded-xl flex items-center justify-center border border-white/5 hover:bg-white/10 transition-all text-xs tracking-widest"
              >
                {language === "es" ? "REGRESAR AL INICIO" : "BACK TO LOGIN"}
              </Link>
            </div>
            
            <div className="mt-8 space-y-4">
              <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                {language === "es" ? "¿No lo recibiste? Revisa tu carpeta de SPAM." : "Didn't receive it? Check your SPAM folder."}
              </p>
              
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || isResending}
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mx-auto ${
                  resendCooldown > 0 || isResending 
                    ? "text-white/10 cursor-not-allowed" 
                    : "text-primary hover:text-primary/110 cursor-pointer"
                }`}
              >
                {isResending ? (
                  <div className="w-3 h-3 border border-primary/30 border-t-primary rounded-full animate-spin" />
                ) : resendSuccess ? (
                  <span className="flex items-center gap-1 text-green-500">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    {language === "es" ? "ENVIADO DE NUEVO" : "SENT AGAIN"}
                  </span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">refresh</span>
                    {language === "es" 
                      ? resendCooldown > 0 ? `REENVIAR EN ${resendCooldown}S` : "REENVIAR ENLACE" 
                      : resendCooldown > 0 ? `RESEND IN ${resendCooldown}S` : "RESEND LINK"}
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/5 blur-[80px] rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-surface-dim text-on-surface min-h-screen flex items-center justify-center p-4 text-center">
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
            <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
              {language === "es" ? "Crear cuenta" : "Create account"}
            </h2>
            <p className="text-secondary text-sm opacity-70">
              {language === "es" ? "Gracias por preferirnos" : "Thanks for choosing us"}
            </p>
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
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider text-left flex-1 leading-relaxed">
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

            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                {language === "es" ? "CONTRASEÑA" : "PASSWORD"}
              </label>
              <div className="relative group input-glow rounded-xl overflow-hidden transition-all">
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
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-secondary/40 text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-[10px] font-bold text-secondary uppercase tracking-[0.2em] ml-1">
                {language === "es" ? "CONFIRMAR CONTRASEÑA" : "CONFIRM PASSWORD"}
              </label>
              <div className="relative group input-glow rounded-xl overflow-hidden transition-all">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-secondary/40 text-lg">lock</span>
                </div>
                <input 
                  className="w-full bg-surface-container-low/50 border-none py-4 pl-12 pr-12 text-on-surface placeholder:text-secondary/30 focus:ring-0 text-sm outline-none" 
                  placeholder="••••••••" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-secondary/40 text-lg">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button 
              className="w-full bg-gradient-to-b from-[#f2b92f] to-[#d49e1a] hover:brightness-110 active:scale-[0.98] transition-all duration-200 text-[#402d00] font-headline font-extrabold py-4 rounded-xl shadow-[0_8px_20px_rgba(242,185,47,0.2)] mt-4 disabled:opacity-50 flex items-center justify-center gap-2" 
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#402d00]/30 border-t-[#402d00] rounded-full animate-spin" />
              ) : (
                language === "es" ? "Crear Cuenta" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-secondary/60">
              {language === "es" ? "¿Ya tienes cuenta?" : "Already have an account?"}
              <Link 
                className="relative z-[100] cursor-pointer text-[#f2b92f] font-bold hover:brightness-110 transition-colors ml-1 underline decoration-[#f2b92f]/30 underline-offset-4" 
                href="/login"
              >
                {language === "es" ? "Iniciar sesión" : "Login"}
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
                <img alt="USA" className="rounded-sm opacity-80" src="https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/app-assets/flags/usa_1775110111294.png" width="20" />
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
                <img alt="Spain" className="rounded-sm opacity-80" src="https://ryzjswxucuwwzqhdtjmo.supabase.co/storage/v1/object/public/app-assets/flags/espana_1775110789759.png" width="20" />
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
