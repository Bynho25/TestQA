// Support file for all E2E tests
import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore specific errors that don't affect the test
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('TypeError')
  ) {
    return false;
  }
});

// Set base URL and API URL
Cypress.env('BASE_URL', 'https://front.serverest.dev');
Cypress.env('API_URL', 'https://serverest.dev/api');
