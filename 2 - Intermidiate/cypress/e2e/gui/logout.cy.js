describe('Tests from logout', () => {
  beforeEach(() => {
    cy.gui_login();
    cy.visit('/');
  });

  it('successfully', () => {
    cy.gui_logout();

    cy.url().should('be.equal', `${Cypress.config('baseUrl')}/users/sign_in`);
  });
});
