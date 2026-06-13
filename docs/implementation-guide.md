# Enterprise DevSecOps + GitOps Platform on Amazon EKS for CloudMart E-Commerce Microservices

## 1. Executive Summary
CloudMart is designed as a production-grade, multi-account AWS platform running on Amazon EKS. Terraform provisions the foundation, GitHub Actions runs build and security automation, Amazon ECR stores immutable images, and ArgoCD applies GitOps-based deployments. Helm packages the three-tier MERN ecommerce application. Security, observability, and automation are treated as first-class platform capabilities.

## 2. Business Problem
A realistic e-commerce platform needs repeatable deployments, secure software delivery, scalable infrastructure, and clear operational controls. This project demonstrates how an enterprise team would reduce release risk, improve uptime, enforce policy, and support frequent application changes across multiple microservices.

## 3. Project Objectives
- Build a secure and scalable cloud-native platform.
- Implement GitOps delivery with auditable changes.
- Integrate security scans into every stage of the pipeline.
- Provide observability with metrics, logs, and alerts.
- Demonstrate production-style AWS and Kubernetes design patterns.

## 4. Functional Requirements
- Deploy frontend and backend microservices on EKS.
- Build and publish images to ECR.
- Manage infrastructure with Terraform.
- Store secrets in AWS Secrets Manager.
- Reconcile deployments with ArgoCD.
- Enforce admission policies with Kyverno.
- Monitor workloads using Prometheus, Grafana, Loki, and Alertmanager.

## 5. Non-Functional Requirements
- High availability across multiple AZs.
- Secure-by-default workload and cluster posture.
- Immutable artifact promotion.
- Infrastructure idempotency and reviewable changes.
- Fast rollback through Git revert.
- Low operational toil through automation.

## 6. High-Level Architecture
CloudMart runs across AWS accounts for shared services, non-production, and production. The platform is split into infrastructure, delivery, and application layers. Terraform creates the VPC, EKS, ECR, IAM, and supporting security services. GitHub Actions handles CI, scanning, and release workflows. ArgoCD performs deployment reconciliation for the React frontend, Node.js API, and MongoDB data tier.

## 7. Detailed Component Architecture
Core components include Route 53, AWS WAF, ALB ingress, EKS, ECR, Secrets Manager, ArgoCD, Helm, Kyverno, Prometheus, Grafana, Loki, Alertmanager, NGINX Ingress Controller, ExternalDNS, Cert Manager, Metrics Server, Cluster Autoscaler, and Karpenter. The application tier is a simple MERN stack with a React frontend, Express backend, and MongoDB datastore.

## 8. AWS Architecture Diagram (ASCII)
```text
Users -> Route 53 -> WAF -> ALB -> EKS -> Microservices
                              |-> Prometheus/Grafana/Loki
                              |-> ArgoCD/Kyverno
Terraform -> VPC/EKS/ECR/IAM/Secrets Manager
GitHub Actions -> Scan -> Build -> Push to ECR -> GitOps Update
```

## 9. Kubernetes Architecture Diagram (ASCII)
```text
Namespace -> Deployments -> Pods -> Services -> Ingress
                     |-> ConfigMaps/Secrets
                     |-> HPA/KEDA-like scaling signals
                     |-> NetworkPolicies and Kyverno policies
```

## 10. Network Architecture
Use a VPC across three AZs with public subnets for ALB and private subnets for EKS worker nodes. Place NAT gateways in public subnets for controlled egress. Use VPC endpoints for ECR, STS, Secrets Manager, and CloudWatch where possible. The frontend serves through NGINX and proxies `/api` traffic to the backend service.

## 11. Security Architecture
Security is enforced at source, build, admission, and runtime. Gitleaks scans for secrets, Semgrep performs SAST, Checkov validates Terraform, Trivy scans images, and Kyverno blocks unsafe Kubernetes manifests. AWS Secrets Manager stores runtime secrets. AWS WAF and IAM least privilege protect the AWS edge and control plane.

## 12. GitOps Architecture
ArgoCD continuously reconciles the cluster against the GitOps repository. Helm charts define the desired application state and environment-specific values. Promotion is performed by merging the next environment configuration into Git.

