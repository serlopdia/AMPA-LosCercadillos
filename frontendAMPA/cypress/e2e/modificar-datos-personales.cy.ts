describe('Caso de prueba: Modificar datos personales', () => {
  it('Correct data', () => {
    const randomuser1 = generateRandomMod(6);
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
    cy.get("app-sidebar-socios a:nth-of-type(1)").click();
    cy.wait(1500);
    cy.get(':nth-child(3) > .mb-4').contains('Apellidos: Para Cypress');
    cy.get(':nth-child(4) > .mb-4').contains('Email: '+randomuser1+'@test.com');
    cy.get(':nth-child(5) > .mb-4').contains('Usuario: test'+randomuser1);
    cy.get(':nth-child(7) > .mb-4').contains('DNI: 15412769D');

    cy.get("button.btn-primary").click();
    cy.wait(1500);
    cy.get("#last_name").click();
    cy.get("#last_name").clear();
    cy.get("#last_name").type("Cuenta Modificada");
    cy.get("#username").click();
    cy.get("#username").clear();
    cy.get("#username").type("modificado"+randomuser1);
    cy.get("#email").click();
    cy.get("#email").clear();
    cy.get("#email").type(randomuser1+"@modificacion.com");
    cy.get("#dni").click();
    cy.get("#dni").clear();
    cy.get("#dni").type("23148542P");
    cy.get("button.btn-success").click();
    cy.location("pathname").should("eq", "/miperfil/datos");
    cy.get(':nth-child(3) > .mb-4').contains('Apellidos: Cuenta Modificada');
    cy.get(':nth-child(4) > .mb-4').contains('Email: '+randomuser1+'@modificacion.com');
    cy.get(':nth-child(5) > .mb-4').contains('Usuario: modificado'+randomuser1);
    cy.get(':nth-child(7) > .mb-4').contains('DNI: 23148542P');
    
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
      cy.wait(1500);
    });
    cy.location("pathname").should("eq", "/");
  });
  it('Wrong data', () => {
    const randomuser2 = generateRandomMod(6);
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
    cy.get("#username").type("test"+randomuser2);
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
    cy.get("app-sidebar-socios a:nth-of-type(1)").click();
    cy.wait(1500);
    cy.get(':nth-child(3) > .mb-4').contains('Apellidos: Para Cypress');
    cy.get(':nth-child(4) > .mb-4').contains('Email: '+randomuser2+'@test.com');
    cy.get(':nth-child(5) > .mb-4').contains('Usuario: test'+randomuser2);
    cy.get(':nth-child(7) > .mb-4').contains('DNI: 15412769D');

    cy.get("button.btn-primary").click();
    cy.wait(1500);
    cy.get("#last_name").click();
    cy.get("#last_name").clear();
    cy.get("#last_name").type("Cuenta Modificada");
    cy.get("#username").click();
    cy.get("#username").clear();
    cy.get("#username").type("modificado"+randomuser2);
    cy.get("#email").click();
    cy.get("#email").clear();
    cy.get("#email").type(randomuser2+"@modificacion.com");
    cy.get("#dni").click();
    cy.get("#dni").clear();
    cy.get("button.btn-success").click();
    cy.get("#dni").click();
    cy.get("#dni").type("34456789H");
    cy.get("button.btn-success").click();
    cy.get("#dni").click();
    cy.get("#dni").clear();
    cy.get("#dni").type("23148542P");
    cy.get("button.btn-success").click();
    cy.location("pathname").should("eq", "/miperfil/datos");
    cy.get(':nth-child(3) > .mb-4').contains('Apellidos: Cuenta Modificada');
    cy.get(':nth-child(4) > .mb-4').contains('Email: '+randomuser2+'@modificacion.com');
    cy.get(':nth-child(5) > .mb-4').contains('Usuario: modificado'+randomuser2);
    cy.get(':nth-child(7) > .mb-4').contains('DNI: 23148542P');
    
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
      cy.wait(1500);
    });
    cy.location("pathname").should("eq", "/");
  });
});

function generateRandomMod(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}