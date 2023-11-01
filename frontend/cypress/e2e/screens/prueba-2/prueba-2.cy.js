/// <reference types="cypress" />

describe("example prueba - 2", () => {

  const BASE_URL = Cypress.config("baseUrl");
  beforeEach(() => {
    cy.visit(BASE_URL);
  });

  it("cambia fuente de texto", () => {
    cy.get("#button1").click();
    cy.get("body").should(
      "have.css",
      "font-family",
      "Arial, Helvetica, sans-serif"
    );
  });
});
