"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "@/services/endpoints";
import type { Usuario } from "@/types";
interface AuthContextData {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (credentials: { email: string; senha: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextData>({} as AuthContextData);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const refreshUser = useCallback(async () => {
    const current = await authService.me();
    setUser(current);
    localStorage.setItem("user", JSON.stringify(current));
  }, []);
  useEffect(() => {
    if (!Cookies.get("token")) { setIsLoading(false); return; }
    refreshUser().catch(() => { Cookies.remove("token", { path: "/" }); localStorage.removeItem("user"); setUser(null); }).finally(() => setIsLoading(false));
  }, [refreshUser]);
  async function login(credentials: { email: string; senha: string }) {
    const data = await authService.login(credentials);
    const token = data.token || data.accessToken || data.access_token || data.data?.token;
    if (!token) throw new Error("Login não retornou token JWT.");
    Cookies.set("token", token, { expires: 7, secure: window.location.protocol === "https:", sameSite: "lax", path: "/" });
    try { await refreshUser(); } catch (error) { Cookies.remove("token", { path: "/" }); throw error; }
    router.push("/salas");
    router.refresh();
  }
  async function logout() {
    try { await authService.logout(); } catch (error) { console.error("Falha ao encerrar sessão no servidor", error); }
    finally {
      Cookies.remove("token", { path: "/" }); localStorage.removeItem("user"); setUser(null);
      router.replace("/login"); router.refresh();
    }
  }
  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, refreshUser, isLoading }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
