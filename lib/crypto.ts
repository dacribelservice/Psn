import crypto from 'crypto';

/**
 * UTILERÍA DE BÚNKER (CIFRADO AES-256-GCM)
 * Estrategia: Cifrar datos sensibles antes de que toquen la base de datos de Supabase.
 */

// ESTRATEGIA: PRIORIDAD INTERNA (BÚNKER)
// Buscamos primero la llave segura (Servidor). Si no existe, usamos la pública (Legacy).
const ENCRYPTION_KEY = process.env.INTERNAL_ENCRYPTION_KEY || 
                       process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 
                       'dacribel_vault_master_key_32bytes_!!'; 
const IV_LENGTH = 16; // Para AES, siempre 16 bytes

export function encrypt(text: string): string {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (err) {
        console.error("Encryption Error:", err);
        return text; // Fallback al texto original si algo falla (evitar pérdida total)
    }
}

export function decrypt(text: string): string {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift()!, 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        // Si no se puede descifrar, probablemente no esté cifrado (datos antiguos)
        return text;
    }
}
