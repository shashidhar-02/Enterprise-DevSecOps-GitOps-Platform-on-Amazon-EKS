# Security policy

## Reporting

Report exploitable issues using GitHub's private vulnerability reporting for this
repository when available. If that channel is unavailable, contact the maintainer
through their GitHub profile to arrange private disclosure. Do not include usable
credentials, customer data or exploitation details in a public issue.

Include the affected revision, reproducible steps, impact and a proposed fix if
available. There is no guaranteed response SLA for this independently maintained
project. Security fixes target the current `main` implementation.

## Security boundaries

The API hashes passwords with salted scrypt (`N=32768`, `r=8`, `p=3`) and validates
JWT algorithm, issuer, audience, expiry and current database identity. Production
session cookies are HttpOnly, Secure and SameSite strict. Origin allowlisting,
signed session-bound double-submit CSRF tokens on unsafe methods,
JSON-only bounded input, request limits and ownership checks apply to writes.
Catalogue prices and authenticated identity are authoritative at checkout.

Public signup cannot grant administrator privileges. Runtime database access is
required for explicit administrative promotion; protect those credentials.
Order sockets require a valid session and order ownership. HTTP/probe/database
errors returned to clients omit internal database details.

Containers run non-root with root-owned application files. Kubernetes adds
restricted pod settings and network policies. EKS has private API access by
default, explicit access roles and encrypted audit/flow logs. These configurations
require validation in the target cluster and do not themselves prove an operational
security certification.

Keep runtime secrets in your secret manager, rotate them, and use separate
credentials per environment. Old committed credentials must be rotated even
after removal from the working tree. See docs/operations.md for legacy-password,
ownership, session-key and data migration requirements.
