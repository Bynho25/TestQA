import { faker } from '@faker-js/faker';

// ============================================
// AUTHENTICATION COMMANDS
// ============================================

Cypress.Commands.add('registerUser', (userData = {}) => {
  const defaultUser = {
    nome: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(12, true),
    administrador: 'false',
  };

  const user = { ...defaultUser, ...userData };

  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/usuarios`,
    body: user,
    failOnStatusCode: false,
  }).then((response) => {
    cy.wrap({ ...user, id: response.body._id, statusCode: response.status });
  });
});

Cypress.Commands.add('loginUser', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/login`,
    body: {
      email,
      password,
    },
  }).then((response) => {
    cy.wrap({
      token: response.body.authorization,
      statusCode: response.status,
    });
  });
});

// ============================================
// UI COMMANDS
// ============================================

Cypress.Commands.add('fillLoginForm', (email, password) => {
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('fillProductForm', (productData) => {
  cy.get('input[name="nome"]').type(productData.nome);
  cy.get('input[name="preco"]').type(productData.preco);
  cy.get('textarea[name="descricao"]').type(productData.descricao);
  cy.get('input[name="quantidade"]').type(productData.quantidade);
});

// ============================================
// API COMMANDS
// ============================================

Cypress.Commands.add('createProduct', (productData = {}, token = null) => {
  const defaultProduct = {
    nome: faker.commerce.productName(),
    preco: faker.number.int({ min: 10, max: 1000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
  };

  const product = { ...defaultProduct, ...productData };
  const headers = token ? { authorization: token } : {};

  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_URL')}/produtos`,
    body: product,
    headers,
    failOnStatusCode: false,
  }).then((response) => {
    cy.wrap({
      ...product,
      _id: response.body._id,
      statusCode: response.status,
    });
  });
});

Cypress.Commands.add('getProducts', (token = null) => {
  const headers = token ? { authorization: token } : {};

  cy.request({
    method: 'GET',
    url: `${Cypress.env('API_URL')}/produtos`,
    headers,
    failOnStatusCode: false,
  }).then((response) => {
    cy.wrap({
      data: response.body,
      statusCode: response.status,
    });
  });
});

Cypress.Commands.add('deleteProduct', (productId, token = null) => {
  const headers = token ? { authorization: token } : {};

  cy.request({
    method: 'DELETE',
    url: `${Cypress.env('API_URL')}/produtos/${productId}`,
    headers,
    failOnStatusCode: false,
  }).then((response) => {
    cy.wrap({
      statusCode: response.status,
      message: response.body.message,
    });
  });
});

// ============================================
// UTILITY COMMANDS
// ============================================

Cypress.Commands.add('waitForLoader', (timeout = 5000) => {
  cy.get('.loader', { timeout }).should('be.visible');
  cy.get('.loader', { timeout }).should('not.exist');
});

Cypress.Commands.add('verifyNotification', (message, type = 'success') => {
  cy.contains('.notification', message).should('be.visible');
  cy.contains('.notification', message)
    .should('have.class', `notification-${type}`);
});

