"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { TutorialSlider } from "@/components/ui/TutorialSlider";
import { useLanguage } from "@/context/LanguageContext";

function CheckoutProcessingContent() {
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [tutorialBanners, setTutorialBanners] = useState<any[]>([]);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [copied, setCopied] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState(""); // 🗝️ Campo para el TxID

  useEffect(() => {
    if (!orderId) return;

       async function loadOrderAndPayment() {
          // 1. Cargar Orden (Solo para obtener monto y detalles)
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*, products(name, region)')
            .eq('id', orderId)
            .single();
          
          if (orderError || !order) {
            console.error("❌ Error cargando orden:", orderError);
            setErrorMessage("No pudimos encontrar los detalles de tu orden.");
            return;
          }
          
          setOrderDetails(order);

          // 2. Cargar Banners del Tutorial 📸
          const { data: bans, error: banError } = await supabase
            .from('banners')
            .select('*')
            .eq('type', 'tutorial')
            .eq('is_active', true)
            .order('display_order', { ascending: true });
          
          if (!banError) setTutorialBanners(bans || []);

          // Modo Billetera Maestra: No necesitamos crear transacciones al cargar la página. 🛡️🛰️
          console.log("🦾 Búnker: Modo Billetera Maestra Activo - Interfaz Blindada.");
       }
    loadOrderAndPayment();
  }, [orderId]);

  // SUSCRIPCIÓN EN TIEMPO REAL (Fase 5.3)
  useEffect(() => {
    if (!orderId) return;

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload: any) => {
          const newStatus = payload.new.status;
          console.log(`🔔 Cambio de estado detectado: ${newStatus}`);
          if (newStatus === 'completed') {
            setValidationStatus("success");
            setIsValidating(true);
          } else if (newStatus === 'cancelled') {
            setValidationStatus("error");
            setErrorMessage("La orden ha sido cancelada.");
            setIsValidating(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  const amount = orderDetails?.amount || "0.00";
  const method = orderDetails?.payment_method?.toUpperCase() || "CARGANDO...";
  const networkName = "BSC (BEP20)"; // 🛰️ Red Invariable
  const walletAddress = "0xeBea384dF41C9B3f841AD50ADaa4408E4751e3d8"; // 🏦 Billetera Maestra (Case Corrected)
  const qrCodeUrl = "/images/qr-maestro.png"; // 🛡️ Usamos la imagen local cargada por el dueño
  const videoUrl = tutorialBanners.find(b => b.video_url)?.video_url || "https://youtube.com";

  // Hook del Reloj con Auto-Cancelación Estricta
  useEffect(() => {
    if (timeLeft <= 0) {
       if (orderDetails?.status === 'pending' && validationStatus !== 'success') {
          console.log("⏰ Tiempo agotado - Cancelando orden...");
          supabase.rpc('cancel_order', { p_order_id: orderId });
          setValidationStatus("error");
          setErrorMessage("¡Tiempo agotado! La orden ha sido cancelada.");
       }
       return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, orderId, orderDetails?.status, validationStatus]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#11131b] text-[#e1e1ed] font-sans pb-32 overflow-x-hidden">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#11131b]/80 backdrop-blur-[12px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] border-b border-white/5">
        <div className="flex items-center justify-between px-6 py-4 max-w-lg mx-auto w-full">
          <button 
            onClick={() => router.back()}
            className="text-[#f7be34] active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-semibold text-lg tracking-tight text-[#f7be34]">Pago en Proceso</h1>
          <button className="text-[#f7be34] active:scale-95 transition-transform">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Payment Details */}
          <div className="lg:col-span-7 w-full max-w-lg mx-auto lg:mx-0">

        {/* Main Payment Card (Glassmorphism) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card rounded-[2.5rem] p-8 mb-8 relative overflow-hidden ring-1 ring-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
        >
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-container/10 blur-[80px] rounded-full"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Método de Pago Badge - RESALTADO BEP20 🛰️ */}
            {/* Network Info Box Styled from Reference */}
            <div className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] p-6 mb-10 shadow-2xl relative overflow-hidden group hover:border-primary/30 transition-colors">
              <div className="flex items-baseline gap-2 mb-5 pb-4 border-b border-white/5">
                <span className="text-white font-black text-xl tracking-tighter">BSC</span>
                <span className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-none">BNB Smart Chain (BEP20)</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">Comisión</span>
                  <span className="text-[#f7be34] text-[11px] font-black">0.01 USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">Retiro mínimo</span>
                  <span className="text-white/80 text-[11px] font-black">10.00 USDT</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/40 text-[9px] font-black uppercase tracking-wider">Tiempo de llegada</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-white/80 text-[11px] font-black">≈ 1 minutos</span>
                  </div>
                </div>
              </div>

              {/* Red Warning integrated subtly */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <p className="text-[9px] text-red-500/80 font-black text-center uppercase leading-tight tracking-tighter">
                  SOLO RED BEP20. <br/>OTRAS REDES PERDERÁN TU DINERO.
                </p>
              </div>
            </div>

            {/* Total a transferir Area */}
            <div className="text-center mb-8 flex flex-col items-center">
              <span className="text-white text-base font-black uppercase tracking-[0.3em] block mb-4 opacity-90">Total a transferir</span>
              
              <div className="flex flex-col items-center">
                 <h2 className="text-5xl md:text-6xl font-black text-[#f2b92f] tracking-tighter drop-shadow-[0_10px_30px_rgba(242,185,47,0.3)]">
                    {parseFloat(amount).toFixed(2)} <span className="text-xl font-black opacity-40 ml-0.5">USDT</span>
                 </h2>
                 <span className="text-[11px] font-bold text-white/30 tracking-widest mt-2 block italic uppercase">Subtotal base: {(parseFloat(amount) - 0.01).toFixed(2)} USDT</span>
                 <div className="bg-blue-500/10 px-4 py-1.5 rounded-full mt-4 border border-blue-500/20 shadow-inner">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">+ 0.01 Comisión BEP20 integrada</span>
                 </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/60 border border-white/5 mb-8 shadow-inner">
              <span className="material-symbols-outlined text-[#f7be34] text-xl">schedule</span>
              <span className="text-[#f7be34] font-mono font-black text-2xl tracking-widest">{formatTime(timeLeft)}</span>
            </div>

            {/* QR Code Container */}
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(247,190,52,0.2)] mb-4 transform hover:scale-[1.02] transition-transform duration-500">
                {qrCodeUrl ? (
                  <img 
                    alt="Payment QR Code" 
                    className="w-44 h-44" 
                    src={qrCodeUrl} 
                  />
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center text-black font-bold text-[10px] text-center p-4">
                    Generando código QR...
                  </div>
                )}
              </div>
              
              {/* Resumen dinámico bajo QR */}
              <div className="bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl p-4 w-full flex items-center justify-between mb-8 shadow-inner ring-1 ring-white/5">
                 <div className="flex flex-col items-center flex-1 border-r border-white/5">
                    <span className="text-[8px] font-black text-[#c3c4e2]/40 uppercase tracking-widest mb-1">Monto Base</span>
                    <span className="text-xs font-black text-[#c3c4e2]/60 italic">{(parseFloat(amount) - 0.01).toFixed(2)} USDT</span>
                 </div>
                 <div className="flex flex-col items-center flex-1">
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Enviar Exacto</span>
                    <span className="text-sm font-black text-primary tracking-tighter animate-pulse">{parseFloat(amount).toFixed(2)} USDT</span>
                 </div>
              </div>
            </div>

            {/* Wallet Address & TxID Input Area */}
            <div className="w-full space-y-6">
              {/* Dirección de Billetera */}
              <div>
                <label className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.15em] mb-2 block text-center opacity-70">Dirección de Depósito (BEP20)</label>
                <div className="flex items-center justify-between bg-black/40 rounded-2xl p-4 border border-white/5 shadow-xl">
                  <span className="font-mono text-[10px] text-on-surface truncate pr-4 opacity-90">{walletAddress}</span>
                  <button 
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 ${copied ? 'bg-green-500/20 text-green-400' : 'bg-[#f7be34] text-black'} font-black text-[10px] rounded-lg active:scale-95 transition-all uppercase tracking-widest`}
                  >
                    <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
                    {copied ? 'LIBRE' : 'COPIAR'}
                  </button>
                </div>
              </div>

              {/* Input de TxID - El Guardián de la Orden */}
              <div className="pt-2">
                <label className="text-[#f7be34] text-[10px] font-black uppercase tracking-[0.2em] mb-2 block text-center">Pega aquí tu TxID de Binance</label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ej: 0xa45c269f8c88ebac20b18d8234..."
                    value={transactionHash}
                    onChange={(e) => setTransactionHash(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-xs font-mono text-[#f7be34] focus:outline-none focus:border-[#f7be34]/50 transition-colors placeholder:opacity-30"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 text-lg">receipt_long</span>
                </div>
                <p className="text-[9px] text-on-surface-variant/50 mt-3 text-center italic">Lo encuentras en los "Detalles de Retiro" de tu APP de Binance.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

        {/* Right Column: Tutorial Slider (PC/Móvil) */}
          <div className="lg:col-span-5 flex flex-col items-center gap-8 py-4">
            <div className="text-center lg:text-left mb-2">
              <h3 className="text-xl font-headline font-black text-[#f7be34] uppercase tracking-tighter mb-2">Guía paso a paso</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-none">Mira cómo completar tu pago en segundos</p>
            </div>

            <TutorialSlider 
              banners={tutorialBanners}
              language={language}
            />

            {/* YouTube Link Button (Abre en nueva pestaña) */}
            <a 
               href={videoUrl}
               target="_blank"
               rel="noopener noreferrer"
               className="w-full max-w-[320px] py-4 bg-red-600/10 border border-red-600/30 text-red-500 font-black text-[11px] rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest hover:bg-red-600/20 shadow-xl"
            >
               <span className="material-symbols-outlined text-[18px]">play_circle</span>
               Ver tutorial en YouTube
            </a>
          </div>

        </div>
      </main>

      {/* Bottom Action Footer */}
      <div className="fixed bottom-0 left-0 w-full px-6 pb-10 pt-8 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="max-w-lg mx-auto pointer-events-auto">
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/')}
              className="flex-1 py-6 bg-red-600/10 border border-red-600/30 text-red-500 font-black text-[11px] rounded-[1.25rem] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
            >
              <span className="material-symbols-outlined text-[16px]">sync</span>
              Cancelar Orden
            </button>
            <button 
              disabled={!transactionHash}
              onClick={async () => {
                if (!orderId || !transactionHash) return;
                setIsValidating(true);
                setValidationStatus("loading");
                
                try {
                  const res = await fetch('/api/payments/verify', {
                    method: 'POST',
                    body: JSON.stringify({ orderId, txid: transactionHash }),
                    headers: { 'Content-Type': 'application/json' }
                  });
                  
                  const text = await res.text();
                  let result;
                  
                  try {
                    result = JSON.parse(text);
                  } catch (e) {
                    throw new Error("El servidor no pudo procesar la solicitud (Respuesta no válida). Por favor, intenta de nuevo en unos minutos.");
                  }
                  
                  if (!result.success) throw new Error(result.error);
                  
                  setValidationStatus("success");
                } catch (err: any) {
                  setValidationStatus("error");
                  setErrorMessage(err.message || "No pudimos confirmar tu TxID. Verifica que el envío esté 'Completado' en Binance.");
                }
              }}
              className={`flex-1 py-6 ${!transactionHash ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-[#f7be34] text-black'} border border-white/5 font-extrabold text-[11px] rounded-[1.25rem] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl`}
            >
              Confirmar Pago
              <span className="material-symbols-outlined text-[16px]">verified</span>
            </button>
          </div>
        </div>
      </div>

      {/* Validation Modal */}
      <AnimatePresence>
        {isValidating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-sm glass-modal p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col items-center text-center ring-1 ring-primary-container/20"
            >
              {/* Premium Loading Icon */}
              <div className="relative mb-10 flex items-center justify-center">
                <div className="relative flex items-center justify-center w-24 h-24">
                  {/* Outer Pulse Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#f2b92f]/20 animate-ping opacity-25"></div>
                  {/* Rotating Gradient Ring */}
                  <svg className="animate-spin h-20 w-20 text-[#f2b92f]" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                    <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                  </svg>
                  {/* Inner Core Icon */}
                  <div className="absolute flex items-center justify-center">
                    <span className={`material-symbols-outlined text-3xl font-bold ${
                      validationStatus === "success" ? "text-green-500" : 
                      validationStatus === "error" ? "text-red-500" : 
                      "text-[#f2b92f] animate-pulse"
                    }`}>
                      {validationStatus === "success" ? "check_circle" : 
                       validationStatus === "error" ? "error" : 
                       "hourglass_top"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content Area */}
              <div className="space-y-4">
                <h2 className="text-white font-extrabold text-2xl tracking-tight font-headline">
                  {validationStatus === "loading" && "Validando tu pago..."}
                  {validationStatus === "success" && "¡Pago verificado!"}
                  {validationStatus === "error" && "Error de validación"}
                </h2>
                
                <p className="text-[#c3c4e2] text-sm leading-relaxed max-w-[240px] mx-auto opacity-90">
                  {validationStatus === "loading" && "Procesando tu solicitud de forma segura. Esto solo tomará unos segundos."}
                  {validationStatus === "success" && "Tu orden ha sido procesada con éxito. Ya puedes ver tu código en el historial."}
                  {validationStatus === "error" && (errorMessage || "No pudimos confirmar tu pago. Por favor intenta de nuevo.")}
                </p>

                <div className="pt-6 space-y-3 w-full">
                  {validationStatus === "success" ? (
                    <button 
                      onClick={() => router.push('/history')}
                      className="w-full bg-[#f2b92f] text-black font-black py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(242,185,47,0.3)] uppercase tracking-widest text-[11px]"
                    >
                      Ir a mis pedidos
                    </button>
                  ) : validationStatus === "error" ? (
                    <div className="space-y-3">
                      <button 
                        onClick={() => {
                          setIsValidating(false);
                          setValidationStatus("idle");
                        }}
                        className="w-full bg-red-500 text-white font-black py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(239,68,68,0.3)] uppercase tracking-widest text-[11px]"
                      >
                        Intentar de nuevo
                      </button>
                      <button 
                        onClick={() => router.push('/history')}
                        className="w-full bg-[#f2b92f] text-black font-black py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(242,185,47,0.3)] uppercase tracking-widest text-[11px]"
                      >
                        Ir a mis pedidos
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => router.push('/history')}
                      className="w-full bg-[#f2b92f] text-black font-black py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-[0_4px_20px_rgba(242,185,47,0.3)] uppercase tracking-widest text-[11px]"
                    >
                      Ir a mis pedidos
                    </button>
                  )}
                </div>
              </div>

              {/* Subtle Progress Bar */}
              <div className="mt-10 w-full h-[2px] bg-white/5 overflow-hidden rounded-full">
                <div className="h-full bg-gradient-to-r from-transparent via-[#f2b92f] to-transparent w-full animate-pulse"></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .glass-card {
          background: rgba(48, 51, 74, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .glass-modal {
          background: rgba(48, 51, 74, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
}

export default function CheckoutProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#11131b] flex items-center justify-center text-[#f7be34]">
        Cargando portal de pago...
      </div>
    }>
      <CheckoutProcessingContent />
    </Suspense>
  );
}
