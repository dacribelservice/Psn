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
  const fetchingUserId = React.useRef<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Deduplicated session check
    let isMounted = true;

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && isMounted) {
        await fetchProfile(session.user.id);
      } else if (!session && isMounted) {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`AuthContext: onAuthStateChange event: ${event}`, { session_user_id: session?.user?.id });
      if (!isMounted) return;

      if (session) {
        // If we already have this user and didn't sign out/in, skip re-fetch unless it's a forced refresh
        if (user?.id === session.user.id && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
           setLoading(false);
           return;
        }
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [user?.id]); // Adding user.id as dependency for safety, or leave empty if using isMounted

  const fetchProfile = async (userId: string, attempts = 0): Promise<void> => {
    // Deduplication: Don't fetch the same ID if already in progress
    if (fetchingUserId.current === userId && attempts === 0) {
      console.log(`AuthContext: [DEBUG] fetchProfile already in progress for ${userId}, skipping redundant call.`);
      return;
    }
    
    fetchingUserId.current = userId;
    console.log(`AuthContext: [DEBUG] fetchProfile starting for ${userId} (Attempt ${attempts})`);
    
    // Safety timeout increased to 20s
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Supabase request timeout")), 20000)
    );

    try {
      console.log(`AuthContext: [DEBUG] Executing Supabase query for ${userId}...`);
      
      const queryPromise = supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // Race the query against the timeout
      const { data, error }: any = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.error(`AuthContext: fetchProfile ERROR for ${userId}:`, error.message);
        throw error;
      }

      if (data) {
        console.log(`AuthContext: fetchProfile SUCCESS for ${userId}`, data);
        setUser(data as UserProfile);
        setLoading(false);
      } else {
        console.warn(`AuthContext: fetchProfile empty data for ${userId}`);
        setUser(null);
        setLoading(false); // Master Fix: Ensure loading is disabled even if data is null
      }
    } catch (err: any) {
      console.warn(`AuthContext: [DEBUG] Intento ${attempts + 1} de carga de perfil fallido:`, err.message || err);
      
      if (attempts < 2) { // 3 intentos en total (0, 1, 2)
        console.log(`AuthContext: [DEBUG] Retrying in 2s...`);
        await new Promise(res => setTimeout(res, 2000)); // Esperar 2s para reintento
        return fetchProfile(userId, attempts + 1);
      } else {
        console.error("FAIL SAFE: No se pudo recuperar el perfil tras 3 intentos. Limpiando sesión corrupta...");
        setLoading(false); // Ensure loading is cleared regardless
        await signOut(); // Forzar salida si el perfil no carga tras 3 intentos
      }
    } finally {
      // Release lock if we succeeded or if we failed after all retries
      if (user || attempts >= 2) {
        fetchingUserId.current = null;
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
