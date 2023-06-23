describe('Caso de prueba: Pagar cuota', () => {
  it('passes', () => {
    const randomuser1 = generateRandomText(6);
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
    cy.get('.btn > b').click();
    cy.wait(2000);
    cy.location("href").should('include', 'checkout.stripe.com', { timeout: 10000 });
    cy.get("#email").click();
    cy.get("#email").type("test@prueba.com");
    cy.get("#cardNumber").click();
    cy.get("#cardNumber").type("4242 4242 4242 4242");
    cy.get("#cardExpiry").click();
    cy.get("#cardExpiry").type("12 / 34");
    cy.get("#cardCvc").click();
    cy.get("#cardCvc").type("567");
    cy.get("#billingName").click();
    cy.get("#billingName").type("Cuenta Testing");
    cy.get("xpath///*[@data-testid=\"hosted-payment-submit-button\"]/div[3]").click();
    cy.location("pathname").should("eq", "/success");
    cy.get("a").click();
    cy.location("pathname").should("eq", "/");
    cy.get("b").click();
    cy.get("li:nth-of-type(5) li:nth-of-type(1) > a").click();
    cy.get("a:nth-of-type(4)").click();
    cy.wait(2000);
    cy.get('[routerlink="/miperfil/datos"] > h5').click();
    cy.wait(1500);
    cy.get('.button-container > .btn > b').click();
    cy.wait(1000);
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Vas a eliminar tu cuenta. ¿Estás seguro/a?');
      cy.stub(window, 'confirm').returns(true);
    });
    cy.wait(1000);
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Si la eliminas no la podrás recuperar, PERDERÁS EL DERECHO A SOCIO, todos los datos de pedidos, pagos, etc. Definitivamente, ¿estás seguro/a?');
      cy.stub(window, 'confirm').returns(true);
    });
    cy.wait(2000);
    cy.location("pathname").should("eq", "/login-admin");
  });
  /* it('Wrong data', () => {
    const randomuser2 = generateRandomText(6);
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
    cy.location("pathname").should("eq", "/miperfil/pagos");
    cy.get("div.personal-container b").click();
    cy.url().then(url => {
      const rootUrl = new URL(url).origin;
      const expectedRootUrl = 'https://checkout.stripe.com';
      expect(rootUrl).to.equal(expectedRootUrl);
    });
    cy.get("#email").click();
    cy.get("#email").type("test@prueba.com");
    cy.get("#cardNumber").click();
    cy.get("#cardNumber").type("4000 0000 0000 0002");
    cy.get("#cardExpiry").click();
    cy.get("#cardExpiry").type("12 / 34");
    cy.get("#cardCvc").click();
    cy.get("#cardCvc").type("567");
    cy.get("#billingName").click();
    cy.get("#billingName").type("Cuenta Testing");
    cy.get("xpath///*[@data-testid=\"hosted-payment-submit-button\"]/div[3]").click();
    cy.get("[data-testid='checkout-container'] > div").click();
    cy.get("#cardNumber").type("4242 4242 4242 4242");
    cy.get("xpath///*[@data-testid=\"hosted-payment-submit-button\"]/div[3]").click();
    cy.location("pathname").should("eq", "/success");
    cy.get("a").click();
    cy.location("pathname").should("eq", "/");
    cy.get("b").click();
    cy.get("li:nth-of-type(5) li:nth-of-type(1) > a").click();
    cy.get("a:nth-of-type(4)").click();
    cy.wait(2000);
    cy.get('[routerlink="/miperfil/datos"] > h5').click();
    cy.get('.button-container > .btn > b').click();
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Vas a eliminar tu cuenta. ¿Estás seguro/a?');
      cy.stub(window, 'confirm').returns(true);
    });
    cy.on('window:confirm', (message) => {
      expect(message).to.equal('Si la eliminas no la podrás recuperar, PERDERÁS EL DERECHO A SOCIO, todos los datos de pedidos, pagos, etc. Definitivamente, ¿estás seguro/a?');
      cy.stub(window, 'confirm').returns(true);
    });
    cy.location("pathname").should("eq", "/login-admin");
  }); */
})

function generateRandomText(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}