
import axios from "axios";
import Cookies from "js-cookie";

// URL base da API.
// A variável de ambiente tem prioridade.
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://sistema-reserva-salas-api.onrender.com";

// Remove barras finais para evitar URLs duplicadas.
const baseURL = API_URL.replace(/\/+$/, "");

// Instância principal do Axios.
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador de requisições.
// Adiciona o token JWT quando disponível.
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: unknown) => Promise.reject(error)
);

// Interceptador de respostas.
// Trata erros de autenticação.
api.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      Cookies.remove("token", {
        path: "/",
      });

      localStorage.removeItem("user");

      // Evita redirecionamentos desnecessários.
      if (!window.location.pathname.startsWith("/login")) {
        // URL absoluta para evitar o aviso do ESLint.
        const loginUrl = new URL(
          "/login",
          window.location.origin
        );

        window.location.assign(loginUrl.href);
      }
    }

    return Promise.reject(error);
  }
);

// Converte erros da API em mensagens legíveis.
export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;

    if (data && typeof data === "object") {
      const resposta = data as Record<string, unknown>;

      if (typeof resposta.message === "string") {
        return resposta.message;
      }

      if (typeof resposta.error === "string") {
        return resposta.error;
      }
    }

    return error.response
      ? `Erro HTTP ${error.response.status}`
      : "Não foi possível conectar à API.";
  }

  return error instanceof Error
    ? error.message
    : "Erro inesperado";
}

// Extrai listas de diferentes formatos de resposta.
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    for (const key of [
      "data",
      "items",
      "results",
      "rooms",
      "users",
      "reservations",
    ]) {
      const value = obj[key];

      if (Array.isArray(value)) {
        return value as T[];
      }

      if (value && typeof value === "object") {
        const nested = unwrapList<T>(value);

        if (nested.length > 0) {
          return nested;
        }
      }
    }
  }

  return [];
}

// Extrai um item de diferentes formatos de resposta.
export function unwrapItem<T>(data: unknown): T {
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;

    return (
      obj.data ||
      obj.room ||
      obj.user ||
      obj.usuario ||
      obj.reservation ||
      data
    ) as T;
  }

  return data as T;
}
