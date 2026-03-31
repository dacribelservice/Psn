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

  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;
      
      if (session) {
        lastFetchedUserId.current = session.user.id;
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthContext: Auth Event: ${event}`, { userId: session?.user?.id });
      if (!isMounted) return;

      if (session) {
        if (lastFetchedUserId.current === session.user.id && user) {
           return;
        }
        lastFetchedUserId.current = session.user.id;
        await fetchProfile(session.user.id, session.user.email);
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
  }, []);

  const fetchProfile = async (userId: string, authEmail?: string, attempts = 0) => {
    if (fetchingUserId.current === userId && attempts === 0) return;
    fetchingUserId.current = userId;
    
    // MASTER OVERRIDE: Si es el correo del dueño, le damos el rol admin desde YA
    const masterEmails = ["cangel@gmail.com", "cangelgames@gmail.com", "cangel@dacribel.com"];
    const currentEmail = authEmail?.toLowerCase().trim();
    const isMasterAdmin = currentEmail && masterEmails.includes(currentEmail);

    try {
      console.log(`AuthContext: [DEBUG] Profile query starting for ${userId} (Tentativa ${attempts})`);
      
      // Consultamos a la base de datos (con timeout de 15s)
      const { data, error } = await Promise.race([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Supabase request timeout')), 15000))
      ]) as any;

      if (data) {
        console.log(`AuthContext: fetchProfile SUCCESS for ${userId}`, data);
        
        // Unimos los datos de la DB con el correo maestro si coincide
        const profileData = {
          ...data,
          email: authEmail || data.email,
          role: isMasterAdmin ? "admin" : data.role
        };
        
        setUser(profileData as UserProfile);
        setLoading(false);
      } else if (error) {
        throw error;
      }
    } catch (err: any) {
      console.warn(`AuthContext: [DEBUG] Carga fallida:`, err.message || err);
      
      // Si somos Master Admin, salvamos el perfil aunque falle la DB
      if (isMasterAdmin) {
        console.warn("MASTER OVERRIDE: Base de datos lenta, forzando rol Admin por correo.");
        setUser({ id: userId, email: currentEmail!, role: 'admin' } as UserProfile);
        setLoading(false);
        return;
      }

      if (attempts < 3) {
        const backoff = 1000 * (attempts + 1);
        await new Promise(res => setTimeout(res, backoff));
        fetchingUserId.current = null;
        return fetchProfile(userId, authEmail, attempts + 1);
      } else {
        console.error("FAIL SAFE: Agotados los intentos de perfil.");
        setLoading(false);
      }
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
