# CloudMart DevSecOps Practices

- Use `.gitignore` to keep secrets, dependency folders, build output, and Terraform state out of Git.
- Use `.dockerignore` to keep images small and prevent leaking source control metadata.
- Run pre-commit hooks for local validation.
- Keep secrets in AWS Secrets Manager and never commit secret values.
- Scan code with Semgrep and secrets with Gitleaks.
- Scan infrastructure with Checkov.
- Scan containers with Trivy.
- Enforce policy with Kyverno.
- Prefer immutable image tags and GitOps deployments.
- Keep production promotion through Git and pull requests only.
