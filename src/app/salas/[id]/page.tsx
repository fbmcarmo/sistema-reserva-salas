"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Wifi,
  Tv,
  Presentation,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

// Horários de funcionamento padrão
const HORARIOS_DIA = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
];

// Ocupações simuladas para demonstrar a consulta de disponibilidade (FE14)
const OCUPACOES_MOCK: Record<string, string[]> = {
  "2026-10-06": ["09:00 - 10:00", "14:00 - 15:00"],
  "2026-10-07": ["10:00 - 11:00", "16:00 - 17:00", "17:00 - 18:00"],
};

export default function DetalhesSalaPage() {
  const params = useParams();
  const router = useRouter();
  const salaId = params?.id;

  // Estado do formulário de reserva (FE13)
  const [dataSelecionada, setDataSelecionada] = useState("2026-10-06");
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  // Horários indisponíveis na data escolhida (FE14)
  const horariosOcupados = OCUPACOES_MOCK[dataSelecionada] || [];

  const handleSubmeterReserva = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!horarioSelecionado) {
      setErro("Por favor, selecione um horário disponível.");
      return;
    }

    // Criar objeto da nova reserva e persistir localmente para o ecrã 'Minhas Reservas' (FE15)
    const novaReserva = {
      id: Date.now().toString(),
      salaId,
      nomeSala: `Sala Inovação (${salaId})`,
      data: dataSelecionada,
      horario: horarioSelecionado,
      motivo: motivo || "Reunião de Alinhamento",
      status: "Confirmada",
      criadaEm: new Date().toISOString(),
    };

    const reservasSalvas = JSON.parse(localStorage.getItem("minhas_reservas") || "[]");
    localStorage.setItem("minhas_reservas", JSON.stringify([novaReserva, ...reservasSalvas]));

    setSucesso(true);
    setTimeout(() => {
      router.push("/salas/minhas-reservas");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Botão de regresso */}
      <Link
        href="/salas"
        className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao catálogo de salas</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Informações da Sala e Consulta de Horários (FE14) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0b0f19]/90 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl font-bold text-white">Sala Inovação</h1>
                <p className="text-xs text-slate-400 mt-1">Piso 2 — Ala Norte</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-medium">
                Disponível para agendamento
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Espaço preparado para reuniões executivas e apresentações estratégicas, equipado com isolamento acústico e ligação de alta velocidade.
            </p>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300 py-3 border-y border-slate-800/80">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Capacidade: <strong>12 pessoas</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-indigo-400" />
                <span>Wi-Fi 1Gbps</span>
              </div>
              <div className="flex items-center gap-2">
                <Presentation className="w-4 h-4 text-indigo-400" />
                <span>Projetor 4K</span>
              </div>
            </div>
          </div>

          {/* Consulta de Disponibilidade (FE14) */}
          <div className="bg-[#0b0f19]/90 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Consulta de Disponibilidade</span>
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Consulte os intervalos livres para a data selecionada:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {HORARIOS_DIA.map((slot) => {
                const ocupado = horariosOcupados.includes(slot);
                const selecionado = horarioSelecionado === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={ocupado}
                    onClick={() => setHorarioSelecionado(slot)}
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                      ocupado
                        ? "bg-slate-900/40 border-slate-800/50 text-slate-600 line-through cursor-not-allowed"
                        : selecionado
                        ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30"
                        : "bg-[#111827]/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white"
                    }`}
                  >
                    {slot}
                    <div className="text-[10px] mt-1 font-normal opacity-75">
                      {ocupado ? "Ocupado" : "Disponível"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Formulário de Reserva (FE13) */}
        <div className="lg:col-span-5">
          <div className="bg-[#0b0f19]/90 border border-slate-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>Efetuar Reserva</span>
            </h2>

            {sucesso ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Reserva efetuada com sucesso! A redirecionar para as suas reservas...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmeterReserva} className="space-y-4">
                {erro && (
                  <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                {/* Campo Data */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Data da Reserva
                  </label>
                  <input
                    type="date"
                    value={dataSelecionada}
                    onChange={(e) => {
                      setDataSelecionada(e.target.value);
                      setHorarioSelecionado("");
                    }}
                    className="w-full bg-[#111827]/80 border border-slate-700/70 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                  />
                </div>

                {/* Campo Horário Selecionado */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Horário Selecionado
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={horarioSelecionado || "Clique num horário ao lado"}
                    className="w-full bg-[#111827]/40 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-indigo-300 font-medium focus:outline-none cursor-default"
                  />
                </div>

                {/* Motivo / Descrição */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Motivo / Título da Reunião
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <textarea
                      rows={3}
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Ex: Alinhamento semanal de sprint"
                      className="w-full bg-[#111827]/80 border border-slate-700/70 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Botão de Confirmação */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  Confirmar Agendamento
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}