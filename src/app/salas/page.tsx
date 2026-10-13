"use client";

import { useState, useEffect, useCallback } from "react";
import { RoomCard, Sala } from "@/components/RoomCard";
import { RoomSkeleton } from "@/components/RoomSkeleton";
import { Plus, AlertCircle, RefreshCw } from "lucide-react";
import { roomsService } from "@/services/endpoints";
import { apiError } from "@/services/api";


export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroApi, setErroApi] = useState("");
  const [editando, setEditando] = useState<Sala | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [capacidade, setCapacidade] = useState(4);
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");

  const carregarSalas = useCallback(async () => {
    try {
      setCarregando(true);
      setErroApi("");
      setSalas(await roomsService.list());
    } catch (error) {
      setErroApi(apiError(error));
      setSalas([]);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarSalas();
  }, [carregarSalas]);

  function abrirFormulario(sala?: Sala) {
    setEditando(sala || null); setNome(sala?.nome || ""); setCapacidade(sala?.capacidade || 4);
    setDescricao(sala?.descricao || ""); setLocalizacao(sala?.localizacao || ""); setFormAberto(true);
  }
  async function salvar(e: React.FormEvent) {
    e.preventDefault(); setErroApi("");
    try {
      const payload = { nome, capacidade, descricao, localizacao };
      if (editando) await roomsService.update(editando.id, payload);
      else await roomsService.create(payload);
      setFormAberto(false); await carregarSalas();
    } catch (error) { setErroApi(apiError(error)); }
  }
  async function remover(id: string | number) {
    if (!window.confirm("Excluir esta sala?")) return;
    try { await roomsService.remove(id); await carregarSalas(); }
    catch (error) { setErroApi(apiError(error)); }
  }
  return (
    <div className="space-y-8">
      {/* Título da página e botão Nova sala */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Salas
        </h1>

        <button
          type="button"
          onClick={() => abrirFormulario()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nova sala</span>
        </button>
      </div>

      {formAberto && <form onSubmit={salvar} className="p-5 border rounded-xl grid gap-3">
        <h2 className="font-semibold">{editando ? "Editar sala" : "Nova sala"}</h2>
        <input className="border rounded p-2" required placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
        <input className="border rounded p-2" type="number" min={1} required value={capacidade} onChange={e => setCapacidade(Number(e.target.value))} />
        <input className="border rounded p-2" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} />
        <input className="border rounded p-2" placeholder="Localização" value={localizacao} onChange={e => setLocalizacao(e.target.value)} />
        <div className="flex gap-3"><button className="bg-primary text-primary-foreground rounded px-4 py-2">Salvar</button><button type="button" onClick={() => setFormAberto(false)}>Cancelar</button></div>
      </form>}
      {erroApi && <p role="alert" className="text-destructive text-sm">{erroApi}</p>}
      {/* Estados de Carregamento, Erro ou Grelha de Salas */}
      {carregando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <RoomSkeleton key={i} />
          ))}
        </div>
      ) : erroApi && salas.length === 0 ? (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-xl bg-destructive/15 text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Falha ao carregar salas</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">{erroApi}</p>
          </div>
          <button
            type="button"
            onClick={carregarSalas}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {salas.map((sala) => (
            <div key={sala.id} className="space-y-2"><RoomCard sala={sala} /><div className="flex gap-3 text-xs"><button onClick={() => abrirFormulario(sala)} className="underline">Editar</button><button onClick={() => remover(sala.id)} className="text-destructive underline">Excluir</button></div></div>
          ))}
        </div>
      )}
    </div>
  );
}