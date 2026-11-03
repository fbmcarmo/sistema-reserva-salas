
describe("Fluxo de Login de Usuário", () => {
  const usuario = {
    id: 1,
    name: "Usuário Cypress",
    email: "teste.cypress@example.com",
  };

  const senha = "Teste@123456";

  beforeEach(() => {
    cy.visit("/login");
  });

  it("deve carregar o formulário de login", () => {
    cy.get('input[type="email"]')
      .should("be.visible");

    cy.get('input[type="password"]')
      .should("be.visible");

    cy.get('button[type="submit"]')
      .should("be.visible");
  });

  it("não deve permitir login com campos vazios", () => {
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/login");
  });

  it("deve rejeitar credenciais inválidas", () => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 401,
      body: {
        message: "E-mail ou senha inválidos.",
      },
    }).as("loginInvalido");

    cy.get('input[type="email"]')
      .type("invalido@example.com");

    cy.get('input[type="password"]')
      .type("senhaIncorreta123");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginInvalido")
      .its("response.statusCode")
      .should("eq", 401);

    cy.url().should("include", "/login");
  });

  it("deve autenticar e redirecionar para salas", () => {
    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: {
        token: "token-teste-cypress",
        user: usuario,
      },
    }).as("loginSucesso");

    cy.intercept("GET", "**/api/auth/me", {
      statusCode: 200,
      body: usuario,
    }).as("usuarioAutenticado");

    cy.intercept("GET", "**/api/rooms*", {
      statusCode: 200,
      body: [],
    }).as("listarSalas");

    cy.get('input[type="email"]')
      .type(usuario.email);

    cy.get('input[type="password"]')
      .type(senha);

    cy.get('button[type="submit"]').click();

    cy.wait("@loginSucesso")
      .its("response.statusCode")
      .should("eq", 200);

    cy.url({ timeout: 15000 })
      .should("include", "/salas");
  });
});
