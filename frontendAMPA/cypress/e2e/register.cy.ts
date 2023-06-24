describe('Caso de prueba: Register', () => {
  it('Correct data', () => {
    const randomuser1 = generateRandomReg(6);
    cy.viewport(1210, 961);
    cy.visit("/");
    cy.get("b").click();
    cy.get("#first_name").click();
    cy.get("#first_name").type("Test");
    cy.get("#last_name").click();
    cy.get("#last_name").type("Para Cypress");
    cy.get("#email").click();
    cy.get("#email").type(randomuser1+"@test.com");
    cy.get("#username").click();
    cy.get("#username").type("test"+randomuser1);
    cy.get("#password").click();
    cy.get("#password").type("t3st4mp4");
    cy.get("#password_confirm").click();
    cy.get("#password_confirm").type("t3st4mp4");
    cy.get("#tel").click();
    cy.get("#tel").type("612345789");
    cy.get("#dni").click();
    cy.get("#dni").type("15412769D");
    cy.get("#address").click();
    cy.get("#address").type("Calle Suárez 44");
    cy.get("button").click();
    cy.wait(1500);
    cy.location("pathname").should("eq", "/miperfil/pagos");
    cy.get('[routerlink="/miperfil/datos"] > h5').click()
    cy.wait(1500);
    cy.get('.button-container > .btn > b').click();
    cy.wait(1000);
    cy.window().then((win) => {
      const confirmStub = cy.stub(win, 'confirm');
      cy.on('window:confirm', (message) => {
        if (message === 'Vas a eliminar tu cuenta. ¿Estás seguro/a?') {
          confirmStub.returns(true);
        } else if (message === 'Si la eliminas no la podrás recuperar, PERDERÁS EL DERECHO A SOCIO, todos los datos de pedidos, pagos, etc. Definitivamente, ¿estás seguro/a?') {
          confirmStub.returns(true);
        }
      });
      cy.wait(1000);
    });
    cy.wait(2000);
    cy.location("pathname").should("eq", "/");
  });
  it('Wrong data', () => {
    const randomuser2 = generateRandomReg(6);
    cy.viewport(1210, 961);
    cy.visit("/");
    cy.get("b").click();
    cy.get("#first_name").click();
    cy.get("#first_name").type("Test");
    cy.get("#last_name").click();
    cy.get("#last_name").type("Para Cypress");
    cy.get("#email").click();
    cy.get("#email").type(randomuser2+"@test.com");
    cy.get("#username").click();
    cy.get("#username").type("testing");
    cy.get("#password").click();
    cy.get("#password").type("t3st4mp4");
    cy.get("#password_confirm").click();
    cy.get("#password_confirm").type("t3st4mp4");
    cy.get("#dni").click();
    cy.get("#dni").type("15412769D");
    cy.get("#address").click();
    cy.get("#address").type("Calle Suárez 44");
    cy.get("button").click();
    cy.get(':nth-child(4) > :nth-child(1) > .invalid-feedback > div').contains('Debe introducir un número de teléfono');
    cy.get("#tel").click();
    cy.get("#tel").type("612345789");
    cy.get("button").click();
    cy.on('window:alert', (message) => {
      expect(message).to.equal('Error: Error desconocido, el usuario o email pueden estar ya en uso.');
      cy.on('window:confirm', () => true);
    });
    cy.get("#username").click();
    cy.get("#username").type("test"+randomuser2);
    cy.get("button").click();
    cy.wait(1500);
    cy.location("pathname").should("eq", "/miperfil/pagos");
    cy.get('[routerlink="/miperfil/datos"] > h5').click()
    cy.wait(1500);
    cy.get('.button-container > .btn > b').click();
    cy.wait(1000);
    cy.window().then((win) => {
      const confirmStub = cy.stub(win, 'confirm');
      cy.on('window:confirm', (message) => {
        if (message === 'Vas a eliminar tu cuenta. ¿Estás seguro/a?') {
          confirmStub.returns(true);
        } else if (message === 'Si la eliminas no la podrás recuperar, PERDERÁS EL DERECHO A SOCIO, todos los datos de pedidos, pagos, etc. Definitivamente, ¿estás seguro/a?') {
          confirmStub.returns(true);
        }
      });
      cy.wait(1000);
    });
    cy.wait(2000);
    cy.location("pathname").should("eq", "/");
  });
});

function generateRandomReg(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}