# TapReview — Serverless NFC/QR Review Redirect Platform

TapReview is a portfolio-safe reconstruction of a serverless NFC/QR redirect system built with **Claude Code** and **Cloudflare**. The public version demonstrates the architecture and security decisions without exposing production bindings, customer mappings, credentials, account IDs, or live review destinations.

## What it demonstrates

- Cloudflare Workers request handling
- Cloudflare KV for card-ID-to-destination lookup
- Cloudflare D1 for historical tap-event logging
- Immediate HTTP 302 redirects
- Asynchronous event logging with `ctx.waitUntil()` so logging does not block the redirect
- Destination allowlisting for Google review URLs
- Parameterized D1 queries
- Privacy-conscious telemetry that does not store IP addresses or full user-agent strings
- TypeScript-based serverless application structure
- AI-assisted engineering workflow using Claude Code

## Architecture

```text
NFC / QR card
    |
    v
Cloudflare Worker  --->  KV lookup: card ID -> destination URL
    |                            |
    |                            v
    |                       Validate URL
    |
    +---- 302 redirect ----------> Google review destination
    |
    +---- ctx.waitUntil() -------> D1 tap-event insert
```

The redirect path is intentionally separated from event persistence. A logging failure should not prevent a valid card from reaching its configured destination.

## Repository structure

```text
src/index.ts              Worker request handling and validation
schema.sql                Sanitized D1 schema
wrangler.toml.example     Example bindings only; no production IDs
.env.example              Placeholder environment values only
docs/security.md          Security and privacy decisions
```

## Security decisions

This public repository intentionally excludes production data and configuration. See [`docs/security.md`](docs/security.md).

## Portfolio note

This repository is a **sanitized public portfolio version**, not the live TapReview production repository. Production identifiers, customer mappings, Cloudflare account/database IDs, secrets, and live destination URLs are intentionally omitted.
