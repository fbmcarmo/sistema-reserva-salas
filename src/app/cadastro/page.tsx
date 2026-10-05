"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import {
  Building2,
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

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
      setErro("A palavra-passe deve conter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As palavras-passe não coincidem.");
      return;
    }

    setCarregando(true);

    try {
      // Registo do utilizador no backend
      await api.post("/usuarios", {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      });

      // Redireciona para o login exibindo o banner de confirmação
      router.push("/login?cadastrado=sucesso");
    } catch (err: any) {
      console.error("Erro no cadastro:", err);
      const mensagemApi =
        err.response?.data?.mensagem ||
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Ocorreu um erro ao criar a conta. Tente novamente.";
      setErro(mensagemApi);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0b0f19]/90 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4 shadow-inner">
            <Building2 className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Criar Nova Conta
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Registe-se para aceder e agendar salas na Reserva de Salas.
          </p>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{erro}</span>
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome Completo */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Introduza o seu nome completo"
                className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Endereço de E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Palavra-passe */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Palavra-passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Pelo menos 6 caracteres"
                className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Confirmar Palavra-passe */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Confirmar Palavra-passe
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a palavra-passe"
                className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Botão de Registo */}
          <button
            type="submit"
            disabled={carregando}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white transition-all shadow-lg shadow-indigo-600/30 active:scale-[0.99] cursor-pointer"
          >
            {carregando ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>A criar conta...</span>
              </>
            ) : (
              <>
                <span>Concluir Registo</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Rodapé */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition-colors"
            >
              Iniciar sessão
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}