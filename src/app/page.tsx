import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center select-none">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Rótulo superior */}
        <span className="text-xs md:text-sm font-medium tracking-[0.25em] text-primary uppercase mb-5">
          Reserva de salas
        </span>

        {/* Título de destaque */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          <span className="text-foreground">Sua sala, </span>
          <span className="text-primary">na hora</span>
          <span className="text-primary block">certa.</span>
        </h1>

        {/* Subtítulo */}
        <p className="text-sm md:text-base text-muted-foreground font-normal max-w-md mx-auto mb-8 leading-relaxed">
          Veja horários livres, reserve e gerencie tudo em um lugar só.
        </p>

        {/* Botões de navegação */}
        <div className="flex items-center justify-center gap-3.5">
          <Link
            href="/login"
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
          >
            Entrar
          </Link>

          <Link
            href="/cadastro"
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-card text-foreground border border-border hover:bg-muted transition-all shadow-xs"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </main>
  );
}