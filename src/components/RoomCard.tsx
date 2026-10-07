import Link from "next/link";

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
}

export function RoomCard({ sala }: RoomCardProps) {
  return (
    <Link
      href={`/salas/${sala.id}`}
      className="group block bg-card border border-border/80 hover:border-border rounded-2xl p-6 transition-all shadow-xs hover:shadow-md cursor-pointer"
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

        {/* Badge arredondada de capacidade */}
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
  );
}