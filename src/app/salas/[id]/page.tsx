"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/services/api";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface SalaDetalhe {
  id: number | string;
  nome: string;
  descricao?: string;
  capacidade: number;
  localizacao?: string;
}

const SALAS_MOCK: Record<string, SalaDetalhe> = {
  "1": {
    id: 1,
    nome: "Sala Atlântico",
    capacidade: 8,
    localizacao: "1º andar",
    descricao: "TV e quadro branco",
  },
  "2": {
    id: 2,
    nome: "Sala Sertão",
    capacidade: 4,
    localizacao: "2º andar",
    descricao: "Ideal para reuniões rápidas",
  },
  "3": {
    id: 3,
    nome: "Auditório",
    capacidade: 40,
    localizacao: "Térreo",
    descricao: "Projetor e som",
  },
};

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

export default function DetalhesSalaPage() {
  const params = useParams();
  const router = useRouter();
  const salaId = String(params?.id || "1");

  const [sala, setSala] = useState<SalaDetalhe | null>(null);
  const [carregandoSala, setCarregandoSala] = useState(true);

  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
  const [motivo, setMotivo] = useState("");
  const [submetendo, setSubmetendo] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarSala() {
      try {
        setCarregandoSala(true);
        const response = await api.get(`/salas/${salaId}`);
        setSala(response.data);
      } catch {
        // Fallback para salas do Lovable
        setSala(SALAS_MOCK[salaId] || {
          id: salaId,
          nome: `Sala ${salaId}`,
          capacidade: 6,
          localizacao: "Andar Corporativo",
          descricao: "Espaço equipado para reuniões",
        });
      } finally {
        setCarregandoSala(false);
      }
    }

    carregarSala();
  }, [salaId]);

  const handleSubmeterReserva = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!horarioSelecionado) {
      setErro("Selecione um horário para agendar.");
      return;
    }

    setSubmetendo(true);

    try {
      await api.post("/reservas", {
        salaId: Number(salaId) || salaId,
        data: dataSelecionada,
        horario: horarioSelecionado,
        motivo: motivo.trim() || "Reunião de Alinhamento",
      });

      setSucesso(true);
      setTimeout(() => router.push("/salas/minhas-reservas"), 1200);
    } catch {
      // Fallback offline: adiciona a nova reserva no localStorage
      const nova = {
        id: Date.now(),
        sala_id: salaId,
        nomeSala: sala?.nome || `Sala ${salaId}`,
        data: dataSelecionada,
        horario: horarioSelecionado,
        motivo: motivo.trim() || "Reunião",
        status: "Confirmada",
      };

      const salvas = localStorage.getItem("minhas_reservas");
      const lista = salvas ? JSON.parse(salvas) : [];
      localStorage.setItem("minhas_reservas", JSON.stringify([nova, ...lista]));

      setSucesso(true);
      setTimeout(() => router.push("/salas/minhas-reservas"), 1200);
    } finally {
      setSubmetendo(false);
    }
  };

  if (carregandoSala) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-xs">Carregando informações da sala...</p>
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
        {/* Informações da Sala e Grade de Horários */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-card-foreground">
                  {sala?.nome}
                </h1>
                {sala?.localizacao && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {sala.localizacao}
                  </p>
                )}
              </div>

              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                {sala?.capacidade} pessoas
              </span>
            </div>

            {sala?.descricao && (
              <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
                {sala.descricao}
              </p>
            )}
          </div>

          {/* Seleção de Horários */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold text-card-foreground mb-1">
              Horários disponíveis
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Clique para selecionar o intervalo da reunião:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {HORARIOS_DIA.map((slot) => {
                const selecionado = horarioSelecionado === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setHorarioSelecionado(slot)}
                    className={`p-3 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
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

        {/* Card de Agendamento */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-xs sticky top-24">
            <h2 className="text-base font-bold text-card-foreground mb-4">
              Confirmar reserva
            </h2>

            {sucesso ? (
              <div className="p-4 rounded-xl bg-success/10 border border-success/20 text-success text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span>Reserva confirmada! Redirecionando...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmeterReserva} className="space-y-4">
                {erro && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{erro}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Data da reserva
                  </label>
                  <input
                    type="date"
                    required
                    value={dataSelecionada}
                    onChange={(e) => {
                      setDataSelecionada(e.target.value);
                      setHorarioSelecionado("");
                    }}
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Horário escolhido
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={horarioSelecionado || "Nenhum horário selecionado"}
                    className="w-full bg-muted/50 border border-border rounded-xl px-3.5 py-2.5 text-xs text-foreground font-medium focus:outline-none cursor-default"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">
                    Motivo da reunião
                  </label>
                  <textarea
                    rows={3}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ex: Alinhamento semanal de squad"
                    className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submetendo}
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