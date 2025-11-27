"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  email: string;
  name: string;
  role?: string;
  [key: string]: string | number | boolean | undefined;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("access_token");

        if (savedUser && token) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            console.error("Error parsing saved user data");
            localStorage.removeItem("user");
            localStorage.removeItem("access_token");
          }
        }
        setLoading(false);
      }
    };

    loadUser();

    // Listen for token refresh events
    const handleTokenRefresh = (event: CustomEvent) => {
      if (event.detail?.user) {
        setUser(event.detail.user);
      }
    };

    // Listen for auth state changes (logout)
    const handleAuthStateChange = () => {
      const savedUser = localStorage.getItem("user");
      const token = localStorage.getItem("access_token");
      if (!savedUser || !token) {
        setUser(null);
      } else {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      }
    };

    window.addEventListener(
      "tokenRefreshed",
      handleTokenRefresh as EventListener
    );
    window.addEventListener("authStateChanged", handleAuthStateChange);

    return () => {
      window.removeEventListener(
        "tokenRefreshed",
        handleTokenRefresh as EventListener
      );
      window.removeEventListener("authStateChanged", handleAuthStateChange);
    };
  }, []);

  const login = (token: string, userData: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