## 13. CI/CD Architecture
GitHub Actions runs tests, security scans, Docker builds, and image pushes to ECR. The pipeline updates the GitOps repository using immutable image digests. ArgoCD deploys from Git, not from CI directly.

## 14. Observability Architecture
Prometheus scrapes metrics, Grafana visualizes dashboards, Loki collects logs, and Alertmanager routes incidents. Service-level views should include request rate, latency, error rate, pod health, rollout health, and dependency health.

## 15. End-to-End Workflow
1. Developer opens a pull request.
2. CI runs tests and security scans.
3. Frontend and backend images are built and pushed to ECR.
4. GitOps manifests or Helm values are updated.
5. ArgoCD syncs the cluster.
6. Kyverno validates the workload.
7. Metrics and logs verify runtime health.
8. Promotion proceeds through environments.

## 16. Complete Repository Structure
```text
cloudmart-platform/
├── apps/
├── docs/
├── gitops/
├── k8s/
└── terraform/
```

## 17. Application Repository Structure
```text
apps/
├── frontend/
├── product-service/
├── cart-service/
├── order-service/
└── user-service/
```

## 18. DevOps Repository Structure
```text
terraform/
gitops/
docs/
k8s/
```

## 19. Branching Strategy
Use trunk-based development with short-lived feature branches. Protect `main` with required reviews and required checks. Use pull requests for all changes. Promote releases through GitOps environment folders.

## 20. Terraform Folder Structure
```text
terraform/
├── envs/
│   ├── dev/
│   ├── stage/
│   └── prod/
└── modules/
    ├── vpc/
    ├── iam/
    ├── eks/
    ├── ecr/
    ├── state/
    ├── security/
    └── observability/
```

## 21. Terraform Module Design
Each module should be reusable, environment-agnostic, and input-driven. The EKS module should consume VPC outputs, IAM roles, and tagging standards. The VPC module should expose subnets, route tables, and endpoint IDs.

## 22. VPC Design
Build one VPC per environment. Use three AZs, public subnets, private app subnets, and private data subnets. Reserve CIDR space for future services and platform growth.

## 23. Public and Private Subnets
ALB lives in public subnets. Nodes and pods live in private subnets. Database or shared service endpoints, when used, live in isolated subnets.

## 24. NAT Gateway Design
Use one NAT gateway per AZ for production resilience if budget allows. For lower environments, one NAT gateway can be acceptable to reduce cost.

## 25. Route Tables
Associate public route tables with internet gateway routes. Private route tables should point to NAT gateways and VPC endpoints only.

## 26. Security Groups
Use separate security groups for ALB, EKS nodes, and platform endpoints. Allow only necessary inbound and outbound traffic. Deny broad node-to-node exposure unless explicitly needed.

## 27. IAM Roles
Use IRSA for workloads, node instance roles for managed node groups, and scoped IAM roles for Terraform automation and GitHub OIDC federation.

## 28. EKS Cluster Design
Use private endpoint access where possible, enable control plane logging, use managed add-ons, and standardize tags and cluster labels.

## 29. Managed Node Groups
Run general workloads on managed node groups. Use instance types suited for microservices such as `t3`, `m5`, or `c6i` families depending on budget and load.

## 30. Karpenter Configuration
Use Karpenter for burst and right-sized compute provisioning. Define node pools, disruption budgets, and consolidation policies.

## 31. Cluster Autoscaler Design
Cluster Autoscaler should continue to support baseline node group scaling if Karpenter is not used for every workload. In a modern setup, Karpenter can be the primary dynamic provisioner.

## 32. Namespace Strategy
Separate namespaces by environment and application boundary. Add platform namespaces for monitoring, logging, ingress, ArgoCD, and policies.

## 33. Resource Quotas
Set CPU, memory, and object quotas per namespace. Enforce limit ranges so workloads cannot omit requests and limits.

## 34. Network Policies
Deny all traffic by default and allow only approved service-to-service flows. Permit ingress from the ingress controller and platform components where needed.

## 35. Amazon ECR Setup
Create one repository per service and one repository for platform images if needed. Enable image scanning and lifecycle policies to remove stale tags.

## 36. Docker Build Process
Use multi-stage builds, non-root containers, small base images, and deterministic tags. Build with `docker buildx` for reproducibility.

