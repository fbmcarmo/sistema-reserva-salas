# Sistema de Reserva de Salas — Frontend

Interface web para gerenciamento e reserva de salas, desenvolvida como parte de um projeto acadêmico com frontend e API em repositórios separados.

O sistema permite autenticar usuários, consultar salas, selecionar datas e horários para reservas e acompanhar agendamentos. Também oferece interfaces de administração e gerenciamento, sujeitas às permissões definidas pela API.

> **Escopo deste repositório:** aplicação frontend. A persistência dos dados, autenticação JWT, regras de conflito de horários e autorização são responsabilidades do backend.

## Tecnologias

- **Next.js** (App Router) e **React** — aplicação e interface.
- **TypeScript** — tipagem de componentes, entidades e serviços.
- **Tailwind CSS** — estilos responsivos.
- **Lucide React** — ícones.
- **Axios** — requisições HTTP à API.
- **js-cookie** — armazenamento do token JWT no navegador.
- **Docker / Docker Compose** — execução em contêineres, quando configurados no projeto.

## Funcionalidades

### Autenticação e perfil

- Cadastro e login de usuários.
- Autenticação com token JWT e recuperação do usuário autenticado.
- Logout e proteção de rotas conforme a configuração do projeto.
- Consulta e atualização de informações de usuários, conforme permissões da API.

### Salas

- Listagem e visualização de detalhes das salas.
- Exibição de capacidade, descrição e localização.
- Cadastro, edição e exclusão de salas, conforme autorização.
- Consulta de disponibilidade para um intervalo de datas e horários.

### Reservas

- Seleção de sala, data e horário.
- Verificação de disponibilidade antes do envio da reserva.
- Criação e consulta das próprias reservas.
- Visualização geral de reservas, conforme permissão da API.
- Pesquisa e filtros por sala e status na página de todas as reservas.
- Cancelamento de reservas, sujeito às regras de autorização do backend.

> **Importante:** a interface não substitui as validações do servidor. O backend deve impedir conflitos de horário e validar se o usuário tem autorização para criar, alterar ou cancelar reservas.

## Pré-requisitos

Para executar localmente:

- Node.js em versão compatível com o Next.js instalado no projeto (consulte `package.json` e o arquivo de lock).
- npm.
- API do Sistema de Reserva de Salas em execução e acessível.

Para execução com contêineres, também são necessários Docker e Docker Compose.

## Instalação e execução local

**1. Clone o repositório:**

```bash
git clone <URL_DO_REPOSITORIO_FRONTEND>
cd <PASTA_DO_REPOSITORIO_FRONTEND>
```

**2. Instale as dependências:**

```bash
npm install
```

Se houver um `package-lock.json` atualizado, `npm ci` é uma alternativa recomendada para instalações reproduzíveis.

**3. Configure as variáveis de ambiente:**

Crie um arquivo `.env.local` na raiz do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Ajuste a URL e a porta para o endereço real da sua API. O prefixo `NEXT_PUBLIC_` torna a variável acessível no navegador: **não coloque segredos ou chaves privadas nela**.

**4. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

Abra **http://localhost:3000**.

### Build de produção

```bash
npm run build
npm run start
```

Os comandos pressupõem que os scripts `dev`, `build` e `start` estejam definidos no `package.json`.

## Execução com Docker

Se o repositório incluir `Dockerfile` e `docker-compose.yml` (ou `compose.yml`), execute na pasta que contém o arquivo Compose:

```bash
docker compose up -d --build
```

Para verificar o estado dos serviços e os logs:

```bash
docker compose ps
docker compose logs -f
```

Para encerrar:

```bash
docker compose down
```

Se o Compose possuir um serviço chamado `frontend`, é possível reconstruir apenas esse serviço:

```bash
docker compose up -d --build frontend
```

> **Atenção à rede:** `localhost` acessado pelo **navegador** refere-se ao computador do usuário, enquanto `localhost` acessado **dentro de um contêiner** refere-se ao próprio contêiner. Configure as URLs de comunicação conforme o local em que a requisição é executada. Variáveis `NEXT_PUBLIC_*` utilizadas no bundle do Next.js geralmente precisam estar disponíveis durante o build.

## Estrutura do projeto

A organização abaixo é uma **visão ilustrativa baseada nos arquivos e caminhos utilizados na aplicação**. Ajuste os nomes conforme a estrutura efetiva do repositório.

