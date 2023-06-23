describe('Caso de prueba: Gestión de la web', () => {
    it('Correct data', () => {
      cy.viewport(1315, 961);
      cy.visit("/login-admin");
      cy.get("#username").click();
      cy.get("#username").type("admin");
      cy.get("#password").click();
      cy.get("#password").type("admin123");
      cy.get("button").click();
      cy.location("pathname").should("eq", "/gestion/buzon");
      cy.get("a:nth-of-type(5)").click();
      cy.get("#nombre").type("Curso experimental");
      cy.get("#fecha_inicio").click();
      cy.get("#fecha_inicio").type("2030-09-01");
      cy.get("#fecha_fin").click();
      cy.get("#fecha_fin").type("2036-12-31");
      cy.get("#precio_cuota").click();
      cy.get("#precio_cuota").type("20");
      cy.get("app-gestion-cursos > div > div > div > div:nth-of-type(2) button").click();
      cy.location("pathname").should("eq", "/gestion/cursos");
      cy.get('.d-flex > .form-select').select('Curso experimental');
      cy.get('.mb-3 > .form-select').select('Infantil');
      cy.get("#curso").click();
      cy.get("#curso").type("6");
      cy.get("#letra").click();
      cy.get("#letra").type("A");
      cy.get("div.card-body button").click();
      cy.wait(1000);
      cy.get('.d-flex > .form-select').select('Curso experimental');
      cy.wait(2000);
      cy.get('[style="display: flex; justify-content: center;"] > .btn > .fa-solid').click()
      cy.get('.d-flex > .form-select').select('Curso experimental');
      cy.wait(1500);
      cy.get("button.btn-primary").click();
      cy.wait(1500);
      cy.get("button.btn-danger").click();
      cy.on('window:confirm', (message) => {
        expect(message).to.equal('¿Estás seguro de que deseas eliminar este curso escolar?');
        cy.stub(window, 'confirm').returns(true);
      });
      cy.wait(2000);
      cy.location("pathname").should("eq", "/gestion/cursos");
      cy.wait(2000);
      cy.get("strong").click();
      cy.get("li:nth-of-type(9) > div > ul a").click();
      cy.location("pathname").should("eq", "/login-admin");
    });
    it('Wrong data', () => {
      cy.viewport(1315, 961);
      cy.visit("/login-admin");
      cy.get("#username").click();
      cy.get("#username").type("admin");
      cy.get("#password").click();
      cy.get("#password").type("admin123");
      cy.get("button").click();
      cy.location("pathname").should("eq", "/gestion/buzon");
      cy.get("a:nth-of-type(5)").click();
      cy.get("#nombre").type("Curso experimental");
      cy.get("#fecha_inicio").click();
      cy.get("#fecha_inicio").type("2036-12-31");
      cy.get("#fecha_fin").click();
      cy.get("#fecha_fin").type("2030-09-01");
      cy.get("#precio_cuota").click();
      cy.get("#precio_cuota").type("20");
      cy.get("app-gestion-cursos > div > div > div > div:nth-of-type(2) button").click();
      cy.on('window:alert', (message) => {
        expect(message).to.equal('Error: non_field_errors: La fecha de finalización debe ser posterior a la fecha de inicio');
        cy.on('window:confirm', () => true);
      });
      cy.get("#fecha_inicio").click();
      cy.get("#fecha_inicio").clear();
      cy.get("#fecha_inicio").type("2030-09-01");
      cy.get("#fecha_fin").click();
      cy.get("#fecha_fin").clear();
      cy.get("#fecha_fin").type("2036-12-31");
      cy.get("app-gestion-cursos > div > div > div > div:nth-of-type(2) button").click();
      cy.location("pathname").should("eq", "/gestion/cursos");
      cy.get('.d-flex > .form-select').select('Curso experimental');
      cy.get('.mb-3 > .form-select').select('Infantil');
      cy.get("#curso").click();
      cy.get("#curso").type("6");
      cy.get("#letra").click();
      cy.get("#letra").type("A");
      cy.get("div.card-body button").click();
      cy.wait(1000);
      cy.get('.d-flex > .form-select').select('Curso experimental');
      cy.wait(2000);
      cy.get('[style="display: flex; justify-content: center;"] > .btn > .fa-solid').click()
      cy.get('.d-flex > .form-select').select('Curso experimental');
      cy.wait(1500);
      cy.get("button.btn-primary").click();
      cy.wait(1500);
      cy.get("button.btn-danger").click();
      cy.on('window:confirm', (message) => {
        expect(message).to.equal('¿Estás seguro de que deseas eliminar este curso escolar?');
        cy.stub(window, 'confirm').returns(true);
      });
      cy.wait(2000);
      cy.location("pathname").should("eq", "/gestion/cursos");
      cy.wait(2000);
      cy.get("strong").click();
      cy.get("li:nth-of-type(9) > div > ul a").click();
      cy.location("pathname").should("eq", "/login-admin");
    });
  })