import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        {/* Rótulo superior */}
        <span className="text-xs sm:text-sm font-semibold tracking-[0.22em] text-primary uppercase mb-6">
          Reserva de salas
        </span>

        {/* Título de grande destaque */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[1.06] mb-6">
          <span className="text-foreground">Sua sala, </span>
          <span className="text-primary">na hora</span>
          <span className="text-primary block mt-1">certa.</span>
        </h1>

        {/* Subtítulo descritivo */}
        <p className="text-sm sm:text-base text-muted-foreground/90 font-normal max-w-lg mx-auto mb-9 leading-relaxed">
          Veja horários livres, reserve e gerencie tudo em um lugar só.
        </p>

        {/* Ações principais */}
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:opacity-90 text-primary-foreground transition-all shadow-xs cursor-pointer min-w-[110px]"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-card text-foreground border border-border hover:bg-muted/60 transition-all shadow-xs cursor-pointer min-w-[120px]"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}