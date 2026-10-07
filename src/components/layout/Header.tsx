"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);

  const rotas = [
    { nome: "Salas", href: "/salas", ativo: pathname === "/salas" },
    {
      nome: "Minhas reservas",
      href: "/salas/minhas-reservas",
      ativo: pathname === "/salas/minhas-reservas",
    },
    {
      nome: "Todas reservas",
      href: "/salas/todas-reservas",
      ativo: pathname === "/salas/todas-reservas",
    },
    {
      nome: "Usuários",
      href: "/salas/usuarios",
      ativo: pathname === "/salas/usuarios",
    },
    {
      nome: "Meu perfil",
      href: "/salas/perfil",
      ativo: pathname === "/salas/perfil",
    },
  ];

  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Botão Hambúrguer Mobile */}
          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            aria-label="Abrir menu"
          >
            {menuAberto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logótipo sala. */}
          <Link
            href="/salas"
            className="text-xl font-bold tracking-tight text-foreground select-none"
          >
            sala<span className="text-primary">.</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-medium">
            {rotas.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  item.ativo
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {item.nome}
              </Link>
            ))}
          </nav>
        </div>

        {/* Informações do Utilizador */}
        <div className="flex items-center gap-3 sm:gap-5">
          <span className="text-xs text-foreground font-medium truncate max-w-[120px] sm:max-w-none">
            {user?.nome || "May S"}
          </span>

          <button
            onClick={logout}
            className="text-xs text-foreground hover:text-destructive font-medium transition-colors cursor-pointer"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {menuAberto && (
        <div className="md:hidden mt-3 pt-3 border-t border-border/60 flex flex-col gap-1 pb-2">
          {rotas.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAberto(false)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                item.ativo
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {item.nome}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}