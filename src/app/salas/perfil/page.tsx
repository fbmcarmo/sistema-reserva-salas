"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmModal } from "@/components/ConfirmModal";
import { api } from "@/services/api";
import { User, Mail, Shield, AlertTriangle, Check, Loader2 } from "lucide-react";

export default function PerfilPage() {
  const { user, logout } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");

  // Estados do Modal de Exclusão
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [excluindoPerfil, setExcluindoPerfil] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome || "May S");
      setEmail(user.email || "may@empresa.com");
    }
  }, [user]);

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setMensagemSucesso("");
    setErro("");

    try {
      await api.put("/usuarios/me", { nome, email });
      setMensagemSucesso("Perfil atualizado com sucesso!");
    } catch {
      // Fallback offline: atualiza os dados no armazenamento local
      if (typeof window !== "undefined") {
        const usuarioAtual = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...usuarioAtual, nome, email })
        );
      }
      setMensagemSucesso("Perfil atualizado localmente!");
    } finally {
      setSalvando(false);
    }
  };

  const handleConfirmarExclusao = async () => {
    try {
      setExcluindoPerfil(true);
      await api.delete("/usuarios/me");
    } catch {
      // Se a API estiver offline, prossegue com o encerramento da sessão
    } finally {
      setExcluindoPerfil(false);
      setModalExcluirAberto(false);
      logout(); // Limpa tokens/cookies e redireciona para /login
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Meu perfil
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Gerencie suas informações pessoais e credenciais de acesso
        </p>
      </div>

      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && (
        <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          {erro}
        </div>
      )}

      {/* Cartão de Dados Cadastrais */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSalvarPerfil} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Nome completo
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
              />
              <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              E-mail corporativo
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-input rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Nível de permissão
            </label>
            <div className="relative">
              <input
                type="text"
                disabled
                value="Administrador"
                className="w-full bg-muted/50 border border-input/60 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-muted-foreground cursor-not-allowed select-none"
              />
              <Shield className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground transition-all shadow-xs cursor-pointer"
            >
              {salvando && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Salvar alterações</span>
            </button>
          </div>
        </form>
      </div>

      {/* Zona de Perigo / Exclusão de Perfil */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-destructive/10 text-destructive shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-foreground">Zona de perigo</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao excluir o seu perfil, todos os seus acessos, configurações e histórico de reservas de salas serão removidos permanentemente.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            data-testid="btn-excluir-perfil"
            onClick={() => setModalExcluirAberto(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 border border-destructive/30 transition-all cursor-pointer"
          >
            Excluir perfil
          </button>
        </div>
      </div>

      {/* Modal Reutilizável de Confirmação */}
      <ConfirmModal
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleConfirmarExclusao}
        titulo="Excluir perfil de usuário?"
        descricao="Esta ação não pode ser desfeita. Todos os seus dados cadastrais e agendamentos serão excluídos definitivamente."
        textoBotaoConfirmar="Excluir minha conta"
        carregando={excluindoPerfil}
      />
    </div>
  );
}