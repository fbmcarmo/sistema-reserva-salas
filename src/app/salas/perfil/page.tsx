"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function MeuPerfilPage() {
  const { user } = useAuth();

  const [nome, setNome] = useState("May S");
  const [email, setEmail] = useState("mayarasoaresdev@gmail.com");
  const [novaSenha, setNovaSenha] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  useEffect(() => {
    if (user) {
      if (user.nome) setNome(user.nome);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);

    setTimeout(() => {
      // Atualiza os dados persistidos no armazenamento local
      const dadosAtualizados = {
        ...(user || {}),
        nome,
        email,
      };
      localStorage.setItem("user", JSON.stringify(dadosAtualizados));

      setGuardando(false);
      setNovaSenha("");
      setMensagemSucesso("Perfil atualizado com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3500);
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Título da página */}
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Meu perfil
      </h1>

      {mensagemSucesso && (
        <div className="max-w-xl p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Cartão de edição de perfil */}
      <div className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Nome
            </label>
            <input
              type="text"
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
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
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5">
              Nova senha (opcional)
            </label>
            <input
              type="password"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder=""
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={guardando}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {guardando ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>A guardar...</span>
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