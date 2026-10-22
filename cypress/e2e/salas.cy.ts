describe("Gestão de Salas", () => {
  beforeEach(() => {
    // 1. Acede ao ecrã de login
    cy.visit("/login");

    // 2. Preenche as credenciais e submete o formulário
    cy.get('input[type="email"]').type("may@empresa.com");
    cy.get('input[type="password"]').type("123456");
    cy.get('button[type="submit"]').click();

    // 3. Garante que a navegação para /salas foi concluída com sucesso
    cy.url().should("include", "/salas");
  });

  it("deve renderizar o título e os cartões iniciais de salas", () => {
    cy.contains("h1", "Salas").should("be.visible");
    cy.contains("Sala Atlântico").should("be.visible");
  });

  it("deve abrir o modal de confirmação ao clicar no botão de excluir", () => {
    cy.get('[data-testid="btn-excluir-sala"]').first().click();
    cy.contains("Excluir sala?").should("be.visible");
    cy.contains("button", "Cancelar").click();
    cy.contains("Excluir sala?").should("not.exist");
  });

  it("deve abrir o modal de confirmação ao tentar excluir o perfil e permitir cancelamento", () => {
    cy.visit("/salas/perfil");
    cy.get('[data-testid="btn-excluir-perfil"]').click();
    cy.contains("Excluir perfil de usuário?").should("be.visible");
    cy.contains("button", "Cancelar").click();
    cy.contains("Excluir perfil de usuário?").should("not.exist");
  });
});