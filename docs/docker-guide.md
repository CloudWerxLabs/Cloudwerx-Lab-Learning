# Docker Guide

## Introduction
Docker is a platform for developing, shipping, and running applications in containers. This guide covers essential Docker concepts and practices for both beginners and advanced users.

## Basic Concepts

### Containers
- Lightweight, standalone packages
- Contains everything needed to run an application
- Consistent environment across different platforms

### Images
- Read-only templates for containers
- Built from Dockerfile instructions
- Layered architecture
- Can be shared via registries

### Dockerfile
- Text file containing build instructions
- Defines the environment
- Specifies dependencies
- Sets up application

## Essential Commands

### Container Management
```bash
# Run a container
docker run [options] IMAGE

# List containers
docker ps  # Running containers
docker ps -a  # All containers

# Stop and remove
docker stop CONTAINER_ID
docker rm CONTAINER_ID
```

### Image Management
```bash
# Build image
docker build -t name:tag .

# List images
docker images

# Remove image
docker rmi IMAGE_ID

# Pull from registry
docker pull IMAGE_NAME
```

### Basic Operations
```bash
# Execute command in container
docker exec -it CONTAINER_ID COMMAND

# View logs
docker logs CONTAINER_ID

# Copy files
docker cp SOURCE CONTAINER:DEST
```

## Dockerfile Instructions

### Basic Structure
```dockerfile
# Base image
FROM ubuntu:20.04

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Run commands
RUN apt-get update

# Set environment variables
ENV NODE_ENV=production

# Expose ports
EXPOSE 3000

# Define entry point
CMD ["npm", "start"]
```

### Best Practices
1. Use specific base image versions
2. Minimize layers
3. Clean up after installations
4. Use .dockerignore
5. Multi-stage builds for smaller images

## Docker Compose

### Basic Structure
```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
```

### Common Commands
```bash
# Start services
docker-compose up

# Stop services
docker-compose down

# Build services
docker-compose build

# View logs
docker-compose logs
```

## Networking

### Types
1. Bridge networks
2. Host networks
3. Overlay networks
4. Macvlan networks

### Commands
```bash
# Create network
docker network create NETWORK_NAME

# List networks
docker network ls

# Connect container
docker network connect NETWORK CONTAINER
```

## Volume Management

### Types
1. Named volumes
2. Bind mounts
3. tmpfs mounts

### Commands
```bash
# Create volume
docker volume create VOLUME_NAME

# List volumes
docker volume ls

# Remove volume
docker volume rm VOLUME_NAME
```

## Security Best Practices

### Container Security
1. Use official images
2. Scan for vulnerabilities
3. Limit capabilities
4. Use non-root users
5. Keep images minimal

### Image Security
```dockerfile
# Use specific versions
FROM ubuntu:20.04

# Create non-root user
RUN useradd -m appuser
USER appuser

# Set proper permissions
RUN chmod -R 755 /app
```

## Performance Optimization

### Image Optimization
1. Multi-stage builds
2. Layer caching
3. .dockerignore
4. Minimal base images

### Container Optimization
1. Resource limits
2. Proper logging
3. Health checks
4. Proper shutdown handling

## Advanced Features

### Health Checks
```dockerfile
HEALTHCHECK --interval=30s \
  CMD curl -f http://localhost/ || exit 1
```

### Multi-stage Builds
```dockerfile
# Build stage
FROM node:14 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production stage
FROM node:14-slim
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main.js"]
```

## Debugging

### Common Issues
1. Container not starting
2. Network connectivity
3. Volume permissions
4. Resource constraints

### Debugging Commands
```bash
# Interactive shell
docker exec -it CONTAINER bash

# View logs
docker logs -f CONTAINER

# Inspect container
docker inspect CONTAINER
```

## Docker Registry

### Registry Operations
```bash
# Login to registry
docker login

# Push image
docker push IMAGE_NAME

# Pull image
docker pull IMAGE_NAME
```

### Private Registry
1. Setup
2. Security
3. Access control
4. Storage backend

## Orchestration

### Docker Swarm
1. Initialize swarm
2. Join nodes
3. Deploy services
4. Scale applications

### Kubernetes Integration
1. Docker Desktop K8s
2. Minikube
3. Container runtime
4. Image management

## Monitoring

### Tools
1. Docker stats
2. Prometheus
3. Grafana
4. cAdvisor

### Commands
```bash
# View container stats
docker stats

# View processes
docker top CONTAINER
```

## Additional Resources

### Documentation
- [Official Docker Docs](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Docker GitHub](https://github.com/docker)

### Tools
- Docker Desktop
- Docker Compose
- Docker Machine
- Docker Scan

## Glossary

### Common Terms
- **Container**: Running instance of an image
- **Image**: Template for containers
- **Registry**: Storage for images
- **Volume**: Persistent storage
- **Network**: Container communication
- **Compose**: Multi-container definition
- **Swarm**: Container orchestration
- **Layer**: Part of image filesystem
