describe('Caso de prueba: Realizar sugerencia', () => {
  it('Correct data', () => {
    cy.visit("/");
    cy.get("li.dropdown > a").click();
    cy.get("li.dropdown li:nth-of-type(3) > a").click();
    cy.get("#nombre").click();
    cy.get("#nombre").type("Test Sugerencia");
    cy.get("#email").click();
    cy.get("#email").type("test@correo.com");
    cy.get("#titulo").click();
    cy.get("#titulo").type("Título prueba");
    cy.get("#descripcion").click();
    cy.get("#descripcion").type("Descripción prueba");
    cy.get("div.main-container button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Sugerencia mandada correctamente.');
      cy.on('window:confirm', () => true);
    });
    cy.location("pathname").should("eq", "/");
  });
  it('Wrong data', () => {
    cy.visit("/");
    cy.get("li.dropdown > a").click();
    cy.get("li.dropdown li:nth-of-type(3) > a").click();
    cy.get("#nombre").click();
    cy.get("#nombre").type("Test Sugerencia");
    cy.get("#email").click();
    cy.get("#email").type("formatocorreoerroneo");
    cy.get("div.main-container button").click();
    cy.get(':nth-child(3) > .mb-3 > .invalid-feedback > div').contains('Debe introducir un título');
    cy.get(':nth-child(4) > .mb-3 > .invalid-feedback > div').contains('Debe introducir una descripción');
    cy.get("#titulo").click();
    cy.get("#titulo").type("Título prueba");
    cy.get("#descripcion").click();
    cy.get("#descripcion").type("Descripción prueba");
    cy.get("div.main-container button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Error: email: El correo electrónico no tiene un formato válido.');
      cy.on('window:confirm', () => true);
    });
    cy.get("#email").click();
    cy.get("#email").clear();
    cy.get("#email").type("test@correo.com");
    cy.get("div.main-container button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Sugerencia mandada correctamente.');
      cy.on('window:confirm', () => true);
    });
    cy.location("pathname").should("eq", "/");
  });
});