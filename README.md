# 🧪 ServerEST - Test Automation Suite

## 📋 Overview

Complete E2E and API test automation suite developed with **Cypress** to validate the ServerEST platform. The project follows development best practices, scalable organization, security, and CI/CD.

### 🎯 Test Scope

- **3 E2E Scenarios**: UI tests focused on authentication and products
- **3 API Scenarios**: Tests for authentication, users, and products
- **Positive and Negative Scenarios**: Complete coverage of successful flows and expected failures

### 🔗 APIs Tested

- **Frontend**: https://front.serverest.dev
- **Swagger API**: https://serverest.dev/api

---

## 📁 Project Structure

```
TestQA/
├── cypress/
│   ├── e2e/
│   │   ├── api/
│   │   │   ├── auth.cy.js         # Authentication tests
│   │   │   └── products.cy.js     # Product tests
│   │   └── ui/
│   │       ├── auth-flow.cy.js    # E2E login/registration tests
│   │       └── products.cy.js     # E2E products/cart tests
│   ├── fixtures/
│   │   ├── users.json             # User test data
│   │   └── products.json          # Product test data
│   └── support/
│       ├── commands.js            # Custom commands
│       └── e2e.js                 # E2E setup
├── .github/
│   └── workflows/
│       └── ci.yml                 # CI/CD Pipeline
├── cypress.config.js              # Cypress configuration
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment variables (example)
├── .gitignore                     # Ignored files
└── README.md                      # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 16.13.0 (recommended: v20+)
- **npm** >= 8.x
- **Git**

### 1️⃣ Installation

```bash
# Clone repository
git clone https://github.com/Bynho25/TestQA.git
cd TestQA

# Install dependencies
npm install
```

### 2️⃣ Configuration

```bash
# Copy example file
cp .env.example .env

# Edit .env if necessary (optional for public tests)
```

### 3️⃣ Run Tests

```bash
# Open Cypress interface (interactive mode)
npm run cypress:open

# Run all tests
npm run test:all

# Run only E2E/UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run with visual interface
npm run test:headed

