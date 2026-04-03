"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminHeader } from "@/context/../components/layout/AdminHeader";
import { AdminBottomNav } from "@/components/layout/AdminBottomNav";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  // ESTRATEGIA DE FIREWALL: Validación de Pase Maestro Directa + Rol en DB
  const masterEmail = "dacribel.service@gmail.com";
  const isMaster = user?.email?.toLowerCase().trim() === masterEmail;
  const isAdmin = role === "admin" || isMaster;

  useEffect(() => {
    // Solo actuamos cuando la sesión de Auth ha terminado de cargar
    if (!loading && !isAdmin) {
      console.warn("ERP FIREWALL: Acceso No Autorizado. Redirigiendo a zona segura.");
      router.push("/");
    }
  }, [loading, isAdmin, router]);

  // PANTALLA PROTECTORA (Evita el "Flash de Contenido" de datos sensibles)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-primary/10 rounded-full animate-ping" />
          </div>
        </motion.div>
        <p className="mt-8 text-white/40 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          Sincronizando Bóveda Administrativa...
        </p>
      </div>
    );
  }

  // BLOQUEO ATÓMICO (Si no eres admin, no renderizamos nada del panel)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0b10] flex flex-col items-center justify-center p-4 text-center">
        <span className="material-symbols-outlined text-red-500 text-6xl mb-6">gpp_maybe</span>
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter">Acceso Denegado</h1>
        <p className="text-white/40 text-sm max-w-xs mb-8 font-bold">
          Tu identidad no coincide con el registro administrativo maestro.
        </p>
        <button 
          onClick={() => window.location.href = "/"}
          className="bg-primary/20 hover:bg-primary/30 text-primary px-8 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all border border-primary/30"
        >
          Volver a Seguridad
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0b10] text-on-surface">
      <AdminSidebar />
      {/* ¡BARRA SUPERIOR ACTIVADA! */}
      <AdminHeader />
      
      <main className="lg:ml-64 min-h-screen pt-16 pb-24 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <AdminBottomNav />
    </div>
  );
}
