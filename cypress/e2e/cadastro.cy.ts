
describe("Fluxo de Cadastro de Usuário", () => {
  beforeEach(() => {
    cy.visit("/cadastro");
  });

  it("deve carregar o formulário de cadastro", () => {
    cy.contains("Criar conta").should("be.visible");

    cy.get('input[type="email"]').should("be.visible");

    cy.get('input[type="password"]')
      .should("have.length", 2);
  });

  it("deve cadastrar um usuário com sucesso", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 201,
      body: {
        id: 1,
        name: "Usuário Teste",
        email: "teste.cypress@example.com",
      },
    }).as("cadastro");

    cy.get('input[placeholder="Ex: May S"]')
      .type("Usuário Teste");

    cy.get('input[type="email"]')
      .type("teste.cypress@example.com");

    cy.get('input[type="password"]')
      .eq(0)
      .type("Teste@123456");

    cy.get('input[type="password"]')
      .eq(1)
      .type("Teste@123456");

    cy.contains("button", "Criar minha conta")
      .click();

    cy.wait("@cadastro")
      .its("response.statusCode")
      .should("eq", 201);

    cy.url({ timeout: 15000 })
      .should("match", /\/(login|salas)(?:[/?#]|$)/);
  });
});
