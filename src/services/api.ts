import axios from "axios";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, ""),
  headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((response) => response, (error) => {
  if (error.response?.status === 401 && typeof window !== "undefined") {
    Cookies.remove("token", { path: "/" });
    localStorage.removeItem("user");
    if (!window.location.pathname.startsWith("/login")) window.location.assign("/login");
  }
  return Promise.reject(error);
});
export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    return data?.message || data?.error || (error.response ? `Erro HTTP ${error.response.status}` : "Não foi possível conectar à API.");
  }
  return error instanceof Error ? error.message : "Erro inesperado";
}
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    for (const key of ["data", "items", "results", "rooms", "users", "reservations"]) {
      if (Array.isArray(obj[key])) return obj[key] as T[];
      if (obj[key] && typeof obj[key] === "object") {
        const nested = unwrapList<T>(obj[key]);
        if (nested.length) return nested;
      }
    }
  }
  return [];
}
export function unwrapItem<T>(data: unknown): T {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    return (obj.data || obj.room || obj.user || obj.usuario || obj.reservation || data) as T;
  }
  return data as T;
}
