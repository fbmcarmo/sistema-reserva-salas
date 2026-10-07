"use client";

import { Header } from "@/components/layout/Header";

export default function SalasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}