describe('Caso de prueba: Manejar balance', () => {
  it('passes', () => {
    cy.viewport(1315, 961);
    cy.visit("/login-admin");
    cy.get("#username").click();
    cy.get("#username").type("admin");
    cy.get("#password").click();
    cy.get("#password").type("admin123");
    cy.get("button").click();
    cy.location("pathname").should("eq", "/gestion/buzon");
    cy.get("a:nth-of-type(2)").click();
    cy.get("form:nth-of-type(1) div:nth-of-type(1) > input").click();
    cy.get("form:nth-of-type(1) div:nth-of-type(1) > input").type("5.75");
    cy.get("form.ng-dirty div.col-sm-6 > input").click();
    cy.get("form.ng-dirty div.col-sm-6 > input").type("Test ingreso");
    cy.get("form.ng-dirty button").click();
    cy.location("pathname").should("eq", "/gestion/balances");
    cy.wait(2000);
    cy.get('div.p-1.my-container.active-cont').find('table.table-bordered').contains('Test ingreso').parents('tr').find('button.btn-primary').click();
    cy.wait(2000);
    cy.get("#asunto").click();
    cy.get("#asunto").clear();
    cy.get("#asunto").type("Cambio ingreso");
    cy.get("#cantidad").click();
    cy.get("#cantidad").clear();
    cy.get("#cantidad").type("5.9");
    cy.get("button").click();
    cy.location("pathname").should("eq", "/gestion/balances");
    cy.wait(2000);
    cy.get('div.p-1.my-container.active-cont').find('table.table-bordered').contains('Cambio ingreso').parents('tr').find('button.btn-danger').click();
    cy.location("pathname").should("eq", "/gestion/balances");
    cy.wait(2000);
    cy.get("strong").click();
    cy.get("li:nth-of-type(9) > div > ul a").click();
    cy.location("pathname").should("eq", "/login-admin");
  });
})