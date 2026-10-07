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
  disponivel?: boolean;
}

export interface Reserva {
  id: string | number;
  salaId?: string | number;
  sala_id?: string | number;
  nomeSala?: string;
  sala?: { nome: string };
  usuarioNome?: string;
  usuario?: { nome: string };
  data: string;
  horario?: string;
  hora_inicio?: string;
  hora_fim?: string;
  motivo: string;
  status?: "Confirmada" | "Cancelada" | string;
}