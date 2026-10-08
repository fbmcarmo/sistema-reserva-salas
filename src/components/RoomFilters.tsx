import { Search, RotateCcw } from "lucide-react";

interface RoomFiltersProps {
  busca: string;
  setBusca: (val: string) => void;
  capacidadeMinima: number;
  setCapacidadeMinima: (val: number) => void;
  recursoSelecionado: string;
  setRecursoSelecionado: (val: string) => void;
  onLimparFiltros: () => void;
}

export function RoomFilters({
  busca,
  setBusca,
  capacidadeMinima,
  setCapacidadeMinima,
  recursoSelecionado,
  setRecursoSelecionado,
  onLimparFiltros,
}: RoomFiltersProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Barra de Pesquisa */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Pesquisar por nome ou piso..."
            className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all"
          />
        </div>

        {/* Filtro de Lotação */}
        <div className="md:col-span-3">
          <select
            value={capacidadeMinima}
            onChange={(e) => setCapacidadeMinima(Number(e.target.value))}
            className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all cursor-pointer"
          >
            <option value={0}>Qualquer capacidade</option>
            <option value={4}>Mínimo 4 pessoas</option>
            <option value={8}>Mínimo 8 pessoas</option>
            <option value={15}>Mínimo 15 pessoas</option>
            <option value={25}>Mínimo 25 pessoas</option>
          </select>
        </div>

        {/* Filtro de Equipamento */}
        <div className="md:col-span-3">
          <select
            value={recursoSelecionado}
            onChange={(e) => setRecursoSelecionado(e.target.value)}
            className="w-full bg-background border border-input rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring transition-all cursor-pointer"
          >
            <option value="Todos">Todos os recursos</option>
            <option value="Wi-Fi">Com Wi-Fi</option>
            <option value="Projetor">Com Projetor</option>
            <option value="TV">Com TV</option>
            <option value="Videoconferência">Com Videoconferência</option>
            <option value="Quadro Branco">Com Quadro Branco</option>
          </select>
        </div>

        {/* Botão Limpar Filtros */}
        <div className="md:col-span-1 flex justify-center">
          <button
            onClick={onLimparFiltros}
            title="Limpar filtros"
            className="p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}