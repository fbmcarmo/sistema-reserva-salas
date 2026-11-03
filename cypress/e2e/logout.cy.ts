
describe("Fluxo de Logout de Usuário", () => {
  const usuario = {
    id: 1,
    name: "Usuário Cypress",
    email: "teste.cypress@example.com",
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.intercept("POST", "**/api/auth/login", {
      statusCode: 200,
      body: {
        token: "token-teste-cypress",
        user: usuario,
      },
    }).as("login");

    cy.intercept("GET", "**/api/auth/me", {
      statusCode: 200,
      body: usuario,
    }).as("usuarioAutenticado");

    cy.intercept("GET", "**/api/rooms*", {
      statusCode: 200,
      body: [],
    }).as("listarSalas");

    cy.intercept("POST", "**/api/auth/logout", {
      statusCode: 200,
      body: {
        message: "Logout realizado com sucesso.",
      },
    }).as("logout");

    cy.visit("/login");

    cy.get('input[type="email"]')
      .should("be.visible")
      .type(usuario.email);

    cy.get('input[type="password"]')
      .should("be.visible")
      .type("Teste@123456");

    cy.get('button[type="submit"]').click();

    cy.wait("@login");

    cy.url({ timeout: 15000 })
      .should("include", "/salas");
  });

  it("deve exibir a opção de sair", () => {
    cy.contains("button", /sair|logout/i)
      .should("be.visible");
  });

  it("deve encerrar a sessão e redirecionar para login", () => {
    cy.contains("button", /sair|logout/i)
      .click();

    cy.url({ timeout: 15000 })
      .should("include", "/login");
  });

  it("deve remover o token de autenticação", () => {
    cy.contains("button", /sair|logout/i)
      .click();

    cy.url({ timeout: 15000 })
      .should("include", "/login");

    cy.getCookie("token")
      .should("be.null");

    cy.window().then((win) => {
      expect(win.localStorage.getItem("user"))
        .to.be.null;
    });
  });

  it("deve impedir acesso às salas após logout", () => {
    cy.contains("button", /sair|logout/i)
      .click();

    cy.url({ timeout: 15000 })
      .should("include", "/login");

    cy.visit("/salas");

    cy.url({ timeout: 15000 })
      .should("include", "/login");
  });

  it("deve impedir acesso às minhas reservas após logout", () => {
    cy.contains("button", /sair|logout/i)
      .click();

    cy.url({ timeout: 15000 })
      .should("include", "/login");

    cy.visit("/salas/minhas-reservas");

    cy.url({ timeout: 15000 })
      .should("include", "/login");
  });
});
