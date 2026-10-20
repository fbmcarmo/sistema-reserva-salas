
"use client";

import { useState, type FormEvent } from "react";
import { usersService } from "@/services/endpoints";
import { apiError } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

import {
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface DadosFormulario {
  nome: string;
  email: string;
  novaSenha: string;
}

interface FormularioPerfilProps {
  userId: string | number;
  nomeInicial: string;
  emailInicial: string;
  refreshUser: () => Promise<unknown>;
}

function FormularioPerfil({
  userId,
  nomeInicial,
  emailInicial,
  refreshUser,
}: FormularioPerfilProps) {
  const [formulario, setFormulario] = useState<DadosFormulario>({
    nome: nomeInicial,
    email: emailInicial,
    novaSenha: "",
  });

  const [guardando, setGuardando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const [erro, setErro] = useState("");

  function atualizarCampo(
    campo: keyof DadosFormulario,
    valor: string
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));

    setMensagemSucesso("");
    setErro("");
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (guardando) return;

    setMensagemSucesso("");
    setErro("");

    const nome = formulario.nome.trim();
    const email = formulario.email.trim();
    const novaSenha = formulario.novaSenha;

    if (!nome || !email) {
      setErro("Preencha o nome e o e-mail.");
      return;
    }

    setGuardando(true);

    try {
      await usersService.update(userId, {
        nome,
        email,
        ...(novaSenha ? { senha: novaSenha } : {}),
      });

      setFormulario((anterior) => ({
        ...anterior,
        nome,
        email,
        novaSenha: "",
      }));

      setMensagemSucesso(
        "Perfil atualizado com sucesso!"
      );

      try {
        await refreshUser();
      } catch {
        setErro(
          "O perfil foi salvo, mas não foi possível atualizar os dados da sessão. Recarregue a página."
        );
      }
    } catch (error) {
      setErro(apiError(error));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="space-y-6">
      {mensagemSucesso && (
        <div
          role="status"
          className="max-w-xl p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5"
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erro && (
        <div
          role="alert"
          className="max-w-xl p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{erro}</span>
        </div>
      )}

      {/* Cartão de edição de perfil */}
      <div className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Nome */}
          <div>
            <label
              htmlFor="perfil-nome"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              Nome
            </label>

            <input
              id="perfil-nome"
              type="text"
              required
              disabled={guardando}
              value={formulario.nome}
              onChange={(e) =>
                atualizarCampo("nome", e.target.value)
              }
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all disabled:opacity-50"
            />
          </div>

          {/* E-mail */}
          <div>
            <label
              htmlFor="perfil-email"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              E-mail
            </label>

            <input
              id="perfil-email"
              type="email"
              required
              disabled={guardando}
              value={formulario.email}
              onChange={(e) =>
                atualizarCampo("email", e.target.value)
              }
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all disabled:opacity-50"
            />
          </div>

          {/* Nova senha */}
          <div>
            <label
              htmlFor="perfil-senha"
              className="block text-xs font-medium text-foreground mb-1.5"
            >
              Nova senha (opcional)
            </label>

            <input
              id="perfil-senha"
              type="password"
              autoComplete="new-password"
              disabled={guardando}
              value={formulario.novaSenha}
              onChange={(e) =>
                atualizarCampo("novaSenha", e.target.value)
              }
              placeholder="Deixe em branco para manter a senha"
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all disabled:opacity-50"
            />
          </div>

          {/* Botão salvar */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Salvar</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MeuPerfilPage() {
  const { user, isLoading, refreshUser } = useAuth();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Meu perfil
      </h1>

      {isLoading ? (
        <div className="max-w-xl bg-card border border-border/80 rounded-2xl p-8 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Carregando perfil...
          </span>
        </div>
      ) : !user ? (
        <div
          role="alert"
          className="max-w-xl p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
        >
          Não foi possível carregar o usuário autenticado.
        </div>
      ) : (
        <FormularioPerfil
          key={String(user.id)}
          userId={user.id}
          nomeInicial={user.nome ?? ""}
          emailInicial={user.email ?? ""}
          refreshUser={refreshUser}
        />
      )}
    </div>
  );
}
