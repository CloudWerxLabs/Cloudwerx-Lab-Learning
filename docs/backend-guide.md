# Backend Development Guide

## Introduction
Backend development focuses on server-side logic, databases, and APIs. This guide covers essential concepts, frameworks, and best practices for building robust backend systems.

## API Development

### RESTful APIs
```javascript
// Express.js REST API
const express = require('express');
const app = express();

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### GraphQL
```javascript
// GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    user: (_, { id }) => User.findById(id),
    users: () => User.find()
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = new User({ name, email });
      return user.save();
    }
  }
};
```

## Database Management

### SQL (PostgreSQL)
```sql
-- Table creation
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queries
SELECT u.*, p.title 
FROM users u 
LEFT JOIN posts p ON u.id = p.user_id 
WHERE u.email LIKE '%@example.com';

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
```

### NoSQL (MongoDB)
```javascript
// Schema definition
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  passwordHash: String,
  profile: {
    name: String,
    avatar: String
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }]
});

// Queries
const users = await User
  .find({ 'profile.name': /John/ })
  .populate('posts')
  .sort('-createdAt')
  .limit(10);
```

## Authentication & Authorization

### JWT Authentication
```javascript
// JWT middleware
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  res.json({ token });
});
```

### Role-Based Access Control
```javascript
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

app.get('/admin',
  authMiddleware,
  checkRole(['admin']),
  (req, res) => {
    res.json({ message: 'Admin access granted' });
  }
);
```

## Data Validation

### Input Validation
```javascript
// Joi validation
const schema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required(),
  age: Joi.number()
    .integer()
    .min(18)
    .max(100)
});

// Validation middleware
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

### Data Sanitization
```javascript
const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  profile: {
    name: user.profile.name,
    avatar: user.profile.avatar
  }
});

app.get('/user/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(sanitizeUser(user));
});
```

## Error Handling

### Global Error Handler
```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details
    });
  }
  
  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      error: 'Authentication failed'
    });
  }
  
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id
  });
});
```

### Custom Error Classes
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}
```

## Caching

### Redis Caching
```javascript
const Redis = require('ioredis');
const redis = new Redis();

// Cache middleware
const cache = (duration) => async (req, res, next) => {
  const key = `cache:${req.originalUrl}`;
  
  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    res.sendResponse = res.json;
    res.json = async (body) => {
      await redis.setex(key, duration, JSON.stringify(body));
      res.sendResponse(body);
    };
    
    next();
  } catch (error) {
    next(error);
  }
};
```

### Memory Caching
```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

const memoize = (fn) => async (...args) => {
  const key = JSON.stringify(args);
  const cached = cache.get(key);
  
  if (cached) {
    return cached;
  }
  
  const result = await fn(...args);
  cache.set(key, result);
  return result;
};
```

## Testing

### Unit Testing
```javascript
// Jest test suite
describe('UserService', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('creates user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const user = await UserService.create(userData);
    expect(user.email).toBe(userData.email);
    expect(user.passwordHash).toBeDefined();
  });
});
```

### Integration Testing
```javascript
// Supertest API testing
const request = require('supertest');

describe('Auth API', () => {
  test('login returns JWT token', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'user@example.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
  });
});
```

## Performance

### Optimization
```javascript
// Database indexing
userSchema.index({ email: 1 });
userSchema.index({ 'profile.name': 1 });

// Query optimization
const users = await User
  .find({ active: true })
  .select('email profile')
  .lean()
  .limit(10);

// Pagination
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const users = await User
  .find()
  .skip(skip)
  .limit(limit);
```

### Monitoring
```javascript
// Performance monitoring
const responseTime = require('response-time');

app.use(responseTime((req, res, time) => {
  metrics.timing('api.response_time', time);
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## Security

### Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}));
```

### Rate Limiting
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## Best Practices

### Code Organization
```
src/
  ├── config/
  │   ├── database.js
  │   └── middleware.js
  ├── controllers/
  │   └── userController.js
  ├── models/
  │   └── User.js
  ├── routes/
  │   └── userRoutes.js
  ├── services/
  │   └── userService.js
  ├── utils/
  │   └── errors.js
  └── app.js
```

### Environment Configuration
```javascript
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  database: {
    url: process.env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '1h'
  }
};
```

## Additional Resources

### Documentation
- Node.js Documentation
- Express.js Guide
- MongoDB Manual
- PostgreSQL Docs

### Tools
- Postman
- MongoDB Compass
- pgAdmin
- Redis Desktop Manager

## Glossary

### Common Terms
- **API**: Application Programming Interface
- **ORM**: Object-Relational Mapping
- **JWT**: JSON Web Token
- **CRUD**: Create Read Update Delete
- **Middleware**: Request/Response handler
- **Schema**: Data structure
- **Migration**: Database change
- **Seeder**: Initial data loader
