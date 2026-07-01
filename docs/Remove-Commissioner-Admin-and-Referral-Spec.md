# Feature Spec — Remove Commissioner Admin Access + Remove Referral Program

_Created 2026-07-01. Client request relayed by Jordan. Written for hand-off to Claude Code (repo `Themahjongopen/mahjong-open-prototype`)._

## Summary of the client's request (updated 2026-07-01)
1. **Commissioner access in the admin panel:** remove it **altogether** — no commissioner presence anywhere in the admin dashboard or as an admin-access level. **Do NOT remove overall admin access** — real admins still use the admin panel.
2. **Commissioner as a player-facing label:** **keep it.** A commissioner is a normal portal user (player-only access) who carries a "Commissioner" **label/designation** shown in the player-facing portal (e.g. directory/roster). It is a title, not an access level.
3. **Admin can reassign the commissioner designation:** admins need a control **in the admin panel** to change a registrant's designation — e.g. demote a city's current commissioner back to Player and promote a different player to Commissioner (for when a city's commissioner changes partway through). See section E.
4. **Referral / referral links:** remove entirely. The client does **not** want to run a referral program.

## Important scoping note — what is NOT being touched
The public **City Commissioner Interest Form** (the "Bring the Mahjong Open to your city / Apply to lead a city" flow) is a **separate feature and stays as-is.** That covers people *applying* to lead a city. This spec only changes what a commissioner can *access inside the app* (portal only, no admin panel) and removes the referral UI. Files that stay untouched:
- `app/(marketing)/lead-a-city/page.tsx`
- `components/marketing/CommissionerSection.tsx`, `components/marketing/CommissionerForm.tsx`
- `app/api/commissioner-apply/route.ts`
- `supabase/migrations/004_commissioner_applications.sql`

## Current state (verified in the repo 2026-07-01)
The app is still in **mock/preview mode** for auth: `lib/data/auth.ts` `getDemoUser()` always returns the demo **admin** user; there is no real role-gating wired yet. So "commissioner access" today exists as **display/label content and a DB role value**, not as an enforced permission path.

### Where "commissioner" (admin sense) appears
- **`app/admin/page.tsx`**
  - Role-scoping card titled **"Admin + commissioner access"** (~line 102), rendering `consoleData.roles` — which includes a `Commissioner` row.
  - "View as player" preview copy (~line 79): _"…so admins and commissioners can check the home experience…"_
- **`lib/data/mock.ts`** → `MOCK_ADMIN_CONSOLE.roles` includes:
  `{ role: "Commissioner", detail: "One per city · city-scoped tools" }`
- **`supabase/migrations/003_launch1_registration.sql`** (~lines 18–19): profile `role` CHECK is `('player', 'admin', 'commissioner')`.

### Where "referral" appears (this is the whole footprint)
- **`app/admin/page.tsx`** — the entire "Referrals / Your referrals" card (~lines 118–141): the referral-link box + the sample referral list.
- **`lib/data/mock.ts`** → `MOCK_ADMIN_CONSOLE.referralLink` and `MOCK_ADMIN_CONSOLE.referrals`.
- No referral DB table, no `/r/...` route, no referral logic in the player portal or in any email. The `referralLink` value is a static display string only.
- (Historical note: `Commissioner-Interest-Form-Spec.md` line 73 flagged a possible "how did you hear about us / referral name" field for the interest form — never built. The client's decision here closes that open flag: no referral field.)

## Changes to make

### A. Remove the referral card (clean deletion)
1. **`app/admin/page.tsx`** — delete the "Referrals / Your referrals" card block (the second column in the `1.2fr 0.8fr` grid, ~lines 118–141). With the referral card gone, that two-column grid now has one child; either make the role-scoping card span full width or drop the grid wrapper so the role card sits on its own row. Match the existing spacing/`gap: 24` rhythm.
2. **`lib/data/mock.ts`** — remove `referralLink` and the `referrals` array from `MOCK_ADMIN_CONSOLE`. Remove any now-unused references in `app/admin/page.tsx` (`consoleData.referralLink`, `consoleData.referrals`, `consoleData.sampleLabel` if it was only used by that card — check before deleting `sampleLabel`).

### B. Remove commissioner from the admin panel (no admin access anywhere)
The intent: commissioner has **no admin-panel presence and no admin access**. Admins keep full admin access.
1. **`app/admin/page.tsx`**
   - Retitle the role card from **"Admin + commissioner access"** to **"Admin access"**.
   - Remove the `Commissioner` row from what the card renders (it comes from mock data below).
   - Update the "View as player" copy (~line 79) to drop "and commissioners": e.g. _"so admins can check the home experience without leaving the console."_
2. **`lib/data/mock.ts`** — remove the `Commissioner` entry from `MOCK_ADMIN_CONSOLE.roles`, leaving `Admin` and `Player`. (The "N roles" counter updates automatically.)
3. **Access gating (Phase 2, when real auth is wired):** gate `/admin` on `role === 'admin'` **only**. A commissioner logs in and lands on `/portal` like any player — commissioner is never an admin path.

### C. Keep "Commissioner" as a player-facing label (portal only)
Commissioner stays as a **designation/title** on a normal portal user, shown player-facing (not an access level).
- **DECIDED:** surface a subtle, on-brand **"Commissioner" badge** (no emoji) in **two** player-facing places: (1) next to the person's name in the **portal directory / roster** (directory is already Phase-2 scope per `project_specs.md`), and (2) on their **portal profile page**. Not on standings rows.
- One commissioner **per city** (existing model). The badge reflects whoever currently holds the designation for that city.

### D. Database role model
`003_launch1_registration.sql` already allows `role IN ('player','admin','commissioner')`. **Keep the `commissioner` value** — it now means "player-access user who holds the commissioner title for their city," used purely for the label + the admin reassignment control (section E), never for admin access.
- Do **not** edit the already-applied migration in place. If any schema addition is needed for section E (e.g. enforcing one-commissioner-per-city, or associating the commissioner with a specific city), add a **new forward migration**.
- Access rule to encode in Phase 2 auth: **only `role === 'admin'` reaches `/admin`;** `player` and `commissioner` are portal-only.

### E. NEW — Admin control to reassign a player's designation (Player ↔ Commissioner)
Add the ability for an admin to change a registrant's designation from the admin panel, so a city's commissioner can be swapped mid-season.
- **Where:** `app/admin/players/page.tsx`. Today this page is a **read-only** table (Player / City·Season / Status / Payment / Joined) fed by `getAdminPlayers()` — no controls exist yet. Add a **"Designation"** control per row (the person's `profiles.role`, shown as **Player** or **Commissioner**), distinct from the existing registration **Status** column (active/pending/canceled — leave that as-is). Admins themselves are not toggled here (avoid accidental self-lockout); this control switches only between Player and Commissioner.
- **Action:** an admin picks a player and sets them to Commissioner; sets the outgoing commissioner back to Player. Because it's **one commissioner per city** — **DECIDED: auto-demote.** Promoting a new commissioner **automatically demotes the city's existing commissioner** back to Player, after a **confirmation prompt** (e.g. "Make Alex Kim the Ocean Springs commissioner? This will remove the title from Morgan Park."). No hard block.
- **"One per city" enforcement — DECIDED: app-level for now.** Enforce the single-commissioner-per-city rule in the admin UI + server route logic only (find the city's current commissioner and demote them in the same operation). **No DB migration / schema change now** — the app is still in mock/preview auth, so a database-level uniqueness constraint is premature. Revisit and harden with a forward migration when Phase 2 real auth + profile data lands.
- **Backend:** a server route (service-role Supabase client, same pattern as the Admin Cities page) that updates `profiles.role`, and demotes the prior city commissioner in the same call. Guard it behind the `/admin` passcode gate like the rest of the admin panel. Write the change so a fresh portal load shows/removes the commissioner badge accordingly.
- **Mock-mode note:** until real profile data is wired, this can be built against the existing mock players so the UI/flow is reviewable, mirroring how the Cities page was staged before its Supabase wiring.
- **Effect check:** after promoting/demoting, the player-facing portal directory + profile badge (section C) reflects the new commissioner, and the demoted person reverts to a plain player.

## What "done" looks like
- Admin dashboard shows **no** referral card and **no** commissioner row; role card reads "Admin access" with Admin + Player only.
- "View as player" copy no longer mentions commissioners.
- No `referralLink` / `referrals` left in mock data or referenced in the admin page (no build/TS errors).
- Player-facing portal shows a **Commissioner badge** in the **directory + profile page** for the current commissioner of a city.
- Admin **Players** page has a working **Player ↔ Commissioner** designation control (one per city, **auto-demote** the prior commissioner on promotion with a confirm).
- Public "Apply to lead a city" interest form still works and is unchanged.
- Build passes; deploy to Vercel; visual check of `/admin`, `/admin/players`, and the portal directory + a profile in prod.

## Decisions (resolved 2026-07-01)
1. **Conflict behavior when promoting a second commissioner for a city:** **auto-demote** the existing commissioner (with a confirmation prompt). No hard block.
2. **Where the badge shows:** **portal directory + player profile page.** Not on standings rows.
3. **"One per city" enforcement:** **app-level for now** (admin UI + server route logic); **no DB migration** this round. Revisit with a forward migration at Phase 2 when real auth + profile data is wired.
