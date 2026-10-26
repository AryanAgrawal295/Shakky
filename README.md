# SHAKE LAB

A private, browser-only protein shake cost calculator. Choose ingredients and quantities to see an estimated ingredient cost and nutrition breakdown instantly.

## What it does

- Browse eight signature shake ideas.
- Start with a recipe or build from scratch.
- Add, remove and adjust ingredients within safe quantity ranges.
- See each ingredient's cost and a live total in INR.
- See nutrition estimates and known allergen information.

## Privacy

There is no database, account, checkout, order, email, admin dashboard, API integration, browser storage, or external data connection. A calculation exists only while the page is open.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

No environment variables are required. `.env` is optional and may be omitted.

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Ingredient prices and nutrition values in [lib/catalog.ts](lib/catalog.ts) are illustrative estimates. Edit that file if you want to use different local ingredient prices.
# Shakky
# Shakky
