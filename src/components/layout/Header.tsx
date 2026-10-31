
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, UserRound } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  const pathname = usePathname();

  const [menuAberto, setMenuAberto] = useState(false);

  // A API utiliza "name", mas o frontend pode
  // armazenar o nome como "nome".
  const usuario = user as
    | (typeof user & { name?: string; nome?: string })
    | null;

  const nomeUsuario =
    usuario?.name?.trim() ||
    usuario?.nome?.trim() ||
    "Usuário";

  const inicialUsuario =
    nomeUsuario !== "Usuário"
      ? nomeUsuario.charAt(0).toUpperCase()
      : "";

  const rotas = [
    {
      nome: "Salas",
      href: "/salas",
      ativo: pathname === "/salas",
    },
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 px-4 py-3.5 backdrop-blur-md sm:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          {/* Botão do menu mobile */}
          <button
            type="button"
            onClick={() => setMenuAberto(!menuAberto)}
            className="cursor-pointer rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            aria-label={
              menuAberto ? "Fechar menu" : "Abrir menu"
            }
            aria-expanded={menuAberto}
          >
            {menuAberto ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Logotipo */}
          <Link
            href="/salas"
            className="select-none text-xl font-bold tracking-tight text-foreground"
          >
            sala<span className="text-primary">.</span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden items-center gap-1.5 text-xs font-medium md:flex">
            {rotas.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 transition-all ${
                  item.ativo
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item.nome}
              </Link>
            ))}
          </nav>
        </div>

        {/* Usuário autenticado */}
        <div className="flex items-center gap-3 sm:gap-5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              {inicialUsuario ? (
                <span className="text-xs font-semibold">
                  {inicialUsuario}
                </span>
              ) : (
                <UserRound className="h-4 w-4" />
              )}
            </div>

            <div className="hidden min-w-0 flex-col sm:flex">
              <span className="text-[10px] text-muted-foreground">
                Usuário logado
              </span>

              <span className="max-w-[150px] truncate text-xs font-medium text-foreground">
                {nomeUsuario}
              </span>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={logout}
            className="cursor-pointer text-xs font-medium text-foreground transition-colors hover:text-destructive"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {menuAberto && (
        <div className="mt-3 flex flex-col gap-1 border-t border-border/60 pt-3 pb-2 md:hidden">
          {rotas.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuAberto(false)}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                item.ativo
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {item.nome}
            </Link>
          ))}

          <div className="mt-2 border-t border-border/60 px-3 pt-3 sm:hidden">
            <span className="text-xs text-muted-foreground">
              Conectado como
            </span>

            <p className="mt-1 text-sm font-medium text-foreground">
              {nomeUsuario}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
