
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "@/services/endpoints";
import type { Usuario } from "@/types";

interface AuthContextData {
  user: Usuario | null;
  isAuthenticated: boolean;
  login: (credentials: {
    email: string;
    senha: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<Usuario | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  // Remove as informações locais de autenticação.
  const limparSessao = useCallback(() => {
    Cookies.remove("token", {
      path: "/",
    });

    localStorage.removeItem("user");

    setUser(null);
  }, []);

  // Consulta os dados do usuário autenticado.
  const refreshUser = useCallback(async (): Promise<void> => {
    const current = await authService.me();

    setUser(current);

    localStorage.setItem(
      "user",
      JSON.stringify(current)
    );
  }, []);

  // Restaura a sessão ao iniciar a aplicação.
  useEffect(() => {
    let ativo = true;

    async function inicializarAutenticacao() {
      try {
        const token = Cookies.get("token");

        if (!token) {
          return;
        }

        const current = await authService.me();

        if (!ativo) return;

        setUser(current);

        localStorage.setItem(
          "user",
          JSON.stringify(current)
        );
      } catch (error) {
        if (!ativo) return;

        console.error(
          "Não foi possível restaurar a sessão:",
          error
        );

        Cookies.remove("token", {
          path: "/",
        });

        localStorage.removeItem("user");

        setUser(null);
      } finally {
        if (ativo) {
          setIsLoading(false);
        }
      }
    }

    void inicializarAutenticacao();

    return () => {
      ativo = false;
    };
  }, []);

  // Realiza o login.
  const login = useCallback(
    async (credentials: {
      email: string;
      senha: string;
    }): Promise<void> => {
      setIsLoading(true);

      try {
        const data = await authService.login(credentials);

        const token =
          data.token ||
          data.accessToken ||
          data.access_token ||
          data.data?.token;

        if (!token) {
          throw new Error(
            "Login não retornou token JWT."
          );
        }

        Cookies.set("token", token, {
          expires: 7,
          secure: window.location.protocol === "https:",
          sameSite: "lax",
          path: "/",
        });

        try {
          await refreshUser();
        } catch (error) {
          limparSessao();
          throw error;
        }

        router.push("/salas");
        router.refresh();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshUser, limparSessao, router]
  );

  // Encerra a sessão.
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error(
        "Falha ao encerrar sessão no servidor:",
        error
      );
    } finally {
      limparSessao();

      setIsLoading(false);

      router.replace("/login");
      router.refresh();
    }
  }, [limparSessao, router]);

  const contextValue = useMemo<AuthContextData>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      refreshUser,
      isLoading,
    }),
    [
      user,
      login,
      logout,
      refreshUser,
      isLoading,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de um AuthProvider."
    );
  }

  return context;
}
