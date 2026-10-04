# Contributing

Create a focused branch from `main`, describe the problem and proposed change,
and open a pull request using the template. Application and deployment code are
reviewed together here; no separate branch is required to access the platform.

## Before submitting

- Run the relevant lint, unit tests and dependency audits from the README.
- Run database integration tests against a disposable `cravedrop_test` database
  when changing routes, migrations, authentication or socket access.
- Exercise the real Compose/browser flow for frontend or proxy changes.
- Format/validate Terraform with the committed provider lock. Render both
  Kubernetes overlays and validate their schemas; validate Argo CRDs separately.
- Pin GitHub Actions to full commit SHAs and dependencies to lockfiles. Use
  `npm ci --ignore-scripts`; review any package that genuinely requires a script.
- Keep credentials, plans, state, generated dependencies and build output out of
  commits. Report security issues privately according to SECURITY.md.

Tests should exercise observable behavior and important failure cases. Include
authorization, input validation, data preservation, and rollback/migration impact
when relevant. CI failures are actionable; do not use `|| true`, blanket scan
exclusions or weakened quality gates to make a failing check appear successful.

## Pull request information

Explain what changed and why, list the checks actually run, and document
deployment/configuration/migration changes. Include screenshots for material UI
changes where useful. Link relevant issues, and address review feedback in new
commits. Maintainers merge only after applicable checks and review pass.

Dependency updates should regenerate and commit their lockfiles. Terraform
module upgrades need reviewed plans in an appropriate AWS environment; local
`validate` only checks configuration. Deployment-image updates should promote
reviewed OCI digests. See docs/operations.md for releases and rollback.
