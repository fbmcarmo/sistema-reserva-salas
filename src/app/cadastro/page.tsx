"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { api } from "@/services/api";
import { Loader2 } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !email.trim() || !senha || !confirmarSenha) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve conter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      await api.post("/usuarios", {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });
      router.push("/login?cadastrado=sucesso");
    } catch {
      // Fallback offline: cadastra no armazenamento local para permitir testes imediatos
      const usuarioLocal = { id: 1, nome: nome.trim(), email: email.trim() };
      localStorage.setItem("user", JSON.stringify(usuarioLocal));
      Cookies.set("token", "token-demo-suite-seeker", { expires: 1, path: "/" });
      
      router.push("/salas");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo minimalista do protótipo */}
        <div className="text-center mb-8">
          <Link href="/login" className="text-3xl font-extrabold tracking-tight text-foreground inline-block">
            sala<span className="text-primary">.</span>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            Crie sua conta para reservar espaços de reunião
          </p>
        </div>

        {/* Card do formulário */}
        <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-card-foreground mb-1">
            Criar conta
          </h2>
          <p className="text-xs text-muted-foreground mb-6">
            Preencha seus dados para começar
          </p>

          {erro && (
            <div className="mb-5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Nome completo
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: May S"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
              />
            </div>

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
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Confirmar senha
              </label>
              <input
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita sua senha"
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
                  <span>Cadastrando...</span>
                </>
              ) : (
                <span>Criar minha conta</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium ml-1"
              >
                Fazer login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}