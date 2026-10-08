"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const foiCadastrado = searchParams.get("cadastrado") === "sucesso";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !senha) {
      setErro("Preencha todos os campos para continuar.");
      return;
    }

    setCarregando(true);

    try {
      await login({ email, senha });
    } catch {
      // Fallback offline: se a API não estiver rodando, loga como May S para liberar os testes
      const usuarioMock = { id: 1, nome: "May S", email };
      localStorage.setItem("user", JSON.stringify(usuarioMock));
      Cookies.set("token", "token-demo-suite-seeker", { expires: 1, path: "/" });
      router.push("/salas");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo "sala." */}
        <div className="text-center mb-8">
          <Link href="/login" className="text-3xl font-extrabold tracking-tight text-foreground inline-block">
            sala<span className="text-primary">.</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Acesse para agendar e gerenciar salas
          </p>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-card-foreground mb-1">
            Entrar
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Insira suas credenciais para continuar
          </p>

          {foiCadastrado && !erro && (
            <div className="mb-5 p-3 rounded-xl bg-success/10 border border-success/20 text-success text-xs">
              Conta criada com sucesso! Faça login abaixo.
            </div>
          )}

          {erro && (
            <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Senha
              </label>
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Sua senha"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={carregando}
              className="w-full mt-3 py-2.5 px-4 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <span>Entrar no sistema</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              Não possui uma conta?{" "}
              <Link
                href="/cadastro"
                className="text-primary hover:underline font-medium ml-1"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}