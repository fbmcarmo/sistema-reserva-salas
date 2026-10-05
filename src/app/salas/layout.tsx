"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, LogOut, Calendar, DoorOpen } from "lucide-react";

export default function SalasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isSalasAtivo = pathname === "/salas";
  const isReservasAtivo = pathname === "/salas/minhas-reservas";

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      {/* Cabeçalho Global */}
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/salas" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-indigo-400" />
            </div>
            <span className="font-semibold text-sm text-white tracking-tight">
              Reserva de Salas
            </span>
          </Link>

          {/* Links de navegação interna */}
          <nav className="hidden sm:flex items-center gap-1.5">
            <Link
              href="/salas"
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                isSalasAtivo
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 font-medium"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Explorar Salas</span>
            </Link>

            <Link
              href="/salas/minhas-reservas"
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                isReservasAtivo
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/30 font-medium"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Minhas Reservas</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs text-slate-400 hidden sm:inline">
              Olá, <strong className="text-white">{user.nome}</strong>
            </span>
          )}

          {/* Botão de Logout */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/20 border border-slate-800 hover:border-rose-900/40 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            title="Terminar Sessão"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      {/* Conteúdo dinâmico */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}