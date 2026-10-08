"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isSalasAtivo = pathname === "/salas";
  const isMinhasReservasAtivo = pathname === "/salas/minhas-reservas";
  const isTodasReservasAtivo = pathname === "/salas/todas-reservas";
  const isUsuariosAtivo = pathname === "/salas/usuarios";
  const isPerfilAtivo = pathname === "/salas/perfil";

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-8 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-8">
        {/* Logótipo sala. */}
        <Link href="/salas" className="text-xl font-bold tracking-tight text-foreground">
          sala<span className="text-primary">.</span>
        </Link>

        {/* Abas de Navegação */}
        <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
          <Link
            href="/salas"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isSalasAtivo
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Salas
          </Link>

          <Link
            href="/salas/minhas-reservas"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isMinhasReservasAtivo
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Minhas reservas
          </Link>

          <Link
            href="/salas/todas-reservas"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isTodasReservasAtivo
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Todas reservas
          </Link>

          <Link
            href="/salas/usuarios"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isUsuariosAtivo
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Usuários
          </Link>

          <Link
            href="/salas/perfil"
            className={`px-3 py-1.5 rounded-lg transition-all ${
              isPerfilAtivo
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            Meu perfil
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <span className="text-xs text-foreground font-medium">
          {user?.nome || "May S"}
        </span>

        <button
          onClick={logout}
          className="text-xs text-foreground hover:text-destructive font-medium transition-colors cursor-pointer"
        >
          Sair
        </button>
      </div>
    </header>
  );
}