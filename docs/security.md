# Security and Privacy Notes

## Public-repository sanitization

The portfolio repository must not contain:

- Cloudflare API tokens or credentials
- Cloudflare account, KV, Worker, or D1 production identifiers
- Live customer card mappings
- Real customer Google review URLs
- Customer names or business information
- Production environment files
- Private operational logs

## Redirect validation

Destinations are restricted to HTTPS URLs on an allowlist of Google-owned review/navigation hosts. This reduces the risk of turning the redirect endpoint into an arbitrary open redirect.

## Database queries

D1 inserts use bound parameters rather than string interpolation.

## Request-path reliability

Tap logging is scheduled using `ctx.waitUntil()`. The valid redirect response is returned without waiting for the D1 insert to complete.

## Data minimization

The sample event schema stores only card ID, timestamp, coarse country, and Cloudflare colo. It intentionally excludes IP addresses and full user-agent strings.

## Card identifiers

Public examples should use fake/random identifiers. Production card identifiers and mappings should never be committed to this repository.
