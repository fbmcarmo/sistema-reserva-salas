"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { reservationsService, roomsService } from "@/services/endpoints";
import { apiError } from "@/services/api";
import type { Reserva, Sala } from "@/types";
import {
  Calendar, Clock, DoorOpen, XCircle, AlertTriangle, ArrowRight,
  CheckCircle2, AlertCircle, RefreshCw, Loader2,
} from "lucide-react";

// A API utiliza datas ISO. A exibição usa o fuso do navegador.
function formatarData(data: string | undefined): string {
  if (!data) return "Data não informada";
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return "Data inválida";
  return valor.toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
}

function formatarHora(data: string | undefined): string {
  if (!data) return "--:--";
  const valor = new Date(data);
  if (Number.isNaN(valor.getTime())) return "--:--";
  return valor.toLocaleTimeString("pt-BR", {
    hour: "2-digit", minute: "2-digit",
  });
}

// A interface Reserva fornecida não inclui status; o backend pode enviá-lo.
type ReservaComStatus = Reserva & { status?: string };

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
  const [reservas, setReservas] = useState<ReservaComStatus[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [reservaParaCancelar, setReservaParaCancelar] = useState<ReservaComStatus | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const carregarReservas = useCallback(async () => {
    setCarregando(true);
    setErroApi("");
    try {
      const [resultadoReservas, resultadoSalas] = await Promise.all([
        reservationsService.my(),
        roomsService.list(),
      ]);
      setReservas(resultadoReservas);
      setSalas(resultadoSalas);
    } catch (error) {
      setErroApi(apiError(error));
      setReservas([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarReservas();
  }, [carregarReservas]);

  const confirmarCancelamento = async () => {
    if (!reservaParaCancelar) return;
    setCancelando(true);
    setErroApi("");
    try {
      await reservationsService.remove(reservaParaCancelar.id);
      setReservaParaCancelar(null);
      await carregarReservas();
      setMensagemSucesso("Reserva cancelada com sucesso.");
    } catch (error) {
      setErroApi(apiError(error));
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="space-y-6">
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
        <Link href="/salas" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs w-fit cursor-pointer">
          <span>Agendar Nova Sala</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {erroApi && !carregando && (
        <div role="alert" className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{erroApi}</span>
        </div>
      )}

      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <ReservationSkeleton key={i} />)}
        </div>
      ) : erroApi && reservas.length === 0 ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">Falha ao Carregar Reservas</h3>
          <button type="button" onClick={() => void carregarReservas()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Tentar Novamente
          </button>
        </div>
      ) : reservas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservas.map((item) => {
            const sala = salas.find((s) => String(s.id) === String(item.roomId));
            const nomeSala = sala?.nome || (item.roomId != null ? `Sala ${item.roomId}` : "Sala não identificada");
            const status = item.status || "Confirmada";
            const estaCancelada = status.toLowerCase() === "cancelada";

            return (
              <div key={item.id} className={`flex flex-col justify-between rounded-2xl p-5 transition-all border ${estaCancelada ? "bg-card/60 border-border/60 opacity-65" : "bg-card border-border hover:border-ring/40 shadow-xs hover:shadow-md"}`}>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                        <DoorOpen className="w-4 h-4 text-primary" />
                        <span>{nomeSala}</span>
                      </h2>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${estaCancelada ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"}`}>
                      {status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-foreground py-2.5 border-y border-border/70 mb-4 bg-muted/40 rounded-xl px-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium">{formatarData(item.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="font-medium">{formatarHora(item.startDate)} - {formatarHora(item.endDate)}</span>
                    </div>
                  </div>
                </div>
                {!estaCancelada && (
                  <div className="pt-2 flex justify-end">
                    <button type="button" onClick={() => setReservaParaCancelar(item)} className="inline-flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/15 bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium">
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
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-foreground mb-1">Nenhuma reserva encontrada</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mb-4">Ainda não efetuou nenhuma reserva de sala na sua conta.</p>
          <Link href="/salas" className="text-xs text-primary hover:opacity-80 underline underline-offset-4 font-medium">Explorar catálogo de salas</Link>
        </div>
      )}

      {reservaParaCancelar && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="titulo-cancelamento" className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl text-card-foreground">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 id="titulo-cancelamento" className="text-base font-semibold text-foreground">Cancelar Reserva</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Confirma o cancelamento do agendamento para o dia{" "}
              <strong className="text-foreground">{formatarData(reservaParaCancelar.startDate)}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" disabled={cancelando} onClick={() => setReservaParaCancelar(null)} className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer disabled:opacity-50">Voltar</button>
              <button type="button" disabled={cancelando} onClick={() => void confirmarCancelamento()} className="px-4 py-2 rounded-xl text-xs font-semibold text-destructive-foreground bg-destructive hover:opacity-90 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                {cancelando ? (<><Loader2 className="w-3.5 h-3.5 animate-spin" /><span>A cancelar...</span></>) : <span>Confirmar Cancelamento</span>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
