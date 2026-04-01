"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type UserRole = "admin" | "user" | null;

interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  avatar_url?: string;
  balance?: number;
  vip_level?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password?: string) => Promise<void>;
  signUp: (email: string, password?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
  deleteAccount: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchingUserId = React.useRef<string | null>(null);
  const router = useRouter();
  const lastFetchedUserId = React.useRef<string | null>(null);
  const failedFetches = React.useRef<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      
      if (session) {
        if (failedFetches.current.has(session.user.id)) return;
        lastFetchedUserId.current = session.user.id;
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      const currentId = session?.user?.id;
      
      console.log(`AuthContext: [EVENT] ${event}`, { userId: currentId });

      if (session) {
        // ANTI-BLOQUEO: Si ya intentamos cargar este ID y falló, o si ya se está cargando, ignoramos el evento
        if (failedFetches.current.has(session.user.id) || fetchingUserId.current === session.user.id) {
           console.log("🛡️ AuthContext: Evitando reintento de perfil fallido o en curso.");
           setLoading(false);
           return;
        }

        if (lastFetchedUserId.current === session.user.id && user) {
           return;
        }
        
        lastFetchedUserId.current = session.user.id;
        await fetchProfile(session.user.id, session.user.email);
      } else {
        lastFetchedUserId.current = null;
        failedFetches.current.clear();
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, authEmail?: string, attempts = 0) => {
    if (fetchingUserId.current === userId && attempts === 0) return;
    fetchingUserId.current = userId;
    
    // MASTER OVERRIDE: Si es el correo del dueño, le damos el rol admin desde YA para evitar bloqueos
    const masterEmails = ["cangel@gmail.com", "cangelgames@gmail.com", "cangel@dacribel.com", "dacribel.service@gmail.com"];
    const currentEmail = authEmail?.toLowerCase().trim();
    const isMasterAdmin = currentEmail && masterEmails.includes(currentEmail);

    if (isMasterAdmin && attempts === 0) {
      console.log("🚀 MASTER OVERRIDE: Acceso instantáneo por correo maestro.");
      setUser({ id: userId, email: currentEmail!, role: 'admin', full_name: 'Administrador Boss' } as UserProfile);
      setLoading(false);
      // Continuamos el fetch en segundo plano para actualizar datos si es posible
    }

    try {
      console.log(`AuthContext: [DEBUG] Profile query starting for ${userId} (Tentativa ${attempts})`);
      
      // Consultamos a la base de datos (con timeout de 8s)
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase request timeout')), 8000))
      ]) as any;

      if (data) {
        console.log(`AuthContext: fetchProfile SUCCESS for ${userId}`, data);
        
        const profileData = {
          ...data,
          email: authEmail || data.email,
          role: isMasterAdmin ? "admin" : data.role
        };
        
        setUser(profileData as UserProfile);
        setLoading(false);
      } else {
        throw error || new Error("No profile data");
      }
    } catch (err: any) {
      console.warn(`AuthContext: [DEBUG] Carga fallida (Intento ${attempts}):`, err.message || err);
      
      if (attempts < 2) {
        const backoff = 500 * (attempts + 1);
        await new Promise(res => setTimeout(res, backoff));
        return fetchProfile(userId, authEmail, attempts + 1);
      } else {
        console.error("FAIL SAFE: Agotados los intentos de perfil. Liberando pantalla.");
        // MARCAMOS COMO FALLIDO
        failedFetches.current.add(userId);
        
        // Si falló todo pero es master admin, ya lo seteamos arriba
        if (!isMasterAdmin) {
          setUser({ id: userId, email: authEmail || '', role: 'user' } as UserProfile);
        }
        setLoading(false);
      }
    }
 finally {
      fetchingUserId.current = null;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      lastFetchedUserId.current = null;
      router.push("/");
    } catch (err) {
      console.error("SignOut Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      role: user ? user.role : (loading ? null : 'user'), 
      loading, 
      signIn: async (email, pass) => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass || '123456Ab*' });
        if (error) { setLoading(false); throw error; }
      },
      signUp: async (email, pass) => {
        setLoading(true);
        const { error } = await supabase.auth.signUp({ email, password: pass || '123456Ab*' });
        if (error) { setLoading(false); throw error; }
      },
      signInWithGoogle, 
      signOut, 
      deleteAccount: async () => {
        setLoading(true);
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          await supabase.from('profiles').delete().eq('id', currentUser.id);
          await signOut();
        }
        setLoading(false);
      },
      resetPassword: async (email: string) => {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        });
        setLoading(false);
        if (error) throw error;
      },
      updatePassword: async (newPassword: string) => {
        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setLoading(false);
        if (error) throw error;
        router.push("/login?message=Clave actualizada correctamente");
      }
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
