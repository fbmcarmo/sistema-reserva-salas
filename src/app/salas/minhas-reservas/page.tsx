"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  DoorOpen,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface Reserva {
  id: string;
  salaId: string | number;
  nomeSala: string;
  data: string;
  horario: string;
  motivo: string;
  status: "Confirmada" | "Cancelada";
  criadaEm: string;
}

// Reservas de exemplo iniciais caso o utilizador ainda não tenha gravado nenhuma
const RESERVAS_EXEMPLO: Reserva[] = [
  {
    id: "exemplo-1",
    salaId: "1",
    nomeSala: "Sala Inovação (Piso 2)",
    data: "2026-10-06",
    horario: "10:00 - 11:00",
    motivo: "Reunião de Planeamento de Sprint",
    status: "Confirmada",
    criadaEm: new Date().toISOString(),
  },
  {
    id: "exemplo-2",
    salaId: "2",
    nomeSala: "Sala Brainstorm (Piso 1)",
    data: "2026-10-08",
    horario: "15:00 - 16:00",
    motivo: "Apresentação de Design Review",
    status: "Confirmada",
    criadaEm: new Date().toISOString(),
  },
];

export default function MinhasReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaParaCancelar, setReservaParaCancelar] = useState<Reserva | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  // Carregar reservas do localStorage ou inicializar com exemplos
  useEffect(() => {
    const dadosSalvos = localStorage.getItem("minhas_reservas");
    if (dadosSalvos) {
      try {
        setReservas(JSON.parse(dadosSalvos));
      } catch {
        setReservas(RESERVAS_EXEMPLO);
      }
    } else {
      setReservas(RESERVAS_EXEMPLO);
      localStorage.setItem("minhas_reservas", JSON.stringify(RESERVAS_EXEMPLO));
    }
  }, []);

  // Executar o cancelamento da reserva (FE16)
  const confirmarCancelamento = () => {
    if (!reservaParaCancelar) return;

    const listaAtualizada: Reserva[] = reservas.map((r) =>
      r.id === reservaParaCancelar.id ? { ...r, status: "Cancelada" as const } : r
    );

    setReservas(listaAtualizada);
    localStorage.setItem("minhas_reservas", JSON.stringify(listaAtualizada));
    setReservaParaCancelar(null);
    setMensagemSucesso("Reserva cancelada com sucesso.");

    setTimeout(() => {
      setMensagemSucesso("");
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-indigo-400" />
            <span>Minhas Reservas</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Consulte a sua agenda de salas agendadas e faça a gestão dos seus horários.
          </p>
        </div>

        <Link
          href="/salas"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/30 w-fit cursor-pointer"
        >
          <span>Agendar Nova Sala</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Alerta de sucesso */}
      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs flex items-center gap-2.5 transition-all">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Lista de Reservas (FE15) */}
      {reservas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservas.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between bg-[#0b0f19]/90 border rounded-2xl p-5 transition-all ${
                item.status === "Cancelada"
                  ? "border-slate-800/50 opacity-60"
                  : "border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <DoorOpen className="w-4 h-4 text-indigo-400" />
                      <span>{item.nomeSala}</span>
                    </h2>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.motivo}</span>
                    </p>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                      item.status === "Confirmada"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 py-3 border-y border-slate-800/80 mb-4 bg-slate-900/40 rounded-xl px-3 mt-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.data}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.horario}</span>
                  </div>
                </div>
              </div>

              {/* Ação de Cancelamento (FE16) */}
              {item.status === "Confirmada" && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setReservaParaCancelar(item)}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancelar Reserva</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0b0f19]/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-white mb-1">
            Nenhuma reserva encontrada
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Ainda não efetuou nenhuma reserva de sala.
          </p>
          <Link
            href="/salas"
            className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
          >
            Explorar catálogo de salas
          </Link>
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento (FE16) */}
      {reservaParaCancelar && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-900/50">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-white">
                Cancelar Reserva
              </h2>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Tem a certeza de que pretende cancelar o agendamento da{" "}
              <strong className="text-white">{reservaParaCancelar.nomeSala}</strong> para o dia{" "}
              <strong className="text-white">{reservaParaCancelar.data}</strong> ({reservaParaCancelar.horario})?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setReservaParaCancelar(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={confirmarCancelamento}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-all shadow-md shadow-rose-600/30 cursor-pointer"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}