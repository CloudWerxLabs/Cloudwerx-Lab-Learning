# System Design Guide

## Introduction
System design is the process of defining architecture, components, modules, interfaces, and data for a system to satisfy specified requirements. This guide covers key concepts and best practices.

## Fundamentals

### System Design Process
1. Requirements Gathering
   - Functional requirements
   - Non-functional requirements
   - Constraints
   - Scale estimation

2. High-Level Design
   - System architecture
   - Component design
   - Data flow
   - API design

3. Detailed Design
   - Database schema
   - API specifications
   - Component interactions
   - Algorithms

## Scalability

### Horizontal vs Vertical Scaling
```plaintext
Vertical Scaling (Scale Up)
- Add more power to existing machines
- Limits: Hardware capacity
- Example: Upgrading RAM/CPU

Horizontal Scaling (Scale Out)
- Add more machines
- Limits: Application design
- Example: Adding more servers
```

### Load Balancing
```yaml
# HAProxy Configuration Example
frontend http_front
  bind *:80
  default_backend http_back

backend http_back
  balance roundrobin
  server server1 10.0.0.1:80 check
  server server2 10.0.0.2:80 check
```

## Database Design

### Relational Schema
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10,2),
    status VARCHAR(50)
);
```

### NoSQL Design
```javascript
// MongoDB Document Example
{
  "_id": ObjectId("5099803df3f4948bd2f98391"),
  "email": "user@example.com",
  "orders": [
    {
      "id": "ord123",
      "total": 99.99,
      "status": "completed"
    }
  ]
}
```

## Caching

### Cache Strategies
```python
# Redis Cache Example
def get_user(user_id):
    # Try cache first
    cached_user = redis_client.get(f"user:{user_id}")
    if cached_user:
        return json.loads(cached_user)
    
    # Cache miss, get from database
    user = db.query_user(user_id)
    redis_client.setex(f"user:{user_id}", 3600, json.dumps(user))
    return user
```

### Cache Patterns
1. Cache-Aside
2. Write-Through
3. Write-Behind
4. Refresh-Ahead

## Message Queues

### Queue Architecture
```javascript
// RabbitMQ Example
const amqp = require('amqplib');

async function publishMessage(data) {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'task_queue';
  
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
}
```

### Event-Driven Design
```python
# Kafka Producer Example
from kafka import KafkaProducer

producer = KafkaProducer(bootstrap_servers=['localhost:9092'])
producer.send('user_events', 
    key=b'user_123',
    value=b'{"action": "login", "timestamp": "2023-01-01T00:00:00Z"}'
)
```

## Microservices

### Service Architecture
```yaml
# Docker Compose Example
version: '3'
services:
  auth_service:
    build: ./auth
    ports:
      - "3000:3000"
    environment:
      - DB_HOST=postgres
  
  user_service:
    build: ./users
    ports:
      - "3001:3001"
    depends_on:
      - auth_service
```

### Service Communication
```javascript
// gRPC Service Definition
syntax = "proto3";

service UserService {
  rpc GetUser (GetUserRequest) returns (User) {}
  rpc CreateUser (CreateUserRequest) returns (User) {}
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

## API Design

### RESTful API
```yaml
# OpenAPI Specification
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: List users
      responses:
        '200':
          description: List of users
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
```

### GraphQL API
```graphql
type User {
  id: ID!
  name: String!
  email: String!
  orders: [Order!]!
}

type Order {
  id: ID!
  total: Float!
  status: String!
}

type Query {
  user(id: ID!): User
  users: [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
}
```

## Data Storage

### Storage Types
1. Block Storage
   - Direct attachment
   - Raw device access
   - Example: EBS

2. Object Storage
   - HTTP access
   - Metadata support
   - Example: S3

3. File Storage
   - Hierarchical
   - POSIX compliance
   - Example: EFS

### Storage Patterns
```python
# S3 Storage Example
import boto3

s3 = boto3.client('s3')

def upload_file(file_path, bucket, key):
    s3.upload_file(
        file_path,
        bucket,
        key,
        ExtraArgs={'ServerSideEncryption': 'AES256'}
    )
```

## Monitoring

### Metrics Collection
```yaml
# Prometheus Configuration
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'api_server'
    static_configs:
      - targets: ['localhost:8080']
```

### Logging
```python
# ELK Stack Example
from elasticsearch import Elasticsearch
from datetime import datetime

es = Elasticsearch(['http://localhost:9200'])

def log_event(event_type, data):
    doc = {
        'timestamp': datetime.now(),
        'type': event_type,
        'data': data
    }
    es.index(index='app-logs', document=doc)
```

## Security

### Authentication
```javascript
// JWT Authentication
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}
```

### Authorization
```python
# Role-Based Access Control
from functools import wraps

def require_role(role):
    def decorator(f):
        @wraps(f)
        def wrapped(request, *args, **kwargs):
            if not request.user.has_role(role):
                raise Unauthorized()
            return f(request, *args, **kwargs)
        return wrapped
    return decorator
```

## Performance

### Optimization Techniques
1. Database Indexing
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

2. Query Optimization
```sql
-- Before
SELECT * FROM users WHERE email LIKE '%@example.com';

-- After
SELECT * FROM users WHERE email LIKE '@example.com%';
```

3. Caching Strategy
```python
# Caching with TTL
def get_cached_data(key):
    data = cache.get(key)
    if data is None:
        data = expensive_operation()
        cache.set(key, data, timeout=3600)
    return data
```

## Disaster Recovery

### Backup Strategies
```bash
# Database Backup Script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -U postgres -d myapp > backup_${DATE}.sql
aws s3 cp backup_${DATE}.sql s3://myapp-backups/
```

### Recovery Plans
1. Point-in-Time Recovery
2. Hot Standby
3. Multi-Region Failover

## Best Practices

### Design Principles
1. SOLID Principles
2. DRY (Don't Repeat Yourself)
3. KISS (Keep It Simple, Stupid)
4. Separation of Concerns

### Architecture Patterns
1. Layered Architecture
2. Event-Driven Architecture
3. Microservices Architecture
4. Serverless Architecture

## Additional Resources

### Documentation
- System Design Primer
- Cloud Design Patterns
- Microservices Patterns
- Distributed Systems

### Tools
- Architecture diagrams
- Performance monitoring
- Load testing
- Documentation

## Glossary

### Common Terms
- **Scalability**: Growth handling
- **Reliability**: System stability
- **Availability**: Uptime guarantee
- **Latency**: Response time
- **Throughput**: Processing rate
- **Consistency**: Data accuracy
- **Partition Tolerance**: Network issues
- **CAP Theorem**: Trade-offs
