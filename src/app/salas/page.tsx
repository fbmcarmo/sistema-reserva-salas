"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { RoomCard, Sala } from "@/components/RoomCard";
import { RoomFilters } from "@/components/RoomFilters";
import { RoomSkeleton } from "@/components/RoomSkeleton";
import { DoorOpen, AlertCircle, RefreshCw } from "lucide-react";
import { api } from "@/services/api";

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  const [busca, setBusca] = useState("");
  const [capacidadeMinima, setCapacidadeMinima] = useState(0);
  const [recursoSelecionado, setRecursoSelecionado] = useState("Todos");

  const carregarSalas = useCallback(async () => {
    try {
      setCarregando(true);
      setErroApi("");
      const response = await api.get("/salas");
      setSalas(response.data);
    } catch {
      setErroApi("Não foi possível estabelecer ligação com o servidor para obter as salas.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSalas();
  }, [carregarSalas]);

  const salasFiltradas = useMemo(() => {
    return salas.filter((sala) => {
      const matchBusca =
        sala.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        sala.localizacao?.toLowerCase().includes(busca.toLowerCase());
      const matchCapacidade = (sala.capacidade || 0) >= capacidadeMinima;
      const matchRecurso =
        recursoSelecionado === "Todos" ||
        sala.recursos?.some((r) =>
          r.toLowerCase().includes(recursoSelecionado.toLowerCase())
        );
      return matchBusca && matchCapacidade && matchRecurso;
    });
  }, [salas, busca, capacidadeMinima, recursoSelecionado]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <DoorOpen className="w-6 h-6 text-indigo-400" />
          <span>Salas de Reunião</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore os espaços disponíveis e reserve a sala ideal para a sua equipa.
        </p>
      </div>

      <RoomFilters
        busca={busca}
        setBusca={setBusca}
        capacidadeMinima={capacidadeMinima}
        setCapacidadeMinima={setCapacidadeMinima}
        recursoSelecionado={recursoSelecionado}
        setRecursoSelecionado={setRecursoSelecionado}
        onLimparFiltros={() => {
          setBusca("");
          setCapacidadeMinima(0);
          setRecursoSelecionado("Todos");
        }}
      />

      {/* FE21: Estado de Carregamento com Skeleton */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <RoomSkeleton key={i} />
          ))}
        </div>
      ) : erroApi ? (
        /* FE21: Estado de Erro com Ação de Retentativa */
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-rose-900/30 text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Falha na Comunicação</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">{erroApi}</p>
          </div>
          <button
            onClick={carregarSalas}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all cursor-pointer shadow-md shadow-indigo-600/30"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : salasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salasFiltradas.map((sala) => (
            <RoomCard key={sala.id} sala={sala} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0b0f19]/60 border border-slate-800 rounded-2xl p-12 text-center">
          <DoorOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">Nenhuma sala encontrada</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Não existem salas que correspondam aos filtros selecionados.
          </p>
        </div>
      )}
    </div>
  );
}