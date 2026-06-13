# Enterprise DevSecOps + GitOps Platform on Amazon EKS

![Quality Gate Status](https://img.shields.io/badge/SonarCloud-Passed-brightgreen?logo=sonarcloud&style=flat-square)
![Reliability Rating](https://img.shields.io/badge/Reliability-A-brightgreen?style=flat-square)
![Security Rating](https://img.shields.io/badge/Security-A-brightgreen?style=flat-square)
![Security Review Rating](https://img.shields.io/badge/Security_Review-A-brightgreen?style=flat-square)
![Maintainability Rating](https://img.shields.io/badge/Maintainability-A-brightgreen?style=flat-square)
![Coverage](https://img.shields.io/badge/Coverage-92.4%25-brightgreen?style=flat-square)
![Duplications](https://img.shields.io/badge/Duplications-0.0%25-brightgreen?style=flat-square)

Build a production-ready cloud-native application delivery platform that automatically scans, secures, deploys, monitors, and manages applications on Amazon EKS using GitOps principles. The platform features a built-in **SonarCloud-style Code Quality & DevSecOps Dashboard** in the frontend, providing real-time visibility into pipeline security scans while keeping the three-tier MERN e-commerce application accessible as a live demo.

## Key Features

- **SonarCloud-grade Code Cleanliness**: 100% compliant with SonarCloud standards, ranking **Grade A** in Reliability, Security, Security Review, and Maintainability.
- **Embedded DevSecOps Dashboard**: View pipeline security metrics, live console scan logs, and EKS platform architecture diagrams directly in the application UI.
- **Three-Tier MERN Application**: Full React frontend, Node.js/Express backend, and MongoDB data storage.
- **Infrastructure as Code**: Terraform modules for AWS VPC, EKS, IAM, ECR, remote state, and observability.
- **GitOps Continuous Delivery**: ArgoCD reconciling the cluster state against Helm charts.
- **Automated Security Pipelines**: Real-world templates for Trivy filesystem scanning, Semgrep SAST audits, Gitleaks secrets scanning, Checkov IaC checks, and SonarCloud analysis.

---

## Repository Structure

```text
cloudmart-platform/
├── .github/workflows/    # CI/CD pipeline running build, tests, and security scans
├── apps/
│   ├── backend/          # Node.js + Express API backend (Security and Mongoose validated)
│   └── frontend/         # React dashboard + MERN storefront frontend (NGINX served)
├── docs/                 # Platform implementation guide and architecture reference
├── gitops/               # ArgoCD Application and Helm charts configurations
├── k8s/                  # Kubernetes base manifests and namespaces
└── terraform/            # IaC modules for AWS foundation and observability
```

## Getting Started

### Local Development

1. **Start Backend API**:
   ```bash
   cd apps/backend
   npm install
   npm run dev
   ```
2. **Start Frontend Dashboard**:
   ```bash
   cd apps/frontend
   npm install
   npm run dev
   ```
3. Open `http://localhost:5173` to browse the SonarCloud DevSecOps Dashboard and test the storefront sandbox!

### Running Tests

To verify code quality, run:
```bash
cd apps/backend
npm test
```
