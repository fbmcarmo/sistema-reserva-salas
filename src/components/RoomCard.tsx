
"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export interface Sala {
  id: string | number;
  nome: string;
  descricao?: string;
  capacidade: number;
  localizacao?: string;
  recursos?: string[];
  disponivel?: boolean;
}

interface RoomCardProps {
  sala: Sala;
  onEdit?: (sala: Sala) => void;
  onDelete?: (sala: Sala) => void;
}

export function RoomCard({
  sala,
  onEdit,
  onDelete,
}: RoomCardProps) {
  return (
    <article className="group relative flex h-56 w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all hover:border-border hover:shadow-md">
      <Link
        href={`/salas/${sala.id}`}
        className="flex min-h-0 flex-1 flex-col p-6 pr-24"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              {sala.nome}
            </h2>

            {sala.localizacao && (
              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {sala.localizacao}
              </p>
            )}
          </div>

          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            {sala.capacidade} pessoas
          </span>
        </div>

        {sala.descricao && (
          <p className="mt-5 line-clamp-3 overflow-hidden text-xs leading-relaxed text-muted-foreground/90">
            {sala.descricao}
          </p>
        )}
      </Link>

      {(onEdit || onDelete) && (
        <div className="absolute right-4 top-5 flex items-center gap-1">
          {onEdit && (
            <button
              type="button"
              data-testid="btn-editar-sala"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(sala);
              }}
              aria-label={`Editar ${sala.nome}`}
              title={`Editar ${sala.nome}`}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              data-testid="btn-excluir-sala"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(sala);
              }}
              aria-label={`Excluir ${sala.nome}`}
              title={`Excluir ${sala.nome}`}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </article>
  );
}