# Debug mode
npm run test:debug
```

---

## 🧪 Test Scenarios

### API Tests

#### 1. **Authentication - Scenario 1 (POSITIVE)**
- **Goal**: Successfully register new user
- **Validations**:
  - HTTP Status: 201
  - Presence of generated user ID
  - Fields return correctly
- **File**: `cypress/e2e/api/auth.cy.js`

#### 2. **Authentication - Scenario 2 (NEGATIVE)**
- **Goal**: Fail when registering with duplicate email
- **Validations**:
  - HTTP Status: 400
  - Appropriate error message
- **File**: `cypress/e2e/api/auth.cy.js`

#### 3. **Authentication - Scenario 3 (POSITIVE)**
- **Goal**: Successfully login
- **Validations**:
  - HTTP Status: 200
  - JWT token returned
  - Correct user data
- **File**: `cypress/e2e/api/auth.cy.js`

#### 4. **Products - Scenario 1 (POSITIVE)**
- **Goal**: Create product with valid data
- **Validations**:
  - HTTP Status: 201
  - Product created with unique ID
  - Fields return correctly
- **File**: `cypress/e2e/api/products.cy.js`

#### 5. **Products - Scenario 2 (NEGATIVE)**
- **Goal**: Fail when creating without required field
- **Validations**:
  - HTTP Status: 400
  - Error message about required field
- **File**: `cypress/e2e/api/products.cy.js`

#### 6. **Products - Scenario 3 (POSITIVE)**
- **Goal**: Successfully list products
- **Validations**:
  - HTTP Status: 200
  - Response contains product list
  - Each product has correct structure
- **File**: `cypress/e2e/api/products.cy.js`

### E2E/UI Tests

#### 1. **Login - Scenario 1 (POSITIVE)**
- **Goal**: Successfully load login page
- **Validations**:
  - Correct URL
  - Elements visible (fields, buttons)
  - Placeholder attributes present
- **File**: `cypress/e2e/ui/auth-flow.cy.js`

#### 2. **Login - Scenario 2 (NEGATIVE)**
- **Goal**: Display error with invalid credentials
- **Validations**:
  - Error message visible
  - User is not authenticated
  - Page maintains original URL
- **File**: `cypress/e2e/ui/auth-flow.cy.js`

#### 3. **Registration - Scenario 3 (POSITIVE)**
- **Goal**: Successfully register new user
- **Validations**:
  - Access to registration page
  - Form filled correctly
  - Success message
  - Appropriate redirection
- **File**: `cypress/e2e/ui/auth-flow.cy.js`

#### 4. **Products - Scenario 1 (POSITIVE)**
- **Goal**: Successfully list products
- **Validations**:
  - Products list loaded
  - Each product has price and name
  - Page at correct URL
- **File**: `cypress/e2e/ui/products.cy.js`

#### 5. **Cart - Scenario 2 (NEGATIVE)**
- **Goal**: Validate minimum product quantity
- **Validations**:
  - Error when trying quantity 0
  - Appropriate validation message
- **File**: `cypress/e2e/ui/products.cy.js`

#### 6. **Cart - Scenario 3 (POSITIVE)**
- **Goal**: Add product to cart
- **Validations**:
  - Success message
  - Product appears in cart
  - Correct quantity
- **File**: `cypress/e2e/ui/products.cy.js`

---

## 🛠️ Technical Decisions

### 1. **Framework: Cypress**
- ✅ Fast and reliable execution
- ✅ Excellent support for API and E2E tests
- ✅ Low learning curve
- ✅ Large community and complete documentation

### 2. **Folder Organization**
- Clear separation between **API** and **UI** tests
- Centralized **Fixtures** for reuse
- Custom **Commands** to abstract complexity
- Easy maintenance and scalability

### 3. **Data Generation**
- **@faker-js/faker**: Generates realistic and unique data
- Avoids duplicate email conflicts
- Timestamps ensure uniqueness
- Follows valid data patterns

### 4. **Naming Pattern**
- Descriptive names in English (as per context)
- `[POSITIVE]` and `[NEGATIVE]` prefix for quick classification
- Explanatory comments in each test

### 5. **Security**
- ❌ Zero sensitive credentials in repository
- ✅ `.env.example` file without values
- ✅ `.gitignore` prevents accidental commits
- ✅ Public test data (no real data)

---

## 📊 Custom Commands

### Authentication
```javascript
cy.registerUser(userData)        // Register new user
cy.loginUser(email, password)    // Login and return token
cy.fillLoginForm(email, pwd)     // Fill login form
```

### Products
```javascript
cy.createProduct(productData, token)     // Create product
cy.getProducts(token)                    // List products
cy.deleteProduct(productId, token)       // Remove product
```

### UI
```javascript
cy.fillProductForm(productData)    // Fill product form
cy.waitForLoader()                 // Wait for loader to disappear
cy.verifyNotification(msg, type)  // Validate notification
```

---

## 📈 Test Coverage

| Category | Scenarios | Positive | Negative |
|----------|-----------|----------|----------|
| API Auth | 3         | 2        | 1        |
| API Prod | 3         | 2        | 1        |
| E2E Auth | 3         | 2        | 1        |
| E2E Prod | 3         | 2        | 1        |
| **Total**| **12**    | **8**    | **4**    |

---

## 🐛 Debugging

### Cypress Debug Mode

```bash
npm run test:debug
```

Allows:
- Step-by-step execution
- Variable inspection
- Browser console
- Network tab

### Detailed Logs

```bash
# With verbosity
DEBUG=cypress:* npm run test:all
```

---

## ⚠️ Execution Requirements

- ✅ Dependencies from package.json installed
- ✅ `.env` file configured (optional for public tests)
- ✅ Internet connection (tests real APIs)
- ✅ No restrictive network/firewall protection

---

## 📧 Support

For questions or issues:

1. Check `.env.example` file
2. Validate connection with API URLs
3. Clear cache: `npm install --legacy-peer-deps`
4. Reinstall: `rm -rf node_modules && npm install`

---

## 📄 License

MIT - Free for use in personal and professional projects

---

**Developed with ❤️ for QA Senior technical evaluation**
