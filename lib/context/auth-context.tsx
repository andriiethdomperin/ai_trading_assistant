"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

type UserInfo = {
  id: string;
  email: string;
  role: string;
  full_name: string;
  avatar_url?: string | null;
};

type AuthContextType = {
  user: User | null;
  userInfo: UserInfo | null;
  signOut: () => Promise<void>;
  updateUserInfo: () => Promise<void>;
  setUserInfo: (userInfo: UserInfo | null) => void;
  fetchUserInfo: (userId: string) => Promise<UserInfo | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const supabase = createClient();

  const fetchUserInfo = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user info:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchUserInfo:", error);
      return null;
    }
  };

  const updateUserInfo = async () => {
    if (user?.id) {
      const userData = await fetchUserInfo(user.id);
      setUserInfo(userData);
    }
  };

  const signOut = async () => {
    try {
      // Then sign out from Supabase
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        throw new Error("Logout failed");
      } else {
        setUserInfo(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const userData = await fetchUserInfo(user.id);
        setUserInfo(userData);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async () => {
      supabase.auth.getUser().then(async ({ data: { user } }) => {
        setUser(user);
        if (user) {
          const userData = await fetchUserInfo(user.id);
          setUserInfo(userData);
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    userInfo,
    signOut,
    updateUserInfo,
    setUserInfo,
    fetchUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
