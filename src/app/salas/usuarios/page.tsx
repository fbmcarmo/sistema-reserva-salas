"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { api } from "@/services/api";
import {
  Plus,
  Search,
  User,
  Shield,
  Trash2,
  X,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface Usuario {
  id: string | number;
  nome: string;
  email: string;
  role?: "ADMIN" | "USER" | string;
}

const USUARIOS_INICIAIS: Usuario[] = [
  {
    id: 1,
    nome: "May S",
    email: "mayarasoaresdev@gmail.com",
    role: "ADMIN",
  },
  {
    id: 2,
    nome: "Maria Silva",
    email: "mariasilva123@gmail.com",
    role: "USER",
  },
  {
    id: 3,
    nome: "Carlos Eduardo",
    email: "carlos.eduardo@empresa.com",
    role: "USER",
  },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  // Estados do Modal de Criação
  const [modalAberto, setModalAberto] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoEmail, setNovoEmail] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [novoRole, setNovoRole] = useState("USER");
  const [salvando, setSalvando] = useState(false);
  const [erroModal, setErroModal] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const carregarUsuarios = useCallback(async () => {
    try {
      setCarregando(true);
      const response = await api.get("/usuarios");
      if (response.data && response.data.length > 0) {
        setUsuarios(response.data);
      } else {
        setUsuarios(USUARIOS_INICIAIS);
      }
    } catch {
      // Recupera utilizadores do localStorage ou usa a lista de demonstração
      const salvos = localStorage.getItem("lista_usuarios");
      if (salvos) {
        try {
          setUsuarios(JSON.parse(salvos));
        } catch {
          setUsuarios(USUARIOS_INICIAIS);
        }
      } else {
        setUsuarios(USUARIOS_INICIAIS);
        localStorage.setItem("lista_usuarios", JSON.stringify(USUARIOS_INICIAIS));
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(
      (u) =>
        u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        u.email?.toLowerCase().includes(busca.toLowerCase())
    );
  }, [usuarios, busca]);

  const handleCriarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroModal("");

    if (!novoNome.trim() || !novoEmail.trim() || !novaSenha.trim()) {
      setErroModal("Preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);

    const novoItem: Usuario = {
      id: Date.now(),
      nome: novoNome.trim(),
      email: novoEmail.trim(),
      role: novoRole,
    };

    try {
      await api.post("/usuarios", {
        nome: novoItem.nome,
        email: novoItem.email,
        senha: novaSenha,
        role: novoItem.role,
      });
      await carregarUsuarios();
    } catch {
      // Fallback local se o backend estiver desconectado
      const atualizados = [novoItem, ...usuarios];
      setUsuarios(atualizados);
      localStorage.setItem("lista_usuarios", JSON.stringify(atualizados));
    } finally {
      setSalvando(false);
      setModalAberto(false);
      setNovoNome("");
      setNovoEmail("");
      setNovaSenha("");
      setNovoRole("USER");
      setMensagemSucesso("Usuário cadastrado com sucesso!");
      setTimeout(() => setMensagemSucesso(""), 3500);
    }
  };

  const handleRemoverUsuario = (id: string | number) => {
    const atualizados = usuarios.filter((u) => u.id !== id);
    setUsuarios(atualizados);
    localStorage.setItem("lista_usuarios", JSON.stringify(atualizados));
    setMensagemSucesso("Usuário removido.");
    setTimeout(() => setMensagemSucesso(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Usuários
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Gerencie os acessos e colaboradores cadastrados no sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Novo usuário</span>
        </button>
      </div>

      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Barra de Pesquisa */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome ou e-mail..."
          className="w-full bg-card border border-border/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
        />
      </div>

      {/* Lista / Tabela de Usuários */}
      <div className="bg-card border border-border/80 rounded-2xl overflow-hidden shadow-xs">
        {carregando ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-xs">Carregando lista de usuários...</p>
          </div>
        ) : usuariosFiltrados.length > 0 ? (
          <div className="divide-y divide-border/60">
            {usuariosFiltrados.map((u) => {
              const isAdmin = u.role === "ADMIN" || u.role === "Administrador";

              return (
                <div
                  key={u.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-semibold text-xs border border-border">
                      {u.nome?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                        <span>{u.nome}</span>
                        {isAdmin && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">
                            <Shield className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {u.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                      {isAdmin ? "Administrador" : "Colaborador"}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoverUsuario(u.id)}
                      title="Remover usuário"
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <User className="w-10 h-10 mx-auto mb-2.5 opacity-40" />
            <p className="text-xs font-medium">Nenhum usuário encontrado.</p>
          </div>
        )}
      </div>

      {/* Modal Novo Usuário */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl text-card-foreground">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">
                Cadastrar Novo Usuário
              </h2>
              <button
                type="button"
                onClick={() => setModalAberto(false)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {erroModal && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{erroModal}</span>
              </div>
            )}

            <form onSubmit={handleCriarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Nome completo
                </label>
                <input
                  type="text"
                  required
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Ex: João Souza"
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  value={novoEmail}
                  onChange={(e) => setNovoEmail(e.target.value)}
                  placeholder="joao@empresa.com"
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Senha temporária
                </label>
                <input
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Nível de Acesso
                </label>
                <select
                  value={novoRole}
                  onChange={(e) => setNovoRole(e.target.value)}
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring cursor-pointer"
                >
                  <option value="USER">Colaborador (Reserva salas)</option>
                  <option value="ADMIN">Administrador (Acesso total)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {salvando ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <span>Cadastrar</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}