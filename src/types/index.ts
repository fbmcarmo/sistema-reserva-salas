export interface Usuario {
  id: string | number;
  nome: string;
  email: string;
  role?: "ADMIN" | "USER" | string;
}

export interface Sala {
  id: string | number;
  nome: string;
  descricao?: string;
  capacidade: number;
  localizacao?: string;
  recursos?: string[];
  status?: boolean;
}

export interface Reserva {
  id: string | number;
  userId: number;
  roomId: number;
  startDate: string;
  endDate: string;
}