#!/usr/bin/env bash
set -euo pipefail
root="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
docker compose --project-directory "$root" config --quiet
docker compose --project-directory "$root" up --build --wait --wait-timeout 120
printf 'Local CraveDrop: http://localhost:8080\n'
