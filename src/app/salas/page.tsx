
"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import { RoomCard, type Sala } from "@/components/RoomCard";
import { RoomSkeleton } from "@/components/RoomSkeleton";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { roomsService } from "@/services/endpoints";
import { apiError } from "@/services/api";

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const [editando, setEditando] = useState<Sala | null>(null);
  const [formAberto, setFormAberto] = useState(false);

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
    setFormAberto(true);
    setErroApi("");
  }

  function fecharFormulario() {
    setFormAberto(false);
    setEditando(null);
    setNome("");
    setCapacidade(4);
    setDescricao("");
    setLocalizacao("");
  }

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (salvando) return;

    setErroApi("");

    const nomeTratado = nome.trim();

    if (!nomeTratado) {
      setErroApi("Informe o nome da sala.");
      return;
    }

    if (!Number.isInteger(capacidade) || capacidade < 1) {
      setErroApi("Informe uma capacidade válida.");
      return;
    }

    setSalvando(true);

    try {
      const payload = {
        nome: nomeTratado,
        capacidade,
        descricao: descricao.trim(),
        localizacao: localizacao.trim(),
      };

      if (editando) {
        await roomsService.update(editando.id, payload);
      } else {
        await roomsService.create(payload);
      }

      fecharFormulario();
      await carregarSalas();
    } catch (error) {
      setErroApi(apiError(error));
    } finally {
      setSalvando(false);
    }
  }

  async function remover(id: string | number) {
    if (!window.confirm("Excluir esta sala?")) {
      return;
    }

    setRemovendoId(id);
    setErroApi("");

    try {
      await roomsService.remove(id);
      await carregarSalas();
    } catch (error) {
      setErroApi(apiError(error));
    } finally {
      setRemovendoId(null);
    }
  }

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

      {/* Formulário de criação e edição */}
      {formAberto && (
        <form
          onSubmit={salvar}
          className="p-5 border border-border rounded-xl grid gap-3 bg-card"
        >
          <h2 className="font-semibold text-foreground">
            {editando ? "Editar sala" : "Nova sala"}
          </h2>

          <div className="grid gap-1">
            <label
              htmlFor="nome-sala"
              className="text-xs font-medium"
            >
              Nome da sala
            </label>

            <input
              id="nome-sala"
              className="border border-input rounded-lg p-2 bg-background"
              required
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="capacidade-sala"
              className="text-xs font-medium"
            >
              Capacidade
            </label>

            <input
              id="capacidade-sala"
              className="border border-input rounded-lg p-2 bg-background"
              type="number"
              min={1}
              required
              value={capacidade}
              onChange={(e) =>
                setCapacidade(Number(e.target.value))
              }
            />
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="descricao-sala"
              className="text-xs font-medium"
            >
              Descrição
            </label>

            <input
              id="descricao-sala"
              className="border border-input rounded-lg p-2 bg-background"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          <div className="grid gap-1">
            <label
              htmlFor="localizacao-sala"
              className="text-xs font-medium"
            >
              Localização
            </label>

            <input
              id="localizacao-sala"
              className="border border-input rounded-lg p-2 bg-background"
              placeholder="Localização"
              value={localizacao}
              onChange={(e) => setLocalizacao(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={salvando}
              className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {salvando ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              disabled={salvando}
              onClick={fecharFormulario}
              className="border border-border rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
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
            onClick={() => void carregarSalas()}
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
            <div key={sala.id} className="space-y-2">
              <RoomCard sala={sala} />

              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => abrirFormulario(sala)}
                  className="underline hover:text-primary"
                >
                  Editar
                </button>

                <button
                  type="button"
                  disabled={removendoId === sala.id}
                  onClick={() => void remover(sala.id)}
                  className="text-destructive underline disabled:opacity-50"
                >
                  {removendoId === sala.id
                    ? "Excluindo..."
                    : "Excluir"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
