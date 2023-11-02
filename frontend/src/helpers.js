export const generateTestFile = (actions) => {
    const actionsCode = actions.join('\n    ');
    return `
  /// <reference types="cypress" />
  
  describe("Prueba grabada", () => {
    const BASE_URL = Cypress.config('baseUrl');
    beforeEach(() => {
      cy.visit(BASE_URL);
    });
  
    it("Acciones grabadas", () => {
      ${actionsCode}
    });
  });
    `;
  };
  
  
  export const downloadTestFile = (content) => {
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "temp.cy.js";
    a.click();
    URL.revokeObjectURL(url);
  };
  