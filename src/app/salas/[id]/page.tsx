"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  MapPin,
  FileText,
  ShieldCheck,
  Check,
  Loader2,
} from "lucide-react";

export default function SalaDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Estados do formulário de reserva
  const [data, setData] = useState("");
  const [inicio, setInicio] = useState("");
  const [termino, setTermino] = useState("");
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  function handleAgendar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSucesso(true);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      {/* Botão Voltar */}
      <Link
        href="/salas"
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao catálogo de salas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel Esquerdo: Galeria, Informações e Recursos */}
        <div className="lg:col-span-2 space-y-8">
          {/* Fotografia Principal da Sala */}
          <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
              alt="Sala de Reunião"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
              Disponível para Reserva
            </span>
          </div>

          {/* Dados Principais */}
          <div>
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
              Espaço Corporativo Premium • Sala #{id}
            </span>
            <h1 className="text-3xl font-extrabold text-white mt-1">
              Sala Executiva Aurora
            </h1>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Concebida especificamente para apresentações executivas, reuniões de conselho e dinâmicas estratégicas.
              Ambiente totalmente insonorizado com luz natural ajustável e integração direta com ferramentas de conferência.
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-indigo-400" />
                <span>Edifício Central — Piso 3 (Ala Norte)</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-400" />
                <span>Lotação: até 12 pessoas</span>
              </div>
            </div>
          </div>

          {/* Equipamento & Comodidades */}
          <div className="border-t border-slate-800/80 pt-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              Equipamento & Recursos Disponíveis
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                "Monitor Interativo 4K com suporte a HDMI/AirPlay",
                "Conexão Wi-Fi 6 dedicada de alta velocidade",
                "Ar condicionado inteligente com controlo digital",
                "Sistema de microfones omnidirecionais e videoconferência",
                "Quadro de escrita em vidro com marcadores",
                "Pontos de eletricidade e USB embutidos na mesa principal",
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Normas do Espaço */}
          <div className="border-t border-slate-800/80 pt-6">
            <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              Regras e Recomendações de Utilização
            </h2>
            <ul className="text-sm text-slate-400 space-y-2 list-disc list-inside">
              <li>Por favor, encerre a reunião 5 minutos antes do término para desocupação da sala.</li>
              <li>Mantenha as portas fechadas durante videoconferências para assegurar o isolamento acústico.</li>
              <li>Deixe os cabos e comandos organizados sobre o painel de suporte.</li>
            </ul>
          </div>
        </div>

        {/* Painel Direito: Formulário de Agendamento */}
        <div className="h-fit">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-md sticky top-24 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-1">
              Reservar este Espaço
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Escolha o dia e o intervalo pretendido para a reunião.
            </p>

            {sucesso ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-semibold text-emerald-300">
                  Reserva Confirmada com Sucesso!
                </h4>
                <p className="text-xs text-slate-400">
                  A confirmação e o resumo da sala foram associados ao seu utilizador.
                </p>
                <button
                  onClick={() => setSucesso(false)}
                  className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 underline"
                >
                  Agendar outra sessão
                </button>
              </div>
            ) : (
              <form onSubmit={handleAgendar} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Data da Reserva
                  </label>
                  <div className="relative">
                    <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="date"
                      required
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Hora Início
                    </label>
                    <div className="relative">
                      <Clock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="time"
                        required
                        value={inicio}
                        onChange={(e) => setInicio(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-2 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Hora Término
                    </label>
                    <div className="relative">
                      <Clock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="time"
                        required
                        value={termino}
                        onChange={(e) => setTermino(e.target.value)}
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-2 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Assunto / Finalidade da Reunião
                  </label>
                  <div className="relative">
                    <FileText className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                    <textarea
                      rows={2}
                      required
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      placeholder="Ex: Alinhamento trimestral da equipa de produto"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-600/20"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirmar Agendamento"
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