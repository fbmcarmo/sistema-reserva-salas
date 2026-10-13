"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { reservationsService, roomsService, usersService } from "@/services/endpoints";
import { apiError } from "@/services/api";
import type { Reserva, Sala, Usuario } from "@/types";
import {
  Calendar, Clock, DoorOpen, User, Search, XCircle,
  AlertTriangle, ArrowRight, CheckCircle2, AlertCircle,
  RefreshCw, Loader2,
} from "lucide-react";

type ReservaComStatus = Reserva & { status?: string | null };
type UsuarioComNome = Usuario & { name?: string; nome?: string };

const formatarData = (valor?: string): string => {
  if (!valor) return "Data não informada";
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "Data inválida"
    : data.toLocaleDateString("pt-BR", { timeZone: "America/Fortaleza" });
};

const formatarHora = (valor?: string): string => {
  if (!valor) return "--:--";
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "--:--"
    : data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Fortaleza",
      });
};

export default function TodasReservasPage() {
  const [reservas, setReservas] = useState<ReservaComStatus[]>([]);
  const [salas, setSalas] = useState<Sala[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioComNome[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [aviso, setAviso] = useState("");
  const [busca, setBusca] = useState("");
  const [filtroSala, setFiltroSala] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");
  const [reservaParaCancelar, setReservaParaCancelar] = useState<ReservaComStatus | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const carregarReservas = useCallback(async () => {
    setCarregando(true);
    setErroApi("");
    setAviso("");
    try {
      const resultado = await Promise.allSettled([
        reservationsService.list(),
        roomsService.list(),
        usersService.list(),
      ]);

      const [reservasResultado, salasResultado, usuariosResultado] = resultado;
      if (reservasResultado.status === "rejected") {
        throw reservasResultado.reason;
      }
      setReservas(reservasResultado.value);

      if (salasResultado.status === "fulfilled") {
        setSalas(salasResultado.value);
      } else {
        setSalas([]);
      }
      if (usuariosResultado.status === "fulfilled") {
        setUsuarios(usuariosResultado.value);
      } else {
        setUsuarios([]);
      }

      if (salasResultado.status === "rejected" || usuariosResultado.status === "rejected") {
        setAviso("Alguns nomes não puderam ser carregados. Verifique suas permissões para consultar salas e usuários.");
      }
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

  const nomesSalas = useMemo(
    () => new Map(salas.map((sala) => [String(sala.id), sala.nome])),
    [salas]
  );
  const nomesUsuarios = useMemo(
    () => new Map(usuarios.map((usuario) => [
      String(usuario.id),
      usuario.name?.trim() || usuario.nome?.trim() || `Usuário ${usuario.id}`,
    ])),
    [usuarios]
  );

  const obterNomeSala = (reserva: Reserva): string =>
    nomesSalas.get(String(reserva.roomId)) || `Sala ${reserva.roomId ?? "não identificada"}`;

  const obterNomeUsuario = (reserva: Reserva): string =>
    nomesUsuarios.get(String(reserva.userId)) || `Usuário ${reserva.userId ?? "não identificado"}`;

  const obterStatus = (reserva: ReservaComStatus): string =>
    reserva.status?.trim() || "Não informado";

  const reservasFiltradas = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return reservas.filter((reserva) => {
      const nomeSala = obterNomeSala(reserva);
      const nomeUsuario = obterNomeUsuario(reserva);
      const status = obterStatus(reserva);
      const correspondeBusca =
        nomeSala.toLocaleLowerCase("pt-BR").includes(termo) ||
        nomeUsuario.toLocaleLowerCase("pt-BR").includes(termo) ||
        String(reserva.id).includes(termo);
      const correspondeSala = filtroSala === "Todas" || String(reserva.roomId) === filtroSala;
      const correspondeStatus = filtroStatus === "Todos" || status.toLowerCase() === filtroStatus.toLowerCase();
      return correspondeBusca && correspondeSala && correspondeStatus;
    });
  }, [reservas, nomesSalas, nomesUsuarios, busca, filtroSala, filtroStatus]);

  const statusDisponiveis = useMemo(
    () => [...new Set(reservas.map(obterStatus))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [reservas]
  );

  const confirmarCancelamento = async () => {
    if (!reservaParaCancelar) return;
    setCancelando(true);
    setErroApi("");
    try {
      await reservationsService.remove(reservaParaCancelar.id);
      setMensagemSucesso("Reserva cancelada com sucesso.");
      setReservaParaCancelar(null);
      await carregarReservas();
    } catch (error) {
      setErroApi(apiError(error));
    } finally {
      setCancelando(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Todas reservas</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Visão geral de todos os agendamentos realizados na organização.
          </p>
        </div>
        <Link href="/salas" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs w-fit cursor-pointer">
          <span>Nova reserva</span><ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" /><span>{mensagemSucesso}</span>
        </div>
      )}
      {aviso && (
        <div className="p-3.5 rounded-xl bg-muted border border-border text-muted-foreground text-xs">{aviso}</div>
      )}
      {erroApi && reservas.length > 0 && (
        <div role="alert" className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">{erroApi}</div>
      )}

      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text" value={busca} onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por sala, colaborador ou ID..."
              className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            />
          </div>
          <div className="md:col-span-3">
            <select value={filtroSala} onChange={(event) => setFiltroSala(event.target.value)} className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all cursor-pointer">
              <option value="Todas">Todas as salas</option>
              {salas.map((sala) => (
                <option key={sala.id} value={String(sala.id)}>{sala.nome}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3">
            <select value={filtroStatus} onChange={(event) => setFiltroStatus(event.target.value)} className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all cursor-pointer">
              <option value="Todos">Todos os estados</option>
              {statusDisponiveis.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {carregando ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs">A carregar agendamentos...</p>
        </div>
      ) : erroApi && reservas.length === 0 ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">Falha ao carregar reservas</h3>
          <p className="text-xs text-muted-foreground">{erroApi}</p>
          <button type="button" onClick={() => void carregarReservas()} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground cursor-pointer">
            <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
          </button>
        </div>
      ) : reservasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservasFiltradas.map((reserva) => {
            const nomeSala = obterNomeSala(reserva);
            const nomeUsuario = obterNomeUsuario(reserva);
            const status = obterStatus(reserva);
            const estaCancelada = status.toLowerCase() === "cancelada" || status.toLowerCase() === "cancelado";
            return (
              <div key={reserva.id} className={`flex flex-col justify-between rounded-2xl p-5 transition-all border ${estaCancelada ? "bg-card/60 border-border/60 opacity-65" : "bg-card border-border hover:border-ring/40 shadow-xs hover:shadow-md"}`}>
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h2 className="text-base font-semibold text-card-foreground flex items-center gap-2">
                        <DoorOpen className="w-4 h-4 text-primary" /><span>{nomeSala}</span>
                      </h2>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <User className="w-3.5 h-3.5 text-primary" /><span>{nomeUsuario}</span>
                        </span>
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${estaCancelada ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"}`}>
                      {status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-foreground py-2.5 border-y border-border/70 mb-4 bg-muted/40 rounded-xl px-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium">{formatarData(reserva.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium">{formatarHora(reserva.startDate)} - {formatarHora(reserva.endDate)}</span>
                    </div>
                  </div>
                </div>
                {!estaCancelada && (
                  <div className="pt-2 flex justify-end">
                    <button type="button" onClick={() => setReservaParaCancelar(reserva)} className="inline-flex items-center gap-1.5 text-xs text-destructive hover:bg-destructive/15 bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium">
                      <XCircle className="w-3.5 h-3.5" /> Cancelar Reserva
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
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Não existem agendamentos que correspondam aos filtros de pesquisa.
          </p>
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
              Confirma o cancelamento da reserva de <strong className="text-foreground">{obterNomeUsuario(reservaParaCancelar)}</strong> para a sala <strong className="text-foreground">{obterNomeSala(reservaParaCancelar)}</strong> no dia <strong className="text-foreground">{formatarData(reservaParaCancelar.startDate)}</strong>?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button type="button" disabled={cancelando} onClick={() => setReservaParaCancelar(null)} className="px-4 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 border border-border transition-all cursor-pointer disabled:opacity-50">
                Voltar
              </button>
              <button type="button" disabled={cancelando} onClick={() => void confirmarCancelamento()} className="px-4 py-2 rounded-xl text-xs font-semibold text-destructive-foreground bg-destructive hover:opacity-90 disabled:opacity-50 transition-all shadow-xs flex items-center gap-2 cursor-pointer">
                {cancelando ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A cancelar...</> : "Confirmar Cancelamento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
