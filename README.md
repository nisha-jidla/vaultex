# 🔒 Vaultex — Everything. Elevated.

A production-grade **multi-vendor e-commerce marketplace** built from scratch
using microservices, Docker, and deployed to AWS with Terraform.

> Built by you. Owned by you. Zero copied code.

---

## 🏗️ Architecture

```
Browser
  │
Nginx Gateway (:80)
  │
  ├── /api/users/         → User Service        (Node.js :3001)
  ├── /api/sellers/       → Seller Service      (Node.js :3002)
  ├── /api/cart/          → Cart Service        (Node.js :3003)
  ├── /api/payments/      → Payment Service     (Node.js :3004)
  ├── /ws/                → Notification Svc    (Node.js :3005)
  ├── /api/products/      → Product Service     (Python  :8001)
  ├── /api/orders/        → Order Service       (Python  :8002)
  └── /                   → Frontend            (React   :5173)

Databases:
  MongoDB      :27017   (users, sellers, products)
  MySQL        :3306    (orders)
  Redis        :6379    (cart/cache)
  RabbitMQ     :5672    (async messaging)
  Elasticsearch:9200    (product search)
```

---

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Docker Desktop installed
- Git installed

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/vaultex.git
cd vaultex
```

### 2. Start everything with one command
```bash
docker-compose up --build
```

### 3. Open in browser
| URL                          | What you see              |
|------------------------------|---------------------------|
| http://localhost             | Vaultex Frontend          |
| http://localhost/api/users/  | User Service health       |
| http://localhost/api/products/ | Product Service health  |
| http://localhost:15672       | RabbitMQ Management UI    |

---

## 📦 Services

| Service             | Language   | Port | Database      |
|---------------------|------------|------|---------------|
| user-service        | Node.js    | 3001 | MongoDB       |
| seller-service      | Node.js    | 3002 | MongoDB       |
| cart-service        | Node.js    | 3003 | Redis         |
| payment-service     | Node.js    | 3004 | RabbitMQ      |
| notification-service| Node.js    | 3005 | RabbitMQ + WS |
| product-service     | Python     | 8001 | MongoDB + ES  |
| order-service       | Python     | 8002 | MySQL         |
| frontend            | React/Vite | 5173 | —             |

---

## 🗺️ Build Phases

- [x] **Phase 1** — Project scaffolding (YOU ARE HERE)
- [ ] **Phase 2** — User Service (Register, Login, JWT)
- [ ] **Phase 3** — Seller Service (Dashboard, Product listing)
- [ ] **Phase 4** — Product Service (Catalogue, Search)
- [ ] **Phase 5** — Cart Service (Add/remove, Redis)
- [ ] **Phase 6** — Order Service (Place orders, MySQL)
- [ ] **Phase 7** — Payment Service (Simulate payment)
- [ ] **Phase 8** — Notification Service (WebSockets)
- [ ] **Phase 9** — Frontend (Full React UI)
- [ ] * **Phase 10** — AWS Deployment (Terraform) ✅
- [ ] * **Phase 11** — Prometheus + Grafana Monitoring ✅
- [ ] * **Phase 12** — Kubernetes (Minikube) ✅
- [ ] * **Phase 13** — Helm Charts ✅

---

## 🛠️ Tech Stack

| Layer          | Technology                    |
|----------------|-------------------------------|
| Frontend       | React 18 + Vite + Tailwind    |
| API Gateway    | Nginx                         |
| Backend (JS)   | Node.js + Express             |
| Backend (Py)   | Python + FastAPI              |
| Primary DB     | MongoDB                       |
| Relational DB  | MySQL                         |
| Cache          | Redis                         |
| Search         | Elasticsearch                 |
| Messaging      | RabbitMQ                      |
| Containers     | Docker + Docker Compose       |
| Cloud Infra    | Terraform + AWS               |
| CI/CD          | GitHub Actions                |
| Monitoring     | Prometheus + Grafana          |

---

## 📁 Folder Structure

```
vaultex/
├── frontend/                  # React + Vite app
├── services/
│   ├── user-service/          # Node.js
│   ├── seller-service/        # Node.js
│   ├── cart-service/          # Node.js
│   ├── payment-service/       # Node.js
│   ├── notification-service/  # Node.js
│   ├── product-service/       # Python FastAPI
│   └── order-service/         # Python FastAPI
├── gateway/                   # Nginx config
├── infra/                     # Terraform (AWS)
├── .github/workflows/         # CI/CD pipelines
├── docker-compose.yml
├── .env
└── README.md
```

---

## 🌍 AWS Deployment (Phase 10)

Terraform will provision:
- EC2 instances (or ECS cluster)
- RDS (MySQL)
- ElastiCache (Redis)
- S3 (product images)
- Route53 (custom domain)
- ACM (SSL certificate)

---

*Built with ❤️ — Vaultex is 100% original.*

## Monitoring (Phase 11)

Prometheus + Grafana monitoring stack with:
- Prometheus metrics collection
- Grafana dashboards
- Node Exporter (host metrics)
- cAdvisor (container metrics)

Access:
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## Kubernetes (Phase 12)

All Vaultex microservices deployed to Kubernetes:
- Minikube local cluster
- 8 service deployments
- Namespace isolation
- ClusterIP + NodePort services

## Helm Charts (Phase 13)

Vaultex packaged as a Helm chart for easy deployment:
- Single command deployment: `helm install vaultex helm/vaultex -n vaultex`
- Configurable values via values.yaml
- Supports all microservices