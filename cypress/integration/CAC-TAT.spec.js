/// <reference types="Cypress">
import 'C:/Users/InCicle sistemas 7/Documents/CypressBasic/cypress/support/commands.js';

describe('Central de Atendimento ao Cliente TAT', function () {
  beforeEach(function () {
    cy.visit('./src/index.html');
    cy.fillMandatoryFieldsAndSubmit(
      'Gabriel',
      'Mendes Fonseca',
      'gabrielincicle@gmail.com',
      'Bem vindo ao curso de Cypress',
    );
  });
  it('verifica o título da aplicação', function () {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
  });
  it('preenche os campos obrigatórios e envia o formulário', function () {
    cy.get('#firstName').type('Gabriel', { delay: 0 });
    cy.get('#lastName').type('Mendes Fonseca');
    cy.get('#email').type('gabrielincicle@gmail.com');
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress');
    cy.get('.button[type="submit"]').click();
  });
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
    cy.get('#firstName').type('Gabriel', { delay: 0 });
    cy.get('#lastName').type('Mendes Fonseca');
    cy.get('#email').type('gabrielinciclegmail.com');
    cy.get('#phone').type('Gabriel');
    cy.get('#phone').should('have.text', '');
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress');
    cy.get('.button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  });
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
    cy.get('#firstName').type('Gabriel', { delay: 0 });
    cy.get('#lastName').type('Mendes Fonseca');
    cy.get('#email').type('gabrielinciclegmail.com');
    cy.get('#phone').type('Gabriel').should('have.value', '');
    cy.get('#phone').should('have.text', '');
    cy.get('#phone-checkbox').check(); //.click()
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress');
    cy.get('.button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  });
  it('preenche e limpa os campos nome, sobrenome, email e telefone', function () {
    cy.get('#firstName')
      .type('Gabriel', { delay: 0 })
      .should('have.value', 'Gabriel')
      .clear()
      .should('have.value', '');
    cy.get('#lastName')
      .type('Mendes Fonseca')
      .should('have.value', 'Mendes Fonseca')
      .clear()
      .should('have.value', '');
    cy.get('#email')
      .type('gabrielincicle@gmail.com')
      .should('have.value', 'gabrielincicle@gmail.com')
      .clear()
      .should('have.value', '');
    cy.get('#phone')
      .type('35999068911')
      .should('have.value', '35999068911')
      .clear()
      .should('have.value', '');
  });
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
    cy.contains('button', 'Enviar').click();
    cy.get('.error');
  });
  it('seleciona um produto (YouTube) por seu texto', function () {
    cy.get('#product').select('YouTube');
    cy.get('#product').should('have.value', 'youtube');
  });
  it('seleciona um produto (Mentoria) por seu valor', function () {
    cy.get('#product').select('mentoria');
    cy.get('#product').should('have.value', 'mentoria');
  });
  it('seleciona um produto (Blog) por seu índice', function () {
    cy.get('#product').select(1);
    cy.get('#product').should('have.value', 'blog');
  });
  it('marca o tipo de atendimento "Feedback"', function () {
    cy.get('input[type="radio"][value="feedback"]')
      .check('feedback')
      .should('have.value', 'feedback');
  });
  it('marca cada tipo de atendimento (V1)', function () {
    cy.get('input[type="radio"]').check('feedback').should('be.checked');
    cy.get('input[type="radio"]').check('ajuda').should('be.checked');
    cy.get('input[type="radio"]').check('elogio').should('be.checked');
  });
  it('marca cada tipo de atendimento (V2)', function () {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function ($radio) {
        cy.wrap($radio).check().should('be.checked');
      });
  });
  it('marca ambos checkboxes, depois desmarca o último', function () {
    cy.get('input[type="checkbox"]')
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked');
    //cy.get('input[type="checkbox"][value="phone"]').uncheck()
    cy.get('input[type="checkbox"]');
  });
  it('seleciona um arquivo da pasta fixtures', function () {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });
  it('seleciona um arquivo simulando um drag-and-drop', function () {
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
    cy.fixture('example.json').as('example');
    cy.get('input[type="file"]#file-upload')
      .should('not.have.value')
      .selectFile('@example')
      .should(function ($input) {
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });
});
