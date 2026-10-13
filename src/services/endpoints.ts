
import { api, unwrapItem, unwrapList } from "./api";

import type { Usuario, Sala, Reserva } from "@/types";

// ==========================================
// TIPOS
// ==========================================

// O backend gera o ID ao criar uma reserva.
export type CriarReservaPayload = Omit<Reserva, "id">;

// Permite enviar apenas os campos que serão alterados.
export type AtualizarReservaPayload = Partial<CriarReservaPayload>;

// O backend gera o ID ao criar uma sala.
export type CriarSalaPayload = Omit<Sala, "id">;

export type AtualizarSalaPayload = Partial<CriarSalaPayload>;

// ==========================================
// FUNÇÕES AUXILIARES
// ==========================================

// Protege os identificadores utilizados nas URLs.
const segment = (id: string | number): string =>
  encodeURIComponent(String(id));

// Converte recursos do frontend para o formato
// de texto esperado pela API.

const formatarRecursos = (
  recursos?: string[] | string
): string => {
  if (recursos === undefined || recursos === null) {
    return "";
  }

  if (Array.isArray(recursos)) {
    return recursos
      .filter(
        (recurso): recurso is string =>
          typeof recurso === "string"
      )
      .map((recurso) => recurso.trim())
      .filter(Boolean)
      .join(", ");
  }

  if (typeof recursos === "string") {
    return recursos.trim();
  }

  return "";
};

// Converte uma data válida para ISO 8601.
const formatarDataISO = (data: string): string => {
  const dataConvertida = new Date(data);

  if (Number.isNaN(dataConvertida.getTime())) {
    throw new Error("Data inválida.");
  }

  return dataConvertida.toISOString();
};

// Valida IDs numéricos.
const validarIdNumerico = (
  id: number,
  entidade: string
): number => {
  const idNumerico = Number(id);

  if (
    !Number.isInteger(idNumerico) ||
    idNumerico <= 0
  ) {
    throw new Error(`ID de ${entidade} inválido.`);
  }

  return idNumerico;
};

// ==========================================
// AUTENTICAÇÃO
// ==========================================

export const authService = {
  // POST /api/auth/register
  register: async (payload: {
    nome: string;
    email: string;
    senha: string;
  }) => {
    const response = await api.post(
      "/api/auth/register",
      {
        name: payload.nome.trim(),
        email: payload.email.trim(),
        password: payload.senha,
      }
    );

    return response.data;
  },

  // POST /api/auth/login
  login: async (payload: {
    email: string;
    senha: string;
  }) => {
    const response = await api.post(
      "/api/auth/login",
      {
        email: payload.email.trim(),
        password: payload.senha,
      }
    );

    return response.data;
  },

  // POST /api/auth/logout
  logout: async () => {
    const response = await api.post(
      "/api/auth/logout"
    );

    return response.data;
  },

  // GET /api/auth/me
  me: async () => {
    const response = await api.get(
      "/api/auth/me"
    );

    return unwrapItem<Usuario>(response.data);
  },
};

// ==========================================
// USUÁRIOS
// ==========================================

export const usersService = {
  // GET /api/users
  list: async () => {
    const response = await api.get(
      "/api/users"
    );

    return unwrapList<Usuario>(response.data);
  },

  // GET /api/users/{id}
  get: async (id: string | number) => {
    const response = await api.get(
      `/api/users/${segment(id)}`
    );

    return unwrapItem<Usuario>(response.data);
  },

  // PUT /api/users/{id}
  update: async (
    id: string | number,
    payload: Partial<Usuario> & {
      senha?: string;
    }
  ) => {
    const { senha, ...userData } = payload;

    const requestBody = {
      ...userData,
      ...(senha !== undefined
        ? { password: senha }
        : {}),
    };

    const response = await api.put(
      `/api/users/${segment(id)}`,
      requestBody
    );

    return response.data;
  },

  // DELETE /api/users/{id}
  remove: async (id: string | number) => {
    const response = await api.delete(
      `/api/users/${segment(id)}`
    );

    return response.data;
  },
};

// ==========================================
// SALAS
// ==========================================

