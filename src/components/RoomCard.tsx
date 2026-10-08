"use client";

import Link from "next/link";
import { Users, Wifi, Tv, Monitor, Presentation, ArrowRight } from "lucide-react";

export interface Sala {
  id: number | string;
  nome: string;
  descricao?: string;
  capacidade: number;
  localizacao?: string;
  recursos: string[];
  disponivel?: boolean;
}

interface RoomCardProps {
  sala: Sala;
}

export function RoomCard({ sala }: RoomCardProps) {
  // Ícones específicos para os recursos mais comuns
  const renderIcon = (item: string) => {
    const termo = item.toLowerCase();
    if (termo.includes("wi-fi") || termo.includes("wifi")) return <Wifi className="w-3.5 h-3.5" />;
    if (termo.includes("tv")) return <Tv className="w-3.5 h-3.5" />;
    if (termo.includes("projetor")) return <Presentation className="w-3.5 h-3.5" />;
    return <Monitor className="w-3.5 h-3.5" />;
  };

  return (
    <div className="group flex flex-col justify-between bg-[#0b0f19]/90 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-950/20">
      <div>
        {/* Nome da sala e estado de disponibilidade */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition-colors">
            {sala.nome}
          </h3>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              sala.disponivel !== false
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}
          >
            {sala.disponivel !== false ? "Disponível" : "Ocupada"}
          </span>
        </div>

        {sala.localizacao && (
          <p className="text-xs text-slate-400 mb-3">{sala.localizacao}</p>
        )}

        {sala.descricao && (
          <p className="text-xs text-slate-400/90 line-clamp-2 mb-4 leading-relaxed">
            {sala.descricao}
          </p>
        )}

        {/* Lotação máxima */}
        <div className="flex items-center gap-2 text-xs text-slate-300 mb-4 bg-[#111827]/80 border border-slate-800 px-3 py-1.5 rounded-xl w-fit">
          <Users className="w-3.5 h-3.5 text-indigo-400" />
          <span>Até {sala.capacidade} lugares</span>
        </div>

        {/* Lista de recursos */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {sala.recursos?.map((recurso, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] bg-[#111827]/90 border border-slate-800 text-slate-300"
            >
              {renderIcon(recurso)}
              <span>{recurso}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Ligação para a rota dinâmica da sala */}
      <Link
        href={`/salas/${sala.id}`}
        className="w-full mt-auto flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/25 active:scale-[0.99]"
      >
        <span>Ver Detalhes e Reservar</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}