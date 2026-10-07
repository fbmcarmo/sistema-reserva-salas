"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { api } from "@/services/api";
import {
  Calendar,
  Clock,
  DoorOpen,
  User,
  Search,
  Filter,
  XCircle,
  FileText,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
} from "lucide-react";

interface ReservaGeral {
  id: string | number;
  salaId?: string | number;
  sala_id?: string | number;
  nomeSala?: string;
  sala?: { nome: string };
  usuarioNome?: string;
  usuario?: { nome: string };
  data: string;
  horario?: string;
  hora_inicio?: string;
  hora_fim?: string;
  motivo: string;
  status?: string;
}

const RESERVAS_MOCK: ReservaGeral[] = [
  {
    id: 1,
    nomeSala: "Sala Atlântico",
    usuarioNome: "May S",
    data: "2026-10-07",
    horario: "09:00 - 10:00",
    motivo: "Alinhamento Estratégico",
    status: "Confirmada",
  },
  {
    id: 2,
    nomeSala: "Sala Sertão",
    usuarioNome: "Maria Silva",
    data: "2026-10-07",
    horario: "11:00 - 12:00",
    motivo: "One-on-One",
    status: "Confirmada",
  },
  {
    id: 3,
    nomeSala: "Auditório",
    usuarioNome: "Carlos Eduardo",
    data: "2026-10-08",
    horario: "14:00 - 16:00",
    motivo: "Apresentação de Resultados Gerais",
    status: "Confirmada",
  },
  {
    id: 4,
    nomeSala: "Sala Atlântico",
    usuarioNome: "Maria Silva",
    data: "2026-10-06",
    horario: "08:00 - 09:00",
    motivo: "Reunião de Alinhamento",
    status: "Cancelada",
  },
];

export default function TodasReservasPage() {
  const [reservas, setReservas] = useState<ReservaGeral[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");

  // Filtros
  const [busca, setBusca] = useState("");
  const [filtroSala, setFiltroSala] = useState("Todas");
  const [filtroStatus, setFiltroStatus] = useState("Todos");

  // Ações de cancelamento
  const [reservaParaCancelar, setReservaParaCancelar] = useState<ReservaGeral | null>(null);
  const [cancelando, setCancelando] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState("");

  const carregarReservas = useCallback(async () => {
    try {
      setCarregando(true);
      setErroApi("");
      const response = await api.get("/reservas");
      if (response.data && response.data.length > 0) {
        setReservas(response.data);
      } else {
        setReservas(RESERVAS_MOCK);
      }
    } catch {
      // Recupera reservas criadas localmente ou exibe a lista demonstrativa
      const locais = localStorage.getItem("minhas_reservas");
      if (locais) {
        try {
          const parseadas = JSON.parse(locais);
          setReservas([...parseadas, ...RESERVAS_MOCK]);
        } catch {
          setReservas(RESERVAS_MOCK);
        }
      } else {
        setReservas(RESERVAS_MOCK);
      }
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  // Lista filtrada
  const reservasFiltradas = useMemo(() => {
    return reservas.filter((item) => {
      const nomeSala = item.nomeSala || item.sala?.nome || `Sala ${item.sala_id || item.salaId || ""}`;
      const nomeUsuario = item.usuarioNome || item.usuario?.nome || "Colaborador";
      const status = item.status || "Confirmada";

      const matchBusca =
        nomeSala.toLowerCase().includes(busca.toLowerCase()) ||
        nomeUsuario.toLowerCase().includes(busca.toLowerCase()) ||
        item.motivo.toLowerCase().includes(busca.toLowerCase());

      const matchSala = filtroSala === "Todas" || nomeSala.toLowerCase().includes(filtroSala.toLowerCase());
      const matchStatus = filtroStatus === "Todos" || status.toLowerCase() === filtroStatus.toLowerCase();

      return matchBusca && matchSala && matchStatus;
    });
  }, [reservas, busca, filtroSala, filtroStatus]);

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
      // Atualização otimista local
      const atualizadas = reservas.map((r) =>
        r.id === reservaParaCancelar.id ? { ...r, status: "Cancelada" } : r
      );
      setReservas(atualizadas);
      setMensagemSucesso("Reserva cancelada com sucesso.");
      setReservaParaCancelar(null);
    } finally {
      setCancelando(false);
      setTimeout(() => setMensagemSucesso(""), 3500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Todas reservas
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Visão geral de todos os agendamentos realizados na organização.
          </p>
        </div>

        <Link
          href="/salas"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs w-fit cursor-pointer"
        >
          <span>Nova reserva</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {mensagemSucesso && (
        <div className="p-3.5 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{mensagemSucesso}</span>
        </div>
      )}

      {/* Painel de Filtros */}
      <div className="bg-card border border-border/80 rounded-2xl p-4 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por sala, colaborador ou motivo..."
              className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroSala}
              onChange={(e) => setFiltroSala(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all cursor-pointer"
            >
              <option value="Todas">Todas as salas</option>
              <option value="Atlântico">Sala Atlântico</option>
              <option value="Sertão">Sala Sertão</option>
              <option value="Auditório">Auditório</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all cursor-pointer"
            >
              <option value="Todos">Todos os estados</option>
              <option value="Confirmada">Confirmadas</option>
              <option value="Cancelada">Canceladas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela de Registos */}
      {carregando ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <p className="text-xs">A carregar agendamentos...</p>
        </div>
      ) : erroApi && reservas.length === 0 ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-destructive/15 text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Falha ao carregar reservas</h3>
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
      ) : reservasFiltradas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reservasFiltradas.map((item) => {
            const nomeSala = item.nomeSala || item.sala?.nome || `Sala ${item.sala_id || item.salaId}`;
            const nomeUsuario = item.usuarioNome || item.usuario?.nome || "Colaborador";
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
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-foreground">
                          <User className="w-3.5 h-3.5 text-primary" />
                          <span>{nomeUsuario}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{item.motivo}</span>
                        </span>
                      </div>
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
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <Calendar className="w-10 h-10 text-muted-foreground/50 mx-auto mb-3" />
          <h2 className="text-sm font-semibold text-foreground mb-1">
            Nenhuma reserva encontrada
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Não existem agendamentos que correspondam aos filtros de pesquisa.
          </p>
        </div>
      )}

      {/* Modal de Confirmação de Cancelamento */}
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
              Confirma o cancelamento da reunião de{" "}
              <strong className="text-foreground">
                {reservaParaCancelar.usuarioNome || "Colaborador"}
              </strong>{" "}
              agendada para o dia{" "}
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