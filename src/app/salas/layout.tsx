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
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-40 px-6 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-6">
          <Link href="/salas" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-foreground leading-none">
                Reserva de Salas
              </span>
              <span className="text-[10px] text-muted-foreground mt-0.5">
                Reserva de Salas
              </span>
            </div>
          </Link>

          <nav className="hidden sm:flex items-center gap-1.5 ml-2">
            <Link
              href="/salas"
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                isSalasAtivo
                  ? "bg-primary text-primary-foreground font-medium shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <DoorOpen className="w-3.5 h-3.5" />
              <span>Explorar Salas</span>
            </Link>

            <Link
              href="/salas/minhas-reservas"
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all ${
                isReservasAtivo
                  ? "bg-primary text-primary-foreground font-medium shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Minhas Reservas</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              Olá, <strong className="text-foreground">{user.nome}</strong>
            </span>
          )}

          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive bg-muted/60 hover:bg-destructive/10 border border-border px-3 py-1.5 rounded-lg transition-all cursor-pointer"
            title="Terminar Sessão"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}