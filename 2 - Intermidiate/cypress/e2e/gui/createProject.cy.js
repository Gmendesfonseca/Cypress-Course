import { faker } from '@faker-js/faker';

describe('Tests from createProject', () => {
  beforeEach(() => {
    cy.api_deleteProjects();
    cy.gui_login();
  });

  it('successfully', () => {
    const project = {
      name: `project-${faker.datatype.uuid()}`,
      description: faker.random.words(5),
    };

    cy.gui_createProject(project);

    cy.url().should(
      'be.equal',
      `${Cypress.config('baseUrl')}/${Cypress.env('user_name')}/${
        project.name
      }`,
    );
    cy.contains(project.name).should('be.visible');
    cy.contains(project.description).should('be.visible');
  });
});
