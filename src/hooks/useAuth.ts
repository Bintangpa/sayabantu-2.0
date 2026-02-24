import { useState, useEffect } from "react";
import api from "@/lib/api";

export type Role = "admin" | "mitra" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      try {
        const user = JSON.parse(userRaw) as User;
        setAuth({ user, token, isLoading: false });
      } catch {
        setAuth({ user: null, token: null, isLoading: false });
      }
    } else {
      setAuth((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ user, token, isLoading: false });
    return user as User;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: Role;
  }) => {
    const res = await api.post("/auth/register", data);
    const { token, user } = res.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ user, token, isLoading: false });
    return user as User;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ user: null, token: null, isLoading: false });
    window.location.href = "/";
  };

  return {
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    isAuthenticated: !!auth.token,
    role: auth.user?.role ?? null,
    login,
    register,
    logout,
  };
}