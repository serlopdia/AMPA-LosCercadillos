describe('template spec', () => {
  it('Correct data', () => {
    cy.viewport(1210, 961);
    cy.visit("/login-admin");
    cy.get("#username").click();
    cy.get("#username").type("admin");
    cy.get("#password").click();
    cy.get("#password").type("admin123");
    cy.get("button").click();
    cy.location("pathname").should("eq", "/gestion/buzon");
    cy.wait(1500);
    cy.get('.dropdown > .d-flex').contains('Administrador');
    cy.get("strong").click();
    cy.get("li:nth-of-type(9) > div > ul a").click();
    cy.location("pathname").should("eq", "/login-admin");
  });
  it('Wrong data', () => {
    cy.viewport(1210, 961);
    cy.visit("/login-admin");
    cy.get("button").click();
    cy.get(':nth-child(1) > .invalid-feedback > div').contains('Debe introducir un usuario');
    cy.get(':nth-child(2) > .invalid-feedback > div').contains('Debe introducir una contraseña');
    cy.get("#username").click();
    cy.get("#username").type("admin");
    cy.get("#password").click();
    cy.get("#password").type("claveerronea");
    cy.get("button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Error: error: Credenciales inválidas.');
      cy.on('window:confirm', () => true);
    });
    cy.get("div.card-body").click();
    cy.get("#password").clear();
    cy.get("#password").type("admin123");
    cy.get("button").click();
    cy.location("pathname").should("eq", "/gestion/buzon");
    cy.wait(1500);
    cy.get('.dropdown > .d-flex').contains('Administrador');
    cy.get("strong").click();
    cy.get("li:nth-of-type(9) > div > ul a").click();
    cy.location("pathname").should("eq", "/login-admin");
  });
})