export const roomsService = {
  // GET /api/rooms
  list: async () => {
    const response = await api.get(
      "/api/rooms"
    );

    return unwrapList<Sala>(response.data);
  },

  // GET /api/rooms/{id}
  get: async (id: string | number) => {
    const response = await api.get(
      `/api/rooms/${segment(id)}`
    );

    return unwrapItem<Sala>(response.data);
  },

  
// POST /api/rooms
  create: async (payload: CriarSalaPayload) => {
    const nome = payload.nome?.trim();

    if (!nome) {
      throw new Error(
        "O nome da sala é obrigatório."
      );
    }

    const capacidade = Number(payload.capacidade);

    if (
      !Number.isInteger(capacidade) ||
      capacidade <= 0
    ) {
      throw new Error(
        "A capacidade deve ser um número inteiro maior que zero."
      );
    }

    const requestBody = {
      nome,
      descricao: payload.descricao?.trim() ?? "",
      capacidade,
      localizacao: payload.localizacao?.trim() ?? "",
      recursos: formatarRecursos(payload.recursos),
      status: "ATIVA",
    };

    console.log("Dados enviados para API:", requestBody);

    const response = await api.post(
      "/api/rooms",
      requestBody
    );

    return response.data;
  },


  // PUT /api/rooms/{id}
  update: async (
    id: string | number,
    payload: AtualizarSalaPayload
  ) => {
    const requestBody = {
      ...(payload.nome !== undefined && {
        nome: payload.nome.trim(),
      }),

      ...(payload.descricao !== undefined && {
        descricao: payload.descricao.trim(),
      }),

      ...(payload.capacidade !== undefined && {
        capacidade: Number(payload.capacidade),
      }),

      ...(payload.localizacao !== undefined && {
        localizacao: payload.localizacao.trim(),
      }),

      ...(payload.recursos !== undefined && {
        recursos: formatarRecursos(payload.recursos),
      }),

      ...(payload.status !== undefined && {
        status: payload.status,
      }),
    };

    const response = await api.put(
      `/api/rooms/${segment(id)}`,
      requestBody
    );

    return response.data;
  },

  // DELETE /api/rooms/{id}
  remove: async (id: string | number) => {
    const response = await api.delete(
      `/api/rooms/${segment(id)}`
    );

    return response.data;
  },

  // GET /api/rooms/{roomId}/availability
  availability: async (
    id: string | number,
    params: {
      startDate: string;
      endDate: string;
    }
  ) => {
    const response = await api.get(
      `/api/rooms/${segment(id)}/availability`,
      {
        params: {
          startDate: formatarDataISO(
            params.startDate
          ),
          endDate: formatarDataISO(
            params.endDate
          ),
        },
      }
    );

    return response.data;
  },

  // GET /api/rooms/{roomId}/reservations
  reservations: async (id: string | number) => {
    const response = await api.get(
      `/api/rooms/${segment(id)}/reservations`
    );

    return unwrapList<Reserva>(response.data);
  },
};

// ==========================================
// RESERVAS
// ==========================================

export const reservationsService = {
  // GET /api/reservations
  list: async () => {
    const response = await api.get(
      "/api/reservations"
    );

    return unwrapList<Reserva>(response.data);
  },

  // GET /api/reservations/my
  my: async () => {
    const response = await api.get(
      "/api/reservations/my"
    );

    return unwrapList<Reserva>(response.data);
  },

  // GET /api/reservations/{id}
  get: async (id: string | number) => {
    const response = await api.get(
      `/api/reservations/${segment(id)}`
    );

    return unwrapItem<Reserva>(response.data);
  },

  // POST /api/reservations
  create: async (payload: CriarReservaPayload) => {
    const userId = validarIdNumerico(
      payload.userId,
      "usuário"
    );

    const roomId = validarIdNumerico(
      payload.roomId,
      "sala"
    );

    const startDate = formatarDataISO(
      payload.startDate
    );

    const endDate = formatarDataISO(
      payload.endDate
    );

    if (
      new Date(endDate).getTime() <=
      new Date(startDate).getTime()
    ) {
      throw new Error(
        "A data final deve ser posterior à inicial."
      );
    }

    const requestBody: CriarReservaPayload = {
      userId,
      roomId,
      startDate,
      endDate,
    };

    const response = await api.post(
      "/api/reservations",
      requestBody
    );

    return response.data;
  },

  // PUT /api/reservations/{id}
  update: async (
    id: string | number,
    payload: AtualizarReservaPayload
  ) => {
    const requestBody: AtualizarReservaPayload = {};

    if (payload.userId !== undefined) {
      requestBody.userId = validarIdNumerico(
        payload.userId,
        "usuário"
      );
    }

    if (payload.roomId !== undefined) {
      requestBody.roomId = validarIdNumerico(
        payload.roomId,
        "sala"
      );
    }

    if (payload.startDate !== undefined) {
      requestBody.startDate = formatarDataISO(
        payload.startDate
      );
    }

    if (payload.endDate !== undefined) {
      requestBody.endDate = formatarDataISO(
        payload.endDate
      );
    }

    if (
      requestBody.startDate !== undefined &&
      requestBody.endDate !== undefined
    ) {
      if (
        new Date(requestBody.endDate).getTime() <=
        new Date(requestBody.startDate).getTime()
      ) {
        throw new Error(
          "A data final deve ser posterior à inicial."
        );
      }
    }

    const response = await api.put(
      `/api/reservations/${segment(id)}`,
      requestBody
    );

    return response.data;
  },

  // DELETE /api/reservations/{id}
  remove: async (id: string | number) => {
    const response = await api.delete(
      `/api/reservations/${segment(id)}`
    );

    return response.data;
  },
};
