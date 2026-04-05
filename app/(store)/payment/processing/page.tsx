"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function CheckoutProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
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
    navigator.clipboard.writeText(walletAddress);
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

      <main className="pt-24 px-6 max-w-lg mx-auto">
        {/* Payment Info Section */}
        <section className="mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary-container/30 text-secondary mb-4 border border-secondary/10">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            <span className="text-[10px] font-black tracking-widest uppercase">Método de pago: [{method}]</span>
          </div>
          <p className="text-on-surface-variant text-sm leading-relaxed px-4 opacity-70">
            Por favor abre tu APP para escanear el código y pagar. El periodo de validez es de 10 minutos.
          </p>
        </section>

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
            {/* Amount */}
            <div className="text-center mb-6">
              <span className="text-on-surface-variant text-[10px] font-black uppercase tracking-[0.2em] block mb-2 opacity-60">Total a transferir</span>
              <h2 className="text-4xl font-black text-[#f2b92f] tracking-tighter">
                {amount} <span className="text-xl font-medium opacity-60 ml-1">USDT</span>
              </h2>
              <p className="text-[#c3c4e2]/60 text-[9px] mt-2 font-mono uppercase tracking-widest">Red: {networkName}</p>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-background/60 border border-white/5 mb-8 shadow-inner">
              <span className="material-symbols-outlined text-[#f7be34] text-xl">schedule</span>
              <span className="text-[#f7be34] font-mono font-black text-2xl tracking-widest">{formatTime(timeLeft)}</span>
            </div>

            {/* QR Code Container */}
            <div className="p-4 bg-white rounded-3xl shadow-[0_0_40px_rgba(247,190,52,0.2)] mb-8 transform hover:scale-[1.02] transition-transform duration-500">
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

        {/* Security Alert Footer */}
        <div className="bg-error-container/10 border border-error/20 rounded-[2rem] p-5 flex gap-4 items-start mb-12">
          <span className="material-symbols-outlined text-[#f2b92f] mt-0.5" >warning</span>
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <strong className="text-error font-black uppercase tracking-[0.05em]">Atención:</strong> El monto indicado <span className="text-[#f2b92f] font-bold">no incluye</span> las comisiones de red del exchange o billetera emisora. 
            </p>
            <p className="text-[10px] text-on-surface-variant/60 italic leading-snug">
              Debes asegurar que el receptor reciba el monto exacto para que la orden se complete automáticamente.
            </p>
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
                  
                  const result = await res.json();
                  
                  if (!result.success) throw new Error(result.error);
                  
                  setValidationStatus("success");
                } catch (err: any) {
                  setValidationStatus("error");
                  setErrorMessage(err.message || "No pudimos confirmar tu TxID. Verifica que el envío esté 'Completado' en Binance.");
                }
              }}
              className={`flex-1 py-6 ${!transactionHash ? 'opacity-50 grayscale cursor-not-allowed' : 'bg-[#f7be34]'} border border-white/5 text-black font-extrabold text-[11px] rounded-[1.25rem] active:scale-[0.98] transition-all flex items-center justify-center gap-2 uppercase tracking-widest shadow-xl`}
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
