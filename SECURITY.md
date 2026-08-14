# Security Policy

Hermes Mission Control 0.2.x is a **local demo UI**. It is not a multi-tenant
or internet-facing control plane.

## Assumptions

- Bind to localhost. Do not expose `next start` to the public internet.
- `POST /api/goals` is unauthenticated and mutates the in-memory mock store only.
- There is no real Hermes backend, so there is currently no SSRF surface to a
  user-controlled model endpoint.

## Reporting

Email `dev@smfworks.com` or open a private GitHub security advisory.
