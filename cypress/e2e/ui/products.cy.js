/// <reference types="cypress" />

describe('E2E - Products and Cart', () => {
  const baseUrl = Cypress.env('BASE_URL');

  beforeEach(() => {
    cy.visit('/');
  });

  /**
   * SCENARIO 1 (POSITIVE): List and view products
   * - Navigates to products section
   * - Validates products list loading
   * - Verifies presence of product elements
   * - Validates displayed information (name, price, etc)
   */
  it('Should successfully display products list [POSITIVE]', () => {
    // Look for products link/button
    cy.get('a, button')
      .contains(/Produto|Catálogo|Shop|Store/i)
      .should('be.visible')
      .click();

    // Validate that on products page
    cy.url().should('include', 'produto');

    // Wait for products to load
    cy.get('[class*="product"], [data-testid*="product"]', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .then(($products) => {
        // Validate that each product has basic info
        expect($products.length).to.be.greaterThan(0);

        cy.get('[class*="product"], [data-testid*="product"]')
          .first()
          .within(() => {
            // Check price presence
            cy.get('[class*="price"], [class*="valor"]')
              .should('exist')
              .and('contain', '$', 'R$', '€'); // Should have currency symbol

            // Check for name or title presence
            cy.get('[class*="name"], [class*="title"], h', { timeout: 5000 })
              .should('exist')
              .and('be.visible');
          });
      });
  });

  /**
   * SCENARIO 2 (NEGATIVE): Fail to add product without selecting valid quantity
   * - Accesses products page
   * - Attempts to add product with invalid quantity (0 or negative)
   * - Validates appropriate error message
   */
  it('Should validate minimum quantity when adding product [NEGATIVE]', () => {
    // Navigate to products
    cy.get('a, button')
      .contains(/Produto|Catálogo|Shop/i)
      .should('be.visible')
      .click();

    cy.url().should('include', 'produto');

    // Find first product
    cy.get('[class*="product"], [data-testid*="product"]')
      .first()
      .within(() => {
        // Find quantity field
        cy.get('input[type="number"], input[name*="quantidade" i], input[name*="qtd"]')
          .then(($quantityField) => {
            if ($quantityField.length > 0) {
              // Clear and set invalid quantity
              cy.wrap($quantityField).clear().type('0');

              // Find and click add to cart button
              cy.get(
                'button:contains("Adicionar"), button:contains("Add"), button:contains("Comprar")'
              )
                .should('be.visible')
                .click();

              // Validate error
              cy.get(
                '.error, .alert, .warning, [class*="error"]',
                { timeout: 5000 }
              )
                .should('be.visible')
                .then(($error) => {
                  expect($error.text()).to.match(/quantidade|mínimo|inválido/i);
                });
            }
          });
      });
  });

  /**
   * SCENARIO 3 (POSITIVE): Add product to cart and validate
   * - Accesses products page
   * - Adds product with valid quantity
   * - Valida mensagem de sucesso
   * - Verifica que produto aparece no carrinho
   */
  it('Should successfully add product to cart [POSITIVE]', () => {
    // Navegar para produtos
    cy.get('a, button')
      .contains(/Produto|Catálogo|Shop/i)
      .should('be.visible')
      .click();

    cy.url().should('include', 'produto');

    // Aguardar produtos carreguem
    cy.get('[class*="product"], [data-testid*="product"]', { timeout: 10000 })
      .first()
      .within(() => {
        // Preencher quantidade
        cy.get('input[type="number"], input[name*="quantidade"]')
          .then(($field) => {
            if ($field.length > 0) {
              cy.wrap($field).clear().type('1');
            }
          });

        // Clicar em adicionar
        cy.get(
          'button:contains("Adicionar"), button:contains("Add"), button:contains("Comprar")'
        )
          .should('be.visible')
          .click();
      });

    // Validar mensagem de sucesso
    cy.get(
      '.success, .notification, .alert-success, [class*="success"]',
      { timeout: 5000 }
    )
      .should('be.visible')
      .then(($message) => {
        expect($message.text()).to.match(/adicion|sucesso|carrinho|succes/i);
      });

    // Navegar para carrinho
    cy.get('a, button')
      .contains(/Carrinho|Cart|Pedido/i)
      .should('be.visible')
      .click();

    // Validar que produto está no carrinho
    cy.get('[class*="cart"], [class*="item"]')
      .should('be.visible');

    cy.get('[class*="product"], [data-testid*="product"]', { timeout: 5000 })
      .should('have.length.greaterThan', 0);
  });
});









