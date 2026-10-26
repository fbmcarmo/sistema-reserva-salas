describe("Fluxo de Cadastro de Usuário", () => {
  beforeEach(() => {
    // Acede diretamente à rota de registo
    cy.visit("/cadastro");
  });

  it("deve carregar os campos essenciais do formulário de cadastro", () => {
    cy.contains("h2", "Criar conta").should("be.visible");
    cy.get('input[type="text"]').should("be.visible");
    cy.get('input[type="email"]').should("be.visible");
    cy.get('input[type="password"]').should("have.length.at.least", 1);
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("deve validar o bloqueio ao tentar submeter o formulário vazio", () => {
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/cadastro");
  });

  it("deve cadastrar um novo usuário com sucesso e redirecionar", () => {
    const emailUnico = `usuario.${Date.now()}@empresa.com`;

    cy.get('input[type="text"]').first().clear().type("Novo Usuário");
    cy.get('input[type="email"]').clear().type(emailUnico);

    // Preenche a palavra-passe e a confirmação
    cy.get('input[type="password"]').first().clear().type("123456");
    cy.get('input[type="password"]').last().clear().type("123456");

    cy.get('button[type="submit"]').click();

    // Aguarda o redirecionamento após o registo com tolerância de rede
    cy.url({ timeout: 10000 }).should("match", /\/(login|salas)/);
  });
});