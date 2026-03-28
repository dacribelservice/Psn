"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

function ProcessingPaymentLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Conectando con la pasarela de pago...");

  const method = searchParams.get("method");
  const amount = searchParams.get("amount");
  const productId = searchParams.get("productId");

  useEffect(() => {
    const processTransaction = async () => {
      try {
        if (!method || !amount || !productId) {
          throw new Error("Datos de pago incompletos");
        }

        setMessage("Verificando transacción...");
        
        // Simulate network delay for premium feel
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // 1. Get Current User
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error("Debes iniciar sesión para comprar");

        setMessage("Asignando código y finalizando orden...");

        // 2. Ejecutar RPC transaccional seguro
        const { data: orderId, error: rpcError } = await supabase.rpc('process_checkout', {
          p_product_id: productId,
          p_amount: parseFloat(amount),
          p_method: method
        });

        if (rpcError) throw rpcError;

        setStatus("success");
        setMessage("¡Pago completado con éxito!");

        // Redirect to history after success
        setTimeout(() => {
          router.push("/history");
        }, 2000);

      } catch (err: any) {
        console.error("Payment error:", err);
        setStatus("error");
        setMessage(err.message || "Ocurrió un error al procesar el pago");
      }
    };

    processTransaction();
  }, [method, amount, productId, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-on-surface">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#191b23] p-8 md:p-12 rounded-[2rem] shadow-2xl border border-white/5 flex flex-col items-center text-center relative overflow-hidden"
      >
        {status === "processing" && (
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            <span className="absolute inset-0 flex items-center justify-center material-symbols-outlined text-3xl text-primary animate-pulse">
              payments
            </span>
          </div>
        )}

        {status === "success" && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
          >
            <span className="material-symbols-outlined text-5xl text-green-500">
              check_circle
            </span>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
            className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-8 border border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
          >
            <span className="material-symbols-outlined text-5xl text-red-500">
              error
            </span>
          </motion.div>
        )}

        <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">
          {status === "processing" ? "Procesando" : status === "success" ? "Completado" : "Error"}
        </h2>
        <p className="text-[#c3c4e2] text-sm md:text-base font-medium opacity-80 mb-6">
          {message}
        </p>

        {status === "error" && (
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full font-bold transition-colors uppercase text-sm tracking-widest"
          >
            Volver a la tienda
          </button>
        )}

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          {status === "processing" && (
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "linear" }}
              className="h-full bg-primary"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentProcessingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary">
          Cargando pasarela...
      </div>
    }>
      <ProcessingPaymentLogic />
    </Suspense>
  );
}