## 37. GitHub Actions Workflow
The workflow should include checkout, dependency install, tests, secret scanning, SAST, IaC scanning, image build, Trivy scan, and ECR push.

## 38. Gitleaks Integration
Run Gitleaks on pull requests and main branch merges to detect exposed credentials before they reach deployment.

## 39. Semgrep Integration
Use Semgrep rules for application security, insecure patterns, and dependency abuse. Tune rules to avoid excessive false positives.

## 40. Dependency Scanning
Run dependency checks during CI for application packages. Keep lock files committed and pinned versions reviewed.

## 41. Checkov Integration
Scan Terraform for misconfigurations such as open security groups, missing encryption, and weak IAM policies.

## 42. Trivy Integration
Scan both container images and local filesystems for vulnerabilities and misconfigurations.

## 43. ECR Push Process
Push only after tests and scans pass. Tag images with Git SHA and also store the immutable digest in release metadata.

## 44. GitOps Repository Design
The GitOps repo should contain environment folders, app manifests, and platform bootstrapping manifests. ArgoCD should watch this repo exclusively for deployments.

## 45. Helm Chart Structure
```text
charts/app-name/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-stage.yaml
├── values-prod.yaml
└── templates/
```

## 46. ArgoCD Application Design
Create one application per service and environment, or use ApplicationSets for scale. Separate platform bootstrap apps from business apps.

## 47. ArgoCD Sync Strategy
Use automated sync for lower environments and controlled sync windows or approvals for production. Use sync waves for platform dependencies.

## 48. Deployment Promotion Strategy
Promote the same digest from dev to stage to prod. Only environment-specific values should change.

## 49. Rollback Strategy
Rollback by reverting the GitOps commit or pinning the previous image digest. Avoid direct cluster mutations.

## 50. Blue-Green Deployment Design
Use blue-green where zero-downtime releases are required for the frontend or order workflows. Keep both versions healthy until traffic is switched.

## 51. Canary Deployment Design
Use canary for higher-risk microservice releases. Route a small percentage of traffic first and expand only after health checks pass.

## 52. Kyverno Policy Design
Kyverno should block privileged containers, root users, missing resource limits, unsigned or unapproved images, and unsafe namespaces.

## 53. Secret Management Strategy
Never store secrets in Git. Use AWS Secrets Manager and synchronize only when the workload starts or through CSI integration.

## 54. AWS Secrets Manager Integration
Use IRSA so pods can retrieve only the secret values they need. Rotate secrets and version them carefully.

## 55. Monitoring Architecture
Instrument services with Prometheus metrics, store logs in Loki, and expose dashboards in Grafana. Use Alertmanager to route incidents.

## 56. Prometheus Setup
Prometheus should scrape node, pod, ingress, and application metrics. Add ServiceMonitors or PodMonitors for each service.

## 57. Grafana Dashboards
Build dashboards for platform health, service health, deployment health, and business KPIs.

## 58. Loki Logging Architecture
Centralize logs with labels for namespace, service, pod, and environment. Keep retention aligned to cost and compliance requirements.

## 59. Alertmanager Configuration
Route alerts to email, Slack, or PagerDuty. Group related alerts and suppress noisy duplicates.

## 60. SLI Definitions
Use request availability, latency, error rate, rollout success, pod readiness, and queue saturation as SLIs.

## 61. SLO Definitions
Define explicit targets such as 99.9% availability and under 300ms p95 for key API requests where realistic.

## 62. Incident Response Workflow
Detect, triage, mitigate, communicate, and recover. Link alerts to runbooks and rollback steps.

## 63. Capacity Planning Strategy
Track node utilization, HPA trends, service latency, and monthly traffic growth. Plan seasonal headroom for e-commerce peaks.

## 64. Disaster Recovery Strategy
Document region-level recovery steps, environment rebuild automation, and data restoration procedures.

## 65. Backup Strategy
Back up Terraform state, Git repositories, and application configuration. If persistent data exists later, include database backups and restore drills.

## 66. Cost Optimization Strategy
Use right-sized node groups, Karpenter consolidation, log retention limits, and lower-cost environments for non-production.

## 67. Production Best Practices
Use least privilege, immutable artifacts, automated checks, change approval, and observability gates before promotion.

## 68. Security Best Practices
Shift security left, enforce admission controls, rotate secrets, review IAM regularly, and isolate production.

