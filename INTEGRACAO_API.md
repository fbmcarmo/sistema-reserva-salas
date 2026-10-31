# Integração com API REST

Frontend Next.js 16 + TypeScript. As 22 rotas fornecidas estão centralizadas em `src/services/endpoints.ts`.

## Configuração

Copie `.env.example` para `.env.local` e ajuste `NEXT_PUBLIC_API_URL` para a origem da API, sem `/api` no final. Em Docker Compose, a URL pública deve ser acessível **pelo navegador**, por exemplo `http://localhost:3001`.

Execute `npm install` e `npm run dev`.

## Contratos a confirmar com o backend

- Login aceita `{email,senha}` e retorna `token`/`accessToken`; `/api/auth/me` deve retornar o usuário.
- Cadastro aceita `{nome,email,senha}`. A criação administrativa de usuário reutiliza cadastro público porque não foi informada uma rota POST `/api/users`.
- Reservas enviam `{roomId,startDate,endDate,motivo}`. Confirme os nomes exatos do DTO e o formato de data (ISO local vs UTC) no Swagger.
- Disponibilidade recebe `startDate` e `endDate` por query e pode responder `available` ou `disponivel`. O backend continua responsável por validar conflitos atomicamente.
- Listagens podem retornar arrays ou envelopes `data`, `items`, `results`, `users`, `rooms`, `reservations`.
- JWT é armazenado em cookie legível pelo JavaScript para compatibilidade com o `proxy.ts` existente. Para produção, prefira BFF com cookie HttpOnly, SameSite e Secure e proteção CSRF apropriada.
- A API deve habilitar CORS para a origem do frontend e permitir `Authorization`.
- As páginas de listagem, criação, exclusão, perfil e autenticação usam chamadas reais. A edição de reservas e a consulta de reservas por sala estão disponíveis no service; não havia fluxo correspondente nas telas originais.
