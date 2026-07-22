/// <reference types="cypress" />

describe('API - Authentication and Users', () => {
  const apiUrl = Cypress.env('API_URL');

  beforeEach(() => {
    cy.fixture('users.json').as('userData');
  });

  /**
   * SCENARIO 1 (POSITIVE): Successfully register a new user
   * - Validates new user registration in API
   * - Verifies response with status 201
   * - Validates presence of generated ID
   */
  it('Should register a new user successfully [POSITIVE]', function () {
    const newUser = {
      nome: 'Ana Paula Silva',
      email: `ana.paula.${Date.now()}@test.com`,
      password: 'SecurePassword@123',
      administrador: 'false',
    };

    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: newUser,
      failOnStatusCode: false,
    }).then((response) => {
      // Positive validations
      expect(response.status).to.equal(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.nome).to.equal(newUser.nome);
      expect(response.body.email).to.equal(newUser.email);
      expect(response.body.administrador).to.equal(newUser.administrador);

      // Check if ID is valid
      expect(response.body._id).to.not.be.empty;
    });
  });

  /**
   * SCENARIO 2 (NEGATIVE): Fail when registering user with duplicate email
   * - Attempts to register user with existing email
   * - Verifies response with status 400
   * - Validates appropriate error message
   */
  it('Should fail when registering user with duplicate email [NEGATIVE]', function () {
    const duplicateEmail = 'user.duplicate@test.com';

    // First registration (success)
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: {
        nome: 'First User',
        email: duplicateEmail,
        password: 'Password@123',
        administrador: 'false',
      },
    }).then((firstResponse) => {
      expect(firstResponse.status).to.equal(201);

      // Second registration with same email (fail)
      cy.request({
        method: 'POST',
        url: `${apiUrl}/usuarios`,
        body: {
          nome: 'Second User',
          email: duplicateEmail,
          password: 'AnotherPassword@123',
          administrador: 'false',
        },
        failOnStatusCode: false,
      }).then((secondResponse) => {
        expect(secondResponse.status).to.equal(400);
        expect(secondResponse.body.message).to.include('Email already registered');
      });
    });
  });

  /**
   * SCENARIO 3 (POSITIVE): Login with valid credentials
   * - Authenticates user with correct credentials
   * - Verifies status 200
   * - Validates presence of authorization token
   * - Validates JWT token structure
   */
  it('Should successfully login [POSITIVE]', function () {
    const user = {
      nome: 'Login Test User',
      email: `user.login.${Date.now()}@test.com`,
      password: 'LoginPassword@123',
      administrador: 'false',
    };

    // First register a new user
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: user,
    }).then((registerResponse) => {
      expect(registerResponse.status).to.equal(201);

      // Then attempt to login with credentials
      cy.request({
        method: 'POST',
        url: `${apiUrl}/login`,
        body: {
          email: user.email,
          password: user.password,
        },
      }).then((loginResponse) => {
        // Validations
        expect(loginResponse.status).to.equal(200);
        expect(loginResponse.body).to.have.property('authorization');

        // JWT token should have 3 parts separated by dot
        const token = loginResponse.body.authorization;
        expect(token.split('.')).to.have.lengthOf(3);

        // Validate that user data is returned
        expect(loginResponse.body).to.have.property('_id');
        expect(loginResponse.body.email).to.equal(user.email);
      });
    });
  });
});
