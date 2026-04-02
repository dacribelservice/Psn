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
  signUp: (email: string, password?: string) => Promise<any>;
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      const currentId = session?.user?.id;
      
      console.log(`AuthContext: [EVENT] ${event}`, { userId: currentId });

      if (session) {
        // ANTI-BLOQUEO: Si ya se está cargando, evitamos duplicidad
        if (fetchingUserId.current === currentId) {
           setLoading(false);
           return;
        }

        // Si ya tenemos el usuario y no ha cambiado el ID, no re-cargamos
        if (lastFetchedUserId.current === currentId && user) {
           setLoading(false);
           return;
        }

        lastFetchedUserId.current = currentId || null;
        
        // --- POBLAR DESDE SESIÓN INMEDIATAMENTE ---
        const meta = session.user.user_metadata;
        const masterEmails = ["cangel@gmail.com", "cangelgames@gmail.com", "cangel@dacribel.com", "dacribel.service@gmail.com"];
        const isMaster = session.user.email && masterEmails.includes(session.user.email.toLowerCase().trim());

        setUser({
          id: session.user.id,
          email: session.user.email || '',
          role: isMaster ? 'admin' : (meta?.role || 'user'),
          full_name: meta?.full_name || meta?.name || (isMaster ? 'Admin' : 'Usuario'),
          avatar_url: meta?.avatar_url || meta?.picture
        } as UserProfile);

        // --- LIBERAR PANTALLA YA ---
        setLoading(false);

        // Intentar actualizar desde DB en segundo plano (sin bloquear)
        fetchProfile(session.user.id, session.user.email || '');
      } else {
        lastFetchedUserId.current = null;
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  const fetchProfile = async (userId: string, authEmail: string) => {
    if (fetchingUserId.current === userId) return;
    fetchingUserId.current = userId;

    try {
      const { data } = await Promise.race([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
      ]) as any;

      if (data) {
        const masterEmails = ["cangel@gmail.com", "cangelgames@gmail.com", "cangel@dacribel.com", "dacribel.service@gmail.com"];
        const isMaster = authEmail && masterEmails.includes(authEmail.toLowerCase().trim());
        
        setUser(prev => ({
          ...prev,
          ...data,
          role: isMaster ? 'admin' : data.role
        }));
      }
    } catch (err) {
      // Ignoramos silenciosamente, ya tenemos la sesión básica cargada
    } finally {
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
        const { data, error } = await supabase.auth.signUp({ email, password: pass || '123456Ab*' });
        if (error) { setLoading(false); throw error; }
        return data; // Retornamos la respuesta completa para detectar si requiere confirmación
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
