"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Building2, LogOut } from "lucide-react";

export default function SalasLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col">
      {/* Cabeçalho Global */}
      <header className="border-b border-slate-800/80 bg-[#0b0f19]/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <span className="font-semibold text-sm text-white tracking-tight">
            Reserva de Salas
          </span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs text-slate-400 hidden sm:inline">
              Olá, <strong className="text-white">{user.nome}</strong>
            </span>
          )}

          {/* Botão de Terminar Sessão (FE08) */}
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

      {/* Conteúdo da página */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}