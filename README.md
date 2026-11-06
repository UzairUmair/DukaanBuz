# DukaanSaz Frontend

A React + Vite seller experience for DukaanSaz, a Pakistani multi-tenant product catalog SaaS. It connects directly to the deployed Express/MongoDB backend, rather than using mock data.

## Stack

- React 19 and Vite
- Material UI for accessible dialogs and form primitives
- React Router for marketing, seller, and public storefront routes
- Axios with one central API client
- Lucide React icons
- Hallmark v2 design audit guidance

## Run locally

```bash
npm install
```

Copy `.env.example` to `.env`:

```bash
npm run dev
```

The Vite app runs at `http://localhost:5173`. The deployed backend currently permits that local origin via CORS.

## Environment

```text
VITE_API_URL=https://dukaanbuz-backend.vercel.app/api
```

This is a public client configuration, not a secret. Do not add backend secrets, a MongoDB URI, or a JWT secret to the frontend.

## Routes

| Experience | Routes |
| --- | --- |
| Marketing/auth | `/`, `/login`, `/register` |
| Seller onboarding | `/onboarding` |
| Seller admin | `/dashboard`, `/dashboard/products`, `/dashboard/products/new`, `/dashboard/products/:id/edit`, `/dashboard/store` |
| Public store | `/s/:slug`, `/s/:slug/p/:id` |

## Backend integration

The API base URL is configured once in [src/api/client.js](src/api/client.js). Service modules match the deployed backend contract:

- `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- `GET/POST/PUT /stores/me` and `/stores`
- Product CRUD at `/products/:id`, including `POST /products/:id/image`
- `GET /dashboard/stats`
- Public store and public product routes under `/public/stores/:slug`

Successful login stores the Bearer token in **sessionStorage**. This keeps an active session through a tab refresh while clearing it when the browser session ends. It is appropriate for the educational Bearer-token API used here, but it does not replace backend authorization and requires normal XSS protections in a production application.

The backend returns relative product image paths, so [src/utils/imageUrl.js](src/utils/imageUrl.js) resolves them against the backend origin.

## Image uploads

The backend locally accepts images up to 5 MB, but Vercel Functions enforce a 4.5 MB request limit. The frontend therefore validates images at **4 MB** before sending them. It supports JPEG, PNG, and WebP. Product creation and image upload intentionally use two API calls; if image upload fails, the product remains saved and the seller can retry without duplicating it.

## Test and build

```bash
npm run lint
```

```bash
npm run build
```

```bash
npm test
```

Verified on 6 November 2026: frontend lint passed, 4 unit tests passed, production build passed. The backend's separate test suite passed 15 tests. Two disposable sellers were registered on the deployed backend; store creation, product create/list/filter/edit/delete, JWT profile, ownership denial, public store isolation, PNG upload and repeat image retrieval passed. The two test products were deleted. The backend has no account/store deletion route, so those empty test stores and accounts remain.

Hallmark static audit:

```bash
node .agents/skills/hallmark/scripts/sloplint.mjs src --scope app
```

Run it with `--render --url http://localhost:5173/` after starting the dev server to inspect rendered output. The Hallmark render tier produced 20 before and 20 after screenshots across the landing, login, protected dashboard redirect, and invalid storefront routes. The final pass reported 0 FAIL and 0 REFLEX; remaining warnings are recorded in `.hallmark/compare.html` and the project audit.

## Deploy to Vercel

1. Create a Vercel project with this `frontend` directory as its root.
2. Set `VITE_API_URL=https://dukaanbuz-backend.vercel.app/api`.
3. Deploy. `vercel.json` provides the SPA rewrite for React Router refreshes.
4. Copy the **actual** deployed frontend origin.
5. In the **backend** Vercel project, set `CLIENT_URL` to exactly that frontend origin and redeploy the backend. The current backend CORS policy allows `http://localhost:5173`, but not arbitrary deployed origins. Verify an `OPTIONS` request with the actual Origin, `Authorization` and `Content-Type` headers.

## SMIT presentation guide

1. **React** renders the marketing website, seller dashboard, public store, and responsive forms.
2. **Axios** sends browser requests to the live Express API with a JWT Bearer token for seller-only routes.
3. **Express** receives requests and applies routes/middleware for authentication, ownership checks, uploads, and errors.
4. **JWT** identifies the seller; React route protection is only a user experience layer, while Express enforces real ownership.
5. **Mongoose** maps MongoDB documents into User, Store, and Product models, keeping each seller's store/products related through ObjectIds.
6. **Multer** accepts product images on the backend; the frontend sends `FormData` using the exact `image` field the API requires.
7. **MongoDB Atlas** persists seller, store, product, and deployed image metadata/data.

## Hallmark notes

Hallmark v2 was installed for Codex and used for a full visual redesign. The new direction uses a Pakistani retail counter as the composition, deep teal and mint as restrained brand colors, a more focused seller workspace, and a public catalog distinct from the dashboard. The marketing preview describes the actual store creation workflow without invented product records. The application uses semantic CSS tokens, visible keyboard focus and reduced-motion behavior.

See [PROJECT_AUDIT.md](PROJECT_AUDIT.md) for the verification checklist and [ASSIGNMENT_PRESENTATION.md](ASSIGNMENT_PRESENTATION.md) for the teacher demo script and technical questions.
