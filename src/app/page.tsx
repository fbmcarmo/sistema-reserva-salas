import { redirect } from "next/navigation";

export default function HomePage() {
  // Redireciona a raiz diretamente para o catálogo de salas
  redirect("/salas");
}