
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { roomsService, reservationsService } from "@/services/endpoints";
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

function obterDataLocal(): string {
  const agora = new Date();

  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function DetalhesSalaPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const salaId = String(params?.id ?? "");

  const [sala, setSala] = useState<SalaDetalhe | null>(null);
  const [carregandoSala, setCarregandoSala] = useState(true);

  const [dataSelecionada, setDataSelecionada] = useState(
    obterDataLocal
  );

  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [motivo, setMotivo] = useState("");

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

  const handleSubmeterReserva = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (submetendo || sucesso) return;

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

    if (!dataSelecionada) {
      setErro("Selecione uma data para a reserva.");
      return;
    }

    if (!horarioSelecionado) {
      setErro("Selecione um horário para agendar.");
      return;
    }

    if (dataSelecionada < obterDataLocal()) {
      setErro("Não é possível reservar uma data passada.");
      return;
    }

    const [inicio, fim] = horarioSelecionado.split(" - ");

    if (!inicio || !fim) {
      setErro("Horário selecionado inválido.");
      return;
    }

    const startDate = `${dataSelecionada}T${inicio}:00`;
    const endDate = `${dataSelecionada}T${fim}:00`;

    if (new Date(startDate).getTime() <= Date.now()) {
      setErro("Não é possível reservar um horário passado.");
      return;
    }

    setSubmetendo(true);

    try {
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

      setTimeout(() => {
        router.push("/salas/minhas-reservas");
      }, 1200);
    } catch (error) {
      setErro(apiError(error));
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
          <span>
            {erro || "Sala não encontrada."}
          </span>
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
              Clique para selecionar o intervalo da reunião:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {HORARIOS_DIA.map((slot) => {
                const selecionado =
                  horarioSelecionado === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={submetendo || sucesso}
                    onClick={() =>
                      setHorarioSelecionado(slot)
                    }
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer disabled:opacity-50 ${
                      selecionado
                        ? "bg-primary text-primary-foreground border-primary shadow-xs"
                        : "bg-background border-input text-foreground hover:bg-muted"
                    }`}
                  >
                    {slot}
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
                      setHorarioSelecionado("");
                    }}
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring cursor-pointer"
                  />
                </div>

                <div>
                  <label
                    htmlFor="horario-reserva"
                    className="block text-xs font-medium text-foreground mb-1.5"
                  >
                    Horário escolhido
                  </label>

                  <input
                    id="horario-reserva"
                    type="text"
                    readOnly
                    value={
                      horarioSelecionado ||
                      "Nenhum horário selecionado"
                    }
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-medium focus:outline-none cursor-default"
                  />
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
                    onChange={(e) =>
                      setMotivo(e.target.value)
                    }
                    placeholder="Ex: Alinhamento semanal de squad"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submetendo || isLoading}
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
