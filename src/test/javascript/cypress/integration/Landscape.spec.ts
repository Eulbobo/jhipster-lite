import { interceptForever } from '../support/Interceptor';
import { dataSelector } from '../support/selector';

describe('Landscape', () => {
  beforeEach(() => cy.intercept({ path: '/api/project-folders' }, { body: '/tmp/jhlite/1234' }));

  it('Should change theme after toggle switch theme button', () => {
    cy.visit('/landscape', {
      onBeforeLoad(win) {
        cy.stub(win, 'matchMedia').withArgs('(prefers-color-scheme: dark)').returns({ matches: true })
      },
    });

    cy.get('#switch').should('exist');

    cy.get('#switch').click({ force: true });
    cy.get('.jhlite-layout--body').should('have.css', 'background-color', 'rgb(255, 255, 255)');

    cy.get('#switch').click({ force: true });
    cy.get('.jhlite-layout--body').should('have.css', 'background-color', 'rgb(15, 23, 42)');
  });

  it('Should display landscape as default page', () => {
    cy.intercept({ path: '/api/modules-landscape' }, { fixture: 'landscape.json' });
    cy.visit('/');

    cy.url().should('include', '/landscape');
  });

  it('Should apply modules using WebServices', () => {
    const result = interceptForever({ path: '/api/modules-landscape' }, { fixture: 'landscape.json' });

    cy.intercept({
      path: '/api/apply-patches',
      method: 'POST',
    }).as('modules-application');

    cy.visit('/landscape');

    cy.get(dataSelector('landscape-loader'))
      .should('be.visible')
      .then(() => {
        result.send();
        cy.get(dataSelector('landscape-loader')).should('not.exist');

        cy.get(dataSelector('init-module')).click();
        cy.get(dataSelector('parameter-packageName-field')).type('value');
        cy.get(dataSelector('modules-apply-all-button')).click();

        cy.wait('@modules-application').should(xhr => {
          const body = xhr.request.body;

          expect(body).to.deep.equal({
            modules: ['init'],
            properties: {
              projectFolder: '/tmp/jhlite/1234',
              commit: true,
              parameters: {
                packageName: 'value',
              },
            },
          });
        });
      });
  });
});
