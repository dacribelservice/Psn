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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string, attempts = 0): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setUser(data as UserProfile);
        setLoading(false);
      }
    } catch (err) {
      console.warn(`Intento ${attempts + 1} de carga de perfil fallido.`);
      
      if (attempts < 2) { // 3 intentos en total (0, 1, 2)
        await new Promise(res => setTimeout(res, 1000)); // Esperar 1s
        return fetchProfile(userId, attempts + 1);
      } else {
        console.error("FAIL SAFE: No se pudo recuperar el perfil. Limpiando sesión corrupta...");
        await signOut(); // Forzar salida si el perfil no carga tras 3 intentos
      }
    }
  };

  const signIn = async (email: string, password?: string) => {
    console.log("AuthContext: signIn initiated for", email);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || "",
      });

      if (error) {
        console.error("AuthContext: Login error:", error.message);
        setLoading(false);
        throw error;
      }

      console.log("AuthContext: Login successful, waiting for profile...");
      // Profile will be fetched by onAuthStateChange, but we ensure loading remains true
      // until profiles is ready.
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  const signUp = async (email: string, password?: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: password || "",
      options: {
        data: {
          full_name: email.split("@")[0],
        }
      }
    });

    if (error) {
      setLoading(false);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      }
    });
  };

  const signOut = async () => {
    console.log("signOut initiated...");
    try {
      // Clear legacy cache first
      localStorage.clear(); 
      sessionStorage.clear();
      
      // Perform signOut - non-blocking if it takes too long
      supabase.auth.signOut().then(({ error }) => {
        if (error) console.error("Supabase signOut error:", error);
        else console.log("Supabase session cleared.");
      });

      console.log("Refreshing state and redirecting...");
      // Forcing a hard refresh to wipe all React context and states
      window.location.replace("/");
    } catch (err) {
      console.error("FATAL signOut error:", err);
      window.location.href = "/";
    }
  };

  const deleteAccount = async () => {
    console.log("Account deletion requested...");
    try {
      // Call RPC to delete public data (and handle foreign keys if applicable)
      const { error } = await supabase.rpc('delete_user_self');
      if (error) {
        console.error("Delete account RPC error:", error.message);
        throw error;
      }
      
      // If success, signOut (which clears local state and session)
      console.log("Profile deleted, signing out...");
      signOut();
    } catch (err) {
      console.error("Critical error while deleting account:", err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, loading, signIn, signUp, signInWithGoogle, signOut, deleteAccount }}>
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
