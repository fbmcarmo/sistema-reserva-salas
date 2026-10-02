"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, LogOut, User } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/salas" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="font-bold text-slate-100 tracking-tight text-lg">
            Suite Seeker
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline font-medium">
              {user?.nome || "Utilizador"}
            </span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-950/30 border border-slate-800 hover:border-red-900/50 px-3 py-1.5 rounded-lg transition-all"
            title="Terminar Sessão"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}