```text
frontend/
├── public/                       # Arquivos estáticos
├── src/
│   ├── app/                      # Páginas e rotas (App Router)
│   │   ├── login/
│   │   └── salas/
│   │       ├── [id]/             # Detalhes e reserva de uma sala
│   │       ├── minhas-reservas/
│   │       ├── todas-reservas/
│   │       ├── usuarios/
│   │       └── perfil/
│   ├── components/               # Componentes reutilizáveis
│   ├── contexts/
│   │   └── AuthContext.tsx        # Sessão e usuário autenticado
│   ├── services/
│   │   ├── api.ts                 # Cliente HTTP e tratamento de resposta
│   │   └── endpoints.ts          # Serviços de autenticação, salas etc.
│   └── types/                    # Interfaces TypeScript
├── .env.local                    # Configuração local (não versionar)
├── package.json
└── README.md
```

### Responsabilidades das principais camadas

| Camada | Responsabilidade |
| --- | --- |
| `app/` | Páginas, navegação e interação do usuário |
| `components/` | Elementos visuais reutilizáveis, como cards e cabeçalho |
| `contexts/AuthContext.tsx` | Estado de autenticação, login, logout e atualização do usuário |
| `services/api.ts` | Configuração do cliente HTTP, envio de credenciais e tratamento de erros |
| `services/endpoints.ts` | Centralização das chamadas aos endpoints REST |
| `types/` | Tipos e contratos utilizados pelo frontend |

## Integração com a API REST

O frontend utiliza serviços organizados em `src/services/endpoints.ts`. Os caminhos de API considerados na integração são:

| Módulo | Método | Endpoint | Finalidade |
| --- | --- | --- | --- |
| Autenticação | POST | `/api/auth/register` | Cadastrar usuário |
| Autenticação | POST | `/api/auth/login` | Autenticar usuário |
| Autenticação | POST | `/api/auth/logout` | Encerrar sessão no servidor |
| Autenticação | GET | `/api/auth/me` | Obter usuário autenticado |
| Usuários | GET | `/api/users` | Listar usuários |
| Usuários | GET | `/api/users/:id` | Consultar usuário |
| Usuários | PUT | `/api/users/:id` | Atualizar usuário |
| Usuários | DELETE | `/api/users/:id` | Excluir usuário |
| Salas | POST | `/api/rooms` | Cadastrar sala |
| Salas | GET | `/api/rooms` | Listar salas |
| Salas | GET | `/api/rooms/:id` | Consultar sala |
| Salas | PUT | `/api/rooms/:id` | Atualizar sala |
| Salas | DELETE | `/api/rooms/:id` | Excluir sala |
| Salas | GET | `/api/rooms/:roomId/availability` | Consultar disponibilidade |
| Salas | GET | `/api/rooms/:roomId/reservations` | Consultar reservas da sala |
| Reservas | GET | `/api/reservations` | Listar reservas |
| Reservas | POST | `/api/reservations` | Criar reserva |
| Reservas | GET | `/api/reservations/my` | Listar minhas reservas |
| Reservas | GET | `/api/reservations/:id` | Consultar reserva |
| Reservas | PUT | `/api/reservations/:id` | Atualizar reserva |
| Reservas | DELETE | `/api/reservations/:id` | Cancelar/excluir reserva |

A disponibilidade real de cada operação depende da implementação e das permissões do backend.

### Exemplo: criação de reserva

O corpo da requisição utiliza os identificadores da sala e do usuário autenticado, além das datas de início e fim:

```json
{
  "userId": 5,
  "roomId": 2,
  "startDate": "2026-10-13T14:00:00.000Z",
  "endDate": "2026-10-13T15:00:00.000Z"
}
```

Os valores acima são ilustrativos. O `userId` deve corresponder ao usuário autenticado e os horários devem ser convertidos corretamente para ISO 8601. O backend é responsável pela validação final e pela prevenção de conflitos.

### Exemplo: cadastro de sala

```json
{
  "nome": "Sala de Reuniões",
  "descricao": "Sala equipada para reuniões.",
  "capacidade": 20,
  "localizacao": "Bloco A - 2º andar",
  "recursos": "Projetor, ar-condicionado, Wi-Fi",
  "status": "ATIVA"
}
```

No formulário, `recursos` pode ser tratado como lista de textos, mas o serviço deve convertê-lo para uma string caso esse seja o formato exigido pela API.

## Autenticação e autorização

O `AuthContext` gerencia o usuário autenticado, o estado de carregamento e as operações de login/logout. Na implementação atual, o token JWT é salvo em cookie do navegador por `js-cookie`, e o cliente HTTP o utiliza para acessar rotas protegidas.

O token não deve ser publicado em logs, exemplos ou repositórios. Como cookies acessíveis por JavaScript não têm a proteção `HttpOnly`, uma evolução possível é adotar cookies `HttpOnly`, `Secure` e `SameSite` configurados pelo servidor, com proteção adequada contra CSRF.

