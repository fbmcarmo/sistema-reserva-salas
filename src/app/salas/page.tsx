"use client";

import { useState, useMemo } from "react";
import { RoomCard, Sala } from "@/components/RoomCard";
import { RoomFilters } from "@/components/RoomFilters";
import { DoorOpen } from "lucide-react";

const SALAS_INICIAIS: Sala[] = [
  {
    id: 1,
    nome: "Sala Inovação",
    descricao: "Espaço espaçoso preparado para reuniões executivas e apresentações estratégicas.",
    capacidade: 12,
    localizacao: "Piso 2 — Ala Norte",
    recursos: ["Wi-Fi", "Projetor", "Videoconferência", "Quadro Branco"],
    disponivel: true,
  },
  {
    id: 2,
    nome: "Sala Brainstorm",
    descricao: "Ambiente descontraído concebido para sessões de cocriação e planeamento de equipa.",
    capacidade: 6,
    localizacao: "Piso 1 — Ala Criativa",
    recursos: ["Wi-Fi", "TV", "Quadro Branco"],
    disponivel: true,
  },
  {
    id: 3,
    nome: "Auditório Central",
    descricao: "Infraestrutura ampla com isolamento acústico e sistema audiovisual para apresentações gerais.",
    capacidade: 30,
    localizacao: "Piso Térreo",
    recursos: ["Wi-Fi", "Projetor", "Videoconferência"],
    disponivel: false,
  },
  {
    id: 4,
    nome: "Sala Focus",
    descricao: "Cabine privada para chamadas individuais, entrevistas ou reuniões rápidas de alinhamento.",
    capacidade: 4,
    localizacao: "Piso 2 — Ala Sul",
    recursos: ["Wi-Fi", "TV"],
    disponivel: true,
  },
];

export default function SalasPage() {
  const [salas] = useState<Sala[]>(SALAS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [capacidadeMinima, setCapacidadeMinima] = useState(0);
  const [recursoSelecionado, setRecursoSelecionado] = useState("Todos");

  // Filtro computado em tempo real
  const salasFiltradas = useMemo(() => {
    return salas.filter((sala) => {
      const matchBusca =
        sala.nome.toLowerCase().includes(busca.toLowerCase()) ||
        sala.localizacao?.toLowerCase().includes(busca.toLowerCase());

      const matchCapacidade = sala.capacidade >= capacidadeMinima;

      const matchRecurso =
        recursoSelecionado === "Todos" ||
        sala.recursos.some((r) =>
          r.toLowerCase().includes(recursoSelecionado.toLowerCase())
        );

      return matchBusca && matchCapacidade && matchRecurso;
    });
  }, [salas, busca, capacidadeMinima, recursoSelecionado]);

  const limparFiltros = () => {
    setBusca("");
    setCapacidadeMinima(0);
    setRecursoSelecionado("Todos");
  };

  return (
    <div className="space-y-6">
      {/* Título de abertura */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
          <DoorOpen className="w-6 h-6 text-indigo-400" />
          <span>Salas de Reunião</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Explore os espaços disponíveis e reserve a sala ideal para a sua equipa.
        </p>
      </div>

      {/* Componente de Filtro (FE12) */}
      <RoomFilters
        busca={busca}
        setBusca={setBusca}
        capacidadeMinima={capacidadeMinima}
        setCapacidadeMinima={setCapacidadeMinima}
        recursoSelecionado={recursoSelecionado}
        setRecursoSelecionado={setRecursoSelecionado}
        onLimparFiltros={limparFiltros}
      />

      {/* Grelha de Cartões (FE10) */}
      {salasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salasFiltradas.map((sala) => (
            <RoomCard key={sala.id} sala={sala} />
          ))}
        </div>
      ) : (
        <div className="bg-[#0b0f19]/60 border border-slate-800 rounded-2xl p-12 text-center">
          <DoorOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">
            Nenhuma sala encontrada
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Não existem salas que correspondam aos filtros selecionados.
          </p>
          <button
            onClick={limparFiltros}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer"
          >
            Limpar filtros de pesquisa
          </button>
        </div>
      )}
    </div>
  );
}