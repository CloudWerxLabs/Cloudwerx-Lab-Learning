# Kubernetes Guide

## Introduction
Kubernetes (K8s) is an open-source container orchestration platform that automates the deployment, scaling, and management of containerized applications. This guide covers essential concepts and practices.

## Core Concepts

### Cluster Architecture
1. Control Plane Components
   - kube-apiserver
   - etcd
   - kube-scheduler
   - kube-controller-manager

2. Node Components
   - kubelet
   - kube-proxy
   - Container runtime

### Basic Objects
1. Pods
   - Smallest deployable units
   - One or more containers
   - Shared network/storage

2. Services
   - Network abstraction
   - Load balancing
   - Service discovery

3. Volumes
   - Persistent storage
   - Data sharing
   - Multiple types

## Essential Resources

### Pod Configuration
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

### Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

### Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## Workload Resources

### ReplicaSet
```yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      tier: frontend
  template:
    metadata:
      labels:
        tier: frontend
    spec:
      containers:
      - name: php-redis
        image: gcr.io/google_samples/gb-frontend:v3
```

### StatefulSet
```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: web
spec:
  serviceName: "nginx"
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

## Networking

### Service Types
1. ClusterIP
   - Internal access
   - Default type
   - Cluster-only

2. NodePort
   - External access
   - Port forwarding
   - Node IP access

3. LoadBalancer
   - Cloud integration
   - External IP
   - Load distribution

### Network Policies
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          role: frontend
```

## Storage

### PersistentVolume
```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv0003
spec:
  capacity:
    storage: 5Gi
  accessModes:
    - ReadWriteOnce
  persistentVolumeReclaimPolicy: Recycle
  storageClassName: slow
  hostPath:
    path: /tmp/data
```

### PersistentVolumeClaim
```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: myclaim
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 8Gi
  storageClassName: slow
```

## Configuration

### ConfigMap
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-config
data:
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
```

### Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysecret
type: Opaque
data:
  username: YWRtaW4=
  password: MWYyZDFlMmU2N2Rm
```

## Security

### RBAC
```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

### ServiceAccount
```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: build-robot
```

## Monitoring

### Resource Metrics
```yaml
apiVersion: metrics.k8s.io/v1beta1
kind: PodMetrics
metadata:
  name: nginx-pod
spec:
  containers:
    - name: nginx
      usage:
        cpu: "100m"
        memory: "128Mi"
```

### Prometheus Integration
```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: example-app
spec:
  selector:
    matchLabels:
      app: example-app
  endpoints:
  - port: web
```

## High Availability

### Multi-Zone Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx
spec:
  replicas: 3
  template:
    spec:
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: "kubernetes.io/hostname"
```

### Auto-scaling
```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
```

## Advanced Features

### Custom Resources
```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  name: crontabs.stable.example.com
spec:
  group: stable.example.com
  versions:
    - name: v1
      served: true
      storage: true
  scope: Namespaced
  names:
    plural: crontabs
    singular: crontab
    kind: CronTab
```

### Operators
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-operator
spec:
  replicas: 1
  selector:
    matchLabels:
      name: nginx-operator
  template:
    metadata:
      labels:
        name: nginx-operator
    spec:
      containers:
        - name: nginx-operator
          image: nginx-operator:v1
```

## Best Practices

### Resource Management
1. Set resource requests/limits
2. Use namespaces
3. Implement quotas
4. Monitor usage

### Security
1. Use RBAC
2. Secure etcd
3. Network policies
4. Container security

### High Availability
1. Multi-zone deployment
2. Pod anti-affinity
3. PodDisruptionBudget
4. Node auto-repair

## Troubleshooting

### Common Commands
```bash
# Pod logs
kubectl logs pod-name

# Pod description
kubectl describe pod pod-name

# Node status
kubectl get nodes

# Cluster health
kubectl get componentstatuses
```

### Debug Techniques
1. Pod debugging
2. Service debugging
3. Node debugging
4. Network debugging

## Additional Resources

### Documentation
- [Kubernetes Docs](https://kubernetes.io/docs/)
- [Kubernetes Blog](https://kubernetes.io/blog/)
- [Kubernetes GitHub](https://github.com/kubernetes/kubernetes)

### Tools
- kubectl
- Helm
- kubectx/kubens
- k9s

## Glossary

### Common Terms
- **Pod**: Smallest deployable unit
- **Service**: Network abstraction
- **Node**: Worker machine
- **Cluster**: Set of nodes
- **Namespace**: Virtual cluster
- **Label**: Key-value pair
- **Selector**: Label query
- **Controller**: State manager
