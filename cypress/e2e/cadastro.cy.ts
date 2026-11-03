describe("Fluxo de Cadastro de Usuário", () => {
  beforeEach(() => {
    cy.visit("/cadastro");
  });

  it("deve cadastrar um novo usuário com sucesso", () => {
    cy.intercept("POST", "**/api/auth/register", {
      statusCode: 201,
      body: {
        id: 1,
        name: "Usuário Teste",
        email: "teste.cypress@example.com",
      },
    }).as("cadastro");

    cy.get('input[name="name"]').type("Usuário Teste");

    cy.get('input[name="email"]').type(
      "teste.cypress@example.com"
    );

    cy.get('input[name="password"]').type("Teste@123456");

    cy.get('button[type="submit"]').click();

    cy.wait("@cadastro");

    cy.url().should("match", /\/(login|salas)/);
  });
});