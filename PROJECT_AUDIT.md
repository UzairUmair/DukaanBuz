# DukaanSaz project audit — 6 November 2026

## Existing project

- `frontend/` is a React/Vite application with routes for marketing, auth, onboarding, seller administration, and public storefronts. It has no Git repository yet. Its `.env` exists and is ignored; `.env.example` points at the deployed API.
- `backend/` is a separate Git repository on `main`, tracking `origin/main` at `UzairUmair/DukaanBuz-Backend`. The backend has Express, MongoDB/Mongoose, JWT, Multer, and persistent GridFS storage in Vercel mode.
- The frontend API modules follow `backend/BACKEND_API_CONTRACT.md`. Protected backend product queries are scoped to the authenticated seller. The public API filters to one store's active products.
- Hallmark v2 project files exist under `frontend/.agents/skills/hallmark/`; global Codex installation is being verified.

## Baseline checks

- Frontend unit tests: 4 passed.
- Frontend production build: passed.
- Frontend lint: failed in `DashboardLayout.jsx` because an effect synchronously sets loading state.
- Backend test suite: 15 passed, including ownership, upload validation, Vercel GridFS, and public isolation cases.
- Hallmark static audit: 0 FAIL, 0 REFLEX, 0 WARN. Render tier and real browser review remain unverified.

## Problems and gaps

- Existing design uses a generic split marketing hero with fabricated sample merchandise and a dashboard preview; it needs the requested full composition redesign.
- Admin and storefront screens have distinct shells, but typography, form flow, product presentation and mobile density need visual review and redesign.
- `CLIENT_URL` is a single backend CORS origin with localhost as fallback; the actual frontend production origin is not configured. Production cross-origin access is unverified.
- The backend implements persistent Vercel uploads in GridFS, but deployed image persistence has not been verified.
- No frontend remote, Git history, Vercel frontend URL, or authenticated deployment configuration has been established.
- Live seller CRUD, PNG image upload and two-seller isolation passed against production using owner-provided disposable addresses. The two test products were deleted. Empty test accounts/stores remain because the API has no deletion route.

## Checklist

- [ ] Preserve route, API and handler behavior during a complete Hallmark redesign.
- [ ] Fix baseline lint failure and rerun lint, tests and build.
- [ ] Capture and compare browser screenshots; run Hallmark render checks.
- [x] Verify live API contract, CRUD, PNG upload persistence and seller isolation.
- [ ] Verify authenticated pages visually with a browser session and complete JPEG/WebP/oversized live upload cases.
- [ ] Prepare the frontend Git repository and deploy if authenticated access is available.
- [ ] Configure production CORS using the actual frontend origin; verify preflight.
- [ ] Update README and create `ASSIGNMENT_PRESENTATION.md`.
