
"use client";

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  roomsService,
  reservationsService,
} from "@/services/endpoints";
import { apiError } from "@/services/api";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface SalaDetalhe {
  id: number | string;
  nome: string;
  descricao?: string;
  capacidade: number;
  localizacao?: string;
}

interface ReservaSala {
  id: number | string;
  roomId: number | string;
  startDate: string;
  endDate: string;
  status: string;
}

const HORARIOS_DIA = [
  "08:00 - 09:00",
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "12:00 - 13:00",
  "13:00 - 14:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
  "17:00 - 18:00",
  "18:00 - 19:00",
  "19:00 - 20:00",
  "20:00 - 21:00",
  "21:00 - 22:00"
];

function obterDataLocal(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

// Os horários são interpretados no fuso local do navegador.
const HORA_ABERTURA = "08:00";
const HORA_FECHAMENTO = "22:00";

function criarIntervalo(data: string, inicio: string, fim: string) {
  return {
    inicio: new Date(`${data}T${inicio}:00`),
    fim: new Date(`${data}T${fim}:00`),
  };
}

function intervaloOcupado(
  reservas: ReservaSala[],
  data: string,
  inicio: string,
  fim: string
): boolean {
  const intervalo = criarIntervalo(data, inicio, fim);

  return reservas.some((reserva) => {
    if (reserva.status?.toUpperCase() !== "CONFIRMADA") return false;
    const inicioReserva = new Date(reserva.startDate);
    const fimReserva = new Date(reserva.endDate);
    return intervalo.inicio < fimReserva && intervalo.fim > inicioReserva;
  });
}

function intervaloPassado(data: string, inicio: string): boolean {
  return new Date(`${data}T${inicio}:00`).getTime() <= Date.now();
}

function validarPeriodo(data: string, inicio: string, fim: string): string {
  if (!data || !inicio || !fim) return "Informe a data e os horários de início e fim.";
  if (inicio < HORA_ABERTURA || fim > HORA_FECHAMENTO) {
    return `Escolha um período entre ${HORA_ABERTURA} e ${HORA_FECHAMENTO}.`;
  }
  const intervalo = criarIntervalo(data, inicio, fim);
  if (Number.isNaN(intervalo.inicio.getTime()) || Number.isNaN(intervalo.fim.getTime())) {
    return "Informe horários válidos.";
  }
  if (intervalo.inicio >= intervalo.fim) return "O horário final deve ser posterior ao inicial.";
  if (intervaloPassado(data, inicio)) return "Não é possível reservar um horário passado.";
  return "";
}

export default function DetalhesSalaPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const salaId = String(params?.id ?? "");

  const [sala, setSala] = useState<SalaDetalhe | null>(null);
  const [carregandoSala, setCarregandoSala] = useState(true);

  const [dataSelecionada, setDataSelecionada] =
    useState(obterDataLocal);

  const [inicioEscolhido, setInicioEscolhido] = useState("");
  const [fimEscolhido, setFimEscolhido] = useState("");

  const [motivo, setMotivo] = useState("");

  const [reservas, setReservas] = useState<ReservaSala[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] =
    useState(true);
  const [erroHorarios, setErroHorarios] = useState("");

  const [submetendo, setSubmetendo] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let ativo = true;

    async function carregarSala() {
      try {
        const dados = await roomsService.get(salaId);

        if (!ativo) return;

        setSala(dados);
        setErro("");
      } catch (error) {
        if (!ativo) return;

        setErro(apiError(error));
        setSala(null);
      } finally {
        if (ativo) {
          setCarregandoSala(false);
        }
      }
    }

    void carregarSala();

    return () => {
      ativo = false;
    };
  }, [salaId]);

    const buscarReservas = useCallback(async () => {
    const dados = await roomsService.reservations(salaId);

    return dados.map((reserva) => ({
      id: reserva.id,
      roomId: reserva.roomId,
      startDate: reserva.startDate,
      endDate: reserva.endDate,
      status: reserva.status,
    }));
  }, [salaId]);

  useEffect(() => {
    let ativo = true;

    async function carregarHorarios() {
      setCarregandoHorarios(true);
      setErroHorarios("");
      setReservas([]);
      setInicioEscolhido("");
      setFimEscolhido("");

      try {
        const dados = await buscarReservas();

        if (!ativo) return;

        setReservas(dados);
      } catch (error) {
        if (!ativo) return;

        setErroHorarios(apiError(error));
      } finally {
        if (ativo) {
          setCarregandoHorarios(false);
        }
      }
    }

    if (salaId && dataSelecionada) {
      void carregarHorarios();
    }

    return () => {
      ativo = false;
    };
  }, [salaId, dataSelecionada, buscarReservas]);

  const handleSubmeterReserva = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      submetendo ||
      sucesso ||
      carregandoHorarios ||
      erroHorarios
    ) {
      return;
    }

    setErro("");

    if (isLoading) {
      setErro("Aguarde a identificação do usuário.");
      return;
    }

    const userId = Number(user?.id);
    const roomId = Number(salaId);

    if (!Number.isInteger(userId) || userId <= 0) {
      setErro(
        "Não foi possível identificar o ID do usuário autenticado."
      );
      return;
    }

    if (!Number.isInteger(roomId) || roomId <= 0) {
      setErro("ID da sala inválido.");
      return;
    }

    if (!sala) {
      setErro("Não foi possível identificar a sala.");
      return;
    }

    const erroPeriodo = validarPeriodo(dataSelecionada, inicioEscolhido, fimEscolhido);
    if (erroPeriodo) {
      setErro(erroPeriodo);
      return;
    }

    if (intervaloOcupado(reservas, dataSelecionada, inicioEscolhido, fimEscolhido)) {
      setErro("O período escolhido já possui uma reserva confirmada.");
      return;
    }

    const startDate = `${dataSelecionada}T${inicioEscolhido}:00`;
    const endDate = `${dataSelecionada}T${fimEscolhido}:00`;

    setSubmetendo(true);

    try {
      // Atualiza os dados para evitar uma seleção desatualizada.
      const reservasAtualizadas = await buscarReservas();
      setReservas(reservasAtualizadas);

      if (intervaloOcupado(reservasAtualizadas, dataSelecionada, inicioEscolhido, fimEscolhido)) {
        throw new Error("Este período acabou de ser reservado. Escolha outro.");
      }

      const disponibilidade = await roomsService.availability(
        roomId,
        {
          startDate,
          endDate,
        }
      );

      if (
        disponibilidade?.available === false ||
        disponibilidade?.disponivel === false
      ) {
        setInicioEscolhido("");
        setFimEscolhido("");
        throw new Error(
          "Sala indisponível neste horário."
        );
      }

      await reservationsService.create({
        userId,
        roomId,
        startDate,
        endDate,
      });

      setSucesso(true);

      router.push("/salas/minhas-reservas");
    } catch (error) {
      setErro(apiError(error));

      // Recarrega a ocupação após um possível conflito.
      try {
        const dados = await buscarReservas();
        setReservas(dados);
        setErroHorarios("");
      } catch (refreshError) {
        setErroHorarios(apiError(refreshError));
      }
    } finally {
      setSubmetendo(false);
    }
  };

  if (carregandoSala) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs">
          Carregando informações da sala...
        </p>
      </div>
    );
  }

  if (!sala) {
    return (
      <div className="space-y-6">
        <Link
          href="/salas"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para as salas
        </Link>

        <div className="p-6 rounded-2xl border border-destructive/20 bg-destructive/10 text-destructive text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{erro || "Sala não encontrada."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/salas"
        className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para as salas</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                  {sala.nome}
                </h1>

                {sala.localizacao && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sala.localizacao}
                  </p>
                )}
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                {sala.capacidade} pessoas
              </span>
            </div>

            {sala.descricao && (
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                {sala.descricao}
              </p>
            )}
          </div>

          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-card-foreground mb-1">
              Horários disponíveis
            </h2>

            <p className="text-xs text-muted-foreground mb-4">
              Os horários ocupados são identificados a partir
              das reservas confirmadas.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Disponível
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Ocupado
              </span>

              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                Encerrado
              </span>
            </div>

            {carregandoHorarios && (
              <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Consultando horários no banco...
              </div>
            )}

            {erroHorarios && (
              <div className="mb-4 p-3 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Não foi possível consultar a disponibilidade:
                    {" "}{erroHorarios}
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {HORARIOS_DIA.map((slot) => {
                const [inicioSlot, fimSlot] = slot.split(" - ");
                const ocupado = intervaloOcupado(reservas, dataSelecionada, inicioSlot, fimSlot);
                const passado = intervaloPassado(dataSelecionada, inicioSlot);
                const selecionado = inicioEscolhido === inicioSlot && fimEscolhido === fimSlot;

                const bloqueado =
                  ocupado ||
                  passado ||
                  carregandoHorarios ||
                  Boolean(erroHorarios) ||
                  submetendo ||
                  sucesso;

                let estilo =
                  "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20";

                if (ocupado) {
                  estilo =
                    "bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 cursor-not-allowed";
                } else if (passado) {
                  estilo =
                    "bg-muted border-border text-muted-foreground cursor-not-allowed";
                } else if (selecionado) {
                  estilo =
                    "bg-primary text-primary-foreground border-primary shadow-xs";
                }

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={bloqueado}
                    onClick={() => {
                      setInicioEscolhido(inicioSlot);
                      setFimEscolhido(fimSlot);
                      setErro("");
                    }}
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all ${estilo} disabled:cursor-not-allowed`}
                  >
                    <span className="block">{slot}</span>

                    <span className="block mt-1 text-[10px]">
                      {carregandoHorarios
                        ? "Consultando..."
                        : erroHorarios
                          ? "Indisponível"
                          : ocupado
                            ? "Ocupado"
                            : passado
                              ? "Encerrado"
                              : selecionado
                                ? "Selecionado"
                                : "Disponível"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs sticky top-24">
            <h2 className="text-base font-bold text-card-foreground mb-4">
              Confirmar reserva
            </h2>

            {sucesso ? (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  Reserva confirmada! Redirecionando...
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmeterReserva}
                className="space-y-4"
              >
                {erro && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="data-reserva"
                    className="block text-xs font-medium text-foreground mb-1.5"
                  >
                    Data da reserva
                  </label>

                  <input
                    id="data-reserva"
                    type="date"
                    required
                    min={obterDataLocal()}
                    value={dataSelecionada}
                    disabled={submetendo}
                    onChange={(e) => {
                      setDataSelecionada(e.target.value);
                      setInicioEscolhido("");
                      setFimEscolhido("");
                      setErro("");
                    }}
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-foreground">
                    Horário escolhido (você também pode digitar)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="inicio-reserva" className="block text-xs text-muted-foreground mb-1">Início</label>
                      <input
                        id="inicio-reserva"
                        type="time"
                        min={HORA_ABERTURA}
                        max={HORA_FECHAMENTO}
                        step={60}
                        required
                        value={inicioEscolhido}
                        disabled={submetendo}
                        onChange={(e) => { setInicioEscolhido(e.target.value); setErro(""); }}
                        className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                      />
                    </div>
                    <div>
                      <label htmlFor="fim-reserva" className="block text-xs text-muted-foreground mb-1">Fim</label>
                      <input
                        id="fim-reserva"
                        type="time"
                        min={HORA_ABERTURA}
                        max={HORA_FECHAMENTO}
                        step={60}
                        required
                        value={fimEscolhido}
                        disabled={submetendo}
                        onChange={(e) => { setFimEscolhido(e.target.value); setErro(""); }}
                        className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Escolha um botão de horário ou digite o início e o fim (ex.: 09:30 até 11:15).
                  </p>
                  {inicioEscolhido && fimEscolhido && !carregandoHorarios && !erroHorarios && (
                    <p className={`text-xs ${validarPeriodo(dataSelecionada, inicioEscolhido, fimEscolhido) || intervaloOcupado(reservas, dataSelecionada, inicioEscolhido, fimEscolhido) ? "text-destructive" : "text-emerald-600"}`}>
                      {validarPeriodo(dataSelecionada, inicioEscolhido, fimEscolhido) ||
                        (intervaloOcupado(reservas, dataSelecionada, inicioEscolhido, fimEscolhido)
                          ? "Esse período está ocupado."
                          : "Período disponível conforme as reservas carregadas.")}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="motivo-reserva"
                    className="block text-xs font-medium text-foreground mb-1.5"
                  >
                    Motivo da reunião
                  </label>

                  <textarea
                    id="motivo-reserva"
                    rows={3}
                    value={motivo}
                    disabled={submetendo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: Alinhamento semanal de squad"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    submetendo ||
                    isLoading ||
                    carregandoHorarios ||
                    Boolean(erroHorarios) ||
                    !inicioEscolhido ||
                    !fimEscolhido ||
                    Boolean(validarPeriodo(dataSelecionada, inicioEscolhido, fimEscolhido)) ||
                    intervaloOcupado(reservas, dataSelecionada, inicioEscolhido, fimEscolhido)
                  }
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 disabled:opacity-50 text-primary-foreground transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submetendo ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Agendando...</span>
                    </>
                  ) : (
                    <span>Confirmar Agendamento</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
