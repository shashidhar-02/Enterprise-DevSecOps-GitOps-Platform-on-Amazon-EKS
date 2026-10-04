# Enterprise DevSecOps GitOps Platform on Amazon EKS

[![Platform Quality](https://github.com/shashidhar-02/Enterprise-DevSecOps-GitOps-Platform-on-Amazon-EKS/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/shashidhar-02/Enterprise-DevSecOps-GitOps-Platform-on-Amazon-EKS/actions/workflows/ci-cd.yml)
[![CodeQL](https://github.com/shashidhar-02/Enterprise-DevSecOps-GitOps-Platform-on-Amazon-EKS/actions/workflows/codeql.yml/badge.svg)](https://github.com/shashidhar-02/Enterprise-DevSecOps-GitOps-Platform-on-Amazon-EKS/actions/workflows/codeql.yml)

**CraveDrop** is a React food-ordering application with a Node.js API and
PostgreSQL, packaged with a tested container and GitOps delivery baseline.
Application, Terraform, Kubernetes and CI configuration live together here.

## Architecture

```text
Browser → HTTPS ALB → frontend Nginx :8080 → backend API :5000 → PostgreSQL :5432
                         /api + /socket.io         private database, verified TLS

PR → lint + tests + audits + CodeQL + container/IaC scanning + schema validation
main → gated GHCR publication → reviewed image-digest PR → Argo CD sync
Terraform → VPC, encrypted logs, private EKS API, EKS Auto Mode, explicit access roles
```

The application supports signup/login, restaurant search and menus, catalogue-priced
orders, authenticated order tracking, and reviews. Ownership is enforced in the
API. It uses one-day HttpOnly session cookies and salted scrypt password hashes.
Delivery (₹45) and taxes (₹20) are fixed demonstration charges; payment processing
and dispatch automation are not implemented.

## Quick start: Docker Compose

Prerequisites: Docker with Compose v2, Git, and Node.js 24 for development/testing.
From the repository root:

```bash
cp .env.example .env
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
# Set a newly generated JWT_SECRET and a separate DB_PASSWORD in .env.
docker compose up --build --wait
docker compose exec -T -e ALLOW_DEMO_SEED=true backend node seed.js
```

Open **http://localhost:8080** and create an account (password: 12–128 characters).
The seed creates a small sample menu only when the catalogue is empty. It never
truncates existing records and refuses to run with `NODE_ENV=production`.
`bash deploy/setup.sh` is an equivalent local Compose launcher.

Compose binds ports to loopback and persists the database in a named volume.
It deliberately uses development cookie settings for local HTTP. Stop with
`docker compose down`; `docker compose down --volumes` also deletes local data.
Changing `DB_PASSWORD` does not change the password in an existing PostgreSQL volume.

## Develop without containers

Create a PostgreSQL database and an application-owned database role, then:

```bash
cp backend/.env.example backend/.env
# Fill in DB_* and a generated JWT_SECRET. Keep NODE_ENV=development locally.
npm ci --ignore-scripts --prefix backend
npm ci --ignore-scripts --prefix frontend
npm --prefix backend run dev
# In another terminal:
npm --prefix frontend run dev
```

Vite serves http://localhost:3000 and proxies the API and authenticated WebSockets
to port 5000. Containers serve both through the same frontend origin. Tokens are
not stored in browser localStorage. Production requires HTTPS and an explicit
`ALLOWED_ORIGINS` matching the public origin.

## Validation

```bash
npm --prefix backend run lint
npm --prefix backend test
npm audit --prefix backend --audit-level=moderate
npm --prefix frontend run lint
npm --prefix frontend test
npm --prefix frontend run build
npm audit --prefix frontend --audit-level=moderate
terraform fmt -check -recursive terraform/
terraform -chdir=terraform init -backend=false -input=false -lockfile=readonly
terraform -chdir=terraform validate
```

Integration tests require a **disposable** database named `cravedrop_test`
(optionally suffixed `_lettersandnumbers`). They reset its tables:

```bash
NODE_ENV=test DB_NAME=cravedrop_test DB_HOST=localhost DB_PORT=5432 \
  DB_USER=your_test_role DB_PASSWORD=your_test_password \
  npm --prefix backend run test:integration
```

Browser tests use the running Compose stack and seeded catalogue:

```bash
npm --prefix frontend exec -- playwright install chromium
npm --prefix frontend run test:e2e
```

CI exercises a real PostgreSQL service, socket authorization, the built frontend
and backend containers, and Chromium signup/checkout/session restoration. It
rejects failed lint, audits, schemas and high/critical container findings.
Validation tools are locked in `tools/go.mod` and `tools/go.sum`; Terraform
providers are locked in `terraform/.terraform.lock.hcl`.

## EKS and GitOps

See [deployment and operations](docs/operations.md) for the complete bootstrap,
secrets, releases, migration and rollback process.

| Path | Purpose |
| --- | --- |
| `backend/`, `frontend/` | Application, unit/integration/browser tests, locked dependencies |
| `compose.yaml` | Reproducible local stack |
| `terraform/` | Three-AZ VPC, EKS Auto Mode, KMS/logging, explicit administrator roles |
| `k8s/base/` | Restricted workloads, probes, disruption budgets and network policies |
| `k8s/overlays/dev`, `k8s/overlays/prod` | Environment-specific deployment configuration |
| `gitops/` | Restricted Argo CD project and applications |
| `.github/` | Pinned workflows, Dependabot, ownership and contribution templates |

Cloud bootstrap requires an existing encrypted/versioned S3 state bucket, IAM
operator roles, access to the private cluster API, a managed PostgreSQL database,
Argo CD, an Auto Mode ALB IngressClass and a matching ACM certificate. Terraform
does not provision the database, DNS, state bucket or Argo CD. Production examples
use `cravedrop.example.com`; configure your domain, origin, VPC CIDRs and image
digests before syncing. The `bootstrap` image tags are placeholders, not releases.

GitHub Actions publishes commit-tagged images only after main passes all platform
checks. It records image digests and provenance/SBOM metadata. Release image
changes go through a PR; workflows do not push deployment edits directly to main.
Argo CD sync is operator-initiated by default.

## API

All endpoints use `/api`. Catalogue reads and health probes are public; writes
and order access require authentication.

| Method/path | Access and purpose |
| --- | --- |
| `GET /health`, `GET /ready` | Liveness; database-dependent readiness |
| `POST /auth/signup`, `/auth/login`, `/auth/logout` | Session lifecycle |
| `GET /auth/me` | Current authenticated account |
| `GET /auth/csrf` | Signed, session-bound CSRF token; send it in `X-CSRF-Token` for writes |
| `GET /restaurants`, `GET /restaurants/:id`, `GET /restaurants/:id/dishes` | Bounded catalogue/search/menu reads |
| `POST /restaurants` | Create a restaurant owned by the current account |
| `PUT/DELETE /restaurants/:id`, `POST /restaurants/:id/dishes` | Owner or administrator |
| `POST /orders` | Submit `restaurant_id` and `items: [{id, quantity}]`; server calculates all prices |
| `GET /orders/:id`, `GET /orders/user/:userId` | Own orders only |
| `DELETE /orders/:id` | Cancel an owned early-stage order; preserves history |
| `PUT /orders/:id/status` | Administrator; validated status values |
| `GET /reviews/restaurant/:id`, `POST /reviews`, `DELETE /reviews/:id` | Public reads; authenticated creation; owner/admin deletion |

Register the intended administrator account normally, then run
`ADMIN_EMAIL=your-account@example.com node scripts/admin.js` from `backend/`
with authorized database credentials. Public signup cannot grant privileges.
Restaurant owners can populate menus through `POST /restaurants/:id/dishes`
with `name`, `price`, `is_veg`, optional `description` and `image_url`.

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
The original Apache 2.0 license is preserved in [LICENSE](LICENSE).
Existing installations must follow the credential rotation and account/data
migration notes before adopting the new authentication contract.
