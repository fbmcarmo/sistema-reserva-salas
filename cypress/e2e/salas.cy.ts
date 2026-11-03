
describe("Gestão de Salas e Perfil", () => {
  beforeEach(() => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: {
        token: "token-teste-cypress",
        user: {
          id: 1,
          name: "Usuário Teste",
          email: "teste.cypress@example.com",
        },
      },
    }).as("login");

    cy.intercept("GET", "**/api/auth/me", {
      statusCode: 200,
      body: {
        id: 1,
        name: "Usuário Teste",
        email: "teste.cypress@example.com",
      },
    }).as("usuarioAutenticado");

    cy.intercept("GET", "**/api/rooms*", {
      statusCode: 200,
      body: [
        {
          id: 1,
          nome: "Sala Atlântico",
          descricao: "Sala de reuniões",
          capacidade: 10,
          localizacao: "Bloco A",
          recursos: [],
          status: "ATIVA",
        },
      ],
    }).as("listarSalas");

    cy.visit("/login");

    cy.get('input[type="email"]')
      .should("be.visible")
      .type("teste.cypress@example.com");

    cy.get('input[type="password"]')
      .should("be.visible")
      .type("Teste@123456");

    cy.get('button[type="submit"]')
      .click();

    cy.wait("@login")
      .its("response.statusCode")
      .should("eq", 200);

    cy.url({ timeout: 15000 })
      .should("include", "/salas");
  });

  it("deve exibir as salas cadastradas", () => {
    cy.contains("Sala Atlântico", {
      timeout: 15000,
    }).should("be.visible");
  });
});
