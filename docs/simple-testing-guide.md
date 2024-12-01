# Simple Testing Guide for Vanilla JS Project

## Introduction
This guide covers a beginner-friendly testing setup for our vanilla JavaScript project. We focus on essential testing concepts without overwhelming complexity.

## Project Testing Structure

### Basic Setup
```
project/
  ├── src/           # Source files
  ├── tests/         # Test files
  │   ├── unit/     # Simple unit tests
  │   └── dom/      # DOM-related tests
  └── package.json
```

## Getting Started

### 1. Initial Setup
```bash
npm install --save-dev jest
npm install --save-dev jest-environment-jsdom
```

### 2. Package.json Configuration
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "jsdom"
  }
}
```

## Writing Your First Tests

### Testing DOM Elements
```javascript
// tests/dom/sidebar.test.js
describe('Sidebar', () => {
  beforeEach(() => {
    // Setup your DOM
    document.body.innerHTML = `
      <div class="sidebar">
        <div class="logo-text">Logo</div>
      </div>
    `;
  });

  test('logo should be visible', () => {
    const logo = document.querySelector('.logo-text');
    expect(logo).not.toBeNull();
    expect(logo.textContent).toBe('Logo');
  });
});
```

### Testing Animations
```javascript
// tests/dom/animations.test.js
describe('Animation Classes', () => {
  test('logo has correct animation class', () => {
    document.body.innerHTML = '<div class="logo-text"></div>';
    const logo = document.querySelector('.logo-text');
    
    // Check computed styles
    const styles = window.getComputedStyle(logo);
    expect(styles.animation).toContain('gradientFlow');
  });
});
```

## Key Areas to Test

### 1. Document Loading
- Test markdown file loading
- Verify content parsing
- Check error handling

### 2. UI Elements
- Sidebar visibility
- Logo presence
- Theme toggle functionality
- Navigation buttons

### 3. Animations
- Presence of animation classes
- Duration values
- Timing functions

### 4. User Interactions
- Click handlers
- Theme switching
- Navigation events

## Running Tests

### Basic Commands
1. Run all tests:
   ```bash
   npm test
   ```

2. Watch mode (for development):
   ```bash
   npm run test:watch
   ```

3. Run specific test file:
   ```bash
   npm test -- tests/dom/sidebar.test.js
   ```

## Best Practices

### 1. Keep Tests Simple
- Test one thing at a time
- Use descriptive test names
- Keep setup code minimal

### 2. DOM Testing Tips
- Clean up DOM after each test
- Use `beforeEach` for setup
- Test visible elements only

### 3. File Organization
- Match test files to source files
- Group related tests together
- Use clear naming conventions

## Common Patterns

### 1. Setup and Teardown
```javascript
describe('Component Test', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<div id="root"></div>';
  });

  afterEach(() => {
    // Clean up
    document.body.innerHTML = '';
  });
});
```

### 2. Testing Event Handlers
```javascript
test('theme toggle works', () => {
  const button = document.querySelector('.theme-toggle');
  button.click();
  expect(document.body.classList).toContain('dark-theme');
});
```

## Debugging Tests

### 1. Console Output
- Use `console.log()` in tests
- Check Jest output carefully
- Look for setup issues

### 2. Common Issues
- DOM not properly setup
- Missing test environment
- Incorrect selectors

## Next Steps

### 1. Expanding Coverage
- Add more UI tests
- Test error scenarios
- Add animation tests

### 2. Improving Tests
- Refactor similar tests
- Add helper functions
- Improve error messages

## Conclusion
Remember: Start small, test the most important features first, and gradually expand your test coverage as you become more comfortable with testing.
