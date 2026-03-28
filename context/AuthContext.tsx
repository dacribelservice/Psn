"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type UserRole = "admin" | "user" | null;

interface User {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = [
  "cangel2890@gmail.com",
  "dacribel.service@gmail.com"
];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already "logged in" from localStorage
    const savedUser = localStorage.getItem("dacribel_auth_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const role: UserRole = ADMIN_EMAILS.includes(email.toLowerCase()) ? "admin" : "user";
    const newUser = { email, role };
    
    setUser(newUser);
    localStorage.setItem("dacribel_auth_user", JSON.stringify(newUser));
    setLoading(false);

    // Redirect based on role
    if (role === "admin") {
      router.push("/admin/inventory");
    } else {
      router.push("/");
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("dacribel_auth_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role || null, loading, signIn, signOut }}>
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
