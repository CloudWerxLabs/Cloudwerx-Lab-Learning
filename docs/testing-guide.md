# Testing Guide

## Introduction
Software testing is crucial for maintaining code quality and preventing bugs. This guide covers different testing approaches, frameworks, and best practices for various programming languages.

## Testing Fundamentals

### Types of Tests
1. Unit Tests
   - Test individual components
   - Isolated from dependencies
   - Fast execution

2. Integration Tests
   - Test component interactions
   - Real dependencies
   - Database/API testing

3. End-to-End Tests
   - Test complete workflows
   - User perspective
   - Browser automation

4. Performance Tests
   - Load testing
   - Stress testing
   - Scalability testing

## Test-Driven Development (TDD)

### TDD Cycle
1. Write failing test
2. Write minimal code to pass
3. Refactor code
4. Repeat

### Benefits
- Better design
- Fewer bugs
- Living documentation
- Confidence in changes

## Unit Testing

### JavaScript/TypeScript (Jest)
```javascript
describe('Calculator', () => {
  test('adds two numbers', () => {
    expect(add(2, 2)).toBe(4);
  });

  test('throws on invalid input', () => {
    expect(() => add(null, 2)).toThrow();
  });
});
```

### Python (pytest)
```python
def test_addition():
    assert add(2, 2) == 4

def test_invalid_input():
    with pytest.raises(ValueError):
        add(None, 2)
```

### Java (JUnit)
```java
@Test
void testAddition() {
    assertEquals(4, calculator.add(2, 2));
}

@Test
void testInvalidInput() {
    assertThrows(IllegalArgumentException.class,
        () -> calculator.add(null, 2));
}
```

## Integration Testing

### API Testing (Supertest)
```javascript
describe('User API', () => {
  it('creates a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John' });
    
    expect(response.status).toBe(201);
    expect(response.body.name).toBe('John');
  });
});
```

### Database Testing (TestContainers)
```java
@Container
PostgreSQLContainer postgres = new PostgreSQLContainer()
    .withDatabaseName("testdb");

@Test
void testDatabaseOperation() {
    try (Connection conn = postgres.createConnection()) {
        // Test database operations
    }
}
```

## End-to-End Testing

### Cypress
```javascript
describe('Login Flow', () => {
  it('successfully logs in', () => {
    cy.visit('/login');
    cy.get('[data-test=email]').type('user@example.com');
    cy.get('[data-test=password]').type('password');
    cy.get('[data-test=submit]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

### Playwright
```javascript
test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[data-test=email]', 'user@example.com');
  await page.fill('[data-test=password]', 'password');
  await page.click('[data-test=submit]');
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Mocking and Stubbing

### Jest Mocks
```javascript
jest.mock('./database');

test('fetches user', async () => {
  const user = { id: 1, name: 'John' };
  database.getUser.mockResolvedValue(user);

  const result = await fetchUser(1);
  expect(result).toEqual(user);
});
```

### Python Mock
```python
@patch('module.database')
def test_fetch_user(mock_db):
    user = {'id': 1, 'name': 'John'}
    mock_db.get_user.return_value = user

    result = fetch_user(1)
    assert result == user
```

## Performance Testing

### JMeter Script
```xml
<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2">
  <hashTree>
    <ThreadGroup>
      <elementProp name="HTTPsampler">
        <stringProp name="HTTPSampler.domain">example.com</stringProp>
        <stringProp name="HTTPSampler.protocol">https</stringProp>
        <stringProp name="HTTPSampler.path">/api/users</stringProp>
      </elementProp>
    </ThreadGroup>
  </hashTree>
</jmeterTestPlan>
```

### k6 Script
```javascript
import http from 'k6/http';

export default function() {
  const response = http.get('https://example.com/api/users');
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
}
```

## Test Organization

### Directory Structure
```
tests/
├── unit/
│   ├── user.test.js
│   └── auth.test.js
├── integration/
│   ├── api.test.js
│   └── db.test.js
└── e2e/
    ├── login.test.js
    └── checkout.test.js
```

### Configuration Files
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
};
```

## Continuous Integration

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

### GitLab CI
```yaml
test:
  stage: test
  script:
    - npm install
    - npm test
  coverage: '/Coverage: \d+\.?\d*%/'
```

## Test Coverage

### Istanbul Configuration
```javascript
{
  "all": true,
  "include": ["src/**/*.js"],
  "exclude": ["**/*.spec.js"],
  "reporter": ["text", "lcov"],
  "check-coverage": true,
  "lines": 80,
  "statements": 80,
  "functions": 80,
  "branches": 80
}
```

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View report
open coverage/lcov-report/index.html
```

## Best Practices

### Test Structure
1. Arrange (Setup)
2. Act (Execute)
3. Assert (Verify)
4. Cleanup

### Naming Conventions
```javascript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with valid data', () => {});
    it('should throw error with invalid data', () => {});
  });
});
```

## Testing Patterns

### Factory Pattern
```javascript
const createUser = (overrides = {}) => ({
  id: 1,
  name: 'John',
  email: 'john@example.com',
  ...overrides,
});
```

### Builder Pattern
```typescript
class UserBuilder {
  private user: Partial<User> = {};

  withName(name: string) {
    this.user.name = name;
    return this;
  }

  build(): User {
    return this.user as User;
  }
}
```

## Debugging Tests

### Jest Debug Config
```json
{
  "scripts": {
    "test:debug": "node --inspect-brk node_modules/.bin/jest --runInBand"
  }
}
```

### VSCode Launch Config
```json
{
  "configurations": [{
    "type": "node",
    "name": "Debug Tests",
    "request": "launch",
    "program": "${workspaceFolder}/node_modules/jest/bin/jest",
    "args": ["--runInBand"]
  }]
}
```

## Additional Resources

### Documentation
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Cypress Documentation](https://docs.cypress.io)
- [pytest Documentation](https://docs.pytest.org)

### Tools
- Test Runners
- Coverage Tools
- Mocking Libraries
- Assertion Libraries

## Glossary

### Common Terms
- **Assertion**: Verification of expected results
- **Mock**: Simulated object/behavior
- **Stub**: Simplified implementation
- **Fixture**: Test data
- **Coverage**: Code execution measurement
- **Test Runner**: Test execution tool
- **Test Suite**: Collection of tests
- **Test Case**: Individual test
