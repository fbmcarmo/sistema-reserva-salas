import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// 1. Importação do AuthProvider
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Reserva de Salas",
  description: "Sistema de reserva e gestão de salas",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* 2. O AuthProvider envolve o {children} */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}