/// <reference types="cypress" />

describe("example prueba", () => {
  
  const BASE_URL = Cypress.config('baseUrl');
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it("cambia color de fondo", () => {
    cy.get("#button1").click();
    cy.get("body").should("have.css", "background-color", "rgb(255, 0, 0)");
  });

  it("cambia texto", () => {
    cy.get("#button2").click();
    cy.get("#button2").should("have.text", "Texto cambiado");
  });
});
