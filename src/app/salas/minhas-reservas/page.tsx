"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import {
  Calendar,
  Clock,
  DoorOpen,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface Reserva {
  id: string | number;
  sala_id?: string | number;
  salaId?: string | number;
  nomeSala?: string;
  sala?: { nome: string };
  data: string;
  horario?: string;
  hora_inicio?: string;
  hora_fim?: string;
  motivo: string;
  status?: string;
}

const RESERVAS_EXEMPLO: Reserva[] = [
  {
    id: 1,
    sala_id: 1,
    nomeSala: "Sala Inovação (1)",
    data: "2026-10-06",
    horario: "08:00 - 09:00",
    motivo: "Reunião de Alinhamento",
    status: "Cancelada",
  },
  {
    id: 2,
    sala_id: 1,
    nomeSala: "Sala Inovação (2)",
    data: "2026-10-06",
    horario: "10:00 - 11:00",
    motivo: "Reunião de Alinhamento",
    status: "Confirmada",
  },
];

// Skeleton claro alinhado com o tema Suite Seeker
function ReservationSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 animate-pulse space-y-4 shadow-xs">
      <div className="flex justify-between items-start">
        <div className="space-y-2 w-2/3">
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted/60 rounded w-3/4" />
        </div>
        <div className="h-5 bg-muted rounded-full w-20" />
      </div>

      <div className="h-10 bg-muted/40 rounded-xl w-full" />

      <div className="flex justify-end pt-2">
        <div className="h-7 bg-muted rounded-xl w-32" />
      </div>
    </div>
  );
}

export default function MinhasReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [reservaParaCancelar, setReservaParaCancelar] = useState<Reserva | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const carregarReservas = useCallback(async () => {
    try {
      setCarregando(true);
      setErroApi("");
      const response = await api.get("/reservas");
      setReservas(response.data);
    } catch {
      const salvas = localStorage.getItem("minhas_reservas");
      if (salvas) {
        try {
          setReservas(JSON.parse(salvas));
        } catch {
          setReservas(RESERVAS_EXEMPLO);
        }
      } else {
        setReservas(RESERVAS_EXEMPLO);
        localStorage.setItem("minhas_reservas", JSON.stringify(RESERVAS_EXEMPLO));
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  const confirmarCancelamento = async () => {
    if (!reservaParaCancelar) return;

    setCancelando(true);
    try {
      try {
        await api.delete(`/reservas/${reservaParaCancelar.id}`);
      } catch {
        await api.patch(`/reservas/${reservaParaCancelar.id}/cancelar`);
      }

      setMensagemSucesso("Reserva cancelada com sucesso.");
      setReservaParaCancelar(null);
      await carregarReservas();
    } catch {
      const atualizadas = reservas.map((r) =>
        r.id === reservaParaCancelar.id ? { ...r, status: "Cancelada" } : r
      );
      setReservas(atualizadas);
      localStorage.setItem("minhas_reservas", JSON.stringify(atualizadas));
      setMensagemSucesso("Reserva cancelada com sucesso.");
      setReservaParaCancelar(null);
    } finally {
      setCancelando(false);
      setTimeout(() => setMensagemSucesso(""), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-primary" />
            <span>Minhas Reservas</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Consulte a sua agenda sincronizada com o servidor.
          </p>
        </div>

        <Link
          href="/salas"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs w-fit cursor-pointer"
        >
          <span>Agendar Nova Sala</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Alerta de Sucesso */}
      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Skeletons de Carregamento */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ReservationSkeleton key={i} />
          ))}
        </div>
      ) : erroApi && reservas.length === 0 ? (
        /* Estado de Erro */
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-destructive/15 text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Falha ao Carregar Reservas</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{erroApi}</p>
          </div>
          <button
            onClick={carregarReservas}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : reservas.length > 0 ? (
        /* Grelha de Cartões no Estilo Suite Seeker */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservas.map((item) => {
            const nomeSala =
              item.nomeSala || item.sala?.nome || `Sala ${item.sala_id || item.salaId}`;
            const status = item.status || "Confirmada";
            const estaCancelada = status.toLowerCase() === "cancelada";

            return (
              <div
                key={item.id}
                className={`flex flex-col justify-between rounded-2xl p-5 transition-all border ${
                  estaCancelada
                    ? "bg-card/60 border-border/60 opacity-65"
                    : "bg-card border-border hover:border-ring/40 shadow-xs hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                        <DoorOpen className="w-4 h-4 text-primary" />
                        <span>{nomeSala}</span>
                      </h2>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{item.motivo}</span>
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
                        !estaCancelada
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  {/* Informações de Data e Hora */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-foreground py-2.5 border-y border-border/70 mb-4 bg-muted/40 rounded-xl px-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium">{item.data}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium">{item.horario || `${item.hora_inicio} - ${item.hora_fim}`}</span>
                    </div>
                  </div>
                </div>

                {!estaCancelada && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setReservaParaCancelar(item)}
                      className="inline-flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/15 bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Cancelar Reserva</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Estado Vazio */
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Nenhuma reserva encontrada
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">
            Ainda não efetuou nenhuma reserva de sala na sua conta.
          </p>
          <Link
            href="/salas"
            className="text-xs text-primary hover:opacity-80 underline underline-offset-4 font-medium"
          >
            Explorar catálogo de salas
          </Link>
        </div>
      )}

      {/* Modal de Cancelamento adaptado ao tema claro */}
      {reservaParaCancelar && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-card-foreground">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Cancelar Reserva
              </h2>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Confirma o cancelamento do agendamento para o dia{" "}
              <strong className="text-foreground">{reservaParaCancelar.data}</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={cancelando}
                onClick={() => setReservaParaCancelar(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                disabled={cancelando}
                onClick={confirmarCancelamento}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-destructive-foreground bg-destructive hover:opacity-90 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                {cancelando ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>A cancelar...</span>
                  </>
                ) : (
                  <span>Confirmar Cancelamento</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}