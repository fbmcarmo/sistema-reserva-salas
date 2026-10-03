"use client";

import { use } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Users, Calendar, Clock, CheckCircle2, MapPin } from "lucide-react";

export default function SalaDetalhesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/salas"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para listagem
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda: Detalhes e Foto */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-72 w-full rounded-2xl overflow-hidden bg-slate-800 border border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
                alt="Sala"
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Disponível
                </span>
                <span className="text-xs text-slate-400">ID da Sala: {id}</span>
              </div>
              <h1 className="text-3xl font-bold text-white mt-2">
                Sala Executiva Aurora
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400 mt-2">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  Piso 3 — Ala Norte
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-500" />
                  Até 12 pessoas
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-lg font-semibold text-white mb-3">
                Recursos incluídos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["TV 4K com HDMI", "Wi-Fi 6 de alta velocidade", "Ar Condicionado", "Sistema de Videoconferência", "Quadro de Vidro"].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna da Direita: Card de Reserva */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 h-fit backdrop-blur-md">
            <h2 className="text-lg font-bold text-white mb-4">Agendar Reserva</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Data
                </label>
                <div className="relative">
                  <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="date"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Início
                  </label>
                  <div className="relative">
                    <Clock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="time"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-2 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Término
                  </label>
                  <div className="relative">
                    <Clock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="time"
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-2 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-lg shadow-indigo-600/20"
              >
                Confirmar Reserva
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}