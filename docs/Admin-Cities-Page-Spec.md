# Feature Spec — Admin Cities Page (Supabase wiring + protection)

_Status: DRAFT for approval (per CLAUDE.md: define before you build)._
_Created 2026-07-01. Owner: Jordan. Implementer: Claude Code._

## Goal
Turn the mock-only `/admin/cities` page into a real management tool so the client can self-serve city changes (a core requirement — city data must be client-editable, not hard-coded), and protect the `/admin` area so only organizers can reach it.

## Current state (verified earlier)
- `app/admin/cities/page.tsx` imports `MOCK_CITIES` and mutates React `useState` with a fake `setTimeout`. "Add city" / "Deactivate" do **not** touch Supabase.
- The registration form already reads cities **live** from Supabase (`cities` table, `is_active = true`), so once this page writes to that table, changes flow straight to the dropdown.
- `cities` currently seeded: **Ocean Springs, MS** and **Meridian, MS**, both `is_active = true`.
- `/admin` protection: unconfirmed / likely open to anyone with the URL.

## Decisions locked (Jordan, 2026-07-01)
- **Admin protection:** simple **shared passcode** stored as an env var, enforced by middleware (no per-user accounts this round; Phase 2 handles real auth).
- **Launch city:** leave **both** Ocean Springs and Meridian active for now; the client can toggle Meridian off via this page whenever they decide.
- **Capabilities:** full control — **add, rename/edit, activate/deactivate, delete** — with a delete safety guard (below).

---

## Part 1 — Wire the page to Supabase

Replace the mock logic in `app/admin/cities/page.tsx` with real data operations against the `cities` table. Writes must go through the **service-role admin client on the server** (an API route or server action) — never expose service-role to the client, and don't rely on the anon key for writes.

Operations:
- **Load:** list all cities (both active and inactive) ordered sensibly (e.g., active first, then name). Show each city's name, state/region, and active status.
- **Add:** insert a new city (name + state/region, `is_active = true` by default). Trim/validate input; prevent obvious duplicates (same name+state).
- **Rename / edit:** update a city's name/state.
- **Activate / deactivate:** toggle `is_active`. Deactivating hides it from the registration dropdown without deleting anything (the safe, reversible option).
- **Delete:** permanently remove a city — **but guarded** (see below).

### Delete safety guard (important)
A city may be referenced by existing `registrations`. To avoid orphaning data:
- Before deleting, check whether any `registrations` (or other tables) reference that city.
- **If referenced:** block the hard delete and surface a clear message — "This city has registrations and can't be deleted. Deactivate it instead to hide it from the form." Offer the deactivate action.
- **If not referenced:** allow the delete, ideally behind a confirm prompt ("Delete {city}? This can't be undone.").
- (Alternative if simpler for the data model: soft-delete only. But per decision, support real delete for unused cities.)

UI: keep the existing page's look/structure; just make the actions real. Show success/error feedback and reflect changes without a full reload where reasonable. No emoji; match the app's styling.

---

## Part 2 — Protect /admin (passcode middleware)

- Add a middleware-based gate covering all `/admin` routes.
- Store the passcode in an env var (e.g. `ADMIN_PASSCODE`) set in Vercel — **not** committed to the repo.
- Flow: unauthenticated visitor to any `/admin/*` route is sent to a simple passcode entry page; on correct passcode, set a signed/HTTP-only cookie (session-length or a reasonable expiry) that grants access; wrong passcode shows an error.
- Guard the **write API/actions too**, not just the page render, so the endpoints can't be called directly without the cookie.
- Keep it simple and self-contained; this is explicitly a stopgap until Phase 2 real auth.

---

## Data / env
- No schema change expected (uses existing `cities`; the delete guard reads `registrations`). If a `state`/`region` column isn't already present and is needed, add a small migration.
- **New env var:** `ADMIN_PASSCODE` (set in Vercel Production; add to `.env.local` for local dev). This is the only new secret.

## Files for Claude Code (confirm exact paths in repo)
- `app/admin/cities/page.tsx` — replace mock logic with real load + actions.
- Server route(s)/action(s) for city writes using the service-role client (e.g. `app/api/admin/cities/route.ts`), incl. the delete guard.
- `middleware.ts` (or existing middleware) — passcode gate for `/admin/*`.
- A minimal passcode entry page (e.g. `app/admin/login/page.tsx`) + a route to verify + set the cookie.
- Reuse existing Supabase admin helper + env-guard pattern.

## Definition of done
- `/admin/cities` loads real cities from Supabase; add / rename / activate-deactivate / delete all persist to the `cities` table.
- Deactivating a city removes it from the registration dropdown; reactivating restores it. Verified against the live registration form.
- Delete is blocked (with a clear message) for cities that have registrations; allowed for unused cities behind a confirm.
- Visiting any `/admin` route without the passcode redirects to the passcode page; correct passcode grants access; the write endpoints reject unauthenticated calls.
- Both Ocean Springs and Meridian remain active after the change (no seed change).
- Verified on prod.

## Testing notes
- Test each action on prod, then confirm the registration form dropdown reflects active cities.
- Test the delete guard: try deleting a city that has a test registration (should block), and a throwaway unused city (should delete).
- Test the gate: hit `/admin/cities` in a private window (should redirect to passcode), enter wrong then right passcode.
- Clean up any throwaway test cities afterward.

## Workflow note
Once approved: `cp` into repo `docs/`, hand to Claude Code, set `ADMIN_PASSCODE` in Vercel, deploy, test.
