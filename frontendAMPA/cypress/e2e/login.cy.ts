describe('Caso de prueba: Login', () => {
  it('Correct data', () => {
    cy.viewport(1210, 961);
    cy.visit("/");
    cy.get("app-navbar li:nth-of-type(5) > a").contains("Iniciar sesión");
    cy.get("app-navbar li:nth-of-type(5) > a").click();
    cy.get("#username").click();
    cy.get("#username").type("testing");
    cy.get("#password").click();
    cy.get("#password").type("t3st4mp4");
    cy.get("button").click();
    cy.location("pathname").should("eq", "/miperfil/datos");
    cy.wait(1500);
    cy.get('.fs-4').contains('DATOS PERSONALES');
    cy.get('.card-body > :nth-child(5)').contains('Usuario: testing')
    cy.get("div:nth-of-type(4) > div").click();
    cy.get("div.card-body > div:nth-of-type(1)").click();
    cy.get("app-navbar b").click();
    cy.get("li:nth-of-type(5) li:nth-of-type(2) > a").click();
    cy.location("pathname").should("eq", "/");
  });
  it('Wrong data', () => {
    cy.viewport(1210, 961);
    cy.visit("/");
    cy.get("app-navbar li:nth-of-type(5) > a").contains("Iniciar sesión");
    cy.get("app-navbar li:nth-of-type(5) > a").click();
    cy.get("button").click();
    cy.get(':nth-child(1) > .invalid-feedback > div').contains('Debe introducir un usuario');
    cy.get(':nth-child(2) > .invalid-feedback > div').contains('Debe introducir una contraseña');
    cy.get("#username").click();
    cy.get("#username").type("testing");
    cy.get("#password").click();
    cy.get("#password").type("hola");
    cy.get("button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Error: error: Credenciales inválidas.');
      cy.on('window:confirm', () => true);
    });
    cy.get("div.card-body").click();
    cy.get("#password").clear();
    cy.get("#password").type("t3st4mp4");
    cy.get("button").click();
    cy.location("pathname").should("eq", "/miperfil/datos");
    cy.wait(1500);
    cy.get('.fs-4').contains('DATOS PERSONALES');
    cy.get('.card-body > :nth-child(5)').contains('Usuario: testing')
    cy.get("div:nth-of-type(4) > div").click();
    cy.get("div.card-body > div:nth-of-type(1)").click();
    cy.get("app-navbar b").click();
    cy.get("li:nth-of-type(5) li:nth-of-type(2) > a").click();
    cy.location("pathname").should("eq", "/");
  });
});