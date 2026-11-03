
type Reserva = {
  id: number;
  roomId: number;
  startDate: string;
  endDate: string;
  status: string;
};

const salaId = 1;

function dataFutura(): string {
  const data = new Date();
  data.setDate(data.getDate() + 7);

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}


function mockSala(reservas: Reserva[] = []) {
  cy.intercept("GET", `**/api/rooms/${salaId}`, {
    statusCode: 200,
    body: {
      id: salaId,
      nome: "Sala Atlântico",
      capacidade: 10,
      descricao: "Sala para reuniões",
      localizacao: "Bloco A",
      status: "ATIVA",
    },
  }).as("buscarSala");

  cy.intercept(
    "GET",
    `**/api/rooms/${salaId}/reservations*`,
    {
      statusCode: 200,
      body: {
        roomId: salaId,
        reservations: reservas,
      },
    }
  ).as("buscarReservas");

  cy.intercept(
    "GET",
    `**/api/rooms/${salaId}/availability*`,
    {
      statusCode: 200,
      body: {
        available: true,
      },
    }
  ).as("verificarDisponibilidade");
}



function abrirSala() {
  cy.visit(`/salas/${salaId}`);

  cy.wait("@buscarSala", { timeout: 15000 });

  cy.wait("@buscarReservas", { timeout: 15000 })
    .its("response.statusCode")
    .should("eq", 200);

  cy.contains("Sala Atlântico")
    .should("be.visible");

  cy.contains("Consultando horários no banco...")
    .should("not.exist");

  cy.contains("Não foi possível consultar a disponibilidade:")
    .should("not.exist");

  cy.get("#data-reserva")
    .should("be.visible");

  cy.get("#inicio-reserva")
    .should("be.visible");

  cy.get("#fim-reserva")
    .should("be.visible");
}

function preencherPeriodo(inicio: string, fim: string) {
  cy.get("#data-reserva")
    .clear()
    .type(dataFutura())
    .should("have.value", dataFutura());

  cy.wait("@buscarReservas", {
    timeout: 15000,
  });

  cy.contains("Consultando horários no banco...")
    .should("not.exist");

  cy.get("#inicio-reserva")
    .clear()
    .type(inicio)
    .should("have.value", inicio);

  cy.get("#fim-reserva")
    .clear()
    .type(fim)
    .should("have.value", fim);
}


describe("Criação de reserva", () => {
  beforeEach(() => {
    cy.env(["TEST_EMAIL", "TEST_PASSWORD"], {
      log: false,
    }).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
      const email = TEST_EMAIL as string | undefined;
      const senha = TEST_PASSWORD as string | undefined;

      if (!email || !senha) {
        throw new Error(
          "Configure TEST_EMAIL e TEST_PASSWORD."
        );
      }

      cy.visit("/login");

      cy.get('input[type="email"]')
        .type(email);

      cy.get('input[type="password"]')
        .type(senha, { log: false });

      cy.get('button[type="submit"]')
        .click();

      cy.url({ timeout: 30000 })
        .should("include", "/salas");
    });
  });

  it("exibe os campos de reserva", () => {
    mockSala();
    abrirSala();

    cy.get("#data-reserva").should("be.visible");
    cy.get("#inicio-reserva").should("be.visible");
    cy.get("#fim-reserva").should("be.visible");

    cy.contains("button", "Confirmar Agendamento")
      .should("be.disabled");
  });

  it("impede horário final anterior ao inicial", () => {
    mockSala();
    abrirSala();

    preencherPeriodo("14:00", "13:00");

    cy.contains(
      "O horário final deve ser posterior ao inicial."
    ).should("be.visible");

    cy.contains("button", "Confirmar Agendamento")
      .should("be.disabled");
  });

  it("impede reserva em período ocupado", () => {
    const data = dataFutura();

    mockSala([
      {
        id: 99,
        roomId: salaId,
        startDate: `${data}T09:00:00`,
        endDate: `${data}T10:00:00`,
        status: "CONFIRMADA",
      },
    ]);

    abrirSala();

    preencherPeriodo("09:00", "10:00");

    cy.contains("Esse período está ocupado.")
      .should("be.visible");

    cy.contains("button", "Confirmar Agendamento")
      .should("be.disabled");
  });

  it("envia uma reserva válida sem gravar no banco", () => {
    mockSala();

    
    cy.intercept("POST", "**/api/reservations", (req) => {
    expect(req.body.roomId).to.eq(salaId);
    expect(req.body.userId).to.be.a("number");

    const inicio = new Date(req.body.startDate);
    const fim = new Date(req.body.endDate);

    expect(inicio.getTime()).not.to.be.NaN;
    expect(fim.getTime()).not.to.be.NaN;

    // A reserva deve durar exatamente uma hora.
    expect(fim.getTime() - inicio.getTime())
        .to.eq(60 * 60 * 1000);

    req.reply({
        statusCode: 201,
        body: {
        id: 123,
        ...req.body,
        status: "CONFIRMADA",
        },
    });
    }).as("criarReserva");


    abrirSala();

    preencherPeriodo("09:00", "10:00");

    cy.contains("button", "Confirmar Agendamento")
      .should("be.enabled")
      .click();

    cy.wait("@verificarDisponibilidade");
    cy.wait("@criarReserva");

    cy.url({ timeout: 15000 })
      .should("include", "/salas/minhas-reservas");
  });
});
