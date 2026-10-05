import Link from "next/link";
import { Users, Wifi, Tv, Presentation, Monitor, ArrowRight } from "lucide-react";

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
  const estaDisponivel = sala.disponivel !== false;

  const renderIcon = (item: string) => {
    const termo = item.toLowerCase();
    if (termo.includes("wi-fi") || termo.includes("wifi")) return <Wifi className="w-3.5 h-3.5" />;
    if (termo.includes("tv")) return <Tv className="w-3.5 h-3.5" />;
    if (termo.includes("projetor")) return <Presentation className="w-3.5 h-3.5" />;
    return <Monitor className="w-3.5 h-3.5" />;
  };

  return (
    <div className="group flex flex-col justify-between bg-card border border-border hover:border-ring/40 rounded-2xl p-5 transition-all shadow-xs hover:shadow-md">
      <div>
        {/* Cabeçalho do Cartão */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-base text-card-foreground group-hover:text-primary transition-colors">
              {sala.nome}
            </h3>
            {sala.localizacao && (
              <p className="text-xs text-muted-foreground mt-0.5">{sala.localizacao}</p>
            )}
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${
              estaDisponivel
                ? "bg-success/10 text-success border-success/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {estaDisponivel ? "Disponível" : "Ocupada"}
          </span>
        </div>

        {/* Descrição */}
        {sala.descricao && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {sala.descricao}
          </p>
        )}

        {/* Informações e Recursos */}
        <div className="flex items-center gap-2 text-xs text-foreground font-medium mb-3">
          <Users className="w-4 h-4 text-primary" />
          <span>Até {sala.capacidade} pessoas</span>
        </div>

        {sala.recursos && sala.recursos.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {sala.recursos.map((rec, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] bg-muted text-muted-foreground border border-border"
              >
                {renderIcon(rec)}
                <span>{rec}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Botão de Reserva */}
      <Link
        href={`/salas/${sala.id}`}
        className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
      >
        <span>Ver Detalhes e Reservar</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}