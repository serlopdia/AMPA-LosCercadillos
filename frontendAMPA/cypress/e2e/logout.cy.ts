describe('Caso de prueba: Logout', () => {
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
    cy.get("div:nth-of-type(4) > div").click();
    cy.get("div.card-body > div:nth-of-type(1)").click();
    cy.get("app-navbar b").click();
    cy.get("li:nth-of-type(5) li:nth-of-type(2) > a").contains("Cerrar sesión");
    cy.get("li:nth-of-type(5) li:nth-of-type(2) > a").click();
    cy.location("pathname").should("eq", "/");
    cy.get("app-navbar li:nth-of-type(5) > a").contains("Iniciar sesión");
  });
});