# Security Best Practices Guide

## Introduction
Security is crucial in modern software development. This guide covers essential security practices, common vulnerabilities, and implementation strategies across different aspects of software development.

## Authentication & Authorization

### Password Security
```javascript
// Bad Practice
const password = "plaintext123";

// Good Practice
const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);
```

### JWT Implementation
```javascript
// Secure JWT configuration
const jwt = require('jsonwebtoken');
const options = {
  expiresIn: '1h',
  algorithm: 'RS256',
  audience: 'your-api',
  issuer: 'your-auth-server'
};

const token = jwt.sign(payload, privateKey, options);
```

### OAuth 2.0
```javascript
const oauth2Config = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'https://your-app.com/auth/callback',
  scope: ['profile', 'email']
};
```

## Data Protection

### Encryption at Rest
```javascript
const crypto = require('crypto');

// Encryption
const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(text, 'utf8', 'hex');
encrypted += cipher.final('hex');
```

### Data in Transit
```javascript
// HTTPS configuration
const https = require('https');
const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem'),
  ciphers: 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384',
  minVersion: 'TLSv1.2'
};
```

### Database Security
```javascript
// Parameterized queries
const query = {
  text: 'SELECT * FROM users WHERE id = $1',
  values: [userId]
};

// Connection encryption
const dbConfig = {
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync('ca-certificate.crt')
  }
};
```

## Input Validation

### XSS Prevention
```javascript
// Bad Practice
document.innerHTML = userInput;

// Good Practice
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput, {
  allowedTags: ['b', 'i', 'em', 'strong'],
  allowedAttributes: {}
});
```

### SQL Injection Prevention
```javascript
// Bad Practice
const query = `SELECT * FROM users WHERE username = '${username}'`;

// Good Practice
const { Pool } = require('pg');
const pool = new Pool();
const result = await pool.query(
  'SELECT * FROM users WHERE username = $1',
  [username]
);
```

### File Upload Security
```javascript
const multer = require('multer');
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const safeName = path.normalize(file.originalname).replace(/^(\.\.(\/|\\|$))+/, '');
    cb(null, Date.now() + '-' + safeName);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    cb(null, allowedTypes.includes(file.mimetype));
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});
```

## Session Management

### Secure Session Configuration
```javascript
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  name: '__Host-session',
  cookie: {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour
  },
  resave: false,
  saveUninitialized: false
}));
```

### CSRF Protection
```javascript
const csrf = require('csurf');

app.use(csrf({
  cookie: {
    secure: true,
    sameSite: 'strict',
    maxAge: 3600
  }
}));

app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
```

## API Security

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

### Security Headers
```javascript
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" }
}));
```

## Infrastructure Security

### Docker Security
```dockerfile
# Use specific version
FROM node:16-slim

# Create non-root user
RUN useradd -r -s /bin/false nodeapp

# Set proper permissions
WORKDIR /app
COPY --chown=nodeapp:nodeapp . .

# Use non-root user
USER nodeapp

# Minimal exposure
EXPOSE 3000
```

### Kubernetes Security
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: secure-pod
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 1000
  containers:
  - name: app
    image: myapp:1.0
    securityContext:
      allowPrivilegeEscalation: false
      capabilities:
        drop:
          - ALL
    resources:
      limits:
        memory: "128Mi"
        cpu: "500m"
```

## Monitoring & Logging

### Security Logging
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: 'security.log',
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Log security events
logger.warn('Authentication failed', {
  user: username,
  ip: req.ip,
  timestamp: new Date()
});
```

### Audit Trail
```javascript
const auditLog = async (event) => {
  await db.audit.create({
    userId: event.userId,
    action: event.action,
    resource: event.resource,
    timestamp: new Date(),
    ip: event.ip,
    userAgent: event.userAgent
  });
};
```

## Error Handling

### Secure Error Responses
```javascript
// Error handler middleware
app.use((err, req, res, next) => {
  // Log error internally
  logger.error(err);

  // Send safe response to client
  res.status(500).json({
    error: {
      message: 'An unexpected error occurred',
      id: err.id // Reference ID for internal tracking
    }
  });
});
```

### Input Validation Errors
```javascript
const { validationResult } = require('express-validator');

app.post('/api/data', [
  body('email').isEmail(),
  body('password').isLength({ min: 8 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
});
```

## Best Practices

### Security Checklist
1. Use HTTPS everywhere
2. Implement proper authentication
3. Validate all input
4. Use parameterized queries
5. Implement proper logging
6. Keep dependencies updated
7. Use security headers
8. Implement rate limiting
9. Use secure session management
10. Regular security audits

### Development Guidelines
1. Security by design
2. Least privilege principle
3. Defense in depth
4. Regular updates
5. Code review focus

## Additional Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NIST Guidelines](https://www.nist.gov/cyberframework)
- [Security Headers](https://securityheaders.com)

### Tools
- Security scanners
- Dependency checkers
- Code analysis tools
- Penetration testing

## Glossary

### Common Terms
- **Authentication**: Identity verification
- **Authorization**: Access control
- **Encryption**: Data protection
- **XSS**: Cross-site scripting
- **CSRF**: Cross-site request forgery
- **SQL Injection**: Database attack
- **Zero Trust**: Security model
- **Audit Trail**: Activity logging
