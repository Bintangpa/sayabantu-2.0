import { createContext, useContext, useState, ReactNode } from "react";
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

interface AuthContextType extends AuthState {
  isAuthenticated: boolean;
  role: Role | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string; phone: string; role: Role }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getInitialAuth(): AuthState {
  try {
    const token = localStorage.getItem("token");
    const userRaw = localStorage.getItem("user");
    if (token && userRaw) {
      const user = JSON.parse(userRaw) as User;
      return { user, token, isLoading: false };
    }
  } catch {}
  return { user: null, token: null, isLoading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(getInitialAuth);

  const login = async (email: string, password: string): Promise<User> => {
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
  }): Promise<User> => {
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

  return (
    <AuthContext.Provider value={{
      ...auth,
      isAuthenticated: !!auth.token,
      role: auth.user?.role ?? null,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthProvider");
  return ctx;
}