"use client";

import { useState, useEffect, useCallback } from "react";
import { RoomCard, Sala } from "@/components/RoomCard";
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

  const carregarSalas = useCallback(async () => {
    try {
      const response = await api.get("/salas");
      if (response.data && response.data.length > 0) {
        setSalas(response.data);
      } else {
        setSalas(SALAS_INICIAIS);
      }
    } catch {
      setSalas(SALAS_INICIAIS);
    } finally {
      setCarregando(false);
    }
  }, []);

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
      {/* Título da página e botão Nova sala */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Salas
        </h1>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova sala</span>
        </button>
      </div>

      {/* Estados de Carregamento, Erro ou Grelha de Salas */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <RoomSkeleton key={i} />
          ))}
        </div>
      ) : erroApi && salas.length === 0 ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-destructive/15 text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Falha ao carregar salas</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{erroApi}</p>
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
      ) : (
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