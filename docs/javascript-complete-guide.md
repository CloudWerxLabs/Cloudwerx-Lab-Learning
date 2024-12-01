# JavaScript Complete Guide

## Core JavaScript Concepts

### 1. Variables and Data Types
```javascript
// Variable declarations
let name = "John";           // String
const age = 30;             // Number
var isActive = true;        // Boolean
let items = [1, 2, 3];      // Array
let user = {                // Object
    name: "John",
    age: 30
};

// Modern variable features
const { name, age } = user;  // Destructuring
let [first, ...rest] = items; // Rest operator
let newItems = [...items];    // Spread operator
```

### 2. Functions
```javascript
// Function declarations
function greet(name) {
    return `Hello, ${name}!`;
}

// Arrow functions
const greet = name => `Hello, ${name}!`;

// Function with default parameters
const greet = (name = "Guest") => `Hello, ${name}!`;

// Higher-order functions
const withLogging = fn => (...args) => {
    console.log(`Calling function with args:`, args);
    return fn(...args);
};

// Closures
function counter() {
    let count = 0;
    return {
        increment: () => ++count,
        decrement: () => --count,
        getCount: () => count
    };
}
```

### 3. Classes and Objects
```javascript
// Class declaration
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    // Instance method
    greet() {
        return `Hello, I'm ${this.name}`;
    }

    // Static method
    static create(data) {
        return new User(data.name, data.age);
    }

    // Getter
    get profile() {
        return `${this.name} (${this.age})`;
    }

    // Setter
    set profile(value) {
        [this.name, this.age] = value.split(' ');
    }
}

// Inheritance
class Admin extends User {
    constructor(name, age, role) {
        super(name, age);
        this.role = role;
    }
}
```

### 4. Asynchronous Programming
```javascript
// Promises
function fetchUser(id) {
    return new Promise((resolve, reject) => {
        // Async operation
        if (user) {
            resolve(user);
        } else {
            reject(new Error('User not found'));
        }
    });
}

// Async/Await
async function getUser(id) {
    try {
        const user = await fetchUser(id);
        return user;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// Promise chaining
fetchUser(1)
    .then(user => fetchUserPosts(user.id))
    .then(posts => processUserPosts(posts))
    .catch(error => console.error(error));

// Promise.all
const promises = [fetchUser(1), fetchPosts(1), fetchComments(1)];
Promise.all(promises)
    .then(([user, posts, comments]) => {
        // Process all data
    });
```

### 5. Modern JavaScript Features

#### ES6+ Features
```javascript
// Template literals
const message = `Hello, ${name}!`;

// Optional chaining
const userName = user?.profile?.name;

// Nullish coalescing
const value = data ?? defaultValue;

// Private class fields
class Example {
    #privateField = 'private';
    
    getPrivateField() {
        return this.#privateField;
    }
}

// BigInt
const bigNumber = 9007199254740991n;

// Map and Set
const map = new Map();
const set = new Set();

// Modules
export const helper = () => {};
import { helper } from './helper';
```

### 6. DOM Manipulation
```javascript
// Selecting elements
const element = document.querySelector('.class');
const elements = document.querySelectorAll('.class');

// Creating elements
const div = document.createElement('div');
div.textContent = 'Hello';
div.classList.add('class');

// Event handling
element.addEventListener('click', (event) => {
    event.preventDefault();
    // Handle event
});

// DOM traversal
const parent = element.parentNode;
const children = element.children;
const next = element.nextSibling;
const prev = element.previousSibling;
```

## Advanced Topics

### 1. Design Patterns
```javascript
// Singleton
class Singleton {
    static instance;
    
    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}

// Observer
class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    }
}

// Factory
class UserFactory {
    static createUser(type, data) {
        switch(type) {
            case 'admin':
                return new Admin(data);
            case 'customer':
                return new Customer(data);
            default:
                throw new Error('Invalid user type');
        }
    }
}
```

### 2. Performance Optimization
```javascript
// Debouncing
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Throttling
function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Memoization
function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}
```

### 3. Testing
```javascript
// Jest example
describe('User class', () => {
    let user;

    beforeEach(() => {
        user = new User('John', 30);
    });

    test('creates user correctly', () => {
        expect(user.name).toBe('John');
        expect(user.age).toBe(30);
    });

    test('greets correctly', () => {
        expect(user.greet()).toBe('Hello, I\'m John');
    });
});

// Mock example
jest.mock('./api');
const api = require('./api');

test('fetches users', async () => {
    api.fetchUsers.mockResolvedValue([{ id: 1, name: 'John' }]);
    const users = await getUsers();
    expect(users).toHaveLength(1);
    expect(api.fetchUsers).toHaveBeenCalled();
});
```

## Best Practices

### 1. Code Style
```javascript
// Use meaningful names
const fetchUserData = async (userId) => {
    // ...
};

// Consistent formatting
const config = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
};

// Error handling
try {
    await processData();
} catch (error) {
    logger.error('Failed to process data:', error);
    throw new ProcessingError('Data processing failed', { cause: error });
}
```

### 2. Security
```javascript
// Input validation
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(2).max(50).required(),
        email: Joi.string().email().required(),
        age: Joi.number().min(0).max(120)
    });
    return schema.validate(user);
}

// XSS prevention
function sanitizeHtml(html) {
    return DOMPurify.sanitize(html);
}

// CSRF protection
const csrfToken = document.querySelector('meta[name="csrf-token"]').content;
fetch('/api/data', {
    headers: {
        'CSRF-Token': csrfToken
    }
});
```

## Modern Development Tools

### 1. Build Tools
```javascript
// Webpack configuration
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
};

// Babel configuration
{
    "presets": ["@babel/preset-env"],
    "plugins": [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-runtime"
    ]
}
```

### 2. Development Environment
```javascript
// ESLint configuration
module.exports = {
    extends: ['eslint:recommended'],
    rules: {
        'no-console': 'warn',
        'no-unused-vars': 'error'
    }
};

// Prettier configuration
module.exports = {
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'es5'
};
```

## Learning Resources

### 1. Online Platforms
- MDN Web Docs
- JavaScript.info
- FreeCodeCamp
- Codecademy
- Egghead.io

### 2. Books
- "Eloquent JavaScript"
- "You Don't Know JS"
- "JavaScript: The Good Parts"
- "Clean Code in JavaScript"

### 3. Practice Projects
1. Todo Application
2. Weather Dashboard
3. Social Media Clone
4. E-commerce Platform
5. Real-time Chat Application

### 4. Community Resources
- Stack Overflow
- GitHub
- Dev.to
- JavaScript Weekly
- Reddit r/javascript

## Debugging and Tools

### 1. Chrome DevTools
```javascript
// Console methods
console.log('Basic logging');
console.info('Info message');
console.warn('Warning message');
console.error('Error message');
console.table([{ id: 1, name: 'John' }]);
console.time('operation');
// ... code ...
console.timeEnd('operation');

// Debugging
debugger;
console.trace();
```

### 2. Performance Monitoring
```javascript
// Performance API
performance.mark('start');
// ... code ...
performance.mark('end');
performance.measure('operation', 'start', 'end');

// Memory profiling
const used = process.memoryUsage();
console.log(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`);
```

Remember to regularly check:
1. Memory leaks
2. Performance bottlenecks
3. Network requests
4. Event listeners
5. Error boundaries
