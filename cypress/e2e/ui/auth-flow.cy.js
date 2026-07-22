/// <reference types="cypress" />

describe('E2E - Authentication and Login', () => {
  const baseUrl = Cypress.env('BASE_URL');

  beforeEach(() => {
    cy.visit('/');
    cy.fixture('users.json').as('userData');
  });

  /**
   * SCENARIO 1 (POSITIVE): Access login page
   * - Navigates to home page
   * - Validates correct loading
   * - Verifies critical page elements
   * - Validates title and URL
   */
  it('Should successfully load login page [POSITIVE]', () => {
    // Check URL
    cy.url().should('include', baseUrl);

    // Check page title
    cy.get('title').should('exist');

    // Check presence of main elements
    cy.get('h1, h2, .title, .heading').first().should('be.visible');

    // Check login fields
    cy.get('input[type="email"], input[placeholder*="email" i]')
      .should('be.visible')
      .and('have.attr', 'placeholder');

    cy.get('input[type="password"], input[placeholder*="password" i]')
      .should('be.visible')
      .and('have.attr', 'placeholder');

    // Check submit button
    cy.get('button[type="submit"], button:contains("Login"), button:contains("Entrar")')
      .should('be.visible');
  });

  /**
   * SCENARIO 2 (NEGATIVE): Attempt login with invalid credentials
   * - Fills form with incorrect email/password
   * - Attempts to login
   * - Validates appropriate error message
   * - Verifies that user is not authenticated
   */
  it('Should display error when logging in with invalid credentials [NEGATIVE]', () => {
    // Fill form with invalid data
    cy.get('input[type="email"], input[placeholder*="email" i]').type(
      'usuario.inexistente@test.com'
    );
    cy.get('input[type="password"], input[placeholder*="password" i]').type(
      'senhaErrada123'
    );

    // Click login button
    cy.get('button[type="submit"], button:contains("Login"), button:contains("Entrar")')
      .click();

    // Wait for response and validate error
    cy.get(
      '.error-message, .alert-danger, .notification-error, [class*="error"]',
      { timeout: 5000 }
    )
      .should('be.visible')
      .then(($element) => {
        // Element should contain an error message
        const errorText = $element.text().toLowerCase();
        expect(errorText).to.match(
          /incorreto|inválido|não encontrado|falhou|erro/i
        );
      });

    // Verify that page does not redirect
    cy.url().should('include', baseUrl);
  });

  /**
   * SCENARIO 3 (POSITIVE): Validate new user registration flow
   * - Accesses registration page
   * - Fills form with valid data
   * - Submits the form
   * - Validates registration success
   * - Verifies appropriate redirection
   */
  it('Should successfully register new user [POSITIVE]', () => {
    // Find and click registration link/button
    cy.get('a, button')
      .contains(/Registrar|Cadastr|Sign up|Nova conta/i)
      .should('be.visible')
      .click();

    // Validate that arrived at registration page
    cy.url().should('include', baseUrl);
    cy.get('input[type="text"], input[name="nome"]')
      .should('be.visible');

    // Fill form with valid data
    const novoUsuario = {
      nome: 'Novo Usuário Teste',
      email: `usuario.novo.${Date.now()}@test.com`,
      password: 'SenhaSegura@123456',
    };

    cy.get('input[type="text"], input[name="nome"]').type(novoUsuario.nome);
    cy.get('input[type="email"], input[name="email"]').type(
      novoUsuario.email
    );
    cy.get('input[type="password"], input[name="password"]')
      .first()
      .type(novoUsuario.password);

    // Confirm password (if field exists)
    cy.get(
      'input[placeholder*="Confirme"], input[name="confirmPassword"], input[name="password"]'
    )
      .last()
      .then(($el) => {
        if ($el.length > 0 && $el.attr('placeholder')) {
          cy.wrap($el).type(novoUsuario.password);
        }
      });

    // Submeter formulário
    cy.get('button[type="submit"], button:contains("Registr"), button:contains("Cadastr")')
      .click();

    // Validate success
    cy.get(
      '.success-message, .alert-success, .notification-success, .message',
      { timeout: 5000 }
    )
      .should('be.visible');

    // Verify redirection (usually to login or dashboard)
    cy.url().should('not.include', 'signup');
  });
});


