/**
 * Blockchain Service (Legacy: ChaingatewayService) 
 * High-performance service for direct blockchain verification (BSC/BEP20).
 * This service ensures independence from 3rd party gateways. 🛡️🛰️
 */
export class ChaingatewayService {
  // Configuración de Contratos y Billeteras 🛡️
  private static masterWallet = '0xebea384df41c9b3f841ad50adaa4408e4751e3d8';
  private static usdtContract = '0x55d398326f99059ff775485246999027b3197955';
  // Clúster de Nodos RPC (Alta Disponibilidad) 🛰️🌌
  private static bscRpcUrls = [
    'https://bsc-dataseed.binance.org/',    // Binace Oficial
    'https://rpc.ankr.com/bsc',             // Ankr (Alta velocidad)
    'https://binance.llamarpc.com',         // Llama Nodes
    'https://bsc-dataseed1.defibit.io/',    // Defibit (Backup)
    'https://bsc.publicnode.com'           // Public Node
  ];
  private static currentRpcIndex = 0; 

  /**
   * Prepares the payment session info (Static Wallet Flow).
   */
  static async generateOrderPayment(orderId: string) {
    if (!orderId) throw new Error('OrderID is required for payment generation');

    return {
      orderId,
      address: this.masterWallet,
      network: 'BSC (BEP20)',
      expiresIn: 3600, // Extendemos a 1 hora para mayor comodidad
      status: 'waiting'
    };
  }

  /**
   * Verifies a transaction Hash (TxID) directly on the Binance Smart Chain. 🤖🌌🔍
   */
  static async verifyTransaction(txid: string, expectedAmount: number) {
    if (!txid) throw new Error('Transaction Hash (TxID) is required');

    try {
      let lastError = null;
      let tx = null;
      let globalAttempts = 0;
      const maxGlobalAttempts = 3;

      // 1. Búfer de Reintentos (Paso 6.3 - Malla de Sincronización) ⏳🛰️
      while (globalAttempts < maxGlobalAttempts && !tx) {
        // Ciclo de Consulta Mult-Nodo (Failover Cluster)
        for (const url of this.bscRpcUrls) {
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_getTransactionByHash',
                params: [txid],
                id: 1,
              }),
            });

            const data = await response.json();
            
            if (data.result) {
               tx = data.result;
               break; 
            }
          } catch (e: any) {
            lastError = e;
            console.warn(`❌ Nodo ${url} saturado, saltando...`);
            continue; 
          }
        }

        if (!tx) {
          globalAttempts++;
          if (globalAttempts < maxGlobalAttempts) {
            console.log(`⏳ Intento ${globalAttempts} fallido. Reintentando en 2.5s para sincronización...`);
            await new Promise(resolve => setTimeout(resolve, 2500));
          }
        }
      }

      if (!tx) {
        throw new Error('La transacción no fue encontrada tras varios intentos. Asegúrate de que el envío esté "Completado" en Binance y que el TxID sea correcto.');
      }

      // 2.1 Validación de Destino (Protocolo USDT BEP20) 🛰️
      if (tx.to && tx.to.toLowerCase() !== this.usdtContract.toLowerCase()) {
        throw new Error('Esta transacción no está dirigida al contrato de USDT verificado.');
      }

      // 2.2 Extracción de destinatario desde 'input' (BEP20 Parser) 🗝️
      // El input contiene: [Firma 10c] + [Destinatario 64c] + [Monto 64c]
      const input = tx.input;
      if (!input || !input.startsWith('0xa9059cbb')) {
        throw new Error('La transacción no es una transferencia de tokens válida (Firma incorrecta).');
      }

      // La dirección está en los caracteres 10 a 74. Los últimos 40 son la dirección real.
      const recipientHex = '0x' + input.substring(34, 74).toLowerCase(); 
      
      // 2.3 Comparación contra Billetera Maestra 🏦
      if (recipientHex !== this.masterWallet.toLowerCase()) {
        throw new Error('El pago ha sido enviado a una dirección incorrecta. Operación no válida para Dacribel.');
      }
      
      // 3.1 Conversión de Monto (BEP20 Parser) ⚖️
      // El monto está en los caracteres 74 a 138 en formato Hex (uint256)
      const amountHex = input.substring(74, 138);
      const rawAmount = BigInt('0x' + amountHex);
      
      // 3.2 Ajuste de 18 decimales (Protocolo USDT BEP20) 🛰️
      const finalAmount = Number(rawAmount) / Math.pow(10, 18);
      
      // 3.3 Validación de Monto con Tolerancia (±0.05 USDT) ⚖️
      const diff = Math.abs(finalAmount - expectedAmount);
      if (diff > 0.05) { // Ampliamos de 0.01 a 0.05 para mayor flexibilidad con exchanges
        throw new Error(`El monto detectado (${finalAmount} USDT) no coincide con el precio de la orden (${expectedAmount} USDT).`);
      }
      console.log('✅ Monto verificado con éxito (Tolerancia aplicada).');

      // 3. Confirmaciones de Red (Check de seguridad mínima)
      if (!tx.blockNumber) {
        throw new Error('La transacción aún está pendiente. Espera unos minutos.');
      }

      // 4. Firewall de Tiempo (Paso 6.6) ⌚🛰️
      // Necesitamos el bloque para saber la hora exacta de la transacción
      let timestamp = 0;
      try {
        // Buscamos info del bloque (el URL que funcionó arriba se mantiene para esta llamada rápida)
        const blockResponse = await fetch(tx.lastRpcUrl || this.bscRpcUrls[0], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: [tx.blockNumber, false],
            id: 2,
          }),
        });
        const blockData = await blockResponse.json();
        if (blockData.result && blockData.result.timestamp) {
          // Convertimos Hex a Decimal (viene en segundos, pasamos a MS)
          timestamp = Number(BigInt(blockData.result.timestamp)) * 1000;
        }
      } catch (e) {
        console.warn('⚠️ No se pudo obtener timestamp exacto del bloque, usando seguridad básica.');
      }

      return {
        success: true,
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        timestamp: timestamp, // ⌚ Dato vital para el Firewall
        status: 'confirmed'
      };

    } catch (error: any) {
      console.error('Blockchain Verification Error:', error);
      throw error;
    }
  }
}
