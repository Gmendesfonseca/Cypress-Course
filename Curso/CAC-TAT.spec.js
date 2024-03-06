/// <reference types="Cypress">
import '/home/rb-cesar/Documentos/cypress-basico-v2-main/cypress//support/commands.js'

describe('Central de Atendimento ao Cliente TAT', function() {
  beforeEach(function(){
    cy.visit('./src/index.html')
    cy.fillMandatoryFieldsAndSubmit('Gabriel','Mendes Fonseca','gabrielincicle@gmail.com','Bem vindo ao curso de Cypress')
  })
  it('verifica o título da aplicação', function() {
    cy.title().should('be.equal','Central de Atendimento ao Cliente TAT')
  })
  it('preenche os campos obrigatórios e envia o formulário', function() {
    cy.get('#firstName').type('Gabriel', {delay: 0})
    cy.get('#lastName').type('Mendes Fonseca')
    cy.get('#email').type('gabrielincicle@gmail.com')
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress')
    cy.get('.button[type="submit"]').click()
  })
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
    cy.get('#firstName').type('Gabriel', {delay: 0})
    cy.get('#lastName').type('Mendes Fonseca')
    cy.get('#email').type('gabrielinciclegmail.com')
    cy.get('#phone').type('Gabriel')
    cy.get('#phone').should('have.text','')
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress')
    cy.get('.button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
    cy.get('#firstName').type('Gabriel', {delay: 0})
    cy.get('#lastName').type('Mendes Fonseca')
    cy.get('#email').type('gabrielinciclegmail.com')
    cy.get('#phone').type('Gabriel').should('have.value','')
    cy.get('#phone').should('have.text','')
    cy.get('#phone-checkbox').click()
    cy.get('#open-text-area').type('Bem vindo ao curso de Cypress')
    cy.get('.button[type="submit"]').click()
    cy.get('.error').should('be.visible')
  })
  it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
    cy.get('#firstName').type('Gabriel', {delay: 0}).should('have.value','Gabriel').clear().should('have.value', '')
    cy.get('#lastName').type('Mendes Fonseca').should('have.value','Mendes Fonseca').clear().should('have.value', '')
    cy.get('#email').type('gabrielincicle@gmail.com').should('have.value','gabrielincicle@gmail.com').clear().should('have.value', '')
    cy.get('#phone').type('35999068911').should('have.value','35999068911').clear().should('have.value', '')
  })
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
    cy.contains('Enviar').click()
    cy.get('.error')
  })
})