### Permissões

As permissões **devem ser validadas no backend**, mesmo que o frontend esconda botões ou páginas. Uma política possível é:

| Ação | Administrador | Usuário comum |
| --- | --- | --- |
| Consultar salas | Permitido | Permitido |
| Criar reserva própria | Permitido | Permitido |
| Consultar reservas próprias | Permitido | Permitido |
| Consultar todas as reservas | Conforme política da API | Conforme política da API |
| Cancelar reserva própria | Conforme política da API | Conforme política da API |
| Cancelar reserva de terceiros | Conforme política da API | Normalmente restrito |
| Gerenciar salas e usuários | Conforme política da API | Normalmente restrito |

Um **HTTP 403** indica que a requisição foi compreendida, mas a API recusou a operação por falta de permissão. Para permitir a visualização geral por usuários comuns, é necessário revisar a autorização de `GET /api/reservations` no backend, sem necessariamente liberar a exclusão de reservas de terceiros.

## Tratamento de datas e horários

A interface apresenta horários ao usuário, enquanto a API utiliza campos `startDate` e `endDate`. Ao implementar ou alterar o agendamento:

1. Monte as datas a partir do dia e horário escolhidos.
2. Valide se o horário final é posterior ao inicial.
3. Converta os valores para ISO 8601 respeitando o fuso horário local.
4. Consulte a disponibilidade da sala.
5. Envie a reserva e trate eventuais conflitos retornados pela API.

A consulta prévia de disponibilidade não garante, sozinha, que o horário continuará livre: o backend precisa verificar conflitos novamente ao confirmar a reserva.

## Scripts úteis

```bash
npm run dev      # Desenvolvimento
npm run build    # Compilação de produção
npm run start    # Servidor de produção
```

Outros scripts, como `lint` ou `test`, devem ser consultados no `package.json` antes da execução.

## Solução de problemas

| Problema | Possível causa | O que verificar |
| --- | --- | --- |
| `Cannot read properties of undefined (reading 'trim')` | Campo opcional ausente | Tratar `undefined` antes de chamar `.trim()`, especialmente em `recursos` |
| `ID de usuário inválido` | `userId` ausente ou incorreto | Confirmar `user.id` no contexto e enviá-lo no `POST /api/reservations` |
| `Sala undefined` | Nome de campo incompatível | Usar `roomId` e relacioná-lo aos dados de `/api/rooms` |
| `undefined - undefined` nos horários | Campos antigos no componente | Usar `startDate` e `endDate` |
| `HTTP 401` | Sessão ausente, expirada ou token inválido | Conferir login, cookie e cabeçalho `Authorization` |
| `HTTP 403` | Operação não autorizada | Conferir perfil e regras de autorização no backend |
| Erro de CORS | Origem do frontend não liberada | Configurar CORS no servidor para a origem utilizada |
| `Failed to fetch` / erro de conexão | API indisponível ou URL incorreta | Conferir `NEXT_PUBLIC_API_URL`, porta, rede e logs |
| Falha no build Docker | Dependências, variáveis ou erro de compilação | Rodar `docker compose build --progress=plain` e inspecionar os logs |

## Boas práticas de desenvolvimento

- Centralizar requisições HTTP na camada `services/`.
- Reutilizar componentes visuais e tipos TypeScript.
- Validar campos obrigatórios antes de enviar requisições.
- Tratar estados de carregamento, erro, sucesso e ausência de dados.
- Não armazenar senhas ou credenciais privadas no código-fonte.
- Não versionar `.env.local` nem tokens de autenticação.
- Manter as regras críticas de autorização e conflito de reservas no backend.
- Utilizar branches e pull requests para organizar a colaboração.

## Próximas melhorias possíveis

- Exibir disponibilidade em tempo real para cada faixa de horário.
- Desabilitar visualmente horários ocupados.
- Implementar testes automatizados para formulários, serviços e autenticação.
- Melhorar acessibilidade e mensagens de erro.
- Padronizar o tratamento de datas e fusos horários.
- Refinar as permissões visuais conforme os papéis retornados pela API.

## Sobre o projeto

Projeto acadêmico de desenvolvimento Full Stack, com frontend em Next.js/TypeScript e API REST separada. O objetivo é aplicar integração entre aplicações, autenticação, organização modular e regras de negócio para o gerenciamento de reservas de salas.

---

**Documentação:** ajuste as URLs dos repositórios, versões exatas das dependências, nomes de serviços Docker e estrutura de pastas antes de publicar. Esses detalhes não foram verificados diretamente no repositório.
