"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Search, Users, Tv, Wifi, AirVent, Video, CalendarCheck } from "lucide-react";

interface Sala {
  id: string;
  nome: string;
  tipo: string;
  capacidade: number;
  disponivel: boolean;
  imagemUrl: string;
  recursos: string[];
}

const SALAS_MOCK: Sala[] = [
  {
    id: "1",
    nome: "Sala Executiva Aurora",
    tipo: "Reunião Executiva",
    capacidade: 12,
    disponivel: true,
    imagemUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    recursos: ["TV 4K", "Wi-Fi 6", "Ar Condicionado", "Videoconferência"],
  },
  {
    id: "2",
    nome: "Espaço Brainstorm Solarium",
    tipo: "Ideação & Workshops",
    capacidade: 8,
    disponivel: true,
    imagemUrl: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80",
    recursos: ["Quadro Branco", "Wi-Fi 6", "Ar Condicionado"],
  },
  {
    id: "3",
    nome: "Auditório Principal Horizon",
    tipo: "Apresentações & Conferências",
    capacidade: 50,
    disponivel: false,
    imagemUrl: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=800&q=80",
    recursos: ["Projetor Duplo", "Sistema de Som", "Wi-Fi 6", "Videoconferência"],
  },
];

export default function SalasPage() {
  const [busca, setBusca] = useState("");
  const [apenasDisponiveis, setApenasDisponiveis] = useState(false);

  const salasFiltradas = SALAS_MOCK.filter((sala) => {
    const combinaBusca =
      sala.nome.toLowerCase().includes(busca.toLowerCase()) ||
      sala.tipo.toLowerCase().includes(busca.toLowerCase());
    const combinaDisponibilidade = apenasDisponiveis ? sala.disponivel : true;
    return combinaBusca && combinaDisponibilidade;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Título e Filtros */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Salas Disponíveis
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Explore e reserve os melhores espaços de trabalho da empresa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Pesquisar sala..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setApenasDisponiveis(!apenasDisponiveis)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                apenasDisponiveis
                  ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              Apenas disponíveis
            </button>
          </div>
        </div>

        {/* Grelha de Salas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {salasFiltradas.map((sala) => (
            <div
              key={sala.id}
              className="group bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                <img
                  src={sala.imagemUrl}
                  alt={sala.nome}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span
                  className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    sala.disponivel
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                  }`}
                >
                  {sala.disponivel ? "Disponível" : "Ocupada"}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                    {sala.tipo}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {sala.nome}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-400 text-sm mt-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>Capacidade até {sala.capacidade} pessoas</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {sala.recursos.map((rec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-800 border border-slate-700/60 text-slate-300 px-2 py-0.5 rounded-md"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    href={`/salas/${sala.id}`}
                    className="w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg text-sm transition-colors"
                  >
                    Ver detalhes e agendar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}