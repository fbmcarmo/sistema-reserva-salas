"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  titulo: string;
  descricao: string;
  textoBotaoConfirmar?: string;
  carregando?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  descricao,
  textoBotaoConfirmar = "Excluir permanentemente",
  carregando = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-card border border-border/80 rounded-2xl p-6 sm:p-7 shadow-xl space-y-5"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-destructive/10 text-destructive shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">
              {titulo}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {descricao}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={carregando}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-all cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={carregando}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-destructive hover:opacity-90 text-destructive-foreground transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {carregando && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{textoBotaoConfirmar}</span>
          </button>
        </div>
      </div>
    </div>
  );
}