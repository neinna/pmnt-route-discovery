# Payment Route Discovery

Plain-language route intelligence for B2B cross-border payments. Describe a payment scenario, and the app compares stablecoin, crypto PSP, local PSP, and legacy rails for that corridor and amount.

- Live demo: https://pmnt-route-discovery.vercel.app
- Built by: Long Tail Studio
- Stack: Next.js, React, Tailwind CSS, Anthropic API

## What It Does

- Parses a payment scenario into amount, origin currency, destination country, destination currency, urgency, and sender context.
- Compares vendors and rails from `data/vendors.json`.
- Recommends 2-3 routes with estimated total cost, fee breakdown, settlement time, best-fit condition, and caveat.
- Includes a blockchain rail comparison page for Solana, Base, Tempo, and Stellar.
- Rate-limits requests to reduce abuse.

Example prompts:

```text
Send $500K USD to our supplier in Mexico by end of week
Pay a vendor in Brazil 200,000 USD, standard timing is fine
Wire $2M from our US entity to our UK subsidiary today
Monthly payroll: $80K to employees in the Philippines
```

## Product Thesis

Cross-border payment decisions are usually buried in vendor pages, compliance assumptions, bank habits, and spreadsheet math. This prototype turns the first discovery step into a guided comparison: which rail is likely cheapest, fastest, and operationally realistic for a specific payment.

It is not financial advice and does not execute payments. It is a routing and comparison tool.

## Architecture

- `app/page.tsx` renders the route-finder UI.
- `app/api/route/route.ts` validates input, applies rate limiting, sends the vendor context to Claude, and returns structured JSON.
- `data/vendors.json` stores the current vendor and rail assumptions.
- `app/rails/page.tsx` compares blockchain rails for payment use cases.

## Running Locally

```bash
git clone https://github.com/neinna/pmnt-route-discovery.git
cd pmnt-route-discovery
npm install
cp .env.local.example .env.local
npm run dev
```

Set `ANTHROPIC_API_KEY` in `.env.local`.

## Status

Prototype. The next useful improvements are source-backed vendor assumptions, durable caching, tests for the routing API, and a clearer evaluation set for payment scenarios.
