/// <reference types="cypress" />

describe('API - Products', () => {
  const apiUrl = Cypress.env('API_URL');
  let authToken;

  before(() => {
    // Setup: Create user and get token for authenticated tests
    const adminUser = {
      nome: `Admin ${Date.now()}`,
      email: `admin.${Date.now()}@test.com`,
      password: 'AdminPassword@123',
      administrador: 'true',
    };

    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: adminUser,
    }).then((response) => {
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          email: adminUser.email,
          password: adminUser.password,
        },
      }).then((loginResponse) => {
        authToken = loginResponse.body.authorization;
      });
    });
  });

  /**
   * SCENARIO 1 (POSITIVE): Create product with valid data
   * - Creates new product via API
   * - Verifies status 201
   * - Validates returned fields
   * - Confirms product is created with unique ID
   */
  it('Should successfully create a product [POSITIVE]', () => {
    const novoProduto = {
      nome: 'Teclado Mecânico RGB',
      preco: 350,
      descricao: 'Teclado mecânico com iluminação RGB personalizada',
      quantidade: 20,
    };

    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      body: novoProduto,
      headers: { authorization: authToken },
    }).then((response) => {
      // Validations
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.nome).to.equal(novoProduto.nome);
      expect(response.body.preco).to.equal(novoProduto.preco);
      expect(response.body.descricao).to.equal(novoProduto.descricao);
      expect(response.body.quantidade).to.equal(novoProduto.quantidade);

      // ID should not be empty
      expect(response.body._id).to.not.be.empty;
      expect(response.body._id).to.be.a('string');
    });
  });

  /**
   * SCENARIO 2 (NEGATIVE): Fail to create product without required fields
   * - Attempts to create product without "name" field
   * - Verifies status 400
   * - Validates error message about required field
   */
  it('Should fail to create product without name [NEGATIVE]', () => {
    const produtoInvalido = {
      preco: 500,
      descricao: 'Produto sem nome',
      quantidade: 10,
    };

    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      body: produtoInvalido,
      headers: { authorization: authToken },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.equal(400);
      expect(response.body.message).to.exist;
      expect(response.body.message).to.include('nome');
    });
  });

  /**
   * SCENARIO 3 (POSITIVE): List products with pagination
   * - Retrieves product list
   * - Verifies status 200
   * - Validates response structure
   * - Confirms products are present in list
   */
  it('Should successfully list products [POSITIVE]', () => {
    // First create a product
    const produto = {
      nome: `Monitor 4K ${Date.now()}`,
      preco: 1200,
      descricao: 'Monitor Ultra HD com 60Hz',
      quantidade: 5,
    };

    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      body: produto,
      headers: { authorization: authToken },
    }).then(() => {
      // Then list all products
      cy.request({
        method: 'GET',
        url: `${apiUrl}/produtos`,
      }).then((response) => {
        // Validações
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('quantidade');
        expect(response.body).to.have.property('produtos');
        expect(response.body.produtos).to.be.an('array');

      // Should have at least one product
        expect(response.body.quantidade).to.be.greaterThan(0);
        expect(response.body.produtos.length).to.be.greaterThan(0);

        // Validate structure of each product
        response.body.produtos.forEach((prod) => {
          expect(prod).to.have.property('_id');
          expect(prod).to.have.property('nome');
          expect(prod).to.have.property('preco');
          expect(prod).to.have.property('quantidade');
        });
      });
    });
  });
});

