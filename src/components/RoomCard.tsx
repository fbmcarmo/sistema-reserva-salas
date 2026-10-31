"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";

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
  onDelete?: (sala: Sala) => void;
}

export function RoomCard({ sala, onDelete }: RoomCardProps) {
  return (
    <article className="group relative bg-card border border-border/80 hover:border-border rounded-2xl transition-all shadow-xs hover:shadow-md">
      <Link
        href={`/salas/${sala.id}`}
        className="block p-6 pr-16 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {sala.nome}
            </h2>
            {sala.localizacao && (
              <p className="text-xs text-muted-foreground mt-1">
                {sala.localizacao}
              </p>
            )}
          </div>

          {/* Pastilha de capacidade */}
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground whitespace-nowrap">
            {sala.capacidade} pessoas
          </span>
        </div>

        {sala.descricao && (
          <p className="text-xs text-muted-foreground/90 mt-5 leading-relaxed">
            {sala.descricao}
          </p>
        )}
      </Link>

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
          className="absolute top-5 right-4 inline-flex items-center justify-center w-8 h-8 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </article>
  );
}