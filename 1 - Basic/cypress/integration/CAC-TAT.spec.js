/// <reference types="Cypress">
import '../support/commands.js';

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

  // AULA 1 ----------------------------------------------//----------------------------------------------
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
      .type('67999068912')
      .should('have.value', '67999068912')
      .clear()
      .should('have.value', '');
  });
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
    cy.contains('button', 'Enviar').click();
    cy.get('.error');
  });

  // AULA 2 ----------------------------------------------//----------------------------------------------
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

  // AULA 3 ----------------------------------------------//----------------------------------------------
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

  // AULA 4 ----------------------------------------------//----------------------------------------------
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
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
    cy.get('#firstName').type('Gabriel', { delay: 0 });
    cy.get('#lastName').type('Mendes Fonseca');
    cy.get('#email').type('gabrielincicle@gmail.com');
    cy.get('#phone').type('Gabriel').should('have.value', '');
    cy.get('#phone').should('have.text', '');
    cy.get('#phone-checkbox').check(); //.click()
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress');
    cy.get('.button[type="submit"]').click();
    cy.get('.error').should('be.visible');
  });

  // AULA 5 ----------------------------------------------//----------------------------------------------
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

  // AULA 6 ----------------------------------------------//----------------------------------------------
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
    cy.get('#privacy a').should('have.attr', 'target', '_blank');
  });
  it('acessa a página de politica de privacidade removendo o target e então clicando no link', function () {
    cy.get('#privacy a').invoke('removeAttr', 'target').click();
    cy.contains('Talking About Testing').should('be.visible');
  });

  // AULA 8 ----------------------------------------------//----------------------------------------------
  it('verifica se o alerta de erro some após 3 segundos', function () {
    cy.clock();
    cy.get('.button[type="submit"]').click();
    cy.get('.error').should('be.visible');
    cy.tick(3000);
    cy.get('.error').should('not.be.visible');
  });
  it('verifica se o alerta de sucesso some após 3 segundos', function () {
    cy.clock();
    cy.get('#firstName').type('Gabriel', { delay: 0 });
    cy.get('#lastName').type('Mendes Fonseca');
    cy.get('#email').type('gabrielincicle@gmail.com');
    cy.get('#phone').type('67999068912');
    cy.get('.button[type="submit"]').click();
    cy.get('.success').should('be.visible');
    cy.tick(3000);
    cy.get('.success').should('not.be.visible');
  });

  // AULA 9 ----------------------------------------------//----------------------------------------------
  it('Loadash tests', function () {
    Cypress._.times(5, () => {
      cy.get('#firstName').type('Gabriel', { delay: 0 });
      cy.get('#lastName').type('Mendes Fonseca');
      cy.get('#email').type(
        'gabe' + Cypress._.random(1000, 9999) + '@gmail.com',
      );
      cy.get('#phone').type('67999068912');
      cy.get('#open-text-area').type(
        'Bem vindo ao curso de Cypress' +
          Cypress._.repeat('!', Cypress._.random(1, 10)),
      );
      cy.get('.button[type="submit"]').click();
    });
  });

  // AULA 10 ----------------------------------------------//----------------------------------------------
  it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function () {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible');
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible');
  });

  // AULA 11 ----------------------------------------------//----------------------------------------------
  it('preenche a area de texto usando o comando invoke', function () {
    cy.get('#open-text-area')
      .invoke('val', 'Bem vindo ao curso de Cypress')
      .should('have.value', 'Bem vindo ao curso de Cypress');
  });

  // AULA 12 ----------------------------------------------//----------------------------------------------
  it('faz uma requisição HTTP', function () {
    cy.request(
      'GET',
      'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html',
    ).should(function (response) {
      expect(response.status).to.equal(200);
      expect(response.statusText).to.equal('OK');
      expect(response.body).to.include('Central de Atendimento ao Cliente TAT');
    });
  });

  // AULA 13 ----------------------------------------------//----------------------------------------------
  it.only('encontra o gato escondido', function () {
    cy.get('#cat').should('not.be.visible');
    cy.get('#cat').invoke('show').should('be.visible');
    cy.get('#title')
      .invoke('text', 'Gato escondido')
      .should('be.equal', 'Gato escondido');
  });
});
