# Deployment and operations

## Infrastructure bootstrap

Use Terraform 1.13+ and AWS credentials from an operator role (OIDC or your usual
short-lived AWS login). Supply your account's existing administrator role ARN;
the cluster creator is not automatically granted administrator access.

```bash
cp terraform/backend.hcl.example terraform/backend.hcl
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Replace state bucket, account/role, region, environment and cluster name.
terraform -chdir=terraform init -backend-config=backend.hcl -lockfile=readonly
terraform -chdir=terraform plan -out=deployment.tfplan
terraform -chdir=terraform apply deployment.tfplan
aws eks update-kubeconfig --region YOUR_REGION --name YOUR_CLUSTER
```

The state bucket must have encryption, versioning, blocked public access, and IAM
permissions for the state object and its `.tflock` object. Plans and state can
contain secrets and must stay outside Git. The default EKS API endpoint is
private: run cluster operations through a VPC-connected workstation/runner.
Restricted public access is an explicit opt-in requiring operator CIDRs.
Production creates one NAT gateway per AZ; development shares one.

EKS Auto Mode manages compute and its built-in networking/load-balancing
capabilities. Configure and verify network-policy enforcement on your cluster;
manifests alone do not prove packet filtering. Install/manage Argo CD separately
with its upstream supported release and restricted administrator access. Create
an Auto Mode ALB IngressClass named `auto-alb` using the AWS EKS documentation,
then provide a regional ACM certificate matching your configured public domain.
The production ingress uses HTTPS-only listeners and certificate discovery.

## Database and runtime configuration

Provision a private PostgreSQL database with backup retention, point-in-time
recovery, encryption and a narrowly scoped application role. Supply environment
configuration using your secret manager or externally managed Kubernetes Secret.
In each application namespace, `backend-secrets` needs:

- `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`;
- a newly generated `JWT_SECRET` with at least 32 characters.

Create the namespace from its overlay's `namespace.yaml` before provisioning
runtime configuration. Use a secret manager/operator, or prepare a protected,
untracked env file and run:

```bash
kubectl -n cravedrop-dev create secret generic backend-secrets \
  --from-env-file=/secure/path/backend-runtime.env
kubectl -n cravedrop-dev create configmap database-ca \
  --from-file=rds-ca.pem=/secure/path/verified-rds-ca-bundle.pem
```

Repeat with separate credentials in `cravedrop-prod`. The CA bundle is public
trust material, not a password. Obtain/verify it from the database provider.
The API verifies database TLS certificates; do not disable certificate checks.
If GHCR packages are private, configure an image pull secret in each namespace
and reference it in the deployment. GitOps deliberately contains no passwords or
Secrets. Do not commit plaintext or base64-encoded secret values.

Edit the environment's origin, ingress hostname, VPC/database network-policy
CIDRs and reviewed image digests. `TRUST_PROXY_HOPS=1` trusts the frontend proxy
immediately before the backend; backend ingress is restricted to frontend pods.
If adding a proxy layer, verify the forwarded-address chain and adjust the count
accordingly. The in-memory request limiter is per replica, not a distributed quota.

## Release and promotion

1. Merge an application PR after platform, CodeQL and configured quality checks.
2. The main workflow publishes both GHCR images under the full commit SHA and
   records OCI digests in its summary. Configure package visibility/pull access.
3. Add `images` entries to the dev overlay using each recorded digest, for example:

   ```yaml
   images:
     - name: ghcr.io/shashidhar-02/enterprise-devsecops-gitops-platform-on-amazon-eks/cravedrop-backend
       newName: ghcr.io/shashidhar-02/enterprise-devsecops-gitops-platform-on-amazon-eks/cravedrop-backend
       digest: sha256:REPLACE_WITH_VERIFIED_RELEASE_DIGEST
   ```

   Add the frontend digest too. Review/render both overlays in the release PR.
   The literal `bootstrap` base tags intentionally cannot serve as production releases.
4. Bootstrap the Argo CD project/applications after their source paths exist on main:

   ```bash
   kubectl apply -f gitops/project.yaml
   kubectl apply -f gitops/applications.yaml
   argocd app sync cravedrop-dev
   argocd app wait cravedrop-dev --health --timeout 180
   ```

5. Check startup/readiness, HTTPS cookie handling, checkout and order visibility,
   database errors, network policies and logs. Promote the same digests to prod
   through a PR, then sync/wait for `cravedrop-prod`.

The applications have no automatic sync or destructive pruning configured.
Adjust that operational policy only after validating ownership and rollback.
The restricted Argo project can deploy only this repository's application resources
into its two namespaces. Configure GitHub branch protection and required checks,
CODEOWNER review, and appropriate Argo CD RBAC for your operators.

## Schema and account migration

Back up the database and test upgrades against a disposable restored copy first.
Startup applies additive, idempotent schema changes in a transaction serialized
by a PostgreSQL advisory lock. Changes add account roles and resource ownership;
restaurant deletion no longer cascades into historical orders.

Legacy installations stored plaintext passwords or used arbitrary order `user_id`
strings. The new API rejects plaintext passwords. Arrange verified password resets
or a controlled offline conversion before rollout; do not expose a plaintext-login
fallback. Map legacy order identities to verified user IDs and assign restaurant/
review ownership with a reviewed data migration. Unowned legacy writes are denied
until an administrator assigns ownership. Review those mappings before restoring
old data. A public signup request cannot promote itself to administrator.

The old repository included database credentials in `backend/.env` and its EC2
script. Removing them from the current tree does not erase history: rotate any
deployed values, rotate session keys to invalidate sessions, and coordinate any
history remediation with collaborators. The local Compose launcher replaces
the previous hard-coded EC2 provisioning script.

## Health, scaling and rollback

- `/api/health` checks the process; `/api/ready` checks database connectivity.
  Frontend `/healthz` checks Nginx. Startup failures exit nonzero; termination
  closes sockets/connections within a bounded grace period.
- Probes, resource bounds, read-only non-root filesystems, default-deny policies,
  disruption budgets and spread constraints are present. Validate their behavior
  against the target cluster rather than treating schema checks as live deployment.
- Socket.IO rooms are authenticated and ownership-checked. Notifications are
  local to each API replica; the browser also refreshes authoritative order state
  every 10 seconds. Cross-replica immediate broadcast requires a distributed
  Socket.IO adapter/event bus. Notification delivery is not a durable order queue.
- Centralize container logs, monitor API latency/error rate, readiness, pool
  utilization and database health, and configure actual alert destinations.
  EKS control-plane and VPC flow logs use KMS encryption and 90-day retention.
- Roll back application digests by reverting the release PR, then syncing Argo CD.
  Keep forward-compatible schema migrations; reversing code does not reverse DDL.
  Use a tested database recovery process for incompatible data/schema changes.

## Optional integrations

Microsoft Security DevOps scans run in GitHub Actions; Azure Defender reporting
requires separate onboarding. Sim is manually dispatched after configuring
`SIM_WORKFLOW_URL` and `SIM_API_KEY`; PR metadata is serialized as JSON rather
than interpolated into shell source. These integrations do not establish live
cloud deployment or replace the required platform/security checks.
