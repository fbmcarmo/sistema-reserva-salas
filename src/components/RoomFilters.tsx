"use client";

import { Search, RotateCcw } from "lucide-react";

interface RoomFiltersProps {
  busca: string;
  setBusca: (v: string) => void;
  capacidadeMinima: number;
  setCapacidadeMinima: (v: number) => void;
  recursoSelecionado: string;
  setRecursoSelecionado: (v: string) => void;
  onLimparFiltros: () => void;
}

export function RoomFilters({
  busca,
  setBusca,
  capacidadeMinima,
  setCapacidadeMinima,
  recursoSelecionado,
  setRecursoSelecionado,
  onLimparFiltros,
}: RoomFiltersProps) {
  const opcoesRecursos = [
    "Todos",
    "Wi-Fi",
    "Projetor",
    "TV",
    "Videoconferência",
    "Quadro Branco",
  ];

  const temFiltroAtivo =
    busca.trim() !== "" || capacidadeMinima > 0 || recursoSelecionado !== "Todos";

  return (
    <div className="bg-[#0b0f19]/90 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-lg shadow-black/20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        {/* Campo de pesquisa */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por nome ou piso..."
            className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Filtro de Lotação */}
        <div className="md:col-span-3">
          <select
            value={capacidadeMinima}
            onChange={(e) => setCapacidadeMinima(Number(e.target.value))}
            className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value={0}>Qualquer capacidade</option>
            <option value={4}>Mínimo 4 pessoas</option>
            <option value={8}>Mínimo 8 pessoas</option>
            <option value={12}>Mínimo 12 pessoas</option>
            <option value={20}>Mínimo 20 pessoas</option>
          </select>
        </div>

        {/* Filtro de Recursos */}
        <div className="md:col-span-3">
          <select
            value={recursoSelecionado}
            onChange={(e) => setRecursoSelecionado(e.target.value)}
            className="w-full bg-[#111827]/80 border border-slate-700/70 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all cursor-pointer"
          >
            {opcoesRecursos.map((rec) => (
              <option key={rec} value={rec}>
                {rec === "Todos" ? "Todos os recursos" : rec}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de limpeza rápida */}
        <div className="md:col-span-1 flex justify-end">
          {temFiltroAtivo ? (
            <button
              onClick={onLimparFiltros}
              title="Limpar todos os filtros"
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}
        </div>
      </div>
    </div>
  );
}