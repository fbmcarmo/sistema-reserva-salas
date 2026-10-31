describe("Fluxo de Autenticação", () => {
  it("deve manter o usuário na tela de login com credenciais inválidas", () => {
    cy.visit("/login");
    cy.get('input[type="email"]').clear().type("invalido@empresa.com");
    cy.get('input[type="password"]').clear().type("senhaerrada");
    cy.get('button[type="submit"]').click();

    // Valida que o acesso foi barrado e permaneceu no /login
    cy.url().should("include", "/login");
  });
});

describe("Gestão de Salas e Perfil", () => {
  beforeEach(() => {
    // Autentica antes de cada teste para contornar o redirecionamento
    cy.visit("/login");
    cy.get('input[type="email"]').clear().type("may@empresa.com");
    cy.get('input[type="password"]').clear().type("123456");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/salas");
  });

  it("deve renderizar o título e os cartões iniciais de salas", () => {
    cy.contains("h1", "Salas").should("be.visible");
    cy.contains("Sala Atlântico").should("be.visible");
  });

  it("deve abrir o modal de confirmação ao clicar no botão de excluir e permitir cancelamento", () => {
    cy.get('[data-testid="btn-excluir-sala"]').first().click();
    cy.contains("Excluir sala?").should("be.visible");
    cy.contains("button", "Cancelar").click();
    cy.contains("Excluir sala?").should("not.exist");
    cy.contains("Sala Atlântico").should("be.visible");
  });

  it("deve excluir uma sala da listagem ao confirmar no modal", () => {
    cy.get('[data-testid="btn-excluir-sala"]').first().click();
    cy.contains("Excluir sala?").should("be.visible");
    cy.contains("button", "Excluir sala").click();

    // Valida fechamento do modal e remoção do elemento na DOM
    cy.contains("Excluir sala?").should("not.exist");
    cy.contains("Sala Atlântico").should("not.exist");
  });

  it("deve abrir o modal de confirmação ao tentar excluir o perfil e permitir cancelamento", () => {
    cy.visit("/salas/perfil");
    cy.get('[data-testid="btn-excluir-perfil"]').click();
    cy.contains("Excluir perfil de usuário?").should("be.visible");
    cy.contains("button", "Cancelar").click();
    cy.contains("Excluir perfil de usuário?").should("not.exist");
  });

  it("deve realizar logout com sucesso e bloquear acesso a rotas protegidas", () => {
    cy.contains("Sair").click();
    cy.url().should("include", "/login");

    // Valida proteção de rota após encerramento de sessão
    cy.visit("/salas");
    cy.url().should("include", "/login");
  });
});