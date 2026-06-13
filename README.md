# Enterprise DevSecOps + GitOps Platform on Amazon EKS for CloudMart E-Commerce Microservices

This repository now models a three-tier MERN ecommerce application with enterprise delivery controls on AWS.

## Simple student portfolio layout
- `main` branch: application code only
- `devops` branch: infrastructure, Kubernetes, GitOps, security, and monitoring code
- `.github/workflows/`: CI pipeline for build, test, and security checks

## What is included
- Full implementation guide in `docs/implementation-guide.md`
- Architecture and deployment diagrams in `docs/diagrams/`
- Terraform scaffolding for AWS, VPC, EKS, IAM, ECR, state, security, and observability
- GitOps structure for ArgoCD and Helm
- Kubernetes base manifests and policy examples
- Interview preparation notes and question banks

## Application scope
- Tier 1: React frontend served by NGINX
- Tier 2: Node.js + Express API backend
- Tier 3: MongoDB data layer

## CloudMart app features
- Product catalog browsing
- Cart management
- Order placement
- User profile lookup
- Health endpoints for platform validation

## Primary stack
- AWS, Terraform, S3, DynamoDB
- Docker, ECR, EKS
- GitHub Actions, ArgoCD, Helm
- Gitleaks, Semgrep, Trivy, Checkov, Kyverno
- Prometheus, Grafana, Loki, Alertmanager
- NGINX Ingress Controller, ExternalDNS, Cert Manager, Metrics Server, Cluster Autoscaler, Karpenter

## CI workflow
The GitHub Actions workflow lives in [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) and runs the simple backend test plus frontend build, with placeholders for the DevSecOps scanning jobs used in the `devops` branch pipeline.
