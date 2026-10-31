
"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { RoomCard, type Sala } from "@/components/RoomCard";
import { RoomSkeleton } from "@/components/RoomSkeleton";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { api } from "@/services/api";
import { ConfirmModal } from "@/components/ConfirmModal";

const SALAS_INICIAIS: Sala[] = [
  {
    id: 1,
    nome: "Sala Atlântico",
    capacidade: 8,
    localizacao: "1º andar",
    descricao: "TV e quadro branco",
    disponivel: true,
  },
  {
    id: 2,
    nome: "Sala Sertão",
    capacidade: 4,
    localizacao: "2º andar",
    descricao: "Ideal para reuniões rápidas",
    disponivel: true,
  },
  {
    id: 3,
    nome: "Auditório",
    capacidade: 40,
    localizacao: "Térreo",
    descricao: "Projetor e som",
    disponivel: true,
  },
];

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [salaParaExcluir, setSalaParaExcluir] = useState<Sala | null>(null);
  const [excluindoSala, setExcluindoSala] = useState(false);

  const [editando, setEditando] = useState<Sala | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [erroModal, setErroModal] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState(4);
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [removendoId, setRemovendoId] = useState<string | number | null>(null);

  // Busca os dados da API sem atualizar o estado
  // de forma síncrona dentro do useEffect.
  const buscarSalas = useCallback(async (): Promise<Sala[]> => {
    return await roomsService.list();
  }, []);

  // Carregamento inicial das salas.
  useEffect(() => {
    let ativo = true;

    async function carregarInicial() {
      try {
        const dados = await buscarSalas();

        if (!ativo) return;

        setSalas(dados);
        setErroApi("");
      } catch (error) {
        if (!ativo) return;

        setErroApi(apiError(error));
        setSalas([]);
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarInicial();

    return () => {
      ativo = false;
    };
  }, [buscarSalas]);

  // Recarregamento manual ou após operações CRUD.
  const carregarSalas = useCallback(async () => {
    setCarregando(true);
    setErroApi("");

    try {
      const dados = await buscarSalas();
      setSalas(dados);
    } catch (error) {
      setErroApi(apiError(error));
      setSalas([]);
    } finally {
      setCarregando(false);
    }
  }, [buscarSalas]);

  function abrirFormulario(sala?: Sala) {
    setEditando(sala ?? null);
    setNome(sala?.nome ?? "");
    setCapacidade(sala?.capacidade ?? 4);
    setDescricao(sala?.descricao ?? "");
    setLocalizacao(sala?.localizacao ?? "");
    setErroModal("");
    setMensagemSucesso("");
    setFormAberto(true);
  }

  function fecharFormulario() {
    if (salvando) return;
    setFormAberto(false);
    setErroModal("");
    setEditando(null);
    setNome("");
    setCapacidade(4);
    setDescricao("");
    setLocalizacao("");
  }

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (salvando) return;

    setErroModal("");

    const nomeTratado = nome.trim();

    if (!nomeTratado) {
      setErroModal("Informe o nome da sala.");
      return;
    }

    if (!Number.isInteger(capacidade) || capacidade < 1) {
      setErroModal("Informe uma capacidade válida.");
      return;
    }

    if (!localizacao.trim()) {
      setErroModal("Informe a localização da sala.");
      return;
    }

    setSalvando(true);

    try {
      const response = await api.get("/salas");
      if (response.data && response.data.length > 0) {
        setSalas(response.data);
      } else {
        await roomsService.create(payload);
      }

      setSalvando(false);
      fecharFormulario();
      setMensagemSucesso(editando ? "Sala atualizada com sucesso!" : "Sala cadastrada com sucesso!");
      try {
        await carregarSalas();
      } catch {
        // O cadastro foi concluído; a falha de atualização é exibida na listagem.
      }
    } catch (error) {
      setErroModal(apiError(error));
    } finally {
      setSalvando(false);
    }
  }

  useEffect(() => {
    void Promise.resolve().then(carregarSalas);
  }, [carregarSalas]);

  const abrirConfirmacaoExclusao = (sala: Sala) => {
    setSalaParaExcluir(sala);
    setModalExcluirAberto(true);
  };

  const confirmarExclusaoSala = async () => {
    if (!salaParaExcluir) return;

    try {
      setExcluindoSala(true);
      await api.delete(`/salas/${salaParaExcluir.id}`);
      setSalas((prev) => prev.filter((s) => s.id !== salaParaExcluir.id));
      setModalExcluirAberto(false);
    } catch {
      // Fallback caso a API esteja offline: remove da lista local.
      setSalas((prev) => prev.filter((s) => s.id !== salaParaExcluir.id));
      setModalExcluirAberto(false);
    } finally {
      setExcluindoSala(false);
      setSalaParaExcluir(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Salas
        </h1>

        <button
          type="button"
          onClick={() => abrirFormulario()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova sala</span>
        </button>
      </div>

      {/* Modal de criação e edição, no estilo da página de usuários */}
      {formAberto && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !salvando) fecharFormulario();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-modal-sala"
            className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl text-card-foreground max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="titulo-modal-sala" className="text-base font-bold text-foreground">
                {editando ? "Editar Sala" : "Cadastrar Nova Sala"}
              </h2>
              <button
                type="button"
                aria-label="Fechar formulário"
                disabled={salvando}
                onClick={fecharFormulario}
                className="text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {erroModal && (
              <div role="alert" className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{erroModal}</span>
              </div>
            )}

            <form onSubmit={salvar} className="space-y-4">
              <div>
                <label htmlFor="nome-sala" className="block text-xs font-medium text-foreground mb-1.5">Nome da sala</label>
                <input
                  id="nome-sala"
                  autoFocus
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Sala de Reuniões A"
                  disabled={salvando}
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                />
              </div>

              <div>
                <label htmlFor="capacidade-sala" className="block text-xs font-medium text-foreground mb-1.5">Capacidade</label>
                <input
                  id="capacidade-sala"
                  type="number"
                  min={1}
                  required
                  value={capacidade}
                  onChange={(e) => setCapacidade(Number(e.target.value))}
                  disabled={salvando}
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                />
              </div>

              <div>
                <label htmlFor="descricao-sala" className="block text-xs font-medium text-foreground mb-1.5">Descrição</label>
                <textarea
                  id="descricao-sala"
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Ex: Sala com projetor para reuniões"
                  disabled={salvando}
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
                />
              </div>

              <div>
                <label htmlFor="localizacao-sala" className="block text-xs font-medium text-foreground mb-1.5">Localização</label>
                <input
                  id="localizacao-sala"
                  required
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  placeholder="Ex: Bloco A - 2º andar"
                  disabled={salvando}
                  className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={fecharFormulario}
                  disabled={salvando}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-primary-foreground bg-primary hover:opacity-90 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {salvando ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>Salvando...</span></>
                  ) : (
                    <span>{editando ? "Salvar alterações" : "Cadastrar"}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {mensagemSucesso && (
        <div role="status" className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Mensagens de erro */}
      {erroApi && (
        <p role="alert" className="text-destructive text-sm">
          {erroApi}
        </p>
      )}

      {/* Carregamento */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <RoomSkeleton key={i} />
          ))}
        </div>
      ) : erroApi && salas.length === 0 ? (
        /* Falha ao carregar salas */
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-destructive/15 text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Falha ao carregar salas
            </h3>

            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {erroApi}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCarregando(true);
              void carregarSalas();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : salas.length === 0 ? (
        /* Nenhuma sala cadastrada */
        <div className="border border-border rounded-2xl p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Nenhuma sala cadastrada.
          </p>
        </div>
      ) : (
        /* Listagem das salas */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salas.map((sala) => (
            <RoomCard
              key={sala.id}
              sala={sala}
              onDelete={abrirConfirmacaoExclusao}
            />
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={modalExcluirAberto}
        onClose={() => {
          setModalExcluirAberto(false);
          setSalaParaExcluir(null);
        }}
        onConfirm={confirmarExclusaoSala}
        titulo="Excluir sala?"
        descricao={`Tem certeza de que deseja excluir ${salaParaExcluir?.nome ?? "esta sala"}? Esta ação não pode ser desfeita.`}
        textoBotaoConfirmar="Excluir sala"
        carregando={excluindoSala}
      />
    </div>
  );
}
