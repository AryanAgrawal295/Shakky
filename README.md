# SHAKE LAB

SHAKE LAB is a mobile-first signature-shake menu, custom builder, guest checkout, and staff pickup workflow.

## Run locally

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000`. Orders are stored in MongoDB Atlas. Add `MONGODB_URI` and `MONGODB_DB` to your local `.env` and Vercel Environment Variables; no Postgres server or Prisma migration is needed.

For staff access, open `/admin/login` and use `SHAKE_LAB_ADMIN_PASSWORD` from `.env`. Change both admin environment values before deployment.

## Included flows

- Guest cart persisted in the browser, with independently customized shake entries.
- Server-side ingredient validation and repricing at checkout.
- Required payment acknowledgement; it is recorded as **customer claimed paid**, never as a gateway payment.
- Cryptographically random `SL-XXXXXXX` pickup code plus a separate secure receipt token.
- MongoDB order snapshots for historical ingredients, portions and prices.
- Protected staff order list, search, live 15-second refresh, payment verification, preparation status, and pickup handover.

## Verify

```bash
npm run lint
npm run typecheck
npm test
npm run build
```