## 69. Kubernetes Best Practices
Use readiness and liveness probes, requests and limits, pod disruption budgets, and topology spread where possible.

## 70. Terraform Best Practices
Use modules, remote state, locking, version pinning, formatting, validation, and reviewable plans.

## 71. GitOps Best Practices
Keep Git as the source of truth, avoid manual cluster edits, and manage promotion via pull requests.

## 72. Testing Strategy
Include unit, integration, smoke, security, Helm, and infrastructure tests. Fail fast on policy violations.

## 73. Load Testing Strategy
Use load tests before production release, especially for checkout and order services. Measure throughput, latency, and error rate.

## 74. Validation Checklist
- Terraform plan is reviewed.
- Security scans pass.
- ECR images are built.
- GitOps repo updated.
- ArgoCD sync succeeds.
- Pods are healthy.
- Dashboards and alerts are active.

## 75. Troubleshooting Guide
Check CI logs, ArgoCD sync status, pod events, Kyverno policy decisions, ingress rules, and secret access permissions.

## 76. Common Failure Scenarios
- Image pull failures.
- Bad ingress configuration.
- Secret access denied.
- Policy rejection by Kyverno.
- Failed rollout due to missing probes.

## 77. Deployment Guide
Provision Terraform first, then platform services, then ArgoCD, then base policies, then applications.

## 78. Step-by-Step Implementation Plan
1. Create AWS foundation.
2. Provision networking and state backend.
3. Build EKS and node groups.
4. Install ingress, DNS, cert manager, autoscaling, and monitoring.
5. Add GitHub Actions and ECR pipelines.
6. Create GitOps repo and Helm charts.
7. Deploy applications.
8. Harden with Kyverno and policies.

## 79. Phase-Wise Development Roadmap
- Phase 1: Infrastructure foundation.
- Phase 2: Cluster platform services.
- Phase 3: Application CI/CD and GitOps.
- Phase 4: Security and observability hardening.
- Phase 5: Cost, DR, and interview refinement.

## 80. Estimated AWS Monthly Cost
For a student portfolio project, lower environments can stay around a modest monthly budget by using small nodes and limited retention. Production-like sizing can be higher depending on NAT gateways, nodes, logging volume, and load balancers.

## 81. Resume Project Description
CloudMart is an enterprise-grade AWS EKS platform built with Terraform, GitHub Actions, ArgoCD, Helm, and layered DevSecOps controls to simulate secure microservices delivery.

## 82. Resume Bullet Points
- Designed and implemented a multi-account AWS platform for CloudMart microservices on EKS.
- Built Terraform modules for VPC, EKS, IAM, ECR, and remote state management.
- Implemented GitHub Actions pipelines with Gitleaks, Semgrep, Checkov, and Trivy.
- Enabled GitOps delivery with ArgoCD and Helm-based releases.
- Hardened workloads with Kyverno, Secrets Manager, and network policies.
- Established Prometheus, Grafana, Loki, and Alertmanager observability.

## 83. Architecture Explanation for Interview
Describe the platform as a secure, automated, Git-driven delivery system. Explain why Terraform manages infrastructure, why ArgoCD manages runtime state, why ECR stores immutable images, and why policy enforcement occurs in CI and at admission. Emphasize multi-AZ design, least privilege, and rapid rollback.

## 84. 50 DevOps Interview Questions and Answers based on this project
See [devops-qna.md](interview/devops-qna.md).

## 85. 50 Kubernetes Interview Questions and Answers based on this project
See [kubernetes-qna.md](interview/kubernetes-qna.md).

## 86. 50 AWS Interview Questions and Answers based on this project
See [aws-qna.md](interview/aws-qna.md).

## 87. 50 Terraform Interview Questions and Answers based on this project
See [terraform-qna.md](interview/terraform-qna.md).

## 88. 50 GitOps/ArgoCD Interview Questions and Answers based on this project
See [gitops-qna.md](interview/gitops-qna.md).

## 89. 50 DevSecOps Interview Questions and Answers based on this project
See [devsecops-qna.md](interview/devsecops-qna.md).

## 90. 50 SRE Interview Questions and Answers based on this project
See [sre-qna.md](interview/sre-qna.md).
